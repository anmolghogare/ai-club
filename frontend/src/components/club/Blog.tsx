import { motion } from 'framer-motion';
import { ArrowUpRight, Clock } from 'lucide-react';

const posts = [
  {
    id: 1,
    tag: 'Tutorial',
    tagClass: 'tag-blue',
    title: 'Self-Host n8n for Free: Docker + ngrok Setup That Beats n8n Cloud',
    excerpt: 'Run n8n locally, expose it publicly with ngrok, and unlock Telegram, Gmail, Google Drive, Stripe and hundreds more integrations — completely free.',
    author: 'Jash Shah',
    date: 'May 2026',
    readTime: '7 min read',
    href: 'https://medium.com/@jashshah780',
  },
  {
    id: 2,
    tag: 'Research',
    tagClass: 'tag-green',
    title: 'Mem0: Building AI Agents with Scalable Long-Term Memory',
    excerpt: 'LLMs forget everything between sessions. Mem0 fixes that by extracting key facts from conversations and storing them as a knowledge graph — giving AI a real notebook.',
    author: 'Jash Shah',
    date: 'May 2026',
    readTime: '6 min read',
    href: 'https://medium.com/@jashshah780',
  },
  {
    id: 3,
    tag: 'Project',
    tagClass: 'tag-pink',
    title: 'Social Vault — Stop Hunting for Your Own Links Every Time You Fill a Form',
    excerpt: 'I built a browser extension that stores all your personal links and details so you can copy them with one click. No more jumping between tabs during internship applications.',
    author: 'Jash Shah',
    date: 'May 2026',
    readTime: '4 min read',
    href: 'https://medium.com/@jashshah780',
  },
];

const cardVariants = {
  hidden: { opacity: 0, y: 30, scale: 0.95 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      delay: i * 0.1,
      duration: 0.5,
      ease: [0.25, 0.46, 0.45, 0.94] as const,
    },
  }),
};

export default function Blog() {
  return (
    <section id="blog" className="relative z-[1] max-w-[1200px] mx-auto px-6 md:px-12 py-24">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 0.6 }}
      >
        <p className="section-label">06 — Blog</p>
        <div className="flex items-end justify-between mb-12 flex-wrap gap-4">
          <h2
            className="font-display font-extrabold text-foreground"
            style={{ fontSize: 'clamp(28px, 4vw, 44px)' }}
          >
            Latest from the Club
          </h2>
          <motion.a
            href="https://medium.com/@jashshah780"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-primary font-medium inline-flex items-center gap-1 transition-all"
            whileHover={{ gap: '8px' } as any}
          >
            View all posts <ArrowUpRight size={14} />
          </motion.a>
        </div>

        {/* Featured post */}
        <motion.a
          href={posts[0].href}
          target="_blank"
          rel="noopener noreferrer"
          className="glass-card relative overflow-hidden p-8 md:p-10 mb-6 group cursor-pointer block"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
          whileHover={{ y: -6, transition: { duration: 0.25 } }}
        >
          <div className="flex flex-col md:flex-row md:items-start gap-6">
            <div className="flex-1">
              <span className={`${posts[0].tagClass} font-mono text-[10px] tracking-widest uppercase px-3 py-1 rounded`}>
                {posts[0].tag}
              </span>
              <h3 className="font-display font-bold text-xl md:text-2xl text-foreground mt-4 mb-3 group-hover:text-primary transition-colors duration-300">
                {posts[0].title}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed max-w-xl">
                {posts[0].excerpt}
              </p>
              <div className="flex items-center gap-4 mt-5 text-xs text-muted-foreground">
                <span className="font-medium text-foreground">{posts[0].author}</span>
                <span className="w-1 h-1 bg-muted-foreground rounded-full" />
                <span>{posts[0].date}</span>
                <span className="w-1 h-1 bg-muted-foreground rounded-full" />
                <span className="inline-flex items-center gap-1">
                  <Clock size={11} /> {posts[0].readTime}
                </span>
              </div>
            </div>
            <motion.div
              className="hidden md:flex items-center justify-center w-12 h-12 rounded-full border border-border text-muted-foreground group-hover:border-primary group-hover:text-primary transition-colors flex-shrink-0 mt-2"
              whileHover={{ rotate: 45 }}
              transition={{ duration: 0.3 }}
            >
              <ArrowUpRight size={20} />
            </motion.div>
          </div>
        </motion.a>

        {/* Post grid — 2 remaining posts */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {posts.slice(1).map((post, i) => (
            <motion.a
              key={post.id}
              href={post.href}
              target="_blank"
              rel="noopener noreferrer"
              custom={i}
              variants={cardVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-40px' }}
              whileHover={{ y: -6, transition: { duration: 0.25 } }}
              className="glass-card relative overflow-hidden p-7 group cursor-pointer flex flex-col"
            >
              <span className={`${post.tagClass} font-mono text-[10px] tracking-widest uppercase px-3 py-1 rounded self-start`}>
                {post.tag}
              </span>
              <h4 className="font-display font-bold text-base text-foreground mt-4 mb-2 group-hover:text-primary transition-colors duration-300 leading-snug">
                {post.title}
              </h4>
              <p className="text-sm text-muted-foreground leading-relaxed flex-1">
                {post.excerpt}
              </p>
              <div className="flex items-center gap-3 mt-5 pt-4 border-t border-border text-xs text-muted-foreground">
                <span className="font-medium text-foreground">{post.author}</span>
                <span className="w-1 h-1 bg-muted-foreground rounded-full" />
                <span className="inline-flex items-center gap-1">
                  <Clock size={10} /> {post.readTime}
                </span>
                <ArrowUpRight size={12} className="ml-auto text-primary opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            </motion.a>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
