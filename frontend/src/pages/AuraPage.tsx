import React, { useState, useRef, useEffect, useLayoutEffect, useCallback } from 'react';
import { motion, useReducedMotion, AnimatePresence, useScroll, useSpring, useTransform, useAnimationFrame, useInView } from 'framer-motion';
import { ArrowLeft, Sparkles, Fingerprint, Activity, Network, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { AnimatedAuraCore } from '../components/AnimatedAuraCore';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { MotionPathPlugin } from 'gsap/MotionPathPlugin';

gsap.registerPlugin(useGSAP, MotionPathPlugin);

const teamMembers = [
  { name: 'Vedant Shah', image: '/vedant-shah.jpg', linkedin: 'https://www.linkedin.com/in/vedant-shah-07a87331a/', github: 'https://github.com/Vedant-1016', bio: 'Building at the intersection of Machine Learning, NLP, RL, RAG and Deep Learning. Driven to challenge and redesign systems with a focus on intelligence and scalability.' },
  { name: 'Parth Agrawal', image: '/parth-agrawal.png', linkedin: 'https://www.linkedin.com/in/parth-agrawal-368869325/', github: 'https://github.com/ParthAgrawal-07', bio: 'I build backend systems and applied AI/ML. On AURA, I built a 12-role RBAC system with Google SSO, implemented document-level Pinecone retrieval filtering, and designed ERPConnector.' },
  { name: 'Meet Virugama', image: '/meet-virugama.png', linkedin: 'https://www.linkedin.com/in/meet-virugama-76a107320/', github: 'https://github.com/Meetvirugama', bio: 'I architect and build end-to-end ML systems — from data engineering to scalable production deployment. I am currently focused on Generative AI, RAG architectures, and Autonomous Agents.' },
  { name: 'Madhav Thesiya', image: '/madhav-thesiya.png', linkedin: 'https://www.linkedin.com/in/madhavthesiya/', github: 'https://github.com/madhavthesiya', bio: 'Codeforces Expert, LeetCode Knight, and CodeChef 4-Star with 2000+ problems solved. I enjoy building scalable backend systems focusing on caching, concurrency, database optimization, and performance engineering using C++, Java, Spring Boot, and Redis.' },
  { name: 'Bhagyashree Khemwani', image: '/bhagyashree-khemwani.png', linkedin: 'https://www.linkedin.com/in/bhagyashree-khemwani/', github: 'https://github.com/bhagy-shr', bio: 'I am a B.Tech ICT student at DAU, passionate about AI/ML and everything in between. Core Member of AI Club DAU and a Google Gemini Student Ambassador, exploring how AI can solve real, everyday problems.' },
  { name: 'Manal Patel', image: '/manal-patel.png', linkedin: 'https://www.linkedin.com/in/manal-patel-a87b11382/', github: 'https://github.com/manalPatel2557', bio: 'I am a student at DAU with a strong passion for software development. I enjoy building diverse projects spanning observability platforms in Python, QR code scanners in C++, and database management systems in C.' },
  { name: 'GDG DAU', image: '/gdg.png', linkedin: '', github: 'https://github.com/ossdaiict', website: 'https://dscdaiict.in/', bio: 'The Google Developer Group (GDG) club at DAU is a student-run organization fostering development in ML, Android, Web, and UI/UX. Led by Convener Abhishek Abbi, GDG partners with AURA for major tech initiatives like SLoP and Dev-o-lution.' },
];

const facultyMembers = [
  {
    id: 'f1', name: 'Dr. G Venkatesh', designation: 'Associate Professor', department: 'Chemistry',
    roleInAura: 'Vision', specialization: 'Materials Science, Molecular Modelling',
    researchAreas: ['Supramolecular Nano Materials', 'Materials Science', 'Molecular Modelling'],
    experience: 'Experienced', education: 'Ph.D. in Chemistry (Annamalai University)',
    email: '', office: 'Block 2, Room 412', quote: "Technology should solve real problems for real students.",
    linkedin: 'https://in.linkedin.com/in/venkatesh-g-a02a58', photo: '/venkatesh-g.png',
    contributions: ['Project Vision', 'Research Direction', 'Mentoring', 'Technical Guidance'],
    skills: ['Materials Science', 'Molecular Modelling', 'Chemistry']
  },
  {
    id: 'f2', name: 'Dr. Arpit Rana', designation: 'Assistant Professor', department: 'Computer Science',
    roleInAura: 'System Architecture & Project Supervision', specialization: 'Applied Machine Learning, Recommendation Systems, Multimodality',
    researchAreas: ['Recommender Systems', 'Multimodality', 'Applied ML', 'Digital Innovation'],
    experience: '10+ Years', education: 'Ph.D. (UCC), M.Tech (LNMIIT)', email: '', office: 'Block 2, Room 305',
    quote: "A good architecture survives future requirements.", linkedin: 'https://in.linkedin.com/in/arpitrana',
    photo: '/arpit-rana.png', contributions: ['Architecture', 'Backend', 'Code Reviews', 'Project Supervision'],
    skills: ['Data Mining', 'Recommender Systems', 'Applied ML']
  },
  {
    id: 'f3', name: 'Mr. Ashvin Chaudhari', designation: 'System Administrator', department: 'IT & Infrastructure',
    roleInAura: 'Infrastructure Setup', specialization: 'System & Network Administration, VMware',
    researchAreas: [], experience: '16+ Years', education: '', email: '', office: '',
    quote: "Building the resilient infrastructure that powers AURA.", linkedin: 'https://in.linkedin.com/in/ashvin-chaudhari-64a20661',
    photo: '/ashwin-chaudhary.png', contributions: ['Infrastructure Setup', 'Deployment', 'Server Config'],
    skills: ['VMware', 'Linux Admin', 'Windows Admin', 'Networking']
  }
];

const getInitials = (name: string) => {
  if (name.includes('Prof.') || name.includes('Mr.')) {
    return name.split(' ').slice(1).map((n) => n[0]).join('').replace('.', '');
  }
  return name.split(' ').map((n) => n[0]).join('');
};

const LoadingSequence = ({ onComplete }: { onComplete: () => void }) => {
  const [phase, setPhase] = useState(0);
  const messages = ["Initializing Knowledge...", "Loading Faculty...", "Connecting Models...", "Preparing Assistant...", "Launching AURA..."];
  
  useEffect(() => {
    const sequence = async () => {
      await new Promise(r => setTimeout(r, 600)); setPhase(1); // A
      await new Promise(r => setTimeout(r, 600)); setPhase(2); // AU
      await new Promise(r => setTimeout(r, 600)); setPhase(3); // AUR
      await new Promise(r => setTimeout(r, 600)); setPhase(4); // AURA
      await new Promise(r => setTimeout(r, 1200)); setPhase(5); // Outro
      await new Promise(r => setTimeout(r, 800)); onComplete();
    };
    sequence();
  }, [onComplete]);

  return (
    <motion.div 
      initial={{ opacity: 1 }}
      animate={{ opacity: phase === 5 ? 0 : 1 }}
      transition={{ duration: 0.8, ease: "easeInOut" }}
      className="fixed inset-0 z-[1000] bg-[#050505] flex flex-col items-center justify-center overflow-hidden"
    >
      <div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.04] mix-blend-overlay" />
      <motion.div 
        animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60vw] h-[60vw] rounded-full"
        style={{ background: 'radial-gradient(circle, rgba(234,88,12,0.2) 0%, rgba(234,88,12,0) 70%)' }}
      />
      <div className="relative z-10 flex flex-col items-center">
        <h1 className="text-6xl md:text-8xl font-bold tracking-[0.2em] text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-amber-200 mb-8 flex h-24">
          <AnimatePresence mode="wait">
            {phase >= 1 && <motion.span initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="inline-block">A</motion.span>}
            {phase >= 2 && <motion.span initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="inline-block">U</motion.span>}
            {phase >= 3 && <motion.span initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="inline-block">R</motion.span>}
            {phase >= 4 && <motion.span initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="inline-block">A</motion.span>}
          </AnimatePresence>
        </h1>
        <div className="h-6 overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.p
              key={phase}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="text-orange-400/60 font-mono text-sm tracking-widest uppercase"
            >
              {messages[Math.min(phase, 4)]}
            </motion.p>
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
};

