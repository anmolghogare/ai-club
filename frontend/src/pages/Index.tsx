import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Navbar from '@/components/club/Navbar';
import Hero from '@/components/club/Hero';
import Events from '@/components/club/Events';
import Projects from '@/components/club/Projects';
import Team from '@/components/club/Team';
import Resources from '@/components/club/Resources';
import Roadmap from '@/components/club/Roadmap';
import Blog from '@/components/club/Blog';
import Testimonials from '@/components/club/Testimonials';
import Footer from '@/components/club/Footer';
import Chatbot from '@/components/club/Chatbot';

const Index = () => {
  const location = useLocation();

  useEffect(() => {
    if (location.hash) {
      const hash = location.hash.substring(1);
      const el = document.getElementById(hash);
      if (el) {
        // Wait a brief moment to ensure everything is mounted
        const timer = setTimeout(() => {
          el.scrollIntoView({ behavior: 'smooth' });
        }, 150);
        return () => clearTimeout(timer);
      }
    }
  }, [location]);

  return (
    <div className="relative z-[1] min-h-screen">
      <Navbar />
      <Hero />
      <div className="h-px bg-border mx-6 md:mx-12 relative z-[1]" />
      <Events isHomepage={true} />
      <div className="h-px bg-border mx-6 md:mx-12 relative z-[1]" />
      <Projects isHomepage={true} />
      <div className="h-px bg-border mx-6 md:mx-12 relative z-[1]" />
      <Team isHomepage={true} />
      <div className="h-px bg-border mx-6 md:mx-12 relative z-[1]" />
      <Roadmap />
      <div className="h-px bg-border mx-6 md:mx-12 relative z-[1]" />
      <Resources />
      <div className="h-px bg-border mx-6 md:mx-12 relative z-[1]" />
      <Blog />
      <div className="h-px bg-border mx-6 md:mx-12 relative z-[1]" />
      <Testimonials />
      <Footer />
      <Chatbot />
    </div>
  );
};

export default Index;
