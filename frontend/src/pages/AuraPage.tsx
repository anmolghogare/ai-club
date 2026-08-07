import React, { useState, useRef, useLayoutEffect, useCallback, useEffect } from 'react';
import { motion, useReducedMotion, AnimatePresence, useScroll, useSpring, useAnimationFrame } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

type Particle = {
  id: number;
  x: number;
  y: number;
  size: number;
  speedX: number;
  speedY: number;
  opacity: number;
};

type MousePosition = {
  x: number;
  y: number;
  normalizedX: number;
  normalizedY: number;
};

type Glow = {
  id: number;
  x: number;
  y: number;
  color: string;
};

type Line = { 
  id: string; 
  x1: number; 
  y1: number; 
  x2: number; 
  y2: number;
};

const teamMembers = [
  { name: 'Vedant Shah', image: '/vedant-shah.jpg', linkedin: 'https://www.linkedin.com/in/vedant-shah-07a87331a/', github: 'https://github.com/Vedant-1016' },
  { name: 'Parth Agrawal', image: '/parth-agrawal.png', linkedin: 'https://www.linkedin.com/in/parth-agrawal-368869325/', github: 'https://github.com/ParthAgrawal-07' },
  { name: 'Meet Virugama', image: '/meet-virugama.png', linkedin: 'https://www.linkedin.com/in/meet-virugama-76a107320/', github: 'https://github.com/Meetvirugama' },
  { name: 'Madhav Thesiya', image: '/madhav-thesiya.png', linkedin: 'https://www.linkedin.com/in/madhavthesiya/', github: 'https://github.com/madhavthesiya' },
  { name: 'Bhagyashree Khemwani', image: '/bhagyashree-khemwani.png', linkedin: 'https://www.linkedin.com/in/bhagyashree-khemwani/', github: 'https://github.com/bhagy-shr' },
  { name: 'Manal Patel', image: '/manal-patel.png', linkedin: 'https://www.linkedin.com/in/manal-patel-a87b11382/', github: 'https://github.com/manalPatel2557' },
];

const facultyMembers = [
  {
    id: 'f1',
    name: 'Dr. G Venkatesh',
    designation: 'Associate Professor',
    department: 'Chemistry',
    roleInAura: 'Vision',
    specialization: 'Materials Science, Molecular Modelling',
    researchAreas: ['Supramolecular Nano Materials', 'Materials Science', 'Molecular Modelling'],
    experience: 'Experienced',
    education: 'Ph.D. in Chemistry (Annamalai University)',
    email: 'venkatesh_g@dau.ac.in',
    office: 'Block 2, Room 412',
    quote: "Technology should solve real problems for real students.",
    linkedin: 'https://in.linkedin.com/in/venkatesh-g-a02a58',
    photo: '/venkatesh-g.png',
    contributions: ['Project Vision', 'Research Direction', 'Mentoring', 'Technical Guidance'],
    skills: ['Materials Science', 'Molecular Modelling', 'Chemistry']
  },
  {
    id: 'f2',
    name: 'Dr. Arpit Rana',
    designation: 'Assistant Professor',
    department: 'Computer Science',
    roleInAura: 'System Architecture & Project Supervision',
    specialization: 'Applied Machine Learning, Recommendation Systems, Multimodality',
    researchAreas: ['Recommender Systems', 'Multimodality', 'Applied ML', 'Digital Innovation'],
    experience: '10+ Years',
    education: 'Ph.D. (UCC), M.Tech (LNMIIT)',
    email: 'arpitrana@da-iict.ac.in',
    office: 'Block 2, Room 305',
    quote: "A good architecture survives future requirements.",
    linkedin: 'https://in.linkedin.com/in/arpitrana',
    photo: '/arpit-rana.png',
    contributions: ['Architecture', 'Backend', 'Code Reviews', 'Project Supervision'],
    skills: ['Data Mining', 'Recommender Systems', 'Applied ML']
  },
  {
    id: 'f3',
    name: 'Mr. Ashvin Chaudhari',
    designation: 'System Administrator',
    department: 'IT & Infrastructure',
    roleInAura: 'Infrastructure Setup',
    specialization: 'System & Network Administration, VMware',
    researchAreas: [],
    experience: '16+ Years',
    education: '',
    email: '',
    office: '',
    quote: "Building the resilient infrastructure that powers AURA.",
    linkedin: 'https://in.linkedin.com/in/ashvin-chaudhari-64a20661',
    photo: '/ashwin-chaudhary.png',
    contributions: ['Infrastructure Setup', 'Deployment', 'Server Config'],
    skills: ['VMware', 'Linux Admin', 'Windows Admin', 'Networking']
  }
];

