export type MemberRole = 'Convenor' | 'Deputy Convenor' | 'Core Member' | 'Extended Core Member' | 'Member';

export interface Member {
  id: number;
  name: string;
  role: MemberRole;
  photo: string;
  description: string;
  github?: string;
  linkedin?: string;
  order_no?: number;
  created_at?: string;
}
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { getApiUrl } from '../../lib/api';
import { Search, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';


// Role badge colours — light editorial palette
const roleMeta: Record<MemberRole, { label: string; classes: string }> = {
  'Convenor':             { label: 'Convenor',             classes: 'bg-amber-50 text-amber-700 border border-amber-200' },
  'Deputy Convenor':      { label: 'Deputy Convenor',      classes: 'bg-blue-50 text-blue-700 border border-blue-200' },
  'Core Member':          { label: 'Core Member',          classes: 'bg-indigo-50 text-indigo-700 border border-indigo-200' },
  'Extended Core Member': { label: 'Extended Core Member', classes: 'bg-purple-50 text-purple-700 border border-purple-200' },
  'Member':               { label: 'Member',               classes: 'bg-gray-100 text-gray-600 border border-gray-200' },
};

const RoleBadge = ({ role }: { role: MemberRole }) => {
  const { label, classes } = roleMeta[role];
  return (
    <span className={`inline-block text-[10px] font-semibold px-2.5 py-0.5 rounded-full mt-1 tracking-wide ${classes}`}>
      {label}
    </span>
  );
};

const cardVariants = {
  hidden: { opacity: 0, y: 40, scale: 0.9 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      delay: i * 0.05,
      duration: 0.5,
      ease: [0.25, 0.46, 0.45, 0.94] as const,
    },
  }),
};

// GitHub SVG icon
const GitHubIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.438 9.8 8.205 11.387.6.113.82-.263.82-.582 0-.288-.012-1.243-.017-2.252-3.338.726-4.042-1.61-4.042-1.61-.546-1.385-1.333-1.754-1.333-1.754-1.09-.745.083-.73.083-.73 1.204.085 1.838 1.237 1.838 1.237 1.07 1.834 2.807 1.304 3.492.997.108-.776.42-1.305.762-1.605-2.665-.303-5.467-1.332-5.467-5.93 0-1.31.468-2.382 1.236-3.222-.124-.304-.536-1.524.117-3.176 0 0 1.008-.322 3.3 1.23a11.5 11.5 0 0 1 3.003-.404c1.02.005 2.047.138 3.003.404 2.29-1.552 3.297-1.23 3.297-1.23.655 1.652.243 2.872.12 3.176.77.84 1.235 1.912 1.235 3.222 0 4.61-2.807 5.624-5.48 5.921.43.372.814 1.103.814 2.222 0 1.606-.015 2.898-.015 3.293 0 .322.216.699.825.58C20.565 21.796 24 17.298 24 12c0-6.63-5.37-12-12-12z" />
  </svg>
);

// LinkedIn SVG icon
const LinkedInIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
    <path d="M20.447 20.452H16.89v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a1.984 1.984 0 1 1 0-3.967 1.984 1.984 0 0 1 0 3.967zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
  </svg>
);

/** Renders a member's avatar — photo if available, initials otherwise */
const MEMBER_PHOTO_OVERRIDES: Record<string, string> = {
  'Anmol Ghogare': 'https://lh3.googleusercontent.com/d/1ff8W6U26StDc86Im77NNMcUd6jCLxCgx',
};

function getDirectImageUrl(url: string): string {
  if (!url) return '';
  const driveMatch = url.match(/(?:id=|\/d\/|src=)([a-zA-Z0-9_-]{25,})/);
  if (driveMatch && (url.includes('drive.google.com') || url.includes('docs.google.com') || url.includes('googleusercontent.com'))) {
    return `https://lh3.googleusercontent.com/d/${driveMatch[1]}`;
  }
  return url;
}

