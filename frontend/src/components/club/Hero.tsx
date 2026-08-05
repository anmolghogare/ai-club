import { Link } from 'react-router-dom';

const stats = [
  { label: 'FOUNDED', value: '2023' },
  { label: 'MEMBERS', value: '180+' },
  { label: 'MEETS', value: 'Wed · 7pm · LT-1' },
  { label: 'COST', value: 'Free' },
];

const inputChips = ['what', 'is', 'the', 'AI', 'Club', '?'];

export default function Hero() {
  return (
    <section
      id="hero"
      style={{
        paddingTop: '56px', // navbar height
        background: 'hsl(228, 30%, 93%)',
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Main hero content */}
      <div
        style={{
          maxWidth: 1280,
          margin: '0 auto',
          width: '100%',
          padding: '5rem 2rem 3rem',
          flex: 1,
        }}
      >
        {/* Institute label */}
        <p
          style={{
            fontFamily: 'JetBrains Mono, Courier New, monospace',
            fontSize: '0.68rem',
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            color: 'hsl(230, 15%, 50%)',
            marginBottom: '2.5rem',
          }}
        >
          Dhirubhai Ambani University · Gandhinagar
        </p>

        {/* INPUT chips row */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            marginBottom: '2rem',
            flexWrap: 'wrap',
          }}
        >
          <span
            style={{
              fontFamily: 'JetBrains Mono, monospace',
              fontSize: '0.7rem',
              color: 'hsl(230, 15%, 50%)',
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              marginRight: '6px',
            }}
          >
            INPUT
          </span>
          {inputChips.map((chip) => (
            <span
              key={chip}
              style={{
                fontFamily: 'JetBrains Mono, monospace',
                fontSize: '0.78rem',
                padding: '3px 10px',
                border: '1px solid hsl(228, 20%, 72%)',
                borderRadius: '2px',
                background: 'hsl(228, 30%, 93%)',
                color: 'hsl(230, 25%, 20%)',
              }}
            >
              {chip}
            </span>
          ))}
        </div>

        {/* Vertical left border + content */}
        <div
          style={{
            borderLeft: '2.5px solid hsl(228, 20%, 75%)',
            paddingLeft: '2rem',
            maxWidth: 860,
          }}
        >
          {/* Main headline */}
          <h1
            style={{
              fontFamily: 'Playfair Display, Georgia, serif',
              fontSize: 'clamp(2.8rem, 7vw, 5.5rem)',
              fontWeight: 700,
              lineHeight: 1.05,
              letterSpacing: '-0.03em',
              color: 'hsl(230, 25%, 10%)',
              marginBottom: '1.5rem',
              maxWidth: 800,
            }}
          >
            We meet on Wednesdays to read the paper nobody assigned.
          </h1>

          {/* Subtitle */}
          <p
            style={{
              fontFamily: 'Inter, sans-serif',
              fontSize: 'clamp(1rem, 1.5vw, 1.15rem)',
              color: 'hsl(230, 15%, 40%)',
              lineHeight: 1.65,
              maxWidth: 620,
              marginBottom: '2.5rem',
            }}
          >
            Then we build the thing in it. A student-run club at DA-IICT for people
            who would rather train a small model badly this week than read about a
            large one forever.
          </p>

          {/* CTA buttons */}
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            <a
              href="https://discord.gg/bU7JdWa6"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                padding: '12px 28px',
                background: 'hsl(230, 25%, 12%)',
                color: 'hsl(228, 30%, 93%)',
                fontFamily: 'JetBrains Mono, monospace',
                fontSize: '0.82rem',
                fontWeight: 600,
                border: '1.5px solid hsl(230, 25%, 12%)',
                borderRadius: '2px',
                textDecoration: 'none',
                letterSpacing: '0.03em',
                transition: 'background 0.2s ease, border-color 0.2s ease',
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
              Join the club
            </a>
            <Link
              to="/events"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                padding: '12px 28px',
                background: 'transparent',
                color: 'hsl(230, 25%, 12%)',
                fontFamily: 'JetBrains Mono, monospace',
                fontSize: '0.82rem',
                fontWeight: 500,
                border: '1.5px solid hsl(228, 20%, 68%)',
                borderRadius: '2px',
                textDecoration: 'none',
                letterSpacing: '0.03em',
                transition: 'border-color 0.2s ease',
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.borderColor = 'hsl(230, 25%, 20%)';
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.borderColor = 'hsl(228, 20%, 68%)';
              }}
            >
              See what's on
            </Link>
          </div>
        </div>
      </div>

      {/* Stats bar at bottom */}
      <div
        style={{
          borderTop: '1px solid hsl(228, 20%, 78%)',
          width: '100%',
        }}
      >
        <div
          style={{
            maxWidth: 1280,
            margin: '0 auto',
            padding: '1.5rem 2rem',
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: '1rem',
          }}
          className="grid-cols-2 sm:grid-cols-4"
        >
          {stats.map((stat, i) => (
            <div key={stat.label} style={{ borderLeft: i > 0 ? '1px solid hsl(228, 20%, 80%)' : 'none', paddingLeft: i > 0 ? '1.5rem' : 0 }}>
              <p
                style={{
                  fontFamily: 'JetBrains Mono, monospace',
                  fontSize: '0.65rem',
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  color: 'hsl(230, 15%, 50%)',
                  marginBottom: '4px',
                }}
              >
                {stat.label}
              </p>
              <p
                style={{
                  fontFamily: 'Inter, sans-serif',
                  fontSize: '1.05rem',
                  fontWeight: 600,
                  color: 'hsl(230, 25%, 12%)',
                }}
              >
                {stat.value}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
