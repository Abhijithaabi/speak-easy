"use client";

import React, { useEffect, useState } from "react";
import SessionPlayback from "./SessionPlayback";
import { TranscriptLine } from "./StudioTranscript";

export interface Metric {
  name: string;
  score: number; // 1-10
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
  transcripts: TranscriptLine[]; 
  audioUrl: string | null;       
  onReset: () => void;
  onPracticeAgain: () => void;
}

export default function ScoreCard({ evaluation, transcripts, audioUrl, onReset, onPracticeAgain }: ScoreCardProps) {
  const averageScore = evaluation.metrics.reduce((acc, m) => acc + m.score, 0) / evaluation.metrics.length;
  // Convert the 1-10 average to a 0-100 percentage for the big circle
  const overallConfidence = Math.round((averageScore / 10) * 100);

  const radius = 100;
  const circumference = 2 * Math.PI * radius;
  // Animate the circle on mount
  const [strokeDashoffset, setStrokeDashoffset] = useState(circumference);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setStrokeDashoffset(circumference - (overallConfidence / 100) * circumference);
    }, 100);
    return () => clearTimeout(timeout);
  }, [circumference, overallConfidence]);

  return (
    <div className="w-full max-w-6xl mx-auto py-12 animate-fade-in-up px-6">
      
      {/* Header & Overall Score Section */}
      <section className="mb-16 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div className="max-w-xl">
          <span className="text-[11px] uppercase tracking-[0.2em] text-primary font-bold mb-4 block">Session Summary</span>
          <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight leading-tight text-on-surface mb-6">
            A beautiful resonance, <br/><span className="text-primary-dim opacity-80">Speak Easy.</span>
          </h1>
          <p className="text-lg text-on-surface-variant leading-relaxed font-medium">
            Your voice today carried a natural warmth. We've mapped your session below to help you see the subtle textures of your progress.
          </p>
        </div>
        
        <div className="flex justify-center lg:justify-end">
          <div className="relative w-64 h-64 flex items-center justify-center bg-surface-container-lowest rounded-full shadow-[0_20px_50px_rgba(54,103,98,0.1)] border border-surface-container/50">
            <svg className="w-56 h-56 transform -rotate-90">
              <circle className="text-surface-container-high" cx="112" cy="112" r={radius} fill="transparent" stroke="currentColor" strokeWidth="12" />
              <circle cx="112" cy="112" r={radius} fill="transparent" stroke="url(#scoreGradient)" strokeWidth="12" strokeDasharray={circumference} strokeDashoffset={strokeDashoffset} strokeLinecap="round" className="transition-all duration-1000 ease-out" />
              <defs>
                <linearGradient id="scoreGradient" x1="0%" x2="100%" y1="100%">
                  <stop offset="0%" stopColor="#366762" />
                  <stop offset="100%" stopColor="#c7dbb1" />
                </linearGradient>
              </defs>
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
              <span className="text-5xl font-extrabold text-on-surface tracking-tighter">{overallConfidence}%</span>
              <span className="text-[10px] font-bold uppercase tracking-widest text-primary mt-1">Confidence Score</span>
            </div>
            <div className="absolute -bottom-2 bg-primary text-white text-[10px] font-bold px-4 py-1.5 rounded-full uppercase tracking-wider shadow-sm">
                {overallConfidence > 80 ? "Exceptional" : overallConfidence > 60 ? "Steady" : "Growth Mindset"}
            </div>
          </div>
        </div>
      </section>

      {/* Session Playback Component */}
      <SessionPlayback audioUrl={audioUrl} transcripts={transcripts} />

      {/* Analytics Bento Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-16">
        
        {/* Dynamic Metric Bars Section */}
        <div className="lg:col-span-7 bg-surface-container-lowest rounded-[2rem] p-10 shadow-[0_12px_32px_rgba(48,51,48,0.03)] border border-outline-variant/10 flex flex-col justify-between">
          <h2 className="text-2xl font-bold mb-10 flex items-center gap-3 text-on-surface">
            <span className="material-symbols-outlined text-primary">insights</span> The Serene Voice System
          </h2>
          
          <div className="space-y-10">
            {evaluation.metrics.map((metric, idx) => (
              <AnimatedMetricBar key={idx} metric={metric} />
            ))}
          </div>

          <div className="mt-12 flex items-start gap-5 p-6 bg-surface-container-low/50 rounded-2xl border border-outline-variant/5">
            <div className="w-12 h-12 rounded-full bg-primary-container flex items-center justify-center flex-shrink-0 text-primary">
              <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>auto_awesome</span>
            </div>
            <p className="text-sm leading-relaxed text-on-surface-variant italic font-medium pt-1">
              "{evaluation.strengths}"
            </p>
          </div>
        </div>

        {/* Textual Feedback Cards */}
        <div className="lg:col-span-5 space-y-6 flex flex-col">
          <FeedbackCard icon="check_circle" title="What You Did Great" text={evaluation.strengths} bgClass="bg-secondary-container/30 border-secondary-container/20" iconColor="text-secondary" titleColor="text-on-secondary-container" />
          <FeedbackCard icon="eco" title="Areas for Growth" text={evaluation.weaknesses} bgClass="bg-error-container/10 border-error-container/20" iconColor="text-error" titleColor="text-error-dim" />
          <FeedbackCard icon="lightbulb" title="Tips for Next Time" text={evaluation.actionable_advice} bgClass="bg-tertiary-container/30 border-tertiary-container/20" iconColor="text-tertiary" titleColor="text-on-tertiary-container" flexGrow />
        </div>
      </div>

      {/* Action CTA */}
      <section className="flex flex-col md:flex-row items-center justify-center gap-6 pb-20">
        <button onClick={onPracticeAgain} className="bg-primary text-white px-12 py-5 rounded-full font-bold text-lg shadow-xl shadow-primary/20 hover:bg-primary-dim transition-all flex items-center gap-3 active:scale-95">
          Practice Again <span className="material-symbols-outlined">refresh</span>
        </button>
        <button onClick={onReset} className="bg-surface-container-highest/50 text-on-surface-variant px-12 py-5 rounded-full font-bold text-lg hover:bg-surface-container-highest transition-all active:scale-95">
          Try a New Scenario
        </button>
      </section>
    </div>
  );
}

