import React from "react";

export default function Footer() {
  return (
    <footer className="w-full border-t border-outline-variant/10 bg-[#faf9f6] pt-12 pb-8 mt-20">
      {/* SPACING FIX: Changed px-12 to px-6 md:px-8 and added gap-8 for mobile stacking */}
      <div className="flex flex-col md:flex-row justify-between items-center px-6 md:px-8 max-w-7xl mx-auto gap-8 text-sm tracking-wide uppercase font-medium">
        
        <div className="text-lg font-semibold text-[#303330]">
          Speak Easy
        </div>
        
        {/* SPACING FIX: Used flex-wrap and gap to prevent awkward mobile squeezing */}
        <div className="flex flex-wrap justify-center items-center gap-6 md:gap-8">
          <a className="text-[#303330]/60 hover:text-primary transition-colors" href="#">Privacy</a>
          <a className="text-[#303330]/60 hover:text-primary transition-colors" href="#">Terms</a>
          <a className="text-[#303330]/60 hover:text-primary transition-colors" href="#">Contact</a>
        </div>
        
        <div className="text-[#303330]/60 text-center transition-opacity duration-300">
          © 2026 Speak Easy. Created with Intention.
        </div>
        
      </div>
    </footer>
  );
}