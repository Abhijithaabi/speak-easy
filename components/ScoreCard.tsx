"use client";

/**
 * @file components/ScoreCard.tsx
 * @description Displays deep contextual evaluation scores and feedback.
 */

import React from "react";

export interface Metric {
  name: string;
  score: number;
  reasoning: string;
}

export interface EvaluationData {
  metrics: Metric[];
  strengths: string;
  weaknesses: string;
  actionable_advice: string;
}

interface ScoreCardProps {
  evaluation: EvaluationData;
  onReset: () => void;
}

export default function ScoreCard({ evaluation, onReset }: ScoreCardProps) {
  // Fallback in case the LLM fails to return the metrics array
  const metrics = evaluation.metrics || [];

  return (
    <div className="p-2">
      <h2 className="text-3xl font-bold mb-8 text-white text-center">Assessment Results</h2>
      
      <div className="flex flex-col gap-4 mb-10">
        {metrics.map((metric, index) => (
          // Dark Metric Card
          <div key={index} className="p-6 bg-gray-800/50 rounded-2xl border border-gray-700 flex flex-col md:flex-row gap-6 items-start md:items-center">
            <div className="flex flex-col items-center justify-center min-w-[120px] md:border-r border-gray-700 md:pr-6">
              {/* Lime Score Text */}
              <p className="text-5xl font-extrabold text-lime-400 leading-none">{metric.score}<span className="text-xl text-gray-500">/10</span></p>
            </div>
            <div className="flex-1">
              <p className="text-sm font-bold uppercase tracking-wider text-lime-300 mb-2">{metric.name}</p>
              <p className="text-base text-gray-300 leading-relaxed">{metric.reasoning}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="space-y-6 mb-10">
        {/* Strengths - Dark Green tint */}
        <div className="p-6 bg-green-950/30 border border-green-900/50 rounded-2xl">
          <h3 className="font-bold text-green-400 mb-2 flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
            Strengths
          </h3>
          <p className="text-gray-300">{evaluation.strengths}</p>
        </div>
        
        {/* Weaknesses - Dark Red tint */}
        <div className="p-6 bg-red-950/30 border border-red-900/50 rounded-2xl">
          <h3 className="font-bold text-red-400 mb-2 flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
            Areas for Improvement
          </h3>
          <p className="text-gray-300">{evaluation.weaknesses}</p>
        </div>

        {/* Advice - Dark Cyan/Blue tint */}
        <div className="p-6 bg-cyan-950/30 border border-cyan-900/50 rounded-2xl">
          <h3 className="font-bold text-cyan-400 mb-2 flex items-center gap-2">
             <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>
            Actionable Advice
          </h3>
          <p className="text-gray-200 font-medium">{evaluation.actionable_advice}</p>
        </div>
      </div>

      {/* Lime Gradient Reset Button */}
      <button
        onClick={onReset}
        className="w-full py-5 bg-gradient-to-r from-lime-400 to-green-500 text-gray-900 text-xl font-bold rounded-2xl hover:opacity-90 transition-all shadow-lg shadow-lime-500/20"
      >
        Start New Scenario
      </button>
    </div>
  );
}