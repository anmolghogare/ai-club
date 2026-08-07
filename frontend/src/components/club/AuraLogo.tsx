import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence, useAnimation, useSpring, useTransform } from 'framer-motion';

// Types and Initial Config
type ParticleType = 'circle' | 'triangle';
interface ParticleConfig {
  id: string;
  type: ParticleType;
  baseX: number;
  baseY: number;
  size: number;
}

// Generate the initial cluster of 15 particles in the top-right
const generateInitialParticles = (): ParticleConfig[] => {
  const particles: ParticleConfig[] = [];
  for (let i = 0; i < 15; i++) {
    particles.push({
      id: `p-${i}-${Date.now()}`,
      type: Math.random() > 0.3 ? 'circle' : 'triangle',
      baseX: 180 + Math.random() * 80, // Top-right area (viewBox 300x300)
      baseY: 20 + Math.random() * 90,
      size: Math.random() * 6 + 4,
    });
  }
  return particles;
};

export default function AuraLogo() {
  const [particles, setParticles] = useState<ParticleConfig[]>(generateInitialParticles());
  const [absorbingId, setAbsorbingId] = useState<string | null>(null);
  const [hitCount, setHitCount] = useState(0);
  const [isThinking, setIsThinking] = useState(false);
  
  const [words, setWords] = useState<{ id: number, text: string }[]>([]);
  const [isHovered, setIsHovered] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);

  // Parallax Mouse physics
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const springX = useSpring(mousePos.x, { stiffness: 150, damping: 20 });
  const springY = useSpring(mousePos.y, { stiffness: 150, damping: 20 });

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left - rect.width / 2) / 10;
    const y = (e.clientY - rect.top - rect.height / 2) / 10;
    setMousePos({ x, y });
    springX.set(x);
    springY.set(y);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setMousePos({ x: 0, y: 0 });
    springX.set(0);
    springY.set(0);
  };

  // ----------------------------------------------------
  // ORCHESTRATOR: Normal Absorption Cycle
  // ----------------------------------------------------
  useEffect(() => {
    if (isThinking || isHovered) return; // Pause standard absorption if thinking or hovered (hover triggers its own speed logic below if we wanted, but we keep it simple here)

    const interval = setInterval(() => {
      // Pick a random particle to detach
      const candidates = particles.filter(p => p.id !== absorbingId);
      if (candidates.length === 0) return;
      
      const target = candidates[Math.floor(Math.random() * candidates.length)];
      setAbsorbingId(target.id);
      
      // After travel time (400ms), hit the core
      setTimeout(() => {
        setHitCount(c => c + 1);
        setAbsorbingId(null);
        // Replace the consumed particle with a fresh one at the same base spot
        setParticles(current => current.map(p => 
          p.id === target.id ? { ...p, id: `p-new-${Date.now()}` } : p
        ));
      }, 450);

    }, Math.random() * 3000 + 2000); // Every 2-5 seconds

    return () => clearInterval(interval);
  }, [particles, absorbingId, isThinking, isHovered]);

  // Hover acceleration
  useEffect(() => {
    if (!isHovered || isThinking) return;
    const interval = setInterval(() => {
      const candidates = particles.filter(p => p.id !== absorbingId);
      if (candidates.length === 0) return;
      const target = candidates[Math.floor(Math.random() * candidates.length)];
      setAbsorbingId(target.id);
      setTimeout(() => {
        setHitCount(c => c + 1);
        setAbsorbingId(null);
        setParticles(current => current.map(p => p.id === target.id ? { ...p, id: `p-new-${Date.now()}` } : p));
      }, 300);
    }, 800);
    return () => clearInterval(interval);
  }, [isHovered, isThinking, particles, absorbingId]);


  // ----------------------------------------------------
  // AI THINKING MOMENT (Every 12-15s)
  // ----------------------------------------------------
  useEffect(() => {
    const thinkInterval = setInterval(() => {
      setIsThinking(true);
      
      // Pause for 0.5s, then fire 3 rapid absorptions
      setTimeout(() => {
        const fireRapid = (index: number) => {
          if (index >= 3) {
            setIsThinking(false);
            return;
          }
          setParticles(current => {
            const avail = current.filter(p => p.id !== absorbingId);
            if(avail.length === 0) return current;
            const target = avail[Math.floor(Math.random() * avail.length)];
            setAbsorbingId(target.id);
            
            setTimeout(() => {
              setHitCount(c => c + 1);
              setAbsorbingId(null);
              setParticles(inner => inner.map(p => p.id === target.id ? { ...p, id: `p-rapid-${Date.now()}-${index}` } : p));
              
              // Fire next
              setTimeout(() => fireRapid(index + 1), 100);
            }, 300);
            
            return current;
          });
        };
        fireRapid(0);
      }, 500);

    }, 14000);

    return () => clearInterval(thinkInterval);
  }, [absorbingId]);

  // ----------------------------------------------------
  // KNOWLEDGE WORDS (Every 15-20s)
  // ----------------------------------------------------
  useEffect(() => {
    const vocab = ["AI", "ML", "RAG", "DATA", "PDF", "NLP", "LLM", "VISION"];
    const wordInterval = setInterval(() => {
      if (Math.random() > 0.3) {
        const id = Date.now();
        setWords(w => [...w, { id, text: vocab[Math.floor(Math.random() * vocab.length)] }]);
        setTimeout(() => setWords(w => w.filter(x => x.id !== id)), 2000);
      }
    }, 17000);
    return () => clearInterval(wordInterval);
  }, []);

  // Ripples
  const [ripples, setRipples] = useState<number[]>([]);
  useEffect(() => {
    if (hitCount > 0) {
      const id = Date.now();
      setRipples(r => [...r, id]);
      setTimeout(() => setRipples(r => r.filter(x => x !== id)), 800);
    }
  }, [hitCount]);

  // Premium SVG Path construction
  // Drawing a sleek Ribbon 'A' mimicking the original
  const logoPathA = "M 80 230 L 140 60 C 145 45, 155 45, 160 60 L 220 230 C 220 230, 205 210, 150 210 L 110 210";
  const logoPathInner = "M 120 180 L 150 90 L 180 180";

  return (
    <div 
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      className="relative w-full aspect-square max-w-[500px] flex items-center justify-center cursor-crosshair group perspective-1000"
    >
      <motion.div 
        style={{ x: springX, y: springY, rotateX: useTransform(springY, [-10, 10], [5, -5]), rotateY: useTransform(springX, [-10, 10], [-5, 5]) }}
        className="w-full h-full relative"
      >
        {/* Ambient Radial Glow */}
        <motion.div 
          animate={{ scale: isHovered ? 1.2 : [1, 1.1, 1], opacity: isHovered ? 0.4 : [0.15, 0.25, 0.15] }}
          transition={{ duration: isHovered ? 0.4 : 5, repeat: isHovered ? 0 : Infinity, ease: "easeInOut" }}
          className="absolute inset-0 bg-gradient-to-tr from-orange-500 via-amber-500 to-transparent blur-[80px] rounded-full pointer-events-none -z-10"
        />

        <svg viewBox="0 0 300 300" className="w-full h-full overflow-visible drop-shadow-2xl">
          <defs>
            <linearGradient id="auraGrad" x1="0%" y1="100%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#f97316" />
              <stop offset="100%" stopColor="#fbbf24" />
            </linearGradient>
            <filter id="glow">
              <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
              <feMerge>
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          </defs>

          {/* Hit Ripples */}
          <AnimatePresence>
            {ripples.map(r => (
              <motion.circle
                key={r}
                cx="150" cy="150" r="80"
                fill="none" stroke="#f97316" strokeWidth="2"
                initial={{ scale: 1, opacity: 0.5 }}
                animate={{ scale: 1.6, opacity: 0, strokeWidth: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.7, ease: "easeOut" }}
                style={{ transformOrigin: "150px 150px" }}
              />
            ))}
          </AnimatePresence>

          {/* MAIN LOGO PATH (Breathing) */}
          <motion.g 
            animate={{ 
              scale: isHovered ? 1.05 : [1, 1.02, 1],
              filter: isHovered || hitCount > 0 
                ? "drop-shadow(0 0 25px rgba(249,115,22,0.8)) brightness(1.2)"
                : ["drop-shadow(0 0 10px rgba(249,115,22,0.2)) brightness(1)", "drop-shadow(0 0 20px rgba(249,115,22,0.5)) brightness(1.05)", "drop-shadow(0 0 10px rgba(249,115,22,0.2)) brightness(1)"]
            }}
            transition={{ duration: isHovered || hitCount > 0 ? 0.3 : 4, repeat: isHovered || hitCount > 0 ? 0 : Infinity, ease: "easeInOut" }}
            style={{ transformOrigin: "150px 150px" }}
          >
            <path d={logoPathA} stroke="url(#auraGrad)" strokeWidth="24" fill="none" strokeLinecap="round" strokeLinejoin="round" />
            <path d={logoPathInner} stroke="url(#auraGrad)" strokeWidth="18" fill="none" strokeLinecap="round" strokeLinejoin="round" />
            
            {/* Outline Energy (Travels around the path) */}
            <motion.path 
              d={logoPathA} stroke="#ffffff" strokeWidth="3" fill="none" strokeLinecap="round" strokeLinejoin="round"
              strokeDasharray="10 1000"
              animate={{ strokeDashoffset: [1010, 0] }}
              transition={{ duration: 7, repeat: Infinity, ease: "linear" }}
              style={{ filter: "url(#glow)", mixBlendMode: "overlay" }}
            />
          </motion.g>

          {/* FLOATING PARTICLES */}
          {particles.map(p => {
            const isTarget = p.id === absorbingId;
            return (
              <motion.g
                key={p.id}
                initial={{ x: p.baseX, y: p.baseY, scale: 0, opacity: 0, rotate: 0 }}
                animate={isTarget 
                  ? { x: 150, y: 150, scale: 0.2, opacity: 0, rotate: 180, transition: { duration: 0.4, ease: "anticipate" } }
                  : { x: [p.baseX, p.baseX + (Math.random()*10 - 5), p.baseX], y: [p.baseY, p.baseY + (Math.random()*10 - 5), p.baseY], scale: 1, opacity: 1, rotate: [0, 15, 0], transition: { duration: isThinking ? 0 : 3 + Math.random()*2, repeat: Infinity, ease: "easeInOut" } }
                }
              >
                {p.type === 'circle' ? (
                  <circle cx="0" cy="0" r={p.size} fill="url(#auraGrad)" style={{ filter: "drop-shadow(0 0 5px rgba(249,115,22,0.6))" }} />
                ) : (
                  <path d={`M 0 -${p.size} L ${p.size} ${p.size} L -${p.size} ${p.size} Z`} fill="url(#auraGrad)" style={{ filter: "drop-shadow(0 0 5px rgba(249,115,22,0.6))" }} />
                )}
              </motion.g>
            );
          })}

          {/* TYPOGRAPHY (Matching the PNG exactly) */}
          <g transform="translate(0, 20)">
            <text x="150" y="250" textAnchor="middle" fill="#ffffff" fontSize="42" fontWeight="900" letterSpacing="0.2em" style={{ textShadow: "0 4px 20px rgba(255,255,255,0.3)" }}>
              <tspan fill="none" stroke="#fff" strokeWidth="1">A</tspan>URA
            </text>
            <text x="150" y="275" textAnchor="middle" fill="#94a3b8" fontSize="12" fontWeight="bold" letterSpacing="0.1em" className="uppercase font-sans">
              UNIVERSITY AI ASSISTANT
            </text>
          </g>

          {/* KNOWLEDGE WORDS */}
          <AnimatePresence>
            {words.map(w => (
              <motion.text
                key={w.id}
                initial={{ opacity: 0, x: 260, y: 50, scale: 0.5 }}
                animate={{ opacity: [0, 1, 0], x: 150, y: 150, scale: [0.5, 1.2, 0.2] }}
                transition={{ duration: 1.8, ease: "easeInOut" }}
                fill="#f97316"
                fontSize="14"
                fontWeight="bold"
                letterSpacing="0.1em"
                style={{ filter: "drop-shadow(0 0 8px rgba(249,115,22,1))" }}
              >
                {w.text}
              </motion.text>
            ))}
          </AnimatePresence>
        </svg>
      </motion.div>
    </div>
  );
}
