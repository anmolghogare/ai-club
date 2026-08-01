import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ExternalLink, Search, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Project } from '../../data/projects';
import { supabase } from '../../lib/supabase';

// Map tags from projects.ts to display styles
const tagStyleMap: Record<string, { tagClass: string; label: string }> = {
  'Machine Learning':    { tagClass: 'tag-blue',  label: 'Machine Learning' },
  'Full Stack':          { tagClass: 'tag-green', label: 'Full Stack' },
  'Data Science':        { tagClass: 'tag-blue',  label: 'Data Science' },
  'Sports Analytics':    { tagClass: 'tag-green', label: 'Sports Analytics' },
  'Computer Vision':     { tagClass: 'tag-pink',  label: 'Computer Vision' },
  'Object Detection':    { tagClass: 'tag-pink',  label: 'Object Detection' },
  'Retail AI':           { tagClass: 'tag-pink',  label: 'Retail AI' },
  'Deep Learning':       { tagClass: 'tag-blue',  label: 'Deep Learning' },
  'Renewable Energy':    { tagClass: 'tag-green', label: 'Renewable Energy' },
  'Regression':          { tagClass: 'tag-blue',  label: 'Regression' },
  'Forecasting':         { tagClass: 'tag-green', label: 'Forecasting' },
  'Energy':              { tagClass: 'tag-green', label: 'Energy' },
  'Python':              { tagClass: 'tag-blue',  label: 'Python' },
  'OpenCV':              { tagClass: 'tag-pink',  label: 'OpenCV' },
  'LangGraph':           { tagClass: 'tag-blue',  label: 'LangGraph' },
  'Multi-Agent':         { tagClass: 'tag-green', label: 'Multi-Agent' },
  'Recommender System':  { tagClass: 'tag-green', label: 'Recommender System' },
  'GAN':                 { tagClass: 'tag-pink',  label: 'GAN' },
  'Reinforcement Learning': { tagClass: 'tag-pink', label: 'Reinforcement Learning' },
  'NLP':                 { tagClass: 'tag-green', label: 'NLP' },
  'Backend':             { tagClass: 'tag-blue',  label: 'Backend' },
  'Systems':             { tagClass: 'tag-blue',  label: 'Systems' },
};

// Pick the first tag that has a style, for the card badge
function getPrimaryTag(tags: string[]) {
  for (const tag of tags) {
    if (tagStyleMap[tag]) return tagStyleMap[tag];
  }
  return { tagClass: 'tag-blue', label: tags[0] };
}

// Derive unique filter tabs from actual project tags
const categoryOrder = ['all', 'ml', 'cv', 'fullstack', 'energy'];

// Map each project to a simple category for tab filtering
function getCategory(tags: string[]): string {
  if (tags.includes('Computer Vision') || tags.includes('Object Detection')) return 'cv';
  if (tags.includes('Full Stack'))                                             return 'fullstack';
  if (tags.includes('Renewable Energy') || tags.includes('Energy') || tags.includes('Forecasting')) return 'energy';
  if (tags.includes('Machine Learning') || tags.includes('Deep Learning'))    return 'ml';
  return 'ml';
}

const tabLabels: Record<string, string> = {
  all:      'ALL',
  ml:       'ML / AI',
  cv:       'COMPUTER VISION',
  fullstack:'FULL STACK',
  energy:   'ENERGY',
};

