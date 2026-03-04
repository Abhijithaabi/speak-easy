"use client";

/**
 * @file components/ActiveChat.tsx
 * @description Orchestrates the active conversation with audio overlap prevention and regex cleaning.
 */

import React, { useState, useRef } from "react";
import ChatBox, { Message } from "./ChatBox";
import MessageInput from "./MessageInput";
import ScoreCard, { EvaluationData } from "./ScoreCard";

interface ActiveChatProps {
  scenario: string;
  onQuit: () => void;
}

export default function ActiveChat({ scenario, onQuit }: ActiveChatProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isAiSpeaking, setIsAiSpeaking] = useState(false);
  const [evaluation, setEvaluation] = useState<EvaluationData | null>(null);
  const [isEvaluating, setIsEvaluating] = useState(false);
  
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const playRealisticAudio = async (text: string) => {
    // Immediately halt any currently playing audio to prevent overlap
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }

    setIsAiSpeaking(true);
    try {
      const response = await fetch("/api/tts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });

      if (!response.ok) {
        setIsAiSpeaking(false);
        return; 
      }

      const blob = await response.blob();
      const audioUrl = URL.createObjectURL(blob);
      const audio = new Audio(audioUrl);
      audioRef.current = audio;
      
      audio.onended = () => {
        setIsAiSpeaking(false);
        URL.revokeObjectURL(audioUrl);
      };
      
      await audio.play();
    } catch (error) {
      console.error("[ActiveChat] Audio error:", error);
      setIsAiSpeaking(false); 
    }
  };

  const handleSendMessage = async (text: string) => {
    // Hard block to prevent double submissions if spamming the button
    if (isLoading || isAiSpeaking || isEvaluating) return;

    const newUserMessage: Message = { role: "user", content: text };
    const updatedMessages = [...messages, newUserMessage];
    
    setMessages(updatedMessages);
    setIsLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: updatedMessages, scenario }),
      });
      
      const data = await response.json();
      
      if (response.ok && data.reply) {
        // Fallback Regex: Strip out any remaining (text) or [text] the LLM snuck in
        const cleanReply = data.reply.replace(/ *\([^)]*\) */g, "").replace(/ *\[[^\]]*\] */g, "").trim();

        setMessages((prev) => [...prev, { role: "model", content: cleanReply }]);
        setIsLoading(false);
        await playRealisticAudio(cleanReply);
      } else {
        setIsLoading(false);
      }
    } catch (error) {
      console.error("[ActiveChat] Network error:", error);
      setIsLoading(false);
    }
  };

  const handleEndScenario = async () => {
    if (messages.length === 0 || isLoading || isAiSpeaking) return;
    setIsEvaluating(true);
    
    if (audioRef.current) { 
      audioRef.current.pause(); 
      setIsAiSpeaking(false); 
    }

    try {
      const response = await fetch("/api/evaluate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages, scenario }),
      });
      const data = await response.json();
      if (response.ok) setEvaluation(data);
    } catch (error) {
      console.error("[ActiveChat] Evaluation Network Error:", error);
    } finally {
      setIsEvaluating(false);
    }
  };

  const handleQuit = () => {
    if (audioRef.current) audioRef.current.pause(); 
    onQuit();
  };

  return (
    <main className="flex-1 flex flex-col bg-gray-950 p-2 md:p-6 font-sans">
      <div className="flex-1 flex flex-col max-w-3xl w-full mx-auto bg-gray-900 p-3 md:p-8 rounded-2xl md:rounded-3xl shadow-2xl border border-gray-800 min-h-0">
        
        {/* Adjusted header gaps and text sizes for mobile */}
        <header className="mb-4 md:mb-6 flex justify-between items-start gap-2 md:gap-4">
          <div className="flex-1 min-w-0">
            <h1 className="text-lg md:text-xl font-bold text-white mb-2 truncate">Current Scenario</h1>
            <div className="bg-gray-800/80 p-2 md:p-3 rounded-lg md:rounded-xl border border-gray-700/50">
              <p className="text-xs md:text-sm text-gray-300 leading-relaxed line-clamp-2 md:line-clamp-none">
                {scenario}
              </p>
            </div>
          </div>
          
          <button 
            onClick={handleQuit} 
            className="flex items-center gap-1 md:gap-2 text-xs md:text-sm text-gray-300 bg-gray-800 hover:bg-red-950 hover:text-red-400 border border-gray-700 px-3 py-2 md:px-4 md:py-3 rounded-lg md:rounded-xl transition-all font-bold tracking-wide flex-shrink-0"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 14 4 9l5-5"/><path d="M4 9h10.5a5.5 5.5 0 0 1 5.5 5.5a5.5 5.5 0 0 1-5.5 5.5H11"/></svg>
            <span className="hidden sm:inline">Quit Scenario</span>
            <span className="sm:hidden">Quit</span>
          </button>
        </header>

        <ChatBox messages={messages} />

        <div className="min-h-[24px] mb-2">
          {isLoading && <p className="text-xs md:text-sm text-lime-400/80 italic flex items-center gap-2"><span className="animate-pulse">●</span> Persona is thinking...</p>}
          {isAiSpeaking && <p className="text-xs md:text-sm text-lime-500 italic flex items-center gap-2">🔊 Persona is speaking...</p>}
          {isEvaluating && <p className="text-xs md:text-sm text-lime-400/80 italic flex items-center gap-2"><span className="animate-pulse">●</span> Coach is compiling feedback...</p>}
        </div>

        {!evaluation ? (
          <div className="mt-auto">
            <MessageInput 
              onSendMessage={handleSendMessage} 
              disabled={isLoading || isEvaluating}
              isAiSpeaking={isAiSpeaking}
            />
            
            {messages.length > 0 && !isLoading && !isEvaluating && !isAiSpeaking && (
               <div className="mt-3 flex justify-end">
               <button
                 onClick={handleEndScenario}
                 className="text-xs md:text-sm text-red-400 hover:text-red-300 font-bold border border-red-900/30 bg-red-950/20 px-4 py-2 md:px-6 md:py-3 rounded-full transition-colors"
               >
                 End Scenario & Get Feedback
               </button>
             </div>
            )}
          </div>
        ) : (
          <ScoreCard evaluation={evaluation} onReset={handleQuit} />
        )}
      </div>
    </main>
  );
}