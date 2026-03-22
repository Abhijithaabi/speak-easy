"use client";
import React, { useEffect } from "react";

export default function SuccessStories() {
  
  useEffect(() => {
    const observerOptions = {
      root: null,
      threshold: 0.1,
      rootMargin: "0px"
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);

    const elements = document.querySelectorAll('.reveal-on-scroll');
    elements.forEach(el => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  return (
    <section className="px-6 py-32 bg-surface-container-low/30 overflow-hidden relative">
      <div className="absolute top-0 right-0 w-64 h-64 bg-primary-container/10 blur-[100px] rounded-full"></div>
      
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-20 reveal-on-scroll">
          {/* ICON SIZE FIX: Forced explicit pixel size to override any hidden Material Symbol defaults */}
          <span 
            className="material-symbols-outlined text-primary mb-6" 
            style={{ fontSize: "48px" }}
          >
            star
          </span>
          <h2 className="text-5xl md:text-6xl font-extrabold tracking-tight text-on-surface">Success Stories</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 reveal-on-scroll">
          
          <div className="p-10 bg-surface-container-lowest rounded-[2rem] border border-outline-variant/10 shadow-sm hover:shadow-xl transition-all duration-500">
            <p className="text-on-surface-variant italic mb-10 leading-relaxed text-lg">
                "The 'Negotiating Salary' scenario gave me the exact phrasing I needed. I walked into my review feeling prepared, not terrified."
            </p>
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-primary-container flex items-center justify-center bg-primary-container/30">
                 <span className="material-symbols-outlined text-primary" style={{ fontSize: "28px" }}>person</span>
              </div>
              <div>
                <p className="font-bold text-on-surface text-lg">Alex Rivera</p>
                <p className="text-xs text-on-surface-variant uppercase tracking-widest font-semibold mt-1">Product Designer</p>
              </div>
            </div>
          </div>

          <div className="p-10 bg-surface-container-lowest rounded-[2rem] border border-outline-variant/10 shadow-sm hover:shadow-xl transition-all duration-500">
            <p className="text-on-surface-variant italic mb-10 leading-relaxed text-lg">
                "I struggle with social anxiety. Speak Easy is like having a non-judgmental friend who helps me rehearse the hard parts of life."
            </p>
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-secondary-container flex items-center justify-center bg-secondary-container/30">
                 <span className="material-symbols-outlined text-secondary" style={{ fontSize: "28px" }}>person</span>
              </div>
              <div>
                <p className="font-bold text-on-surface text-lg">David Chen</p>
                <p className="text-xs text-on-surface-variant uppercase tracking-widest font-semibold mt-1">Graduate Student</p>
              </div>
            </div>
          </div>

          <div className="p-10 bg-surface-container-lowest rounded-[2rem] border border-outline-variant/10 shadow-sm hover:shadow-xl transition-all duration-500">
            <p className="text-on-surface-variant italic mb-10 leading-relaxed text-lg">
                "The feedback on my pacing was a game-changer. I didn't realize how much I rushed when I was nervous until the AI showed me."
            </p>
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-tertiary-container flex items-center justify-center bg-tertiary-container/30">
                 <span className="material-symbols-outlined text-tertiary" style={{ fontSize: "28px" }}>person</span>
              </div>
              <div>
                <p className="font-bold text-on-surface text-lg">Sarah Jenkins</p>
                <p className="text-xs text-on-surface-variant uppercase tracking-widest font-semibold mt-1">Marketing Director</p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}