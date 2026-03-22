"use client";

import React, { useState, useEffect } from "react";
import ScenarioCard from "./ScenarioCard";
import ActionCard from "./ActionCard";
import CustomScenarioBuilder from "./CustomScenarioBuilder";
import { curatedScenarios, initialMyScenarios, Scenario } from "../../types/scenario";

interface ScenarioLibraryProps {
  onSelectScenario: (scenario: string) => void;
}

type FilterType = "All" | "My Scenarios" | "Professional" | "Personal" | "Conflict";

export default function ScenarioLibrary({ onSelectScenario }: ScenarioLibraryProps) {
  const [activeFilter, setActiveFilter] = useState<FilterType>("All");
  const [myScenarios, setMyScenarios] = useState<Scenario[]>(initialMyScenarios);

  // Load saved custom scenarios from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('speak-easy-my-scenarios');
    if (saved) {
      try { setMyScenarios(JSON.parse(saved)); } catch (e) {}
    }
  }, []);

  const filters: FilterType[] = ["All", "My Scenarios", "Professional", "Personal", "Conflict"];

  const handleGenerateCustom = (prompt: string) => {
    const newScenario: Scenario = {
      id: `custom-${Date.now()}`,
      title: "Custom Scenario",
      description: prompt,
      category: "Custom"
    };
    
    // Save to localStorage immediately
    const updatedScenarios = [newScenario, ...myScenarios];
    setMyScenarios(updatedScenarios);
    localStorage.setItem('speak-easy-my-scenarios', JSON.stringify(updatedScenarios));
    
    onSelectScenario(`Custom Scenario: ${prompt}`);
  };

  const showMyScenarios = activeFilter === "All" || activeFilter === "My Scenarios";
  const filteredCurated = curatedScenarios.filter(s => activeFilter === "All" || s.category === activeFilter);

  return (
    // THE FIX: Added pt-[120px] so it drops completely below the fixed header
    <div className="w-full max-w-7xl mx-auto px-6 md:px-12 pt-[120px] pb-24 animate-fade-in-up">
      
      {/* Editorial Header */}
      <div className="mb-16 max-w-2xl">
        <span className="text-[11px] font-extrabold tracking-[0.2em] uppercase text-primary mb-4 block">
          Speak Easy
        </span>
        <h1 className="text-4xl md:text-5xl font-extrabold text-on-surface tracking-tight mb-6 leading-tight">
          Scenario Library
        </h1>
        <p className="text-lg md:text-xl text-on-surface-variant leading-relaxed opacity-80">
          Choose a curated conversation template or create a custom space to find your voice. Every dialogue is a step toward clarity.
        </p>
      </div>

      {/* Filter Pills */}
      <div className="flex flex-wrap gap-3 mb-12">
        {filters.map(filter => (
          <button 
            key={filter}
            onClick={() => setActiveFilter(filter)}
            // THE FIX: Styled to match the exact grey pills from your design
            className={`px-6 py-2 rounded-full font-medium text-sm transition-all ${
              activeFilter === filter 
                ? "bg-primary text-on-primary shadow-sm" 
                : "bg-surface-container-high text-on-surface-variant hover:bg-surface-container-highest"
            }`}
          >
            {filter === "All" ? "All Scenarios" : filter}
          </button>
        ))}
      </div>

      {/* My Scenarios Section */}
      {showMyScenarios && (
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-on-surface mb-8 tracking-tight flex items-center">
            My Scenarios
            {/* THE FIX: Styled the badge to be a beautiful soft grey pill */}
            <span className="ml-3 text-xs font-bold px-3 py-1 bg-surface-container-high text-on-surface-variant rounded-full">
              {myScenarios.length}
            </span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {myScenarios.map(scenario => (
              <ScenarioCard key={scenario.id} scenario={scenario} onSelect={onSelectScenario} />
            ))}
            <ActionCard 
              title="Create New" 
              description="Generate a new scenario below" 
              icon="add" 
              onClick={() => window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' })} 
            />
          </div>
        </div>
      )}

      {showMyScenarios && <div className="bg-[#f4f3f0] h-px w-full mb-16"></div>}

      {/* Curated Scenarios Grid */}
      {(activeFilter === "All" || filteredCurated.length > 0) && (
        <div className="mb-20">
          <h2 className="text-2xl font-bold text-on-surface mb-8 tracking-tight">Curated Library</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredCurated.map(scenario => (
              <ScenarioCard key={scenario.id} scenario={scenario} onSelect={onSelectScenario} />
            ))}
            <ActionCard 
              title="Request a Scenario" 
              description="Don't see what you need? Our team of writers adds new situations weekly." 
              icon="add" 
              onClick={() => alert("Scenario request feature coming soon!")} 
            />
          </div>
        </div>
      )}

      {/* Custom Situation Builder */}
      <CustomScenarioBuilder onGenerate={handleGenerateCustom} />
      
    </div>
  );
}