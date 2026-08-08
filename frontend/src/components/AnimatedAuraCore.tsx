import React from 'react';

export const AnimatedAuraCore = () => {
  return (
    <div id="auraCore" className="aura-core relative flex items-center justify-center pointer-events-auto">
      {/* Reactor Glow */}
      <div className="aura-reactor-glow absolute inset-0 rounded-full blur-[30px] opacity-60"></div>
      
      {/* Rings */}
      <div className="aura-ring aura-ring-outer"></div>
      <div className="aura-ring aura-ring-inner"></div>
      <div className="aura-ring aura-ring-dashed"></div>

      {/* Internal Spiral Particles */}
      <div className="aura-vortex absolute inset-0 rounded-full overflow-hidden">
        {Array.from({ length: 12 }).map((_, i) => (
          <div key={i} className="aura-vortex-particle" style={{ '--i': i } as React.CSSProperties}></div>
        ))}
      </div>

      {/* Central Logo */}
      <div className="relative z-10 w-24 h-24 md:w-32 md:h-32 flex items-center justify-center transition-transform duration-500 hover:scale-110">
        <img 
          src="/aura-logo.png" 
          alt="AURA Logo" 
          className="w-full h-full object-contain filter drop-shadow-[0_0_20px_rgba(249,115,22,0.8)]" 
        />
      </div>
      
      {/* Pulse Emitter */}
      <div className="aura-pulse-emitter absolute inset-0 rounded-full"></div>
    </div>
  );
};
