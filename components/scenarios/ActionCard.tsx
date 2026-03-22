import React from "react";

interface ActionCardProps {
  title: string;
  description: string;
  icon: string;
  onClick: () => void;
}

export default function ActionCard({ title, description, icon, onClick }: ActionCardProps) {
  return (
    <button 
      onClick={onClick}
      // THE FIX: Updated rounded-xl to rounded-[2rem]
      className="group bg-primary/5 rounded-[2rem] p-8 flex flex-col justify-center items-center text-center border-2 border-dashed border-primary/20 hover:bg-primary/10 transition-all duration-500 cursor-pointer w-full h-full min-h-[250px] hover:-translate-y-1"
    >
      <div className="w-16 h-16 rounded-full bg-primary-container flex items-center justify-center mb-5 text-primary shadow-sm">
        <span className="material-symbols-outlined text-3xl">{icon}</span>
      </div>
      <h3 className="text-xl font-bold text-primary mb-3">{title}</h3>
      <p className="text-on-surface-variant text-sm px-4 leading-relaxed">{description}</p>
    </button>
  );
}