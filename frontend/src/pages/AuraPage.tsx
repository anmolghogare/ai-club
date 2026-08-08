import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  AnimatePresence,
  motion,
  useInView,
  useReducedMotion,
  useScroll,
  useSpring,
} from 'framer-motion';
import { Activity, ArrowLeft, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { AnimatedAuraCore } from '../components/AnimatedAuraCore';

type TeamMember = {
  name: string;
  role: string;
  image: string;
  bio: string;
  linkedin?: string;
  github?: string;
  website?: string;
};

type FacultyMember = {
  id: string;
  name: string;
  designation: string;
  department: string;
  roleInAura: string;
  experience: string;
  skills: string[];
  quote: string;
  linkedin?: string;
  photo?: string;
};

const TEAM: TeamMember[] = [
  {
    name: 'Vedant Shah',
    role: 'AI Club',
    image: '/vedant-shah.jpg',
    linkedin: 'https://www.linkedin.com/in/vedant-shah-07a87331/',
    github: 'https://github.com/Vedant-1016',
    bio: 'Building at the intersection of Machine Learning, NLP, RL, RAG and Deep Learning. Driven to challenge and redesign systems with a focus on intelligence and scalability.',
  },
  {
    name: 'Parth Agrawal',
    role: 'AI Club',
    image: '/parth-agrawal.png',
    linkedin: 'https://www.linkedin.com/in/parth-agrawal-368869325/',
    github: 'https://github.com/ParthAgrawal-07',
    bio: 'I build backend systems and applied AI/ML. On AURA, I built a 12-role RBAC system with Google SSO, implemented document-level Pinecone retrieval filtering, and designed ERPConnector.',
  },
  {
    name: 'Meet Virugama',
    role: 'AI Club',
    image: '/meet-virugama.png',
    linkedin: 'https://www.linkedin.com/in/meet-virugama-76a107320/',
    github: 'https://github.com/Meetvirugama',
    bio: 'I architect and build end-to-end ML systems — from data engineering to scalable production deployment. I am currently focused on Generative AI, RAG architectures, and Autonomous Agents.',
  },
  {
    name: 'Madhav Thesiya',
    role: 'Programming Club',
    image: '/madhav-thesiya.png',
    linkedin: 'https://www.linkedin.com/in/madhavthesiya/',
    github: 'https://github.com/madhavthesiya',
    bio: 'Codeforces Expert, LeetCode Knight, and CodeChef 4-Star with 2000+ problems solved. I enjoy scalable backend systems, caching, concurrency, database optimization, and performance engineering.',
  },
  {
    name: 'Bhagyashree Khemwani',
    role: 'AI Club',
    image: '/bhagyashree-khemwani.png',
    linkedin: 'https://www.linkedin.com/in/bhagyashree-khemwani/',
    github: 'https://github.com/bhagy-shr',
    bio: 'B.Tech ICT student at DAU, passionate about AI/ML and practical applications of AI. Core Member of AI Club DAU and a Google Gemini Student Ambassador.',
  },
  {
    name: 'Manal Patel',
    role: 'AI Club',
    image: '/manal-patel.png',
    linkedin: 'https://www.linkedin.com/in/manal-patel-a87b11382/',
    github: 'https://github.com/manalPatel2557',
    bio: 'DAU student focused on software development, with projects spanning observability platforms in Python, QR code scanners in C++, and database management systems in C.',
  },
  {
    name: 'GDG DAU',
    role: 'Google Developer Groups',
    image: '/gdg.png',
    github: 'https://github.com/ossdaiict',
    website: 'https://dscdaiict.in/',
    bio: 'A student-run developer community at DAU fostering development across ML, Android, Web, and UI/UX, partnering with AURA on major technical initiatives.',
  },
];

const FACULTY: FacultyMember[] = [
  {
    id: 'f1',
    name: 'Dr. G Venkatesh',
    designation: 'Associate Professor',
    department: 'Chemistry',
    roleInAura: 'Vision',
    experience: 'Experienced',
    skills: ['Materials Science', 'Molecular Modelling', 'Chemistry'],
    quote: 'Technology should solve real problems for real students.',
    linkedin: 'https://in.linkedin.com/in/venkatesh-g-a02a58',
    photo: '/venkatesh-g.png',
  },
  {
    id: 'f2',
    name: 'Dr. Arpit Rana',
    designation: 'Assistant Professor',
    department: 'Computer Science',
    roleInAura: 'System Architecture & Project Supervision',
    experience: '10+ Years',
    skills: ['Data Mining', 'Recommender Systems', 'Applied ML'],
    quote: 'A good architecture survives future requirements.',
    linkedin: 'https://in.linkedin.com/in/arpitrana',
    photo: '/arpit-rana.png',
  },
  {
    id: 'f3',
    name: 'Mr. Ashvin Chaudhari',
    designation: 'System Administrator',
    department: 'IT & Infrastructure',
    roleInAura: 'Infrastructure Setup',
    experience: '16+ Years',
    skills: ['VMware', 'Linux Admin', 'Windows Admin', 'Networking'],
    quote: 'Building the resilient infrastructure that powers AURA.',
    linkedin: 'https://in.linkedin.com/in/ashvin-chaudhari-64a20661',
    photo: '/ashwin-chaudhary.png',
  },
];

const FLOW_ROUTES: Array<number[]> = [
  [2, 3, 1, -1], // Meet → Madhav → Parth → AURA
  [6, -1, 0, -1], // GDG → AURA → Vedant → AURA
  [4, 5, -1], // Bhagyashree → Manal → AURA
];

const getInitials = (name: string) =>
  name
    .replace(/^Dr\.\s|^Mr\.\s|^Prof\.\s/, '')
    .split(/\s+/)
    .map((part) => part[0])
    .join('')
    .slice(0, 3)
    .toUpperCase();

function useMousePosition(enabled: boolean) {
  const [position, setPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    if (!enabled) return;

    const onMove = (event: MouseEvent) => {
      setPosition({ x: event.clientX, y: event.clientY });
    };

    window.addEventListener('mousemove', onMove, { passive: true });
    return () => window.removeEventListener('mousemove', onMove);
  }, [enabled]);

  return position;
}

