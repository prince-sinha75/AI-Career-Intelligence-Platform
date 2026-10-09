import { useEffect, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { Play, ArrowRight, TrendingUp, FileText, MessageSquare } from 'lucide-react';

const gaugeStats = [
  { label: 'Technical', value: 88, color: '#06B6D4', icon: TrendingUp },
  { label: 'Resume ATS', value: 82, color: '#8B5CF6', icon: FileText },
  { label: 'Interview Prep', value: 79, color: '#3B82F6', icon: MessageSquare },
];

function CareerGauge() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-100px' });
  const [score, setScore] = useState(0);

  useEffect(() => {
    if (!inView) return;
    let current = 0;
    const target = 84;
    const interval = setInterval(() => {
      current += 1;
      if (current >= target) {
        current = target;
        clearInterval(interval);
      }
      setScore(current);
    }, 25);
    return () => clearInterval(interval);
  }, [inView]);

  const radius = 90;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  return (
    <div ref={ref} className="relative w-[280px] h-[280px] mx-auto">
      {/* Outer glow */}
      <div className="absolute inset-0 rounded-full bg-cyan-500/10 blur-3xl animate-pulse-glow" />

      <svg className="relative w-full h-full -rotate-90" viewBox="0 0 220 220">
        <defs>
          <linearGradient id="gaugeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#06B6D4" />
            <stop offset="50%" stopColor="#3B82F6" />
            <stop offset="100%" stopColor="#8B5CF6" />
          </linearGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Background ring */}
        <circle
          cx="110"
          cy="110"
          r={radius}
          fill="none"
          stroke="rgba(255,255,255,0.05)"
          strokeWidth="10"
        />

        {/* Progress ring */}
        <circle
          cx="110"
          cy="110"
          r={radius}
          fill="none"
          stroke="url(#gaugeGradient)"
          strokeWidth="10"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          filter="url(#glow)"
          className="transition-all duration-300"
        />

        {/* Tick marks */}
        {Array.from({ length: 60 }).map((_, i) => {
          const angle = (i / 60) * 360;
          const x1 = 110 + Math.cos((angle * Math.PI) / 180) * 105;
          const y1 = 110 + Math.sin((angle * Math.PI) / 180) * 105;
          const x2 = 110 + Math.cos((angle * Math.PI) / 180) * 110;
          const y2 = 110 + Math.sin((angle * Math.PI) / 180) * 110;
          return (
            <line
              key={i}
              x1={x1}
              y1={y1}
              x2={x2}
              y2={y2}
              stroke="rgba(255,255,255,0.08)"
              strokeWidth="1"
            />
          );
        })}
      </svg>

      {/* Center content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={inView ? { opacity: 1, scale: 1 } : {}}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          <div className="text-5xl font-display font-bold gradient-text-cyan">
            {score}
            <span className="text-2xl">%</span>
          </div>
          <div className="text-xs text-slate-400 mt-1 text-center uppercase tracking-widest">
            Readiness
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default function Hero({
  onAnalyzeCareer,
}: {
  onAnalyzeCareer: () => void;
}) {
  return (
    <section className="relative min-h-screen flex items-center justify-center pt-28 pb-16 px-6">
      {/* Radial glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-cyan-500/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-violet-500/8 rounded-full blur-[100px] pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto w-full">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-8">
          {/* Left: Content */}
          <div className="flex-1 text-center lg:text-left">
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="font-display font-bold text-4xl md:text-5xl lg:text-6xl leading-[1.1] text-balance"
            >
              <span className="gradient-text">Know where you are.</span>{' '}
              <span className="gradient-text">Know where you're going.</span>{' '}
              <span className="bg-gradient-to-r from-cyan-400 to-violet-500 bg-clip-text text-transparent">
                Know what to do next.
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mt-6 text-base md:text-lg text-slate-400 max-w-xl mx-auto lg:mx-0 leading-relaxed"
            >
              AI-powered career readiness, ATS resume parsing, real-time skill-gap
              analysis, and personalized learning roadmaps tailored for ambitious
              tech graduates.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="mt-8 flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start"
            >
              <button onClick={onAnalyzeCareer} className="glow-button flex items-center gap-2 group">
                Analyze My Career
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
              <button className="glass-card glass-card-hover flex items-center gap-2 px-6 py-3 rounded-full text-slate-200">
                <div className="w-7 h-7 rounded-full bg-white/10 flex items-center justify-center">
                  <Play className="w-3.5 h-3.5 fill-white text-white" />
                </div>
                Explore Platform
              </button>
            </motion.div>


          </div>

          {/* Right: Gauge card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8, rotateY: 15 }}
            animate={{ opacity: 1, scale: 1, rotateY: 0 }}
            transition={{ duration: 0.8, delay: 0.3, ease: 'easeOut' }}
            className="flex-1 w-full max-w-md"
          >
            <div className="glass-card glass-card-hover p-6 md:p-8 animate-float glow-cyan">
              {/* Card header */}
              <div className="flex items-center justify-between mb-4">
                <div>
                  <div className="text-xs text-slate-500 uppercase tracking-widest">
                    Career Readiness Report
                  </div>
                  <div className="text-sm text-slate-300 mt-1">
                    Profile: Aarav S. • MCA 2026
                  </div>
                </div>
                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-[10px] text-emerald-300 font-medium">
                    LIVE
                  </span>
                </div>
              </div>

              {/* Gauge */}
              <CareerGauge />

              {/* Breakdown stats */}
              <div className="mt-6 space-y-3">
                {gaugeStats.map((stat, i) => {
                  const Icon = stat.icon;
                  return (
                    <div key={i}>
                      <div className="flex items-center justify-between mb-1.5">
                        <div className="flex items-center gap-2">
                          <Icon
                            className="w-3.5 h-3.5"
                            style={{ color: stat.color }}
                          />
                          <span className="text-xs text-slate-400">
                            {stat.label}
                          </span>
                        </div>
                        <span className="text-xs font-mono font-semibold text-white">
                          {stat.value}%
                        </span>
                      </div>
                      <div className="h-1.5 rounded-full bg-white/5 overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          whileInView={{ width: `${stat.value}%` }}
                          viewport={{ once: true }}
                          transition={{ duration: 1, delay: 0.5 + i * 0.15, ease: 'easeOut' }}
                          className="h-full rounded-full"
                          style={{
                            background: `linear-gradient(90deg, ${stat.color}, ${stat.color}80)`,
                            boxShadow: `0 0 10px ${stat.color}60`,
                          }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
      >
        <span className="text-[10px] text-slate-600 uppercase tracking-widest">
          Scroll
        </span>
        <div className="w-px h-10 bg-gradient-to-b from-cyan-500/50 to-transparent" />
      </motion.div>
    </section>
  );
}
