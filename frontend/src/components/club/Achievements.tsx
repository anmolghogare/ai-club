import { motion } from 'framer-motion';
import { Trophy, Medal, Award, Star } from 'lucide-react';

import { useState, useEffect } from 'react';
import { getApiUrl } from '@/lib/api';

interface AchievementModel {
  id: number;
  title: string;
  student: string;
  description: string;
  category: string;
  icon: string;
}

export default function Achievements() {
  const [achievements, setAchievements] = useState<AchievementModel[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAchievements = async () => {
      try {
        const res = await fetch(getApiUrl('/api/achievements'));
        if (res.ok) {
          const data = await res.json();
          setAchievements(data);
        }
      } catch (err) {
        console.error('Failed to fetch achievements:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchAchievements();
  }, []);

  const renderIcon = (iconName: string) => {
    switch (iconName) {
      case 'Trophy': return <Trophy className="w-6 h-6 text-yellow-500" />;
      case 'Medal': return <Medal className="w-6 h-6 text-blue-500" />;
      case 'Star': return <Star className="w-6 h-6 text-purple-500" />;
      case 'Award':
      default:
        return <Award className="w-6 h-6 text-green-500" />;
    }
  };

  return (
    <section className="py-20 relative overflow-hidden min-h-[60vh]" id="achievements">
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
            Hall of <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">Fame</span>
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-muted-foreground text-lg max-w-2xl mx-auto"
          >
            Celebrating our students who have represented the university and achieved excellence in Hackathons, ICPC, and global events.
          </motion.p>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : achievements.length === 0 ? (
          <div className="text-center py-12 bg-card/50 backdrop-blur-md border border-border/50 rounded-2xl max-w-3xl mx-auto">
            <Trophy className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
            <h3 className="text-xl font-semibold text-foreground mb-2">No achievements found</h3>
            <p className="text-muted-foreground">Check back later for updates on our students' incredible accomplishments.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {achievements.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-card/50 backdrop-blur-md border border-border/50 rounded-2xl p-6 hover:border-primary/30 hover:bg-card/80 transition-all group"
              >
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-secondary/80 rounded-xl group-hover:scale-110 transition-transform">
                    {renderIcon(item.icon)}
                  </div>
                  <div>
                    <div className="text-xs font-mono text-primary mb-1 uppercase tracking-wider">{item.category}</div>
                    <h3 className="text-xl font-bold text-foreground mb-2">{item.title}</h3>
                    <p className="text-sm font-semibold text-foreground/80 mb-2">By {item.student}</p>
                    <p className="text-muted-foreground text-sm leading-relaxed">{item.description}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
