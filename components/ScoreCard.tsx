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
    <div className="p-6 bg-white border border-gray-200 rounded-lg shadow-sm mt-6">
      <h2 className="text-2xl font-bold mb-6 text-gray-800 border-b pb-2">Coach's Assessment</h2>
      
      <div className="flex flex-col gap-4 mb-8">
        {metrics.map((metric, index) => (
          <div key={index} className="p-4 bg-gray-50 rounded-lg border border-gray-200 flex flex-col md:flex-row gap-4 items-start md:items-center">
            <div className="flex flex-col items-center justify-center min-w-[100px] border-r border-gray-200 pr-4">
              <p className="text-3xl font-bold text-blue-600 leading-none">{metric.score}<span className="text-lg text-gray-400">/10</span></p>
            </div>
            <div className="flex-1">
              <p className="text-sm font-bold uppercase tracking-wider text-gray-800 mb-1">{metric.name}</p>
              <p className="text-sm text-gray-600">{metric.reasoning}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="space-y-4 mb-8 text-sm">
        <div className="p-4 bg-green-50 border border-green-100 rounded-md">
          <h3 className="font-bold text-green-800 mb-1">Strengths</h3>
          <p className="text-green-700">{evaluation.strengths}</p>
        </div>
        
        <div className="p-4 bg-red-50 border border-red-100 rounded-md">
          <h3 className="font-bold text-red-800 mb-1">Areas for Improvement</h3>
          <p className="text-red-700">{evaluation.weaknesses}</p>
        </div>

        <div className="p-4 bg-blue-50 border border-blue-100 rounded-md">
          <h3 className="font-bold text-blue-800 mb-1">Actionable Advice for Next Time</h3>
          <p className="text-blue-700 font-medium">{evaluation.actionable_advice}</p>
        </div>
      </div>

      <button
        onClick={onReset}
        className="w-full py-3 bg-gray-900 text-white rounded-md font-medium hover:bg-black transition-colors"
      >
        Choose New Scenario
      </button>
    </div>
  );
}