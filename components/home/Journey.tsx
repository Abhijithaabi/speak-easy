"use client";
import React, { useEffect } from "react";

export default function Journey() {
  
  // Re-implementing the scroll observer from your HTML script
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
    <section className="px-6 py-24 md:py-32" id="journey">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-24 reveal-on-scroll">
          <h2 className="text-4xl md:text-5xl font-bold text-on-surface mb-6">The Journey to Confidence</h2>
          <p className="text-xl text-on-surface-variant max-w-2xl mx-auto">Master the art of conversation through a guided, step-by-step narrative designed for growth.</p>
        </div>

        {/* Step 1: Choose Your Moment */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-40 reveal-on-scroll">
          <div className="order-2 lg:order-1">
            <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-primary-container/40 text-on-primary-container text-sm font-bold mb-6 tracking-wide">
                STEP 01
            </div>
            <h3 className="text-3xl md:text-4xl font-bold text-on-surface mb-6">Choose Your Moment</h3>
            <p className="text-lg text-on-surface-variant leading-relaxed mb-8">
                Whether it's the boardroom or the living room, preparation is key. Select from a curated library of scenarios, like <span className="text-primary font-semibold italic">'Asking for a Raise'</span> or <span className="text-primary font-semibold italic">'Setting Family Boundaries'</span>. We cover the spectrum of human connection.
            </p>
            <div className="flex items-center gap-4 text-primary font-bold">
              <span className="material-symbols-outlined">explore</span>
              <span>Browse 50+ Real-world Scenarios</span>
            </div>
          </div>
          <div className="order-1 lg:order-2">
            <div className="relative rounded-[2rem] overflow-hidden shadow-2xl group">
              {/* Image 1 Placeholder */}
              <img alt="Professional setting" className="w-full h-[400px] md:h-[500px] object-cover transform group-hover:scale-105 transition-transform duration-700" src="/1.png" />
              <div className="absolute inset-0 bg-primary/10 group-hover:bg-transparent transition-colors"></div>
            </div>
          </div>
        </div>

        {/* Step 2: Practice in Private */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-40 reveal-on-scroll">
          <div className="relative rounded-[2rem] overflow-hidden shadow-2xl group">
            {/* Image 2 Placeholder */}
            <img alt="Home setting" className="w-full h-[400px] md:h-[500px] object-cover transform group-hover:scale-105 transition-transform duration-700" src="/2.png" />
            <div className="absolute inset-0 bg-secondary/10 group-hover:bg-transparent transition-colors"></div>
          </div>
          <div>
            <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-secondary-container/40 text-on-secondary-container text-sm font-bold mb-6 tracking-wide">
                STEP 02
            </div>
            <h3 className="text-3xl md:text-4xl font-bold text-on-surface mb-6">Practice in Private</h3>
            <p className="text-lg text-on-surface-variant leading-relaxed mb-8">
                Your voice, your space, your pace. Interact with our empathetic AI in a completely safe, judgment-free environment. Experiment with tone, test different approaches, and build muscle memory for difficult dialogues from the comfort of your home.
            </p>
            <div className="flex items-center gap-4 text-secondary font-bold">
              <span className="material-symbols-outlined">shield_with_heart</span>
              <span>100% Private & Secure</span>
            </div>
          </div>
        </div>

        {/* Step 3: Grow with Grace */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center reveal-on-scroll">
          <div className="order-2 lg:order-1">
            <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-tertiary-container/40 text-on-tertiary-container text-sm font-bold mb-6 tracking-wide">
                STEP 03
            </div>
            <h3 className="text-3xl md:text-4xl font-bold text-on-surface mb-6">Grow with Grace</h3>
            <p className="text-lg text-on-surface-variant leading-relaxed mb-8">
                Confidence isn't just about what you say, but how you resonate. Receive gentle, actionable feedback on your pacing, emotional subtext, and clarity. Watch your communication patterns transform into light, finding the resonance that feels uniquely you.
            </p>
            <div className="flex items-center gap-4 text-tertiary font-bold">
              <span className="material-symbols-outlined">auto_awesome</span>
              <span>AI-Powered Insights</span>
            </div>
          </div>
          <div className="order-1 lg:order-2">
            <div className="relative rounded-[2rem] overflow-hidden shadow-2xl group bg-on-surface p-12 flex items-center justify-center min-h-[400px] md:min-h-[500px]">
              {/* Image 3 Placeholder */}
              <img alt="Growth visualization" className="absolute inset-0 w-full h-full object-cover opacity-80 group-hover:scale-110 transition-transform duration-700" src="/3.png" />
              
              <div className="relative z-10 flex items-end gap-3 h-32">
                {/* Fixed inline styles for React (camelCase + objects) */}
                {/* <div className="w-3 bg-primary rounded-full h-12 animate-pulse" style={{ animationDelay: '0.1s' }}></div>
                <div className="w-3 bg-primary-container rounded-full h-24 animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                <div className="w-3 bg-primary-dim rounded-full h-32 animate-pulse" style={{ animationDelay: '0.3s' }}></div>
                <div className="w-3 bg-tertiary rounded-full h-28 animate-pulse" style={{ animationDelay: '0.4s' }}></div>
                <div className="w-3 bg-secondary rounded-full h-20 animate-pulse" style={{ animationDelay: '0.5s' }}></div>
                <div className="w-3 bg-primary-container rounded-full h-14 animate-pulse" style={{ animationDelay: '0.6s' }}></div> */}
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}