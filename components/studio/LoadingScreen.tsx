import React from "react";

export default function LoadingScreen() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center w-full min-h-[calc(100vh-72px)] relative">
      <div className="absolute top-1/4 -left-20 w-64 h-64 bg-primary-container/20 rounded-full blur-3xl -z-10"></div>
      <div className="absolute bottom-1/4 -right-20 w-80 h-80 bg-secondary-container/20 rounded-full blur-3xl -z-10"></div>

      <div className="relative flex items-center justify-center w-64 h-64 md:w-80 md:h-80 mb-12">
        <div className="absolute inset-0 bg-primary/5 rounded-[40%_60%_70%_30%/40%_50%_60%_50%] bloom-animate slow-spin"></div>
        <div className="absolute inset-4 bg-secondary/5 rounded-[60%_40%_30%_70%/50%_40%_50%_60%] bloom-animate" style={{ animationDelay: '-1s' }}></div>
        <div className="absolute inset-8 bg-tertiary/5 rounded-[50%] bloom-animate" style={{ animationDelay: '-2s' }}></div>
        
        <div className="relative z-10 flex flex-col items-center">
          <span className="material-symbols-outlined text-primary text-6xl md:text-7xl opacity-80" style={{ fontVariationSettings: "'FILL' 1" }}>spa</span>
        </div>
      </div>

      <div className="text-center max-w-lg space-y-6 animate-fade-in-up">
        <div className="space-y-2">
          <h2 className="text-3xl font-bold tracking-tight text-on-surface">Analyzing your session...</h2>
          <p className="text-lg text-on-surface-variant font-medium">Preparing your growth feedback...</p>
        </div>
        <div className="w-48 h-1 bg-surface-container-high mx-auto rounded-full overflow-hidden">
          <div className="h-full bg-primary w-2/3 rounded-full animate-pulse transition-all duration-1000"></div>
        </div>
        <div className="pt-8">
          <p className="text-sm tracking-wide text-primary/70 font-bold uppercase flex items-center justify-center gap-2">
            <span className="material-symbols-outlined text-base">air</span>
            Take a deep breath while we process your practice
          </p>
        </div>
      </div>
    </div>
  );
}