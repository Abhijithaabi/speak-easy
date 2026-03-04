"use client";

import React from "react";

interface HeaderProps {
  onHomeClick?: () => void;
}

export default function Header({ onHomeClick }: HeaderProps) {
  return (
    <header className="w-full bg-gray-900/80 backdrop-blur-md border-b border-gray-800 sticky top-0 z-50">
      <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
        
        {/* Clickable Logo Area */}
        <button 
          onClick={onHomeClick}
          disabled={!onHomeClick}
          className={`flex items-center gap-3 group ${onHomeClick ? "cursor-pointer" : "cursor-default"}`}
        >
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-lime-400 to-green-500 flex items-center justify-center shadow-lg shadow-lime-500/20 group-hover:scale-105 transition-transform">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 text-gray-900">
              <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" />
              <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
              <line x1="12" y1="19" x2="12" y2="22" />
            </svg>
          </div>
          <span className="text-xl font-extrabold tracking-tight text-white group-hover:text-lime-300 transition-colors">
            Speak Easy
          </span>
        </button>

        <nav>
          <span className="text-xs font-bold text-lime-400 bg-lime-400/10 px-3 py-1 rounded-full border border-lime-400/20 tracking-wider uppercase">
            Beta
          </span>
        </nav>
      </div>
    </header>
  );
}