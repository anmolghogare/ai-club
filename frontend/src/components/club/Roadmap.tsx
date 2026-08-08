import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Brain, Sparkles, ChevronDown, CheckCircle2,
  BookOpen, Code2, BarChart3, Layers, Cpu, Zap, Bot, Network
} from 'lucide-react';
import { getApiUrl } from '../../lib/api';

const IconMap: Record<string, React.ElementType> = {
  BookOpen, BarChart3, Layers, Cpu, Code2, Bot, Sparkles, Network, Zap, Brain
};

type RoadmapPhase = {
  phase: string;
  title: string;
  duration: string;
  color: string;
  icon: React.ElementType;
  topics: string[];
};

const ROADMAP_CONFIG: Record<string, { title: string; subtitle: string; icon: React.ElementType; gradient: string }> = {
  ML: { title: "Machine Learning", subtitle: "End-to-End ML Framework", icon: Brain, gradient: "from-blue-500 to-indigo-500" },
  DL: { title: "Deep Learning", subtitle: "Neural Networks & architectures", icon: Cpu, gradient: "from-emerald-500 to-teal-500" },
  RL: { title: "Reinforcement Learning", subtitle: "Agents & Environments", icon: Network, gradient: "from-rose-500 to-orange-500" },
  GENAI: { title: "Generative AI", subtitle: "GenAI & LLMs", icon: Sparkles, gradient: "from-fuchsia-500 to-rose-500" },
  AGENTIC: { title: "Agentic AI", subtitle: "AI Agents & Multi-Agent", icon: Bot, gradient: "from-amber-500 to-yellow-500" },
  TRANSFORMER: { title: "Transformers", subtitle: "Attention & Sequence Models", icon: Layers, gradient: "from-indigo-500 to-purple-500" },
  LLM: { title: "Large Language Models", subtitle: "LLM Arch & Optimization", icon: Code2, gradient: "from-cyan-500 to-blue-500" },
  NLP: { title: "Natural Language Processing", subtitle: "Text & Language basics", icon: BookOpen, gradient: "from-teal-500 to-emerald-500" }
};

const ROADMAP_ORDER = ['ML', 'DL', 'RL', 'NLP', 'TRANSFORMER', 'GENAI', 'LLM', 'AGENTIC'];

/* ─── PHASE CARD ─────────────────────────────────────────────────── */

function PhaseCard({ phase, index }: { phase: RoadmapPhase; index: number }) {
  const [open, setOpen] = useState(index === 0);
  const Icon = phase.icon;

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="relative"
    >
      {/* connector line */}
      {index !== 4 && (
        <div className="absolute left-5 top-[56px] w-[2px] h-full bg-gradient-to-b from-white/10 to-transparent z-0" />
      )}

      <div className="relative z-10 glass-card overflow-hidden">
        {/* header */}
        <button
          onClick={() => setOpen(!open)}
          className="w-full flex items-center gap-4 p-5 text-left group"
        >
          {/* icon bubble */}
          <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${phase.color} flex items-center justify-center flex-shrink-0 shadow-lg`}>
            <Icon size={18} className="text-white" />
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[11px] font-mono font-semibold uppercase tracking-widest text-muted-foreground">
                {phase.phase}
              </span>
              <span className="text-[11px] px-2 py-0.5 rounded-full bg-white/5 text-muted-foreground font-mono">
                {phase.duration}
              </span>
            </div>
            <h4 className="font-display font-bold text-foreground text-sm mt-0.5 group-hover:text-primary transition-colors">
              {phase.title}
            </h4>
          </div>

          <motion.div
            animate={{ rotate: open ? 180 : 0 }}
            transition={{ duration: 0.3 }}
            className="text-muted-foreground flex-shrink-0"
          >
            <ChevronDown size={18} />
          </motion.div>
        </button>

        {/* topics */}
        <AnimatePresence initial={false}>
          {open && (
            <motion.ul
              key="topics"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.35, ease: 'easeInOut' }}
              className="overflow-hidden"
            >
              <div className="pb-5 px-5 space-y-2">
                {phase.topics.map((topic, ti) => (
                  <motion.li
                    key={topic}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: ti * 0.06 }}
                    className="flex items-start gap-3 text-sm text-muted-foreground"
                  >
                    <CheckCircle2 size={14} className="text-primary flex-shrink-0 mt-0.5" />
                    {topic}
                  </motion.li>
                ))}
              </div>
            </motion.ul>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

/* ─── ROADMAP COLUMN ──────────────────────────────────────────────── */

function RoadmapColumn({
  title, subtitle, icon: Icon, gradient, data, delay = 0,
}: {
  title: string; subtitle: string; icon: React.ElementType;
  gradient: string; data: RoadmapPhase[]; delay?: number;
}) {
  if (!data || data.length === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.6, delay }}
    >
      {/* column header */}
      <div className="flex items-center gap-3 mb-6">
        <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${gradient} flex items-center justify-center shadow-lg`}>
          <Icon size={22} className="text-white" />
        </div>
        <div>
          <h3 className="font-display font-bold text-foreground text-lg leading-tight">{title}</h3>
          <p className="text-xs text-muted-foreground">{subtitle}</p>
        </div>
      </div>

      {/* phases */}
      <div className="space-y-3">
        {data.map((phase, i) => (
          <PhaseCard key={phase.phase} phase={phase} index={i} />
        ))}
      </div>
    </motion.div>
  );
}

/* ─── MAIN COMPONENT ─────────────────────────────────────────────── */

export default function Roadmap() {
  const [roadmaps, setRoadmaps] = useState<Record<string, RoadmapPhase[]>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRoadmaps = async () => {
      try {
        const res = await fetch(getApiUrl('/api/roadmaps'));
        if (!res.ok) throw new Error('Failed to fetch roadmaps');
        const data = await res.json();
        
        const grouped: Record<string, RoadmapPhase[]> = {};
        
        data.forEach((item: any) => {
          const parsedItem: RoadmapPhase = {
            phase: item.phase,
            title: item.title,
            duration: item.duration,
            color: item.color,
            icon: IconMap[item.icon_name] || BookOpen,
            topics: item.topics || []
          };
          if (!grouped[item.roadmap_type]) {
            grouped[item.roadmap_type] = [];
          }
          grouped[item.roadmap_type].push(parsedItem);
        });
        
        setRoadmaps(grouped);
      } catch (err) {
        console.error("Failed to fetch roadmaps", err);
      } finally {
        setLoading(false);
      }
    };
    fetchRoadmaps();
  }, []);

  return (
    <section id="roadmap" className="relative z-[1] max-w-[1200px] mx-auto px-6 md:px-12 py-24">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 0.6 }}
      >
        <p className="section-label">04 — Roadmaps</p>
        <h2
          className="font-display font-extrabold text-foreground mb-4"
          style={{ fontSize: 'clamp(28px, 4vw, 44px)' }}
        >
          Learning Roadmaps
        </h2>
        <p className="text-muted-foreground text-sm mb-14 max-w-xl leading-relaxed">
          Structured, phase-by-phase guides curated by AI Club DAIICT to take you from zero to
          production-ready across various domains in Artificial Intelligence.
        </p>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-12">
          {ROADMAP_ORDER.map((type, i) => {
            const config = ROADMAP_CONFIG[type];
            if (!config) return null;
            return (
              <RoadmapColumn
                key={type}
                title={config.title}
                subtitle={config.subtitle}
                icon={config.icon}
                gradient={config.gradient}
                data={roadmaps[type]}
                delay={i % 2 === 0 ? 0 : 0.15}
              />
            );
          })}
        </div>
      </motion.div>
    </section>
  );
}
