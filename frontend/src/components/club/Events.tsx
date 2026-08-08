import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Upload, Users, ArrowRight, Loader2, CalendarDays, Mic, UsersRound, Search, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { getApiUrl } from '../../lib/api';

interface EventModel {
  id: number;
  title: string;
  description: string;
  banner: string | null;
  category: string;
  venue: string;
  contact_email: string;
  event_type: 'individual' | 'team';
  registration_link?: string | null;
  min_team_size: number | null;
  max_team_size: number | null;
  event_date: string;
  event_start_date?: string;
  event_end_date?: string;
  start_time: string;
  end_time: string;
  registration_start: string;
  registration_end: string;
  status: 'upcoming' | 'registration_open' | 'registration_closed' | 'completed';
  winners?: string | null;
  winner_link?: string | null;
}

interface FormFieldModel {
  id: number;
  label: string;
  field_type: 'text' | 'email' | 'phone' | 'number' | 'textarea' | 'dropdown' | 'radio' | 'checkbox' | 'date' | 'file';
  placeholder: string | null;
  required: boolean;
  options_json: string | null;
  order_no: number;
  file_max_size_kb: number | null;
  file_allowed_types: string | null;
}

interface PastEvent {
  id: number;
  title: string;
  date_label: string;
  category: string;
  description: string;
  speaker: string | null;
  participants: number | null;
  image_url: string | null;
  sort_order: number;
  winners?: string | null;
  winner_link?: string | null;
}

interface PastEventModel {
  id: number;
  title: string;
  category: string;
  date_label: string;
  description: string;
  speaker?: string | null;
  participants?: number | null;
  image_url?: string | null;
  sort_order?: number;
  winners?: string | null;
  winner_link?: string | null;
}

