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
    <main className="min-h-screen bg-gray-50 flex items-center justify-center p-4 font-sans">
      <div className="max-w-xl w-full bg-white p-8 rounded-xl shadow-lg border border-gray-100">
        <h1 className="text-3xl font-bold text-gray-900 mb-6 text-center">Speak-Easy Roleplay</h1>
        <p className="text-gray-600 mb-6 text-center">Choose a scenario to practice your communication skills.</p>
        
        <div className="space-y-3 mb-6">
          {PRESET_SCENARIOS.map((scenario, idx) => (
            <button
              key={idx}
              onClick={() => onSelectScenario(scenario)}
              className="w-full text-left p-4 border border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all"
            >
              <p className="font-medium text-gray-800">{scenario}</p>
            </button>
          ))}
        </div>

        <div className="border-t pt-6 mt-4">
          <p className="text-sm font-semibold text-gray-500 mb-2 uppercase tracking-wide">Or Create Your Own</p>
          <textarea
            value={customScenario}
            onChange={(e) => setCustomScenario(e.target.value)}
            placeholder="e.g., Telling my roommate they need to move out in 30 days..."
            className="w-full p-3 border border-gray-300 rounded-md mb-3 focus:ring-2 focus:ring-blue-500 outline-none resize-none text-black"
            rows={3}
          />
          <button
            onClick={() => customScenario.trim() && onSelectScenario(customScenario)}
            disabled={!customScenario.trim()}
            className="w-full py-3 bg-gray-900 text-white rounded-md font-medium hover:bg-black disabled:bg-gray-300 transition-colors"
          >
            Start Custom Scenario
          </button>
        </div>
      </div>
    </main>
  );
}