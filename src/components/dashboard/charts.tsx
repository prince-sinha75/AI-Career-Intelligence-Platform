import { motion } from 'framer-motion';
import { useEffect, useState, useRef } from 'react';

interface AnimatedNumberProps {
  value: number;
  suffix?: string;
  duration?: number;
  delay?: number;
  className?: string;
}

export function AnimatedNumber({ value, suffix = '', duration = 1, delay = 0, className }: AnimatedNumberProps) {
  const [display, setDisplay] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const started = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !started.current) {
          started.current = true;
          setTimeout(() => {
            const start = performance.now();
            const tick = (now: number) => {
              const elapsed = (now - start) / 1000;
              const progress = Math.min(elapsed / duration, 1);
              const eased = 1 - Math.pow(1 - progress, 3);
              setDisplay(Math.round(value * eased));
              if (progress < 1) requestAnimationFrame(tick);
            };
            requestAnimationFrame(tick);
          }, delay * 100);
        }
      },
      { threshold: 0.3 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [value, duration, delay]);

  return (
    <span ref={ref} className={className}>
      {display}
      {suffix}
    </span>
  );
}

interface RadialGaugeProps {
  score: number;
  size?: number;
  label?: string;
  color?: string;
}

export function RadialGauge({ score, size = 180, label = 'Readiness', color = '#06B6D4' }: RadialGaugeProps) {
  const [animatedScore, setAnimatedScore] = useState(0);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setTimeout(() => setAnimatedScore(score), 100);
        }
      },
      { threshold: 0.3 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [score]);

  const radius = (size - 24) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (animatedScore / 100) * circumference;

  return (
    <div ref={ref} className="relative mx-auto" style={{ width: size, height: size }}>
      <div className="absolute inset-0 rounded-full blur-2xl opacity-30" style={{ background: color }} />
      <svg className="relative w-full h-full -rotate-90" viewBox={`0 0 ${size} ${size}`}>
        <defs>
          <linearGradient id="gaugeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#06B6D4" />
            <stop offset="50%" stopColor="#3B82F6" />
            <stop offset="100%" stopColor="#8B5CF6" />
          </linearGradient>
          <filter id="gaugeGlow">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="8" />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="url(#gaugeGrad)"
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          filter="url(#gaugeGlow)"
          className="transition-all duration-1000 ease-out"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <div className="text-4xl font-display font-bold gradient-text-cyan">
          {animatedScore}
          <span className="text-xl">%</span>
        </div>
        <div className="text-[10px] text-slate-500 mt-1 uppercase tracking-widest">{label}</div>
      </div>
    </div>
  );
}

interface ProgressBarProps {
  value: number;
  color?: string;
  height?: string;
  delay?: number;
}

export function ProgressBar({ value, color = '#06B6D4', height = 'h-2', delay = 0 }: ProgressBarProps) {
  const [width, setWidth] = useState(0);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setTimeout(() => setWidth(value), 100 + delay * 100);
        }
      },
      { threshold: 0.3 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [value, delay]);

  return (
    <div ref={ref} className={`w-full ${height} rounded-full bg-white/5 overflow-hidden`}>
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: `${width}%` }}
        transition={{ duration: 0.8, ease: 'easeOut', delay: delay * 0.1 }}
        className="h-full rounded-full"
        style={{
          background: `linear-gradient(90deg, ${color}, ${color}80)`,
          boxShadow: `0 0 8px ${color}60`,
        }}
      />
    </div>
  );
}

interface LineChartProps {
  data: { label: string; readiness: number; skills: number; interview: number }[];
}

export function LineChart({ data }: LineChartProps) {
  const [animated, setAnimated] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) setAnimated(true);
      },
      { threshold: 0.3 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const width = 360;
  const height = 160;
  const padding = 30;
  const chartW = width - padding * 2;
  const chartH = height - padding * 2;
  const maxVal = 100;

  const points = (key: 'readiness' | 'skills' | 'interview') =>
    data
      .map((d, i) => {
        const x = padding + (i / (data.length - 1)) * chartW;
        const y = padding + chartH - (d[key] / maxVal) * chartH;
        return `${x},${y}`;
      })
      .join(' ');

  const series = [
    { key: 'readiness' as const, color: '#06B6D4', label: 'Readiness' },
    { key: 'skills' as const, color: '#8B5CF6', label: 'Skills' },
    { key: 'interview' as const, color: '#10B981', label: 'Interview' },
  ];

  return (
    <div ref={ref} className="w-full overflow-x-auto">
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full min-w-[320px]" style={{ height }}>
        {/* Grid lines */}
        {[0, 25, 50, 75, 100].map((v) => {
          const y = padding + chartH - (v / maxVal) * chartH;
          return (
            <g key={v}>
              <line x1={padding} y1={y} x2={width - padding} y2={y} stroke="rgba(255,255,255,0.04)" strokeWidth="1" />
              <text x={padding - 8} y={y + 3} textAnchor="end" fontSize="8" fill="rgba(255,255,255,0.3)" fontFamily="monospace">
                {v}
              </text>
            </g>
          );
        })}

        {/* X labels */}
        {data.map((d, i) => {
          const x = padding + (i / (data.length - 1)) * chartW;
          return (
            <text key={d.label} x={x} y={height - 8} textAnchor="middle" fontSize="9" fill="rgba(255,255,255,0.4)" fontFamily="monospace">
              {d.label}
            </text>
          );
        })}

        {/* Lines */}
        {series.map((s) => (
          <g key={s.key}>
            <motion.polyline
              points={points(s.key)}
              fill="none"
              stroke={s.color}
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              filter={`drop-shadow(0 0 4px ${s.color}80)`}
              initial={{ pathLength: 0, opacity: 0 }}
              animate={animated ? { pathLength: 1, opacity: 1 } : {}}
              transition={{ duration: 1.2, ease: 'easeOut' }}
            />
            {data.map((d, i) => {
              const x = padding + (i / (data.length - 1)) * chartW;
              const y = padding + chartH - (d[s.key] / maxVal) * chartH;
              return (
                <motion.circle
                  key={i}
                  cx={x}
                  cy={y}
                  r="3"
                  fill={s.color}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={animated ? { scale: 1, opacity: 1 } : {}}
                  transition={{ delay: 0.8 + i * 0.1 }}
                />
              );
            })}
          </g>
        ))}
      </svg>

      {/* Legend */}
      <div className="flex items-center gap-4 justify-center mt-2">
        {series.map((s) => (
          <div key={s.key} className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full" style={{ background: s.color }} />
            <span className="text-[10px] text-slate-500">{s.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
