"use client";

import React, { useState, useEffect, useRef } from "react";
import ScoreCard, { EvaluationData } from "./ScoreCard";
import StudioSidebar from "./StudioSidebar";
import StudioVisualizer from "./StudioVisualizer";
import { TranscriptLine } from "./StudioTranscript";
import LoadingScreen from "./LoadingScreen";

interface PracticeStudioProps {
  scenario: string; 
  onQuit: () => void;
}

export default function PracticeStudio({ scenario, onQuit }: PracticeStudioProps) {
  const [scenarioTitle, ...descParts] = scenario.split(":");
  const scenarioDescription = descParts.join(":").trim() || scenario;

  const [isConnected, setIsConnected] = useState(false);
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [evaluation, setEvaluation] = useState<EvaluationData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [transcripts, setTranscripts] = useState<TranscriptLine[]>([]);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);

  const wsRef = useRef<WebSocket | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const processorRef = useRef<ScriptProcessorNode | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null); 
  const recognitionRef = useRef<any>(null); 
  
  const mixedDestRef = useRef<MediaStreamAudioDestinationNode | null>(null);
  
  const audioChunksRef = useRef<Blob[]>([]);
  const audioQueueRef = useRef<AudioBuffer[]>([]);
  const isPlayingRef = useRef(false);
  const [, setForceRender] = useState(0); 
  
  const isSttEnabledRef = useRef(false);
  const isAiTurnActiveRef = useRef(false);
  const aiAudioChunksRef = useRef<string[]>([]);
  const userTurnRecorderRef = useRef<MediaRecorder | null>(null);
  const userTurnChunksRef = useRef<Blob[]>([]);
  const pendingUserTurnIdRef = useRef<string | null>(null);

  const pauseStt = () => { if (recognitionRef.current) { try { recognitionRef.current.abort(); } catch (_) {} } };
  const resumeStt = () => { if (!isSttEnabledRef.current || isAiTurnActiveRef.current) return; try { recognitionRef.current?.start(); } catch (_) {} };

  const transcribeAiTurn = async (chunks: string[], turnId: string) => {
    if (chunks.length === 0) return;
    try {
      const res = await fetch("/api/transcribe", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ audioChunks: chunks }) });
      const data = await res.json();
      const text = data.text?.trim();
      if (text) { setTranscripts(prev => prev.map(t => t.id === turnId ? { ...t, text } : t)); }
      else { setTranscripts(prev => prev.filter(t => t.id !== turnId)); }
    } catch (_) { setTranscripts(prev => prev.filter(t => t.id !== turnId)); }
  };

  const connectToLiveAPI = async () => {
    setIsEvaluating(false); setError(null); setEvaluation(null); setTranscripts([]);
    audioChunksRef.current = []; isAiTurnActiveRef.current = false; aiAudioChunksRef.current = [];

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
            systemInstruction: { parts: [{ text: `You are participating in a realistic spoken roleplay scenario: "${scenario}". CRITICAL RULES: 1. Embody the character completely. Do not break character. 2. Respond with concise, conversational dialogue (1-3 sentences). 3. ABSOLUTELY NO INTERNAL THOUGHTS OR MONOLOGUES. 4. Your text output MUST exactly match your spoken audio word-for-word.` }] }
          }
        };
        ws.send(JSON.stringify(setupMessage));
        const kickoffMessage = { clientContent: { turns: [{ role: "user", parts: [{ text: "Hi." }] }], turnComplete: true } };
        ws.send(JSON.stringify(kickoffMessage));

        wsRef.current = ws; setIsConnected(true);
        startMicrophone(ws, audioCtx);
      };

      ws.onmessage = async (event) => {
        let textData = event.data instanceof Blob ? await event.data.text() : event.data;
        const response = JSON.parse(textData);
        if (response.error) { setError(response.error.message); disconnect(); return; }

        if (response.serverContent?.modelTurn?.parts) {
          for (const part of response.serverContent.modelTurn.parts) {
            if (part.inlineData?.data) {
              aiAudioChunksRef.current.push(part.inlineData.data);
              if (!isAiTurnActiveRef.current) {
                isAiTurnActiveRef.current = true;
                pauseStt(); 
                if (userTurnRecorderRef.current?.state === 'recording') {
                  const turnId = "user-" + Date.now().toString();
                  pendingUserTurnIdRef.current = turnId;
                  setTranscripts(prev => {
                    let next = prev.some(t => t.id === 'interim-user') ? prev.map(t => t.id === 'interim-user' ? { id: turnId, role: 'user', text: '', isTranscribing: true } as TranscriptLine : t) : [...prev, { id: turnId, role: 'user', text: '', isTranscribing: true } as TranscriptLine];
                    return [...next.filter(t => t.id !== 'current-ai'), { id: 'current-ai', role: 'partner', text: '🔊 Speaking...' } as TranscriptLine];
                  });
                  userTurnRecorderRef.current.stop();
                } else {
                  setTranscripts(prev => [...prev.filter(t => t.id !== 'current-ai'), { id: 'current-ai', role: 'partner', text: '🔊 Speaking...' } as TranscriptLine]);
                }
              }
              queueAudioPlayback(part.inlineData.data);
            }
          }
        }

        if (response.serverContent?.turnComplete) {
          isAiTurnActiveRef.current = false;
          const chunks = [...aiAudioChunksRef.current]; aiAudioChunksRef.current = []; 
          const turnId = "ai-" + Date.now().toString();
          setTranscripts(prev => prev.map(t => t.id === 'current-ai' ? { ...t, id: turnId } : t));
          transcribeAiTurn(chunks, turnId);
          resumeStt(); 
          userTurnChunksRef.current = [];
          if (userTurnRecorderRef.current?.state === 'inactive') userTurnRecorderRef.current.start(200);
        }
      };

      ws.onerror = () => { setError("Connection dropped."); disconnect(); };
      ws.onclose = () => disconnect();

    } catch (err: any) { setError(err.message); }
  };

  const startMicrophone = async (ws: WebSocket, audioCtx: AudioContext) => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      const mixedDest = audioCtx.createMediaStreamDestination();
      mixedDestRef.current = mixedDest;

      const source = audioCtx.createMediaStreamSource(stream);
      source.connect(mixedDest);

      const processor = audioCtx.createScriptProcessor(4096, 1, 1);
      processorRef.current = processor;
      
      processor.onaudioprocess = (e) => {
        if (ws.readyState === WebSocket.OPEN && !isPlayingRef.current) {
          const inputData = e.inputBuffer.getChannelData(0);
          const pcm16 = new Int16Array(inputData.length);
          for (let i = 0; i < inputData.length; i++) {
            let s = Math.max(-1, Math.min(1, inputData[i]));
            pcm16[i] = s < 0 ? s * 0x8000 : s * 0x7FFF;
          }
          let binary = ''; const bytes = new Uint8Array(pcm16.buffer);
          for (let i = 0; i < bytes.byteLength; i++) binary += String.fromCharCode(bytes[i]);
          ws.send(JSON.stringify({ realtimeInput: { mediaChunks: [{ mimeType: "audio/pcm;rate=16000", data: btoa(binary) }] } }));
        }
      };
      
      const silentGain = audioCtx.createGain();
      silentGain.gain.value = 0;
      source.connect(processor);
      processor.connect(silentGain);
      silentGain.connect(audioCtx.destination);

      const mediaRecorder = new MediaRecorder(mixedDest.stream);
      mediaRecorder.ondataavailable = (e) => { if (e.data.size > 0) audioChunksRef.current.push(e.data); };
      mediaRecorder.start(1000);
      mediaRecorderRef.current = mediaRecorder;

      const userRecorder = new MediaRecorder(stream);
      userRecorder.ondataavailable = (e) => { if (e.data.size > 0) userTurnChunksRef.current.push(e.data); };
      userRecorder.onstop = async () => {
        const blob = new Blob(userTurnChunksRef.current, { type: 'audio/webm' });
        const targetId = pendingUserTurnIdRef.current; pendingUserTurnIdRef.current = null;
        if (blob.size < 1000) { if (targetId) setTranscripts(prev => prev.filter(t => t.id !== targetId)); return; }
        const formData = new FormData(); formData.append("file", blob);
        try {
          const res = await fetch('/api/transcribe-user', { method: 'POST', body: formData });
          const data = await res.json();
          if (data.text) {
             setTranscripts(prev => targetId ? prev.map(t => t.id === targetId ? { ...t, text: data.text, isTranscribing: false } : t) : [...prev.filter(t => t.id !== 'interim-user'), { id: Date.now().toString(), role: "user", text: data.text } as TranscriptLine]);
          } else if (targetId) setTranscripts(prev => prev.filter(t => t.id !== targetId));
        } catch (e) { if (targetId) setTranscripts(prev => prev.filter(t => t.id !== targetId)); }
      };
      userTurnRecorderRef.current = userRecorder;

      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        const rec = new SpeechRecognition(); rec.continuous = true; rec.interimResults = true;
        rec.onresult = (e: any) => {
          if (isPlayingRef.current) return;
          let full = ""; for (let i = 0; i < e.results.length; ++i) full += e.results[i][0].transcript;
          if (full.trim()) setTranscripts(prev => [...prev.filter(t => t.id !== 'interim-user'), { id: 'interim-user', role: "user", text: full.trim() + "...", isInterim: true } as TranscriptLine]);
        };
        rec.onend = () => { if (isSttEnabledRef.current && !isAiTurnActiveRef.current) setTimeout(() => rec.start(), 300); };
        isSttEnabledRef.current = true; rec.start(); recognitionRef.current = rec;
      }
    } catch (err) { setError("Mic access required."); disconnect(); }
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
    isPlayingRef.current = true; setForceRender(v => v + 1);
    
    const buffer = audioQueueRef.current.shift()!;
    const source = audioContextRef.current.createBufferSource();
    source.buffer = buffer; 
    
    source.connect(audioContextRef.current.destination);
    if (mixedDestRef.current) {
        source.connect(mixedDestRef.current);
    }
    
    source.onended = () => { isPlayingRef.current = false; setForceRender(v => v + 1); playNextInQueue(); };
    source.start();
  };

  const endSessionAndEvaluate = () => {
    setIsEvaluating(true);
    if (mediaRecorderRef.current?.state !== "inactive") {
      mediaRecorderRef.current!.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        
        const url = URL.createObjectURL(audioBlob);
        setAudioUrl(url);

        const reader = new FileReader();
        reader.readAsDataURL(audioBlob);
        reader.onloadend = async () => {
          const base64Audio = (reader.result as string).split(',')[1];
          const mimeType = audioBlob.type.split(';')[0]; 
          disconnect(); 
          try {
            const res = await fetch("/api/evaluate", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ audioBase64: base64Audio, mimeType, scenario }) });
            setEvaluation(await res.json());
          } catch (err) { setError("Evaluation failed."); }
          finally { setIsEvaluating(false); }
        };
      };
      mediaRecorderRef.current!.stop();
    } else { disconnect(); setIsEvaluating(false); }
  };

  const disconnect = () => {
    isSttEnabledRef.current = false; isAiTurnActiveRef.current = false;
    if (recognitionRef.current) recognitionRef.current.abort();
    if (mediaRecorderRef.current?.state !== "inactive") mediaRecorderRef.current?.stop();
    if (userTurnRecorderRef.current?.state !== "inactive") userTurnRecorderRef.current?.stop();
    if (processorRef.current) processorRef.current.disconnect();
    if (streamRef.current) streamRef.current.getTracks().forEach(t => t.stop());
    
    // THE FIX: Check if the AudioContext is already closed before trying to close it!
    if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
      audioContextRef.current.close().catch(console.error);
    }
    
    if (wsRef.current) wsRef.current.close();
    audioQueueRef.current = []; isPlayingRef.current = false; setIsConnected(false);
  };

  useEffect(() => { return () => disconnect(); }, []);

  const handlePracticeAgain = () => { setEvaluation(null); setIsEvaluating(false); setTranscripts([]); };

  return (
    <div className="flex flex-1 pt-[72px] w-full bg-background overflow-x-hidden">
      <StudioSidebar transcripts={transcripts} isConnected={isConnected} isAiSpeaking={isPlayingRef.current} onQuit={onQuit} />

      <main className="flex-1 xl:ml-80 flex flex-col items-center overflow-y-auto w-full">
        {isEvaluating ? (
          <LoadingScreen /> 
        ) : evaluation ? (
          <ScoreCard evaluation={evaluation} transcripts={transcripts} audioUrl={audioUrl} onReset={onQuit} onPracticeAgain={handlePracticeAgain} />
        ) : (
          <div className="w-full max-w-2xl flex flex-col items-center mx-auto pb-24 py-12 px-6">
            <div className="w-full flex justify-between items-center mb-16 animate-fade-in-up">
               <div className="flex items-center gap-4 bg-surface-container-lowest/80 backdrop-blur-xl rounded-[2rem] p-5 shadow-sm border border-outline-variant/10 w-full">
                 <div className="w-14 h-14 rounded-full bg-primary-container flex items-center justify-center flex-shrink-0 text-on-primary-container">
                    <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>record_voice_over</span>
                 </div>
                 <div>
                    <span className="text-[10px] uppercase tracking-[0.15em] text-secondary font-bold mb-1 block">Active Practice</span>
                    <h1 className="text-xl font-bold text-on-surface mb-1">{scenarioTitle}</h1>
                    <p className="text-on-surface-variant text-sm line-clamp-2">{scenarioDescription}</p>
                 </div>
               </div>
            </div>

            <StudioVisualizer isConnected={isConnected} isEvaluating={isEvaluating} isAiSpeaking={isPlayingRef.current} stream={streamRef.current} onConnect={connectToLiveAPI} onEndSession={endSessionAndEvaluate} />

            <div className="mt-12 text-center space-y-3 min-h-[60px] flex flex-col items-center">
              {error && <p className="text-error font-bold text-sm bg-error-container/20 px-4 py-2 rounded-full inline-block">{error}</p>}
              {isConnected && !isEvaluating && (
                <div className="flex flex-col items-center gap-3">
                  <div className="flex items-center gap-2 text-primary font-bold text-sm">
                    {isPlayingRef.current ? <span>🔊 Partner is speaking...</span> : <span className="flex items-center gap-2"><span className="w-2 h-2 bg-primary rounded-full animate-ping"></span>Partner is listening...</span>}
                  </div>
                  {!isPlayingRef.current && <p className="text-on-surface-variant text-lg italic animate-fade-in-up">"Take a deep breath. Speak when you're ready."</p>}
                </div>
              )}
            </div>

            {isConnected && (
              <div className="mt-10 animate-fade-in-up">
                <button onClick={endSessionAndEvaluate} disabled={isEvaluating} className="bg-primary text-on-primary px-10 py-5 rounded-full font-bold shadow-xl hover:shadow-2xl hover:scale-[1.02] transition-all flex items-center gap-3 disabled:opacity-50">
                  <span className="material-symbols-outlined text-xl">check_circle</span>
                  <span>End Session & Reflect</span>
                </button>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}