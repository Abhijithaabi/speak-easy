import React from "react";
import StudioTranscript, { TranscriptLine } from "./StudioTranscript";

interface StudioSidebarProps {
  transcripts: TranscriptLine[];
  isConnected: boolean;
  isAiSpeaking: boolean;
  onQuit: () => void;
}

export default function StudioSidebar({ transcripts, isConnected, isAiSpeaking, onQuit }: StudioSidebarProps) {
  return (
    <aside className="hidden xl:flex fixed left-0 top-[72px] h-[calc(100vh-72px)] w-80 flex-col p-6 space-y-2 bg-[#faf9f6] border-r border-outline-variant/20 z-10">
      <nav className="flex flex-col flex-1 min-h-0 space-y-2">
        
        <button className="flex items-center gap-4 p-4 text-primary font-bold bg-white rounded-xl shadow-sm border border-outline-variant/5 w-full text-left">
          <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>settings_voice</span>
          <span className="font-medium">Practice Studio</span>
        </button>
        
        <button onClick={onQuit} className="flex items-center gap-4 p-4 text-stone-500 hover:bg-stone-50 hover:text-error rounded-xl transition-all w-full text-left">
          <span className="material-symbols-outlined">exit_to_app</span>
          <span className="font-medium">Exit Scenario</span>
        </button>
        
        <StudioTranscript 
          transcripts={transcripts} 
          isConnected={isConnected} 
          isAiSpeaking={isAiSpeaking} 
        />
        
      </nav>
    </aside>
  );
}