function MemberAvatar({ name, photo }: { name: string; photo: string }) {
  const [imgError, setImgError] = useState(false);
  const rawPhoto = photo || MEMBER_PHOTO_OVERRIDES[name] || '';
  const imageUrl = getDirectImageUrl(rawPhoto);
  const initials = name
    .split(' ')
    .map((n: string) => n[0])
    .filter(Boolean)
    .join('')
    .slice(0, 2)
    .toUpperCase();

  if (imageUrl && !imgError) {
    return (
      <motion.div
        className="w-[84px] h-[84px] rounded-full mx-auto mb-4 overflow-hidden ring-2 ring-primary/30 ring-offset-2 ring-offset-card"
        whileHover={{ scale: 1.1, rotate: 2 }}
        transition={{ type: 'spring', stiffness: 300 }}
      >
        <img
          src={imageUrl}
          alt={name}
          className="w-full h-full object-cover object-top"
          onError={() => setImgError(true)}
          referrerPolicy="no-referrer"
        />
      </motion.div>
    );
  }

  return (
    <div
      style={{
        width: 72, height: 72, borderRadius: '50%',
        background: 'hsl(243, 75%, 92%)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontFamily: 'Inter, sans-serif', fontWeight: 700, fontSize: '1.1rem',
        color: 'hsl(243, 75%, 45%)',
        margin: '0 auto 1rem',
        border: '1.5px solid hsl(243, 75%, 85%)',
      }}
    >
      {initials}
    </div>
  );
}

// Role display order — Convenor first, Members last
const ROLE_ORDER: Record<string, number> = {
  'Convenor':             1,
  'Deputy Convenor':      2,
  'Core Member':          3,
  'Extended Core Member': 4,
  'Member':               5,
};