const getInitials = (name: string) => {
  if (name.includes('Prof.') || name.includes('Mr.')) {
    return name.split(' ').slice(1).map((n) => n[0]).join('').replace('.', '');
  }
  return name.split(' ').map((n) => n[0]).join('');
};

const clamp = (min: number, max: number, val: number) => Math.min(Math.max(val, min), max);
const lerp = (start: number, end: number, t: number) => start * (1 - t) + end * t;
const random = (min: number, max: number) => Math.random() * (max - min) + min;

const generateParticle = (id: number): Particle => ({
  id,
  x: random(0, 100),
  y: random(0, 100),
  size: random(1, 4),
  speedX: random(-0.03, 0.03),
  speedY: random(-0.03, 0.03),
  opacity: random(0.1, 0.4),
});

function useMousePosition(): MousePosition {
  const [mousePosition, setMousePosition] = useState<MousePosition>({ x: 0, y: 0, normalizedX: 0, normalizedY: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: e.clientX,
        y: e.clientY,
        normalizedX: (e.clientX / window.innerWidth) * 2 - 1,
        normalizedY: (e.clientY / window.innerHeight) * 2 - 1,
      });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return mousePosition;
}

function useParallax(mousePosition: MousePosition, intensity: number = 20) {
  const springConfig = { damping: 30, stiffness: 100 };
  const x = useSpring(mousePosition.normalizedX * intensity, springConfig);
  const y = useSpring(mousePosition.normalizedY * intensity, springConfig);
  return { x, y };
}

function useConvergenceLines(count: number) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const nodeRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [lines, setLines] = useState<Line[]>([]);
  const [size, setSize] = useState({ width: 0, height: 0 });

  const measure = useCallback(() => {
    const container = containerRef.current;
    if (!container) return;
    const containerRect = container.getBoundingClientRect();
    const cx = containerRect.width / 2;
    const cy = containerRect.height / 2;
    const nextLines: Line[] = nodeRefs.current.map((node, idx) => {
      if (!node) return { id: `line-${idx}`, x1: cx, y1: cy, x2: cx, y2: cy };
      const rect = node.getBoundingClientRect();
      const x = rect.left + rect.width / 2 - containerRect.left;
      const y = rect.top + rect.height / 2 - containerRect.top;
      return { id: `line-${idx}`, x1: x, y1: y, x2: cx, y2: cy };
    });
    setSize({ width: containerRect.width, height: containerRect.height });
    setLines(nextLines);
  }, []);

  useLayoutEffect(() => {
    measure();
    const ro = new ResizeObserver(() => measure());
    if (containerRef.current) ro.observe(containerRef.current);
    window.addEventListener('resize', measure);
    return () => {
      ro.disconnect();
      window.removeEventListener('resize', measure);
    };
  }, [count, measure]);

  const setNodeRef = useCallback((idx: number) => (el: HTMLDivElement | null) => {
    nodeRefs.current[idx] = el;
  }, []);

  return { containerRef, setNodeRef, lines, size, remeasure: measure };
}

