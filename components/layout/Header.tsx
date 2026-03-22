"use client";

import React, { useState } from "react";

interface HeaderProps {
  onHomeClick?: () => void;
  onPracticeClick?: () => void;
  activeView?: "landing" | "selector" | "chat"; // Added this to track the current page
}

export default function Header({ onHomeClick, onPracticeClick, activeView = "landing" }: HeaderProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const closeMenu = () => setIsMobileMenuOpen(false);

  // Helper to handle navigation and close the menu simultaneously
  const handleNavClick = (action?: () => void) => {
    if (action) action();
    closeMenu();
  };

  // Define our active and inactive CSS classes cleanly
  const activeClass = "text-primary border-b-2 border-primary pb-1 font-semibold";
  const inactiveClass = "text-[#303330]/70 hover:text-primary transition-colors font-medium";

  // Mobile classes
  const mobileActiveClass = "text-right text-primary font-bold text-lg";
  const mobileInactiveClass = "text-right text-on-surface-variant hover:text-primary transition-colors text-lg font-semibold";

  return (
    <header className="fixed top-0 left-0 right-0 z-50 font-sans antialiased tracking-tight">
      <div className="relative z-50 bg-[#faf9f6]/90 backdrop-blur-md">
        <nav className="w-full max-w-7xl mx-auto px-6 md:px-8 py-4 flex justify-between items-center">
          <button onClick={() => handleNavClick(onHomeClick)} className="text-2xl font-bold tracking-tight text-[#303330] hover:text-primary transition-colors cursor-pointer">
            Speak Easy
          </button>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <button 
              onClick={() => handleNavClick(onHomeClick)} 
              className={activeView === "landing" ? activeClass : inactiveClass}
            >
              Welcome Space
            </button>
            <button className={inactiveClass}>
              Scenario Library
            </button>
            <button 
              onClick={() => handleNavClick(onPracticeClick)}
              className={activeView === "selector" || activeView === "chat" ? activeClass : inactiveClass}
            >
              Practice Studio
            </button>
          </div>

          {/* Mobile Hamburger/Close Button */}
          <button 
            className="md:hidden flex items-center justify-center p-2 text-on-surface hover:text-primary transition-colors"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle Menu"
          >
            <span className="material-symbols-outlined text-3xl">
              {isMobileMenuOpen ? "close" : "menu"}
            </span>
          </button>
        </nav>
        <div className="bg-[#f4f3f0] h-px w-full"></div>
      </div>

      {/* Mobile Menu Background Overlay */}
      <div 
        className={`fixed inset-0 top-[65px] bg-[#303330]/10 backdrop-blur-sm z-40 transition-opacity duration-300 md:hidden ${
          isMobileMenuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        onClick={closeMenu}
      ></div>

      {/* Mobile Menu Sidebar */}
      <div 
        className={`fixed top-[85px] right-0 w-1/2 h-auto bg-surface-container-lowest z-50 shadow-2xl rounded-l-[2rem] py-8 px-6 flex flex-col space-y-8 transform transition-transform duration-300 ease-in-out md:hidden ${
          isMobileMenuOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <button 
          onClick={() => handleNavClick(onHomeClick)} 
          className={activeView === "landing" ? mobileActiveClass : mobileInactiveClass}
        >
          Welcome Space
        </button>
        <button className={mobileInactiveClass}>
          Scenario Library
        </button>
        <button 
          onClick={() => handleNavClick(onPracticeClick)} 
          className={activeView === "selector" || activeView === "chat" ? mobileActiveClass : mobileInactiveClass}
        >
          Practice Studio
        </button>
      </div>
    </header>
  );
}