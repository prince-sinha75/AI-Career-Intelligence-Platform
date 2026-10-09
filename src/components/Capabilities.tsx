import { useRef, type ReactNode } from 'react';
import { motion } from 'framer-motion';
import {
  Gauge,
  FileSearch,
  GitCompare,
  Target,
  Route,
  Mic,
  BarChart3,
  type LucideIcon,
} from 'lucide-react';

interface Capability {
  icon: LucideIcon;
  title: string;
  description: string;
  tags: string[];
  accent: string;
}

const capabilities: Capability[] = [
  {
    icon: Gauge,
    title: 'Career Readiness Engine',
    description:
      'Weighted scoring across technical, resume, and interview dimensions with a benchmark matrix calibrated against top placement cohorts.',
    tags: ['Weighted Scoring', 'Benchmark Matrix'],
    accent: '#06B6D4',
  },
  {
    icon: FileSearch,
    title: 'ATS Resume Analyzer',
    description:
      'Deep semantic extraction with PDF feedback. Detects keyword gaps, formatting issues, and alignment with target role descriptions.',
    tags: ['Semantic Extraction', 'PDF Feedback'],
    accent: '#8B5CF6',
  },
  {
    icon: GitCompare,
    title: 'Skill Gap Engine',
    description:
      'Compares your profile against target role requirements and surfaces precise skill deficiencies with priority weighting.',
    tags: ['Target Role Match', 'Gap Detection'],
    accent: '#3B82F6',
  },
  {
    icon: Target,
    title: 'AI Job Matching',
    description:
      'TF-IDF and vector similarity ranking that matches your profile to live job postings with compatibility scoring.',
    tags: ['TF-IDF', 'Vector Similarity'],
    accent: '#10B981',
  },
  {
    icon: Route,
    title: 'Dynamic Learning Roadmap',
    description:
      'Skill-gap generated sprint paths with curated resources, milestones, and time estimates to close every gap.',
    tags: ['Sprint Paths', 'Curated Resources'],
    accent: '#F59E0B',
  },
  {
    icon: Mic,
    title: 'AI Mock Interview Simulator',
    description:
      'Real-time question generation and response analysis with instant feedback on clarity, depth, and confidence.',
    tags: ['Real-time Q&A', 'Response Analysis'],
    accent: '#EC4899',
  },
  {
    icon: BarChart3,
    title: 'Career Analytics & Progress',
    description:
      'Historical tracking of readiness scores, viva metrics, and skill progression with trend visualization.',
    tags: ['Historical Tracking', 'Viva Metrics'],
    accent: '#6366F1',
  },
];

function TiltCard({
  children,
  index,
}: {
  children: ReactNode;
  index: number;
}) {
  const ref = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent) => {
    const card = ref.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = ((y - centerY) / centerY) * -8;
    const rotateY = ((x - centerX) / centerX) * 8;
    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
  };

  const handleMouseLeave = () => {
    const card = ref.current;
    if (!card) return;
    card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.5, delay: index * 0.08 }}
      className={index === 6 ? 'lg:col-span-3' : ''}
    >
      <div
        ref={ref}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className="glass-card glass-card-hover p-6 h-full transition-transform duration-200 ease-out cursor-default"
        style={{ transformStyle: 'preserve-3d' }}
      >
        {children}
      </div>
    </motion.div>
  );
}

export default function Capabilities() {
  return (
    <section id="capabilities" className="relative py-24 md:py-32 section-padding">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="text-center mb-14"
      >
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10 mb-4">
          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
          <span className="text-xs text-slate-400 uppercase tracking-widest">
            Core Capabilities
          </span>
        </div>
        <h2 className="font-display font-bold text-3xl md:text-4xl lg:text-5xl gradient-text mb-4">
          An intelligence engine for every step
        </h2>
        <p className="text-slate-400 max-w-2xl mx-auto">
          Seven AI-powered modules that analyze, score, and guide you from
          first-semester to final placement.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {capabilities.map((cap, i) => (
          <TiltCard key={i} index={i}>
            <div className="flex flex-col h-full">
              {/* Icon */}
              <div className="relative mb-5 w-fit">
                <div
                  className="absolute inset-0 blur-xl opacity-40 rounded-2xl"
                  style={{ background: cap.accent }}
                />
                <div
                  className="relative w-12 h-12 rounded-2xl flex items-center justify-center border"
                  style={{
                    background: `${cap.accent}15`,
                    borderColor: `${cap.accent}30`,
                  }}
                >
                  <cap.icon
                    className="w-5 h-5"
                    style={{ color: cap.accent }}
                  />
                </div>
              </div>

              <h3 className="font-display font-semibold text-lg text-white mb-2">
                {cap.title}
              </h3>
              <p className="text-sm text-slate-400 leading-relaxed mb-4 flex-1">
                {cap.description}
              </p>

              <div className="flex flex-wrap gap-2">
                {cap.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-[10px] font-mono px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-slate-400"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </TiltCard>
        ))}
      </div>
    </section>
  );
}
