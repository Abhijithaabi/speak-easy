"use client";

import React from "react";

interface LandingPageProps {
  onStart: () => void;
}

export default function LandingPage({ onStart }: LandingPageProps) {
  return (
    <div className="min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center p-6 font-sans bg-gray-950 text-white">
      {/* subtle background glow effect */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-lime-500/10 rounded-full blur-3xl -z-10"></div>
      </div>

      <div className="max-w-4xl mx-auto text-center relative z-10 mt-10">
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-8 leading-tight">
          Master the Art of the <br className="hidden md:block" />
          {/* Lime Gradient Text */}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-lime-300 to-green-400">
            Difficult Conversation
          </span>
        </h1>
        
        <p className="text-lg md:text-2xl text-gray-400 mb-12 max-w-2xl mx-auto leading-relaxed">
          Practice salary negotiations and tough feedback in a safe, AI-powered environment. Get real-time coaching and level up your skills.
        </p>

        <button
          onClick={onStart}
          // Lime Gradient Button with Shadow/Glow
          className="px-10 py-5 bg-gradient-to-r from-lime-400 to-green-500 text-gray-900 text-xl font-bold rounded-full shadow-lg shadow-lime-500/25 hover:shadow-lime-500/40 hover:scale-105 transition-all duration-200"
        >
          Start Practicing Now
        </button>

        {/* Feature Grid - Dark Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-24 text-left">
          {[
            { title: "Natural Voice", icon: (
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"></path><path d="M19 10v2a7 7 0 0 1-14 0v-2"></path><line x1="12" y1="19" x2="12" y2="23"></line><line x1="8" y1="23" x2="16" y2="23"></line></svg>
            ), desc: "Talk directly to the AI. Experience realistic, low-latency vocal responses." },
            { title: "Dynamic Scenarios", icon: (
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 6.1H3"></path><path d="M21 12.1H3"></path><path d="M15.1 18H3"></path></svg>
            ), desc: "Choose from preset professional situations or create your own challenge." },
            { title: "Actionable Coaching", icon: (
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"></path></svg>
            ), desc: "Get detailed feedback on clarity, empathy, and persuasiveness." }
          ].map((item, idx) => (
            <div key={idx} className="p-8 bg-gray-900/50 backdrop-blur-sm rounded-3xl border border-gray-800 hover:border-lime-500/50 transition-colors">
              <div className="w-12 h-12 bg-gray-800 text-lime-400 rounded-2xl flex items-center justify-center mb-6 shadow-inner">
                {item.icon}
              </div>
              <h3 className="text-xl font-bold text-white mb-3">{item.title}</h3>
              <p className="text-gray-400 text-base leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}