export default function Projects({ isHomepage = false }: { isHomepage?: boolean }) {
  const [activeTab, setActiveTab] = useState('all');
  const [projectList, setProjectList] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const { data, error } = await supabase
          .from('club_projects')
          .select('*')
          .order('id', { ascending: false });

        if (error) {
          console.error("Supabase error fetching projects", error);
        } else if (data) {
          // Parse tags from database
          const parsedData = data.map((p: any) => {
            let tagsList: string[] = [];
            if (p.tags) {
              try {
                const parsed = JSON.parse(p.tags);
                tagsList = Array.isArray(parsed) ? parsed : [String(parsed)];
              } catch (e) {
                tagsList = p.tags.split(',').map((t: string) => t.trim()).filter(Boolean);
              }
            }
            return {
              id: p.id,
              title: p.title,
              author: p.author,
              authorId: p.author_id,
              description: p.description,
              tags: tagsList,
              githubLink: p.github_link
            };
          });
          setProjectList(parsedData);
        }
      } catch (err) {
        console.error("Failed to fetch projects", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, []);

  const filtered = projectList.filter((p) => {
    if (!isHomepage && searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase();
      const matchesSearch = p.title.toLowerCase().includes(q) ||
                            p.author.toLowerCase().includes(q) ||
                            p.description.toLowerCase().includes(q) ||
                            p.tags.some(tag => tag.toLowerCase().includes(q));
      if (!matchesSearch) return false;
    }
    return isHomepage || activeTab === 'all' || getCategory(p.tags) === activeTab;
  });

  const displayedProjects = isHomepage ? filtered.slice(0, 3) : filtered;

  return (
    <section id="projects" className="relative z-[1] max-w-[1200px] mx-auto px-6 md:px-12 py-24">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 0.6 }}
      >
        <p className="section-label">02 — Projects</p>
        <h2 className="font-display font-extrabold text-foreground mb-12" style={{ fontSize: 'clamp(28px, 4vw, 44px)' }}>
          Student Projects
        </h2>

        {/* Search Bar */}
        {!isHomepage && (
          <div className="relative w-full max-w-md mb-8">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-muted-foreground">
              <Search size={16} className="text-primary/60" />
            </span>
            <input
              type="text"
              placeholder="Search projects by title, author, or tag..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-secondary/80 border border-border rounded-xl pl-10 pr-4 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 transition-colors"
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery('')} className="absolute inset-y-0 right-0 flex items-center pr-3 text-xs text-muted-foreground hover:text-foreground">Clear</button>
            )}
          </div>
        )}

        {/* Tabs */}
        {!isHomepage && (
          <div className="flex gap-1 border-b border-border mb-10 flex-wrap">
            {categoryOrder.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`relative px-5 py-2.5 text-sm font-medium -mb-px transition-colors ${
                  activeTab === tab ? 'text-foreground' : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {tabLabels[tab]}
                {activeTab === tab && (
                  <motion.div
                    layoutId="project-tab-indicator"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"
                    transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                  />
                )}
              </button>
            ))}
          </div>
        )}

        {loading ? (
          <div className="text-center text-muted-foreground text-sm py-12">Loading projects...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            <AnimatePresence mode="popLayout">
              {displayedProjects.map((p, i) => {
                const { tagClass, label } = getPrimaryTag(p.tags);
                // Handle both CamelCase and SnakeCase from API/static definitions
                const gitLink = (p as any).github_link || p.githubLink || '';
                return (
                  <motion.div
                    key={p.id}
                    layout
                    initial={{ opacity: 0, scale: 0.9, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0, transition: { delay: i * 0.1, duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number] } }}
                    exit={{ opacity: 0, scale: 0.9, y: -10, transition: { duration: 0.25 } }}
                    whileHover={{ y: -6, transition: { duration: 0.25 } }}
                    className="glass-card relative overflow-hidden p-7 cursor-pointer"
                  >
                    {/* Primary tag badge */}
                    <span className={`${tagClass} font-mono text-[10px] tracking-widest uppercase px-3 py-1 rounded`}>
                      {label}
                    </span>

                    {/* Title */}
                    <h4 className="font-display font-bold text-lg text-foreground mt-4 mb-1">{p.title}</h4>

                    {/* Author */}
                    <p className="text-xs text-muted-foreground mb-2">by {p.author}</p>

                    {/* Description */}
                    <p className="text-sm text-muted-foreground leading-relaxed">{p.description}</p>

                    {/* All tags */}
                    <div className="flex flex-wrap gap-1.5 mt-3">
                      {p.tags.slice(0, 4).map((tag) => (
                        <span
                          key={tag}
                          className="text-[10px] font-mono text-muted-foreground border border-border rounded px-2 py-0.5"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>

                    {/* GitHub link */}
                    <motion.div className="mt-5" whileHover={{ x: 4 }} transition={{ duration: 0.2 }}>
                      <a
                        href={gitLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="inline-flex items-center gap-1.5 text-xs text-primary border border-primary/25 rounded-md px-3 py-1 hover:bg-primary/10 transition-colors"
                      >
                        <ExternalLink size={12} /> GitHub
                      </a>
                    </motion.div>
                  </motion.div>
                );
              })}
            </AnimatePresence>

            {displayedProjects.length === 0 && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-muted-foreground text-sm col-span-full"
              >
                No projects found.
              </motion.p>
            )}
          </div>
        )}

        {/* View All Projects CTA on Homepage */}
        {isHomepage && (
          <div className="flex justify-center mt-12">
            <Link
              to="/projects"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-primary-foreground font-semibold hover:bg-primary/95 transition-all shadow-[0_0_20px_rgba(37,99,235,0.25)] hover:scale-105 duration-300"
            >
              Browse All Projects <ArrowRight size={16} />
            </Link>
          </div>
        )}
      </motion.div>
    </section>
  );
}
