import { useState, useEffect } from 'react';
import { getApiUrl } from '../../lib/api';

const typeColors: Record<string, string> = {
  VIDEO: 'hsl(243, 75%, 59%)',
  COURSE: 'hsl(243, 75%, 59%)',
  BOOK: 'hsl(243, 75%, 59%)',
  PAPER: 'hsl(330, 45%, 50%)',
};

type ResourceItem = {
  title: string;
  description: string;
  type: string;
  href: string;
};

type ResourceGroup = {
  group: string;
  items: ResourceItem[];
};

export default function Resources() {
  const [resources, setResources] = useState<ResourceGroup[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchResources = async () => {
      try {
        const res = await fetch(getApiUrl('/api/resources'));
        if (!res.ok) throw new Error('Failed to fetch resources');
        const data = await res.json();
        
        // Group by group_name
        const grouped: Record<string, ResourceItem[]> = {};
        data.forEach((item: any) => {
          if (!grouped[item.group_name]) {
            grouped[item.group_name] = [];
          }
          grouped[item.group_name].push({
            title: item.title,
            description: item.description,
            type: item.resource_type,
            href: item.url,
          });
        });

        // Convert to array format for rendering
        const formatted = Object.keys(grouped).map(groupName => ({
          group: groupName,
          items: grouped[groupName]
        }));
        
        setResources(formatted);
      } catch (err) {
        console.error("Failed to fetch resources", err);
      } finally {
        setLoading(false);
      }
    };
    fetchResources();
  }, []);

  return (
    <section
      id="resources"
      style={{
        background: 'hsl(228, 28%, 90%)',
        borderTop: '1px solid hsl(228, 20%, 80%)',
      }}
    >
      <div
        style={{
          maxWidth: 1280,
          margin: '0 auto',
          padding: '5rem 2rem',
        }}
      >
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
          Resources
        </h2>
        <p
          style={{
            fontFamily: 'Inter, sans-serif',
            fontSize: '1rem',
            color: 'hsl(230, 15%, 45%)',
            marginBottom: '2.5rem',
          }}
        >
          The list we actually send people, in the order we send it. Everything here is free.
        </p>

        {/* Resource groups */}
        {resources.map((group) => (
          <div key={group.group} style={{ marginBottom: '2.5rem' }}>
            {/* Group label */}
            <p
              style={{
                fontFamily: 'JetBrains Mono, monospace',
                fontSize: '0.65rem',
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                color: 'hsl(230, 15%, 50%)',
                marginBottom: '0.5rem',
              }}
            >
              {group.group}
            </p>

            {/* Items */}
            {group.items.map((item) => (
              <a
                key={item.title}
                href={item.href}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  justifyContent: 'space-between',
                  gap: '1.5rem',
                  padding: '1.1rem 0',
                  borderTop: '1px solid hsl(228, 20%, 80%)',
                  textDecoration: 'none',
                  transition: 'background 0.15s ease',
                  borderRadius: '2px',
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.paddingLeft = '0.5rem';
                  (e.currentTarget as HTMLElement).style.paddingRight = '0.5rem';
                  (e.currentTarget as HTMLElement).style.background = 'hsl(228, 30%, 95%)';
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.paddingLeft = '0';
                  (e.currentTarget as HTMLElement).style.paddingRight = '0';
                  (e.currentTarget as HTMLElement).style.background = 'transparent';
                }}
              >
                <div>
                  <p
                    style={{
                      fontFamily: 'Inter, sans-serif',
                      fontSize: '0.95rem',
                      fontWeight: 600,
                      color: 'hsl(230, 25%, 12%)',
                      marginBottom: '3px',
                    }}
                  >
                    {item.title}
                  </p>
                  <p
                    style={{
                      fontFamily: 'Inter, sans-serif',
                      fontSize: '0.85rem',
                      color: 'hsl(230, 15%, 42%)',
                      lineHeight: 1.55,
                    }}
                  >
                    {item.description}
                  </p>
                </div>
                <span
                  style={{
                    fontFamily: 'JetBrains Mono, monospace',
                    fontSize: '0.65rem',
                    letterSpacing: '0.1em',
                    textTransform: 'uppercase',
                    color: typeColors[item.type] || 'hsl(243, 75%, 59%)',
                    flexShrink: 0,
                    paddingTop: '2px',
                  }}
                >
                  {item.type}
                </span>
              </a>
            ))}
          </div>
        ))}
      </div>
    </section>
  );
}
