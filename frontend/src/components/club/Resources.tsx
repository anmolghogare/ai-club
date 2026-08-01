import { motion } from 'framer-motion';
import { BookOpen, Cpu, Layers, Network } from 'lucide-react';

const resources = [
  { icon: <BookOpen size={20} />, title: 'Python & Data Science foundations', sub: 'Learn NumPy, Pandas, Matplotlib, and EDA basics.', color: 'bg-blue-500/10 text-blue-400 border border-blue-500/20' },
  { icon: <Layers size={20} />, title: 'Machine Learning & Deep Learning', sub: 'From regression fundamentals to PyTorch training loops.', color: 'bg-violet-500/10 text-violet-400 border border-violet-500/20' },
  { icon: <Cpu size={20} />, title: 'Computer Vision & NLP Pipelines', sub: 'Build object detection (YOLO), OpenCV apps, and BERT classification.', color: 'bg-pink-500/10 text-pink-400 border border-pink-500/20' },
  { icon: <Network size={20} />, title: 'Generative AI & LLM Systems', sub: 'Explore prompt engineering, RAG pipelines, and agentic workflows.', color: 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' },
];

export default function Resources() {
  return (
    <section id="resources" className="relative z-[1] max-w-[1200px] mx-auto px-6 md:px-12 py-24">
      <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-80px' }} transition={{ duration: 0.6 }}>
        <p className="section-label">05 — Resources</p>
        <h2 className="font-display font-extrabold text-foreground mb-12" style={{ fontSize: 'clamp(28px, 4vw, 44px)' }}>
          Learning Resources
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {resources.map((r, i) => (
            <motion.a
              key={r.title}
              href="#roadmap"
              className="glass-card relative overflow-hidden flex items-start gap-4 p-6 no-underline group"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              whileHover={{ y: -6, transition: { duration: 0.25 } }}
            >
              <motion.div
                className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${r.color}`}
                whileHover={{ rotate: 15, scale: 1.1 }}
                transition={{ type: 'spring', stiffness: 300 }}
              >
                {r.icon}
              </motion.div>
              <div>
                <h4 className="font-display font-semibold text-sm text-foreground group-hover:text-primary transition-colors duration-300">{r.title}</h4>
                <p className="text-xs text-muted-foreground mt-1.5 leading-relaxed">{r.sub}</p>
              </div>
            </motion.a>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
