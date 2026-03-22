import React, { useEffect, useRef, useState } from "react";

interface StudioVisualizerProps {
  isConnected: boolean;
  isEvaluating: boolean;
  isAiSpeaking: boolean;
  stream: MediaStream | null;
  onConnect: () => void;
  onEndSession: () => void;
}

export default function StudioVisualizer({ isConnected, isEvaluating, isAiSpeaking, stream, onConnect, onEndSession }: StudioVisualizerProps) {
  const [userVolume, setUserVolume] = useState(0);
  const requestRef = useRef<number | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);

  // ANIMATION FIX: Tap into the raw microphone stream to measure decibel volume
  useEffect(() => {
    if (!stream || isAiSpeaking) {
      setUserVolume(0);
      return;
    }

    const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
    const analyser = audioCtx.createAnalyser();
    analyser.fftSize = 256;
    
    const source = audioCtx.createMediaStreamSource(stream);
    source.connect(analyser);
    analyserRef.current = analyser;

    const dataArray = new Uint8Array(analyser.frequencyBinCount);

    const updateVolume = () => {
      if (analyserRef.current) {
        analyserRef.current.getByteFrequencyData(dataArray);
        let sum = 0;
        for (let i = 0; i < dataArray.length; i++) { sum += dataArray[i]; }
        setUserVolume(sum / dataArray.length); // Average volume
      }
      requestRef.current = requestAnimationFrame(updateVolume);
    };

    updateVolume();

    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
      source.disconnect();
      analyser.disconnect();
      audioCtx.close();
    };
  }, [stream, isAiSpeaking]);

  // Scale the orb dynamically based on user's physical voice volume
  const dynamicScale = isConnected && !isAiSpeaking ? 1 + Math.min(userVolume / 200, 0.15) : 1;

  return (
    <div className="relative flex flex-col items-center justify-center py-12 w-full animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
      
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        {isConnected && <div className="w-[380px] h-[380px] rounded-full border-2 border-primary-container/30 opacity-40 scale-110 animate-ping" style={{ animationDuration: '3s' }}></div>}
      </div>

      <button 
        onClick={isConnected ? onEndSession : onConnect}
        disabled={isEvaluating}
        style={{ transform: `scale(${dynamicScale})` }}
        className={`relative w-72 h-72 md:w-80 md:h-80 rounded-full flex items-center justify-center shadow-2xl transition-transform duration-75 ${
          isConnected 
            ? "bg-gradient-to-br from-primary to-primary-dim breathing-glow" 
            : "bg-surface-container-lowest border-4 border-primary/20 hover:border-primary/40 hover:scale-105"
        }`}
      >
        <div className="absolute inset-4 rounded-full border-4 border-white/10 pointer-events-none"></div>
        
        {!isConnected ? (
          <div className="flex flex-col items-center">
            <span className="material-symbols-outlined text-primary text-5xl mb-2">mic</span>
            <span className="text-primary font-bold tracking-widest uppercase text-sm">Start Practice</span>
          </div>
        ) : isEvaluating ? (
           <div className="flex flex-col items-center text-white">
            <span className="material-symbols-outlined animate-spin text-4xl mb-2">autorenew</span>
            <span className="text-xs font-bold tracking-widest uppercase">Reflecting...</span>
          </div>
        ) : isAiSpeaking ? (
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-12 bg-white/40 rounded-full animate-[bounce_1s_infinite]"></div>
            <div className="w-2 h-20 bg-white/60 rounded-full animate-[bounce_0.8s_infinite]"></div>
            <div className="w-2 h-36 bg-white rounded-full animate-[bounce_0.6s_infinite] shadow-[0_0_15px_rgba(255,255,255,0.8)]"></div>
            <div className="w-2 h-24 bg-white/60 rounded-full animate-[bounce_0.9s_infinite]"></div>
            <div className="w-2 h-16 bg-white/40 rounded-full animate-[bounce_1.2s_infinite]"></div>
          </div>
        ) : (
          <div className="flex flex-col items-center text-white/80">
             <span className="material-symbols-outlined text-4xl mb-2 opacity-50">hearing</span>
             <span className="text-[10px] font-bold tracking-widest uppercase opacity-80">Listening</span>
          </div>
        )}
      </button>
    </div>
  );
}