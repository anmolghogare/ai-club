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
        const timer = setTimeout(() => {
          el.scrollIntoView({ behavior: 'smooth' });
        }, 150);
        return () => clearTimeout(timer);
      }
    }
  }, [location]);

  return (
    <div style={{ background: 'hsl(228, 30%, 93%)', minHeight: '100vh' }}>
      <Navbar />
      <Hero />
      <Events isHomepage={true} />
      <Projects isHomepage={true} />
      <Team isHomepage={true} />
      <Roadmap />
      <Resources />
      <Blog />
      <Testimonials />
      <Footer />
      <Chatbot />
    </div>
  );
};

export default Index;
