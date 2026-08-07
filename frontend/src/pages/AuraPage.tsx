import React, { useState, useRef, useEffect } from 'react';
import { motion, useReducedMotion, AnimatePresence, useScroll, useSpring, useTransform } from 'framer-motion';
import { ArrowLeft, Sparkles, Network, Fingerprint, Activity, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';

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

const LivingBackground = () => {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0 bg-[#05070F]">
      {/* Deep Space Noise */}
      <div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.03] mix-blend-overlay" />
      
      {/* Cinematic Ambient Orbs */}
      <motion.div
        animate={{ 
          x: ['-20%', '10%', '-20%'], 
          y: ['-10%', '20%', '-10%'],
          scale: [1, 1.2, 1],
          opacity: [0.15, 0.25, 0.15]
        }}
        transition={{ duration: 15, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute top-[10%] left-[20%] w-[50vw] h-[50vw] rounded-full blur-[150px] bg-indigo-600/30 mix-blend-screen"
      />
      <motion.div
        animate={{ 
          x: ['20%', '-10%', '20%'], 
          y: ['20%', '-20%', '20%'],
          scale: [1.2, 1, 1.2],
          opacity: [0.1, 0.2, 0.1]
        }}
        transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute bottom-[10%] right-[10%] w-[60vw] h-[60vw] rounded-full blur-[180px] bg-cyan-600/20 mix-blend-screen"
      />
      <motion.div
        animate={{ 
          x: ['-10%', '10%', '-10%'], 
          y: ['-10%', '10%', '-10%'],
          scale: [1, 1.1, 1],
          opacity: [0.05, 0.15, 0.05]
        }}
        transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute top-[40%] left-[40%] w-[40vw] h-[40vw] rounded-full blur-[120px] bg-magenta-600/20 mix-blend-screen"
      />
      
      {/* Light Rays */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#05070F] via-transparent to-[#05070F] z-10" />
    </div>
  );
};

const AuraCore = () => {
  return (
    <div className="relative w-64 h-64 md:w-80 md:h-80 flex items-center justify-center mb-16">
      {/* Reactor Glow */}
      <motion.div
        animate={{ opacity: [0.3, 0.6, 0.3], scale: [0.8, 1.2, 0.8] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute inset-0 bg-cyan-500/30 blur-[60px] rounded-full"
      />
      <motion.div
        animate={{ opacity: [0.2, 0.5, 0.2], scale: [1, 1.5, 1] }}
        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
        className="absolute inset-0 bg-indigo-500/20 blur-[80px] rounded-full"
      />

      {/* Orbiting Rings */}
      {[1, 2, 3].map((i) => (
        <motion.div
          key={`core-ring-${i}`}
          className="absolute inset-0 rounded-full border border-cyan-400/20"
          style={{ width: `${100 + i * 40}%`, height: `${100 + i * 40}%`, left: `-${i * 20}%`, top: `-${i * 20}%` }}
          animate={{ rotateX: [60, 60], rotateY: [0, 360], rotateZ: [0, 360] }}
          transition={{ duration: 10 + i * 5, repeat: Infinity, ease: 'linear', direction: i % 2 === 0 ? 'reverse' : 'normal' }}
        >
           <div className="w-2 h-2 rounded-full bg-cyan-400 absolute top-0 left-1/2 -translate-x-1/2 shadow-[0_0_15px_#22d3ee]" />
        </motion.div>
      ))}

      {/* Central Logo */}
      <motion.div
        animate={{ y: [0, -10, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
        className="relative z-20 w-32 h-32 md:w-40 md:h-40 bg-black/40 backdrop-blur-xl rounded-full border border-white/20 p-6 flex items-center justify-center shadow-[0_0_50px_rgba(34,211,238,0.2)]"
      >
        <img src="/aura-logo.png" alt="AURA Logo" className="w-full h-full object-contain filter drop-shadow-[0_0_10px_rgba(255,255,255,0.8)]" />
      </motion.div>
    </div>
  );
};

const CurvedConnection = ({ startX, startY, endX, endY, isActive }: any) => {
  const path = `M ${startX} ${startY} Q ${(startX + endX) / 2} ${(startY + endY) / 2 - 20} ${endX} ${endY}`;
  return (
    <g>
      <motion.path
        d={path}
        fill="none"
        stroke="rgba(255,255,255,0.05)"
        strokeWidth="1"
        initial={{ pathLength: 0 }}
        whileInView={{ pathLength: 1 }}
        transition={{ duration: 1.5, ease: 'easeInOut' }}
      />
      <motion.path
        d={path}
        fill="none"
        stroke={isActive ? "url(#gradient-active)" : "url(#gradient-inactive)"}
        strokeWidth={isActive ? "2" : "1.5"}
        strokeDasharray="4 8"
        animate={{ strokeDashoffset: [0, -100] }}
        transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
        style={{ opacity: isActive ? 1 : 0.3 }}
      />
    </g>
  );
};

const AuraPage = () => {
  const shouldReduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 });

  const [hoveredNode, setHoveredNode] = useState<number | null>(null);
  const [selectedNode, setSelectedNode] = useState<number | null>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setSelectedNode(null);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const nodes = teamMembers.map((member, i) => {
    const angle = (i * Math.PI * 2) / teamMembers.length - Math.PI / 2;
    const role = ['AI Club', 'AI Club', 'AI Club', 'Programming Club', 'AI Club', 'AI Club', 'Google Developer Groups'][i];
    const radius = 38;
    const x = 50 + Math.cos(angle) * radius; 
    const y = 50 + Math.sin(angle) * radius;
    return { ...member, role, x, y };
  });

  return (
    <div className="min-h-screen bg-[#05070F] text-white font-sans relative overflow-x-hidden selection:bg-cyan-500/30 selection:text-cyan-50">
      
      <LivingBackground />

      <motion.div 
        className="fixed top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-indigo-500 via-cyan-400 to-emerald-400 origin-left z-[60]"
        style={{ scaleX }}
      />

      <header className="fixed top-0 w-full z-50 bg-[#05070F]/50 backdrop-blur-2xl border-b border-white/5 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-6 h-16 md:h-20 flex items-center justify-between">
          <Link
            to="/"
            className="group flex items-center gap-3 text-white/50 hover:text-white transition-colors rounded-full py-2 px-4 hover:bg-white/5"
          >
            <motion.div whileHover={{ x: -4 }} transition={{ type: 'spring' }}>
              <ArrowLeft size={16} />
            </motion.div>
            <span className="font-medium text-sm tracking-wide">Command Center</span>
          </Link>
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="text-xs font-mono text-emerald-400/80 uppercase tracking-widest">System Active</span>
          </div>
        </div>
      </header>

      <main className="relative z-10 w-full pt-32">
        {/* HERO SECTION */}
        <section className="relative w-full min-h-[90dvh] flex flex-col items-center justify-center px-6">
          <AuraCore />
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="flex items-center gap-3 mb-6 bg-white/5 border border-white/10 px-4 py-1.5 rounded-full backdrop-blur-md"
          >
            <Sparkles size={14} className="text-cyan-400" />
            <span className="text-xs font-mono text-cyan-200 tracking-widest uppercase">University Intelligence</span>
          </motion.div>

          <motion.h1
            initial={{ filter: 'blur(20px)', opacity: 0, y: 40 }}
            animate={{ filter: 'blur(0px)', opacity: 1, y: 0 }}
            transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
            className="text-6xl sm:text-7xl md:text-[110px] font-bold tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white via-white to-white/20 mb-8 text-center leading-[0.9]"
          >
            Meet <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-indigo-400">AURA</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.4 }}
            className="max-w-2xl text-center text-lg md:text-xl text-white/50 font-light leading-relaxed mb-12"
          >
            The intelligent operating system for DAU. Seamlessly integrating research, infrastructure, and academia into one unified neural network.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.6 }}
          >
            <a href="https://aura.dau.ac.in" target="_blank" rel="noreferrer">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="relative group px-10 py-4 bg-transparent border-none rounded-full"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-indigo-500 rounded-full blur-[10px] group-hover:blur-[20px] transition-all duration-300 opacity-60 group-hover:opacity-100" />
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-indigo-500 rounded-full" />
                <div className="relative flex items-center gap-3 text-white font-medium text-lg">
                  <Activity size={18} /> Initialize AURA
                </div>
              </motion.button>
            </a>
          </motion.div>
        </section>

        {/* TEAM ECOSYSTEM */}
        <section className="relative w-full min-h-screen py-32 flex flex-col items-center justify-center">
          <div className="text-center mb-24 relative z-20">
            <motion.h2 
              initial={{ y: 20, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              className="text-4xl md:text-6xl font-bold tracking-tight text-white mb-6"
            >
              The Architecture
            </motion.h2>
            <p className="text-cyan-400 font-mono tracking-widest uppercase text-sm">Neural Network • v1.0</p>
          </div>

          <div className="hidden md:block relative w-full max-w-[1000px] mx-auto aspect-square">
            <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid meet">
              <defs>
                <linearGradient id="gradient-active" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#22d3ee" stopOpacity="1" />
                  <stop offset="100%" stopColor="#818cf8" stopOpacity="0" />
                </linearGradient>
                <linearGradient id="gradient-inactive" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#ffffff" stopOpacity="0.2" />
                  <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
                </linearGradient>
              </defs>
              
              {nodes.map((node, i) => (
                <CurvedConnection 
                  key={`curve-${i}`} 
                  startX={50} startY={50} 
                  endX={node.x} endY={node.y} 
                  isActive={hoveredNode === i || selectedNode === i} 
                />
              ))}
            </svg>

            {/* Core Node */}
            <motion.div
              className="absolute top-1/2 left-1/2 w-40 h-40 flex items-center justify-center z-20"
              style={{ x: "-50%", y: "-50%" }}
            >
              <div className="absolute inset-0 bg-cyan-500/20 blur-2xl rounded-full" />
              <div className="relative w-28 h-28 bg-black/80 backdrop-blur-xl border border-cyan-500/30 rounded-full flex items-center justify-center shadow-[0_0_30px_rgba(34,211,238,0.2)]">
                <img src="/aura-logo.png" alt="AURA" className="w-16 h-16 object-contain filter drop-shadow-[0_0_10px_rgba(255,255,255,0.8)]" />
              </div>
            </motion.div>

            {/* Floating Member Cards */}
            {nodes.map((node, i) => {
              const isActive = hoveredNode === i || selectedNode === i;
              return (
                <motion.div
                  key={node.name}
                  className="absolute w-56 p-5 rounded-3xl bg-black/40 border border-white/10 backdrop-blur-xl flex flex-col items-center justify-center cursor-pointer z-10 shadow-2xl"
                  style={{ left: `calc(${node.x}% - 7rem)`, top: `calc(${node.y}% - 4rem)` }}
                  animate={{
                    scale: isActive ? 1.05 : 1,
                    borderColor: isActive ? 'rgba(34,211,238,0.5)' : 'rgba(255,255,255,0.1)',
                    boxShadow: isActive ? '0 0 40px rgba(34,211,238,0.15)' : '0 10px 30px rgba(0,0,0,0.5)',
                    y: [0, -8, 0]
                  }}
                  transition={{ 
                    y: { duration: 5 + (i % 3), repeat: Infinity, ease: 'easeInOut' },
                    default: { duration: 0.3 }
                  }}
                  onMouseEnter={() => setHoveredNode(i)}
                  onMouseLeave={() => setHoveredNode(null)}
                  onClick={() => setSelectedNode(i)}
                >
                  <div className="w-14 h-14 rounded-full border border-white/20 mb-3 overflow-hidden bg-[#111]">
                    {node.image ? (
                      <img src={node.image} alt={node.name} className="w-full h-full object-cover" />
                    ) : (
                      <span className="font-bold text-white flex items-center justify-center w-full h-full">{getInitials(node.name)}</span>
                    )}
                  </div>
                  <span className="text-sm font-bold text-white mb-1">{node.name}</span>
                  <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-widest text-center">{node.role}</span>
                </motion.div>
              );
            })}
          </div>

          {/* Mobile Layout Fallback */}
          <div className="md:hidden flex flex-col gap-6 px-6 w-full">
            {nodes.map((node, i) => (
              <div key={node.name} onClick={() => setSelectedNode(i)} className="p-6 bg-white/5 border border-white/10 rounded-3xl flex items-center gap-4">
                <div className="w-16 h-16 rounded-full overflow-hidden shrink-0 border border-white/20">
                  {node.image ? <img src={node.image} className="w-full h-full object-cover" /> : <div className="w-full h-full bg-[#111] flex items-center justify-center text-white">{getInitials(node.name)}</div>}
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">{node.name}</h3>
                  <p className="text-xs font-mono text-cyan-400 uppercase">{node.role}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* FACULTY EXPERTS */}
        <section className="relative w-full min-h-screen py-32 bg-[#05070F] z-10 px-6">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-indigo-900/5 to-transparent pointer-events-none" />
          
          <div className="text-center mb-20 relative z-20">
            <h2 className="text-4xl md:text-6xl font-bold text-white mb-4">Command Module</h2>
            <p className="text-indigo-400 font-mono tracking-widest uppercase text-sm">Faculty & Infrastructure</p>
          </div>

          <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {facultyMembers.map((faculty, i) => (
              <motion.div
                key={faculty.id}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: i * 0.1 }}
                className="group relative rounded-[40px] p-[1px] overflow-hidden bg-white/5"
              >
                {/* Animated Border Gradient */}
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-500 via-cyan-400 to-emerald-400 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                
                <div className="relative h-full bg-[#080A14] rounded-[39px] p-8 flex flex-col z-10">
                  <div className="flex items-center gap-5 mb-8">
                    <div className="w-20 h-20 rounded-2xl overflow-hidden border border-white/10 shrink-0">
                      {faculty.photo ? (
                        <img src={faculty.photo} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full bg-white/5 flex items-center justify-center text-white font-bold">{getInitials(faculty.name)}</div>
                      )}
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white mb-1">{faculty.name}</h3>
                      <p className="text-sm text-cyan-400 font-medium mb-1">{faculty.designation}</p>
                      <p className="text-xs text-white/40">{faculty.department}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-8 p-4 bg-white/5 rounded-2xl border border-white/5">
                    <div>
                      <p className="text-[10px] text-white/40 uppercase font-mono tracking-wider mb-1">Role</p>
                      <p className="text-sm text-white/90">{faculty.roleInAura}</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-white/40 uppercase font-mono tracking-wider mb-1">Experience</p>
                      <p className="text-sm text-white/90">{faculty.experience}</p>
                    </div>
                  </div>

                  <div className="mb-8 flex-grow">
                    <p className="text-[10px] text-white/40 uppercase font-mono tracking-wider mb-3">Expertise</p>
                    <div className="flex flex-wrap gap-2">
                      {faculty.skills.map((skill, index) => (
                        <span key={index} className="px-3 py-1.5 text-xs text-white/80 bg-indigo-500/10 border border-indigo-500/20 rounded-full">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="pt-6 border-t border-white/10">
                    <p className="text-sm text-white/60 italic leading-relaxed">"{faculty.quote}"</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* MODAL */}
        <AnimatePresence>
          {selectedNode !== null && (
            <motion.div
              className="fixed inset-0 z-[100] flex items-center justify-center px-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div className="absolute inset-0 bg-[#05070F]/80 backdrop-blur-3xl" onClick={() => setSelectedNode(null)} />
              
              <motion.div
                className="relative w-full max-w-2xl bg-[#0A0D1A] border border-cyan-500/20 rounded-[40px] p-10 overflow-hidden shadow-[0_0_100px_rgba(34,211,238,0.1)]"
                initial={{ scale: 0.9, y: 20, opacity: 0 }}
                animate={{ scale: 1, y: 0, opacity: 1 }}
                exit={{ scale: 0.9, y: 20, opacity: 0 }}
                transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              >
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-400 to-indigo-500" />
                <div className="absolute -top-32 -right-32 w-64 h-64 bg-cyan-500/20 blur-[80px] rounded-full pointer-events-none" />
                
                <button
                  onClick={() => setSelectedNode(null)}
                  className="absolute top-6 right-6 text-white/40 hover:text-white bg-white/5 hover:bg-white/10 p-3 rounded-full transition-all"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                </button>
                
                <div className="flex flex-col md:flex-row gap-8 items-start relative z-10 mt-4">
                  <div className="w-32 h-32 rounded-3xl overflow-hidden shrink-0 border border-white/10 shadow-2xl relative">
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10" />
                    {nodes[selectedNode].image ? (
                      <img src={nodes[selectedNode].image} className="w-full h-full object-cover relative z-0" />
                    ) : (
                      <div className="w-full h-full bg-[#111] flex items-center justify-center text-white text-3xl font-bold">{getInitials(nodes[selectedNode].name)}</div>
                    )}
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <Fingerprint size={16} className="text-cyan-400" />
                      <span className="text-xs font-mono text-cyan-400 uppercase tracking-widest">{nodes[selectedNode].role}</span>
                    </div>
                    <h3 className="text-4xl font-bold text-white mb-6 tracking-tight">{nodes[selectedNode].name}</h3>
                    
                    <p className="text-white/70 leading-relaxed text-base mb-8">
                      {nodes[selectedNode].bio || "Instrumental in developing the core intelligence and scalable architecture that powers AURA across the university campus."}
                    </p>
                    
                    <div className="flex flex-wrap gap-4">
                      {nodes[selectedNode].github && (
                        <a href={nodes[selectedNode].github} target="_blank" rel="noreferrer" className="flex-1 min-w-[120px]">
                          <button className="w-full py-3.5 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all text-sm font-medium text-white shadow-lg">GitHub Profile</button>
                        </a>
                      )}
                      {nodes[selectedNode].linkedin && (
                        <a href={nodes[selectedNode].linkedin} target="_blank" rel="noreferrer" className="flex-1 min-w-[120px]">
                          <button className="w-full py-3.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 hover:bg-cyan-500/20 transition-all text-sm font-medium text-cyan-300 shadow-lg">LinkedIn</button>
                        </a>
                      )}
                      {(nodes[selectedNode] as any).website && (
                        <a href={(nodes[selectedNode] as any).website} target="_blank" rel="noreferrer" className="flex-1 min-w-[120px]">
                          <button className="w-full py-3.5 rounded-full bg-indigo-500/10 border border-indigo-500/30 hover:bg-indigo-500/20 transition-all text-sm font-medium text-indigo-300 shadow-lg">Website</button>
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

      </main>
    </div>
  );
};

export default AuraPage;
