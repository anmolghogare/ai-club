import { useState, useEffect, useRef } from 'react';
import { Menu, X, LogOut, Shield, ChevronDown } from 'lucide-react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { getApiUrl } from '../../lib/api';
import aiClubLogo from '@/assets/ai-club-logo.jpeg';

interface UserProfile {
  name: string;
  email: string;
  picture: string;
  is_admin: boolean;
}

interface NavCounts {
  events: number;
  projects: number;
  members: number;
}

const navItems = [
  { label: 'About', href: '/#about' },
  { label: 'Events', href: '/#events', pagePath: '/events' },
  { label: 'Tracks', href: '/#projects', pagePath: '/projects' },
  { label: 'Resources', href: '/#resources' },
  { label: 'Team', href: '/#team', pagePath: '/team' },
  { label: 'Achievements', href: '/achievements', pagePath: '/achievements' },
];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [counts, setCounts] = useState<NavCounts>({ events: 0, projects: 0, members: 0 });
  const dropdownRef = useRef<HTMLDivElement>(null);

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    setShowUserDropdown(false);
  }, [location.pathname]);

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setShowUserDropdown(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  // Fetch counts
  useEffect(() => {
    const fetchCounts = async () => {
      try {
        const [eventsRes, projectsRes, membersRes] = await Promise.all([
          supabase.from('events').select('id', { count: 'exact', head: true }).in('status', ['upcoming', 'registration_open']),
          supabase.from('club_projects').select('id', { count: 'exact', head: true }),
          supabase.from('club_members').select('id', { count: 'exact', head: true }),
        ]);
        setCounts({
          events: eventsRes.count ?? 0,
          projects: projectsRes.count ?? 0,
          members: membersRes.count ?? 0,
        });
      } catch (_) {}
    };
    fetchCounts();
  }, []);

  // Auth check
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const apiBaseUrl = getApiUrl('/api/auth/me');
        const headers: Record<string, string> = {};
        const token = localStorage.getItem('auth_token');
        if (token) headers['Authorization'] = `Bearer ${token}`;
        const res = await fetch(apiBaseUrl, { headers, credentials: 'include' });
        if (res.ok) {
          const data = await res.json();
          if (data.authenticated && data.user) {
            setUser({
              name: data.user.name,
              email: data.user.email,
              picture: data.user.profile_image || '',
              is_admin: !!data.user.is_admin,
            });
            return;
          }
        }
      } catch (_) {}
      setUser(null);
    };
    checkAuth();
  }, []);

  const logout = async () => {
    try {
      const apiBaseUrl = getApiUrl('/api/auth/logout');
      const headers: Record<string, string> = {};
      const token = localStorage.getItem('auth_token');
      if (token) headers['Authorization'] = `Bearer ${token}`;
      await fetch(apiBaseUrl, { method: 'POST', headers, credentials: 'include' });
    } catch (_) {}
    localStorage.removeItem('auth_token');
    setUser(null);
    setShowUserDropdown(false);
  };

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    const parts = href.split('#');
    const path = parts[0] || '/';
    const hash = parts[1];
    if (location.pathname !== path && path !== '') {
      e.preventDefault();
      navigate(href);
    } else if (hash) {
      e.preventDefault();
      const el = document.getElementById(hash);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const isActive = (item: typeof navItems[0]) => {
    if (item.pagePath) return location.pathname === item.pagePath;
    const hash = item.href.split('#')[1];
    return location.hash === `#${hash}` && location.pathname === '/';
  };

  return (
    <>
      <nav
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 50,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          height: '56px',
          padding: '0 2rem',
          backgroundColor: scrolled ? 'hsl(228, 30%, 93%)' : 'hsl(228, 30%, 93%)',
          borderBottom: '1px solid hsl(228, 20%, 80%)',
          transition: 'box-shadow 0.3s ease',
          boxShadow: scrolled ? '0 1px 12px rgba(0,0,0,0.06)' : 'none',
        }}
      >
        {/* Logo */}
        <Link
          to="/"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            textDecoration: 'none',
            flexShrink: 0,
          }}
        >
          <img src={aiClubLogo} alt="AI Club DAU" style={{ width: 26, height: 26, borderRadius: 3, objectFit: 'contain' }} />
          <span style={{ fontFamily: 'Inter, sans-serif', fontWeight: 700, fontSize: '0.95rem', color: 'hsl(230, 25%, 12%)' }}>
            AI Club{' '}
            <span style={{ fontWeight: 400, color: 'hsl(230, 15%, 45%)' }}>DA-IICT</span>
          </span>
        </Link>

        {/* Desktop nav links */}
        <ul style={{ display: 'flex', alignItems: 'center', gap: '0', listStyle: 'none', margin: 0, padding: 0 }} className="hidden md:flex">
          {navItems.map((item) => {
            const active = isActive(item);
            return (
              <li key={item.label}>
                <a
                  href={item.pagePath || item.href}
                  onClick={(e) => handleNavClick(e, item.pagePath || item.href)}
                  style={{
                    display: 'block',
                    padding: '0 14px',
                    height: '56px',
                    lineHeight: '56px',
                    fontFamily: 'Inter, sans-serif',
                    fontSize: '0.83rem',
                    fontWeight: active ? 600 : 400,
                    color: active ? 'hsl(243, 75%, 59%)' : 'hsl(230, 15%, 35%)',
                    textDecoration: 'none',
                    borderBottom: active ? '2px solid hsl(243, 75%, 59%)' : '2px solid transparent',
                    transition: 'color 0.15s ease, border-color 0.15s ease',
                    whiteSpace: 'nowrap',
                  }}
                  onMouseEnter={(e) => {
                    if (!active) {
                      (e.currentTarget as HTMLElement).style.color = 'hsl(230, 25%, 12%)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!active) {
                      (e.currentTarget as HTMLElement).style.color = 'hsl(230, 15%, 35%)';
                    }
                  }}
                >
                  {item.label}
                </a>
              </li>
            );
          })}
        </ul>

        {/* Right: Auth + Join */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexShrink: 0 }} className="hidden md:flex">
          {user ? (
            <div ref={dropdownRef} style={{ position: 'relative' }}>
              <button
                onClick={() => setShowUserDropdown(!showUserDropdown)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '4px 10px 4px 4px',
                  border: '1px solid hsl(228, 20%, 80%)',
                  borderRadius: '4px',
                  background: 'white',
                  cursor: 'pointer',
                  transition: 'border-color 0.15s',
                }}
              >
                {user.picture ? (
                  <img src={user.picture} alt={user.name} style={{ width: 26, height: 26, borderRadius: '50%', objectFit: 'cover' }} />
                ) : (
                  <div style={{ width: 26, height: 26, borderRadius: '50%', background: 'hsl(243,75%,90%)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '0.7rem', color: 'hsl(243,75%,59%)' }}>
                    {user.name[0]}
                  </div>
                )}
                <span style={{ fontSize: '0.8rem', fontWeight: 500, color: 'hsl(230,25%,12%)', maxWidth: 80, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {user.name.split(' ')[0]}
                </span>
                {user.is_admin && <Shield size={11} style={{ color: 'hsl(243,75%,59%)' }} />}
                <ChevronDown size={12} style={{ color: 'hsl(230,15%,45%)', transform: showUserDropdown ? 'rotate(180deg)' : 'none', transition: 'transform 0.15s' }} />
              </button>

              {showUserDropdown && (
                <div style={{
                  position: 'absolute',
                  right: 0,
                  marginTop: '6px',
                  width: '200px',
                  background: 'white',
                  border: '1px solid hsl(228,20%,80%)',
                  borderRadius: '4px',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                  zIndex: 100,
                  overflow: 'hidden',
                }}>
                  <div style={{ padding: '12px 14px', borderBottom: '1px solid hsl(228,20%,88%)' }}>
                    <p style={{ fontSize: '0.8rem', fontWeight: 600, color: 'hsl(230,25%,12%)', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user.name}</p>
                    <p style={{ fontSize: '0.7rem', color: 'hsl(230,15%,50%)', margin: '2px 0 0', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user.email}</p>
                    {user.is_admin && (
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 3, marginTop: 4, fontSize: '0.65rem', fontWeight: 600, color: 'hsl(243,75%,59%)', background: 'hsl(243,75%,96%)', border: '1px solid hsl(243,75%,80%)', borderRadius: 99, padding: '2px 7px' }}>
                        <Shield size={8} /> Admin
                      </span>
                    )}
                  </div>
                  {user.is_admin && (
                    <a href="/admin" style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 14px', fontSize: '0.8rem', color: 'hsl(230,25%,12%)', textDecoration: 'none', transition: 'background 0.15s' }}
                      onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = 'hsl(228,20%,96%)'}
                      onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = 'transparent'}>
                      <Shield size={13} style={{ color: 'hsl(243,75%,59%)' }} /> Admin Dashboard
                    </a>
                  )}
                  <button
                    onClick={logout}
                    style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 14px', width: '100%', border: 'none', background: 'transparent', fontSize: '0.8rem', color: 'hsl(0,70%,50%)', cursor: 'pointer', transition: 'background 0.15s' }}
                    onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = 'hsl(0,70%,97%)'}
                    onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = 'transparent'}
                  >
                    <LogOut size={13} /> Sign Out
                  </button>
                </div>
              )}
            </div>
          ) : null}

          <a
            href="https://discord.gg/bU7JdWa6"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              padding: '7px 18px',
              background: 'hsl(230, 25%, 12%)',
              color: 'hsl(228, 30%, 93%)',
              fontFamily: 'Inter, sans-serif',
              fontSize: '0.82rem',
              fontWeight: 600,
              border: '1.5px solid hsl(230, 25%, 12%)',
              borderRadius: '2px',
              textDecoration: 'none',
              transition: 'background 0.15s ease, color 0.15s ease',
              letterSpacing: '0.02em',
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.background = 'hsl(243, 75%, 59%)';
              (e.currentTarget as HTMLElement).style.borderColor = 'hsl(243, 75%, 59%)';
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.background = 'hsl(230, 25%, 12%)';
              (e.currentTarget as HTMLElement).style.borderColor = 'hsl(230, 25%, 12%)';
            }}
          >
            Join
          </a>
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden"
          onClick={() => setMobileOpen(!mobileOpen)}
          style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'hsl(230, 25%, 12%)', padding: 4 }}
        >
          {mobileOpen ? <X size={22} /> : <Menu size={22} />}
        </button>

        {/* Mobile menu */}
        {mobileOpen && (
          <div
            className="md:hidden"
            style={{
              position: 'absolute',
              top: '56px',
              left: 0,
              right: 0,
              background: 'hsl(228, 30%, 93%)',
              borderBottom: '1px solid hsl(228, 20%, 80%)',
              padding: '1rem 2rem 1.5rem',
              zIndex: 49,
            }}
          >
            <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
              {navItems.map((item) => {
                const active = isActive(item);
                return (
                  <li key={item.label} style={{ borderBottom: '1px solid hsl(228, 20%, 85%)' }}>
                    <a
                      href={item.pagePath || item.href}
                      onClick={(e) => { handleNavClick(e, item.pagePath || item.href); setMobileOpen(false); }}
                      style={{
                        display: 'block',
                        padding: '12px 0',
                        fontFamily: 'Inter, sans-serif',
                        fontSize: '0.9rem',
                        fontWeight: active ? 600 : 400,
                        color: active ? 'hsl(243, 75%, 59%)' : 'hsl(230, 20%, 25%)',
                        textDecoration: 'none',
                      }}
                    >
                      {item.label}
                    </a>
                  </li>
                );
              })}
            </ul>

            <div style={{ marginTop: '1.25rem', display: 'flex', gap: 10 }}>
              <a
                href="https://discord.gg/bU7JdWa6"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'inline-flex', alignItems: 'center', padding: '8px 20px',
                  background: 'hsl(230, 25%, 12%)', color: 'hsl(228, 30%, 93%)',
                  fontFamily: 'Inter, sans-serif', fontSize: '0.82rem', fontWeight: 600,
                  border: '1.5px solid hsl(230, 25%, 12%)', borderRadius: 2, textDecoration: 'none',
                }}
              >
                Join the club
              </a>
              {user && (
                <button
                  onClick={() => { logout(); setMobileOpen(false); }}
                  style={{
                    display: 'inline-flex', alignItems: 'center', gap: 6, padding: '8px 16px',
                    background: 'transparent', color: 'hsl(0,70%,50%)',
                    fontFamily: 'Inter, sans-serif', fontSize: '0.82rem',
                    border: '1px solid hsl(228, 20%, 80%)', borderRadius: 2, cursor: 'pointer',
                  }}
                >
                  <LogOut size={14} /> Sign Out
                </button>
              )}
            </div>

            {user && (
              <div style={{ marginTop: '1rem', display: 'flex', alignItems: 'center', gap: 10, padding: '10px', background: 'white', border: '1px solid hsl(228,20%,80%)', borderRadius: 4 }}>
                {user.picture ? (
                  <img src={user.picture} alt={user.name} style={{ width: 32, height: 32, borderRadius: '50%', objectFit: 'cover' }} />
                ) : (
                  <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'hsl(243,75%,90%)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, color: 'hsl(243,75%,59%)' }}>
                    {user.name[0]}
                  </div>
                )}
                <div>
                  <p style={{ margin: 0, fontSize: '0.82rem', fontWeight: 600, color: 'hsl(230,25%,12%)' }}>{user.name}</p>
                  <p style={{ margin: 0, fontSize: '0.7rem', color: 'hsl(230,15%,50%)' }}>{user.email}</p>
                </div>
                {user.is_admin && (
                  <a href="/admin" style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 4, fontSize: '0.75rem', color: 'hsl(243,75%,59%)', textDecoration: 'none' }}>
                    <Shield size={12} /> Admin
                  </a>
                )}
              </div>
            )}
          </div>
        )}
      </nav>
    </>
  );
}
