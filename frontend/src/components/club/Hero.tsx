import { useEffect, useState } from 'react';
import { motion, useMotionValue, useTransform, animate } from 'framer-motion';
import { ArrowRight, Users, Zap, Trophy, Github, MessageCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import aiClubLogo from '@/assets/ai-club-logo.jpeg';

/* ─── Animated counter ─────────────────────────────────────────── */
function AnimatedCounter({ value, suffix }: { value: number; suffix: string }) {
  const count = useMotionValue(0);
  const rounded = useTransform(count, (v) => Math.floor(v));
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    const controls = animate(count, value, { duration: 2.2, ease: 'easeOut' });
    const unsub = rounded.on('change', (v) => setDisplay(v));
    return () => { controls.stop(); unsub(); };
  }, [count, rounded, value]);

  return <>{display}{suffix}</>;
}

/* ─── Tech pill ────────────────────────────────────────────────── */
function TechPill({ label, color }: { label: string; color: string }) {
  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-mono font-semibold border backdrop-blur-sm ${color}`}>
      <span className="w-1.5 h-1.5 rounded-full bg-current opacity-80" />
      {label}
    </span>
  );
}

/* ─── Stats ────────────────────────────────────────────────────── */
const stats = [
  { value: 25, suffix: '+', label: 'Active Members', icon: Users, color: 'text-primary' },
  { value: 8,  suffix: '+', label: 'Projects Shipped', icon: Zap, color: 'text-accent' },
  { value: 20, suffix: '+', label: 'Events Hosted', icon: Trophy, color: 'text-[hsl(340_82%_60%)]' },
];

/* ─── Animation variants ───────────────────────────────────────── */
const container = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.12, delayChildren: 0.1 } },
};
const item = {
  hidden: { opacity: 0, y: 28, filter: 'blur(8px)' },
  visible: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 0.65, ease: [0.25, 0.46, 0.45, 0.94] as const } },
};

/* ─── Floating card data ───────────────────────────────────────── */
const floatingCards = [
  { label: 'Neural Network Training', value: '98.4%', sub: 'Accuracy', color: 'from-blue-500/20 to-cyan-500/10', border: 'border-blue-500/30', delay: 0 },
  { label: 'Model Inference', value: '12ms', sub: 'Latency', color: 'from-violet-500/20 to-purple-500/10', border: 'border-violet-500/30', delay: 0.8 },
  { label: 'Dataset Processed', value: '50K+', sub: 'Samples', color: 'from-emerald-500/20 to-teal-500/10', border: 'border-emerald-500/30', delay: 1.6 },
];

/* ─── Hero ─────────────────────────────────────────────────────── */
export default function Hero() {
  return (
    <section
      id="hero"
      className="relative z-[1] min-h-screen flex items-center max-w-7xl mx-auto px-6 md:px-12 lg:px-16 pt-24 pb-16 overflow-hidden"
    >
      {/* Radial glow blobs */}
      <div className="pointer-events-none select-none absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute top-1/4 left-1/3 w-[500px] h-[500px] rounded-full bg-primary/8 blur-[120px]" />
        <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] rounded-full bg-accent/6 blur-[100px]" />
        <div className="absolute top-1/2 left-0 w-[300px] h-[300px] rounded-full bg-[hsl(340_82%_55%/0.05)] blur-[80px]" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center w-full">

        {/* ── Left column ──────────────────────────────────── */}
        <motion.div variants={container} initial="hidden" animate="visible">

          {/* Club identity pill */}
          <motion.div variants={item} className="mb-8">
            <div className="inline-flex items-center gap-3 pl-2 pr-4 py-2 rounded-full border border-border/60 bg-card/50 backdrop-blur-sm">
              <img src={aiClubLogo} alt="AI Club DAU" className="w-8 h-8 rounded-full object-contain" />
              <div className="flex flex-col leading-none">
                <span className="text-[10px] font-mono text-primary tracking-[3px] uppercase">AI Club DAU</span>
                <span className="text-[10px] text-muted-foreground tracking-wider">Dhirubhai Ambani University</span>
              </div>
              <span className="flex items-center gap-1 ml-1 text-[10px] font-mono text-accent bg-accent/10 border border-accent/25 px-2 py-0.5 rounded-full">
                <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
                Active
              </span>
            </div>
          </motion.div>

          {/* Main headline */}
          <motion.h1
            variants={item}
            className="font-display font-extrabold leading-[0.93] mb-7 text-foreground"
            style={{ fontSize: 'clamp(36px, 5vw, 76px)' }}
          >
            Building the{' '}
            <span
              className="inline-block bg-clip-text text-transparent animate-pulse"
              style={{ backgroundImage: 'linear-gradient(135deg, hsl(195 100% 60%), hsl(270 90% 70%))', animationDuration: '4s' }}
            >
              Future
            </span>
            {' '}of{' '}
            <span
              className="inline-block"
              style={{ WebkitTextStroke: '2px hsl(195 100% 50% / 0.6)', color: 'transparent', textShadow: '0 0 40px hsl(195 100% 50% / 0.4)' }}
            >
              AI
            </span>
            {' '}Together.
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            variants={item}
            className="max-w-lg text-muted-foreground text-base md:text-lg leading-relaxed mb-10"
          >
            DAU's premier AI community — where students research, build, and ship{' '}
            <span className="text-foreground font-medium">real-world AI projects</span>. Join us to learn, collaborate, and grow.
          </motion.p>

          {/* CTA buttons */}
          <motion.div variants={item} className="flex flex-wrap gap-4 mb-12">
            <Link
              to="/projects"
              className="group inline-flex items-center gap-2 px-8 py-4 rounded-full text-sm md:text-base font-bold text-primary-foreground btn-glow bg-primary hover:bg-primary/90 transition-all shadow-[0_0_24px_hsl(217_91%_60%/0.35)]"
            >
              View Projects
              <ArrowRight size={18} className="group-hover:translate-x-1.5 transition-transform duration-300" />
            </Link>
            <a
              href="https://discord.gg/yB3Huet5"
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center gap-2 px-8 py-4 rounded-full text-sm md:text-base font-semibold text-foreground border border-white/10 bg-white/5 hover:bg-white/10 backdrop-blur-md transition-all hover:border-primary/40 hover:shadow-[0_0_20px_rgba(255,255,255,0.1)] duration-300"
            >
              <MessageCircle size={18} className="text-[#5865F2]" />
              Join Discord
            </a>
            <a
              href="https://github.com/ai-club-dau"
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center gap-2 px-8 py-4 rounded-full text-sm md:text-base font-semibold text-foreground border border-white/10 bg-white/5 hover:bg-white/10 backdrop-blur-md transition-all hover:border-primary/40 hover:shadow-[0_0_20px_rgba(255,255,255,0.1)] duration-300"
            >
              <Github size={18} />
              GitHub
            </a>
          </motion.div>

          {/* Tech stack */}
          <motion.div variants={item} className="flex flex-wrap gap-2 mb-12">
            {[
              { label: 'PyTorch', color: 'bg-orange-500/10 text-orange-400 border-orange-500/25' },
              { label: 'TensorFlow', color: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/25' },
              { label: 'Scikit-learn', color: 'bg-blue-500/10 text-blue-400 border-blue-500/25' },
              { label: 'LangChain', color: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/25' },
              { label: 'FastAPI', color: 'bg-teal-500/10 text-teal-400 border-teal-500/25' },
              { label: 'OpenCV', color: 'bg-violet-500/10 text-violet-400 border-violet-500/25' },
            ].map((t) => (
              <TechPill key={t.label} label={t.label} color={t.color} />
            ))}
          </motion.div>

          {/* Stats row */}
          <motion.div
            variants={item}
            className="flex flex-wrap gap-8 pt-8 border-t border-border/60"
          >
            {stats.map((s) => {
              const Icon = s.icon;
              return (
                <motion.div
                  key={s.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.8 }}
                  className="group"
                >
                  <div className={`flex items-baseline gap-1 font-display text-3xl font-extrabold ${s.color}`}>
                    <AnimatedCounter value={s.value} suffix={s.suffix} />
                  </div>
                  <div className="flex items-center gap-1.5 mt-1">
                    <Icon size={11} className="text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">{s.label}</span>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </motion.div>

        {/* ── Right column: animated showcase ──────────────── */}
        <motion.div
          className="hidden lg:flex flex-col items-center justify-center gap-4 relative"
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.9, delay: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          {/* Central glow orb */}
          <div className="relative w-full aspect-square max-w-[420px]">
            {/* Outer ring */}
            <motion.div
              className="absolute inset-0 rounded-full border border-primary/15"
              animate={{ rotate: 360 }}
              transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
            />
            {/* Middle ring with dashes */}
            <motion.div
              className="absolute inset-8 rounded-full border border-dashed border-accent/20"
              animate={{ rotate: -360 }}
              transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
            />
            {/* Inner glow circle */}
            <div className="absolute inset-16 rounded-full bg-gradient-to-br from-primary/20 via-accent/10 to-transparent blur-xl" />

            {/* Center logo */}
            <div className="absolute inset-0 flex items-center justify-center">
              <motion.div
                className="relative"
                animate={{ y: [-6, 6, -6] }}
                transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
              >
                <div className="absolute -inset-4 rounded-3xl bg-gradient-to-br from-primary/30 to-accent/20 blur-2xl" />
                <div className="relative w-24 h-24 rounded-2xl overflow-hidden border border-border/60 shadow-2xl bg-card">
                  <img src={aiClubLogo} alt="AI Club DAU" className="w-full h-full object-contain" />
                </div>
              </motion.div>
            </div>

            {/* Orbiting dot */}
            <motion.div
              className="absolute inset-0"
              animate={{ rotate: 360 }}
              transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
            >
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-primary shadow-[0_0_12px_hsl(217_91%_60%/0.8)]" />
            </motion.div>
            <motion.div
              className="absolute inset-8"
              animate={{ rotate: -360 }}
              transition={{ duration: 12, repeat: Infinity, ease: 'linear' }}
            >
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-accent shadow-[0_0_8px_hsl(160_90%_43%/0.8)]" />
            </motion.div>

            {/* Floating stat cards */}
            {floatingCards.map((card, i) => (
              <motion.div
                key={card.label}
                className={`absolute bg-gradient-to-br ${card.color} backdrop-blur-md border ${card.border} rounded-xl px-4 py-3 min-w-[130px] shadow-lg`}
                style={{
                  top: i === 0 ? '8%' : i === 1 ? '72%' : '38%',
                  left: i === 0 ? '-10%' : i === 1 ? '60%' : '-14%',
                }}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1, y: [0, -6, 0] }}
                transition={{
                  opacity: { delay: 0.8 + card.delay, duration: 0.4 },
                  scale: { delay: 0.8 + card.delay, duration: 0.4 },
                  y: { duration: 3 + i, repeat: Infinity, ease: 'easeInOut', delay: card.delay },
                }}
              >
                <p className="text-[9px] font-mono text-muted-foreground tracking-widest uppercase mb-1">{card.label}</p>
                <p className="font-display font-extrabold text-xl text-foreground leading-none">{card.value}</p>
                <p className="text-[10px] text-muted-foreground mt-0.5">{card.sub}</p>
              </motion.div>
            ))}
          </div>

          {/* Caption label */}
          <motion.p
            className="text-[10px] font-mono text-muted-foreground/50 tracking-[4px] uppercase mt-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5 }}
          >
            Powered by curiosity &amp; coffee ☕
          </motion.p>
        </motion.div>

      </div>
    </section>
  );
}
