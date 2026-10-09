import { motion } from 'framer-motion';
import {
  ArrowRight,
  Zap,
  TrendingUp,
  Target,
  Briefcase,
  Route,
  Mic,
  BarChart3,
  ChevronRight,
  FileText,
  ShieldCheck,
  Upload,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import type { DashboardData } from '@/types/dashboard';
import type { DashPage } from '../DashboardShell';
import { useToast } from '../Toast';
import { RadialGauge, ProgressBar, AnimatedNumber } from '../Charts';
import type { ResumeAnalysis } from '@/types/resume';
import { RESUME_STORAGE_KEY } from '@/types/resume';

export default function OverviewPage({
  data,
  onNavigate,
}: {
  data: DashboardData;
  onNavigate: (page: DashPage) => void;
}) {
  const { toast } = useToast();
  const firstName = data.user.name.split(' ')[0] || 'there';
  const avgInterview = Math.round(data.interviews.reduce((s, i) => s + i.score, 0) / data.interviews.length);
  const roadmapDone = data.roadmap.filter((r) => r.status === 'done').length;

  // Load persisted resume analysis for the resume card
  const [resumeAnalysis, setResumeAnalysis] = useState<ResumeAnalysis | null>(null);
  useEffect(() => {
    try {
      const stored = localStorage.getItem(RESUME_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored) as ResumeAnalysis;
        if (parsed?.overallScore !== undefined) setResumeAnalysis(parsed);
      }
    } catch { /* ignore */ }
  }, []);

  return (
    <div className="space-y-6">
      {/* Welcome */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4"
      >
        <div>
          <h1 className="font-display font-bold text-2xl md:text-3xl text-white">
            Welcome back, {firstName}
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Your AI career command center • {data.user.targetRoles.join(', ')}
          </p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 self-start">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-[10px] text-emerald-300 font-medium">PROFILE ACTIVE</span>
        </div>
      </motion.div>

      {/* Next Best Action */}
      <NextBestActionMini data={data} onNavigate={onNavigate} />

      {/* Readiness Overview — clickable to analysis */}
      <PreviewCard
        title="Career Readiness"
        subtitle="AI-analyzed across 5 dimensions"
        icon={<Target className="w-4 h-4 text-cyan-400" />}
        onClick={() => onNavigate('analysis')}
        accent="#06B6D4"
        delay={0.1}
      >
        <div className="flex flex-col sm:flex-row items-center gap-6">
          <RadialGauge score={data.overallScore} size={140} />
          <div className="flex-1 w-full space-y-2">
            {data.breakdown.slice(0, 4).map((b, i) => (
              <div key={b.label}>
                <div className="flex items-center justify-between mb-0.5">
                  <span className="text-xs text-slate-400">{b.label}</span>
                  <span className="text-xs font-mono text-white">
                    <AnimatedNumber value={b.score} suffix="%" delay={i * 0.1} />
                  </span>
                </div>
                <ProgressBar value={b.score} color={b.color} delay={i} height="h-1.5" />
              </div>
            ))}
          </div>
        </div>
      </PreviewCard>

      {/* Career Matches + Skill Gaps previews */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <PreviewCard
          title="Career Matches"
          subtitle={`${data.careerMatches.length} roles matched`}
          icon={<Briefcase className="w-4 h-4 text-cyan-400" />}
          onClick={() => onNavigate('matches')}
          accent="#06B6D4"
          delay={0.15}
        >
          <div className="space-y-2">
            {data.careerMatches.slice(0, 2).map((match) => (
              <div key={match.id} className="flex items-center justify-between p-3 rounded-xl bg-white/[0.02] border border-white/5">
                <div>
                  <div className="text-sm font-medium text-white">{match.role}</div>
                  <div className="text-xs text-slate-500">{match.company}</div>
                </div>
                <div className="text-lg font-display font-bold gradient-text-cyan">{match.match}%</div>
              </div>
            ))}
          </div>
        </PreviewCard>

        <PreviewCard
          title="Skill Gaps"
          subtitle={`${data.skillGaps.length} gaps identified`}
          icon={<Zap className="w-4 h-4 text-amber-400" />}
          onClick={() => onNavigate('skills')}
          accent="#F59E0B"
          delay={0.2}
        >
          <div className="space-y-2">
            {data.skillGaps.slice(0, 3).map((gap) => (
              <div key={gap.skill} className="flex items-center justify-between">
                <span className="text-sm text-slate-300">{gap.skill}</span>
                <div className="flex items-center gap-2">
                  <div className="w-20">
                    <ProgressBar value={gap.currentLevel} color="#F59E0B" height="h-1.5" />
                  </div>
                  <span className={`text-[9px] font-mono px-1.5 py-0.5 rounded ${gap.priority === 'High' ? 'text-rose-400 bg-rose-500/10' : 'text-amber-400 bg-amber-500/10'}`}>
                    {gap.priority}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </PreviewCard>
      </div>

      {/* Jobs + Roadmap previews */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <PreviewCard
          title="Recommended Jobs"
          subtitle={`${data.jobs.length} live openings`}
          icon={<Briefcase className="w-4 h-4 text-emerald-400" />}
          onClick={() => onNavigate('jobs')}
          accent="#10B981"
          delay={0.25}
        >
          <div className="space-y-2">
            {data.jobs.slice(0, 3).map((job) => (
              <div key={job.id} className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.02] border border-white/5">
                <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-sm">
                  {job.logo}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-white truncate">{job.title}</div>
                  <div className="text-xs text-slate-500">{job.company}</div>
                </div>
                <div className="text-sm font-display font-bold text-emerald-400">{job.match}%</div>
              </div>
            ))}
          </div>
        </PreviewCard>

        <PreviewCard
          title="Learning Progress"
          subtitle={`${roadmapDone}/${data.roadmap.length} sprints completed`}
          icon={<Route className="w-4 h-4 text-amber-400" />}
          onClick={() => onNavigate('roadmap')}
          accent="#F59E0B"
          delay={0.3}
        >
          <div className="space-y-2">
            {data.roadmap.slice(0, 3).map((item) => (
              <div key={item.id} className="flex items-center gap-3">
                <div
                  className={`w-2 h-2 rounded-full flex-shrink-0 ${item.status === 'done' ? 'bg-emerald-400' : item.status === 'active' ? 'bg-cyan-400 animate-pulse' : 'bg-slate-600'}`}
                />
                <span className="text-sm text-slate-300 flex-1 truncate">{item.title}</span>
                <span className="text-xs font-mono text-slate-500">{item.progress}%</span>
              </div>
            ))}
          </div>
        </PreviewCard>
      </div>

      {/* Resume Analyzer card */}
      <ResumePreviewCard resumeAnalysis={resumeAnalysis} onNavigate={onNavigate} />

      {/* Interview + Analytics previews */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <PreviewCard
          title="Interview Performance"
          subtitle={`${data.interviews.length} sessions • Avg: ${avgInterview}%`}
          icon={<Mic className="w-4 h-4 text-violet-400" />}
          onClick={() => onNavigate('interview')}
          accent="#8B5CF6"
          delay={0.35}
        >
          <div className="space-y-2">
            {data.interviews.slice(0, 3).map((s) => (
              <div key={s.id} className="flex items-center justify-between">
                <span className="text-sm text-slate-300 truncate flex-1">{s.topic}</span>
                <span className={`text-sm font-display font-bold ${s.score >= 80 ? 'text-emerald-400' : s.score >= 65 ? 'text-amber-400' : 'text-rose-400'}`}>
                  {s.score}%
                </span>
              </div>
            ))}
          </div>
        </PreviewCard>

        <PreviewCard
          title="Career Progress"
          subtitle="4-month trend analysis"
          icon={<BarChart3 className="w-4 h-4 text-blue-400" />}
          onClick={() => onNavigate('analytics')}
          accent="#3B82F6"
          delay={0.4}
        >
          <div className="grid grid-cols-3 gap-2">
            {[
              { label: 'Readiness', value: data.analytics[data.analytics.length - 1].readiness, color: '#06B6D4' },
              { label: 'Skills', value: data.analytics[data.analytics.length - 1].skills, color: '#8B5CF6' },
              { label: 'Interview', value: data.analytics[data.analytics.length - 1].interview, color: '#10B981' },
            ].map((stat) => (
              <div key={stat.label} className="p-2 rounded-lg bg-white/[0.02] border border-white/5 text-center">
                <div className="text-lg font-display font-bold text-white">
                  <AnimatedNumber value={stat.value} suffix="%" />
                </div>
                <div className="text-[9px] text-slate-500 uppercase">{stat.label}</div>
              </div>
            ))}
          </div>
        </PreviewCard>
      </div>
    </div>
  );
}

function PreviewCard({
  title,
  subtitle,
  icon,
  children,
  onClick,
  accent,
  delay = 0,
}: {
  title: string;
  subtitle: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  onClick: () => void;
  accent: string;
  delay?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
    >
      <div
        onClick={onClick}
        className="glass-card glass-card-hover p-5 cursor-pointer group"
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center border" style={{ background: `${accent}10`, borderColor: `${accent}25` }}>
              {icon}
            </div>
            <div>
              <h3 className="font-display font-semibold text-white text-sm uppercase tracking-wider">{title}</h3>
              <p className="text-xs text-slate-500">{subtitle}</p>
            </div>
          </div>
          <ChevronRight className="w-5 h-5 text-slate-600 group-hover:text-cyan-400 group-hover:translate-x-1 transition-all duration-300" />
        </div>
        {children}
      </div>
    </motion.div>
  );
}

function NextBestActionMini({ data, onNavigate }: { data: DashboardData; onNavigate: (page: DashPage) => void }) {
  const { toast } = useToast();
  const action = data.nextAction;
  const effortColor = { Low: '#10B981', Medium: '#F59E0B', High: '#EF4444' };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="glass-card p-5 relative overflow-hidden"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 via-blue-500/5 to-transparent pointer-events-none" />
      <div className="absolute -top-20 -right-20 w-40 h-40 bg-cyan-500/10 rounded-full blur-3xl animate-pulse-glow pointer-events-none" />

      <div className="relative flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <div className="relative flex-shrink-0">
          <div className="absolute inset-0 bg-cyan-500/40 blur-md rounded-full animate-pulse-glow" />
          <div className="relative w-10 h-10 rounded-full bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center">
            <Zap className="w-5 h-5 text-white" />
          </div>
        </div>

        <div className="flex-1">
          <div className="text-xs text-cyan-400 font-semibold uppercase tracking-wider mb-1">Next Best Action</div>
          <h3 className="font-display font-semibold text-base text-white mb-1">{action.title}</h3>
          <p className="text-xs text-slate-400 leading-relaxed line-clamp-2">{action.description}</p>
          <div className="flex items-center gap-3 mt-2">
            <span className="flex items-center gap-1 text-xs text-emerald-400">
              <TrendingUp className="w-3 h-3" />+{action.impact} pts
            </span>
            <span className="flex items-center gap-1 text-xs text-slate-400">
              <span className="w-1.5 h-1.5 rounded-full" style={{ background: effortColor[action.effort] }} />
              {action.effort} effort
            </span>
          </div>
        </div>

        <button
          onClick={() => {
            toast(`Starting: ${action.title}`);
            if (action.category === 'Skill Development') onNavigate('roadmap');
            else onNavigate('interview');
          }}
          className="glow-button flex items-center gap-2 text-sm flex-shrink-0"
        >
          {action.action}
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </motion.div>
  );
}

function scoreColor(score: number) {
  if (score >= 80) return '#10B981';
  if (score >= 65) return '#F59E0B';
  return '#EF4444';
}

function ResumePreviewCard({
  resumeAnalysis,
  onNavigate,
}: {
  resumeAnalysis: ResumeAnalysis | null;
  onNavigate: (page: DashPage) => void;
}) {
  const { toast } = useToast();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.32 }}
    >
      <div
        onClick={() => onNavigate('resume')}
        className="glass-card glass-card-hover p-5 cursor-pointer group relative overflow-hidden"
      >
        {/* Subtle violet glow */}
        <div className="absolute -top-10 -right-10 w-32 h-32 bg-violet-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative">
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center border bg-violet-500/10 border-violet-500/25">
                <FileText className="w-4 h-4 text-violet-400" />
              </div>
              <div>
                <h3 className="font-display font-semibold text-white text-sm uppercase tracking-wider">Resume Analyzer</h3>
                <p className="text-xs text-slate-500">
                  {resumeAnalysis ? `Analyzed ${resumeAnalysis.analyzedAt}` : 'No resume uploaded yet'}
                </p>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-slate-600 group-hover:text-violet-400 group-hover:translate-x-1 transition-all duration-300" />
          </div>

          {resumeAnalysis ? (
            <div className="space-y-4">
              {/* Score row */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  { label: 'Overall', value: resumeAnalysis.overallScore, icon: FileText, color: scoreColor(resumeAnalysis.overallScore) },
                  { label: 'ATS Score', value: resumeAnalysis.atsScore, icon: ShieldCheck, color: '#10B981' },
                  { label: 'Content', value: resumeAnalysis.contentScore, icon: FileText, color: '#06B6D4' },
                  { label: 'Keywords', value: resumeAnalysis.keywordScore, icon: Target, color: '#F59E0B' },
                ].map(({ label, value, color }) => (
                  <div key={label} className="p-2.5 rounded-xl bg-white/[0.02] border border-white/5 text-center">
                    <div className="text-lg font-display font-bold" style={{ color }}>
                      <AnimatedNumber value={value} suffix="%" />
                    </div>
                    <div className="text-[9px] text-slate-500 uppercase mt-0.5">{label}</div>
                  </div>
                ))}
              </div>

              {/* ATS progress bar */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-1.5">
                    <ShieldCheck className="w-3 h-3 text-emerald-400" />
                    <span className="text-xs text-slate-400">ATS Compatibility</span>
                  </div>
                  <span className="text-xs font-mono text-emerald-400">{resumeAnalysis.atsScore}%</span>
                </div>
                <ProgressBar value={resumeAnalysis.atsScore} color="#10B981" height="h-1.5" />
              </div>

              {/* Detected skills chips */}
              <div>
                <p className="text-[10px] text-slate-600 uppercase tracking-wider mb-2">Detected Skills</p>
                <div className="flex flex-wrap gap-1.5">
                  {resumeAnalysis.technicalSkills.slice(0, 6).map(s => (
                    <span key={s.name} className="text-[10px] px-2 py-0.5 rounded-lg bg-violet-500/10 border border-violet-500/20 text-violet-300">
                      {s.name}
                    </span>
                  ))}
                  {resumeAnalysis.technicalSkills.length > 6 && (
                    <span className="text-[10px] px-2 py-0.5 rounded-lg bg-white/[0.04] border border-white/10 text-slate-500">
                      +{resumeAnalysis.technicalSkills.length - 6} more
                    </span>
                  )}
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex items-center gap-2 pt-1 border-t border-white/5" onClick={e => e.stopPropagation()}>
                <button
                  onClick={() => onNavigate('resume')}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-violet-300 bg-violet-500/10 border border-violet-500/25 hover:bg-violet-500/20 transition-all duration-300"
                >
                  <FileText className="w-3.5 h-3.5" />
                  View Analysis
                </button>
                <button
                  onClick={() => { toast('Navigate to Resume Analyzer to upload a new resume', 'info'); onNavigate('resume'); }}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-400 bg-white/[0.03] border border-white/10 hover:border-white/20 hover:text-white transition-all duration-300"
                >
                  <Upload className="w-3.5 h-3.5" />
                  Replace Resume
                </button>
              </div>
            </div>
          ) : (
            /* Empty state */
            <div className="flex flex-col items-center gap-3 py-6 text-center">
              <div className="w-12 h-12 rounded-2xl bg-violet-500/10 border border-violet-500/20 border-dashed flex items-center justify-center">
                <Upload className="w-5 h-5 text-violet-400/60" />
              </div>
              <div>
                <p className="text-sm text-slate-400 mb-0.5">No resume analyzed yet</p>
                <p className="text-xs text-slate-600">Upload your resume to get ATS score, skill detection & more</p>
              </div>
              <button
                onClick={(e) => { e.stopPropagation(); onNavigate('resume'); }}
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-medium text-violet-300 bg-violet-500/10 border border-violet-500/25 hover:bg-violet-500/20 transition-all duration-300"
              >
                <Upload className="w-3.5 h-3.5" />
                Upload Resume
              </button>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}

// Inline SVG for ShieldCheck (not reliably exported from lucide-react)
function ShieldCheck({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
    </svg>
  );
}
