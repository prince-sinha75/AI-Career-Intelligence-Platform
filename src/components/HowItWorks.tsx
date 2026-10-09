import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { User, BrainCircuit, Route, Trophy } from 'lucide-react';

const steps = [
  {
    icon: User,
    title: 'Profile Setup',
    description:
      'Upload your resume, connect GitHub, and enter your target role. The engine builds a baseline profile in under 60 seconds.',
    number: '01',
    accent: '#06B6D4',
  },
  {
    icon: BrainCircuit,
    title: 'Intelligent Analysis',
    description:
      'AI models parse your resume semantically, score technical depth, and benchmark you against thousands of placed graduates.',
    number: '02',
    accent: '#8B5CF6',
  },
  {
    icon: Route,
    title: 'Skill Gap Roadmap',
    description:
      'Receive a personalized sprint-based learning path with curated resources, milestones, and weekly targets.',
    number: '03',
    accent: '#3B82F6',
  },
  {
    icon: Trophy,
    title: 'Placement Ready',
    description:
      'Practice with mock interviews, track progress, and match to live job postings until you land the offer.',
    number: '04',
    accent: '#10B981',
  },
];

export default function HowItWorks() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start 0.8', 'end 0.4'],
  });

  const lineHeight = useTransform(scrollYProgress, [0, 1], ['0%', '100%']);

  return (
    <section
      id="how-it-works"
      ref={containerRef}
      className="relative py-24 md:py-32 section-padding"
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="text-center mb-16"
      >
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10 mb-4">
          <span className="w-1.5 h-1.5 rounded-full bg-violet-400" />
          <span className="text-xs text-slate-400 uppercase tracking-widest">
            How It Works
          </span>
        </div>
        <h2 className="font-display font-bold text-3xl md:text-4xl lg:text-5xl gradient-text mb-4">
          Four steps to placement-ready
        </h2>
        <p className="text-slate-400 max-w-2xl mx-auto">
          A guided pipeline that takes you from raw profile to confident
          candidate — powered by AI at every stage.
        </p>
      </motion.div>

      <div className="relative max-w-4xl mx-auto">
        {/* Vertical line track */}
        <div className="absolute left-8 md:left-1/2 md:-translate-x-1/2 top-0 bottom-0 w-px bg-white/10">
          <motion.div
            style={{ height: lineHeight }}
            className="w-full bg-gradient-to-b from-cyan-400 via-blue-500 to-violet-500"
          >
            <div className="w-full h-full bg-gradient-to-b from-cyan-400 via-blue-500 to-violet-500 blur-[2px] opacity-60" />
          </motion.div>
        </div>

        {/* Steps */}
        <div className="space-y-12 md:space-y-20">
          {steps.map((step, i) => {
            const isLeft = i % 2 === 0;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: isLeft ? -40 : 40 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: '-80px' }}
                transition={{ duration: 0.6 }}
                className={`relative flex items-center gap-6 ${
                  isLeft ? 'md:flex-row' : 'md:flex-row-reverse'
                }`}
              >
                {/* Node */}
                <div className="absolute left-8 md:left-1/2 -translate-x-1/2 z-10">
                  <div className="relative">
                    <div
                      className="absolute inset-0 rounded-full blur-md"
                      style={{ background: step.accent, opacity: 0.4 }}
                    />
                    <div
                      className="relative w-10 h-10 rounded-full flex items-center justify-center border-2 bg-onyx-deep"
                      style={{ borderColor: step.accent }}
                    >
                      <step.icon
                        className="w-4 h-4"
                        style={{ color: step.accent }}
                      />
                    </div>
                  </div>
                </div>

                {/* Content card */}
                <div
                  className={`ml-20 md:ml-0 md:w-[calc(50%-3rem)] ${
                    isLeft ? 'md:text-right md:pr-8' : 'md:pl-8'
                  }`}
                >
                  <div className="glass-card glass-card-hover p-5">
                    <div
                      className={`flex items-center gap-2 mb-2 ${
                        isLeft ? 'md:justify-end' : ''
                      }`}
                    >
                      <span
                        className="font-mono text-xs font-bold"
                        style={{ color: step.accent }}
                      >
                        {step.number}
                      </span>
                      <span className="text-xs text-slate-500 uppercase tracking-widest">
                        Step
                      </span>
                    </div>
                    <h3 className="font-display font-semibold text-lg text-white mb-2">
                      {step.title}
                    </h3>
                    <p className="text-sm text-slate-400 leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                </div>

                {/* Spacer for other side */}
                <div className="hidden md:block md:w-[calc(50%-3rem)]" />
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
