import React, { useState, useRef, useLayoutEffect, useCallback } from 'react';
import { motion, useReducedMotion, AnimatePresence } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

const teamMembers = [
  { name: 'Vedant Shah' },
  { name: 'Parth Agrawal' },
  { name: 'Aditya Vaish' },
  { name: 'Nisarg Trivedi' },
  { name: 'Madhav Thesiya' },
  { name: 'Meet Virugama' },
  { name: 'Khushi Gandhi' },
  { name: 'Kaveesha Gupta' },
  { name: 'Bhagyashree Khemwani' },
  { name: 'Dhruvam Panchal' },
  { name: 'Manal Patel' },
  { name: 'Shlok Diwan' },
  { name: 'Om Patel' },
  { name: 'Pushkar Patel' },
];

const facultyMembers = [
  { name: 'Prof. G. Venkatesh', role: 'Vision' },
  { name: 'Prof. Arpit Rana', role: 'System Architecture & Project Supervision' },
  { name: 'Mr. Ashwin Chaudhary', role: 'Infrastructure Setup' },
];

// Helper to get initials
const getInitials = (name: string) => {
  if (name.includes('Prof.') || name.includes('Mr.')) {
    return name.split(' ').slice(1).map((n) => n[0]).join('').replace('.', '');
  }
  return name.split(' ').map((n) => n[0]).join('');
};

type Line = { id: string; x1: number; y1: number; x2: number; y2: number };

/**
 * Measures real avatar + container geometry and returns the set of
 * convergence lines (avatar center -> grid center) plus the container's
 * pixel size, so the overlay SVG's viewBox always matches reality.
 * Replaces index-based guesswork with actual layout.
 */
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [count]);

  const setNodeRef = useCallback(
    (idx: number) => (el: HTMLDivElement | null) => {
      nodeRefs.current[idx] = el;
    },
    []
  );

  return { containerRef, setNodeRef, lines, size, remeasure: measure };
}

