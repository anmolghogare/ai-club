import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Quote } from 'lucide-react';

const testimonials = [
  {
    id: 1,
    name: "Aarav Patel",
    role: "Participant, AI Bootcamp 2023",
    content: "The AI Bootcamp was an incredible experience. The hands-on sessions helped me understand complex deep learning concepts easily. Highly recommended for anyone starting in AI!",
    image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Aarav"
  },
  {
    id: 2,
    name: "Riya Sharma",
    role: "Winner, HackAI",
    content: "Participating in HackAI organized by the club was a game-changer. The mentorship we received during the 24 hours was phenomenal. Proud to be a part of this community.",
    image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Riya"
  },
  {
    id: 3,
    name: "Dev Mehta",
    role: "Core Team Member",
    content: "Organizing these events has taught me so much about leadership and teamwork. The energy of the participants always keeps us motivated to do more.",
    image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Dev"
  }
];

export default function Testimonials() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  return (
    <section className="py-24 relative overflow-hidden" id="testimonials">
      {/* Background gradients */}
      <div className="absolute top-1/2 left-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px] -translate-y-1/2 pointer-events-none" />
      <div className="absolute top-1/2 right-0 w-[500px] h-[500px] bg-accent/5 rounded-full blur-[120px] -translate-y-1/2 pointer-events-none" />

      <div className="container mx-auto px-6 md:px-12 relative z-10">
        <div className="text-center mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-display font-bold mb-4"
          >
            Community <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">Experiences</span>
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-muted-foreground text-lg max-w-2xl mx-auto"
          >
            Hear from our members and participants about their journey with the AI Club.
          </motion.p>
        </div>

        <div className="max-w-4xl mx-auto relative">
          <div className="absolute top-1/2 -translate-y-1/2 -left-4 md:-left-12 z-20">
            <button 
              onClick={handlePrev}
              className="p-3 rounded-full bg-secondary/80 border border-border/50 text-foreground hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all shadow-lg"
            >
              <ChevronLeft size={24} />
            </button>
          </div>
          
          <div className="absolute top-1/2 -translate-y-1/2 -right-4 md:-right-12 z-20">
            <button 
              onClick={handleNext}
              className="p-3 rounded-full bg-secondary/80 border border-border/50 text-foreground hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all shadow-lg"
            >
              <ChevronRight size={24} />
            </button>
          </div>

          <div className="overflow-hidden px-4 py-8">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentIndex}
                initial={{ opacity: 0, x: 50, scale: 0.95 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, x: -50, scale: 0.95 }}
                transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                className="bg-card/40 backdrop-blur-xl border border-border/50 rounded-3xl p-8 md:p-12 relative shadow-2xl"
              >
                <Quote className="absolute top-8 left-8 w-12 h-12 text-primary/20 rotate-180" />
                <div className="relative z-10 flex flex-col items-center text-center">
                  <p className="text-xl md:text-2xl font-medium text-foreground/90 leading-relaxed mb-8 max-w-2xl">
                    "{testimonials[currentIndex].content}"
                  </p>
                  
                  <div className="flex flex-col items-center gap-4">
                    <div className="w-16 h-16 rounded-full overflow-hidden bg-secondary border-2 border-primary/30 p-1">
                      <img 
                        src={testimonials[currentIndex].image} 
                        alt={testimonials[currentIndex].name}
                        className="w-full h-full object-cover rounded-full" 
                      />
                    </div>
                    <div>
                      <h4 className="text-lg font-bold text-foreground">
                        {testimonials[currentIndex].name}
                      </h4>
                      <p className="text-sm font-medium text-primary">
                        {testimonials[currentIndex].role}
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Indicators */}
          <div className="flex justify-center gap-2 mt-6">
            {testimonials.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                  currentIndex === idx ? 'bg-primary w-8' : 'bg-primary/20 hover:bg-primary/50'
                }`}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
