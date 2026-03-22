"use client";
import React from "react";

interface HeroProps {
  onStart: () => void;
  onExploreLibrary: () => void;
}

export default function Hero({ onStart, onExploreLibrary }: HeroProps) {
  return (
    // ALIGNMENT FIX: Matched padding to px-6 md:px-8
    <section className="relative px-6 md:px-8 py-12 md:py-24 lg:py-32 overflow-hidden mt-8 md:mt-16">
      <div className="absolute top-[-10%] left-[-5%] w-[40rem] h-[40rem] bg-primary-container/20 blur-[80px] organic-shape-1 -z-10 animate-pulse"></div>
      <div className="absolute bottom-[-10%] right-[-5%] w-[35rem] h-[35rem] bg-tertiary-container/30 blur-[100px] organic-shape-2 -z-10"></div>
      
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-16">
        
        <div className="flex-1 text-center lg:text-left animate-fade-in-up">
          <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-secondary-container/50 text-on-secondary-container text-sm font-medium mb-8 tracking-wide uppercase">
            Serene Voice System
          </div>
          <h1 className="text-5xl md:text-7xl font-extrabold text-on-surface tracking-[-0.03em] leading-[1.1] mb-8">
            Find your voice. <br/>
            <span className="text-primary italic font-medium">Practice without pressure.</span>
          </h1>
          <p className="text-lg md:text-xl text-on-surface-variant max-w-2xl mx-auto lg:mx-0 leading-relaxed mb-12">
            A safe, AI-powered space to practice difficult conversations, overcome anxiety, and build your confidence with gentle feedback tailored to your journey.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
            <button 
              onClick={onStart} 
              className="px-10 py-5 bg-gradient-to-br from-primary to-primary-dim text-on-primary rounded-full font-bold text-lg shadow-[0_12px_32px_rgba(48,51,48,0.1)] hover:opacity-90 transition-all transform hover:-translate-y-1"
            >
              Start a Practice Session
            </button>
            {/* HOVER FIX: Added distinct background and border color shifts on hover */}
            <button 
              onClick={onExploreLibrary}
              className="px-10 py-5 text-primary font-bold text-lg rounded-full border-2 border-primary/10 hover:bg-primary/5 hover:border-primary/30 transition-all duration-300"
            >
              Explore Scenarios
            </button>
          </div>
        </div>

        <div className="flex-1 relative w-full max-w-lg lg:max-w-none animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
          {/* RADIUS FIX: Changed from rounded-xl to rounded-[3rem] for the extreme organic softness */}
          <div className="relative rounded-[3rem] overflow-hidden shadow-[0_12px_32px_rgba(48,51,48,0.06)] bg-surface-container-lowest p-4">
            
            <img 
              alt="Person practicing meditation and speech" 
              className="rounded-[2.5rem] w-full h-[450px] object-cover" 
              src="/yoga.png" 
            />

            <div className="absolute inset-0 bg-gradient-to-t from-background/40 to-transparent pointer-events-none"></div>
            
            {/* RADIUS FIX: Changed from rounded-lg to rounded-[1.5rem] */}
            <div className="absolute bottom-8 left-8 right-8 bg-surface-container-lowest/80 backdrop-blur-xl p-6 rounded-[1.5rem] border border-white/40 shadow-xl">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-full bg-primary-container flex items-center justify-center">
                  <span className="material-symbols-outlined text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>mic</span>
                </div>
                <div>
                  <p className="text-sm uppercase tracking-widest text-on-surface-variant font-bold">Active Session</p>
                  <p className="font-bold text-on-surface">Setting Boundaries at Work</p>
                </div>
              </div>

              {/* Voice Wave Visualization */}
              <div className="flex items-end gap-1.5 h-12 mt-2">
                <div className="w-2 bg-primary rounded-full h-4 animate-pulse"></div>
                <div className="w-2 bg-primary-container rounded-full h-8"></div>
                <div className="w-2 bg-primary-dim rounded-full h-12 animate-pulse"></div>
                <div className="w-2 bg-primary rounded-full h-6"></div>
                <div className="w-2 bg-primary-container rounded-full h-10 animate-pulse"></div>
                <div className="w-2 bg-primary-dim rounded-full h-5"></div>
                <div className="w-2 bg-primary rounded-full h-9"></div>
                <div className="w-2 bg-primary-container rounded-full h-7 animate-pulse"></div>
                <div className="w-2 bg-primary-dim rounded-full h-11"></div>
                <div className="w-2 bg-primary rounded-full h-4 animate-pulse"></div>
                <div className="w-2 bg-primary-container rounded-full h-8"></div>
                <div className="w-2 bg-primary-dim rounded-full h-10"></div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </section>
  );
}