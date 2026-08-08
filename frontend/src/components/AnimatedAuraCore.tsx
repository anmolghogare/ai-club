import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// --- Sub-components ---

// 3-Layer Energy Field
const EnergyField = ({ isHovered, hitCount }: { isHovered: boolean, hitCount: number }) => {
  return (
    <div className="absolute inset-0 z-0 pointer-events-none flex items-center justify-center">
      {/* OUTER: Reactive faint glow */}
      <motion.div
        animate={{
          scale: hitCount > 0 ? 1.4 : isHovered ? 1.1 : 1,
          opacity: hitCount > 0 ? 0.4 : isHovered ? 0.3 : 0.15,
        }}
        transition={{ duration: hitCount > 0 ? 0.4 : 2, ease: 'easeOut' }}
        className="absolute w-[200%] h-[200%] rounded-full mix-blend-screen"
        style={{ background: 'radial-gradient(circle, rgba(249,115,22,1) 0%, rgba(249,115,22,0) 60%)' }}
      />
      
      {/* MIDDLE: Thin circular energy ring, rotating slowly */}
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 40, repeat: Infinity, ease: 'linear' }}
        className="absolute w-[140%] h-[140%] rounded-full border border-orange-500/10 border-dashed"
      />
      <motion.div
        animate={{ rotate: -360 }}
        transition={{ duration: 60, repeat: Infinity, ease: 'linear' }}
        className="absolute w-[120%] h-[120%] rounded-full border-[0.5px] border-amber-500/20"
      />

      {/* INNER: Subtle orange glow, breathing */}
      <motion.div
        animate={{
          scale: isHovered ? 1.1 : [1, 1.05, 1],
          opacity: isHovered ? 0.6 : [0.4, 0.5, 0.4],
        }}
        transition={{ duration: isHovered ? 0.4 : 4, repeat: isHovered ? 0 : Infinity, ease: 'easeInOut' }}
        className="absolute w-[100%] h-[100%] rounded-full mix-blend-screen"
        style={{ background: 'radial-gradient(circle, rgba(251,146,60,0.6) 0%, rgba(249,115,22,0) 70%)' }}
      />
    </div>
  );
};

// Orbital Micro-Particles
const OrbitalParticles = () => {
  const particles = useMemo(() => Array.from({ length: 8 }).map((_, i) => ({
    id: i,
    radius: 70 + Math.random() * 40,
    duration: 15 + Math.random() * 20,
    delay: Math.random() * -20,
    size: Math.random() * 2 + 1,
    direction: Math.random() > 0.5 ? 1 : -1
  })), []);

  return (
    <div className="absolute inset-0 z-0 pointer-events-none flex items-center justify-center">
      {particles.map(p => (
        <motion.div
          key={p.id}
          className="absolute rounded-full bg-orange-300/40"
          style={{ width: p.size, height: p.size, filter: 'blur(0.5px)' }}
          animate={{
            rotate: [0, 360 * p.direction],
          }}
          transition={{ duration: p.duration, repeat: Infinity, ease: 'linear', delay: p.delay }}
        >
          <div style={{ transform: `translateX(${p.radius}px)` }} className="w-full h-full bg-orange-200 rounded-full" />
        </motion.div>
      ))}
    </div>
  );
};

// Processing Pulse
const RippleLayer = ({ ripples }: { ripples: number[] }) => (
  <AnimatePresence>
    {ripples.map(r => (
      <motion.div
        key={r}
        initial={{ scale: 0.8, opacity: 0.8, borderWidth: '2px' }}
        animate={{ scale: 1.8, opacity: 0, borderWidth: '0px' }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="absolute inset-2 rounded-full border-orange-400"
        style={{ filter: 'drop-shadow(0 0 4px rgba(249,115,22,0.8))' }}
      />
    ))}
  </AnimatePresence>
);

const AuraLogo = ({ children, isHovered, hitCount }: { children: React.ReactNode, isHovered: boolean, hitCount: number }) => {
  return (
    <motion.div
      animate={{
        y: isHovered ? -3 : 0,
      }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className="relative w-32 h-32 flex items-center justify-center z-10"
    >
      <motion.div
        className="w-full h-full relative flex items-center justify-center"
        animate={{
          scale: hitCount > 0 ? 1.05 : isHovered ? 1.02 : [1, 1.01, 1],
          filter: hitCount > 0
            ? 'brightness(1.2) drop-shadow(0 0 20px rgba(249,115,22,0.8))'
            : isHovered
              ? 'brightness(1.05) drop-shadow(0 0 10px rgba(249,115,22,0.4))'
              : 'brightness(1) drop-shadow(0 0 5px rgba(249,115,22,0.15))'
        }}
        transition={{ 
          scale: { duration: hitCount > 0 ? 0.2 : isHovered ? 0.3 : 4, repeat: isHovered || hitCount > 0 ? 0 : Infinity, ease: 'easeInOut' },
          filter: { duration: hitCount > 0 ? 0.2 : isHovered ? 0.3 : 4, repeat: isHovered || hitCount > 0 ? 0 : Infinity, ease: 'easeInOut' } 
        }}
      >
        <img 
          src="/aura-logo.png" 
          alt="AURA Logo" 
          className="w-full h-full object-contain pointer-events-auto relative z-20"
        />
        <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
          {children}
        </div>
      </motion.div>
    </motion.div>
  );
};

export const AnimatedAuraCore = ({ hitCount, isHovered }: { hitCount: number, isHovered: boolean }) => {
  const [ripples, setRipples] = useState<number[]>([]);

  // Trigger subtle processing pulse on hit
  useEffect(() => {
    if (hitCount > 0) {
      const id = Date.now() + Math.random();
      setRipples(r => [...r, id]);
      setTimeout(() => setRipples(r => r.filter(x => x !== id)), 1000);
    }
  }, [hitCount]);

  return (
    <div className="absolute top-1/2 left-1/2 w-64 h-64 flex items-center justify-center z-20 pointer-events-none" style={{ transform: "translate(-50%, -50%)" }}>
      <EnergyField isHovered={isHovered} hitCount={hitCount} />
      <OrbitalParticles />
      <AuraLogo isHovered={isHovered} hitCount={hitCount}>
        <RippleLayer ripples={ripples} />
      </AuraLogo>
    </div>
  );
};
