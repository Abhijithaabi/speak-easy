"use client";

import React, { useState } from "react";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer"; 
import HomeComponent from "../components/home/Home";
import QuickScenario from "../components/scenarios/QuickScenario"; 
import PracticeStudio from "../components/studio/PracticeStudio"; 

export default function AppRouter() {
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

  const navigateHome = () => {
    setActiveScenario(null);
    setCurrentView("landing");
  };

  const navigateToSelector = () => {
    setActiveScenario(null);
    setCurrentView("selector");
  }

  return (
    <div className="flex flex-col min-h-[100dvh] bg-background font-sans">
      <Header 
        onHomeClick={navigateHome} 
        onPracticeClick={navigateToSelector} 
        activeView={currentView} // FIX: Pass the current state to the header!
      />
      
      <main className="flex-1 flex flex-col w-full">
        {currentView === "landing" && (
          <HomeComponent onStart={navigateToSelector} />
        )}

        {currentView === "selector" && (
          <>
            <QuickScenario 
              onSelectScenario={handleScenarioSelect} 
              onExploreLibrary={() => alert("Full library coming soon!")}
            />
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