const FloatingParticles = () => {
  const shouldReduceMotion = useReducedMotion();
  const [particles] = useState<Particle[]>(() => Array.from({ length: 40 }, (_, i) => generateParticle(i)));
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useAnimationFrame(() => {
    if (shouldReduceMotion || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    particles.forEach(p => {
      p.x += p.speedX;
      p.y += p.speedY;
      if (p.x < 0) p.x = 100;
      if (p.x > 100) p.x = 0;
      if (p.y < 0) p.y = 100;
      if (p.y > 100) p.y = 0;

      ctx.beginPath();
      ctx.arc((p.x / 100) * canvas.width, (p.y / 100) * canvas.height, p.size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(232, 121, 46, ${p.opacity})`;
      ctx.fill();
    });
  });

  useEffect(() => {
    const handleResize = () => {
      if (canvasRef.current) {
        canvasRef.current.width = window.innerWidth;
        canvasRef.current.height = window.innerHeight;
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none opacity-60 mix-blend-screen" />;
};

const ease = [0.22, 1, 0.36, 1];

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.8, ease } },
};

const fadeScale = {
  hidden: { opacity: 0, scale: 0.95 },
  show: { opacity: 1, scale: 1, transition: { duration: 0.8, ease } },
};

const blurReveal = {
  hidden: { opacity: 0, filter: 'blur(10px)' },
  show: { opacity: 1, filter: 'blur(0px)', transition: { duration: 1, ease } }
};

const stagger = {
  show: { transition: { staggerChildren: 0.1 } },
};

const slide = {
  hidden: { x: -20, opacity: 0 },
  show: { x: 0, opacity: 1, transition: { duration: 0.8, ease } }
};

const floating = {
  animate: {
    y: [0, -10, 0],
    transition: { duration: 4, repeat: Infinity, ease: 'easeInOut' }
  }
};

const pulse = {
  animate: {
    opacity: [0.5, 1, 0.5],
    scale: [0.98, 1.02, 0.98],
    transition: { duration: 4, repeat: Infinity, ease: 'easeInOut' }
  }
};

const AuraPage = () => {
  const mousePosition = useMousePosition();
  const parallax = useParallax(mousePosition, 20);
  const shouldReduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 });

  const [hoveredNode, setHoveredNode] = useState<number | null>(null);
  const [selectedNode, setSelectedNode] = useState<number | null>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setSelectedNode(null);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const nodes = teamMembers.map((member, i) => {
    const angle = (i * Math.PI * 2) / teamMembers.length - Math.PI / 2;
    const role = ['AI Engineer', 'ML Engineer', 'Frontend Developer', 'Backend Engineer', 'Research Lead', 'Infrastructure'][i];
    const x = 50 + Math.cos(angle) * 38; 
    const y = 50 + Math.sin(angle) * 38;
    return { ...member, role, x, y };
  });

  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans relative overflow-x-hidden selection:bg-[var(--aura-accent)] selection:text-white">
      
      {!shouldReduceMotion && (
        <motion.div
          className="fixed top-0 left-0 w-[400px] h-[400px] rounded-full pointer-events-none mix-blend-screen z-50"
          style={{
            background: 'radial-gradient(circle, rgba(232,121,46,0.15) 0%, rgba(0,0,0,0) 70%)',
            x: mousePosition.x - 200,
            y: mousePosition.y - 200,
          }}
          transition={{ type: 'tween', ease: 'backOut', duration: 0.15 }}
        />
      )}

      <motion.div 
        className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-orange-600 to-amber-400 origin-left z-[60]"
        style={{ scaleX }}
      />

      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.04] mix-blend-overlay" />
        
        <motion.div
          style={{ x: shouldReduceMotion ? 0 : parallax.x, y: shouldReduceMotion ? 0 : parallax.y }}
          className="absolute inset-0"
        >
          <motion.div
            animate={{ opacity: [0.4, 0.7, 0.4] }}
            transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute top-[-10%] left-[10%] w-[80vw] h-[80vw] rounded-full blur-[120px] bg-orange-900/20"
          />
          <motion.div
            className="absolute bottom-[-20%] right-[-10%] w-[60vw] h-[60vw] rounded-full blur-[100px] bg-amber-900/10"
          />
        </motion.div>

        <FloatingParticles />
      </div>

      <header className="fixed top-0 w-full z-50 bg-[#050505]/60 backdrop-blur-xl border-b border-white/5 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-6 h-16 md:h-20 flex items-center justify-between">
          <Link
            to="/"
            className="group flex items-center gap-3 text-white/60 hover:text-white transition-colors overflow-hidden rounded-full py-2 px-4 hover:bg-white/5"
          >
            <motion.div
              whileHover={{ x: -4 }}
              transition={{ type: 'spring', stiffness: 400, damping: 25 }}
            >
              <ArrowLeft size={16} />
            </motion.div>
            <span className="font-medium text-sm tracking-wide">Back to Home</span>
          </Link>
          <motion.img
            whileHover={{ scale: 1.05 }}
            transition={{ type: 'spring', stiffness: 400, damping: 25 }}
            src="/aura-logo.png"
            alt="AURA"
            className="h-7 md:h-8 w-auto opacity-90 grayscale hover:grayscale-0 transition-all duration-300"
          />
        </div>
      </header>

      <main className="relative z-10 w-full">
        <section className="relative w-full min-h-[100dvh] flex flex-col items-center justify-center pt-20 px-6 overflow-hidden">
          
          {/* AI Rings */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-[800px] aspect-square pointer-events-none">
            {[1, 2, 3].map((i) => (
              <motion.div
                key={`ring-${i}`}
                className="absolute inset-0 rounded-full border border-orange-500/10"
                style={{ scale: 1 + i * 0.4 }}
                animate={{ rotate: [0, 360] }}
                transition={{ 
                  duration: 20 + i * 15, 
                  repeat: Infinity, 
                  ease: 'linear', 
                  direction: i % 2 === 0 ? 'reverse' : 'normal' 
                }}
              />
            ))}
          </div>

          {/* Parallax Wrapper */}
          <motion.div
            style={{ x: shouldReduceMotion ? 0 : parallax.x, y: shouldReduceMotion ? 0 : parallax.y }}
            className="relative z-10 flex flex-col items-center w-full max-w-4xl"
          >
            {/* Logo Assembly & Glow */}
            <motion.div
              initial={{ scale: 0.5, filter: 'blur(20px)', opacity: 0 }}
              animate={{ scale: [0.5, 1.08, 1], filter: 'blur(0px)', opacity: 1 }}
              transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1], times: [0, 0.7, 1] }}
              className="relative w-24 h-24 md:w-32 md:h-32 mb-10 flex items-center justify-center"
            >
              <motion.img
                src="/aura-logo.png"
                alt="AURA Mark"
                className="w-full h-full object-contain relative z-10"
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
              />
              <motion.div
                className="absolute inset-0 bg-orange-600/40 blur-[40px] rounded-full z-0"
                animate={{ opacity: [0.4, 0.8, 0.4], scale: [0.8, 1.2, 0.8] }}
                transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
              />
            </motion.div>

            {/* Title */}
            <motion.h1
              initial={{ filter: 'blur(10px)', opacity: 0, y: 40, letterSpacing: '0.2em' }}
              animate={{ filter: 'blur(0px)', opacity: 1, y: 0, letterSpacing: 'normal' }}
              transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
              className="text-6xl sm:text-7xl md:text-[96px] font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-b from-white to-white/50 mb-6 text-center leading-none"
            >
              AURA
            </motion.h1>

            {/* Subtitle Mask Reveal */}
            <div className="overflow-hidden mb-10">
              <motion.p
                initial={{ y: '100%' }}
                animate={{ y: 0 }}
                transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.4 }}
                className="text-lg md:text-xl text-orange-400 font-mono tracking-[0.2em] uppercase text-center"
              >
                University AI Assistant
              </motion.p>
            </div>

            {/* Description */}
            <motion.p
              variants={{
                hidden: { opacity: 0, y: 20 },
                show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.6 } }
              }}
              initial="hidden"
              animate="show"
              className="max-w-[650px] text-center text-white/50 text-base md:text-lg leading-relaxed mb-12"
            >
              One intelligent assistant for everything at DAU.
              <span className="block mt-3 text-white/30 text-sm md:text-base">
                Search · Courses · Faculty · Labs · Events · Timetable · Research · Resources
              </span>
            </motion.p>

            {/* Buttons */}
            <motion.div
              variants={{
                hidden: { opacity: 0, y: 20 },
                show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.7 } }
              }}
              initial="hidden"
              animate="show"
              className="flex flex-col sm:flex-row items-center gap-4 mb-20 w-full sm:w-auto"
            >
              <a href="https://aura.dau.ac.in" target="_blank" rel="noreferrer" className="w-full sm:w-auto">
                <motion.button
                  whileHover={{ y: -2, scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="group relative w-full sm:w-auto px-8 py-4 bg-orange-600 text-white rounded-full font-medium tracking-wide overflow-hidden"
                >
                  <motion.div
                    className="absolute inset-0 bg-white/20 blur-md translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out"
                  />
                  <span className="relative flex items-center justify-center gap-2">
                    Launch AURA
                    <ArrowLeft size={16} className="rotate-[135deg] group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                  </span>
                </motion.button>
              </a>
            </motion.div>

            {/* Stats Cards */}
            <motion.div
              initial="hidden"
              animate="show"
              variants={{
                show: { transition: { staggerChildren: 0.1, delayChildren: 0.8 } }
              }}
              className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full"
            >
              {[
                { label: 'Version', value: '1.0' },
                { label: 'Students', value: '1,200+' },
                { label: 'Developers', value: '14' },
                { label: 'Faculty Mentors', value: '3' },
              ].map((stat) => (
                <motion.div
                  key={stat.label}
                  variants={{
                    hidden: { opacity: 0, y: 20 },
                    show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] } }
                  }}
                  whileHover={{ y: -4, backgroundColor: 'rgba(255,255,255,0.06)' }}
                  className="flex flex-col items-center justify-center p-6 rounded-2xl bg-white/5 border border-white/5 backdrop-blur-sm transition-colors cursor-default"
                >
                  <span className="text-2xl md:text-3xl font-bold text-white/90 mb-1">{stat.value}</span>
                  <span className="text-[10px] md:text-xs text-white/40 uppercase tracking-wider text-center">{stat.label}</span>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>

          {/* Scroll Indicator */}
          <motion.div
            initial={{ opacity: 0, x: "-50%" }}
            animate={{ opacity: 1, x: "-50%" }}
            transition={{ delay: 1.5, duration: 1 }}
            className="absolute bottom-8 left-1/2 flex justify-center"
          >
            <div className="w-6 h-10 border-2 border-white/10 rounded-full flex justify-center pt-2">
              <motion.div
                animate={{ y: [0, 16, 0], opacity: [0.4, 1, 0.4] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
                className="w-1.5 h-1.5 bg-orange-500 rounded-full blur-[0.5px]"
              />
            </div>
          </motion.div>
        </section>

        {/* Development Team Neural Network */}
        <section className="relative w-full min-h-[100dvh] py-24 flex flex-col items-center justify-center overflow-hidden">
          {/* Background Glow */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none -z-10">
            <motion.div 
              animate={{ opacity: [0.02, 0.05, 0.02], scale: [1, 1.1, 1] }}
              transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
              className="w-[80vw] h-[80vw] rounded-full bg-orange-500/10 blur-[100px]"
            />
          </div>

          <div className="text-center mb-16 relative z-20">
            <motion.div 
              initial={{ clipPath: 'inset(0 100% 0 0)' }}
              whileInView={{ clipPath: 'inset(0 0 0 0)' }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              className="text-orange-400 font-mono tracking-[0.2em] uppercase text-sm mb-4 inline-block"
            >
              THE BUILDERS
            </motion.div>
            <motion.div className="overflow-hidden">
              <motion.h2 
                initial={{ y: '100%' }}
                whileInView={{ y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
                className="text-5xl md:text-7xl font-bold tracking-tight text-white mb-6"
              >
                Development Team
              </motion.h2>
            </motion.div>
            <motion.div className="overflow-hidden">
              <motion.p 
                initial={{ y: '100%', opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
                className="text-white/50 text-xl font-serif italic"
              >
                The minds behind AURA.
              </motion.p>
            </motion.div>
          </div>

          {/* Desktop Neural Network */}
          <div className="hidden md:block relative w-full max-w-[800px] mx-auto aspect-square">
            <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid meet">
              {nodes.map((node, i) => (
                <g key={`connection-${i}`}>
                  {/* Line */}
                  <motion.line
                    x1="50" y1="50" x2={node.x} y2={node.y}
                    stroke="rgba(255,255,255,0.05)" strokeWidth="0.2" strokeLinecap="round"
                    initial={{ pathLength: 0 }}
                    whileInView={{ pathLength: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1], delay: 0.5 + i * 0.1 }}
                  />
                  {/* Highlight Line on Hover */}
                  <motion.line
                    x1="50" y1="50" x2={node.x} y2={node.y}
                    stroke="rgba(232,121,46,0.6)" strokeWidth="0.4" strokeLinecap="round"
                    animate={{ opacity: hoveredNode === i ? 1 : 0 }}
                    transition={{ duration: 0.3 }}
                  />
                  {/* Data Packet */}
                  <motion.circle
                    r="0.4" fill="#E8792E"
                    animate={{
                      cx: [50, node.x, 50],
                      cy: [50, node.y, 50],
                      opacity: [0, 1, 0]
                    }}
                    transition={{
                      duration: 4 + (i % 3),
                      repeat: Infinity,
                      ease: "easeInOut",
                      delay: i * 0.5
                    }}
                    style={{ filter: 'blur(0.5px)' }}
                  />
                </g>
              ))}
            </svg>

            {/* Center Node */}
            <motion.div
              className="absolute top-1/2 left-1/2 w-32 h-32 rounded-full bg-gradient-to-br from-orange-500 to-orange-800 flex items-center justify-center z-20 shadow-[0_0_40px_rgba(232,121,46,0.3)]"
              style={{ x: "-50%", y: "-50%" }}
              animate={{
                boxShadow: hoveredNode !== null
                  ? '0 0 60px rgba(232,121,46,0.6)'
                  : '0 0 40px rgba(232,121,46,0.3)',
                scale: selectedNode !== null ? 1.1 : 1,
                x: "-50%",
                y: "-50%"
              }}
              transition={{ duration: 0.3 }}
            >
              <div className="absolute inset-0 rounded-full border border-white/20 animate-[ping_3s_ease-in-out_infinite] opacity-50" />
              <span className="text-2xl font-bold tracking-widest text-white drop-shadow-md">AURA</span>
            </motion.div>

            {/* Outer Nodes */}
            {nodes.map((node, i) => {
              const isHovered = hoveredNode === i;
              const isOtherHovered = hoveredNode !== null && hoveredNode !== i;
              return (
                <motion.div
                  key={node.name}
                  className="absolute w-44 p-4 rounded-2xl bg-[#0A0A0A]/80 border border-white/10 backdrop-blur-md flex flex-col items-center justify-center cursor-pointer z-10 transition-all duration-300 group shadow-xl"
                  style={{ left: `calc(${node.x}% - 5.5rem)`, top: `calc(${node.y}% - 3rem)` }}
                  animate={{
                    opacity: isOtherHovered ? 0.35 : 1,
                    scale: isHovered ? 1.08 : 1,
                    zIndex: isHovered ? 30 : 10,
                    y: [0, -4, 0] // Subtle float
                  }}
                  whileHover={{ scale: 1.08 }}
                  onMouseEnter={() => setHoveredNode(i)}
                  onMouseLeave={() => setHoveredNode(null)}
                  onClick={() => setSelectedNode(i)}
                  initial={{ opacity: 0, scale: 0.8, filter: 'blur(10px)' }}
                  whileInView={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
                  viewport={{ once: true }}
                  transition={{ 
                    opacity: { duration: 0.6, delay: 0.8 + i * 0.1 },
                    scale: { duration: 0.6, delay: 0.8 + i * 0.1 },
                    filter: { duration: 0.6, delay: 0.8 + i * 0.1 },
                    y: { duration: 4, repeat: Infinity, ease: 'easeInOut', delay: i * 0.2 }
                  }}
                >
                  <div className="absolute inset-0 rounded-2xl border border-orange-500/0 group-hover:border-orange-500/50 transition-colors duration-300" />
                  <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mb-2 group-hover:bg-orange-500/20 group-hover:border-orange-500/50 transition-all duration-300 overflow-hidden">
                    {node.image ? (
                      <img src={node.image} alt={node.name} className="w-full h-full object-cover" />
                    ) : (
                      <span className="font-bold text-white/90">{getInitials(node.name)}</span>
                    )}
                  </div>
                  <span className="text-sm font-medium text-white/90 text-center leading-tight whitespace-nowrap">{node.name}</span>
                  <span className="text-[10px] text-orange-400/80 uppercase tracking-widest mt-1 text-center">{node.role}</span>
                </motion.div>
              );
            })}
          </div>

          {/* Mobile Vertical Layout */}
          <div className="md:hidden relative w-full flex flex-col items-center gap-12 mt-12 pb-20 px-6">
            <svg className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-8 h-full pointer-events-none -z-10">
              <motion.line
                x1="16" y1="0" x2="16" y2="100%"
                stroke="rgba(255,255,255,0.05)" strokeWidth="2" strokeLinecap="round"
                initial={{ pathLength: 0 }}
                whileInView={{ pathLength: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 2, ease: [0.22, 1, 0.36, 1] }}
              />
              {[1, 2, 3].map(dot => (
                <motion.circle
                  key={dot}
                  r="3" fill="#E8792E"
                  animate={{ cy: ['0%', '100%'] }}
                  cx="16"
                  transition={{ duration: 4, repeat: Infinity, ease: 'linear', delay: dot * 1.3 }}
                  style={{ filter: 'blur(1px)' }}
                />
              ))}
            </svg>

            <motion.div
              className="w-24 h-24 rounded-full bg-gradient-to-br from-orange-500 to-orange-800 shadow-[0_0_40px_rgba(232,121,46,0.3)] flex items-center justify-center z-10"
              initial={{ scale: 0, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ type: 'spring', bounce: 0.4 }}
            >
              <div className="absolute inset-0 rounded-full border border-white/20 animate-[ping_3s_ease-in-out_infinite] opacity-50" />
              <span className="font-bold tracking-widest text-white">AURA</span>
            </motion.div>

            {nodes.map((node, i) => (
              <motion.div
                key={node.name}
                className="w-full max-w-sm p-5 rounded-2xl bg-[#0A0A0A]/80 border border-white/10 backdrop-blur-md flex flex-col items-center z-10"
                onClick={() => setSelectedNode(i)}
                initial={{ opacity: 0, y: 30, filter: 'blur(10px)' }}
                whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: i * 0.1 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center mb-3 bg-white/5 overflow-hidden">
                  {node.image ? (
                    <img src={node.image} alt={node.name} className="w-full h-full object-cover" />
                  ) : (
                    <span className="font-bold text-white/90">{getInitials(node.name)}</span>
                  )}
                </div>
                <span className="font-medium text-white/90 text-lg">{node.name}</span>
                <span className="text-xs text-orange-400 uppercase tracking-widest mt-1">{node.role}</span>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Modal */}
        <AnimatePresence>
          {selectedNode !== null && (
            <motion.div
              className="fixed inset-0 z-[100] flex items-center justify-center px-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <motion.div
                className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                onClick={() => setSelectedNode(null)}
              />
              <motion.div
                className="relative w-full max-w-md bg-[#050505] border border-white/10 rounded-[32px] p-8 shadow-2xl overflow-hidden"
                initial={{ scale: 0.9, y: 20, opacity: 0 }}
                animate={{ scale: 1, y: 0, opacity: 1 }}
                exit={{ scale: 0.9, y: 20, opacity: 0 }}
                transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 to-transparent opacity-50 pointer-events-none" />
                <button
                  onClick={() => setSelectedNode(null)}
                  className="absolute top-6 right-6 text-white/40 hover:text-white transition-colors z-10 p-2 rounded-full hover:bg-white/10"
                  aria-label="Close modal"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                </button>
                
                <div className="relative z-10 flex flex-col items-center text-center mt-2">
                  <div className="w-20 h-20 rounded-full border border-orange-500/30 flex items-center justify-center bg-black mb-5 shadow-[0_0_30px_rgba(232,121,46,0.2)] overflow-hidden">
                    {nodes[selectedNode].image ? (
                      <img src={nodes[selectedNode].image} alt={nodes[selectedNode].name} className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-2xl font-bold text-white">{getInitials(nodes[selectedNode].name)}</span>
                    )}
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-1">{nodes[selectedNode].name}</h3>
                  <p className="text-orange-400 uppercase tracking-widest text-[11px] mb-6 font-mono">{nodes[selectedNode].role}</p>
                  
                  <p className="text-white/60 mb-8 leading-relaxed text-sm">
                    Instrumental in developing the core intelligence and scalable architecture that powers AURA across the university campus.
                  </p>
                  
                  <div className="flex gap-4 w-full">
                    {nodes[selectedNode].github && (
                      <a href={nodes[selectedNode].github} target="_blank" rel="noreferrer" className="flex-1">
                        <button className="w-full py-3 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-colors text-sm font-medium text-white/80">GitHub</button>
                      </a>
                    )}
                    {nodes[selectedNode].linkedin && (
                      <a href={nodes[selectedNode].linkedin} target="_blank" rel="noreferrer" className="flex-1">
                        <button className="w-full py-3 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-colors text-sm font-medium text-white/80">LinkedIn</button>
                      </a>
                    )}
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Faculty & Mentors */}
        <section className="relative w-full min-h-[100dvh] py-24 flex flex-col items-center justify-center overflow-hidden">
          {/* Background Glow */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none -z-10">
            <motion.div 
              animate={{ opacity: [0.01, 0.05, 0.01], scale: [1, 1.2, 1] }}
              transition={{ duration: 15, repeat: Infinity, ease: 'easeInOut' }}
              className="w-[100vw] h-[100vw] rounded-full bg-orange-500/10 blur-[120px]"
            />
          </div>

          <div className="text-center mb-24 relative z-20 px-6">
            <motion.div 
              initial={{ clipPath: 'inset(0 100% 0 0)' }}
              whileInView={{ clipPath: 'inset(0 0 0 0)' }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              className="text-orange-400 font-mono tracking-[0.2em] uppercase text-sm mb-4 inline-block"
            >
              FACULTY & MENTORS
            </motion.div>
            <motion.div className="overflow-hidden">
              <motion.h2 
                initial={{ y: '100%' }}
                whileInView={{ y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
                className="text-5xl md:text-7xl font-bold tracking-tight text-white mb-6"
              >
                Guided by Experience
              </motion.h2>
            </motion.div>
            <motion.div className="overflow-hidden max-w-2xl mx-auto">
              <motion.p 
                initial={{ y: '100%', opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
                className="text-white/50 text-xl font-serif italic leading-relaxed"
              >
                "The faculty members and mentors who transformed AURA from an idea into a scalable university AI platform."
              </motion.p>
            </motion.div>
          </div>

          <div className="relative z-20 w-full max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {facultyMembers.map((faculty, i) => (
              <motion.div
                key={faculty.id}
                initial={{ opacity: 0, y: 40, filter: 'blur(10px)', scale: 0.95 }}
                whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)', scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: i * 0.15 }}
                className="group relative rounded-[32px] bg-[#0A0A0A]/60 border border-white/10 backdrop-blur-xl p-8 hover:border-orange-500/30 transition-colors duration-500 flex flex-col"
              >
                <div className="absolute inset-0 rounded-[32px] bg-gradient-to-br from-orange-500/0 via-orange-500/0 to-orange-500/0 group-hover:from-orange-500/10 group-hover:to-transparent transition-all duration-500 opacity-0 group-hover:opacity-100" />
                <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-orange-500/50 to-transparent scale-x-0 group-hover:scale-x-100 transition-transform duration-700 ease-out origin-left" />

                <div className="relative z-10 flex items-start gap-4 mb-6">
                  <div className="w-16 h-16 shrink-0 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center overflow-hidden group-hover:scale-110 transition-transform duration-500">
                    {faculty.photo ? (
                      <img src={faculty.photo} alt={faculty.name} className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-xl font-bold text-white/90">{getInitials(faculty.name)}</span>
                    )}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white mb-1 group-hover:text-orange-400 transition-colors">{faculty.name}</h3>
                    <p className="text-sm text-white/70 font-medium">{faculty.designation}</p>
                    <p className="text-xs text-white/40">{faculty.department}</p>
                  </div>
                </div>

                <div className="relative z-10 mb-6 flex items-center justify-between border-b border-white/5 pb-4">
                  <div>
                    <p className="text-[10px] text-white/40 uppercase tracking-widest mb-1">Role</p>
                    <p className="text-sm text-orange-400 font-medium">{faculty.roleInAura}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] text-white/40 uppercase tracking-widest mb-1">Experience</p>
                    <p className="text-sm text-white/90 font-medium">{faculty.experience}</p>
                  </div>
                </div>

                <div className="relative z-10 mb-6">
                  <p className="text-[10px] text-white/40 uppercase tracking-widest mb-2">Research Areas</p>
                  <p className="text-xs text-white/70 leading-relaxed">{faculty.researchAreas.join(' • ') || faculty.specialization}</p>
                </div>

                <div className="relative z-10 mb-8 flex-grow">
                  <p className="text-[10px] text-white/40 uppercase tracking-widest mb-3">Contributions</p>
                  <div className="flex flex-wrap gap-2">
                    {faculty.contributions.map((contribution, index) => (
                      <span key={index} className="px-3 py-1 text-[11px] font-medium text-white/70 bg-white/5 border border-white/10 rounded-full">
                        {contribution}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="relative z-10 mt-auto pt-6 border-t border-white/10">
                  <p className="text-white/60 font-serif italic text-sm leading-relaxed mb-6 group-hover:text-white/90 transition-colors">
                    "{faculty.quote}"
                  </p>
                  <div className="flex gap-3">
                    {faculty.email && (
                      <a href={`mailto:${faculty.email}`} className="flex-1">
                        <button className="w-full py-2.5 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 hover:text-white text-xs font-medium text-white/60 transition-colors">
                          Email
                        </button>
                      </a>
                    )}
                    {faculty.linkedin && faculty.linkedin !== '#' && (
                      <a href={faculty.linkedin} target="_blank" rel="noreferrer" className="flex-1">
                        <button className="w-full py-2.5 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 hover:text-white text-xs font-medium text-white/60 transition-colors">
                          LinkedIn
                        </button>
                      </a>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Timeline Animation */}
          <div className="relative z-20 w-full max-w-4xl mx-auto mt-32 px-6 pb-20">
            <div className="flex justify-between items-center relative">
              <div className="absolute top-1/2 left-0 w-full h-[1px] bg-white/10 -translate-y-1/2" />
              <motion.div 
                className="absolute top-1/2 left-0 h-[2px] bg-gradient-to-r from-orange-600 via-orange-400 to-orange-600 -translate-y-1/2"
                initial={{ width: 0 }}
                whileInView={{ width: '100%' }}
                viewport={{ once: true }}
                transition={{ duration: 2, ease: [0.22, 1, 0.36, 1] }}
              />
              
              {['Vision', 'Architecture', 'Infrastructure', 'Launch'].map((step, i) => (
                <div key={step} className="relative z-10 flex flex-col items-center gap-4">
                  <motion.div 
                    initial={{ scale: 0 }}
                    whileInView={{ scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.5 + 0.2, type: 'spring', bounce: 0.5 }}
                    className="w-4 h-4 rounded-full bg-[#0A0A0A] border-2 border-orange-500 relative"
                  >
                    <motion.div 
                      className="absolute inset-0 rounded-full bg-orange-500"
                      animate={{ scale: [1, 1.5, 1], opacity: [1, 0, 1] }}
                      transition={{ duration: 2, repeat: Infinity, delay: i * 0.2 }}
                    />
                  </motion.div>
                  <motion.span 
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.5 + 0.4 }}
                    className="text-xs font-mono tracking-widest text-white/50 uppercase absolute top-8 whitespace-nowrap"
                  >
                    {step}
                  </motion.span>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

    </div>
  );
};

export default AuraPage;
