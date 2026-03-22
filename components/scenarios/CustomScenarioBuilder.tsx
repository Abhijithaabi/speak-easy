import React, { useState } from "react";

interface CustomScenarioBuilderProps {
  onGenerate: (prompt: string) => void;
}

export default function CustomScenarioBuilder({ onGenerate }: CustomScenarioBuilderProps) {
  const [prompt, setPrompt] = useState("");

  const handleGenerate = () => {
    if (prompt.trim()) {
      onGenerate(prompt.trim());
      setPrompt(""); // Clear after generation
    }
  };

  return (
    <section className="mt-24 mb-12 bg-surface-container-low rounded-xl p-8 md:p-12 relative overflow-hidden">
      {/* Decorative organic shapes */}
      <div className="absolute -top-24 -right-24 w-64 h-64 bg-secondary-container/20 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-tertiary-container/20 rounded-full blur-3xl pointer-events-none"></div>
      
      <div className="relative z-10 max-w-3xl">
        <h2 className="text-3xl font-extrabold text-on-surface mb-2 tracking-tight">Create a Custom Situation</h2>
        <p className="text-on-surface-variant mb-10 opacity-80">Design a practice session tailored exactly to your unique circumstances.</p>
        
        <div className="space-y-8">
          <div>
            <label className="block text-sm font-bold tracking-widest uppercase text-primary mb-4">What conversation is making you anxious today?</label>
            <textarea 
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="w-full bg-surface-container-lowest border-none rounded-lg p-6 shadow-[0_12px_32px_rgba(48,51,48,0.06)] focus:ring-2 focus:ring-primary/20 transition-all text-on-surface placeholder:text-outline-variant/60 outline-none resize-none" 
              placeholder="e.g., Telling my roommate I'm moving out, or asking for a deadline extension..." 
              rows={4}
            />
          </div>
          
          <div className="flex flex-col md:flex-row gap-4 items-center">
            <button 
              onClick={handleGenerate}
              disabled={!prompt.trim()}
              className="w-full md:w-auto px-10 py-4 bg-primary text-on-primary rounded-full font-bold shadow-[0_12px_32px_rgba(48,51,48,0.06)] hover:scale-[1.02] active:scale-95 transition-transform flex items-center justify-center disabled:opacity-50"
            >
              Generate Scenario
              <span className="material-symbols-outlined ml-2 text-xl">auto_awesome</span>
            </button>
            <span className="text-sm text-on-surface-variant italic">Our AI will craft a personalized practice partner for you.</span>
          </div>
        </div>
      </div>
    </section>
  );
}