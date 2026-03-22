import React from "react";
import { Scenario } from "../../types/scenario";

interface ScenarioCardProps {
  scenario: Scenario;
  onSelect: (scenarioDescription: string) => void;
}

export default function ScenarioCard({ scenario, onSelect }: ScenarioCardProps) {
  const getTagStyles = (category: string) => {
    switch (category) {
      case "Professional": return "bg-primary-container text-on-primary-container";
      case "Personal": return "bg-tertiary-container text-on-tertiary-container";
      case "Conflict": return "bg-secondary-container text-on-secondary-container";
      case "Custom": return "bg-primary-container text-on-primary-container";
      default: return "bg-surface-container-highest text-on-surface-variant";
    }
  };

  return (
    <button 
      onClick={() => onSelect(`${scenario.title}: ${scenario.description}`)}
      // THE FIX: Updated rounded-xl to rounded-[2rem] for softer, friendlier corners
      className="group bg-surface-container-lowest shadow-[0_12px_32px_rgba(48,51,48,0.04)] rounded-[2rem] p-8 flex flex-col h-full border border-outline-variant/10 hover:border-primary/30 transition-all duration-500 cursor-pointer text-left w-full hover:-translate-y-1"
    >
      <div className="flex justify-between items-start mb-6 w-full">
        {/* THE FIX: Solid background tags */}
        <span className={`px-4 py-1.5 rounded-full text-[10px] font-extrabold tracking-widest uppercase ${getTagStyles(scenario.category)}`}>
          {scenario.category}
        </span>
        <span className="material-symbols-outlined text-outline-variant group-hover:text-primary transition-colors">
          more_horiz
        </span>
      </div>
      <h3 className="text-2xl font-bold text-on-surface mb-4 tracking-tight">{scenario.title}</h3>
      <p className="text-on-surface-variant leading-relaxed mb-8 flex-grow">{scenario.description}</p>
      
      <div className="flex items-center text-primary font-bold text-sm">
        <span>Start Practice</span>
        <span className="material-symbols-outlined ml-2 text-sm transition-transform group-hover:translate-x-1">arrow_forward</span>
      </div>
    </button>
  );
}