import React from 'react';

export const AnimatedAuraCore = () => {
  return (
    <div id="auraCore" className="aura-core">
      <div className="aura-energy"></div>
      <div className="aura-ring ring-one"></div>
      <div className="aura-ring ring-two"></div>
      <div className="relative z-10 w-32 h-32 flex items-center justify-center pointer-events-auto transition-transform duration-300 hover:scale-105">
        <img 
          src="/aura-logo.png" 
          alt="AURA Logo" 
          className="w-full h-full object-contain filter drop-shadow-[0_0_15px_rgba(249,115,22,0.4)]" 
        />
      </div>
      <div className="aura-pulse"></div>
    </div>
  );
};