// THE FIX: New Animated Metric Bar with clean layout
function AnimatedMetricBar({ metric }: { metric: Metric }) {
  const [width, setWidth] = useState(0);

  useEffect(() => {
    // Delay allows the CSS transition to trigger after mount
    const timeout = setTimeout(() => {
      setWidth(metric.score * 10);
    }, 200);
    return () => clearTimeout(timeout);
  }, [metric.score]);

  return (
    <div className="space-y-3">
      <div className="flex justify-between items-end mb-1">
        <label className="font-bold text-on-surface tracking-tight text-sm uppercase">{metric.name}</label>
        <div className="flex items-baseline">
           <span className="text-xl font-extrabold text-primary leading-none">{metric.score}</span>
           <span className="text-sm font-bold text-on-surface-variant/50 ml-0.5 leading-none">/10</span>
        </div>
      </div>
      
      {/* Solid Progress Track */}
      <div className="h-3 w-full bg-surface-container-high rounded-full overflow-hidden relative">
        <div 
          className="absolute top-0 left-0 h-full bg-gradient-to-r from-primary to-primary-container rounded-full transition-all ease-out duration-1000" 
          style={{ width: `${width}%` }}
        ></div>
      </div>
      
      {/* Clean Reasoning Text below the bar */}
      <p className="text-xs font-medium text-on-surface-variant leading-relaxed opacity-90 pr-4 pt-1">
        {metric.reasoning}
      </p>
    </div>
  );
}

function FeedbackCard({ icon, title, text, bgClass, iconColor, titleColor, flexGrow }: any) {
  return (
    <div className={`rounded-[2rem] p-8 border ${bgClass} ${flexGrow ? 'flex-grow' : ''}`}>
      <div className="flex items-start gap-4">
        <span className={`material-symbols-outlined ${iconColor} text-2xl`} style={{ fontVariationSettings: "'FILL' 1" }}>{icon}</span>
        <div>
          <h3 className={`font-bold text-lg mb-2 tracking-tight ${titleColor}`}>{title}</h3>
          <p className="text-sm text-on-surface-variant leading-relaxed font-medium">{text}</p>
        </div>
      </div>
    </div>
  );
}