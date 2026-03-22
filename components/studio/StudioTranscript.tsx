import React, { useEffect, useRef } from "react";

export interface TranscriptLine {
  id: string;
  role: "user" | "partner";
  text: string;
  isInterim?: boolean;
  isTranscribing?: boolean; // FIX: Added this back!
}

interface StudioTranscriptProps {
  transcripts: TranscriptLine[];
  isConnected: boolean;
  isAiSpeaking: boolean;
}

export default function StudioTranscript({ transcripts, isConnected, isAiSpeaking }: StudioTranscriptProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [transcripts, isAiSpeaking]);

  return (
    <div className="bg-white/50 rounded-xl border border-outline-variant/10 p-4 flex flex-col flex-1 min-h-0 mt-6 shadow-sm">
      <p className="text-[11px] font-bold text-secondary-dim mb-4 uppercase tracking-widest flex-shrink-0">Live Transcript</p>
      
      <div ref={containerRef} className="flex-1 overflow-y-auto custom-scrollbar space-y-5 pr-2">
        {transcripts.length === 0 && !isConnected && (
          <p className="text-sm text-on-surface-variant italic">Connect to start transcribing...</p>
        )}
        
        {transcripts.map((msg, i) => (
          <div key={i} className="space-y-1.5 animate-fade-in-up">
            <p className={`text-[10px] font-bold italic ${msg.role === 'partner' ? 'text-primary' : 'text-secondary-dim'}`}>
              {msg.role === 'partner' ? 'Partner' : 'You'}
            </p>
            
            {/* FIX: Re-added the beautiful Transcribing spinner UI */}
            {msg.isTranscribing ? (
              <div className="flex items-center gap-2 text-primary/60 italic bg-primary/5 w-fit px-3 py-1.5 rounded-lg border border-primary/10">
                <span className="material-symbols-outlined text-[16px] animate-spin">autorenew</span>
                <span className="text-xs font-semibold tracking-wide">Transcribing...</span>
              </div>
            ) : (
              <p className={`text-sm leading-relaxed ${msg.isInterim ? 'text-on-surface-variant/50' : 'text-on-surface-variant'}`}>
                {msg.text}
              </p>
            )}
          </div>
        ))}
        
        {isConnected && isAiSpeaking && (
          <div className="h-4 animate-pulse bg-primary/10 w-1/2 rounded-full mt-4 flex-shrink-0"></div>
        )}
      </div>
    </div>
  );
}