import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function AuraLogo() {
  const [isHovered, setIsHovered] = useState(false);
  const [hitCount, setHitCount] = useState(0);
  const [ripples, setRipples] = useState<number[]>([]);
  const [particles, setParticles] = useState<{ id: number, startX: number, startY: number }[]>([]);

  // 4. KNOWLEDGE ABSORPTION
  useEffect(() => {
    const interval = setInterval(() => {
      // Generate a tiny particle from outside moving towards the center
      const angle = Math.random() * Math.PI * 2;
      const distance = 250; 
      const startX = Math.cos(angle) * distance;
      const startY = Math.sin(angle) * distance;
      
      const id = Date.now();
      setParticles(p => [...p, { id, startX, startY }]);
      
      // Hit happens after 600ms
      setTimeout(() => {
        setParticles(p => p.filter(x => x.id !== id));
        setHitCount(c => c + 1);
      }, 600);
      
    }, 12000); // occasionally
    
    return () => clearInterval(interval);
  }, []);

  // Energy Response (Ripple + Brightness reset)
  useEffect(() => {
    if (hitCount > 0) {
      const id = Date.now();
      setRipples(r => [...r, id]);
      setTimeout(() => setRipples(r => r.filter(x => x !== id)), 500);
    }
  }, [hitCount]);

  return (
    <div 
      className="relative w-full aspect-square max-w-[500px] mx-auto flex items-center justify-center cursor-crosshair"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* 5. GLOW */}
      <motion.div
        animate={{ 
          scale: isHovered ? 1.05 : [1, 1.02, 1],
          opacity: isHovered ? 0.3 : [0.15, 0.25, 0.15]
        }}
        transition={{ duration: isHovered ? 0.3 : 4.5, repeat: isHovered ? 0 : Infinity, ease: "easeInOut" }}
        className="absolute inset-0 bg-gradient-to-tr from-orange-500 via-amber-500 to-transparent blur-[80px] rounded-full pointer-events-none -z-10"
      />

      {/* 4. KNOWLEDGE ABSORPTION PARTICLES */}
      <AnimatePresence>
        {particles.map(p => (
          <motion.div
            key={p.id}
            initial={{ opacity: 0, x: p.startX, y: p.startY, scale: 0.5 }}
            animate={{ opacity: [0, 1, 1], x: 0, y: 0, scale: [0.5, 1, 0.2] }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6, ease: "anticipate" }}
            className="absolute w-2 h-2 bg-orange-400 rounded-full z-20"
            style={{ filter: 'drop-shadow(0 0 5px #f97316)' }}
          />
        ))}
      </AnimatePresence>

      {/* RIPPLES (When Knowledge is absorbed) */}
      <AnimatePresence>
        {ripples.map(r => (
          <motion.div
            key={r}
            initial={{ scale: 0.9, opacity: 0.5, borderWidth: '2px' }}
            animate={{ scale: 1.3, opacity: 0, borderWidth: '0px' }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="absolute inset-0 rounded-full border-orange-400 z-10 pointer-events-none"
          />
        ))}
      </AnimatePresence>

      {/* 1. LIVING AURA (Wrapper around the original PNG) */}
      <motion.div
        animate={{ 
          scale: isHovered ? 1.02 : [1, 1.01, 1],
          filter: hitCount > 0 
            ? 'brightness(1.15) drop-shadow(0 0 20px rgba(249,115,22,0.5))' 
            : isHovered 
              ? 'brightness(1.05) drop-shadow(0 0 15px rgba(249,115,22,0.3))'
              : 'brightness(1) drop-shadow(0 0 10px rgba(249,115,22,0.15))'
        }}
        transition={{ 
          scale: { duration: isHovered ? 0.3 : 4.5, repeat: isHovered ? 0 : Infinity, ease: 'easeInOut' },
          filter: { duration: hitCount > 0 ? 0.4 : isHovered ? 0.3 : 0 }
        }}
        className="relative w-full h-full z-20"
      >
        <img 
          src="/aura-logo.png" 
          alt="AURA Logo" 
          className="w-full h-full object-contain pointer-events-auto"
        />
      </motion.div>
    </div>
  );
}
