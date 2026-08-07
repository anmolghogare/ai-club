import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';

const PATH_OUTER = "M 80 230 L 140 60 C 145 45, 155 45, 160 60 L 220 230 C 220 230, 205 210, 150 210 L 110 210";
const PATH_INNER = "M 120 180 L 150 90 L 180 180";
const VIEWBOX = "0 0 300 300";

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
      className="absolute w-[200%] h-[200%] bg-[radial-gradient(circle,rgba(249,115,22,0.3)_0%,rgba(0,0,0,0)_60%)] mix-blend-screen"
    />
    {/* Animated Noise */}
    <div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.05] mix-blend-overlay" />
  </div>
);

const EnergyTrace = () => {
  return (
    <motion.path
      d={PATH_OUTER}
      stroke="#f97316"
      strokeWidth="2"
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
      initial={{ pathLength: 0, pathOffset: 1, opacity: 0 }}
      animate={{
        pathLength: [0, 0.15, 0.15, 0],
        pathOffset: [1, 0.85, 0, -0.15],
        opacity: [0, 1, 1, 0]
      }}
      transition={{
        duration: 3,
        times: [0, 0.1, 0.9, 1],
        repeat: Infinity,
        repeatDelay: 7, // Every 6-8 seconds (approx 7)
        ease: "easeInOut"
      }}
      style={{ filter: "drop-shadow(0 0 8px #f97316)" }}
    />
  );
};

