import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Cpu, Terminal, Sparkles, Activity, Layers, ArrowRight, Zap, Code, Database } from 'lucide-react';

const stats = [
  { label: 'FOUNDED', value: '2023' },
  { label: 'MEMBERS', value: '180+' },
  { label: 'MEETS', value: 'Wed · 7pm · LT-1' },
  { label: 'COST', value: 'Free' },
];

const inputChips = ['transformer', 'attention_is_all_you_need', 'pytorch_2.4', 'cuda_12', 'vLLM', 'diffusion'];

export default function Hero() {
  const [activeToken, setActiveToken] = useState(0);
  const [lossValue, setLossValue] = useState(0.842);

  // Simulate live training loss fluctuation for AI vibe
  useEffect(() => {
    const interval = setInterval(() => {
      setLossValue((prev) => Math.max(0.015, +(prev - (Math.random() * 0.02 - 0.008)).toFixed(4)));
      setActiveToken((prev) => (prev + 1) % inputChips.length);
    }, 1400);
    return () => clearInterval(interval);
  }, []);

  return (
    <section
      id="hero"
      className="relative min-h-screen pt-16 flex flex-col justify-between overflow-hidden bg-gradient-to-b from-slate-50/80 via-white/60 to-slate-100/80"
    >
      {/* Background glowing ambient light blur circles */}
      <div className="absolute top-1/4 left-10 w-96 h-96 bg-indigo-500/15 rounded-full blur-3xl pointer-events-none animate-pulse duration-[6000ms]" />
      <div className="absolute top-1/3 right-12 w-[30rem] h-[30rem] bg-cyan-500/15 rounded-full blur-3xl pointer-events-none animate-pulse duration-[8000ms]" />

      {/* Main hero content container */}
      <div className="max-w-7xl mx-auto w-full px-6 pt-12 pb-10 flex-1 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">
        
        {/* Left Column: Headline & Action CTA */}
        <div className="lg:col-span-7 space-y-8">
          
          {/* Top AI Live Status Pill */}
          <motion.div
            initial={{ opacity: 0, y: -15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-indigo-50 border border-indigo-200/80 text-indigo-700 shadow-sm"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-600"></span>
            </span>
            <span className="font-mono text-xs font-semibold tracking-wide uppercase">DAU Artificial Intelligence Club</span>
            <span className="bg-indigo-200/60 text-indigo-900 text-[10px] font-mono px-2 py-0.5 rounded-full font-bold">2025-26</span>
          </motion.div>

          {/* INPUT Chips Row with interactive highlight */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="flex items-center gap-2 flex-wrap"
          >
            <span className="font-mono text-xs font-bold text-slate-500 tracking-wider uppercase mr-1 flex items-center gap-1.5">
              <Terminal size={14} className="text-indigo-600" /> INPUT_TOKENS:
            </span>
            {inputChips.map((chip, idx) => (
              <motion.span
                key={chip}
                whileHover={{ scale: 1.08 }}
                className={`font-mono text-xs px-2.5 py-1 rounded-md border transition-all duration-300 cursor-pointer ${
                  activeToken === idx
                    ? 'bg-indigo-600 text-white border-indigo-600 shadow-md shadow-indigo-500/20 font-bold'
                    : 'bg-white/80 text-slate-700 border-slate-300/80 hover:border-indigo-400 shadow-2xs'
                }`}
              >
                #{chip}
              </motion.span>
            ))}
          </motion.div>

          {/* Main Headline */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="border-l-4 border-indigo-600 pl-6 space-y-4"
          >
            <h1 className="font-serif font-extrabold text-4xl sm:text-6xl lg:text-7xl text-slate-900 leading-[1.08] tracking-tight">
              We meet to read the paper <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-purple-600 to-cyan-600">nobody assigned.</span>
            </h1>

            <p className="font-sans text-base sm:text-lg text-slate-600 leading-relaxed max-w-2xl">
              Then we build the thing in it. A student-run club at DA-IICT for builders who would rather train a small model badly this week than read about a large one forever.
            </p>
          </motion.div>

          {/* Action buttons & tech tags */}
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45, duration: 0.5 }}
            className="flex flex-wrap items-center gap-4 pt-2"
          >
            <a
              href="https://discord.gg/bU7JdWa6"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2.5 px-7 py-3.5 bg-slate-900 text-white font-mono text-sm font-semibold rounded-xl hover:bg-indigo-600 hover:shadow-lg hover:shadow-indigo-500/30 transition-all duration-300 group"
            >
              <span>Join the club</span>
              <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </a>

            <Link
              to="/events"
              className="inline-flex items-center gap-2 px-7 py-3.5 bg-white text-slate-800 font-mono text-sm font-semibold rounded-xl border border-slate-300 hover:border-indigo-500 hover:bg-indigo-50/50 hover:text-indigo-600 shadow-sm transition-all duration-300"
            >
              <span>See what's on</span>
            </Link>

            <div className="w-full sm:w-auto flex items-center gap-2 text-xs font-mono text-slate-500 pt-2 sm:pt-0 sm:ml-4">
              <Sparkles size={14} className="text-indigo-500 animate-spin duration-[6000ms]" />
              <span>Weekly Workshops & Open Source Projects</span>
            </div>
          </motion.div>
        </div>

        {/* Right Column: Playful AI Training Visualizer Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4, duration: 0.7 }}
          className="lg:col-span-5 relative"
        >
          {/* Floating decorative badge 1 */}
          <motion.div 
            animate={{ y: [0, -8, 0] }}
            transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
            className="absolute -top-6 -left-6 z-20 bg-white/90 backdrop-blur-md p-3 rounded-xl border border-indigo-100 shadow-lg flex items-center gap-2.5 text-xs font-mono text-indigo-900"
          >
            <Cpu size={18} className="text-indigo-600" />
            <div>
              <p className="font-bold leading-none">PyTorch 2.4 GPU</p>
              <p className="text-[10px] text-slate-500 mt-0.5">NVIDIA RTX 4090 · CUDA</p>
            </div>
          </motion.div>

          {/* Floating decorative badge 2 */}
          <motion.div 
            animate={{ y: [0, 8, 0] }}
            transition={{ repeat: Infinity, duration: 5, ease: "easeInOut" }}
            className="absolute -bottom-5 -right-5 z-20 bg-white/90 backdrop-blur-md p-3 rounded-xl border border-emerald-100 shadow-lg flex items-center gap-2.5 text-xs font-mono text-emerald-900"
          >
            <Activity size={18} className="text-emerald-600 animate-pulse" />
            <div>
              <p className="font-bold leading-none">Loss: {lossValue}</p>
              <p className="text-[10px] text-emerald-600 mt-0.5">Converging · Epoch 42/100</p>
            </div>
          </motion.div>

          {/* Main Interactive AI Training Card */}
          <div className="bg-slate-900 text-slate-100 rounded-2xl p-6 border border-slate-800 shadow-2xl relative overflow-hidden group">
            {/* Top terminal bar */}
            <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-5">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-rose-500/80" />
                <div className="w-3 h-3 rounded-full bg-amber-500/80" />
                <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
                <span className="font-mono text-xs text-slate-400 ml-2 font-medium">neural_engine.py</span>
              </div>
              <span className="text-[10px] font-mono bg-indigo-500/20 text-indigo-300 px-2 py-0.5 rounded border border-indigo-500/30">
                ACTIVE_SESSION
              </span>
            </div>

            {/* Neural Net Layer Animation Visualizer */}
            <div className="space-y-4 font-mono text-xs">
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800/80 space-y-3">
                <div className="flex items-center justify-between text-slate-400 text-[11px]">
                  <span className="flex items-center gap-1.5 text-indigo-400">
                    <Layers size={14} /> MultiHeadAttention(d_model=512, heads=8)
                  </span>
                  <span className="text-emerald-400">FPS: 60</span>
                </div>

                {/* Simulated Neural Network Weight Nodes */}
                <div className="grid grid-cols-6 gap-2 py-2">
                  {Array.from({ length: 18 }).map((_, i) => (
                    <motion.div
                      key={i}
                      animate={{
                        opacity: [0.3, 1, 0.3],
                        scale: [0.95, 1.05, 0.95],
                        backgroundColor: i % 3 === 0 ? ['#6366f1', '#a855f7', '#6366f1'] : ['#0f172a', '#1e293b', '#0f172a']
                      }}
                      transition={{
                        repeat: Infinity,
                        duration: 2 + (i % 4) * 0.5,
                        ease: "easeInOut"
                      }}
                      className="h-7 rounded-lg border border-slate-800 flex items-center justify-center text-[10px] font-bold text-indigo-200"
                    >
                      w_{i}
                    </motion.div>
                  ))}
                </div>

                {/* Code snippet line */}
                <div className="text-slate-300 text-[11px] pt-1 border-t border-slate-800/80 flex items-center justify-between">
                  <span className="text-purple-400 font-semibold">&gt; output = model.generate(tokens=512)</span>
                  <span className="text-indigo-400 animate-pulse">▋</span>
                </div>
              </div>

              {/* Status metrics grid */}
              <div className="grid grid-cols-2 gap-3 pt-1">
                <div className="bg-slate-800/50 p-3 rounded-lg border border-slate-800">
                  <p className="text-[10px] text-slate-400 uppercase">Throughput</p>
                  <p className="text-sm font-bold text-cyan-400 mt-0.5 flex items-center gap-1">
                    <Zap size={14} /> 2,450 tokens/sec
                  </p>
                </div>
                <div className="bg-slate-800/50 p-3 rounded-lg border border-slate-800">
                  <p className="text-[10px] text-slate-400 uppercase">VRAM Allocation</p>
                  <p className="text-sm font-bold text-indigo-400 mt-0.5 flex items-center gap-1">
                    <Database size={14} /> 14.2 / 24 GB
                  </p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Stats bar at bottom */}
      <div className="border-t border-slate-200/80 bg-white/80 backdrop-blur-md w-full relative z-10">
        <div className="max-w-7xl mx-auto px-6 py-5 grid grid-cols-2 sm:grid-cols-4 gap-6">
          {stats.map((stat, i) => (
            <div key={stat.label} className={i > 0 ? 'sm:border-l sm:border-slate-200/80 sm:pl-6' : ''}>
              <p className="font-mono text-[11px] tracking-wider uppercase text-indigo-600 font-bold mb-1">
                {stat.label}
              </p>
              <p className="font-sans text-lg sm:text-xl font-extrabold text-slate-900">
                {stat.value}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
