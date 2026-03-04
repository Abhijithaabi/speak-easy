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
    <main className="min-h-screen bg-gray-100 py-10 px-4 font-sans">
      <div className="max-w-2xl mx-auto bg-white p-6 rounded-xl shadow-md border border-gray-200">
        <header className="mb-6 flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-1">Active Scenario</h1>
            <p className="text-sm text-gray-600 bg-gray-50 p-2 rounded border border-gray-100 mt-2">
              {scenario}
            </p>
          </div>
          <button onClick={handleQuit} className="text-xs text-gray-400 hover:text-gray-700 uppercase font-bold tracking-wider">
            Quit
          </button>
        </header>

        <ChatBox messages={messages} />

        {isLoading && <p className="text-sm text-gray-500 italic mb-2">Persona is thinking...</p>}
        {isAiSpeaking && <p className="text-sm text-blue-500 italic mb-2">Persona is speaking...</p>}
        {isEvaluating && <p className="text-sm text-blue-500 italic mb-2">Coach is compiling feedback...</p>}

        {!evaluation ? (
          <>
            <MessageInput 
              onSendMessage={handleSendMessage} 
              disabled={isLoading || isEvaluating}
              isAiSpeaking={isAiSpeaking}
            />
            
            <div className="mt-4 flex justify-end">
              <button
                onClick={handleEndScenario}
                disabled={messages.length === 0 || isLoading || isEvaluating || isAiSpeaking}
                className="text-sm text-red-600 hover:text-red-800 font-medium disabled:text-gray-400 px-4 py-2"
              >
                End Scenario & Get Feedback
              </button>
            </div>
          </>
        ) : (
          <ScoreCard evaluation={evaluation} onReset={handleQuit} />
        )}
      </div>
    </main>
  );
}