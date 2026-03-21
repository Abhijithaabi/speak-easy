"use client";

import React, { useState, useEffect, useRef } from "react";
import ScoreCard, { EvaluationData } from "./ScoreCard";

interface LiveVoiceChatProps {
  scenario: string;
  onQuit: () => void;
}

export default function LiveVoiceChat({ scenario, onQuit }: LiveVoiceChatProps) {
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [evaluation, setEvaluation] = useState<EvaluationData | null>(null);
  const [error, setError] = useState<string | null>(null);

  const wsRef = useRef<WebSocket | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const processorRef = useRef<ScriptProcessorNode | null>(null);

  // NEW: MediaRecorder to capture the user's actual voice for evaluation
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  const audioQueueRef = useRef<AudioBuffer[]>([]);
  const isPlayingRef = useRef(false);

  const connectToLiveAPI = async () => {
    setIsConnecting(true);
    setError(null);
    setEvaluation(null);
    audioChunksRef.current = []; // Clear previous recordings

    try {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      const audioCtx = new AudioContextClass({ sampleRate: 16000 });
      await audioCtx.resume(); 
      audioContextRef.current = audioCtx;

      const res = await fetch("/api/ws-auth");
      const authData = await res.json();
      
      if (!res.ok) throw new Error(authData.error || "Failed to fetch auth data");

      const wsUrl = `wss://generativelanguage.googleapis.com/ws/google.ai.generativelanguage.v1alpha.GenerativeService.BidiGenerateContent?key=${authData.apiKey}`;
      const ws = new WebSocket(wsUrl);

      ws.onopen = () => {
        const setupMessage = {
          setup: {
            model: authData.model,
            generationConfig: { responseModalities: ["AUDIO"] },
            systemInstruction: {
              parts: [{ text: `You are playing a role in the following scenario: "${scenario}". Fully embody the opposing character. Be realistic, push back, and do not immediately agree. Keep your responses concise (1-3 sentences).` }]
            }
          }
        };
        ws.send(JSON.stringify(setupMessage));
        
        const kickoffMessage = {
          clientContent: {
            turns: [{ role: "user", parts: [{ text: "I am ready. Please start the scenario and greet me in character." }] }],
            turnComplete: true
          }
        };
        ws.send(JSON.stringify(kickoffMessage));

        wsRef.current = ws;
        setIsConnected(true);
        setIsConnecting(false);
        startMicrophone(ws, audioCtx);
      };

      ws.onmessage = async (event) => {
        let textData = event.data instanceof Blob ? await event.data.text() : event.data;
        const response = JSON.parse(textData);

        if (response.error) {
           setError(`API Error: ${response.error.message}`);
           disconnect();
           return;
        }

        if (response.serverContent?.modelTurn?.parts) {
          for (const part of response.serverContent.modelTurn.parts) {
            if (part.inlineData && part.inlineData.data) {
              queueAudioPlayback(part.inlineData.data);
            }
          }
        }
      };

      ws.onerror = () => { setError("Network connection dropped."); disconnect(); };
      ws.onclose = (e) => {
        if (e.code !== 1000 && e.code !== 1005 && !error) setError(`Connection closed by server (${e.code})`);
        disconnect();
      };

    } catch (err: any) {
      setError(err.message);
      setIsConnecting(false);
    }
  };

  const startMicrophone = async (ws: WebSocket, audioCtx: AudioContext) => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      // 1. WebSocket Streaming Engine (for live interaction)
      const source = audioCtx.createMediaStreamSource(stream);
      const processor = audioCtx.createScriptProcessor(4096, 1, 1);
      processorRef.current = processor;
      const silentGain = audioCtx.createGain();
      silentGain.gain.value = 0;

      processor.onaudioprocess = (e) => {
        if (ws.readyState === WebSocket.OPEN && !isPlayingRef.current) {
          const inputData = e.inputBuffer.getChannelData(0);
          const pcm16 = new Int16Array(inputData.length);
          for (let i = 0; i < inputData.length; i++) {
            let s = Math.max(-1, Math.min(1, inputData[i]));
            pcm16[i] = s < 0 ? s * 0x8000 : s * 0x7FFF;
          }
          let binary = '';
          const bytes = new Uint8Array(pcm16.buffer);
          for (let i = 0; i < bytes.byteLength; i++) { binary += String.fromCharCode(bytes[i]); }
          ws.send(JSON.stringify({ realtimeInput: { mediaChunks: [{ mimeType: "audio/pcm;rate=16000", data: btoa(binary) }] } }));
        }
      };

      source.connect(processor);
      processor.connect(silentGain);
      silentGain.connect(audioCtx.destination);

      // 2. Audio Recorder Engine (for final tone evaluation)
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) audioChunksRef.current.push(e.data);
      };
      mediaRecorder.start(1000); // Collect chunks every second
      mediaRecorderRef.current = mediaRecorder;

    } catch (err) {
      setError("Microphone access is required.");
      disconnect();
    }
  };

  const queueAudioPlayback = (base64Data: string) => {
    if (!audioContextRef.current) return;
    const binaryStr = atob(base64Data);
    const pcm16 = new Int16Array(binaryStr.length / 2);
    for (let i = 0; i < binaryStr.length; i += 2) pcm16[i / 2] = binaryStr.charCodeAt(i) | (binaryStr.charCodeAt(i + 1) << 8);
    const float32 = new Float32Array(pcm16.length);
    for (let i = 0; i < pcm16.length; i++) float32[i] = pcm16[i] / 32768.0;
    
    const audioBuffer = audioContextRef.current.createBuffer(1, float32.length, 24000);
    audioBuffer.getChannelData(0).set(float32);
    audioQueueRef.current.push(audioBuffer);
    playNextInQueue();
  };

  const playNextInQueue = () => {
    if (isPlayingRef.current || audioQueueRef.current.length === 0 || !audioContextRef.current) return;
    isPlayingRef.current = true;
    const buffer = audioQueueRef.current.shift()!;
    const source = audioContextRef.current.createBufferSource();
    source.buffer = buffer;
    source.connect(audioContextRef.current.destination);
    source.onended = () => { isPlayingRef.current = false; playNextInQueue(); };
    source.start();
  };

  const endScenarioAndEvaluate = () => {
    setIsEvaluating(true);

    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
      // When the recorder stops, we package the audio blob and send it to our backend
      mediaRecorderRef.current.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: mediaRecorderRef.current?.mimeType || 'audio/webm' });
        const reader = new FileReader();
        
        reader.readAsDataURL(audioBlob);
        reader.onloadend = async () => {
          const base64Audio = (reader.result as string).split(',')[1];
          const mimeType = audioBlob.type.split(';')[0]; // Clean the mime type for the API

          disconnect(); // Safely close the active session
          
          try {
            const response = await fetch("/api/evaluate", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ audioBase64: base64Audio, mimeType, scenario }),
            });
            const data = await response.json();
            setEvaluation(data);
          } catch (err) {
            console.error(err);
            setError("Failed to fetch evaluation from the Coach.");
          } finally {
            setIsEvaluating(false);
          }
        };
      };
      mediaRecorderRef.current.stop();
    } else {
      disconnect();
      setIsEvaluating(false);
    }
  };

  const disconnect = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
      mediaRecorderRef.current.stop();
    }
    if (processorRef.current) { processorRef.current.disconnect(); processorRef.current = null; }
    if (streamRef.current) { streamRef.current.getTracks().forEach(track => track.stop()); streamRef.current = null; }
    if (audioContextRef.current) { audioContextRef.current.close(); audioContextRef.current = null; }
    if (wsRef.current) { wsRef.current.close(1000); wsRef.current = null; }
    audioQueueRef.current = [];
    isPlayingRef.current = false;
    setIsConnected(false);
    setIsConnecting(false);
  };

  useEffect(() => { return () => disconnect(); }, []);

  return (
    <div className="flex-1 flex flex-col bg-gray-950 p-4 md:p-6 font-sans">
      <div className="max-w-3xl w-full mx-auto bg-gray-900 p-6 md:p-10 rounded-3xl shadow-2xl border border-gray-800 flex flex-col items-center justify-center text-center min-h-0">
        
        <header className="w-full flex justify-between items-start mb-8">
            <h1 className="text-xl md:text-2xl font-bold text-white text-left">Live Simulation</h1>
            <button onClick={onQuit} className="text-xs font-bold text-gray-500 hover:text-red-400 uppercase tracking-wider py-2">
            Force Quit
            </button>
        </header>

        <p className="text-gray-400 mb-10 max-w-lg">{scenario}</p>

        {!evaluation ? (
            <>
                <div className="relative mb-12">
                {isConnected && !isEvaluating && (
                    <div className="absolute inset-0 bg-lime-500 rounded-full blur-xl opacity-30 animate-pulse"></div>
                )}
                {isEvaluating && (
                    <div className="absolute inset-0 bg-cyan-500 rounded-full blur-xl opacity-30 animate-pulse"></div>
                )}
                <button
                    onClick={isConnected ? endScenarioAndEvaluate : connectToLiveAPI}
                    disabled={isConnecting || isEvaluating}
                    className={`relative z-10 w-32 h-32 rounded-full flex items-center justify-center transition-all duration-300 shadow-xl ${
                    isConnected 
                        ? isEvaluating 
                            ? "bg-gray-800 border-4 border-cyan-500 text-cyan-400" 
                            : "bg-gray-800 border-4 border-lime-500 text-lime-400 hover:bg-red-950 hover:border-red-500 hover:text-red-400" 
                        : "bg-gradient-to-br from-lime-400 to-green-500 text-gray-900 hover:scale-105"
                    }`}
                >
                    {isConnecting ? (
                    <span className="font-bold uppercase tracking-widest text-sm">Connecting...</span>
                    ) : isEvaluating ? (
                        <div className="flex flex-col items-center">
                        <span className="animate-spin text-2xl mb-2">⚙️</span>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-center px-2">Analyzing Voice...</span>
                    </div>
                    ) : isConnected ? (
                    <div className="flex flex-col items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect></svg>
                        <span className="mt-2 text-xs font-bold uppercase tracking-wider">End Scenario</span>
                    </div>
                    ) : (
                    <div className="flex flex-col items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"></path><path d="M19 10v2a7 7 0 0 1-14 0v-2"></path><line x1="12" y1="19" x2="12" y2="22"></line></svg>
                        <span className="mt-2 text-xs font-extrabold uppercase tracking-wider">Start Speaking</span>
                    </div>
                    )}
                </button>
                </div>

                <div className="min-h-[24px] mb-4">
                {isConnected && !isEvaluating && isPlayingRef.current && (
                    <p className="text-sm text-lime-400 animate-pulse flex items-center justify-center gap-2">
                    🔊 Persona is speaking...
                    </p>
                )}
                {isConnected && !isEvaluating && !isPlayingRef.current && (
                    <p className="text-sm text-gray-400 flex items-center justify-center gap-2">
                    Listening... (Speak naturally)
                    </p>
                )}
                </div>

                {error && (
                <div className="mt-4 w-full p-4 bg-red-950/30 border border-red-900 rounded-xl text-red-400 text-sm">
                    {error}
                </div>
                )}
            </>
        ) : (
            <div className="w-full text-left animate-in fade-in zoom-in duration-300">
                <ScoreCard evaluation={evaluation} onReset={onQuit} />
            </div>
        )}

      </div>
    </div>
  );
}