function LoadingSequence({ onComplete }: { onComplete: () => void }) {
  useEffect(() => {
    const timer = window.setTimeout(onComplete, 2200);
    return () => window.clearTimeout(timer);
  }, [onComplete]);

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6 }}
      className="fixed inset-0 z-[1000] bg-[#050505] flex items-center justify-center"
    >
      <div className="aura-loader">
        <div className="aura-loader-mark">AURA</div>
        <div className="aura-loader-line" />
        <p>Initializing university intelligence</p>
      </div>
    </motion.div>
  );
}

function FloatingParticles() {
  const reduceMotion = useReducedMotion();
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (reduceMotion) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const particles = Array.from({ length: 34 }, () => ({
      x: Math.random(),
      y: Math.random(),
      r: Math.random() * 1.8 + 0.5,
      vx: (Math.random() - 0.5) * 0.00012,
      vy: (Math.random() - 0.5) * 0.00012,
      a: Math.random() * 0.28 + 0.06,
    }));

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    let frame = 0;
    const render = () => {
      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

      for (const p of particles) {
        p.x = (p.x + p.vx + 1) % 1;
        p.y = (p.y + p.vy + 1) % 1;

        ctx.beginPath();
        ctx.arc(p.x * window.innerWidth, p.y * window.innerHeight, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 146, 0, ${p.a})`;
        ctx.fill();
      }

      frame = requestAnimationFrame(render);
    };

    resize();
    window.addEventListener('resize', resize);
    frame = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('resize', resize);
    };
  }, [reduceMotion]);

  return <canvas ref={canvasRef} className="fixed inset-0 z-0 pointer-events-none opacity-60" />;
}

function AnimatedCounter({ value }: { value: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });
  const numeric = Number(value.replace(/[^0-9]/g, ''));
  const spring = useSpring(0, { duration: 1200, bounce: 0 });

  useEffect(() => {
    if (inView && Number.isFinite(numeric)) spring.set(numeric);
  }, [inView, numeric, spring]);

  useEffect(() => {
    const unsubscribe = spring.on('change', (latest) => {
      if (ref.current) {
        ref.current.textContent =
          Math.floor(latest).toLocaleString() + (value.includes('+') ? '+' : '');
      }
    });
    return unsubscribe;
  }, [spring, value]);

  return <span ref={ref}>{Number.isFinite(numeric) ? '0' : value}</span>;
}

function NeuralNetwork({
  onSelect,
}: {
  onSelect: (index: number) => void;
}) {
  const reduceMotion = useReducedMotion();
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const nodes = useMemo(
    () =>
      TEAM.map((member, index) => {
        const angle = (index * Math.PI * 2) / TEAM.length - Math.PI / 2;
        const radius = 38;
        return {
          ...member,
          index,
          x: 50 + Math.cos(angle) * radius,
          y: 50 + Math.sin(angle) * radius,
        };
      }),
    []
  );

  const buildPath = useCallback(
    (from: { x: number; y: number }, to: { x: number; y: number }) => {
      const dx = to.x - from.x;
      const dy = to.y - from.y;
      const distance = Math.hypot(dx, dy);
      const curve = Math.min(distance * 0.18, 8);
      const angle = Math.atan2(dy, dx);
      const cx = (from.x + to.x) / 2 - Math.sin(angle) * curve;
      const cy = (from.y + to.y) / 2 + Math.cos(angle) * curve;
      return `M ${from.x} ${from.y} Q ${cx} ${cy} ${to.x} ${to.y}`;
    },
    []
  );

  useEffect(() => {
    const svg = svgRef.current;
    if (!svg || reduceMotion) return;

    const paths = svg.querySelectorAll<SVGPathElement>('.flow-active');
    const cleanup: gsap.core.Tween[] = [];

    paths.forEach((path, index) => {
      const duration = 2.4 + (index % 3) * 0.5;
      const tween = gsap.to(path, {
        strokeDashoffset: -90,
        duration,
        repeat: -1,
        ease: 'none',
        delay: index * 0.35,
      });
      cleanup.push(tween);
    });

    return () => cleanup.forEach((tween) => tween.kill());
  }, [reduceMotion]);

  const aura = { x: 50, y: 50 };

  return (
    <div className="aura-network">
      <svg ref={svgRef} className="flow-svg" viewBox="0 0 100 100" preserveAspectRatio="none">
        <defs>
          <filter id="aura-flow-glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="0.7" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        <g className="flow-base-layer">
          {nodes.map((node) => (
            <path
              key={`base-${node.index}`}
              className="flow-base"
              d={buildPath(aura, node)}
            />
          ))}
          {nodes.map((node, index) => (
            <path
              key={`adj-${node.index}`}
              className="flow-base flow-base-secondary"
              d={buildPath(node, nodes[(index + 1) % nodes.length])}
            />
          ))}
        </g>

        <g className="flow-active-layer">
          {FLOW_ROUTES.map((route, routeIndex) =>
            route.slice(0, -1).map((from, segmentIndex) => {
              const to = route[segmentIndex + 1];
              const fromPoint = from === -1 ? aura : nodes[from];
              const toPoint = to === -1 ? aura : nodes[to];

              return (
                <path
                  key={`active-${routeIndex}-${segmentIndex}`}
                  className="flow-active"
                  d={buildPath(fromPoint, toPoint)}
                />
              );
            })
          )}
        </g>
      </svg>

      <AnimatedAuraCore />

      {nodes.map((node) => (
        <button
          key={node.name}
          type="button"
          className="neural-node-container person-card"
          style={{ left: `${node.x}%`, top: `${node.y}%` }}
          onClick={() => onSelect(node.index)}
          aria-label={`Open ${node.name} profile`}
        >
          <span className="neural-node-ring" />
          <span className="neural-node-glow" />

          {node.image ? (
            <img
              src={node.image}
              alt={node.name}
              className="neural-node-portrait"
              loading="lazy"
            />
          ) : (
            <span className="neural-node-portrait neural-node-fallback">
              {getInitials(node.name)}
            </span>
          )}

          <span className="neural-node-info">
            <span className="neural-node-name">{node.name}</span>
            <span className="neural-node-role">{node.role}</span>
          </span>
        </button>
      ))}
    </div>
  );
}

function FacultyCard({ faculty, index }: { faculty: FacultyMember; index: number }) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.65, delay: index * 0.08 }}
      whileHover={{ y: -8 }}
      className="faculty-card"
    >
      <div className="faculty-head">
        <div className="faculty-photo">
          {faculty.photo ? (
            <img src={faculty.photo} alt={faculty.name} loading="lazy" />
          ) : (
            getInitials(faculty.name)
          )}
        </div>
        <div>
          <h3>{faculty.name}</h3>
          <p>{faculty.designation}</p>
          <span>{faculty.department}</span>
        </div>
      </div>

      <div className="faculty-meta">
        <div>
          <small>AURA ROLE</small>
          <strong>{faculty.roleInAura}</strong>
        </div>
        <div>
          <small>EXPERIENCE</small>
          <strong>{faculty.experience}</strong>
        </div>
      </div>

      <div className="faculty-skills">
        {faculty.skills.map((skill) => (
          <span key={skill}>{skill}</span>
        ))}
      </div>

      <blockquote>“{faculty.quote}”</blockquote>

      {faculty.linkedin && (
        <a href={faculty.linkedin} target="_blank" rel="noreferrer" className="faculty-link">
          View profile
        </a>
      )}
    </motion.article>
  );
}

export default function AuraPage() {
  const [loading, setLoading] = useState(true);
  const [selectedNode, setSelectedNode] = useState<number | null>(null);
  const reduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 100, damping: 30 });
  const mouse = useMousePosition(!reduceMotion);

  const finishLoading = useCallback(() => setLoading(false), []);

  return (
    <AnimatePresence mode="wait">
      {loading ? (
        <LoadingSequence key="loader" onComplete={finishLoading} />
      ) : (
        <motion.div
          key="aura-page"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="aura-page"
        >
          <FloatingParticles />

          {!reduceMotion && (
            <motion.div
              className="aura-cursor-glow"
              style={{ x: mouse.x - 250, y: mouse.y - 250 }}
            />
          )}

          <motion.div className="aura-progress" style={{ scaleX: progress }} />

          <header className="aura-header">
            <div className="aura-header-inner">
              <Link to="/" className="aura-back">
                <ArrowLeft size={16} />
                <span>Back to Home</span>
              </Link>

              <img src="/aura-logo.png" alt="AURA" className="aura-header-logo" />
            </div>
          </header>

          <main>
            <section className="aura-hero">
              <div className="hero-orbit hero-orbit-1" />
              <div className="hero-orbit hero-orbit-2" />
              <div className="hero-orbit hero-orbit-3" />

              <motion.div
                initial={{ opacity: 0, scale: 0.7, filter: 'blur(16px)' }}
                animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
                transition={{ duration: 1 }}
                className="hero-logo-wrap"
              >
                <img src="/aura-logo.png" alt="AURA Mark" />
                <span />
              </motion.div>

              <motion.p
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.45 }}
                className="aura-eyebrow"
              >
                UNIVERSITY AI ASSISTANT
              </motion.p>

              <motion.h1
                initial={{ opacity: 0, y: 25 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.55, duration: 0.8 }}
              >
                Intelligence for DAU.
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
                className="hero-copy"
              >
                One intelligent assistant for courses, faculty, labs, events,
                timetables, research, and university resources.
              </motion.p>

              <motion.a
                href="https://aura.dau.ac.in"
                target="_blank"
                rel="noreferrer"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.9 }}
                className="aura-launch"
              >
                <Activity size={18} />
                Launch AURA
              </motion.a>

              <div className="aura-stats">
                {[
                  ['Version', '1.0'],
                  ['Students', '1,200+'],
                  ['Developers', '14'],
                  ['Faculty Mentors', '3'],
                ].map(([label, value]) => (
                  <div className="aura-stat" key={label}>
                    <strong>
                      <AnimatedCounter value={value} />
                    </strong>
                    <span>{label}</span>
                  </div>
                ))}
              </div>
            </section>

            <section className="aura-network-section">
              <div className="section-intro">
                <p className="aura-eyebrow">INSIDE FLOW</p>
                <h2>AURA Neural Network</h2>
                <p>People, ideas, infrastructure, and intelligence connected through one core.</p>
              </div>

              <div className="desktop-network">
                <NeuralNetwork onSelect={setSelectedNode} />
              </div>

              <div className="mobile-network">
                {TEAM.map((member, index) => (
                  <button
                    type="button"
                    key={member.name}
                    onClick={() => setSelectedNode(index)}
                    className="mobile-person"
                  >
                    {member.image ? (
                      <img src={member.image} alt={member.name} loading="lazy" />
                    ) : (
                      <span>{getInitials(member.name)}</span>
                    )}
                    <div>
                      <strong>{member.name}</strong>
                      <small>{member.role}</small>
                    </div>
                  </button>
                ))}
              </div>
            </section>

            <section className="faculty-section">
              <div className="section-intro">
                <p className="aura-eyebrow">FACULTY & MENTORS</p>
                <h2>Guided by Experience</h2>
                <p>
                  Faculty and infrastructure leadership supporting AURA from vision
                  through deployment.
                </p>
              </div>

              <div className="faculty-grid">
                {FACULTY.map((faculty, index) => (
                  <FacultyCard key={faculty.id} faculty={faculty} index={index} />
                ))}
              </div>

              <div className="aura-timeline">
                {['Vision', 'Architecture', 'Infrastructure', 'Launch'].map((step, index) => (
                  <div key={step} className="timeline-step">
                    <span>{index + 1}</span>
                    <strong>{step}</strong>
                  </div>
                ))}
              </div>
            </section>
          </main>

          <AnimatePresence>
            {selectedNode !== null && (
              <motion.div
                className="aura-modal-backdrop"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setSelectedNode(null)}
              >
                <motion.div
                  className="aura-modal"
                  initial={{ opacity: 0, scale: 0.94, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.94, y: 20 }}
                  onClick={(event) => event.stopPropagation()}
                >
                  <button
                    type="button"
                    className="aura-modal-close"
                    onClick={() => setSelectedNode(null)}
                    aria-label="Close profile"
                  >
                    <X size={20} />
                  </button>

                  <div className="modal-profile">
                    {TEAM[selectedNode].image ? (
                      <img
                        src={TEAM[selectedNode].image}
                        alt={TEAM[selectedNode].name}
                      />
                    ) : (
                      <span>{getInitials(TEAM[selectedNode].name)}</span>
                    )}

                    <div>
                      <p className="aura-eyebrow">{TEAM[selectedNode].role}</p>
                      <h3>{TEAM[selectedNode].name}</h3>
                    </div>
                  </div>

                  <p className="modal-bio">{TEAM[selectedNode].bio}</p>

                  <div className="modal-links">
                    {TEAM[selectedNode].linkedin && (
                      <a href={TEAM[selectedNode].linkedin} target="_blank" rel="noreferrer">
                        LinkedIn
                      </a>
                    )}
                    {TEAM[selectedNode].github && (
                      <a href={TEAM[selectedNode].github} target="_blank" rel="noreferrer">
                        GitHub
                      </a>
                    )}
                    {TEAM[selectedNode].website && (
                      <a href={TEAM[selectedNode].website} target="_blank" rel="noreferrer">
                        Website
                      </a>
                    )}
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
