import { useEffect, useRef, useCallback } from 'react';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  alpha: number;
  color: string;
  radius: number;
  gravity: number;
  decay: number;
}

interface Rocket {
  x: number;
  y: number;
  vx: number;
  vy: number;
  alpha: number;
  color: string;
  trail: { x: number; y: number; alpha: number }[];
  exploded: boolean;
  particles: Particle[];
  life: number;
}

const COLORS = [
  '#ff6b6b', '#ffd93d', '#6bcb77', '#4d96ff',
  '#c77dff', '#ff9f1c', '#00f5ff', '#ff85e1',
  '#fff', '#ffce1a',
];

function randomBetween(min: number, max: number) {
  return Math.random() * (max - min) + min;
}

function pickColor() {
  return COLORS[Math.floor(Math.random() * COLORS.length)];
}

function createExplosionParticles(x: number, y: number, color: string): Particle[] {
  const count = Math.floor(randomBetween(55, 80));
  return Array.from({ length: count }, () => {
    const angle = Math.random() * Math.PI * 2;
    const speed = randomBetween(1.5, 7);
    return {
      x, y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      alpha: 1,
      color,
      radius: randomBetween(1.5, 3.5),
      gravity: randomBetween(0.04, 0.1),
      decay: randomBetween(0.012, 0.022),
    };
  });
}

function launchRocket(canvasW: number, canvasH: number, fromX?: number, fromY?: number): Rocket {
  // Launch from bottom area - slightly spread
  const startX = fromX ?? randomBetween(canvasW * 0.25, canvasW * 0.75);
  const startY = fromY ?? canvasH + 10;

  // Target: a random spot in the upper 35% of screen
  const targetX = randomBetween(canvasW * 0.15, canvasW * 0.85);
  const targetY = randomBetween(canvasH * 0.06, canvasH * 0.35);

  const dist = Math.hypot(targetX - startX, targetY - startY);
  const speed = randomBetween(9, 14);
  const vx = ((targetX - startX) / dist) * speed;
  const vy = ((targetY - startY) / dist) * speed;

  return {
    x: startX, y: startY,
    vx, vy,
    alpha: 1,
    color: pickColor(),
    trail: [],
    exploded: false,
    particles: [],
    life: Math.round(dist / speed) + 2, // steps until explosion
  };
}

export interface FireworkLauncherHandle {
  launch: (fromX?: number, fromY?: number) => void;
}

interface Props {
  launcherRef: React.MutableRefObject<FireworkLauncherHandle | null>;
}

export default function FireworkLauncher({ launcherRef }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rocketsRef = useRef<Rocket[]>([]);
  const rafRef = useRef<number>(0);
  const activeRef = useRef(false);

  const tick = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    let hasActivity = false;

    for (const rocket of rocketsRef.current) {
      if (!rocket.exploded) {
        // Draw trail
        rocket.trail.push({ x: rocket.x, y: rocket.y, alpha: 0.9 });
        if (rocket.trail.length > 14) rocket.trail.shift();

        rocket.trail.forEach((pt, i) => {
          const trailAlpha = (i / rocket.trail.length) * pt.alpha;
          ctx.save();
          ctx.globalAlpha = trailAlpha * rocket.alpha;
          ctx.beginPath();
          ctx.arc(pt.x, pt.y, 2.5, 0, Math.PI * 2);
          ctx.fillStyle = rocket.color;
          ctx.shadowBlur = 6;
          ctx.shadowColor = rocket.color;
          ctx.fill();
          ctx.restore();
          pt.alpha *= 0.88;
        });

        // Draw rocket head
        ctx.save();
        ctx.globalAlpha = rocket.alpha;
        ctx.beginPath();
        ctx.arc(rocket.x, rocket.y, 3.5, 0, Math.PI * 2);
        ctx.fillStyle = '#ffffff';
        ctx.shadowBlur = 14;
        ctx.shadowColor = rocket.color;
        ctx.fill();
        ctx.restore();

        // Move rocket
        rocket.x += rocket.vx;
        rocket.y += rocket.vy;
        rocket.life--;

        if (rocket.life <= 0) {
          // EXPLODE
          rocket.exploded = true;
          rocket.particles = createExplosionParticles(rocket.x, rocket.y, rocket.color);
        }
        hasActivity = true;
      } else {
        // Draw explosion particles
        for (const p of rocket.particles) {
          if (p.alpha <= 0.01) continue;
          ctx.save();
          ctx.globalAlpha = p.alpha;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
          ctx.fillStyle = p.color;
          ctx.shadowBlur = 8;
          ctx.shadowColor = p.color;
          ctx.fill();
          ctx.restore();

          p.x += p.vx;
          p.y += p.vy;
          p.vy += p.gravity;
          p.vx *= 0.97;
          p.alpha -= p.decay;
          p.radius *= 0.995;
          hasActivity = true;
        }
        // Prune dead particles
        rocket.particles = rocket.particles.filter(p => p.alpha > 0.01);
      }
    }

    // Remove fully dead rockets
    rocketsRef.current = rocketsRef.current.filter(r => {
      if (!r.exploded) return true;
      return r.particles.length > 0;
    });

    if (hasActivity || rocketsRef.current.length > 0) {
      rafRef.current = requestAnimationFrame(tick);
    } else {
      activeRef.current = false;
    }
  }, []);

  const launch = useCallback((fromX?: number, fromY?: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const count = Math.floor(randomBetween(2, 4)); // 2-3 rockets
    for (let i = 0; i < count; i++) {
      setTimeout(() => {
        const r = launchRocket(canvas.width, canvas.height, fromX, fromY);
        rocketsRef.current.push(r);
        if (!activeRef.current) {
          activeRef.current = true;
          rafRef.current = requestAnimationFrame(tick);
        }
      }, i * randomBetween(80, 220));
    }
  }, [tick]);

  // Expose launch to parent via ref
  useEffect(() => {
    launcherRef.current = { launch };
  }, [launch, launcherRef]);

  // Resize canvas to full window
  useEffect(() => {
    const resize = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);
    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(rafRef.current);
    };
  }, []);

  // Launch on first mount (page open)
  useEffect(() => {
    const timer = setTimeout(() => launch(), 600);
    return () => clearTimeout(timer);
  }, [launch]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        pointerEvents: 'none',
        zIndex: 9999,
      }}
    />
  );
}
