"use client";

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
  
  // NEW: A separate buffer to hold finalized words and prevent mobile duplication
  const finalTranscriptRef = useRef(""); 
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
      finalTranscriptRef.current = ""; // Clear the buffer after sending
    }
  }, [onSendMessage]);

  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = true; 
      recognition.interimResults = true;
      recognition.lang = "en-US";

      recognition.onstart = () => setIsListening(true);
      recognition.onend = () => setIsListening(false);

      recognition.onresult = (event: any) => {
        let interimTranscript = "";

        // FIX: Start looping from the browser's specific resultIndex
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            // If the browser is 100% sure, lock the word into our final buffer
            finalTranscriptRef.current += event.results[i][0].transcript;
          } else {
            // If still guessing, hold it temporarily
            interimTranscript += event.results[i][0].transcript;
          }
        }
        
        // Safely combine the locked words with the current guesses
        setInputValue(finalTranscriptRef.current + interimTranscript);

        if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
        
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
    if (isMicActive) {
      setInputValue(""); 
      finalTranscriptRef.current = ""; // Clear buffer on mute
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
    if (isListening) recognitionRef.current.stop();
    
    if (inputValue.trim() && !disabled && !isAiSpeaking) {
      onSendMessage(inputValue.trim());
      setInputValue("");
      finalTranscriptRef.current = ""; // Clear buffer on manual send
    }
  };

  return (
    <div className="flex flex-col gap-2 w-full">
      <form onSubmit={handleSubmit} className="flex gap-2 md:gap-3 w-full items-center bg-gray-950/50 p-1.5 md:p-2 rounded-xl md:rounded-2xl border border-gray-800">
        
        <button
          type="button"
          onClick={toggleMute}
          className={`flex items-center justify-center w-12 h-12 md:w-14 md:h-14 rounded-lg md:rounded-xl transition-all flex-shrink-0 ${
            isMicActive 
              ? isListening 
                ? "bg-lime-500 text-gray-900 animate-pulse shadow-[0_0_15px_rgba(132,204,22,0.5)]" 
                : "bg-yellow-600 text-white" 
              : "bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-lime-400" 
          }`}
          title={isMicActive ? "Mute Microphone" : "Unmute Microphone"}
        >
          {isMicActive ? (
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="md:w-6 md:h-6">
              <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"></path>
              <path d="M19 10v2a7 7 0 0 1-14 0v-2"></path>
              <line x1="12" y1="19" x2="12" y2="22"></line>
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="md:w-6 md:h-6">
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
          placeholder={isMicActive ? (isListening ? "Listening..." : "Paused...") : "Type your response..."}
          className="flex-1 min-w-0 p-3 md:p-4 text-sm md:text-base bg-gray-900 border border-gray-700 rounded-lg md:rounded-xl focus:outline-none focus:ring-2 focus:ring-lime-500/50 focus:border-lime-500 disabled:opacity-50 disabled:cursor-not-allowed text-white placeholder-gray-500 transition-all"
        />
        
        <button
          type="submit"
          disabled={disabled || isAiSpeaking || !inputValue.trim()}
          className="px-4 md:px-6 h-12 md:h-14 bg-gradient-to-r from-lime-400 to-green-500 text-gray-900 text-sm md:text-lg font-bold rounded-lg md:rounded-xl hover:opacity-90 disabled:opacity-30 disabled:cursor-not-allowed transition-all flex-shrink-0"
        >
          Send
        </button>
      </form>
    </div>
  );
}