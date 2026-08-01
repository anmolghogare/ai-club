import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, LogOut, Shield, Loader2, ChevronDown, Calendar, CalendarCheck, FolderKanban, Cpu, Globe, Users, Star, UserCheck } from 'lucide-react';
import { GoogleLogin } from '@react-oauth/google';
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

interface NavItemDef {
  label: string;
  href: string;
  pagePath?: string;
  dropdown?: {
    icon: React.ReactNode;
    label: string;
    sub: string;
    href: string;
  }[];
}

const navItems: NavItemDef[] = [
  {
    label: 'Events',
    href: '/#events',
    pagePath: '/events',
    dropdown: [
      { icon: <Calendar size={15} />, label: 'Upcoming Events', sub: 'Register for live events', href: '/events' },
      { icon: <CalendarCheck size={15} />, label: 'Events Archive', sub: 'Browse past events & workshops', href: '/events#archive' },
    ],
  },
  {
    label: 'Projects',
    href: '/#projects',
    pagePath: '/projects',
    dropdown: [
      { icon: <Cpu size={15} />, label: 'ML / AI Projects', sub: 'Machine learning & deep learning', href: '/projects' },
      { icon: <Globe size={15} />, label: 'Full Stack Projects', sub: 'Web & app development', href: '/projects' },
      { icon: <FolderKanban size={15} />, label: 'All Projects', sub: 'Browse all student projects', href: '/projects' },
    ],
  },
  {
    label: 'Team',
    href: '/#team',
    pagePath: '/team',
    dropdown: [
      { icon: <Star size={15} />, label: 'Leadership', sub: 'Convenors & core team', href: '/team' },
      { icon: <UserCheck size={15} />, label: 'Members Directory', sub: 'All club members', href: '/team' },
    ],
  },
  { 
    label: 'Achievements', 
    href: '/achievements', 
    pagePath: '/achievements' 
  },
  { label: 'Resources', href: '/#resources' },
  { label: 'Blog', href: '/#blog' },
];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [isInitializing, setIsInitializing] = useState(true);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [counts, setCounts] = useState<NavCounts>({ events: 0, projects: 0, members: 0 });
  const dropdownTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const navigate = useNavigate();
  const location = useLocation();

  // Scroll listener
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Close dropdowns on route change
  useEffect(() => {
    setActiveDropdown(null);
    setMobileOpen(false);
    setShowUserDropdown(false);
  }, [location.pathname]);

  // Fetch Supabase counts for badges
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
      } catch (e) {
        // Silently fail — badges just won't show
      }
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
            setIsInitializing(false);
            return;
          }
        }
      } catch (e) {
        console.error('Auth check failed:', e);
      } finally {
        setIsInitializing(false);
      }
      setUser(null);
    };
    checkAuth();
  }, []);

  const handleGoogleSuccess = async (credentialResponse: any) => {
    if (!credentialResponse.credential) return;
    try {
      const apiBaseUrl = getApiUrl('/api/auth/google');
      const syncRes = await fetch(apiBaseUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id_token: credentialResponse.credential }),
        credentials: 'include',
      });
      if (syncRes.ok) {
        const syncData = await syncRes.json();
        if (syncData.status === 'success') {
          if (syncData.token) localStorage.setItem('auth_token', syncData.token);
          setUser({
            name: syncData.user.name,
            email: syncData.user.email,
            picture: syncData.user.profile_image || '',
            is_admin: !!syncData.user.is_admin,
          });
        }
      }
    } catch (syncErr) {
      console.error('Failed to sync login:', syncErr);
    }
  };

  const logout = async () => {
    try {
      const apiBaseUrl = getApiUrl('/api/auth/logout');
      const headers: Record<string, string> = {};
      const token = localStorage.getItem('auth_token');
      if (token) headers['Authorization'] = `Bearer ${token}`;
      await fetch(apiBaseUrl, { method: 'POST', headers, credentials: 'include' });
    } catch (e) {
      console.error('Logout sync failed', e);
    }
    localStorage.removeItem('auth_token');
    setUser(null);
    setShowUserDropdown(false);
  };

  // Handle smart navigation: if same page, scroll; else navigate
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

  // Dropdown hover handlers with delay to prevent flicker
  const handleDropdownEnter = (label: string) => {
    if (dropdownTimerRef.current) clearTimeout(dropdownTimerRef.current);
    setActiveDropdown(label);
  };

  const handleDropdownLeave = () => {
    dropdownTimerRef.current = setTimeout(() => {
      setActiveDropdown(null);
    }, 150);
  };

  const getBadgeCount = (label: string) => {
    if (label === 'Events') return counts.events;
    if (label === 'Projects') return counts.projects;
    if (label === 'Team') return counts.members;
    return 0;
  };

  return (
    <>

      {/* Main nav bar */}
      <motion.nav
        className={`fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 md:px-12 lg:px-20 h-16 backdrop-blur-3xl transition-all duration-500 border-b ${
          scrolled ? 'bg-background/70 border-white/10 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.8)]' : 'bg-surface/30 border-white/5'
        }`}
        initial={{ y: -64, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number] }}
      >
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2.5 shrink-0">
          <img src={aiClubLogo} alt="AI Club DAU Logo" className="w-8 h-8 rounded-sm object-contain" />
          <span className="font-display font-extrabold text-xl text-foreground tracking-tight">
            AI Club <span className="text-primary">DAU</span>
          </span>
        </Link>

        {/* Desktop nav */}
        <ul className="hidden md:flex items-center gap-0.5">
          {navItems.map((item, i) => {
            const badge = getBadgeCount(item.label);
            const hasDropdown = !!item.dropdown;
            const isActive = item.pagePath
              ? location.pathname === item.pagePath
              : location.hash === `#${item.href.split('#')[1]}` && location.pathname === '/';

            return (
              <motion.li
                key={item.label}
                className="relative"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + i * 0.08, duration: 0.4 }}
                onMouseEnter={() => hasDropdown && handleDropdownEnter(item.label)}
                onMouseLeave={() => hasDropdown && handleDropdownLeave()}
              >
                <a
                  href={item.pagePath || item.href}
                  onClick={(e) => handleNavClick(e, item.pagePath || item.href)}
                  className={`relative flex items-center gap-1 px-4 py-2 text-sm font-medium transition-colors group rounded-lg ${
                    isActive
                      ? 'text-foreground bg-primary/10'
                      : 'text-muted-foreground hover:text-foreground hover:bg-secondary/60'
                  }`}
                >
                  {item.label}
                  {badge > 0 && (
                    <span className="inline-flex items-center justify-center min-w-[18px] h-[18px] px-1 rounded-full bg-primary/20 text-primary text-[10px] font-bold leading-none border border-primary/30">
                      {badge}
                    </span>
                  )}
                  {hasDropdown && (
                    <ChevronDown
                      size={13}
                      className={`text-muted-foreground transition-transform duration-200 ${
                        activeDropdown === item.label ? 'rotate-180 text-primary' : ''
                      }`}
                    />
                  )}
                  {/* Active underline */}
                  {isActive && (
                    <motion.div
                      layoutId="nav-active-pill"
                      className="absolute bottom-0 left-4 right-4 h-0.5 bg-primary rounded-full"
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  )}
                </a>

                {/* Dropdown mega-menu */}
                {hasDropdown && (
                  <AnimatePresence>
                    {activeDropdown === item.label && (
                      <motion.div
                        initial={{ opacity: 0, y: 8, scale: 0.97 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 8, scale: 0.97 }}
                        transition={{ duration: 0.18, ease: 'easeOut' }}
                        className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-60 rounded-2xl border border-border bg-card/95 backdrop-blur-xl shadow-2xl overflow-hidden z-50"
                        style={{ boxShadow: '0 8px 32px hsl(217 91% 60% / 0.12)' }}
                        onMouseEnter={() => handleDropdownEnter(item.label)}
                        onMouseLeave={handleDropdownLeave}
                      >
                        {/* Top accent line */}
                        <div className="h-[2px] w-full bg-gradient-to-r from-primary to-accent" />
                        <div className="p-2">
                          {item.dropdown!.map((sub) => (
                            <Link
                              key={sub.label}
                              to={sub.href}
                              className="flex items-start gap-3 p-3 rounded-xl hover:bg-primary/8 group transition-colors"
                            >
                              <span className="mt-0.5 text-primary/70 group-hover:text-primary transition-colors shrink-0">
                                {sub.icon}
                              </span>
                              <div>
                                <p className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors leading-snug">
                                  {sub.label}
                                </p>
                                <p className="text-[11px] text-muted-foreground mt-0.5 leading-relaxed">
                                  {sub.sub}
                                </p>
                              </div>
                            </Link>
                          ))}
                        </div>
                        {/* Footer: quick counts */}
                        {item.label === 'Team' && counts.members > 0 && (
                          <div className="px-4 py-2.5 border-t border-border/60 flex items-center gap-1.5">
                            <Users size={11} className="text-primary/60" />
                            <span className="text-[10px] text-muted-foreground font-mono">{counts.members} active members</span>
                          </div>
                        )}
                        {item.label === 'Projects' && counts.projects > 0 && (
                          <div className="px-4 py-2.5 border-t border-border/60 flex items-center gap-1.5">
                            <FolderKanban size={11} className="text-primary/60" />
                            <span className="text-[10px] text-muted-foreground font-mono">{counts.projects} student projects</span>
                          </div>
                        )}
                        {item.label === 'Events' && counts.events > 0 && (
                          <div className="px-4 py-2.5 border-t border-border/60 flex items-center gap-1.5">
                            <Calendar size={11} className="text-primary/60" />
                            <span className="text-[10px] text-muted-foreground font-mono">{counts.events} upcoming events</span>
                          </div>
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>
                )}
              </motion.li>
            );
          })}

          {/* Auth section */}
          {isInitializing ? (
            <div className="flex items-center justify-center w-28 h-9 bg-secondary/80 border border-border rounded-full ml-2">
              <Loader2 className="animate-spin text-primary/70" size={14} />
            </div>
          ) : user ? (
            <div className="relative ml-2">
              <button
                onClick={() => setShowUserDropdown(!showUserDropdown)}
                className="flex items-center gap-2 p-1 pr-3 rounded-full bg-secondary/80 border border-border hover:bg-secondary transition-all"
              >
                {user.picture ? (
                  <img src={user.picture} alt={user.name} className="w-7 h-7 rounded-full object-cover" />
                ) : (
                  <div className="w-7 h-7 rounded-full bg-primary/20 flex items-center justify-center text-primary text-xs font-bold">
                    {user.name[0]}
                  </div>
                )}
                <span className="text-xs font-semibold text-foreground max-w-[80px] truncate">
                  {user.name.split(' ')[0]}
                </span>
                {user.is_admin && <Shield size={11} className="text-primary shrink-0" />}
              </button>

              <AnimatePresence>
                {showUserDropdown && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 mt-2 w-52 rounded-xl bg-card border border-border p-1.5 shadow-xl z-50"
                  >
                    <div className="px-3 py-2 border-b border-border mb-1.5">
                      <p className="text-xs font-semibold text-foreground truncate">{user.name}</p>
                      <p className="text-[10px] text-muted-foreground truncate">{user.email}</p>
                      {user.is_admin && (
                        <span className="inline-flex items-center gap-1 mt-1 text-[9px] font-semibold text-primary bg-primary/10 border border-primary/20 rounded-full px-2 py-0.5">
                          <Shield size={9} /> Administrator
                        </span>
                      )}
                    </div>

                    {user.is_admin && (
                      <a
                        href="/admin"
                        className="flex w-full items-center gap-2 px-3 py-2 text-xs font-medium text-foreground hover:bg-secondary rounded-lg transition-colors mb-1"
                      >
                        <Shield size={14} className="text-primary" />
                        Admin Dashboard
                      </a>
                    )}

                    <button
                      onClick={logout}
                      className="flex w-full items-center gap-2 px-3 py-2 text-xs font-medium text-destructive hover:bg-destructive/10 rounded-lg transition-colors"
                    >
                      <LogOut size={14} />
                      Sign Out
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <motion.li
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.7, duration: 0.4, type: 'spring', stiffness: 200 }}
              className="ml-2 list-none"
            >
              <GoogleLogin
                onSuccess={handleGoogleSuccess}
                onError={() => console.log('Login Failed')}
                theme="filled_blue"
                size="medium"
                shape="rectangular"
              />
            </motion.li>
          )}
        </ul>

        {/* Mobile hamburger */}
        <motion.button
          className="md:hidden text-foreground"
          onClick={() => setMobileOpen(!mobileOpen)}
          whileTap={{ scale: 0.9, rotate: 90 }}
          transition={{ duration: 0.2 }}
        >
          {mobileOpen ? <X size={24} /> : <Menu size={24} />}
        </motion.button>

        {/* Mobile menu */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
              className="absolute top-16 left-0 right-0 bg-background/97 backdrop-blur-xl border-b border-border overflow-hidden md:hidden"
            >
              <ul className="flex flex-col gap-1 p-5">
                {/* Section: Main Links */}
                <p className="text-[9px] font-mono tracking-widest uppercase text-muted-foreground/60 mb-1 px-1">Navigate</p>
                {navItems.map((item, i) => {
                  const badge = getBadgeCount(item.label);
                  return (
                    <motion.li
                      key={item.label}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.06, duration: 0.3 }}
                    >
                      <a
                        href={item.pagePath || item.href}
                        onClick={(e) => {
                          handleNavClick(e, item.pagePath || item.href);
                          setMobileOpen(false);
                        }}
                        className="flex items-center justify-between py-2.5 px-3 rounded-xl text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-secondary/50 transition-colors"
                      >
                        <span>{item.label}</span>
                        {badge > 0 && (
                          <span className="text-[10px] font-bold bg-primary/20 text-primary border border-primary/30 px-2 py-0.5 rounded-full">
                            {badge}
                          </span>
                        )}
                      </a>
                    </motion.li>
                  );
                })}

                <div className="my-2 h-px bg-border" />

                {/* Section: Club social links */}
                <p className="text-[9px] font-mono tracking-widest uppercase text-muted-foreground/60 mb-1 px-1">Community</p>
                <div className="grid grid-cols-2 gap-2 mb-3">
                  {[
                    { label: 'Instagram', href: 'https://www.instagram.com/aiclub_daiict?igsh=eTgxajEwZHBjMzNo', emoji: '📸' },
                    { label: 'LinkedIn', href: 'https://www.linkedin.com/company/ai-club-daiict/', emoji: '💼' },
                    { label: 'YouTube', href: 'https://www.youtube.com/@AIClubDAU', emoji: '📺' },
                    { label: 'Discord', href: 'https://discord.gg/bU7JdWa6', emoji: '🎮' },
                    { label: 'GitHub', href: 'https://github.com/ai-club-daiict', emoji: '💻' },
                  ].map(link => (
                    <a
                      key={link.label}
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 px-3 py-2 rounded-xl bg-secondary/40 border border-border/50 text-xs text-muted-foreground hover:text-foreground hover:border-primary/30 transition-colors"
                    >
                      <span>{link.emoji}</span> {link.label}
                    </a>
                  ))}
                </div>

                <div className="my-1 h-px bg-border" />

                {/* Auth section */}
                {isInitializing ? (
                  <div className="flex justify-center py-2 list-none">
                    <Loader2 className="animate-spin text-primary/70" size={16} />
                  </div>
                ) : user ? (
                  <>
                    {user.is_admin && (
                      <motion.li
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: navItems.length * 0.05, duration: 0.3 }}
                        className="list-none py-1"
                      >
                        <a
                          href="/admin"
                          className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-semibold rounded-xl bg-secondary border border-border text-foreground hover:bg-secondary/80 transition-colors"
                        >
                          <Shield size={14} className="text-primary" />
                          Admin Dashboard
                        </a>
                      </motion.li>
                    )}

                    <motion.li
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: navItems.length * 0.06, duration: 0.3 }}
                      className="flex items-center justify-between py-2 px-2 list-none"
                    >
                      <div className="flex items-center gap-3">
                        {user.picture ? (
                          <img src={user.picture} alt={user.name} className="w-9 h-9 rounded-full object-cover ring-2 ring-primary/30" />
                        ) : (
                          <div className="w-9 h-9 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">
                            {user.name[0]}
                          </div>
                        )}
                        <div>
                          <p className="text-sm font-semibold text-foreground">{user.name}</p>
                          <p className="text-xs text-muted-foreground truncate max-w-[160px]">{user.email}</p>
                        </div>
                      </div>
                      <button
                        onClick={() => { logout(); setMobileOpen(false); }}
                        className="p-2 rounded-lg bg-destructive/10 text-destructive hover:bg-destructive/20 transition-colors"
                      >
                        <LogOut size={16} />
                      </button>
                    </motion.li>
                  </>
                ) : (
                  <motion.li
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: navItems.length * 0.06, duration: 0.3 }}
                    className="flex justify-center list-none pt-1"
                  >
                    <GoogleLogin
                      onSuccess={(res) => { handleGoogleSuccess(res); setMobileOpen(false); }}
                      onError={() => console.log('Login Failed')}
                      theme="filled_blue"
                      size="medium"
                      shape="rectangular"
                    />
                  </motion.li>
                )}
              </ul>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>
    </>
  );
}
