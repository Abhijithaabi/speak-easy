"use client";

/**
 * @file app/page.tsx
 * @description Main entry point. Acts as a router between Scenario Selection and Active Chat.
 */

import React, { useState } from "react";
import ScenarioSelector from "../components/ScenarioSelector";
import ActiveChat from "../components/ActiveChat";

export default function Home() {
  const [activeScenario, setActiveScenario] = useState<string | null>(null);

  // If no scenario is selected, show the selection screen
  if (!activeScenario) {
    return <ScenarioSelector onSelectScenario={setActiveScenario} />;
  }

  // Once a scenario is selected, pass it to the chat interface and provide a way to quit
  return (
    <ActiveChat 
      scenario={activeScenario} 
      onQuit={() => setActiveScenario(null)} 
    />
  );
}