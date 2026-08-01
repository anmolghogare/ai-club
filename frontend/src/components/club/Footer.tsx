import { motion } from 'framer-motion';
import { Mail, ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import aiClubLogo from '@/assets/ai-club-logo.jpeg';

/* ─── Social icons ─────────────────────────────────────────────── */
const DiscordIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
    <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/>
  </svg>
);
const InstagramIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z"/>
  </svg>
);
const GitHubIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.438 9.8 8.205 11.387.6.113.82-.263.82-.582 0-.288-.012-1.243-.017-2.252-3.338.726-4.042-1.61-4.042-1.61-.546-1.385-1.333-1.754-1.333-1.754-1.09-.745.083-.73.083-.73 1.204.085 1.838 1.237 1.838 1.237 1.07 1.834 2.807 1.304 3.492.997.108-.776.42-1.305.762-1.605-2.665-.303-5.467-1.332-5.467-5.93 0-1.31.468-2.382 1.236-3.222-.124-.304-.536-1.524.117-3.176 0 0 1.008-.322 3.3 1.23a11.5 11.5 0 0 1 3.003-.404c1.02.005 2.047.138 3.003.404 2.29-1.552 3.297-1.23 3.297-1.23.655 1.652.243 2.872.12 3.176.77.84 1.235 1.912 1.235 3.222 0 4.61-2.807 5.624-5.48 5.921.43.372.814 1.103.814 2.222 0 1.606-.015 2.898-.015 3.293 0 .322.216.699.825.58C20.565 21.796 24 17.298 24 12c0-6.63-5.37-12-12-12z" />
  </svg>
);
const LinkedInIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
    <path d="M20.447 20.452H16.89v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a1.984 1.984 0 1 1 0-3.967 1.984 1.984 0 0 1 0 3.967zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
  </svg>
);

const YouTubeIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
  </svg>
);

const socials = [
  { Icon: InstagramIcon, href: 'https://www.instagram.com/aiclub_daiict?igsh=eTgxajEwZHBjMzNo', label: 'Instagram', hoverColor: 'hover:text-[#E1306C] hover:border-[#E1306C]/40 hover:bg-[#E1306C]/8' },
  { Icon: LinkedInIcon,  href: 'https://www.linkedin.com/company/ai-club-daiict/',              label: 'LinkedIn',  hoverColor: 'hover:text-[#0A66C2] hover:border-[#0A66C2]/40 hover:bg-[#0A66C2]/8' },
  { Icon: YouTubeIcon,   href: 'https://www.youtube.com/@AIClubDAU',                            label: 'YouTube',   hoverColor: 'hover:text-[#FF0000] hover:border-[#FF0000]/40 hover:bg-[#FF0000]/8' },
  { Icon: DiscordIcon,   href: 'https://discord.gg/bU7JdWa6',                                   label: 'Discord',   hoverColor: 'hover:text-[#5865F2] hover:border-[#5865F2]/40 hover:bg-[#5865F2]/8' },
  { Icon: GitHubIcon,    href: 'https://github.com/ai-club-daiict',                             label: 'GitHub',    hoverColor: 'hover:text-foreground hover:border-foreground/40 hover:bg-foreground/5' },
];

const navLinks = [
  { label: 'Events',     href: '/#events' },
  { label: 'Projects',   href: '/projects' },
  { label: 'Team',       href: '/team' },
  { label: 'Resources',  href: '/#resources' },
  { label: 'Roadmaps',   href: '/#roadmap' },
  { label: 'Blog',       href: '/#blog' },
];

export default function Footer() {
  return (
    <motion.footer
      className="relative z-[1] border-t border-border mt-4"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.7 }}
    >
      {/* Top gradient line */}
      <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-primary/40 to-transparent" />

      <div className="max-w-[1200px] mx-auto px-6 md:px-12 py-14">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-12">

          {/* Brand column */}
          <div className="md:col-span-1">
            <Link to="/" className="inline-flex items-center gap-2.5 mb-4">
              <img src={aiClubLogo} alt="AI Club DAU Logo" className="w-9 h-9 rounded-lg object-contain" />
              <span className="font-display font-extrabold text-xl text-foreground">
                AI Club <span className="text-primary">DAU</span>
              </span>
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed max-w-[260px] mb-6">
              Dhirubhai Ambani University's premier Artificial Intelligence club — building, learning, and shipping AI together.
            </p>
            <a
              href="mailto:aiclub@dau.ac.in"
              className="inline-flex items-center gap-2 text-xs text-muted-foreground hover:text-primary transition-colors group"
            >
              <Mail size={13} className="group-hover:scale-110 transition-transform" />
              aiclub@dau.ac.in
            </a>
          </div>

          {/* Quick links */}
          <div>
            <p className="text-[10px] font-mono tracking-[3px] uppercase text-muted-foreground/60 mb-5">Navigate</p>
            <ul className="space-y-3">
              {navLinks.map((l) => (
                <li key={l.label}>
                  <a
                    href={l.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors inline-flex items-center gap-1.5 group"
                  >
                    <span className="w-3 h-px bg-border group-hover:w-5 group-hover:bg-primary transition-all duration-300" />
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Community column */}
          <div>
            <p className="text-[10px] font-mono tracking-[3px] uppercase text-muted-foreground/60 mb-5">Community</p>
            <div className="grid grid-cols-2 gap-3 mb-6">
              {socials.map(({ Icon, href, label, hoverColor }, i) => (
                <motion.a
                  key={i}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl border border-border text-muted-foreground text-xs font-medium transition-all ${hoverColor}`}
                  whileHover={{ scale: 1.03, y: -2 }}
                  whileTap={{ scale: 0.97 }}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08, duration: 0.3 }}
                >
                  <Icon />
                  {label}
                </motion.a>
              ))}
            </div>

            {/* Blog link */}
            <a
              href="https://medium.com/@jashshah780"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs text-primary hover:text-primary/80 transition-colors group"
            >
              Read our blog on Medium
              <ArrowUpRight size={12} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </a>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-6 border-t border-border/50 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-muted-foreground/60">
            © 2026 AI Club DAU · Dhirubhai Ambani University, Gandhinagar
          </p>
          <p className="text-xs text-muted-foreground/40 font-mono">
            Built with ❤️ by the core team
          </p>
        </div>
      </div>
    </motion.footer>
  );
}