export default function Events({ isHomepage = false }: { isHomepage?: boolean }) {
  const [activeTab, setActiveTab] = useState('upcoming');
  const [events, setEvents] = useState<EventModel[]>([]);
  const [pastEvents, setPastEvents] = useState<PastEventModel[]>([]);
  const [loadingEvents, setLoadingEvents] = useState(true);
  const [timeLeft, setTimeLeft] = useState({ d: '00', h: '00', m: '00', s: '00' });
  const [searchQuery, setSearchQuery] = useState('');
  
  // Filter state (full-page only)
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [categoryFilter, setCategoryFilter] = useState<string>('');
  
  const [selectedEvent, setSelectedEvent] = useState<EventModel | null>(null);
  
  // Dynamic Form schema state
  const [formFields, setFormFields] = useState<FormFieldModel[]>([]);
  const [loadingSchema, setLoadingSchema] = useState(false);
  const [responses, setResponses] = useState<Record<string, any>>({});
  const [uploadedFiles, setUploadedFiles] = useState<Record<string, File>>({});
  const [userProfile, setUserProfile] = useState<any>(null);
  const [registeredEventIds, setRegisteredEventIds] = useState<number[]>([]);

  // Team Registration state
  const [teamName, setTeamName] = useState('');
  const [teamMembers, setTeamMembers] = useState<Array<{ name: string; email: string }>>([
    { name: '', email: '' }
  ]);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // 1. Fetch Events from backend (with optional filters)
  const fetchEvents = async (status?: string, category?: string) => {
    setLoadingEvents(true);
    try {
      const params = new URLSearchParams({ limit: '50' });
      if (status) params.set('status', status);
      if (category) params.set('category', category);
      const res = await fetch(getApiUrl(`/api/events?${params}`));
      if (res.ok) {
        const data = await res.json();
        setEvents(data.events || []);
      }
    } catch (e) {
      console.error('Failed to fetch events from backend, falling back to static descriptions.', e);
    } finally {
      setLoadingEvents(false);
    }
  };

  const fetchUserData = async () => {
    try {
      const authRes = await fetch(getApiUrl('/api/auth/me'), { credentials: 'include' });
      if (authRes.ok) {
        const authData = await authRes.json();
        if (authData.authenticated && authData.user) {
          setUserProfile(authData.user);

          // Fetch registrations
          const regRes = await fetch(getApiUrl('/api/user/registrations'), { credentials: 'include' });
          if (regRes.ok) {
            const regData = await regRes.json();
            if (regData.registrations) {
              setRegisteredEventIds(regData.registrations.map((r: any) => r.event_id));
            }
          }
        }
      }
    } catch (e) {
      console.error('Failed to fetch user data', e);
    }
  };

  const fetchPastEvents = async () => {
    try {
      const res = await fetch(getApiUrl('/api/past-events'));
      if (res.ok) {
        const data = await res.json();
        setPastEvents(data || []);
      }
    } catch (e) {
      console.error('Failed to fetch past events', e);
    }
  };

  useEffect(() => {
    // Fetch initial data
    fetchEvents();
    fetchPastEvents();
    fetchUserData();
  }, []);

  // Effect to re-fetch when filters change (only on full page)
  useEffect(() => {
    if (!isHomepage) {
      fetchEvents(statusFilter, categoryFilter);
    }
  }, [statusFilter, categoryFilter, isHomepage]);

  const featured = events.find(ev => ev.status === 'registration_open') || events.find(ev => ev.status === 'upcoming');

  // Countdown timer for next event based on real database featured event
  useEffect(() => {
    const rawDate = featured.event_start_date || featured.event_date;
    if (!rawDate) {
      setTimeLeft({ d: '00', h: '00', m: '00', s: '00' });
      return;
    }
    const targetStr = `${rawDate}T${featured.start_time || '00:00:00'}`;
    const target = new Date(targetStr).getTime();
    if (isNaN(target)) {
      setTimeLeft({ d: '00', h: '00', m: '00', s: '00' });
      return;
    }
    
    const updateTimer = () => {
      const diff = target - Date.now();
      if (diff <= 0) {
        setTimeLeft({ d: '00', h: '00', m: '00', s: '00' });
        return false;
      }
      setTimeLeft({
        d: String(Math.floor(diff / 86400000)).padStart(2, '0'),
        h: String(Math.floor((diff % 86400000) / 3600000)).padStart(2, '0'),
        m: String(Math.floor((diff % 3600000) / 60000)).padStart(2, '0'),
        s: String(Math.floor((diff % 60000) / 1000)).padStart(2, '0'),
      });
      return true;
    };

    const hasTime = updateTimer();
    if (!hasTime) return;

    const interval = setInterval(() => {
      const continuing = updateTimer();
      if (!continuing) clearInterval(interval);
    }, 1000);
    
    return () => clearInterval(interval);
  }, [featured]);

  // 2. Load form schema when an event is selected
  useEffect(() => {
    if (selectedEvent) {
      const loadSchema = async () => {
        setLoadingSchema(true);
        setFormFields([]);
        setResponses({});
        setUploadedFiles({});
        setTeamName('');
        setTeamMembers([{ name: '', email: '' }]);
        setSubmitMessage(null);

        // Prepopulate default fields from backend profile
        let profile: any = {};
        try {
          const authRes = await fetch(getApiUrl('/api/auth/me'), { credentials: 'include' });
          if (authRes.ok) {
            const authData = await authRes.json();
            if (authData.authenticated && authData.user) {
              profile = authData.user;
              setUserProfile(authData.user);
            } else {
              setUserProfile(null);
            }
          } else {
            setUserProfile(null);
          }
        } catch (e) {
          console.error('Failed to retrieve authentication details:', e);
          setUserProfile(null);
        }

        try {
          const res = await fetch(getApiUrl(`/api/events/${selectedEvent.id}/form-schema`));
          if (res.ok) {
            const data = await res.json();
            const fields: FormFieldModel[] = data.fields || [];
            setFormFields(fields);
            
            // Pre-fill fields with user profile info by label matching
            const initialResponses: Record<string, any> = {};
            fields.forEach(field => {
              const labelLower = field.label.toLowerCase();
              if (labelLower.includes('name') && profile.name) {
                initialResponses[field.id] = profile.name;
              } else if (labelLower.includes('email') && profile.email) {
                initialResponses[field.id] = profile.email;
              } else if (field.field_type === 'checkbox') {
                initialResponses[field.id] = [];
              } else {
                initialResponses[field.id] = '';
              }
            });
            setResponses(initialResponses);
          }
        } catch (e) {
          console.error('Failed to load form schema', e);
        } finally {
          setLoadingSchema(false);
        }
      };
      loadSchema();
    } else {
      setFormFields([]);
      setResponses({});
      setUploadedFiles({});
      setSubmitMessage(null);
      setUserProfile(null);
    }
  }, [selectedEvent]);

  // Handle input changes dynamically
  const handleInputChange = (fieldId: number, value: any) => {
    setResponses(prev => ({ ...prev, [fieldId]: value }));
  };

  const handleCheckboxChange = (fieldId: number, option: string, checked: boolean) => {
    const currentList = responses[fieldId] || [];
    let updatedList = [];
    if (checked) {
      updatedList = [...currentList, option];
    } else {
      updatedList = currentList.filter((item: string) => item !== option);
    }
    handleInputChange(fieldId, updatedList);
  };

  const handleFileChange = (fieldId: number, file: File) => {
    setUploadedFiles(prev => ({ ...prev, [fieldId]: file }));
    handleInputChange(fieldId, file.name);
  };

  const addTeamMember = () => {
    if (selectedEvent && selectedEvent.max_team_size && teamMembers.length + 1 >= selectedEvent.max_team_size) {
      // reached limit (note: leader is not in members array, so limit is max_team_size - 1)
    }
    setTeamMembers(prev => [...prev, { name: '', email: '' }]);
  };

  const removeTeamMember = (index: number) => {
    setTeamMembers(prev => prev.filter((_, i) => i !== index));
  };

  // Submit registration form
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedEvent) return;

    // Check if user is logged in
    let currentUser = userProfile;
    if (!currentUser) {
      try {
        const authRes = await fetch(getApiUrl('/api/auth/me'), { credentials: 'include' });
        if (authRes.ok) {
          const authData = await authRes.json();
          if (authData.authenticated && authData.user) {
            currentUser = authData.user;
            setUserProfile(authData.user);
          }
        }
      } catch (err) {
        console.error("Failed to check auth during submission", err);
      }
    }

    if (!currentUser) {
      setSubmitMessage({ type: 'error', text: 'You must be logged in to register for events.' });
      return;
    }

    setIsSubmitting(true);
    setSubmitMessage(null);

    try {
      // Check required fields
      for (const field of formFields) {
        if (field.required && !responses[field.id] && !uploadedFiles[field.id]) {
          throw new Error(`The field "${field.label}" is required.`);
        }
      }

      // Team validation
      let teamInput = null;
      if (selectedEvent.event_type === 'team') {
        if (!teamName.trim()) {
          throw new Error('Team Name is required.');
        }
        const activeMembers = teamMembers.filter(m => m.name.trim() && m.email.trim());
        const totalTeamSize = activeMembers.length + 1; // leader + members
        const minSize = selectedEvent.min_team_size || 2;
        const maxSize = selectedEvent.max_team_size || 4;

        if (totalTeamSize < minSize || totalTeamSize > maxSize) {
          throw new Error(`Team size must be between ${minSize} and ${maxSize} members.`);
        }
        teamInput = {
          team_name: teamName.trim(),
          members: activeMembers.map(m => ({ member_name: m.name.trim(), member_email: m.email.trim() }))
        };
      }

      const hasFiles = Object.keys(uploadedFiles).length > 0;
      const apiPath = `/api/events/${selectedEvent.id}/register`;

      let res;
      if (hasFiles) {
        // Send as multipart/form-data — cookie is attached automatically via credentials:'include'
        const formDataPayload = new FormData();
        formDataPayload.append('data', JSON.stringify({
          responses: responses,
          team: teamInput
        }));

        Object.entries(uploadedFiles).forEach(([fieldId, file]) => {
          formDataPayload.append(fieldId, file);
        });

        res = await fetch(getApiUrl(apiPath), {
          method: 'POST',
          body: formDataPayload,
          credentials: 'include'
        });
      } else {
        // Send as JSON
        res = await fetch(getApiUrl(apiPath), {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            responses: responses,
            team: teamInput
          }),
          credentials: 'include'
        });
      }

      const data = await res.json();
      if (!res.ok) {
        if (res.status === 401) {
          throw new Error('You must be logged in to register for events.');
        }
        throw new Error(data.detail || 'Registration failed');
      }

      setSubmitMessage({ type: 'success', text: 'Registration successful! See you at the event.' });
      setTimeout(() => {
        setSelectedEvent(null);
      }, 2500);
    } catch (err: any) {
      setSubmitMessage({ type: 'error', text: err.message || 'Server error. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Helper for tab lists - using only real database events, no mock fallbacks
  const displayEvents = events;

  // Filter and search logic
  const filteredEvents = displayEvents.filter(ev => {
    if (!isHomepage && searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase();
      const matchesSearch = ev.title.toLowerCase().includes(q) ||
                            ev.description.toLowerCase().includes(q) ||
                            ev.category.toLowerCase().includes(q) ||
                            ev.venue.toLowerCase().includes(q);
      if (!matchesSearch) return false;
    }
    
    if (isHomepage) {
      return ev.status === 'registration_open' || ev.status === 'upcoming';
    }

    if (activeTab === 'upcoming') {
      return ev.status === 'registration_open' || ev.status === 'upcoming';
    } else if (activeTab === 'past') {
      return true;
    } else if (activeTab === 'workshops') {
      return (ev.category || '').toLowerCase().includes('workshop');
    }
    return true;
  });

  const allPastCards: any[] = [
    ...pastEvents.map(p => ({
      id: `past-${p.id}`,
      title: p.title,
      category: p.category || 'Workshop',
      description: p.description,
      banner: p.image_url,
      event_date: p.date_label,
      speaker: p.speaker,
      winners: p.winners,
      winner_link: p.winner_link,
      isArchived: true
    })),
    ...events.filter(ev => ev.status === 'completed' || ev.status === 'registration_closed').map(ev => ({
      ...ev,
      isArchived: false
    }))
  ];

  const displayedUpcomingEvents = isHomepage ? filteredEvents.slice(0, 2) : (activeTab === 'past' ? allPastCards : filteredEvents);



  // ── Homepage: calendar list style ──────────────────────────────
  if (isHomepage) {
    return (
      <section
        id="events"
        style={{
          background: 'hsl(228, 28%, 91%)',
          borderTop: '1px solid hsl(228, 20%, 80%)',
        }}
      >
        <div style={{ maxWidth: 1280, margin: '0 auto', padding: '5rem 2rem' }}>
          {/* Title */}
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
            Calendar
          </h2>
          <p
            style={{
              fontFamily: 'Inter, sans-serif',
              fontSize: '1rem',
              color: 'hsl(230, 15%, 45%)',
              marginBottom: '2.5rem',
            }}
          >
            Sessions are open to every DA-IICT student. Walk in; nothing is ticketed.
          </p>

          {/* Event list */}
          <div>
            {loadingEvents ? (
              <p style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.8rem', color: 'hsl(230, 15%, 50%)' }}>Loading events...</p>
            ) : displayedUpcomingEvents.length === 0 ? (
              <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.9rem', color: 'hsl(230, 15%, 50%)', padding: '2rem 0', borderTop: '1px solid hsl(228, 20%, 80%)' }}>
                No upcoming events at the moment. Check back soon.
              </p>
            ) : (
              displayedUpcomingEvents.map((ev) => {
                const hasDate = Boolean(ev.event_start_date || ev.event_date);
                const dateObj = hasDate ? new Date((ev.event_start_date || ev.event_date)!) : null;
                const day = dateObj ? dateObj.toLocaleDateString('en-US', { weekday: 'short' }).toUpperCase() : 'TBA';
                const month = dateObj ? dateObj.toLocaleDateString('en-US', { month: 'short' }) : '';
                const date = dateObj ? dateObj.getDate() : '';
                
                const metaParts = [];
                if (ev.venue) metaParts.push(ev.venue);
                if (ev.start_time) metaParts.push(ev.start_time);
                if (ev.event_type) metaParts.push(ev.event_type);
                return (
                  <div
                    key={ev.id}
                    style={{
                      display: 'flex',
                      gap: '2rem',
                      padding: '1.5rem',
                      borderRadius: '16px',
                      background: 'white',
                      border: '1px solid hsl(228, 20%, 84%)',
                      alignItems: 'flex-start',
                      marginBottom: '1rem',
                      transition: 'all 0.25s cubic-bezier(0.34, 1.56, 0.64, 1)',
                      cursor: 'pointer',
                    }}
                    onMouseEnter={e => {
                      (e.currentTarget as HTMLElement).style.transform = 'translateY(-4px) scale(1.01)';
                      (e.currentTarget as HTMLElement).style.boxShadow = '0 12px 24px -6px rgba(99, 102, 241, 0.18)';
                      (e.currentTarget as HTMLElement).style.borderColor = 'hsl(243, 75%, 59%)';
                    }}
                    onMouseLeave={e => {
                      (e.currentTarget as HTMLElement).style.transform = 'translateY(0) scale(1)';
                      (e.currentTarget as HTMLElement).style.boxShadow = 'none';
                      (e.currentTarget as HTMLElement).style.borderColor = 'hsl(228, 20%, 84%)';
                    }}
                  >
                    {/* Date column */}
                    <div style={{ minWidth: 70, flexShrink: 0 }}>
                      <p
                        style={{
                          fontFamily: 'JetBrains Mono, monospace',
                          fontSize: '0.65rem',
                          letterSpacing: '0.1em',
                          color: 'hsl(230, 15%, 50%)',
                          marginBottom: 2,
                          textTransform: 'uppercase',
                        }}
                      >
                        {day}
                      </p>
                      <p
                        style={{
                          fontFamily: 'Playfair Display, Georgia, serif',
                          fontSize: '1.15rem',
                          fontWeight: 700,
                          color: 'hsl(243, 75%, 59%)',
                          lineHeight: 1.1,
                        }}
                      >
                        {month ? `${month} ${date}` : 'TBA'}
                      </p>
                    </div>

                    {/* Content */}
                    <div style={{ flex: 1 }}>
                      <h3
                        style={{
                          fontFamily: 'Playfair Display, Georgia, serif',
                          fontSize: '1.1rem',
                          fontWeight: 700,
                          color: 'hsl(230, 25%, 12%)',
                          marginBottom: '0.35rem',
                          letterSpacing: '-0.01em',
                        }}
                      >
                        {ev.title}
                      </h3>
                      <p
                        style={{
                          fontFamily: 'Inter, sans-serif',
                          fontSize: '0.88rem',
                          color: 'hsl(230, 15%, 40%)',
                          lineHeight: 1.6,
                          marginBottom: '0.75rem',
                          maxWidth: 600,
                        }}
                      >
                        {ev.description}
                      </p>
                      <p
                        style={{
                          fontFamily: 'JetBrains Mono, monospace',
                          fontSize: '0.75rem',
                          color: 'hsl(230, 15%, 48%)',
                        }}
                      >
                        {metaParts.join(' · ')}
                        {ev.status === 'registration_open' && (
                          <span style={{ color: 'hsl(243, 75%, 59%)', marginLeft: metaParts.length > 0 ? 8 : 0 }}>· Open for registration</span>
                        )}
                      </p>

                      {/* Register button + View Details */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 10, flexWrap: 'wrap' }}>
                        {ev.status === 'registration_open' && (
                          registeredEventIds.includes(ev.id) ? (
                            <span style={{ display: 'inline-block', fontFamily: 'JetBrains Mono, monospace', fontSize: '0.72rem', color: 'hsl(243,75%,59%)', padding: '4px 12px', border: '1px solid hsl(243,75%,80%)', borderRadius: 2 }}>
                              Registered ✓
                            </span>
                          ) : ev.registration_link ? (
                            <a
                              href={ev.registration_link}
                              target="_blank"
                              rel="noopener noreferrer"
                              style={{ display: 'inline-block', fontFamily: 'JetBrains Mono, monospace', fontSize: '0.72rem', color: 'hsl(228,30%,93%)', background: 'hsl(230,25%,12%)', padding: '5px 14px', borderRadius: 2, textDecoration: 'none', border: '1px solid hsl(230,25%,12%)' }}
                            >
                              Register now
                            </a>
                          ) : (
                            <button
                              onClick={() => setSelectedEvent(ev)}
                              style={{ display: 'inline-block', fontFamily: 'JetBrains Mono, monospace', fontSize: '0.72rem', color: 'hsl(228,30%,93%)', background: 'hsl(230,25%,12%)', padding: '5px 14px', borderRadius: 2, border: '1px solid hsl(230,25%,12%)', cursor: 'pointer' }}
                            >
                              Register now
                            </button>
                          )
                        )}
                        <Link
                          to={`/events/${ev.id}`}
                          style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontFamily: 'JetBrains Mono, monospace', fontSize: '0.72rem', color: 'hsl(243,75%,59%)', textDecoration: 'none', padding: '4px 10px', border: '1px solid hsl(243,75%,75%)', borderRadius: 2 }}
                          onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = 'hsl(243,75%,97%)'}
                          onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = 'transparent'}
                        >
                          <ArrowRight size={11} /> View Details
                        </Link>
                      </div>
                    </div>
                  </div>
                );
              })
            )}

            {/* Footnote */}
            <p
              style={{
                fontFamily: 'JetBrains Mono, monospace',
                fontSize: '0.72rem',
                color: 'hsl(230, 15%, 55%)',
                marginTop: '1.5rem',
                borderTop: '1px solid hsl(228, 20%, 80%)',
                paddingTop: '1rem',
              }}
            >
              Dates shift occasionally around institute schedules — check the Discord for updates.
            </p>
          </div>

          {/* Past Events Highlights (2 Past Events on Homepage) */}
          {pastEvents.length > 0 && (
            <div style={{ marginTop: '3rem', paddingTop: '2.5rem', borderTop: '1px solid hsl(228, 20%, 80%)' }}>
              <h3
                style={{
                  fontFamily: 'Playfair Display, Georgia, serif',
                  fontSize: '1.5rem',
                  fontWeight: 700,
                  color: 'hsl(230, 25%, 10%)',
                  marginBottom: '1.25rem',
                }}
              >
                Past Events & Workshops
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {pastEvents.slice(0, 2).map((pe) => (
                  <div
                    key={pe.id}
                    onClick={() => setSelectedEvent(pe as any)}
                    className="glass-card relative overflow-hidden p-6 flex flex-col justify-between cursor-pointer group bg-white border border-slate-200 rounded-2xl hover:border-indigo-400 hover:shadow-xl transition-all"
                  >
                    <div>
                      {pe.image_url && (
                        <div className="w-full h-44 mb-4 rounded-xl overflow-hidden bg-secondary">
                          <img src={pe.image_url} alt={pe.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                        </div>
                      )}
                      <span className="font-mono text-[10px] tracking-widest uppercase px-3 py-1 rounded bg-primary/10 text-primary border border-primary/20">{pe.category || 'Workshop'}</span>
                      <h4 className="font-display font-bold text-lg text-foreground mt-3 mb-1">{pe.title}</h4>
                      {pe.date_label && <p className="text-xs font-semibold text-primary mb-2">{pe.date_label}</p>}
                      <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3">{pe.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* View all CTA */}
          <div style={{ marginTop: '2.5rem' }}>
            <Link
              to="/events"
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 6,
                fontFamily: 'JetBrains Mono, monospace', fontSize: '0.8rem',
                color: 'hsl(243, 75%, 59%)', textDecoration: 'none', letterSpacing: '0.02em',
              }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.textDecoration = 'underline'; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.textDecoration = 'none'; }}
            >
              View all events {'&'} archive <ArrowRight size={13} />
            </Link>
          </div>
        </div>
      </section>
    );
  }

  // ── Full page: original detailed view ────────────────────────────
  return (
    <section id="events" style={{ background: 'hsl(228, 30%, 93%)', minHeight: '80vh' }}>
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '4rem 2rem' }}>
        <h1
          style={{
            fontFamily: 'Playfair Display, Georgia, serif',
            fontSize: 'clamp(2rem, 4vw, 3.5rem)',
            fontWeight: 700, letterSpacing: '-0.025em',
            color: 'hsl(230, 25%, 10%)', marginBottom: '2rem',
          }}
        >
          Events {'&'} Workshops
        </h1>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4 }}
        >

        {/* Highlight banner */}
        {featured && (
          <motion.div
            className="rounded-2xl p-8 mb-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6"
            style={{ background: 'linear-gradient(135deg, hsl(217 91% 60% / 0.1), hsl(160 90% 43% / 0.05))', border: '1px solid hsl(217 91% 60% / 0.25)' }}
            initial={{ opacity: 0, scale: 0.97 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.15 }}
          >
            <div>
              <span className="text-xs font-mono text-primary tracking-widest uppercase">Next Up</span>
              <h3 className="font-display font-bold text-xl text-foreground mt-2">{featured.title}</h3>
              <p className="text-sm text-muted-foreground mt-2 max-w-md">{featured.description}</p>
              {featured.status === 'registration_open' && (
                registeredEventIds.includes(featured.id) ? (
                  <button disabled className="mt-4 px-4 py-2 text-xs font-semibold rounded-lg bg-primary/20 text-primary border border-primary/20 cursor-not-allowed">
                    Already Registered
                  </button>
                ) : featured.registration_link ? (
                  <a
                    href={featured.registration_link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-4 px-4 py-2 text-xs font-semibold rounded-lg bg-primary text-primary-foreground hover:bg-primary/95 hover:scale-105 transition-all duration-300 inline-flex items-center gap-2"
                  >
                    Register Now
                  </a>
                ) : (
                  <button
                    onClick={() => setSelectedEvent(featured)}
                    className="mt-4 px-4 py-2 text-xs font-semibold rounded-lg bg-primary text-primary-foreground hover:bg-primary/95 hover:scale-105 transition-all duration-300"
                  >
                    Register Now
                  </button>
                )
              )}
            </div>
            <div className="flex gap-5">
              {Object.entries(timeLeft).map(([unit, value]) => (
                <div key={unit} className="text-center">
                  <motion.span
                    key={value}
                    initial={{ y: -8, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    className="font-mono text-3xl font-bold text-primary block"
                  >
                    {value}
                  </motion.span>
                  <span className="text-[10px] text-muted-foreground tracking-widest uppercase mt-1 block">
                    {unit === 'd' ? 'Days' : unit === 'h' ? 'Hours' : unit === 'm' ? 'Mins' : 'Secs'}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Filters for Live Events on Dedicated Page */}
        {!isHomepage && activeTab === 'upcoming' && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', marginBottom: '2rem', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.8rem', color: 'hsl(230,15%,45%)', fontWeight: 500 }}>Status:</span>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                style={{ padding: '6px 12px', borderRadius: '6px', border: '1px solid hsl(228,20%,80%)', fontSize: '0.8rem', fontFamily: 'Inter, sans-serif', outline: 'none' }}
              >
                <option value="">All</option>
                <option value="active">Active</option>
                <option value="upcoming">Upcoming</option>
                <option value="completed">Completed</option>
              </select>
            </div>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
              <span style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.8rem', color: 'hsl(230,15%,45%)', fontWeight: 500 }}>Category:</span>
              {['', 'Hackathon', 'Workshop', 'Seminar'].map(cat => (
                <button
                  key={cat}
                  onClick={() => setCategoryFilter(cat)}
                  style={{
                    padding: '4px 12px',
                    borderRadius: '99px',
                    fontSize: '0.75rem',
                    fontFamily: 'Inter, sans-serif',
                    fontWeight: 500,
                    cursor: 'pointer',
                    background: categoryFilter === cat ? 'hsl(243,75%,59%)' : 'white',
                    color: categoryFilter === cat ? 'white' : 'hsl(230,15%,45%)',
                    border: `1px solid ${categoryFilter === cat ? 'hsl(243,75%,59%)' : 'hsl(228,20%,80%)'}`
                  }}
                >
                  {cat === '' ? 'All' : cat}
                </button>
              ))}
            </div>
            
            <div style={{ flex: 1, minWidth: '200px', display: 'flex', justifyContent: 'flex-end' }}>
              <div style={{ position: 'relative', width: '100%', maxWidth: '300px' }}>
                <Search size={14} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: 'hsl(230,15%,60%)' }} />
                <input
                  type="text"
                  placeholder="Search events..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={{ width: '100%', padding: '6px 30px', borderRadius: '6px', border: '1px solid hsl(228,20%,80%)', fontSize: '0.8rem', fontFamily: 'Inter, sans-serif', outline: 'none' }}
                />
              </div>
            </div>
          </div>
        )}

        {/* Tabs - Only displayed on dedicated page */}
        {!isHomepage && (
          <div className="flex gap-1 border-b border-border mb-10 flex-wrap">
            {['upcoming', 'past', 'workshops'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`relative px-5 py-2.5 text-sm font-medium -mb-px transition-colors ${activeTab === tab ? 'text-foreground' : 'text-muted-foreground hover:text-foreground'
                  }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
                {activeTab === tab && (
                  <motion.div
                    layoutId="event-tab-indicator"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"
                    transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                  />
                )}
              </button>
            ))}
          </div>
        )}

        {/* Cards list */}
        {loadingEvents ? (
          <div className="flex justify-center py-12"><Loader2 className="animate-spin text-primary" size={32} /></div>
        ) : displayedUpcomingEvents.length === 0 ? (
          <p className="text-muted-foreground text-center py-12">No events found in this category.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <AnimatePresence mode="popLayout">
              {displayedUpcomingEvents.map((card, i) => (
                <motion.div
                  key={card.id || card.title}
                  layout
                  initial={{ opacity: 0, y: 20, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1, transition: { delay: i * 0.08, duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] } }}
                  exit={{ opacity: 0, y: -10, scale: 0.95, transition: { duration: 0.2 } }}
                  whileHover={{ y: -6, transition: { duration: 0.25 } }}
                  onClick={() => setSelectedEvent(card)}
                  className="glass-card relative overflow-hidden p-7 flex flex-col justify-between cursor-pointer hover:border-primary/50 transition-colors"
                >
                  <div>
                    {(card.banner || card.image_url) && (
                      <div className="w-full h-44 mb-4 rounded-xl overflow-hidden bg-secondary border border-border/50">
                        <img src={card.banner || card.image_url} alt={card.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      </div>
                    )}
                    <span className="font-mono text-[10px] tracking-widest uppercase px-3 py-1 rounded bg-primary/10 text-primary border border-primary/20">{card.category}</span>
                    <h4 className="font-display font-bold text-lg text-foreground mt-4 mb-2">{card.title}</h4>
                    <p className="text-sm text-muted-foreground leading-relaxed">{card.description}</p>
                    {card.winners && (
                      <div className="mt-6 p-6 md:p-8 rounded-2xl bg-gradient-to-br from-yellow-500/10 via-amber-500/5 to-transparent border-2 border-yellow-500/30 flex flex-col gap-4 shadow-[0_0_30px_rgba(234,179,8,0.2)] backdrop-blur-md relative overflow-hidden group">
                        {/* Animated Shimmer */}
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-yellow-500/10 to-transparent -translate-x-full animate-[shimmer_3s_infinite]" />
                        
                        <span className="font-bold text-yellow-500 flex items-center gap-3 uppercase font-mono tracking-widest text-lg md:text-xl relative z-10 drop-shadow-[0_0_8px_rgba(234,179,8,0.5)]">
                          <span className="text-3xl animate-bounce">🏆</span> Winners Declared
                        </span>
                        
                        <div className="whitespace-pre-line text-foreground text-base md:text-lg leading-relaxed font-sans pl-4 border-l-4 border-yellow-500/50 relative z-10 font-semibold bg-yellow-500/5 p-4 rounded-r-xl shadow-[inset_0_0_20px_rgba(234,179,8,0.05)]">
                          {card.winners}
                        </div>
                        
                        {card.winner_link && (
                          <a
                            href={card.winner_link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="mt-4 inline-flex w-fit bg-yellow-500/10 hover:bg-yellow-500/20 text-yellow-500 border border-yellow-500/50 px-6 py-3 rounded-xl transition-all duration-300 items-center gap-3 text-sm md:text-base font-mono tracking-wider uppercase font-bold relative z-10 hover:shadow-[0_0_20px_rgba(234,179,8,0.4)] hover:-translate-y-1"
                          >
                            <ExternalLink size={18} /> View Winner Details / PDF
                          </a>
                        )}
                      </div>
                    )}
                  </div>
                  <div>
                    <div className="flex flex-wrap items-center gap-3 mt-5 pt-4 border-t border-border text-xs text-muted-foreground">
                      {(card.event_start_date || card.event_date) && (
                        <>
                          <span className="flex items-center gap-1.5">
                            {card.event_start_date && card.event_end_date && card.event_start_date !== card.event_end_date
                              ? `${card.event_start_date} to ${card.event_end_date}`
                              : card.event_start_date || card.event_date}
                          </span>
                          <span className="w-1 h-1 bg-muted-foreground rounded-full" />
                        </>
                      )}
                      {card.venue && (
                        <>
                          <span className="flex items-center gap-1.5">{card.venue}</span>
                          <span className="w-1 h-1 bg-muted-foreground rounded-full" />
                        </>
                      )}
                      <span className="flex items-center gap-1.5 capitalize">{card.event_type} Event</span>
                    </div>

                    {card.status === 'registration_open' && (
                      registeredEventIds.includes(card.id) ? (
                        <button disabled className="mt-5 w-full py-2 text-xs font-semibold rounded-lg bg-primary/10 border border-primary/20 text-primary/50 cursor-not-allowed flex items-center justify-center gap-1.5">
                          Already Registered
                        </button>
                      ) : card.registration_link ? (
                        <a
                          href={card.registration_link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="mt-5 w-full py-2 text-xs font-semibold rounded-lg bg-primary/10 border border-primary/20 text-primary hover:bg-primary hover:text-primary-foreground transition-all duration-300 flex items-center justify-center gap-1.5"
                        >
                          Register Now
                        </a>
                      ) : (
                        <button
                          onClick={() => setSelectedEvent(card)}
                          className="mt-5 w-full py-2 text-xs font-semibold rounded-lg bg-primary/10 border border-primary/20 text-primary hover:bg-primary hover:text-primary-foreground transition-all duration-300 flex items-center justify-center gap-1.5"
                        >
                          Register Now
                        </button>
                      )
                    )}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}

        {/* placeholder - homepage handled above */}
      </motion.div>
      {/* Registration Modal Overlay */}
      <AnimatePresence>
        {selectedEvent && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedEvent(null)}
              className="fixed inset-0 bg-background/80 backdrop-blur-md"
            />

            {/* Form Container */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ type: 'spring', duration: 0.5 }}
              className="relative w-full max-w-lg rounded-2xl bg-card border border-border p-6 shadow-2xl overflow-y-auto max-h-[90vh] z-10"
              style={{ background: 'linear-gradient(135deg, hsl(217 91% 60% / 0.05), hsl(217 91% 60% / 0.02))' }}
            >
              {/* Close Button */}
              <button
                onClick={() => setSelectedEvent(null)}
                className="absolute top-4 right-4 p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors z-20"
              >
                <X size={16} />
              </button>

              {(selectedEvent.banner || (selectedEvent as any).image_url) && (
                <div className="w-full max-h-64 mb-4 rounded-xl overflow-hidden bg-secondary border border-border/50">
                  <img
                    src={selectedEvent.banner || (selectedEvent as any).image_url}
                    alt={selectedEvent.title}
                    className="w-full h-full object-cover max-h-64"
                  />
                </div>
              )}

              <h3 className="font-display font-extrabold text-foreground text-xl mb-1">{selectedEvent.title}</h3>
              <p className="text-xs text-muted-foreground mb-4">Event Details & Registration</p>

              {submitMessage && (
                <div
                  className={`p-3 rounded-lg text-xs font-medium mb-4 ${
                    submitMessage.type === 'success' ? 'bg-accent/10 border border-accent/20 text-accent' : 'bg-destructive/10 border border-destructive/20 text-destructive'
                  }`}
                >
                  {submitMessage.text}
                </div>
              )}

              {loadingSchema ? (
                <div className="flex flex-col items-center justify-center py-12 gap-3">
                  <Loader2 className="animate-spin text-primary" size={24} />
                  <span className="text-xs text-muted-foreground">Loading registration fields...</span>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  
                  {/* DYNAMIC FORM FIELDS */}
                  {formFields.map((field) => {
                    const isRequired = field.required;
                    return (
                      <div key={field.id}>
                        <label className="block text-xs font-mono tracking-wider text-muted-foreground uppercase mb-1">
                          {field.label} {isRequired && <span className="text-destructive">*</span>}
                        </label>

                        {/* File Upload Field */}
                        {field.field_type === 'file' ? (
                          <div className="relative">
                            <label className="flex items-center justify-center gap-2 w-full bg-secondary border border-border border-dashed rounded-lg px-3 py-3 text-sm text-muted-foreground cursor-pointer hover:border-primary hover:text-foreground transition-colors">
                              <Upload size={16} />
                              <span>{uploadedFiles[field.id] ? uploadedFiles[field.id].name : field.placeholder || 'Choose File'}</span>
                              <input
                                type="file"
                                required={isRequired && !uploadedFiles[field.id]}
                                onChange={(e) => {
                                  if (e.target.files && e.target.files[0]) {
                                    handleFileChange(field.id, e.target.files[0]);
                                  }
                                }}
                                className="hidden"
                              />
                            </label>
                          </div>
                        ) : field.field_type === 'dropdown' ? (
                          <select
                            required={isRequired}
                            value={responses[field.id] || ''}
                            onChange={(e) => handleInputChange(field.id, e.target.value)}
                            className="w-full bg-secondary border border-border rounded-lg px-3 py-2 text-sm text-foreground outline-none focus:border-primary transition-colors appearance-none"
                          >
                            <option value="" disabled>{field.placeholder || 'Select option...'}</option>
                            {field.options_json && JSON.parse(field.options_json).map((opt: string) => (
                              <option key={opt} value={opt}>{opt}</option>
                            ))}
                          </select>
                        ) : field.field_type === 'checkbox' ? (
                          <div className="space-y-2 mt-1">
                            {field.options_json && JSON.parse(field.options_json).map((opt: string) => (
                              <label key={opt} className="flex items-center gap-2 text-sm text-foreground cursor-pointer">
                                <input
                                  type="checkbox"
                                  checked={(responses[field.id] || []).includes(opt)}
                                  onChange={(e) => handleCheckboxChange(field.id, opt, e.target.checked)}
                                  className="rounded bg-secondary border border-border outline-none focus:ring-primary text-primary w-4 h-4"
                                />
                                <span>{opt}</span>
                              </label>
                            ))}
                          </div>
                        ) : field.field_type === 'radio' ? (
                          <div className="space-y-2 mt-1">
                            {field.options_json && JSON.parse(field.options_json).map((opt: string) => (
                              <label key={opt} className="flex items-center gap-2 text-sm text-foreground cursor-pointer">
                                <input
                                  type="radio"
                                  name={`radio-${field.id}`}
                                  checked={responses[field.id] === opt}
                                  onChange={() => handleInputChange(field.id, opt)}
                                  className="bg-secondary border border-border outline-none focus:ring-primary text-primary w-4 h-4"
                                />
                                <span>{opt}</span>
                              </label>
                            ))}
                          </div>
                        ) : field.field_type === 'textarea' ? (
                          <textarea
                            required={isRequired}
                            placeholder={field.placeholder || ''}
                            value={responses[field.id] || ''}
                            onChange={(e) => handleInputChange(field.id, e.target.value)}
                            rows={3}
                            className="w-full bg-secondary border border-border rounded-lg px-3 py-2 text-sm text-foreground outline-none focus:border-primary transition-colors resize-none"
                          />
                        ) : (
                          // Standard input types (text, email, phone, number, date)
                          <input
                            type={field.field_type === 'phone' ? 'tel' : field.field_type}
                            required={isRequired}
                            placeholder={field.placeholder || ''}
                            value={responses[field.id] || ''}
                            onChange={(e) => handleInputChange(field.id, e.target.value)}
                            className="w-full bg-secondary border border-border rounded-lg px-3 py-2 text-sm text-foreground outline-none focus:border-primary transition-colors"
                          />
                        )}
                      </div>
                    );
                  })}

                  {/* TEAM REGISTRATION SECTION */}
                  {selectedEvent.event_type === 'team' && (
                    <div className="mt-6 pt-4 border-t border-border space-y-4">
                      <h4 className="flex items-center gap-2 font-display font-bold text-sm text-foreground">
                        <Users size={16} className="text-primary" />
                        Team Details
                      </h4>
                      <div>
                        <label className="block text-xs font-mono tracking-wider text-muted-foreground uppercase mb-1">
                          Team Name <span className="text-destructive">*</span>
                        </label>
                        <input
                          type="text"
                          required
                          value={teamName}
                          onChange={(e) => setTeamName(e.target.value)}
                          placeholder="Enter unique team name"
                          className="w-full bg-secondary border border-border rounded-lg px-3 py-2 text-sm text-foreground outline-none focus:border-primary transition-colors"
                        />
                      </div>

                      {/* Team Members List */}
                      <div className="space-y-3">
                        <label className="block text-xs font-mono tracking-wider text-muted-foreground uppercase">
                          Additional Team Members ({teamMembers.length + 1} / {selectedEvent.max_team_size || 4})
                        </label>
                        {teamMembers.map((member, idx) => (
                          <div key={idx} className="flex gap-2 items-center bg-secondary/30 p-3 rounded-lg border border-border/50 relative">
                            <div className="grid grid-cols-2 gap-2 w-full pr-6">
                              <input
                                type="text"
                                required
                                value={member.name}
                                onChange={(e) => {
                                  const updated = [...teamMembers];
                                  updated[idx].name = e.target.value;
                                  setTeamMembers(updated);
                                }}
                                placeholder="Member Name"
                                className="bg-secondary border border-border rounded-md px-2 py-1.5 text-xs text-foreground outline-none focus:border-primary"
                              />
                              <input
                                type="email"
                                required
                                value={member.email}
                                onChange={(e) => {
                                  const updated = [...teamMembers];
                                  updated[idx].email = e.target.value;
                                  setTeamMembers(updated);
                                }}
                                placeholder="Member Email"
                                className="bg-secondary border border-border rounded-md px-2 py-1.5 text-xs text-foreground outline-none focus:border-primary"
                              />
                            </div>
                            {teamMembers.length > 1 && (
                              <button
                                type="button"
                                onClick={() => removeTeamMember(idx)}
                                className="absolute right-2 p-1 text-muted-foreground hover:text-destructive transition-colors"
                              >
                                <X size={12} />
                              </button>
                            )}
                          </div>
                        ))}
                        {teamMembers.length + 1 < (selectedEvent.max_team_size || 4) && (
                          <button
                            type="button"
                            onClick={addTeamMember}
                            className="text-xs text-primary hover:underline font-semibold flex items-center gap-1 mt-1"
                          >
                            + Add Team Member
                          </button>
                        )}
                      </div>
                    </div>
                  )}

                  <div className="pt-4 border-t border-border/50">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full py-2.5 text-xs font-bold rounded-lg bg-primary text-primary-foreground hover:bg-primary/95 transition-all duration-300 disabled:opacity-50 flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(37,99,235,0.2)]"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 size={14} className="animate-spin" />
                          Submitting Registration...
                        </>
                      ) : (
                        <>
                          Register for Event
                          <ArrowRight size={14} />
                        </>
                      )}
                    </button>
                  </div>
                </form>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      </div>
    </section>
  );
}
