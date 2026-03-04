"use client";

/**
 * @file components/ScenarioSelector.tsx
 * @description Handles the UI for selecting or creating a roleplay scenario.
 */

import React, { useState } from "react";

const PRESET_SCENARIOS = [
  "Negotiating a 15% salary increase with a budget-conscious manager.",
  "Explaining a critical missed deadline to a frustrated client.",
  "Techincal Interview at Google for a Senior Backend Engineer Position"
];

/**
 * @typedef {Object} ScenarioSelectorProps
 * @property {(scenario: string) => void} onSelectScenario - Callback fired when a scenario is chosen.
 */
interface ScenarioSelectorProps {
  onSelectScenario: (scenario: string) => void;
}

export default function ScenarioSelector({ onSelectScenario }: ScenarioSelectorProps) {
  const [customScenario, setCustomScenario] = useState("");

  return (
    <main className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-4 font-sans bg-gray-950">
      {/* Main Dark Card */}
      <div className="max-w-xl w-full bg-gray-900 p-8 rounded-3xl shadow-2xl border border-gray-800">
        <h1 className="text-3xl font-bold text-white mb-6 text-center">Choose Your Challenge</h1>
        
        <div className="space-y-4 mb-8">
          {PRESET_SCENARIOS.map((scenario, idx) => (
            <button
              key={idx}
              onClick={() => onSelectScenario(scenario)}
              // Dark button that glows lime on hover
              className="w-full text-left p-5 bg-gray-800/50 border border-gray-700 rounded-2xl hover:border-lime-500 hover:bg-gray-800 transition-all group"
            >
              <p className="font-medium text-gray-200 group-hover:text-lime-300 transition-colors">{scenario}</p>
            </button>
          ))}
        </div>

        <div className="border-t border-gray-800 pt-8">
          <p className="text-sm font-bold text-lime-400 mb-3 uppercase tracking-wider">Or Create Custom Scenario</p>
          {/* Dark Textarea */}
          <textarea
            value={customScenario}
            onChange={(e) => setCustomScenario(e.target.value)}
            placeholder="e.g., Telling a team member their performance is slipping..."
            className="w-full p-4 bg-gray-800 border border-gray-700 rounded-xl mb-4 focus:ring-2 focus:ring-lime-500 focus:border-transparent outline-none resize-none text-white placeholder-gray-500"
            rows={3}
          />
          {/* Lime Button */}
          <button
            onClick={() => customScenario.trim() && onSelectScenario(customScenario)}
            disabled={!customScenario.trim()}
            className="w-full py-4 bg-gradient-to-r from-lime-400 to-green-500 text-gray-900 text-lg font-bold rounded-xl hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            Start Custom Scenario
          </button>
        </div>
      </div>
    </main>
  );
}