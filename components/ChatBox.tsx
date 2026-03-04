"use client";

import React, { useEffect, useRef } from "react";

export interface Message {
  role: "user" | "model" | "assistant"; // Added assistant for Groq compatibility
  content: string;
}

interface ChatBoxProps {
  messages: Message[];
}

export default function ChatBox({ messages }: ChatBoxProps) {
  const endOfMessagesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (endOfMessagesRef.current) {
      endOfMessagesRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  return (
    // Dark container with subtle inner shadow
    <div className="flex-1 min-h-0 overflow-y-auto p-3 md:p-6 bg-gray-950/30 rounded-xl md:rounded-2xl border border-gray-800/50 mb-3 md:mb-6 shadow-inner custom-scrollbar">
      {messages.length === 0 ? (
        <div className="h-full flex flex-col items-center justify-center text-gray-500 space-y-4">
          <div className="p-3 md:p-4 bg-gray-800/50 rounded-full">
             <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-lime-500/50 md:w-8 md:h-8"><path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" /><path d="M19 10v2a7 7 0 0 1-14 0v-2" /><line x1="12" y1="19" x2="12" y2="22" /></svg>
          </div>
          <p className="text-xs md:text-sm font-medium text-center px-4">Speak naturally to begin the simulation.</p>
        </div>
      ) : (
        // ... rest of the mapping logic stays identical
        messages.map((msg, index) => {
          const isUser = msg.role === "user";
          return (
            <div key={index} className={`mb-4 md:mb-6 flex ${isUser ? "justify-end" : "justify-start"} items-end gap-2 md:gap-3`}>
              
              {!isUser && (
                <div className="w-8 h-8 md:w-10 md:h-10 rounded-xl md:rounded-2xl bg-gray-800 flex items-center justify-center flex-shrink-0 shadow-sm border border-gray-700">
                  <span className="text-[10px] md:text-xs font-bold text-gray-300">AI</span>
                </div>
              )}

              <div
                className={`max-w-[85%] md:max-w-[70%] p-3 md:p-5 shadow-md ${
                  isUser
                    ? "bg-gradient-to-br from-lime-400 to-green-500 text-gray-900 rounded-2xl rounded-br-sm font-medium"
                    : "bg-gray-800 text-gray-100 rounded-2xl rounded-bl-sm border border-gray-700"
                }`}
              >
                <p className="text-sm md:text-[15px] leading-relaxed">{msg.content}</p>
              </div>

              {isUser && (
                <div className="w-8 h-8 md:w-10 md:h-10 rounded-xl md:rounded-2xl bg-gradient-to-br from-lime-400 to-green-500 flex items-center justify-center flex-shrink-0 shadow-sm">
                  <span className="text-[10px] md:text-xs font-extrabold text-gray-900">You</span>
                </div>
              )}

            </div>
          );
        })
      )}
      <div ref={endOfMessagesRef} />
    </div>
  );
}