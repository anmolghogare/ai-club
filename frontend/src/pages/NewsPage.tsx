import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ExternalLink, Newspaper, X } from 'lucide-react';
import Navbar from '@/components/club/Navbar';
import Footer from '@/components/club/Footer';
import Chatbot from '@/components/club/Chatbot';
import { getApiUrl } from '@/lib/api';

interface NewsModel {
  id: number;
  title?: string;
  description?: string;
  link?: string;
  sources?: string;
  image_url?: string;
  created_at: string;
}

const NewsPage = () => {
  const [newsList, setNewsList] = useState<NewsModel[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedNews, setSelectedNews] = useState<NewsModel | null>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const res = await fetch(getApiUrl('/api/news'));
        if (res.ok) {
          const data = await res.json();
          setNewsList(data);
        }
      } catch (err) {
        console.error('Failed to fetch news:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchNews();
  }, []);

  return (
    <div className="relative z-[1] min-h-screen pt-16">
      <section className="py-20 relative overflow-hidden min-h-[60vh]">
        {/* Background decorations */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-accent/5 rounded-full blur-[100px] pointer-events-none" />
        
        <div className="container mx-auto px-6 md:px-12 relative z-10">
          <div className="text-center mb-16">
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-4xl md:text-5xl font-display font-bold mb-4"
            >
              News & <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">Current Affairs</span>
            </motion.h2>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-muted-foreground text-lg max-w-2xl mx-auto"
            >
              Stay updated with the latest happenings, articles, and AI trends curated by AI Club DAU.
            </motion.p>
          </div>

          {loading ? (
            <div className="flex justify-center items-center py-12">
              <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : newsList.length === 0 ? (
            <div className="text-center py-12 bg-card/50 backdrop-blur-md border border-border/50 rounded-2xl max-w-3xl mx-auto">
              <Newspaper className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
              <h3 className="text-xl font-semibold text-foreground mb-2">No news available</h3>
              <p className="text-muted-foreground">Check back later for updates on current affairs.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {newsList.map((item) => {
                const imageUrl = item.image_url;
                return (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  whileHover={{ scale: 1.03, y: -6 }}
                  viewport={{ once: true }}
                  transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                  onClick={() => setSelectedNews(item)}
                  className="relative group bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-1 flex flex-col hover:border-indigo-500/50 hover:shadow-[0_0_30px_rgba(99,102,241,0.2)] transition-all cursor-pointer overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  
                  <div className="relative z-10 bg-white/90 dark:bg-slate-900/90 rounded-xl p-5 h-full flex flex-col backdrop-blur-md">
                    {imageUrl ? (
                      <div className="w-full h-48 mb-5 rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-800 relative">
                        <div className="absolute inset-0 bg-indigo-500/10 mix-blend-overlay group-hover:bg-transparent transition-colors duration-500" />
                        <img src={imageUrl} alt={item.title || 'News'} className="w-full h-full object-cover group-hover:scale-110 group-hover:rotate-1 transition-transform duration-700 ease-out" />
                      </div>
                    ) : (
                      <div className="w-full h-48 mb-5 rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-800 flex items-center justify-center group-hover:bg-indigo-50 dark:group-hover:bg-indigo-900/20 transition-colors duration-500">
                         <Newspaper className="w-12 h-12 text-slate-400 group-hover:text-indigo-400 group-hover:scale-110 transition-all duration-500" />
                      </div>
                    )}
                    
                    <div className="flex-1 flex flex-col">
                      <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-3 line-clamp-2 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-indigo-500 group-hover:to-purple-500 transition-colors duration-300">
                        {item.title || 'Untitled News'}
                      </h3>
                      {item.description && (
                        <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed line-clamp-3 mb-5 flex-1">
                          {item.description}
                        </p>
                      )}
                      
                      {item.link && (
                        <a 
                          href={item.link} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="inline-flex items-center gap-2 mt-auto text-sm font-semibold text-indigo-500 hover:text-indigo-600 dark:text-indigo-400 dark:hover:text-indigo-300 transition-colors"
                          onClick={(e) => e.stopPropagation()}
                        >
                          Read Full Article <ExternalLink size={16} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform duration-300" />
                        </a>
                      )}
                    </div>
                  </div>
                </motion.div>
                );
              })}
            </div>
          )}
        </div>

        {/* News Detail Modal */}
        <AnimatePresence>
          {selectedNews && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setSelectedNews(null)}
                className="fixed inset-0 bg-background/80 backdrop-blur-md"
              />
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 15 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 15 }}
                className="relative w-full max-w-2xl rounded-2xl bg-card border border-border p-6 md:p-8 shadow-2xl z-10 max-h-[90vh] overflow-y-auto text-left flex flex-col"
              >
                <button
                  onClick={() => setSelectedNews(null)}
                  className="absolute top-4 right-4 p-2 text-muted-foreground hover:text-foreground rounded-full hover:bg-secondary transition-colors"
                >
                  <X size={20} />
                </button>

                {selectedNews.image_url && (
                  <div className="w-full max-h-96 mb-6 rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-800">
                    <img
                      src={selectedNews.image_url}
                      alt={selectedNews.title || 'News image'}
                      className="w-full h-full object-contain max-h-96 mx-auto"
                    />
                  </div>
                )}

                <h2 className="text-2xl font-bold font-display text-foreground mb-4">
                  {selectedNews.title || 'Untitled News'}
                </h2>

                {selectedNews.description && (
                  <div className="text-muted-foreground text-sm leading-relaxed whitespace-pre-line border-t border-border/50 pt-4 mb-6 flex-1">
                    {selectedNews.description}
                  </div>
                )}
                
                {selectedNews.sources && (
                  <div className="text-muted-foreground text-xs italic mb-4">
                    <strong>Sources:</strong> {selectedNews.sources}
                  </div>
                )}
                
                {selectedNews.link && (
                  <div className="mt-auto border-t border-border/50 pt-4">
                    <a 
                      href={selectedNews.link} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center w-full gap-2 px-6 py-3 bg-primary text-primary-foreground font-semibold rounded-lg hover:bg-primary/90 transition-colors"
                    >
                      Open Link <ExternalLink size={18} />
                    </a>
                  </div>
                )}
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </section>

      <div className="h-px bg-border mx-6 md:mx-12 relative z-[1]" />
      <Footer />
      <Chatbot />
    </div>
  );
};

export default NewsPage;