export default function Team({ isHomepage = false }: { isHomepage?: boolean }) {
  const [memberList, setMemberList] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('all'); // 'all', 'convenor', 'core', 'extended', 'member'

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const res = await fetch(getApiUrl('/api/members'));
        if (!res.ok) throw new Error('Failed to fetch members');
        const data = await res.json();
        
        // Sort automatically by role hierarchy
        const sorted = [...data].sort((a, b) => {
          const roleA = ROLE_ORDER[a.role] ?? 99;
          const roleB = ROLE_ORDER[b.role] ?? 99;
          if (roleA !== roleB) return roleA - roleB;
          // Within same role, sort alphabetically by name
          return a.name.localeCompare(b.name);
        });
        setMemberList(sorted);
      } catch (err) {
        console.error("Failed to fetch members", err);
      } finally {
        setLoading(false);
      }
    };
    fetchMembers();
  }, []);

  const filteredMembers = memberList.filter((m) => {
    if (isHomepage) {
      // Allow all roles on the homepage so the imported members show up
      return true;
    }

    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase();
      const matchesSearch = m.name.toLowerCase().includes(q) ||
                            m.role.toLowerCase().includes(q) ||
                            (m.description && m.description.toLowerCase().includes(q));
      if (!matchesSearch) return false;
    }

    if (roleFilter === 'convenor') {
      return m.role === 'Convenor' || m.role === 'Deputy Convenor';
    } else if (roleFilter === 'core') {
      return m.role === 'Core Member';
    } else if (roleFilter === 'extended') {
      return m.role === 'Extended Core Member';
    } else if (roleFilter === 'member') {
      return m.role === 'Member';
    }

    return true;
  });

  return (
    <section
      id="team"
      style={{
        background: 'hsl(228, 30%, 93%)',
        borderTop: '1px solid hsl(228, 20%, 80%)',
      }}
    >
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '5rem 2rem' }}>
        <h2
          style={{
            fontFamily: 'Playfair Display, Georgia, serif',
            fontSize: 'clamp(2rem, 4vw, 3.5rem)',
            fontWeight: 700,
            letterSpacing: '-0.025em',
            color: 'hsl(230, 25%, 10%)',
            marginBottom: '0.6rem',
          }}
        >
          The team
        </h2>
        <p
          style={{
            fontFamily: 'Inter, sans-serif',
            fontSize: '1rem',
            color: 'hsl(230, 15%, 45%)',
            marginBottom: '2.5rem',
          }}
        >
          Students who keep the Wednesday sessions running.
        </p>

        {/* Search + Filters for full page */}
        {!isHomepage && (
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center', marginBottom: '2rem' }}>
            <div style={{ position: 'relative', flex: '1 1 260px', maxWidth: 340 }}>
              <Search size={14} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: 'hsl(230,15%,50%)' }} />
              <input
                type="text"
                placeholder="Search by name or role..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  width: '100%', paddingLeft: 32, paddingRight: 12, paddingTop: 8, paddingBottom: 8,
                  fontFamily: 'Inter, sans-serif', fontSize: '0.85rem',
                  border: '1px solid hsl(228, 20%, 76%)', borderRadius: 2,
                  background: 'white', outline: 'none', color: 'hsl(230,25%,12%)',
                  boxSizing: 'border-box' as const,
                }}
              />
            </div>
            <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
              {[
                { id: 'all', label: 'All' },
                { id: 'convenor', label: 'Leadership' },
                { id: 'core', label: 'Core' },
                { id: 'extended', label: 'Extended Core' },
                { id: 'member', label: 'Members' },
              ].map((pill) => (
                <button
                  key={pill.id}
                  onClick={() => setRoleFilter(pill.id)}
                  style={{
                    padding: '6px 14px',
                    fontFamily: 'JetBrains Mono, monospace', fontSize: '0.72rem',
                    border: '1px solid',
                    borderColor: roleFilter === pill.id ? 'hsl(243,75%,59%)' : 'hsl(228,20%,76%)',
                    borderRadius: 2,
                    background: roleFilter === pill.id ? 'hsl(243,75%,59%)' : 'transparent',
                    color: roleFilter === pill.id ? 'white' : 'hsl(230,15%,40%)',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                  }}
                >
                  {pill.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {loading ? (
          <p style={{ fontFamily: 'Inter, sans-serif', color: 'hsl(230,15%,50%)', fontSize: '0.9rem' }}>Loading team...</p>
        ) : filteredMembers.length === 0 ? (
          <p style={{ fontFamily: 'Inter, sans-serif', color: 'hsl(230,15%,50%)', fontSize: '0.9rem' }}>No members found.</p>
        ) : (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))',
              borderTop: '1px solid hsl(228,20%,78%)',
              borderLeft: '1px solid hsl(228,20%,78%)',
            }}
          >
            {filteredMembers.map((m) => (
              <div
                key={m.id}
                style={{
                  padding: '1.5rem 1rem',
                  background: 'hsl(228,30%,93%)',
                  textAlign: 'center',
                  transition: 'all 0.25s cubic-bezier(0.34, 1.56, 0.64, 1)',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  borderRight: '1px solid hsl(228,20%,78%)',
                  borderBottom: '1px solid hsl(228,20%,78%)',
                  position: 'relative',
                  cursor: 'pointer',
                }}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLElement).style.background = 'white';
                  (e.currentTarget as HTMLElement).style.transform = 'translateY(-6px) scale(1.04)';
                  (e.currentTarget as HTMLElement).style.boxShadow = '0 12px 24px -6px rgba(99, 102, 241, 0.2)';
                  (e.currentTarget as HTMLElement).style.zIndex = '10';
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLElement).style.background = 'hsl(228,30%,93%)';
                  (e.currentTarget as HTMLElement).style.transform = 'translateY(0) scale(1)';
                  (e.currentTarget as HTMLElement).style.boxShadow = 'none';
                  (e.currentTarget as HTMLElement).style.zIndex = '1';
                }}
              >
                <MemberAvatar name={m.name} photo={m.photo || ''} />
                <h4
                  style={{
                    fontFamily: 'Inter, sans-serif',
                    fontSize: '0.88rem',
                    fontWeight: 600,
                    color: 'hsl(230, 25%, 12%)',
                    marginBottom: '0.35rem',
                    lineHeight: 1.3,
                  }}
                >
                  {m.name}
                </h4>
                <RoleBadge role={m.role} />
                <div style={{ display: 'flex', gap: 10, justifyContent: 'center', marginTop: '0.6rem' }}>
                  {m.github && (
                    <a href={m.github} target="_blank" rel="noopener noreferrer"
                      style={{ color: 'hsl(230,15%,50%)', transition: 'color 0.15s' }}
                      onMouseEnter={e => (e.currentTarget as HTMLElement).style.color = 'hsl(230,25%,12%)'}
                      onMouseLeave={e => (e.currentTarget as HTMLElement).style.color = 'hsl(230,15%,50%)'}
                    >
                      <GitHubIcon />
                    </a>
                  )}
                  {m.linkedin && (
                    <a href={m.linkedin} target="_blank" rel="noopener noreferrer"
                      style={{ color: 'hsl(230,15%,50%)', transition: 'color 0.15s' }}
                      onMouseEnter={e => (e.currentTarget as HTMLElement).style.color = 'hsl(243,75%,59%)'}
                      onMouseLeave={e => (e.currentTarget as HTMLElement).style.color = 'hsl(230,15%,50%)'}
                    >
                      <LinkedInIcon />
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* CTA */}
        {isHomepage && (
          <div style={{ marginTop: '2.5rem' }}>
            <Link
              to="/team"
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 6,
                fontFamily: 'JetBrains Mono, monospace', fontSize: '0.8rem',
                color: 'hsl(243, 75%, 59%)', textDecoration: 'none', letterSpacing: '0.02em',
              }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.textDecoration = 'underline'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.textDecoration = 'none'; }}
            >
              Meet the full team <ArrowRight size={13} />
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
