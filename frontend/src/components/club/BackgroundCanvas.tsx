import { useEffect, useRef } from 'react';

interface Node {
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;
  color: string;
  pulse: number;
  pulseSpeed: number;
}

export default function BackgroundCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let W: number, H: number, nodes: Node[] = [], animationId: number;

    const colors = [
      'rgba(99, 102, 241,',  // Indigo
      'rgba(14, 165, 233,',  // Cyan
      'rgba(168, 85, 247,',  // Purple
      'rgba(236, 72, 153,',  // Pink
    ];

    const init = () => {
      W = canvas.width = window.innerWidth;
      H = canvas.height = window.innerHeight;
      nodes = [];
      const count = Math.min(Math.floor((W * H) / 16000), 75);
      for (let i = 0; i < count; i++) {
        nodes.push({
          x: Math.random() * W,
          y: Math.random() * H,
          vx: (Math.random() - 0.5) * 0.4,
          vy: (Math.random() - 0.5) * 0.4,
          r: Math.random() * 2.2 + 1.0,
          color: colors[Math.floor(Math.random() * colors.length)],
          pulse: Math.random() * Math.PI * 2,
          pulseSpeed: 0.02 + Math.random() * 0.03,
        });
      }
    };

    const draw = () => {
      ctx.clearRect(0, 0, W, H);

      // Draw connections
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x;
          const dy = nodes[i].y - nodes[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 160) {
            const alpha = 0.18 * (1 - dist / 160);
            ctx.beginPath();
            ctx.moveTo(nodes[i].x, nodes[i].y);
            ctx.lineTo(nodes[j].x, nodes[j].y);
            ctx.strokeStyle = `${nodes[i].color}${alpha})`;
            ctx.lineWidth = 0.8;
            ctx.stroke();
          }
        }
      }

      // Draw nodes
      nodes.forEach((n) => {
        n.pulse += n.pulseSpeed;
        const currentR = n.r + Math.sin(n.pulse) * 0.8;

        // Outer glow
        ctx.beginPath();
        ctx.arc(n.x, n.y, currentR * 3, 0, Math.PI * 2);
        ctx.fillStyle = `${n.color}0.15)`;
        ctx.fill();

        // Core node
        ctx.beginPath();
        ctx.arc(n.x, n.y, currentR, 0, Math.PI * 2);
        ctx.fillStyle = `${n.color}0.85)`;
        ctx.fill();

        n.x += n.vx;
        n.y += n.vy;
        if (n.x < 0 || n.x > W) n.vx *= -1;
        if (n.y < 0 || n.y > H) n.vy *= -1;
      });

      animationId = requestAnimationFrame(draw);
    };

    init();
    draw();

    const handleResize = () => init();
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationId);
    };
  }, []);

  return (
    <>
      <div className="fixed inset-0 z-[-2] bg-gradient-to-br from-slate-50 via-indigo-50/40 to-cyan-50/50" />
      <div 
        className="fixed inset-0 z-[-1] opacity-60 pointer-events-none animate-pulse duration-[8000ms]"
        style={{
          backgroundImage: `
            radial-gradient(circle at 10% 20%, rgba(99, 102, 241, 0.12) 0%, transparent 40%),
            radial-gradient(circle at 90% 15%, rgba(14, 165, 233, 0.12) 0%, transparent 45%),
            radial-gradient(circle at 50% 75%, rgba(168, 85, 247, 0.1) 0%, transparent 50%),
            radial-gradient(circle at 80% 85%, rgba(236, 72, 153, 0.08) 0%, transparent 40%)
          `,
        }} 
      />
      <canvas
        ref={canvasRef}
        className="fixed inset-0 z-0 pointer-events-none opacity-40"
      />
    </>
  );
}
