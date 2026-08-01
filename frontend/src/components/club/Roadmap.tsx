import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Brain, Sparkles, ChevronDown, CheckCircle2, Circle,
  BookOpen, Code2, BarChart3, Layers, Cpu, Zap, Bot, Network
} from 'lucide-react';

/* ─── DATA ───────────────────────────────────────────────────────── */

const ML_ROADMAP = [
  {
    phase: 'Phase 1',
    title: 'Mathematics & Python Foundations',
    duration: '4–6 weeks',
    color: 'from-blue-500 to-cyan-500',
    icon: BookOpen,
    topics: [
      'Linear Algebra — vectors, matrices, eigenvalues',
      'Calculus — derivatives, gradients, chain rule',
      'Probability & Statistics — distributions, Bayes theorem',
      'Python — NumPy, Pandas, Matplotlib',
      'Data Wrangling & EDA (Exploratory Data Analysis)',
    ],
  },
  {
    phase: 'Phase 2',
    title: 'Classical Machine Learning',
    duration: '6–8 weeks',
    color: 'from-violet-500 to-purple-500',
    icon: BarChart3,
    topics: [
      'Supervised Learning — Linear & Logistic Regression',
      'Decision Trees, Random Forests, Gradient Boosting (XGBoost)',
      'Unsupervised Learning — K-Means, DBSCAN, PCA',
      'Model Evaluation — Bias-Variance, Cross-Validation, Metrics',
      'Feature Engineering & Selection',
    ],
  },
  {
    phase: 'Phase 3',
    title: 'Deep Learning',
    duration: '6–8 weeks',
    color: 'from-pink-500 to-rose-500',
    icon: Layers,
    topics: [
      'Neural Networks from scratch — forward & backprop',
      'PyTorch — tensors, autograd, training loops',
      'CNNs — image classification, transfer learning',
      'RNNs & LSTMs — sequence modelling',
      'Regularisation — Dropout, BatchNorm, Weight Decay',
    ],
  },
  {
    phase: 'Phase 4',
    title: 'Specialisations',
    duration: '4–6 weeks (pick one)',
    color: 'from-orange-500 to-amber-500',
    icon: Cpu,
    topics: [
      'Computer Vision — Object Detection (YOLO), Segmentation',
      'NLP — Transformers, BERT, text classification',
      'Reinforcement Learning — MDPs, Q-Learning, PPO',
      'Time-Series — ARIMA, Prophet, LSTM for forecasting',
      'Recommendation Systems — Collaborative Filtering, Matrix Factorisation',
    ],
  },
  {
    phase: 'Phase 5',
    title: 'MLOps & Deployment',
    duration: '3–4 weeks',
    color: 'from-teal-500 to-emerald-500',
    icon: Code2,
    topics: [
      'Model Packaging — ONNX, TorchScript, TFLite',
      'REST APIs — FastAPI + Docker containers',
      'Experiment Tracking — MLflow, Weights & Biases',
      'Cloud Deployment — AWS SageMaker / GCP Vertex AI',
      'CI/CD Pipelines for ML (GitHub Actions)',
    ],
  },
];

const GENAI_ROADMAP = [
  {
    phase: 'Phase 1',
    title: 'Foundations of Generative AI',
    duration: '3–4 weeks',
    color: 'from-fuchsia-500 to-pink-500',
    icon: BookOpen,
    topics: [
      'What is Generative AI — overview & landscape',
      'Transformers & Attention Mechanism in depth',
      'Tokenisation, Embeddings & Vector Spaces',
      'Prompt Engineering — zero-shot, few-shot, chain-of-thought',
      'Using OpenAI / Gemini APIs effectively',
    ],
  },
  {
    phase: 'Phase 2',
    title: 'Large Language Models',
    duration: '5–6 weeks',
    color: 'from-indigo-500 to-blue-500',
    icon: Bot,
    topics: [
      'LLM Internals — pretraining, RLHF, alignment',
      'Fine-Tuning — LoRA, QLoRA, Instruction Tuning',
      'Retrieval-Augmented Generation (RAG)',
      'LangChain & LlamaIndex frameworks',
      'Evaluation — ROUGE, BERTScore, LLM-as-judge',
    ],
  },
  {
    phase: 'Phase 3',
    title: 'Multimodal & Diffusion Models',
    duration: '4–5 weeks',
    color: 'from-rose-500 to-orange-500',
    icon: Sparkles,
    topics: [
      'Diffusion Models — DDPM, DDIM, score matching',
      'Stable Diffusion — architecture & fine-tuning (DreamBooth, LoRA)',
      'Vision-Language Models — CLIP, LLaVA, GPT-4V',
      'Audio Generation — text-to-speech, music generation',
      'Video Generation — overview of Sora, RunwayML',
    ],
  },
  {
    phase: 'Phase 4',
    title: 'Agents & Agentic Systems',
    duration: '4–5 weeks',
    color: 'from-emerald-500 to-teal-500',
    icon: Network,
    topics: [
      'AI Agents — ReAct, plan-and-execute patterns',
      'Tool Use — function calling, code execution',
      'Memory Systems — short-term, long-term, episodic',
      'Multi-Agent Frameworks — AutoGen, CrewAI',
      'Building production agentic pipelines',
    ],
  },
  {
    phase: 'Phase 5',
    title: 'GenAI in Production',
    duration: '3–4 weeks',
    color: 'from-yellow-500 to-amber-500',
    icon: Zap,
    topics: [
      'LLM Ops — latency, cost optimisation, caching',
      'Guardrails — safety filters, hallucination detection',
      'Vector Databases — Pinecone, Weaviate, pgvector',
      'Streaming responses & real-time UX',
      'Monitoring & observability for LLM apps',
    ],
  },
];

/* ─── PHASE CARD ─────────────────────────────────────────────────── */

function PhaseCard({ phase, index }: { phase: typeof ML_ROADMAP[0]; index: number }) {
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
  gradient: string; data: typeof ML_ROADMAP; delay?: number;
}) {
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
          production-ready in Machine Learning and Generative AI.
        </p>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-12">
          <RoadmapColumn
            title="Machine Learning"
            subtitle="~6–7 months end-to-end"
            icon={Brain}
            gradient="from-blue-500 to-violet-500"
            data={ML_ROADMAP}
            delay={0}
          />
          <RoadmapColumn
            title="Generative AI"
            subtitle="~4–5 months end-to-end"
            icon={Sparkles}
            gradient="from-fuchsia-500 to-rose-500"
            data={GENAI_ROADMAP}
            delay={0.15}
          />
        </div>
      </motion.div>
    </section>
  );
}