const RippleLayer = ({ ripples }: { ripples: number[] }) => (
  <AnimatePresence>
    {ripples.map(r => (
      <motion.circle
        key={r}
        cx="150" cy="150" r="70"
        fill="none" stroke="#f97316" strokeWidth="1.5"
        initial={{ scale: 1, opacity: 0.3 }}
        animate={{ scale: 2, opacity: 0 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        style={{ transformOrigin: "150px 150px" }}
      />
    ))}
  </AnimatePresence>
);

const FloatingGeometry = ({ isHovered, particles }: { isHovered: boolean, particles: any[] }) => {
  return (
    <g>
      {particles.map(p => (
        <motion.g
          key={p.id}
          initial={{ x: p.x, y: p.y, rotate: 0 }}
          animate={{
            x: [p.x, p.x + (Math.random() * 4 - 2), p.x],
            y: [p.y, p.y + (Math.random() * 4 - 2), p.y],
            rotate: [0, 3, 0]
          }}
          transition={{
            duration: isHovered ? 2 : 4 + p.delay,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          {p.type === 'circle' ? (
            <circle cx="0" cy="0" r={p.size} fill="#f97316" opacity="0.4" />
          ) : (
            <path d={`M 0 -${p.size} L ${p.size} ${p.size} L -${p.size} ${p.size} Z`} fill="#f97316" opacity="0.4" />
          )}
        </motion.g>
      ))}
    </g>
  );
};

const ThinkingParticles = ({ triggers }: { triggers: number[] }) => {
  return (
    <AnimatePresence>
      {triggers.map((t, i) => (
        <motion.circle
          key={`${t}-${i}`}
          cx="0" cy="0" r="3"
          fill="#fff"
          initial={{ x: 150 + (Math.random() * 100 - 50), y: 30, opacity: 0 }}
          animate={{ x: 150, y: 150, opacity: [0, 1, 0] }}
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
      <motion.text
        key={w.id}
        initial={{ opacity: 0, x: 200, y: 80, scale: 0.5 }}
        animate={{ opacity: [0, 1, 0], x: 150, y: 150, scale: [0.5, 1, 0.5] }}
        transition={{ duration: 2.5, ease: "easeInOut" }}
        fill="#f97316"
        fontSize="12"
        fontWeight="bold"
        letterSpacing="0.1em"
        style={{ filter: "drop-shadow(0 0 6px rgba(249,115,22,0.8))" }}
      >
        {w.text}
      </motion.text>
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
      {/* Living Logo (Breathing) */}
      <motion.svg
        viewBox={VIEWBOX}
        className="w-full h-full overflow-visible"
        animate={{
          filter: isHovered
            ? "drop-shadow(0 0 15px rgba(249,115,22,0.6)) brightness(1.1)"
            : [
                "drop-shadow(0 0 5px rgba(249,115,22,0.2)) brightness(1)",
                "drop-shadow(0 0 10px rgba(249,115,22,0.35)) brightness(1.15)", // Max 15% brightness increase
                "drop-shadow(0 0 5px rgba(249,115,22,0.2)) brightness(1)"
              ]
        }}
        transition={{ duration: isHovered ? 0.3 : 4.5, repeat: isHovered ? 0 : Infinity, ease: 'easeInOut' }}
      >
        <defs>
          <linearGradient id="auraSvgGrad" x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#f97316" />
            <stop offset="100%" stopColor="#fbbf24" />
          </linearGradient>
        </defs>

        {children}

        {/* Base Logo Paths */}
        <motion.path 
          d={PATH_OUTER} 
          stroke="url(#auraSvgGrad)" 
          strokeWidth="24" 
          fill="none" 
          strokeLinecap="round" 
          strokeLinejoin="round" 
        />
        <motion.path 
          d={PATH_INNER} 
          stroke="url(#auraSvgGrad)" 
          strokeWidth="18" 
          fill="none" 
          strokeLinecap="round" 
          strokeLinejoin="round" 
        />

      </motion.svg>
    </motion.div>
  );
};

export const AnimatedAuraCore = ({ hitCount, isHovered }: { hitCount: number, isHovered: boolean }) => {
  const [ripples, setRipples] = useState<number[]>([]);
  const [words, setWords] = useState<{ id: number, text: string }[]>([]);
  const [thinkTriggers, setThinkTriggers] = useState<number[]>([]);
  const [particles] = useState(() => Array.from({ length: 6 }, (_, i) => ({
    id: i,
    type: Math.random() > 0.5 ? 'circle' : 'triangle',
    x: 80 + Math.random() * 140,
    y: 80 + Math.random() * 140,
    size: Math.random() * 3 + 2,
    delay: Math.random() * 2
  })));

  // External Hit Ripple (Layer 6)
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

  // AI Thinking (Layer 5)
  useEffect(() => {
    const interval = setInterval(() => {
      // Pause simulation logically could go here.
      // Fire 3 particles rapidly
      setTimeout(() => triggerThinkParticle(0), 500);
    }, 17000); // Every 15-20s

    const triggerThinkParticle = (index: number) => {
      if (index >= 3) return;
      const id = Date.now() + index;
      setThinkTriggers(t => [...t, id]);
      setTimeout(() => {
        triggerRipple();
        setThinkTriggers(t => t.filter(x => x !== id));
        setTimeout(() => triggerThinkParticle(index + 1), 150);
      }, 600); // time to reach center
    };

    return () => clearInterval(interval);
  }, [triggerRipple]);

  // Knowledge Absorption (Layer 4)
  useEffect(() => {
    const interval = setInterval(() => {
      const id = Date.now();
      setThinkTriggers(t => [...t, id]);
      setTimeout(() => {
        triggerRipple();
        setThinkTriggers(t => t.filter(x => x !== id));
      }, 600);
    }, 10000); // Every 8-12s
    return () => clearInterval(interval);
  }, [triggerRipple]);

  return (
    <div className="absolute top-1/2 left-1/2 w-64 h-64 flex items-center justify-center z-20 pointer-events-none" style={{ transform: "translate(-50%, -50%)" }}>
      <GlowLayer isHovered={isHovered} />
      <AuraLogo isHovered={isHovered} hitCount={hitCount}>
        <RippleLayer ripples={ripples} />
        <EnergyTrace />
        <FloatingGeometry isHovered={isHovered} particles={particles} />
        <ThinkingParticles triggers={thinkTriggers} />
        <MicroWords words={words} />
      </AuraLogo>
    </div>
  );
};