const AuraPage = () => {
  const shouldReduceMotion = useReducedMotion();
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);
  const { containerRef, setNodeRef, lines, size, remeasure } = useConvergenceLines(
    teamMembers.length
  );

  // Animation variants
  const heroStagger = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.04, delayChildren: 0.7 },
    },
  };

  const fadeUp = {
    hidden: { opacity: 0, y: shouldReduceMotion ? 0 : 8 },
    show: { opacity: 1, y: 0, transition: { duration: 0.4 } },
  };

  const sectionReveal = {
    hidden: { opacity: 0, y: shouldReduceMotion ? 0 : 24 },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.35, ease: [0.215, 0.61, 0.355, 1] },
    },
  };

  const gridStagger = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: shouldReduceMotion ? 0 : 0.035 },
    },
  };

  const avatarEnter = {
    hidden: { opacity: 0, scale: shouldReduceMotion ? 1 : 0.85 },
    show: { opacity: 1, scale: 1, transition: { type: 'spring', bounce: 0.06 } },
  };

  const sweepEnter = {
    hidden: { clipPath: 'inset(0 100% 0 0)' },
    show: { clipPath: 'inset(0 0 0 0)', transition: { duration: 0.6, ease: 'easeInOut' } },
  };

  return (
    <div className="min-h-[100dvh] bg-[var(--aura-cream-base)] text-[var(--aura-ink)] font-sans relative overflow-x-hidden selection:bg-[var(--aura-accent)] selection:text-white">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-[var(--aura-cream-base)]/80 backdrop-blur-md border-b border-[var(--aura-cream-deep)] px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-[var(--aura-accent)] hover:text-[var(--aura-accent-deep)] font-medium text-sm transition-transform hover:-translate-x-1 duration-200"
          >
            <ArrowLeft size={16} /> Back to Home
          </Link>
        </div>
      </header>

      <main className="max-w-6xl mx-auto w-full">
        {/* HERO SECTION */}
        <section className="px-6 pt-16 pb-24 md:pt-28 md:pb-32 flex flex-col items-center text-center">
          <div className="relative w-48 h-48 md:w-64 md:h-64 mb-8 flex items-center justify-center">
            {!shouldReduceMotion && (
              <div className="absolute inset-0 pointer-events-none">
                {[...Array(6)].map((_, i) => (
                  <motion.div
                    key={`particle-${i}`}
                    initial={{
                      x: (Math.random() - 0.5) * 80,
                      y: (Math.random() - 0.5) * 80,
                      opacity: 0,
                      scale: 0,
                    }}
                    animate={{ x: 0, y: 0, opacity: 1, scale: 1 }}
                    transition={{ duration: 0.7, delay: i * 0.04, ease: [0.19, 1, 0.22, 1] }}
                    className={`absolute inset-0 m-auto rounded-full w-2 h-2 ${
                      i % 2 === 0 ? 'bg-[var(--aura-accent)]' : 'bg-amber-400'
                    }`}
                    style={{
                      marginLeft: `${(Math.random() - 0.5) * 100}px`,
                      marginTop: `${(Math.random() - 0.5) * 100}px`,
                    }}
                  />
                ))}
              </div>
            )}
            <motion.img
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, ease: 'easeOut', delay: shouldReduceMotion ? 0 : 0.4 }}
              src="/aura-logo.png"
              alt="AURA Logo Mark"
              className="w-full h-full object-contain relative z-10"
            />
          </div>

          <motion.div variants={heroStagger} initial="hidden" animate="show" className="space-y-4">
            <motion.h1 variants={fadeUp} className="aura-heading text-5xl md:text-7xl font-bold tracking-tight">
              AURA
            </motion.h1>
            <motion.div variants={fadeUp} className="overflow-hidden">
              <motion.p
                initial={{ letterSpacing: '0.4em' }}
                animate={{ letterSpacing: '0.15em' }}
                transition={{ duration: 0.4, ease: 'easeOut', delay: 0.8 }}
                className="text-[var(--aura-slate)] uppercase text-xs md:text-sm font-semibold tracking-widest"
              >
                University AI Assistant
              </motion.p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: shouldReduceMotion ? 1 : 0.94 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: 'spring', bounce: 0.04, duration: 0.6, delay: 0.95 }}
              className="mt-8 border border-[var(--aura-outline-soft)] rounded-full px-6 py-2.5 bg-[var(--aura-surface)] shadow-sm inline-flex flex-col md:flex-row items-center gap-1 md:gap-2 text-sm text-[var(--aura-slate)]"
            >
              <span className="font-semibold text-[var(--aura-ink)]">
                One Assistant for Everything at DAU.
              </span>
              <span className="hidden md:inline text-[var(--aura-outline-soft)]">|</span>
              <span>Built by students, for everyone.</span>
            </motion.div>
          </motion.div>

          {/* Scroll cue — shortened from 2s to 1.2s so it doesn't lag the sequence */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2 }}
            className="mt-20 text-[var(--aura-outline-soft)] animate-bounce"
          >
            ↓
          </motion.div>
        </section>

        {/* BUILDERS SECTION */}
        <motion.section
          variants={sectionReveal}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-10%' }}
          className="bg-[var(--aura-cream-deep)] rounded-[32px] p-6 md:p-12 mb-16 md:mb-24 relative overflow-hidden"
        >
          <div className="relative z-10 mb-12 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
            <div>
              <motion.div variants={sweepEnter} className="aura-eyebrow text-[var(--aura-accent)] mb-2 inline-block">
                THE BUILDERS
              </motion.div>
              <h2 className="aura-heading text-4xl md:text-5xl">Development Team</h2>
            </div>
            <p className="text-[var(--aura-slate)] md:text-right max-w-[280px] text-sm md:text-base leading-relaxed">
              Fourteen students carried AURA from idea to something the whole campus can rely on.
            </p>
          </div>

          {/* Measured container: holds watermark + avatar grid + line overlay, all sharing one coordinate space */}
          <div ref={containerRef} className="relative">
            {/* Watermark — mark only, heavily reduced opacity so it never competes with names.
                Ideally swap /aura-logo.png for a dedicated mark-only asset (no wordmark) —
                the crop below is an approximation via object-position + scale. */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.025] md:opacity-[0.035]">
              <div className="w-[70%] md:w-[38%] aspect-square overflow-hidden">
                <img
                  src="/aura-logo.png"
                  alt=""
                  aria-hidden="true"
                  className="w-full h-auto object-contain object-top scale-[1.4] -translate-y-[6%]"
                />
              </div>
            </div>

            {/* Convergence lines — drawn from REAL measured avatar positions to the
                container's true center, not guessed offsets. Recomputed on resize and
                once the grid's entrance animation finishes. */}
            {!shouldReduceMotion && size.width > 0 && (
              <svg
                className="absolute inset-0 pointer-events-none z-0"
                width={size.width}
                height={size.height}
                viewBox={`0 0 ${size.width} ${size.height}`}
              >
                {lines.map((line, idx) => (
                  <motion.line
                    key={line.id}
                    x1={line.x1}
                    y1={line.y1}
                    x2={line.x2}
                    y2={line.y2}
                    stroke={hoveredIdx === idx ? 'var(--aura-accent-deep)' : 'var(--aura-accent)'}
                    strokeWidth={hoveredIdx === idx ? 1.5 : 1}
                    strokeLinecap="round"
                    initial={{ pathLength: 0, opacity: 0 }}
                    whileInView={{ pathLength: 1, opacity: 0.35 }}
                    viewport={{ once: true, margin: '-10%' }}
                    transition={{ duration: 0.6, delay: idx * 0.035, ease: 'easeOut' }}
                    style={{ transition: 'stroke 150ms, stroke-width 150ms' }}
                  />
                ))}
              </svg>
            )}

            <motion.div
              variants={gridStagger}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: '-10%' }}
              onAnimationComplete={remeasure}
              className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-y-12 gap-x-6 relative z-10"
            >
              {teamMembers.map((member, idx) => (
                <motion.div
                  key={member.name}
                  ref={setNodeRef(idx)}
                  variants={avatarEnter}
                  onHoverStart={() => setHoveredIdx(idx)}
                  onHoverEnd={() => setHoveredIdx(null)}
                  className="flex flex-col items-center group cursor-default"
                >
                  <div className="w-20 h-20 md:w-24 md:h-24 rounded-full border-[2px] border-[var(--aura-outline-soft)] mb-4 flex items-center justify-center transition-all duration-150 group-hover:bg-[var(--aura-accent)] group-hover:border-[var(--aura-accent)] group-hover:scale-[1.04]">
                    <span className="text-xl md:text-2xl font-bold text-[var(--aura-ink)] group-hover:text-white transition-colors duration-150">
                      {getInitials(member.name)}
                    </span>
                  </div>
                  <h3 className="font-medium text-sm md:text-base text-center group-hover:text-[var(--aura-accent-deep)] transition-colors duration-150">
                    {member.name}
                  </h3>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </motion.section>

        {/* GUIDANCE SECTION */}
        <motion.section
          variants={sectionReveal}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-10%' }}
          className="bg-[var(--aura-surface)] border border-[var(--aura-cream-deep)] rounded-[32px] p-6 md:p-12 mb-24"
        >
          <div className="mb-12 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
            <div>
              <motion.div variants={sweepEnter} className="aura-eyebrow text-[var(--aura-accent)] mb-2 inline-block">
                GUIDANCE
              </motion.div>
              <h2 className="aura-heading text-4xl md:text-5xl">Faculty & Mentors</h2>
            </div>
            <p className="text-[var(--aura-slate)] md:text-right max-w-[280px] text-sm md:text-base leading-relaxed">
              The people who set AURA's direction and kept its architecture honest.
            </p>
          </div>

          <div className="flex flex-col md:flex-row gap-12 lg:gap-24 md:items-stretch">
            {/* Left: Mentor List */}
            <motion.div
              variants={gridStagger}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              className="flex-1 flex flex-col gap-8"
            >
              {facultyMembers.map((faculty) => (
                <motion.div key={faculty.name} variants={avatarEnter} className="flex items-center gap-5">
                  <div className="w-16 h-16 shrink-0 rounded-full border-[2px] border-[var(--aura-outline-soft)] flex items-center justify-center bg-transparent">
                    <span className="text-lg font-bold text-[var(--aura-ink)] opacity-80">
                      {getInitials(faculty.name)}
                    </span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">{faculty.name}</h3>
                    <p className="text-sm text-[var(--aura-slate)]">{faculty.role}</p>
                  </div>
                </motion.div>
              ))}
            </motion.div>

            {/* Vertical divider — self-stretch gives it a real height from the flex row,
                so animating scaleY (not height: 0 -> '100%') always resolves correctly. */}
            <div className="hidden md:block relative w-px self-stretch">
              <motion.div
                initial={{ scaleY: 0 }}
                whileInView={{ scaleY: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, ease: 'easeOut' }}
                style={{ transformOrigin: 'top' }}
                className="absolute inset-0 w-px bg-[var(--aura-cream-deep)]"
              />
            </div>
            {/* Horizontal divider for mobile */}
            <div className="md:hidden h-px w-full bg-[var(--aura-cream-deep)]" />

            {/* Right: Quote */}
            <div className="flex-1 py-4 md:py-8">
              <div className="aura-eyebrow text-[var(--aura-slate)] mb-6">A NOTE FROM THEM</div>
              <div className="space-y-6 text-xl md:text-2xl font-serif leading-[1.4] text-[var(--aura-ink)]">
                <p>
                  "From day-to-day searches to timetable confusion, AURA brings everything students
                  need at DAU into one intelligent assistant.
                </p>
                <p>
                  <span className="relative inline-block">
                    <motion.span
                      variants={sweepEnter}
                      initial="hidden"
                      whileInView="show"
                      viewport={{ once: true, margin: '-10%' }}
                      className="absolute inset-0 bg-[var(--aura-cream-deep)] -z-10"
                      style={{ clipPath: 'inset(0 100% 0 0)' }}
                    />
                    This is only Version 1.
                  </span>{' '}
                  More capabilities, more team members, and more faculty mentors will shape what
                  comes next."
                </p>
              </div>
              <div className="mt-8 pt-6 border-t border-[var(--aura-cream-deep)]">
                <p className="font-semibold">Faculty & Mentors</p>
                <p className="text-sm text-[var(--aura-slate)]">AURA · Dhirubhai Ambani University</p>
              </div>
            </div>
          </div>
        </motion.section>
      </main>

      {/* FOOTER */}
      <footer className="border-t border-[var(--aura-cream-deep)] py-12 text-center">
        <div className="flex flex-col items-center gap-6">
          <img
            src="/aura-logo.png"
            alt="AURA Mark"
            className="w-12 h-12 opacity-50 grayscale hover:grayscale-0 hover:opacity-100 transition-all"
          />

          <Link
            to="/"
            className="inline-flex items-center gap-2 px-6 py-2 border border-[var(--aura-outline-soft)] rounded-full text-sm font-medium hover:bg-[var(--aura-surface)] transition-colors group"
          >
            <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" /> Back
            to AURA
          </Link>

          <div className="flex items-center justify-center gap-3 text-xs text-[var(--aura-slate)] mt-6">
            <span>© AURA · DAU</span>
            <span className="w-1 h-1 rounded-full bg-[var(--aura-outline-soft)]" />
            <div className="flex items-center gap-2 border border-[var(--aura-cream-deep)] bg-white px-2.5 py-1 rounded-full">
              <motion.span
                animate={shouldReduceMotion ? {} : { scale: [1, 1.15, 1], opacity: [0.6, 1, 0.6] }}
                transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                className="w-2 h-2 rounded-full bg-[var(--aura-accent)]"
              />
              <span className="font-mono uppercase tracking-wider">Version 1</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default AuraPage;
