"use client";

import React, { useState } from "react";
import Header from "../components/Header";
import LandingPage from "../components/LandingPage";
import ScenarioSelector from "../components/ScenarioSelector";
import ActiveChat from "../components/ActiveChat";
import LiveVoiceChat from "@/components/LiveVoiceChat";

export default function Home() {
  const [currentView, setCurrentView] = useState<"landing" | "selector" | "chat">("landing");
  const [activeScenario, setActiveScenario] = useState<string | null>(null);

  const handleScenarioSelect = (scenario: string) => {
    setActiveScenario(scenario);
    setCurrentView("chat");
  };

  const handleQuitChat = () => {
    setActiveScenario(null);
    setCurrentView("selector");
  };

  // Safe navigation function for the Header logo
  const navigateHome = () => {
    setActiveScenario(null);
    setCurrentView("landing");
  };

  return (
    <div className="flex flex-col min-h-[100dvh] bg-gray-950 font-sans selection:bg-lime-500/30 selection:text-white">
      <Header onHomeClick={navigateHome} />
      
      {currentView === "landing" && (
        <LandingPage onStart={() => setCurrentView("selector")} />
      )}

      {currentView === "selector" && (
        <ScenarioSelector onSelectScenario={handleScenarioSelect} />
      )}

      {currentView === "chat" && activeScenario && (
        // <ActiveChat scenario={activeScenario} onQuit={handleQuitChat} />
        <LiveVoiceChat scenario={activeScenario} onQuit={handleQuitChat} />
      )}
    </div>
  );
}