// ... Particle and Cursor Logic ...
const generateParticle = (id: number) => ({
  id, x: Math.random() * 100, y: Math.random() * 100, size: Math.random() * 3 + 1,
  speedX: (Math.random() - 0.5) * 0.05, speedY: (Math.random() - 0.5) * 0.05, opacity: Math.random() * 0.3 + 0.1
});

const FloatingParticles = () => {
  const shouldReduceMotion = useReducedMotion();
  const [particles] = useState(() => Array.from({ length: 50 }, (_, i) => generateParticle(i)));
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useAnimationFrame(() => {
    if (shouldReduceMotion || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => {
      p.x += p.speedX; p.y += p.speedY;
      if (p.x < 0) p.x = 100; if (p.x > 100) p.x = 0;
      if (p.y < 0) p.y = 100; if (p.y > 100) p.y = 0;
      ctx.beginPath();
      ctx.arc((p.x / 100) * canvas.width, (p.y / 100) * canvas.height, p.size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(249, 115, 22, ${p.opacity})`;
      ctx.fill();
    });
  });

  useEffect(() => {
    const handleResize = () => {
      if (canvasRef.current) {
        canvasRef.current.width = window.innerWidth;
        canvasRef.current.height = window.innerHeight;
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none opacity-50 mix-blend-screen" />;
};

function useMousePosition() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0, nX: 0, nY: 0 });
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: e.clientX, y: e.clientY,
        nX: (e.clientX / window.innerWidth) * 2 - 1,
        nY: (e.clientY / window.innerHeight) * 2 - 1,
      });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);
  return mousePosition;
}

const AnimatedCounter = ({ value, duration = 2 }: { value: string, duration?: number }) => {
  const numericValue = parseInt(value.replace(/[^0-9]/g, ''));
  const isPlus = value.includes('+');
  
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  
  const spring = useSpring(0, { duration: duration * 1000, bounce: 0 });
  const displayValue = useTransform(spring, (current) => {
    return Math.floor(current).toLocaleString() + (isPlus ? '+' : '');
  });

  useEffect(() => {
    if (isInView) spring.set(numericValue);
  }, [isInView, spring, numericValue]);

  if (isNaN(numericValue)) return <span>{value}</span>;
  return <motion.span ref={ref}>{displayValue}</motion.span>;
};

const NeuralConnection = ({ startX, startY, endX, endY, isActive, onHit, index, triggerOutward }: any) => {
  const [particles, setParticles] = useState<{ id: string, direction: 'in' | 'out' }[]>([]);

  // Independent staggered inbound spawner
  useEffect(() => {
    let interval: any;
    const startDelay = index * 400; // Staggered start
    
    const timeout = setTimeout(() => {
      interval = setInterval(() => {
        // Higher probability if hovered
        if (Math.random() > (isActive ? 0.3 : 0.8)) {
          const id = Date.now().toString() + 'in';
          setParticles(p => [...p, { id, direction: 'in' }]);
          
          setTimeout(() => {
            setParticles(p => p.filter(x => x.id !== id));
            onHit(); // Particle reached core
          }, 1200);
        }
      }, isActive ? 1200 : 3500);
    }, startDelay);

    return () => {
      clearTimeout(timeout);
      clearInterval(interval);
    };
  }, [isActive, onHit, index]);

  // Outward response listener
  useEffect(() => {
    if (triggerOutward === index) {
      const id = Date.now().toString() + 'out';
      setParticles(p => [...p, { id, direction: 'out' }]);
      setTimeout(() => {
        setParticles(p => p.filter(x => x.id !== id));
      }, 1200);
    }
  }, [triggerOutward, index]);

  // Geometric Anchors
  const dx = endX - startX;
  const dy = endY - startY;
  const dist = Math.sqrt(dx * dx + dy * dy);
  const dirX = dx / dist;
  const dirY = dy / dist;

  // Exact anchor points (Aura boundary radius ~10, Card boundary radius ~8 in 100x100 space)
  const p1x = startX + dirX * 10;
  const p1y = startY + dirY * 10;
  const p2x = endX - dirX * 8;
  const p2y = endY - dirY * 8;

  // Tangential Bezier control point for an elegant curve
  const angle = Math.atan2(p2y - p1y, p2x - p1x);
  const offset = 8;
  const cpX = (p1x + p2x) / 2 - Math.sin(angle) * offset;
  const cpY = (p1y + p2y) / 2 + Math.cos(angle) * offset;
  const path = `M ${p1x} ${p1y} Q ${cpX} ${cpY} ${p2x} ${p2y}`;

  return (
    <g>
      {/* Layer 1: Very subtle base path */}
      <path d={path} fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="0.8" />
      
      {/* Layer 2: Moving Highlight Segments */}
      <motion.path
        d={path} fill="none" stroke={isActive ? "rgba(249,115,22,0.6)" : "rgba(249,115,22,0.2)"}
        strokeWidth={isActive ? "1.5" : "1"}
        strokeDasharray="2 8"
        animate={{ strokeDashoffset: [100, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
      />
      
      {/* Layer 3: Soft Glow on active path */}
      <motion.path
        d={path} fill="none" stroke="rgba(249,115,22,0.15)" strokeWidth="4"
        style={{ filter: "blur(3px)" }}
        animate={{ opacity: isActive ? [0.3, 0.6, 0.3] : 0.1 }}
        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* Layer 4: Real Data Particles */}
      <AnimatePresence>
        {particles.map(p => (
          <g key={p.id}>
            {/* Secondary trailing energy */}
            <motion.path
              d={path} fill="none" stroke="rgba(249,115,22,0.5)" strokeWidth="1.5" strokeLinecap="round"
              initial={{ pathLength: 0, pathOffset: p.direction === 'in' ? 1 : 0, opacity: 0 }}
              animate={{ 
                pathLength: 0.08, 
                pathOffset: p.direction === 'in' ? [1, 0] : [0, 1], 
                opacity: [0, 1, 1, 0] 
              }}
              transition={{ duration: 1.2, ease: "easeInOut", delay: 0.05 }}
            />
            {/* Primary bright core particle removed */}
          </g>
        ))}
      </AnimatePresence>
    </g>
  );
};

const AuraPage = () => {
  const [isLoading, setIsLoading] = useState(true);
  const shouldReduceMotion = useReducedMotion();
  const { scrollYProgress, scrollY } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 });
  const headerOpacity = useTransform(scrollY, [0, 100], [0.5, 0.8]);
  const headerBlur = useTransform(scrollY, [0, 100], [10, 24]);
  
  const mousePosition = useMousePosition();
  const px = useSpring(mousePosition.nX * 20, { damping: 30, stiffness: 100 });
  const py = useSpring(mousePosition.nY * 20, { damping: 30, stiffness: 100 });

  const [selectedNode, setSelectedNode] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const network = containerRef.current;
    if (!network) return;

    let resizeTimer: any;
    const pathContainer = network.querySelector('#flowPaths') as SVGGElement;
    const particleContainer = network.querySelector('#particles') as SVGGElement;
    const auraCore = network.querySelector('#auraCore') as HTMLDivElement;
    const svg = network.querySelector('#flowSvg') as SVGSVGElement;
    
    // Core center point
    const getCenter = (el: HTMLElement) => {
      const rect = el.getBoundingClientRect();
      const parentRect = svg.getBoundingClientRect();
      return {
        x: rect.left + rect.width / 2 - parentRect.left,
        y: rect.top + rect.height / 2 - parentRect.top
      };
    };

    function createSvgPath(pathData: string, className: string) {
      const element = document.createElementNS("http://www.w3.org/2000/svg", "path");
      element.setAttribute("d", pathData);
      element.setAttribute("class", className);
      return element;
    }

    function createParticle() {
      const group = document.createElementNS("http://www.w3.org/2000/svg", "g");
      const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
      circle.setAttribute("r", "5");
      circle.setAttribute("fill", "#fff");
      circle.setAttribute("filter", "url(#particleGlow)");
      
      const core = document.createElementNS("http://www.w3.org/2000/svg", "circle");
      core.setAttribute("r", "2");
      core.setAttribute("fill", "#fff");
      
      group.appendChild(circle);
      group.appendChild(core);
      group.style.opacity = "0";
      particleContainer.appendChild(group);
      return group;
    }

    function triggerNodeHit(nodeEl: HTMLElement) {
      const ring = nodeEl.querySelector('.neural-node-ring');
      const glow = nodeEl.querySelector('.neural-node-glow');
      
      gsap.fromTo(ring, 
        { scale: 1, borderColor: "rgba(255,146,0,0.3)", boxShadow: "0 0 15px rgba(255,146,0,0.1)" },
        { scale: 1.25, borderColor: "rgba(255,146,0,1)", boxShadow: "0 0 30px rgba(255,146,0,0.6)", duration: 0.3, yoyo: true, repeat: 1 }
      );
      gsap.fromTo(glow,
        { opacity: 0 },
        { opacity: 1, duration: 0.3, yoyo: true, repeat: 1 }
      );
    }

    function triggerAuraCoreHit() {
      const emitter = network.querySelector('.aura-pulse-emitter');
      if (emitter) {
        gsap.fromTo(emitter, 
          { scale: 0.5, opacity: 1, borderWidth: "4px" },
          { scale: 3, opacity: 0, borderWidth: "1px", duration: 2.0, ease: "power2.out" }
        );
      }
      gsap.fromTo(auraCore,
        { filter: "brightness(1)", scale: 1 },
        { filter: "brightness(1.15)", scale: 1.03, duration: 0.8, ease: "power1.inOut", yoyo: true, repeat: 1 }
      );
    }

    function buildNetwork() {
      if (pathContainer) pathContainer.innerHTML = "";
      if (particleContainer) particleContainer.innerHTML = "";
      
      const cards = Array.from(network.querySelectorAll('.person-card')) as HTMLElement[];
      if (!auraCore || cards.length === 0) return;
      
      const auraP = getCenter(auraCore);
      const points = cards.map(c => getCenter(c));
      
      // Prevent rendering if layout isn't ready
      if (auraP.x === 0 && auraP.y === 0) return;
      
      cards.forEach(card => {
        gsap.to(card, {
          y: "+=15",
          x: "+=" + (Math.random() > 0.5 ? 10 : -10),
          duration: 3 + Math.random() * 2,
          yoyo: true,
          repeat: -1,
          ease: "sine.inOut"
        });
        
        // Ensure ring rotates constantly
        const ring = card.querySelector('.neural-node-ring');
        gsap.to(ring, {
          rotation: 360,
          duration: 10 + Math.random() * 5,
          repeat: -1,
          ease: "none"
        });

        card.addEventListener('mouseenter', () => {
          gsap.to(auraCore, { filter: "brightness(1.3)", duration: 0.3 });
          triggerNodeHit(card);
        });
        card.addEventListener('mouseleave', () => {
          gsap.to(auraCore, { filter: "brightness(1)", duration: 0.3 });
        });
      });

      // Draw the full background web of neural pathways
      const numCards = cards.length;
      const basePaths: (number | string)[][] = [];
      
      // Connect everyone to AURA
      for (let i = 0; i < numCards; i++) {
        basePaths.push(['aura', i]);
      }
      // Connect adjacent nodes
      for (let i = 0; i < numCards; i++) {
        basePaths.push([i, (i + 1) % numCards]);
      }

      // Precise, smooth active energy flows defined by the user
      const flows = [
        // Meet -> Madhav -> Parth -> AURA
        [ 'aura', 2, 3, 1, 'aura' ],
        
        // GDG -> AURA -> Vedant
        [ 'aura', 6, 'aura', 0, 'aura' ],
        
        // Bhagyashree -> Manal -> AURA
        [ 'aura', 4, 5, 'aura' ]
      ];
      
      const drawCurvedPath = (p1: {x: number, y: number}, p2: {x: number, y: number}) => {
        const dx = p2.x - p1.x;
        const dy = p2.y - p1.y;
        const dist = Math.sqrt(dx*dx + dy*dy);
        const curveOffset = Math.min(dist * 0.25, 80);
        const angle = Math.atan2(dy, dx);
        
        // Push control point outwards organically
        const cx = (p1.x + p2.x) / 2 - Math.sin(angle) * curveOffset;
        const cy = (p1.y + p2.y) / 2 + Math.cos(angle) * curveOffset;
        return `M ${p1.x} ${p1.y} Q ${cx} ${cy} ${p2.x} ${p2.y}`;
      };

      // First, draw all the base paths to create the visual web
      basePaths.forEach(path => {
        const p1 = path[0] === 'aura' ? auraP : points[path[0]];
        const p2 = path[1] === 'aura' ? auraP : points[path[1]];
        const pathData = drawCurvedPath(p1, p2);
        const basePath = createSvgPath(pathData, "flow-base");
        pathContainer.appendChild(basePath);
      });

      const animateFlow = (sequence: (number | string)[], delay: number, speedMult: number = 1) => {
        const tl = gsap.timeline({ repeat: -1, delay });
        
        for (let i = 0; i < sequence.length - 1; i++) {
          const fromIdx = sequence[i];
          const toIdx = sequence[i+1];
          
          const p1 = fromIdx === 'aura' ? auraP : points[fromIdx];
          const p2 = toIdx === 'aura' ? auraP : points[toIdx];
          
          const pathData = drawCurvedPath(p1, p2);
          
          // We don't draw flow-base here anymore because it's drawn globally above
          
          const activePath = createSvgPath(pathData, "flow-active");
          activePath.style.opacity = "0";
          pathContainer.appendChild(activePath);
          
          const particle = createParticle();
          
          tl.call(() => {
             if (fromIdx === 'aura') triggerAuraCoreHit();
             else triggerNodeHit(cards[fromIdx]);
          });
          
          tl.to(activePath, { opacity: 0.9, duration: 0.15 });
          
          tl.to(particle, {
            opacity: 1,
            duration: 0.1
          });
          
          tl.to(particle, {
            motionPath: {
              path: pathData,
              align: activePath,
              alignOrigin: [0.5, 0.5]
            },
            duration: 1.5 * speedMult,
            ease: "power2.inOut"
          }, "<");
          
          tl.to(particle, { opacity: 0, duration: 0.15 });
          tl.to(activePath, { opacity: 0.15, duration: 0.4 }, "-=0.2");
          
          if (i === sequence.length - 2) {
             tl.call(() => triggerAuraCoreHit());
          }
        }
        tl.to({}, { duration: 1.0 });
      };

      // Play the specific flows smoothly with slight staggered delays
      animateFlow(flows[0], 0, 1.2);
      animateFlow(flows[1], 1.5, 1.1);
      animateFlow(flows[2], 0.8, 1.0);
    }

    function handleResize() {
      const rect = network.getBoundingClientRect();
      if(rect.width === 0) return; // Prevent 0 size bug
      
      svg.setAttribute("viewBox", `0 0 ${rect.width} ${rect.height}`);
      
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        buildNetwork();
      }, 300); // Wait longer for full layout
    }

    window.addEventListener("resize", handleResize);
    setTimeout(handleResize, 500); // 500ms allows images to load and DOM to settle!

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, { scope: containerRef, dependencies: [teamMembers.length] });


  const nodes = teamMembers.map((member, i) => {
    const angle = (i * Math.PI * 2) / teamMembers.length - Math.PI / 2;
    const role = ['AI Club', 'AI Club', 'AI Club', 'Programming Club', 'AI Club', 'AI Club', 'Google Developer Groups'][i];
    const radius = 38;
    const x = 50 + Math.cos(angle) * radius; 
    const y = 50 + Math.sin(angle) * radius;
    return { ...member, role, x, y };
  });

  return (
    <>
      {isLoading && <LoadingSequence onComplete={() => setIsLoading(false)} />}
      
      {!isLoading && (
        <div className="min-h-screen bg-[#050505] text-white font-sans relative overflow-x-hidden selection:bg-orange-500/30 selection:text-orange-50">
          
          {/* Global Cursor Glow */}
          {!shouldReduceMotion && (
            <motion.div
              className="fixed top-0 left-0 w-[500px] h-[500px] rounded-full pointer-events-none mix-blend-screen z-50"
              style={{
                background: 'radial-gradient(circle, rgba(232,121,46,0.1) 0%, rgba(0,0,0,0) 70%)',
                x: mousePosition.x - 250,
                y: mousePosition.y - 250,
              }}
              transition={{ type: 'tween', ease: 'backOut', duration: 0.1 }}
            />
          )}

          {/* 6-Layer Background */}
          <div className="fixed inset-0 overflow-hidden pointer-events-none z-0 bg-[#050505]">
            <div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.04] mix-blend-overlay" />
            <motion.div
              animate={{ x: ['-20%', '10%', '-20%'], y: ['-10%', '20%', '-10%'], scale: [1, 1.2, 1], opacity: [0.15, 0.25, 0.15] }}
              transition={{ duration: 15, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute top-[10%] left-[20%] w-[50vw] h-[50vw] rounded-full mix-blend-screen"
              style={{ background: 'radial-gradient(circle, rgba(234,88,12,0.2) 0%, rgba(234,88,12,0) 70%)' }}
            />
            <motion.div
              animate={{ x: ['20%', '-10%', '20%'], y: ['20%', '-20%', '20%'], scale: [1.2, 1, 1.2], opacity: [0.1, 0.2, 0.1] }}
              transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute bottom-[10%] right-[10%] w-[60vw] h-[60vw] rounded-full mix-blend-screen"
              style={{ background: 'radial-gradient(circle, rgba(217,119,6,0.15) 0%, rgba(217,119,6,0) 70%)' }}
            />
            <FloatingParticles />
            <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-[#050505] z-10" />
          </div>

          <motion.div 
            className="fixed top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-orange-600 via-orange-400 to-amber-400 origin-left z-[60]"
            style={{ scaleX }}
          />

          <motion.header 
            style={{ backgroundColor: `rgba(5,5,5,0.7)`, backdropFilter: `blur(12px)` }}
            className="fixed top-0 w-full z-50 border-b border-white/5 transition-all duration-300"
          >
            <div className="max-w-7xl mx-auto px-6 h-16 md:h-20 flex items-center justify-between">
              <Link to="/" className="group flex items-center gap-3 text-white/50 hover:text-white transition-colors rounded-full py-2 px-4 hover:bg-white/5 relative overflow-hidden">
                <motion.div whileHover={{ x: -4 }} transition={{ type: 'spring' }}><ArrowLeft size={16} /></motion.div>
                <span className="font-medium text-sm tracking-wide relative z-10">Back to Home</span>
                <motion.div className="absolute bottom-0 left-0 w-full h-[1px] bg-orange-500 scale-x-0 origin-left group-hover:scale-x-100 transition-transform duration-300" />
              </Link>
              <motion.img
                whileHover={{ rotate: 180, scale: 1.1 }}
                transition={{ type: 'spring', stiffness: 200, damping: 20 }}
                src="/aura-logo.png" alt="AURA" className="h-10 md:h-12 w-auto opacity-100"
              />
            </div>
          </motion.header>

          <main className="relative z-10 w-full pt-32">
            {/* HERO SECTION */}
            <section className="relative w-full min-h-[90dvh] flex flex-col items-center justify-center px-6">
              
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-[800px] aspect-square pointer-events-none opacity-30">
                {[1, 2, 3].map((i) => (
                  <motion.div key={`ring-${i}`} className="absolute inset-0 rounded-full border border-orange-500/20" style={{ scale: 1 + i * 0.4 }} animate={{ rotate: [0, 360] }} transition={{ duration: 20 + i * 15, repeat: Infinity, ease: 'linear', direction: i % 2 === 0 ? 'reverse' : 'normal' }} />
                ))}
              </div>

              <motion.div style={{ x: shouldReduceMotion ? 0 : px, y: shouldReduceMotion ? 0 : py }} className="relative z-10 flex flex-col items-center w-full max-w-4xl">
                
                <motion.div
                  initial={{ scale: 0.5, filter: 'blur(20px)', opacity: 0 }}
                  animate={{ scale: [0.5, 1.08, 1], filter: 'blur(0px)', opacity: 1 }}
                  transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
                  className="relative w-24 h-24 md:w-32 md:h-32 mb-10 flex items-center justify-center"
                >
                  <motion.img src="/aura-logo.png" alt="AURA Mark" className="w-full h-full object-contain relative z-10" animate={{ y: [0, -8, 0] }} transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }} />
                  <motion.div className="absolute inset-0 rounded-full z-0" style={{ background: 'radial-gradient(circle, rgba(234,88,12,0.4) 0%, rgba(234,88,12,0) 70%)' }} animate={{ opacity: [0.4, 0.8, 0.4], scale: [0.8, 1.2, 0.8] }} transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }} />
                </motion.div>

                <h1 className="text-6xl sm:text-7xl md:text-[96px] font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-b from-white to-white/50 mb-6 text-center leading-none flex overflow-hidden">
                  {['A', 'U', 'R', 'A'].map((letter, i) => (
                    <motion.span key={i} initial={{ y: '100%', opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.2 + i * 0.1 }}>{letter}</motion.span>
                  ))}
                </h1>

                <div className="overflow-hidden mb-10">
                  <motion.p initial={{ y: '100%', opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.6 }} className="text-lg md:text-xl text-orange-400 font-mono tracking-[0.2em] uppercase text-center">
                    University AI Assistant
                  </motion.p>
                </div>

                <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.8 }} className="max-w-[650px] text-center text-white/50 text-base md:text-lg leading-relaxed mb-12">
                  One intelligent assistant for everything at DAU.
                  <span className="block mt-3 text-white/30 text-sm md:text-base">Search · Courses · Faculty · Labs · Events · Timetable · Research · Resources</span>
                </motion.p>

                <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.8, delay: 1 }} className="mb-20">
                  <a href="https://aura.dau.ac.in" target="_blank" rel="noreferrer">
                    <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="relative group px-10 py-4 bg-transparent border-none rounded-full">
                      <div className="absolute inset-0 bg-gradient-to-r from-orange-500 to-amber-500 rounded-full blur-[10px] group-hover:blur-[20px] transition-all duration-300 opacity-60 group-hover:opacity-100" />
                      <div className="absolute inset-0 bg-gradient-to-r from-orange-500 to-amber-600 rounded-full" />
                      <div className="relative flex items-center gap-3 text-white font-medium text-lg">
                        <Activity size={18} /> Launch AURA
                      </div>
                    </motion.button>
                  </a>
                </motion.div>

                {/* Statistics Cards */}
                <motion.div initial="hidden" whileInView="show" viewport={{ once: true }} variants={{ show: { transition: { staggerChildren: 0.1 } } }} className="grid grid-cols-2 md:grid-cols-4 gap-6 w-full">
                  {[
                    { label: 'Version', value: '1.0' },
                    { label: 'Students', value: '1,200+' },
                    { label: 'Developers', value: '14' },
                    { label: 'Faculty Mentors', value: '3' },
                  ].map((stat) => (
                    <motion.div key={stat.label} variants={{ hidden: { opacity: 0, y: 40, filter: 'blur(10px)' }, show: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] } } }} whileHover={{ y: -6, backgroundColor: 'rgba(255,255,255,0.08)' }} className="flex flex-col items-center justify-center p-8 rounded-3xl bg-white/5 border border-white/5 backdrop-blur-xl transition-all cursor-default relative overflow-hidden group">
                      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-orange-500/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      <span className="text-3xl md:text-4xl font-bold text-white/90 mb-2"><AnimatedCounter value={stat.value} /></span>
                      <span className="text-[10px] md:text-xs text-white/40 uppercase font-mono tracking-widest text-center">{stat.label}</span>
                    </motion.div>
                  ))}
                </motion.div>
              </motion.div>
            </section>

            {/* DEVELOPMENT TEAM */}
            <section className="relative w-full min-h-screen py-32 flex flex-col items-center justify-center">
              <div className="text-center mb-24 relative z-20">
                <motion.p initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-orange-400 font-mono tracking-[0.2em] uppercase text-sm mb-4">INSIDE FLOW</motion.p>
                <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }} className="text-5xl md:text-7xl font-bold tracking-tight text-white mb-6 text-center">AURA Neural Network</motion.h2>
                <motion.p initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }} className="text-white/50 text-xl font-serif italic text-center">Energy originating from within.</motion.p>
              </div>

              <div ref={containerRef} className="hidden md:block relative w-full max-w-[1000px] mx-auto aspect-square">
                <svg id="flowSvg" className="flow-svg" preserveAspectRatio="none">
                  <defs>
                    <filter id="flowGlow">
                      <feGaussianBlur stdDeviation="3" result="blur" />
                      <feMerge>
                        <feMergeNode in="blur" />
                        <feMergeNode in="SourceGraphic" />
                      </feMerge>
                    </filter>
                    <filter id="particleGlow">
                      <feGaussianBlur stdDeviation="5" result="blur" />
                      <feMerge>
                        <feMergeNode in="blur" />
                        <feMergeNode in="SourceGraphic" />
                      </feMerge>
                    </filter>
                  </defs>
                  <g id="flowPaths"></g>
                  <g id="particles"></g>
                </svg>

                <AnimatedAuraCore />

                {/* Flow Neural Nodes */}
                {nodes.map((node, i) => {
                  return (
                    <div
                      key={node.name}
                      className="neural-node-container person-card"
                      style={{ left: `${node.x}%`, top: `${node.y}%` }}
                      onClick={() => setSelectedNode(i)}
                      data-index={i}
                    >
                      <div className="neural-node-ring"></div>
                      <div className="neural-node-glow"></div>
                      {node.image ? <img src={node.image} alt={node.name} className="neural-node-portrait" /> : <div className="neural-node-portrait flex items-center justify-center text-white font-bold">{getInitials(node.name)}</div>}
                      <div className="neural-node-info">
                        <div className="neural-node-name">{node.name}</div>
                        <div className="neural-node-role">{node.role}</div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Mobile Layout */}
              <div className="md:hidden flex flex-col gap-6 px-6 w-full mt-10">
                {nodes.map((node, i) => (
                  <motion.div key={node.name} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} onClick={() => setSelectedNode(i)} className="p-6 bg-white/5 border border-white/10 rounded-3xl flex items-center gap-4">
                    <div className="w-20 h-20 rounded-full overflow-hidden shrink-0 border border-white/20">
                      {node.image ? <img src={node.image} className="w-full h-full object-cover" /> : <div className="w-full h-full bg-[#111] flex items-center justify-center text-white">{getInitials(node.name)}</div>}
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-white">{node.name}</h3>
                      <p className="text-xs font-mono text-orange-400 uppercase">{node.role}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </section>

            {/* FACULTY SECTION */}
            <section className="relative w-full min-h-screen py-32 bg-[#050505] z-10 px-6">
              <div className="text-center mb-20 relative z-20">
                <motion.p initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-orange-400 font-mono tracking-widest uppercase text-sm mb-4">FACULTY & MENTORS</motion.p>
                <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }} className="text-5xl md:text-7xl font-bold text-white mb-6">Guided by Experience</motion.h2>
                <motion.p initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }} className="text-white/50 text-xl font-serif italic max-w-2xl mx-auto">"The faculty members and mentors who transformed AURA from an idea into a scalable university AI platform."</motion.p>
              </div>

              <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {facultyMembers.map((faculty, i) => (
                  <motion.div
                    key={faculty.id}
                    initial={{ opacity: 0, y: 40, filter: 'blur(10px)', scale: 0.95 }}
                    whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)', scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: i * 0.1 }}
                    whileHover={{ y: -10 }}
                    className="group relative rounded-[40px] p-[1px] overflow-hidden bg-white/5 cursor-default"
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-orange-500 via-amber-400 to-orange-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    <div className="relative h-full bg-[#080808]/90 backdrop-blur-3xl rounded-[39px] p-8 flex flex-col z-10 border border-transparent group-hover:border-orange-500/10">
                      <div className="flex items-center gap-5 mb-8">
                        <motion.div whileHover={{ scale: 1.1 }} transition={{ type: 'spring' }} className="w-20 h-20 rounded-2xl overflow-hidden border border-white/10 shrink-0">
                          {faculty.photo ? <img src={faculty.photo} className="w-full h-full object-cover" /> : <div className="w-full h-full bg-white/5 flex items-center justify-center text-white font-bold">{getInitials(faculty.name)}</div>}
                        </motion.div>
                        <div>
                          <h3 className="text-xl font-bold text-white mb-1 group-hover:text-orange-400 transition-colors">{faculty.name}</h3>
                          <p className="text-sm text-white/70 font-medium mb-1">{faculty.designation}</p>
                          <p className="text-xs text-white/40">{faculty.department}</p>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4 mb-8 p-4 bg-white/5 rounded-2xl border border-white/5">
                        <div><p className="text-[10px] text-white/40 uppercase font-mono tracking-wider mb-1">Role</p><p className="text-sm text-orange-400">{faculty.roleInAura}</p></div>
                        <div><p className="text-[10px] text-white/40 uppercase font-mono tracking-wider mb-1">Experience</p><p className="text-sm text-white/90">{faculty.experience}</p></div>
                      </div>

                      <div className="mb-8 flex-grow">
                        <p className="text-[10px] text-white/40 uppercase font-mono tracking-wider mb-3">Expertise</p>
                        <div className="flex flex-wrap gap-2">
                          {faculty.skills.map((skill, index) => (
                            <span key={index} className="px-3 py-1.5 text-[11px] font-medium text-white/70 bg-orange-500/10 border border-orange-500/20 rounded-full group-hover:shadow-[0_0_10px_rgba(249,115,22,0.2)] transition-shadow">
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>

                      <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: 0.5 + i * 0.1 }} className="pt-6 border-t border-white/10">
                        <p className="text-sm text-white/60 italic leading-relaxed">"{faculty.quote}"</p>
                      </motion.div>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* TIMELINE */}
              <div className="relative z-20 w-full max-w-4xl mx-auto mt-32 px-6 pb-20">
                <div className="flex justify-between items-center relative">
                  <div className="absolute top-1/2 left-0 w-full h-[2px] bg-white/5 -translate-y-1/2" />
                  <motion.div className="absolute top-1/2 left-0 h-[2px] bg-gradient-to-r from-orange-600 to-amber-400 -translate-y-1/2 origin-left" style={{ scaleX }} />
                  {['Vision', 'Architecture', 'Infrastructure', 'Launch'].map((step, i) => (
                    <div key={step} className="relative z-10 flex flex-col items-center gap-4 group">
                      <motion.div initial={{ scale: 0 }} whileInView={{ scale: 1 }} viewport={{ once: true }} transition={{ delay: i * 0.3, type: 'spring', bounce: 0.5 }} className="w-5 h-5 rounded-full bg-[#050505] border-2 border-orange-500 relative flex items-center justify-center">
                        <motion.div className="absolute inset-0 rounded-full bg-orange-500 blur-sm opacity-0 group-hover:opacity-100 transition-opacity" />
                        <motion.div animate={{ scale: [1, 1.5, 1], opacity: [1, 0, 1] }} transition={{ duration: 2, repeat: Infinity, delay: i * 0.2 }} className="w-2 h-2 rounded-full bg-orange-500" />
                      </motion.div>
                      <motion.span initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.3 + 0.2 }} className="text-xs font-mono tracking-widest text-white/50 uppercase absolute top-8 whitespace-nowrap group-hover:text-orange-400 transition-colors">
                        {step}
                      </motion.span>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          </main>

          {/* Modal */}
          <AnimatePresence>
            {selectedNode !== null && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[9999] flex items-center justify-center p-6 bg-black/60 backdrop-blur-2xl"
                onClick={() => setSelectedNode(null)}
              >
                <motion.div
                  initial={{ scale: 0.9, opacity: 0, y: 20 }}
                  animate={{ scale: 1, opacity: 1, y: 0 }}
                  exit={{ scale: 0.9, opacity: 0, y: 20 }}
                  transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                  className="w-full max-w-lg bg-[#0A0A0A]/90 border border-white/10 rounded-[32px] p-8 relative overflow-hidden"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 to-transparent pointer-events-none" />
                  
                  <button 
                    onClick={() => setSelectedNode(null)}
                    className="absolute top-6 right-6 p-2 rounded-full bg-white/5 hover:bg-white/10 text-white/50 hover:text-white transition-colors z-20"
                  >
                    <X size={20} />
                  </button>

                  <div className="flex items-center gap-6 mb-8 relative z-10">
                    <div className="w-24 h-24 rounded-2xl overflow-hidden border border-white/10 bg-white/5 shrink-0">
                      {nodes[selectedNode].image ? (
                        <img src={nodes[selectedNode].image} alt={nodes[selectedNode].name} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-2xl font-bold text-white">
                          {getInitials(nodes[selectedNode].name)}
                        </div>
                      )}
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-white mb-2">{nodes[selectedNode].name}</h3>
                      <p className="text-sm font-mono text-orange-400 uppercase tracking-widest">{nodes[selectedNode].role}</p>
                    </div>
                  </div>

                  <div className="relative z-10 space-y-6">
                    <p className="text-white/70 leading-relaxed text-sm">
                      {nodes[selectedNode].bio}
                    </p>
                    
                    <div className="flex gap-4 pt-4 border-t border-white/10">
                      {nodes[selectedNode].linkedin && (
                        <a href={nodes[selectedNode].linkedin} target="_blank" rel="noreferrer" className="flex-1">
                          <button className="w-full py-3 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-sm font-medium text-white transition-colors">
                            LinkedIn
                          </button>
                        </a>
                      )}
                      {nodes[selectedNode].github && (
                        <a href={nodes[selectedNode].github} target="_blank" rel="noreferrer" className="flex-1">
                          <button className="w-full py-3 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-sm font-medium text-white transition-colors">
                            GitHub
                          </button>
                        </a>
                      )}
                      {nodes[selectedNode].website && (
                        <a href={nodes[selectedNode].website} target="_blank" rel="noreferrer" className="flex-1">
                          <button className="w-full py-3 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-sm font-medium text-white transition-colors">
                            Website
                          </button>
                        </a>
                      )}
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}
    </>
  );
};

export default AuraPage;
