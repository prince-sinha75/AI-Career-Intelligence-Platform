import { useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  baseX: number;
  baseY: number;
  size: number;
  opacity: number;
  hue: number;
}

export default function ParticleBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: -1000, y: -1000 });
  const rafRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const particleCount = Math.min(
      180,
      Math.max(90, Math.floor((width * height) / 9000))
    );
    const connectionDistance = 180;
    const mouseInfluence = 160;

    const particles: Particle[] = [];

    for (let i = 0; i < particleCount; i++) {
      const x = Math.random() * width;
      const y = Math.random() * height;
      particles.push({
        x,
        y,
        baseX: x,
        baseY: y,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        size: Math.random() * 2.2 + 1.2,
        opacity: Math.random() * 0.35 + 0.5,
        hue: Math.random() > 0.7 ? 190 : 180, // cyan range
      });
    }

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
    };

    const handleMouseLeave = () => {
      mouseRef.current = { x: -1000, y: -1000 };
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseout', handleMouseLeave);

    let time = 0;

    const animate = () => {
      time += 0.003;
      ctx.clearRect(0, 0, width, height);

      // Subtle radial gradient glow that follows a slow morph
      const cx = width / 2 + Math.cos(time) * 80;
      const cy = height / 2 + Math.sin(time * 0.7) * 60;
      const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, 500);
      grad.addColorStop(0, 'rgba(6, 182, 212, 0.13)');
      grad.addColorStop(0.5, 'rgba(59, 130, 246, 0.07)');
      grad.addColorStop(1, 'rgba(5, 5, 8, 0)');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, width, height);

      const mouse = mouseRef.current;

      // Update particles
      for (const p of particles) {
        // Organic floating motion
        p.x += p.vx + Math.sin(time + p.baseY * 0.01) * 0.15;
        p.y += p.vy + Math.cos(time + p.baseX * 0.01) * 0.15;

        // Mouse repulsion with dampening
        const dx = p.x - mouse.x;
        const dy = p.y - mouse.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < mouseInfluence) {
          const force = (1 - dist / mouseInfluence) * 2.5;
          p.x += (dx / dist) * force;
          p.y += (dy / dist) * force;
        }

        // Return to base position gradually
        p.x += (p.baseX - p.x) * 0.008;
        p.y += (p.baseY - p.y) * 0.008;

        // Wrap around edges
        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        if (p.y > height) p.y = 0;
      }

      // Draw connections
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < connectionDistance) {
            const alpha = (1 - dist / connectionDistance) * 0.5;
            const isNearMouse =
              Math.abs((particles[i].x + particles[j].x) / 2 - mouse.x) < 200 &&
              Math.abs((particles[i].y + particles[j].y) / 2 - mouse.y) < 200;

            ctx.strokeStyle = isNearMouse
              ? `rgba(34, 211, 238, ${alpha * 2})`
              : `rgba(83, 170, 205, ${alpha})`;
            ctx.lineWidth = 0.8;
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }

      // Draw particles
      for (const p of particles) {
        const dx = p.x - mouse.x;
        const dy = p.y - mouse.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const isNearMouse = dist < mouseInfluence;
        const glowSize = isNearMouse ? p.size * 3 : p.size;

        ctx.beginPath();
        ctx.arc(p.x, p.y, glowSize, 0, Math.PI * 2);
        ctx.fillStyle = isNearMouse
          ? `hsla(${p.hue}, 90%, 60%, ${p.opacity * 1.5})`
          : `hsla(${p.hue}, 70%, 55%, ${p.opacity})`;
        ctx.fill();

        if (isNearMouse) {
          ctx.beginPath();
          ctx.arc(p.x, p.y, glowSize * 2, 0, Math.PI * 2);
          ctx.fillStyle = `hsla(${p.hue}, 90%, 60%, ${p.opacity * 0.15})`;
          ctx.fill();
        }
      }

      rafRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseout', handleMouseLeave);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="fixed inset-0 z-[1] pointer-events-none mix-blend-screen"
      style={{ width: '100vw', height: '100vh' }}
    />
  );
}
