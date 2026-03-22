"use client";

import React, { useState } from "react";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer"; 
import HomeComponent from "../components/home/Home";
import QuickScenario from "../components/scenarios/QuickScenario"; 
import ScenarioLibrary from "../components/scenarios/ScenarioLibrary"; 
import PracticeStudio from "../components/studio/PracticeStudio"; 

export default function AppRouter() {
  const [currentView, setCurrentView] = useState<"landing" | "selector" | "library" | "chat">("landing");
  const [activeScenario, setActiveScenario] = useState<string | null>(null);

  const handleScenarioSelect = (scenario: string) => {
    setActiveScenario(scenario);
    setCurrentView("chat");
  };

  const handleQuitChat = () => {
    setActiveScenario(null);
    // THE FIX: Always return to the full library so you can see your saved custom scenarios!
    setCurrentView("library"); 
  };

  const navigateHome = () => {
    setActiveScenario(null);
    setCurrentView("landing");
  };

  const navigateToSelector = () => {
    setActiveScenario(null);
    setCurrentView("selector");
  };

  const navigateToLibrary = () => {
    setActiveScenario(null);
    setCurrentView("library");
  };

  return (
    <div className="flex flex-col min-h-[100dvh] bg-background font-sans">
      <Header 
        onHomeClick={navigateHome} 
        onPracticeClick={navigateToSelector} 
        onLibraryClick={navigateToLibrary} 
        activeView={currentView} 
      />
      
      <main className="flex-1 flex flex-col w-full">
        {currentView === "landing" && (
          <HomeComponent onStart={navigateToSelector} onExploreLibrary={navigateToLibrary} />
        )}

        {currentView === "selector" && (
          <>
            <QuickScenario 
              onSelectScenario={handleScenarioSelect} 
              onExploreLibrary={navigateToLibrary} 
            />
            <Footer /> 
          </>
        )}

        {currentView === "library" && (
          <>
            <ScenarioLibrary onSelectScenario={handleScenarioSelect} />
            <Footer />
          </>
        )}

        {currentView === "chat" && activeScenario && (
          <PracticeStudio scenario={activeScenario} onQuit={handleQuitChat} />
        )}
      </main>
    </div>
  );
}