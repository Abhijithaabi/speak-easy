"use client";

/**
 * @file components/MessageInput.tsx
 * @description Handles voice input with silence-detection and SVG icons.
 */

import React, { useState, useEffect, useRef, useCallback } from "react";

interface MessageInputProps {
  onSendMessage: (message: string) => void;
  disabled: boolean;
  isAiSpeaking: boolean;
}

export default function MessageInput({ onSendMessage, disabled, isAiSpeaking }: MessageInputProps) {
  const [inputValue, setInputValue] = useState("");
  const [isMicActive, setIsMicActive] = useState(false);
  const [isListening, setIsListening] = useState(false);
  
  const recognitionRef = useRef<any>(null);
  const latestInputRef = useRef(inputValue);
  const silenceTimerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    latestInputRef.current = inputValue;
  }, [inputValue]);

  const submitTranscription = useCallback(() => {
    const finalMessage = latestInputRef.current.trim();
    if (finalMessage) {
      onSendMessage(finalMessage);
      setInputValue("");
      latestInputRef.current = "";
    }
  }, [onSendMessage]);

  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      // Keep it continuous so it doesn't stop randomly on short pauses
      recognition.continuous = true; 
      recognition.interimResults = true;
      recognition.lang = "en-US";

      recognition.onstart = () => setIsListening(true);
      recognition.onend = () => setIsListening(false);

      recognition.onresult = (event: any) => {
        let currentTranscript = "";
        for (let i = 0; i < event.results.length; ++i) {
          currentTranscript += event.results[i][0].transcript;
        }
        setInputValue(currentTranscript);

        // Silence Detection (Debounce): Reset timer every time a word is spoken
        if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
        
        // If 2 seconds pass without a new word, auto-submit
        silenceTimerRef.current = setTimeout(() => {
          recognition.stop();
          submitTranscription();
        }, 2000); 
      };

      recognition.onerror = (event: any) => {
        if (event.error !== "no-speech") console.error("Speech error:", event.error);
        setIsListening(false);
      };

      recognitionRef.current = recognition;
    }
  }, [submitTranscription]);

  useEffect(() => {
    if (!recognitionRef.current) return;
    const shouldBeListening = isMicActive && !disabled && !isAiSpeaking;

    if (shouldBeListening && !isListening) {
      try { recognitionRef.current.start(); } catch (e) {}
    } else if (!shouldBeListening && isListening) {
      recognitionRef.current.stop();
      if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
    }
  }, [isMicActive, disabled, isAiSpeaking, isListening]);

  const toggleMute = () => {
    setIsMicActive((prev) => !prev);
    if (isMicActive) setInputValue(""); 
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
    if (isListening) recognitionRef.current.stop();
    
    if (inputValue.trim() && !disabled && !isAiSpeaking) {
      onSendMessage(inputValue.trim());
      setInputValue("");
    }
  };

  return (
    <div className="flex flex-col gap-2 w-full">
      <form onSubmit={handleSubmit} className="flex gap-2 w-full items-center">
        
        {/* SVG Toggle Button */}
        <button
          type="button"
          onClick={toggleMute}
          className={`flex items-center justify-center w-12 h-12 rounded-full transition-colors flex-shrink-0 ${
            isMicActive 
              ? isListening 
                ? "bg-red-500 text-white animate-pulse" 
                : "bg-orange-400 text-white" 
              : "bg-gray-200 text-gray-500 hover:bg-gray-300" 
          }`}
          title={isMicActive ? "Mute Microphone" : "Unmute Microphone"}
        >
          {isMicActive ? (
            // Active Mic SVG
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"></path>
              <path d="M19 10v2a7 7 0 0 1-14 0v-2"></path>
              <line x1="12" y1="19" x2="12" y2="22"></line>
            </svg>
          ) : (
            // Muted Mic SVG (with cross line)
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="2" y1="2" x2="22" y2="22"></line>
              <path d="M18.89 13.23A7.12 7.12 0 0 0 19 12v-2"></path>
              <path d="M5 10v2a7 7 0 0 0 12 5l-1.5-1.5a5 5 0 0 1-9-5v-2"></path>
              <path d="M15 9.34V5a3 3 0 0 0-5.68-1.33l1.67 1.67A3 3 0 0 1 15 8.25Z"></path>
              <line x1="12" y1="19" x2="12" y2="22"></line>
            </svg>
          )}
        </button>

        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          disabled={disabled || isAiSpeaking}
          placeholder={isMicActive ? "Speak naturally... (auto-sends after pause)" : "Type your response..."}
          className="flex-1 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 text-black"
        />
        
        <button
          type="submit"
          disabled={disabled || isAiSpeaking || !inputValue.trim()}
          className="px-6 py-3 bg-blue-600 text-white rounded-md font-medium hover:bg-blue-700 disabled:bg-blue-300 transition-colors"
        >
          Send
        </button>
      </form>
    </div>
  );
}