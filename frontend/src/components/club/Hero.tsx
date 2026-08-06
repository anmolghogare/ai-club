import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Cpu, Terminal, Sparkles, Activity, Layers, ArrowRight, Zap, Code, Bot, GraduationCap, Network, Brain } from 'lucide-react';

const stats = [
  { label: 'FOUNDED', value: '2023' },
  { label: 'MEMBERS', value: '180+' },
  { label: 'MEETS', value: 'Wed · 7pm · LT-1' },
  { label: 'COST', value: 'Free' },
];

const inputChips = ['transformer', 'attention_is_all_you_need', 'pytorch_2.4', 'cuda_12', 'vLLM', 'diffusion'];

export default function Hero() {
  const [activeToken, setActiveToken] = useState(0);
  const [activeNode, setActiveNode] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveToken((prev) => (prev + 1) % inputChips.length);
      setActiveNode((prev) => (prev + 1) % 6);
    }, 1500);
    return () => clearInterval(interval);
  }, []);

  return (
    <section
      id="hero"
      className="relative min-h-screen pt-16 flex flex-col justify-between overflow-hidden bg-gradient-to-b from-slate-50/90 via-indigo-50/30 to-slate-100/90"
    >
      {/* Background glowing ambient light blur circles */}
      <div className="absolute top-1/4 left-10 w-96 h-96 bg-indigo-500/15 rounded-full blur-3xl pointer-events-none animate-pulse duration-[6000ms]" />
      <div className="absolute top-1/3 right-12 w-[30rem] h-[30rem] bg-cyan-500/15 rounded-full blur-3xl pointer-events-none animate-pulse duration-[8000ms]" />

      {/* Main hero content container */}
      <div className="max-w-7xl mx-auto w-full px-6 pt-10 pb-10 flex-1 grid grid-cols-1 lg:grid-cols-12 gap-10 items-center relative z-10">
        
        {/* Left Column: Headline & Action CTA */}
        <div className="lg:col-span-7 space-y-7">
          
          {/* Top AI Live Status Pill */}
          <motion.div
            initial={{ opacity: 0, y: -15 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ scale: 1.04, y: -2 }}
            transition={{ type: 'spring', stiffness: 400, damping: 25 }}
            className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-white border border-indigo-200 text-indigo-700 shadow-sm cursor-pointer"
          >
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-indigo-600"></span>
            </span>
            <GraduationCap size={16} className="text-indigo-600" />
            <span className="font-mono text-xs font-bold tracking-wide uppercase">DAU · Dhirubhai Ambani University</span>
            <span className="bg-indigo-600 text-white text-[10px] font-mono px-2.5 py-0.5 rounded-full font-extrabold shadow-xs">AI Club</span>
          </motion.div>

          {/* INPUT Chips Row with interactive pop */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="flex items-center gap-2 flex-wrap"
          >
            <span className="font-mono text-xs font-extrabold text-slate-500 tracking-wider uppercase mr-1 flex items-center gap-1.5">
              <Terminal size={14} className="text-indigo-600" /> INPUT_TOKENS:
            </span>
            {inputChips.map((chip, idx) => (
              <motion.span
                key={chip}
                whileHover={{ scale: 1.12, y: -3 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setActiveToken(idx)}
                className={`font-mono text-xs px-3 py-1.5 rounded-lg border transition-all duration-200 cursor-pointer select-none ${
                  activeToken === idx
                    ? 'bg-indigo-600 text-white border-indigo-600 shadow-md shadow-indigo-500/25 font-bold scale-105'
                    : 'bg-white text-slate-700 border-slate-200 hover:border-indigo-400 hover:shadow-sm'
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
              Then we build the thing in it. A student-run club at Dhirubhai Ambani University for builders who would rather train a small model badly this week than read about a large one forever.
            </p>
          </motion.div>

          {/* Playful Action buttons */}
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45, duration: 0.5 }}
            className="flex flex-wrap items-center gap-4 pt-2"
          >
            <motion.a
              href="https://discord.gg/bU7JdWa6"
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.06, y: -4 }}
              whileTap={{ scale: 0.95 }}
              className="inline-flex items-center gap-2.5 px-7 py-3.5 bg-slate-900 text-white font-mono text-sm font-bold rounded-xl hover:bg-indigo-600 shadow-md hover:shadow-xl hover:shadow-indigo-500/30 transition-colors duration-200 group"
            >
              <span>Join the club</span>
              <ArrowRight size={16} className="group-hover:translate-x-1.5 transition-transform" />
            </motion.a>

            <motion.div
              whileHover={{ scale: 1.06, y: -4 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link
                to="/events"
                className="inline-flex items-center gap-2 px-7 py-3.5 bg-white text-slate-800 font-mono text-sm font-bold rounded-xl border border-slate-300 hover:border-indigo-500 hover:bg-indigo-50/60 hover:text-indigo-600 shadow-sm hover:shadow-md transition-colors duration-200"
              >
                <span>See what's on</span>
              </Link>
            </motion.div>

            <div className="w-full sm:w-auto flex items-center gap-2 text-xs font-mono text-slate-500 pt-2 sm:pt-0 sm:ml-4">
              <Sparkles size={15} className="text-indigo-500 animate-spin duration-[6000ms]" />
              <span>Weekly Workshops & Hackathons</span>
            </div>
          </motion.div>
        </div>

        {/* Right Column: Playful Animated AI Campus Graphic Component */}
        <motion.div
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4, duration: 0.7 }}
          className="lg:col-span-5 relative flex justify-center"
        >
          {/* Main Playful Interactive Animation Box */}
          <div className="w-full max-w-md bg-white/90 backdrop-blur-xl border border-indigo-100 rounded-3xl p-6 shadow-xl relative overflow-hidden group">
            
            {/* Glowing Accent Border Aura */}
            <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500/10 via-purple-500/10 to-cyan-500/10 rounded-3xl pointer-events-none" />

            {/* Header Title Bar */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-6 relative z-10">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-indigo-100 text-indigo-700">
                  <Brain size={20} />
                </div>
                <div>
                  <h3 className="font-display font-extrabold text-sm text-slate-900">DA-IICT AI Hub</h3>
                  <p className="text-[10px] text-slate-500 font-mono">Neural Network & Robotics Lab</p>
                </div>
              </div>
              <span className="font-mono text-[10px] font-bold bg-emerald-100 text-emerald-700 px-2.5 py-1 rounded-full flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" /> ONLINE
              </span>
            </div>

            {/* Animated Interactive Neural Nodes Canvas */}
            <div className="relative h-64 bg-slate-900 rounded-2xl p-4 overflow-hidden border border-slate-800 flex flex-col justify-between shadow-inner">
              
              {/* Floating tech tags */}
              <div className="flex justify-between items-center relative z-10 text-[11px] font-mono">
                <motion.span 
                  whileHover={{ scale: 1.1 }}
                  className="bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 px-2.5 py-1 rounded-md flex items-center gap-1.5 cursor-pointer"
                >
                  <Bot size={13} /> AI Agent
                </motion.span>
                <motion.span 
                  whileHover={{ scale: 1.1 }}
                  className="bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 px-2.5 py-1 rounded-md flex items-center gap-1.5 cursor-pointer"
                >
                  <Network size={13} /> Graph Neural Net
                </motion.span>
              </div>

              {/* Animated Network Node Constellation */}
              <div className="relative my-auto py-4 flex items-center justify-center gap-6">
                {[
                  { name: 'Data', color: 'bg-indigo-500' },
                  { name: 'Model', color: 'bg-purple-500' },
                  { name: 'Loss', color: 'bg-cyan-500' },
                  { name: 'Deploy', color: 'bg-emerald-500' },
                ].map((node, i) => (
                  <motion.div
                    key={node.name}
                    animate={{
                      y: activeNode === i ? [-6, 6, -6] : [0, 0, 0],
                      scale: activeNode === i ? 1.15 : 1,
                    }}
                    transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
                    whileHover={{ scale: 1.25, rotate: 5 }}
                    className={`flex flex-col items-center gap-1.5 cursor-pointer z-10`}
                  >
                    <div className={`w-12 h-12 rounded-2xl ${node.color} flex items-center justify-center text-white shadow-lg font-bold text-xs border-2 border-white/20`}>
                      {i === 0 && <Database size={18} />}
                      {i === 1 && <Brain size={18} />}
                      {i === 2 && <Activity size={18} />}
                      {i === 3 && <Zap size={18} />}
                    </div>
                    <span className="font-mono text-[10px] text-slate-300 font-semibold">{node.name}</span>
                  </motion.div>
                ))}
              </div>

              {/* Terminal Code Snippet Bar */}
              <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800 text-[11px] font-mono text-slate-300 flex items-center justify-between relative z-10">
                <span className="text-indigo-400 font-bold">&gt; import daiict_ai_club as ai</span>
                <span className="text-emerald-400 font-bold flex items-center gap-1">
                  <Sparkles size={12} className="animate-spin" /> Ready
                </span>
              </div>
            </div>

            {/* Bottom Interactive Feature Chips */}
            <div className="grid grid-cols-3 gap-2.5 mt-4">
              {[
                { title: 'Student-Run', desc: '100% Peer Led' },
                { title: 'Open Source', desc: 'GitHub First' },
                { title: 'Hands On', desc: 'Weekly Code' },
              ].map((item) => (
                <motion.div
                  key={item.title}
                  whileHover={{ y: -4, scale: 1.05 }}
                  className="bg-indigo-50/70 border border-indigo-100 p-2.5 rounded-xl text-center cursor-pointer shadow-2xs"
                >
                  <p className="font-bold text-xs text-indigo-900">{item.title}</p>
                  <p className="text-[10px] text-indigo-600 font-mono mt-0.5">{item.desc}</p>
                </motion.div>
              ))}
            </div>

          </div>
        </motion.div>
      </div>

      {/* Stats bar at bottom */}
      <div className="border-t border-slate-200/80 bg-white/90 backdrop-blur-md w-full relative z-10">
        <div className="max-w-7xl mx-auto px-6 py-5 grid grid-cols-2 sm:grid-cols-4 gap-6">
          {stats.map((stat, i) => (
            <motion.div 
              key={stat.label} 
              whileHover={{ y: -3, scale: 1.03 }}
              className={`cursor-pointer ${i > 0 ? 'sm:border-l sm:border-slate-200/80 sm:pl-6' : ''}`}
            >
              <p className="font-mono text-[11px] tracking-wider uppercase text-indigo-600 font-bold mb-1">
                {stat.label}
              </p>
              <p className="font-sans text-lg sm:text-xl font-extrabold text-slate-900">
                {stat.value}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
