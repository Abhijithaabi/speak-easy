"use client";
import React from "react";

interface QuickScenarioProps {
  onSelectScenario: (scenario: string) => void;
  onExploreLibrary?: () => void;
}

export default function QuickScenario({ onSelectScenario, onExploreLibrary }: QuickScenarioProps) {
  return (
    <div className="relative w-full flex-grow flex flex-col pt-32 pb-20 px-6 max-w-7xl mx-auto min-h-screen">
      
      {/* Background Ambient Glows */}
      <div className="fixed top-[-10%] right-[-10%] w-[40vw] h-[40vw] bg-primary/5 rounded-full blur-[120px] -z-10 pointer-events-none"></div>
      <div className="fixed bottom-[10%] left-[-5%] w-[30vw] h-[30vw] bg-secondary/5 rounded-full blur-[100px] -z-10 pointer-events-none"></div>

      {/* Header Section */}
      <section className="mb-16 text-center md:text-left animate-fade-in-up">
        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-on-surface mb-4 leading-[1.1]">
          Ready to practice? <br/>
          <span className="text-primary italic font-medium">Choose a scenario to begin.</span>
        </h1>
        <p className="text-on-surface-variant text-lg max-w-2xl leading-relaxed mt-6">
          Step into a safe space where you can refine your voice. Select a path below that resonates with your current needs.
        </p>
      </section>

      {/* Scenario Bento Grid */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-stretch animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
        
        {/* Card 1: Large Featured (Asking for a Raise) */}
        <div 
          onClick={() => onSelectScenario("Asking for a Raise: Navigate the delicate conversation of compensation with a manager.")}
          className="md:col-span-8 group relative overflow-hidden rounded-[2rem] bg-surface-container-low transition-all duration-500 hover:shadow-2xl hover:shadow-primary/10 cursor-pointer flex flex-col min-h-[400px]"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent z-10"></div>
          {/* Replace with your actual image later */}
          <img 
            alt="Asking for a Raise" 
            className="absolute right-0 top-0 w-full h-full object-cover mix-blend-multiply opacity-60 group-hover:scale-105 transition-transform duration-700" 
            src="/leaf.png" 
          />
          <div className="relative z-20 p-10 h-full flex flex-col justify-end w-full md:w-2/3">
            <span className="inline-block px-4 py-1.5 rounded-full bg-primary-container text-on-primary-container text-[11px] font-bold tracking-widest uppercase mb-4 w-fit">
              Career Growth
            </span>
            <h3 className="text-4xl font-bold text-on-surface mb-4">Asking for a Raise</h3>
            <p className="text-on-surface-variant mb-8 leading-relaxed">
              Navigate the delicate conversation of compensation with confidence and structured arguments.
            </p>
            <div className="flex items-center gap-6">
              <span className="flex items-center gap-2 text-sm font-semibold text-primary">
                <span className="material-symbols-outlined text-lg">timer</span> 12 mins
              </span>
              <span className="flex items-center gap-2 text-sm font-semibold text-secondary">
                <span className="material-symbols-outlined text-lg">psychiatry</span> Assertiveness
              </span>
            </div>
          </div>
        </div>

        {/* Card 2: Medium Vertical (Setting a Boundary) */}
        <div 
          onClick={() => onSelectScenario("Setting a Boundary: Learn the art of saying 'no' firmly yet kindly to protect your energy and time against an overbearing colleague.")}
          className="md:col-span-4 group relative overflow-hidden rounded-[2rem] bg-surface-container-low transition-all duration-500 hover:shadow-2xl hover:shadow-secondary/10 cursor-pointer flex flex-col min-h-[400px]"
        >
          <div className="absolute inset-0 bg-gradient-to-tr from-secondary/10 to-transparent z-10"></div>
          {/* Replace with your actual image later */}
          <img 
            alt="Setting a Boundary" 
            className="absolute inset-0 w-full h-full object-cover mix-blend-multiply opacity-40 group-hover:scale-105 transition-transform duration-700" 
            src="/leaf1.png" 
          />
          <div className="relative z-20 p-8 h-full flex flex-col justify-between">
            <div>
              <span className="inline-block px-4 py-1.5 rounded-full bg-secondary-container text-on-secondary-container text-[11px] font-bold tracking-widest uppercase mb-4 w-fit">
                Interpersonal
              </span>
              <h3 className="text-3xl font-bold text-on-surface mb-2">Setting a Boundary</h3>
            </div>
            <div className="mt-8">
              <p className="text-on-surface-variant mb-6 text-sm leading-relaxed font-medium">
                Learn the art of saying "no" firmly yet kindly to protect your energy and time.
              </p>
              <button className="w-full py-4 rounded-full bg-surface-container-highest/80 backdrop-blur-md text-primary font-bold group-hover:bg-primary-container transition-colors flex items-center justify-center gap-2">
                Enter Session <span className="material-symbols-outlined">arrow_forward</span>
              </button>
            </div>
          </div>
        </div>

        {/* Card 3: Wide Layout (The Stingy Manager) */}
        <div 
          onClick={() => onSelectScenario("The Stingy Manager: A high-stakes simulation where you must negotiate resources with a manager who prioritizes budget over team well-being.")}
          className="md:col-span-12 group relative overflow-hidden rounded-[2rem] bg-surface-container-low transition-all duration-500 hover:shadow-2xl hover:shadow-tertiary/10 cursor-pointer flex flex-col md:flex-row"
        >
          <div className="md:w-1/3 h-64 md:h-auto relative overflow-hidden">
            {/* Replace with your actual image later */}
            <img 
              alt="The Stingy Manager" 
              className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
              src="/man.png" 
            />
            <div className="absolute inset-0 bg-tertiary/20 mix-blend-overlay"></div>
          </div>
          <div className="md:w-2/3 p-8 md:p-12 flex flex-col justify-center">
            <div className="flex items-center gap-4 mb-6">
              <span className="px-4 py-1.5 rounded-full bg-tertiary-container text-on-tertiary-container text-[11px] font-bold tracking-widest uppercase">
                High Difficulty
              </span>
              <span className="text-sm text-on-surface-variant font-medium">Earn +50 Growth Points</span>
            </div>
            <h3 className="text-3xl md:text-4xl font-bold text-on-surface mb-4">The Stingy Manager</h3>
            <p className="text-on-surface-variant max-w-xl mb-10 leading-relaxed text-lg">
              A high-stakes simulation where you must negotiate resources with a manager who prioritizes budget over team well-being.
            </p>
            <div className="flex items-center gap-6">
              <div className="flex -space-x-3">
                <div className="w-12 h-12 rounded-full border-4 border-[#faf9f6] bg-primary-container flex items-center justify-center text-xs font-bold text-primary">SC</div>
                <div className="w-12 h-12 rounded-full border-4 border-[#faf9f6] bg-secondary-container flex items-center justify-center text-xs font-bold text-secondary">JD</div>
                <div className="w-12 h-12 rounded-full border-4 border-[#faf9f6] bg-tertiary-container flex items-center justify-center text-xs font-bold text-tertiary">+1k</div>
              </div>
              <span className="text-sm text-on-surface-variant italic font-medium">1.2k people practiced this week</span>
            </div>
          </div>
        </div>

      </div>

      {/* Library Link Section */}
      <section className="mt-24 mb-12 flex flex-col items-center animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
        <div className="w-24 h-1 bg-surface-container-high rounded-full mb-12"></div>
        <button 
          onClick={onExploreLibrary}
          className="group relative px-12 py-6 rounded-full bg-primary text-on-primary text-lg font-bold shadow-xl shadow-primary/20 hover:scale-[1.02] transition-all duration-300"
        >
          <span className="relative z-10 flex items-center gap-3">
              Explore All Scenarios
              <span className="material-symbols-outlined transition-transform group-hover:translate-x-1">auto_stories</span>
          </span>
          <div className="absolute inset-0 rounded-full bg-gradient-to-r from-primary to-primary-dim opacity-0 group-hover:opacity-100 transition-opacity"></div>
        </button>
        <p className="mt-6 text-on-surface-variant font-medium text-sm tracking-wide uppercase">
          Browse over 150+ custom roleplay modules
        </p>
      </section>

    </div>
  );
}