import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// --- Sub-components ---

const GlowLayer = ({ isHovered }: { isHovered: boolean }) => (
  <div className="absolute inset-0 z-0 pointer-events-none flex items-center justify-center">
    {/* Soft orange radial light */}
    <motion.div
      animate={{
        scale: isHovered ? 1.1 : [1, 1.05, 1],
        opacity: isHovered ? 0.6 : [0.4, 0.5, 0.4],
      }}
      transition={{ duration: isHovered ? 0.4 : 4.5, repeat: isHovered ? 0 : Infinity, ease: 'easeInOut' }}
      className="absolute w-[180%] h-[180%] bg-[radial-gradient(circle,rgba(249,115,22,0.3)_0%,rgba(0,0,0,0)_60%)] mix-blend-screen"
    />
  </div>
);

const RippleLayer = ({ ripples }: { ripples: number[] }) => (
  <AnimatePresence>
    {ripples.map(r => (
      <motion.div
        key={r}
        initial={{ scale: 0.8, opacity: 0.3, borderWidth: '2px' }}
        animate={{ scale: 1.5, opacity: 0, borderWidth: '0px' }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="absolute inset-4 rounded-full border-orange-400"
      />
    ))}
  </AnimatePresence>
);

const ThinkingParticles = ({ triggers }: { triggers: number[] }) => {
  return (
    <AnimatePresence>
      {triggers.map((t, i) => (
        <motion.div
          key={`${t}-${i}`}
          className="absolute w-2 h-2 bg-white rounded-full"
          initial={{ x: (Math.random() * 100 - 50), y: -100, opacity: 0 }}
          animate={{ x: 0, y: 0, opacity: [0, 1, 0] }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6, ease: "anticipate" }}
          style={{ filter: "drop-shadow(0 0 5px #fff)" }}
        />
      ))}
    </AnimatePresence>
  );
};

const MicroWords = ({ words }: { words: { id: number, text: string }[] }) => (
  <AnimatePresence>
    {words.map(w => (
      <motion.div
        key={w.id}
        initial={{ opacity: 0, x: 80, y: -40, scale: 0.5 }}
        animate={{ opacity: [0, 1, 0], x: 0, y: 0, scale: [0.5, 1, 0.5] }}
        transition={{ duration: 2.5, ease: "easeInOut" }}
        className="absolute text-orange-500 font-bold tracking-wider text-[10px]"
        style={{ filter: "drop-shadow(0 0 6px rgba(249,115,22,0.8))" }}
      >
        {w.text}
      </motion.div>
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
      {/* Living Logo (Breathing Wrapper around PNG) */}
      <motion.div
        className="w-full h-full relative"
        animate={{
          scale: isHovered ? 1.02 : [1, 1.01, 1],
          filter: hitCount > 0
            ? 'brightness(1.15) drop-shadow(0 0 15px rgba(249,115,22,0.6))'
            : isHovered
              ? 'brightness(1.05) drop-shadow(0 0 10px rgba(249,115,22,0.4))'
              : 'brightness(1) drop-shadow(0 0 5px rgba(249,115,22,0.15))'
        }}
        transition={{ 
          scale: { duration: isHovered ? 0.3 : 4.5, repeat: isHovered ? 0 : Infinity, ease: 'easeInOut' },
          filter: { duration: hitCount > 0 ? 0.4 : isHovered ? 0.3 : 0 } 
        }}
      >
        <img 
          src="/aura-logo.png" 
          alt="AURA Logo" 
          className="w-full h-full object-contain pointer-events-auto"
        />
        {children}
      </motion.div>
    </motion.div>
  );
};

export const AnimatedAuraCore = ({ hitCount, isHovered }: { hitCount: number, isHovered: boolean }) => {
  const [ripples, setRipples] = useState<number[]>([]);
  const [words, setWords] = useState<{ id: number, text: string }[]>([]);
  const [thinkTriggers, setThinkTriggers] = useState<number[]>([]);

  // External Hit Ripple
  useEffect(() => {
    if (hitCount > 0) {
      triggerRipple();
    }
  }, [hitCount]);

  const triggerRipple = useCallback(() => {
    const id = Date.now() + Math.random();
    setRipples(r => [...r, id]);
    setTimeout(() => setRipples(r => r.filter(x => x !== id)), 500);
  }, []);

  // Micro Words
  useEffect(() => {
    const vocab = ["AI", "ML", "RAG", "DATA", "SEARCH", "PDF"];
    const interval = setInterval(() => {
      const id = Date.now();
      setWords([{ id, text: vocab[Math.floor(Math.random() * vocab.length)] }]);
      setTimeout(() => setWords([]), 2500);
    }, 18000); // 15-20s
    return () => clearInterval(interval);
  }, []);

  // AI Thinking
  useEffect(() => {
    const interval = setInterval(() => {
      setTimeout(() => triggerThinkParticle(0), 500);
    }, 17000);

    const triggerThinkParticle = (index: number) => {
      if (index >= 3) return;
      const id = Date.now() + index;
      setThinkTriggers(t => [...t, id]);
      setTimeout(() => {
        triggerRipple();
        setThinkTriggers(t => t.filter(x => x !== id));
        setTimeout(() => triggerThinkParticle(index + 1), 150);
      }, 600);
    };

    return () => clearInterval(interval);
  }, [triggerRipple]);

  // Knowledge Absorption
  useEffect(() => {
    const interval = setInterval(() => {
      const id = Date.now();
      setThinkTriggers(t => [...t, id]);
      setTimeout(() => {
        triggerRipple();
        setThinkTriggers(t => t.filter(x => x !== id));
      }, 600);
    }, 10000); 
    return () => clearInterval(interval);
  }, [triggerRipple]);

  return (
    <div className="absolute top-1/2 left-1/2 w-64 h-64 flex items-center justify-center z-20 pointer-events-none" style={{ transform: "translate(-50%, -50%)" }}>
      <GlowLayer isHovered={isHovered} />
      <AuraLogo isHovered={isHovered} hitCount={hitCount}>
        <RippleLayer ripples={ripples} />
        <ThinkingParticles triggers={thinkTriggers} />
        <MicroWords words={words} />
      </AuraLogo>
    </div>
  );
};
