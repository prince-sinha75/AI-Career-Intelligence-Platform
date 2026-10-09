import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FileText, Upload, RefreshCw, ChevronDown, ChevronRight,
  CheckCircle2, AlertCircle, AlertTriangle, Sparkles, Star,
  Briefcase, GraduationCap, FolderKanban, Award, Code2,
  Brain, TrendingUp, Target, Zap, X, RotateCcw, Eye,
  BookOpen, Lightbulb, Search, ShieldCheck,
} from 'lucide-react';
import type { ResumeAnalysis, ImprovementSuggestion } from '@/types/resume';
import { RESUME_STORAGE_KEY } from '@/types/resume';
import { mockResumeAnalysis, generateMockAnalysis } from '@/data/resumeMockData';
import { useToast } from '../Toast';
import { ProgressBar, AnimatedNumber } from '../Charts';

// ─── Helpers ─────────────────────────────────────────────────────────────────

function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

function scoreColor(score: number) {
  if (score >= 80) return '#10B981';
  if (score >= 65) return '#F59E0B';
  return '#EF4444';
}

function scoreLabel(score: number) {
  if (score >= 80) return 'Excellent';
  if (score >= 65) return 'Good';
  if (score >= 50) return 'Fair';
  return 'Needs Work';
}

function priorityColor(p: ImprovementSuggestion['priority']) {
  return { critical: '#EF4444', high: '#F59E0B', medium: '#06B6D4', low: '#8B5CF6' }[p];
}
function priorityBg(p: ImprovementSuggestion['priority']) {
  return {
    critical: 'bg-rose-500/10 border-rose-500/25 text-rose-400',
    high: 'bg-amber-500/10 border-amber-500/25 text-amber-400',
    medium: 'bg-cyan-500/10 border-cyan-500/25 text-cyan-400',
    low: 'bg-violet-500/10 border-violet-500/25 text-violet-400',
  }[p];
}

const ACCEPTED_TYPES = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
];

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function ResumeAnalyzerPage() {
  const { toast } = useToast();
  const [analysis, setAnalysis] = useState<ResumeAnalysis | null>(null);
  const [loading, setLoading] = useState(true);
  const [analyzing, setAnalyzing] = useState(false);
  const [analyzeProgress, setAnalyzeProgress] = useState(0);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const progressRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Load persisted analysis on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(RESUME_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored) as ResumeAnalysis;
        if (parsed?.overallScore !== undefined) {
          setAnalysis(parsed);
        }
      }
    } catch {
      // fall through — will show empty state
    }
    setLoading(false);
  }, []);

  const runAnalysis = useCallback((file: File) => {
    if (!ACCEPTED_TYPES.includes(file.type) &&
        !file.name.match(/\.(pdf|doc|docx)$/i)) {
      toast('Only PDF, DOC, and DOCX files are supported.', 'warning');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast('File must be under 5 MB.', 'warning');
      return;
    }

    setAnalyzing(true);
    setAnalyzeProgress(0);

    let p = 0;
    progressRef.current = setInterval(() => {
      p += p < 30 ? 6 : p < 60 ? 4 : p < 85 ? 2 : 0.8;
      p = Math.min(p, 96);
      setAnalyzeProgress(Math.round(p));
    }, 120);

    // Simulate AI analysis delay
    setTimeout(() => {
      clearInterval(progressRef.current!);
      setAnalyzeProgress(100);
      const result = generateMockAnalysis({
        name: file.name,
        size: file.size,
        type: file.type,
        lastModified: file.lastModified,
      });
      try {
        localStorage.setItem(RESUME_STORAGE_KEY, JSON.stringify(result));
      } catch { /* ignore */ }
      setTimeout(() => {
        setAnalysis(result);
        setAnalyzing(false);
        toast('Resume analyzed successfully!', 'success');
      }, 500);
    }, 3800);
  }, [toast]);

  const handleReanalyze = useCallback(() => {
    if (!analysis) return;
    setAnalyzing(true);
    setAnalyzeProgress(0);
    let p = 0;
    progressRef.current = setInterval(() => {
      p += p < 30 ? 6 : p < 60 ? 4 : p < 85 ? 2 : 0.8;
      p = Math.min(p, 96);
      setAnalyzeProgress(Math.round(p));
    }, 120);
    setTimeout(() => {
      clearInterval(progressRef.current!);
      setAnalyzeProgress(100);
      const result = generateMockAnalysis(analysis.resumeFile);
      try { localStorage.setItem(RESUME_STORAGE_KEY, JSON.stringify(result)); } catch { /* ignore */ }
      setTimeout(() => {
        setAnalysis(result);
        setAnalyzing(false);
        toast('Analysis refreshed!', 'success');
      }, 500);
    }, 3800);
  }, [analysis, toast]);

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) runAnalysis(file);
    e.target.value = '';
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) runAnalysis(file);
  };

  useEffect(() => () => { if (progressRef.current) clearInterval(progressRef.current); }, []);

  if (loading) return <SkeletonLoader />;
  if (analyzing) return <AnalyzingLoader progress={analyzeProgress} />;

  if (!analysis) {
    return (
      <EmptyState
        dragOver={dragOver}
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        onBrowse={() => fileInputRef.current?.click()}
        fileInputRef={fileInputRef}
        onFileInput={handleFileInput}
        onUseMock={() => {
          setAnalysis(mockResumeAnalysis);
          try { localStorage.setItem(RESUME_STORAGE_KEY, JSON.stringify(mockResumeAnalysis)); } catch { /* ignore */ }
          toast('Demo analysis loaded!', 'info');
        }}
      />
    );
  }

  return (
    <div className="space-y-6">
      <input ref={fileInputRef} type="file" accept=".pdf,.doc,.docx" className="hidden" onChange={handleFileInput} />

      {/* Header */}
      <PageHeader
        analysis={analysis}
        onUpload={() => fileInputRef.current?.click()}
        onReanalyze={handleReanalyze}
      />

      {/* Score Cards Row */}
      <ScoreCardsRow analysis={analysis} />

      {/* Score Breakdown */}
      <ScoreBreakdown analysis={analysis} />

      {/* Two column: Strengths + Weak Areas */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <StrengthsCard analysis={analysis} />
        <WeakAreasCard analysis={analysis} />
      </div>

      {/* Skills: Technical + Soft */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <TechnicalSkillsCard analysis={analysis} />
        <SoftSkillsCard analysis={analysis} />
      </div>

      {/* Technologies */}
      <TechnologiesCard analysis={analysis} />

      {/* Missing / Recommended Skills */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <MissingSkillsCard analysis={analysis} />
        <RecommendedSkillsCard analysis={analysis} />
      </div>

      {/* Experience */}
      <ExperienceCard analysis={analysis} />

      {/* Education + Projects */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <EducationCard analysis={analysis} />
        <ProjectsCard analysis={analysis} />
      </div>

      {/* Certifications */}
      <CertificationsCard analysis={analysis} onUpload={() => fileInputRef.current?.click()} />

      {/* Keyword Analysis */}
      <KeywordAnalysisCard analysis={analysis} />

      {/* Job Role Compatibility */}
      <JobCompatibilityCard analysis={analysis} />

      {/* Improvement Suggestions */}
      <SuggestionsCard analysis={analysis} />
    </div>
  );
}

// ─── Page Header ──────────────────────────────────────────────────────────────

function PageHeader({
  analysis,
  onUpload,
  onReanalyze,
}: {
  analysis: ResumeAnalysis;
  onUpload: () => void;
  onReanalyze: () => void;
}) {
  const { toast } = useToast();
  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5 mb-1">
            <div className="w-8 h-8 rounded-lg bg-violet-500/15 border border-violet-500/30 flex items-center justify-center">
              <FileText className="w-4 h-4 text-violet-400" />
            </div>
            <h1 className="font-display font-bold text-2xl md:text-3xl text-white">Resume Analyzer</h1>
          </div>
          <p className="text-sm text-slate-500 ml-10">
            {analysis.resumeFile.name} • {formatBytes(analysis.resumeFile.size)} • Analyzed {analysis.analyzedAt}
          </p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => { toast('Opening analysis view…', 'info'); }}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-slate-300 bg-white/[0.04] border border-white/10 hover:border-white/20 hover:text-white transition-all duration-300"
          >
            <Eye className="w-4 h-4" />
            View Analysis
          </button>
          <button
            onClick={onReanalyze}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-cyan-300 bg-cyan-500/10 border border-cyan-500/25 hover:border-cyan-500/50 hover:bg-cyan-500/15 transition-all duration-300"
          >
            <RotateCcw className="w-4 h-4" />
            Re-analyze
          </button>
          <button
            onClick={onUpload}
            className="glow-button flex items-center gap-2 text-sm py-2 px-4"
          >
            <Upload className="w-4 h-4" />
            Replace Resume
          </button>
        </div>
      </div>
    </motion.div>
  );
}

// ─── Score Cards ─────────────────────────────────────────────────────────────

function ScoreCardsRow({ analysis }: { analysis: ResumeAnalysis }) {
  const cards = [
    { label: 'Overall Score', value: analysis.overallScore, icon: Star, desc: scoreLabel(analysis.overallScore) },
    { label: 'ATS Score', value: analysis.atsScore, icon: ShieldCheck, desc: 'ATS Compatibility' },
    { label: 'Content', value: analysis.contentScore, icon: FileText, desc: 'Content Quality' },
    { label: 'Formatting', value: analysis.formattingScore, icon: Brain, desc: 'Layout & Structure' },
    { label: 'Keywords', value: analysis.keywordScore, icon: Search, desc: 'Keyword Match' },
    { label: 'Impact', value: analysis.impactScore, icon: TrendingUp, desc: 'Impact Statements' },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-6 gap-3">
      {cards.map((c, i) => {
        const Icon = c.icon;
        const color = scoreColor(c.value);
        return (
          <motion.div
            key={c.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: i * 0.05 }}
            className="glass-card p-4 text-center group hover:border-white/20 transition-all duration-300"
          >
            <div className="flex items-center justify-center mb-2">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: `${color}15`, border: `1px solid ${color}30` }}>
                <Icon className="w-4 h-4" style={{ color }} />
              </div>
            </div>
            <div className="text-2xl font-display font-bold mb-0.5" style={{ color }}>
              <AnimatedNumber value={c.value} suffix="%" duration={1.2} delay={i * 0.1} />
            </div>
            <div className="text-[10px] text-slate-500 uppercase tracking-wider">{c.label}</div>
            <div className="text-[9px] mt-1 font-medium" style={{ color }}>{c.desc}</div>
          </motion.div>
        );
      })}
    </div>
  );
}

// ─── Score Breakdown ──────────────────────────────────────────────────────────

function ScoreBreakdown({ analysis }: { analysis: ResumeAnalysis }) {
  const bars = [
    { label: 'Overall Score', value: analysis.overallScore, color: scoreColor(analysis.overallScore) },
    { label: 'ATS Compatibility', value: analysis.atsScore, color: '#10B981' },
    { label: 'Content Quality', value: analysis.contentScore, color: '#06B6D4' },
    { label: 'Formatting', value: analysis.formattingScore, color: '#8B5CF6' },
    { label: 'Keyword Match', value: analysis.keywordScore, color: '#F59E0B' },
    { label: 'Impact Statements', value: analysis.impactScore, color: '#EF4444' },
  ];

  return (
    <SectionCard title="Score Breakdown" icon={BarChart} accent="#06B6D4" delay={0.1}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-4">
        {bars.map((b, i) => (
          <div key={b.label}>
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-sm text-slate-300">{b.label}</span>
              <span className="text-sm font-mono font-bold" style={{ color: b.color }}>
                <AnimatedNumber value={b.value} suffix="%" delay={i * 0.1} />
              </span>
            </div>
            <ProgressBar value={b.value} color={b.color} height="h-2" delay={i} />
          </div>
        ))}
      </div>
      <p className="text-xs text-slate-600 mt-4 border-t border-white/5 pt-4 leading-relaxed">
        {analysis.summary}
      </p>
    </SectionCard>
  );
}

function BarChart({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
    </svg>
  );
}

// ─── Strengths & Weak Areas ───────────────────────────────────────────────────

function StrengthsCard({ analysis }: { analysis: ResumeAnalysis }) {
  return (
    <SectionCard title="Resume Strengths" icon={CheckCircle2} accent="#10B981" delay={0.15}>
      <div className="space-y-2.5">
        {analysis.strengths.map((s, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 + i * 0.07 }}
            className="flex items-start gap-3 p-3 rounded-xl bg-emerald-500/5 border border-emerald-500/15"
          >
            <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
            <span className="text-sm text-slate-300 leading-relaxed">{s}</span>
          </motion.div>
        ))}
      </div>
    </SectionCard>
  );
}

function WeakAreasCard({ analysis }: { analysis: ResumeAnalysis }) {
  return (
    <SectionCard title="Weak Areas" icon={AlertTriangle} accent="#F59E0B" delay={0.2}>
      <div className="space-y-2.5">
        {analysis.weakAreas.map((w, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 + i * 0.07 }}
            className="flex items-start gap-3 p-3 rounded-xl bg-amber-500/5 border border-amber-500/15"
          >
            <AlertTriangle className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
            <span className="text-sm text-slate-300 leading-relaxed">{w}</span>
          </motion.div>
        ))}
      </div>
    </SectionCard>
  );
}

// ─── Technical Skills ─────────────────────────────────────────────────────────

function TechnicalSkillsCard({ analysis }: { analysis: ResumeAnalysis }) {
  return (
    <SectionCard title="Technical Skills Detected" icon={Code2} accent="#06B6D4" delay={0.2}>
      <div className="space-y-3">
        {analysis.technicalSkills.map((skill, i) => (
          <div key={skill.name}>
            <div className="flex items-center justify-between mb-1">
              <span className="text-sm text-slate-300">{skill.name}</span>
              <span className="text-xs font-mono text-cyan-400">{skill.confidence}%</span>
            </div>
            <ProgressBar value={skill.confidence} color="#06B6D4" height="h-1.5" delay={i} />
          </div>
        ))}
      </div>
    </SectionCard>
  );
}

function SoftSkillsCard({ analysis }: { analysis: ResumeAnalysis }) {
  return (
    <SectionCard title="Soft Skills Detected" icon={Brain} accent="#8B5CF6" delay={0.25}>
      <div className="space-y-3">
        {analysis.softSkills.map((skill, i) => (
          <div key={skill.name}>
            <div className="flex items-center justify-between mb-1">
              <span className="text-sm text-slate-300">{skill.name}</span>
              <span className="text-xs font-mono text-violet-400">{skill.confidence}%</span>
            </div>
            <ProgressBar value={skill.confidence} color="#8B5CF6" height="h-1.5" delay={i} />
          </div>
        ))}
      </div>
    </SectionCard>
  );
}

// ─── Technologies ─────────────────────────────────────────────────────────────

function TechnologiesCard({ analysis }: { analysis: ResumeAnalysis }) {
  return (
    <SectionCard title="Technologies Detected" icon={Sparkles} accent="#F59E0B" delay={0.25}>
      <div className="flex flex-wrap gap-2">
        {analysis.technologies.map((tech, i) => (
          <motion.span
            key={tech}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 + i * 0.03 }}
            className="px-3 py-1.5 rounded-xl text-sm font-medium bg-amber-500/10 border border-amber-500/20 text-amber-300 hover:bg-amber-500/20 hover:border-amber-500/40 transition-all duration-200 cursor-default"
          >
            {tech}
          </motion.span>
        ))}
      </div>
    </SectionCard>
  );
}

// ─── Missing / Recommended Skills ────────────────────────────────────────────

function MissingSkillsCard({ analysis }: { analysis: ResumeAnalysis }) {
  return (
    <SectionCard title="Missing Skills" icon={AlertCircle} accent="#EF4444" delay={0.3}>
      <div className="space-y-2">
        {analysis.missingSkills.map((skill, i) => (
          <motion.div
            key={skill}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.15 + i * 0.06 }}
            className="flex items-center gap-2.5 p-2.5 rounded-xl bg-rose-500/5 border border-rose-500/15"
          >
            <X className="w-3.5 h-3.5 text-rose-400 flex-shrink-0" />
            <span className="text-sm text-slate-300">{skill}</span>
          </motion.div>
        ))}
      </div>
    </SectionCard>
  );
}

function RecommendedSkillsCard({ analysis }: { analysis: ResumeAnalysis }) {
  return (
    <SectionCard title="Recommended Skills" icon={Lightbulb} accent="#10B981" delay={0.3}>
      <div className="space-y-2">
        {analysis.recommendedSkills.map((skill, i) => (
          <motion.div
            key={skill}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.15 + i * 0.06 }}
            className="flex items-start gap-2.5 p-2.5 rounded-xl bg-emerald-500/5 border border-emerald-500/15"
          >
            <Sparkles className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0 mt-0.5" />
            <span className="text-sm text-slate-300 leading-relaxed">{skill}</span>
          </motion.div>
        ))}
      </div>
    </SectionCard>
  );
}

// ─── Experience ───────────────────────────────────────────────────────────────

function ExperienceCard({ analysis }: { analysis: ResumeAnalysis }) {
  const [openIdx, setOpenIdx] = useState<number | null>(0);
  return (
    <SectionCard title="Experience" icon={Briefcase} accent="#06B6D4" delay={0.3}>
      <div className="space-y-3">
        {analysis.experience.map((exp, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 + i * 0.1 }}
            className="rounded-xl border border-white/10 overflow-hidden"
          >
            <button
              onClick={() => setOpenIdx(openIdx === i ? null : i)}
              className="w-full flex items-center gap-3 p-4 text-left hover:bg-white/[0.02] transition-colors duration-200"
            >
              <div className="w-9 h-9 rounded-lg bg-cyan-500/10 border border-cyan-500/25 flex items-center justify-center flex-shrink-0">
                <Briefcase className="w-4 h-4 text-cyan-400" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-display font-semibold text-white text-sm">{exp.role}</span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-300 border border-cyan-500/20">{exp.duration}</span>
                </div>
                <div className="text-xs text-slate-500 mt-0.5">{exp.company} • {exp.period}</div>
              </div>
              <ChevronDown className={`w-4 h-4 text-slate-500 flex-shrink-0 transition-transform duration-300 ${openIdx === i ? 'rotate-180' : ''}`} />
            </button>
            <AnimatePresence>
              {openIdx === i && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3, ease: 'easeOut' }}
                  className="overflow-hidden"
                >
                  <div className="px-4 pb-4 space-y-3 border-t border-white/5">
                    <div className="pt-3 space-y-2">
                      {exp.highlights.map((h, j) => (
                        <div key={j} className="flex items-start gap-2 text-sm text-slate-400">
                          <ChevronRight className="w-3.5 h-3.5 text-cyan-500 flex-shrink-0 mt-0.5" />
                          <span className="leading-relaxed">{h}</span>
                        </div>
                      ))}
                    </div>
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {exp.technologies.map((t) => (
                        <span key={t} className="text-[10px] px-2 py-0.5 rounded-md bg-white/[0.04] border border-white/10 text-slate-400">{t}</span>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </div>
    </SectionCard>
  );
}

// ─── Education ────────────────────────────────────────────────────────────────

function EducationCard({ analysis }: { analysis: ResumeAnalysis }) {
  return (
    <SectionCard title="Education" icon={GraduationCap} accent="#8B5CF6" delay={0.3}>
      <div className="space-y-4">
        {analysis.education.map((edu, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 + i * 0.1 }}
            className="p-4 rounded-xl bg-violet-500/5 border border-violet-500/15"
          >
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-lg bg-violet-500/15 border border-violet-500/30 flex items-center justify-center flex-shrink-0">
                <GraduationCap className="w-4 h-4 text-violet-400" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-display font-semibold text-white text-sm">{edu.degree}</div>
                <div className="text-xs text-slate-400 mt-0.5">{edu.institution}</div>
                <div className="flex items-center gap-3 mt-1.5">
                  <span className="text-xs text-slate-500">{edu.year}</span>
                  {edu.gpa && (
                    <span className="text-xs px-2 py-0.5 rounded-full bg-violet-500/10 text-violet-300 border border-violet-500/20">
                      GPA: {edu.gpa}
                    </span>
                  )}
                </div>
                {edu.achievements && edu.achievements.length > 0 && (
                  <ul className="mt-2 space-y-1">
                    {edu.achievements.map((a, j) => (
                      <li key={j} className="flex items-start gap-2 text-xs text-slate-500">
                        <span className="text-violet-500 mt-0.5">•</span>
                        {a}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </SectionCard>
  );
}

// ─── Projects ─────────────────────────────────────────────────────────────────

function ProjectsCard({ analysis }: { analysis: ResumeAnalysis }) {
  const [openIdx, setOpenIdx] = useState<number | null>(null);
  return (
    <SectionCard title="Projects" icon={FolderKanban} accent="#10B981" delay={0.35}>
      <div className="space-y-3">
        {analysis.projects.map((proj, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 + i * 0.1 }}
            className="rounded-xl border border-white/10 overflow-hidden"
          >
            <button
              onClick={() => setOpenIdx(openIdx === i ? null : i)}
              className="w-full flex items-center gap-3 p-4 text-left hover:bg-white/[0.02] transition-colors"
            >
              <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/25 flex items-center justify-center flex-shrink-0">
                <FolderKanban className="w-4 h-4 text-emerald-400" />
              </div>
              <div className="flex-1 min-w-0">
                <span className="font-display font-semibold text-white text-sm">{proj.name}</span>
                <div className="flex flex-wrap gap-1 mt-1">
                  {proj.technologies.slice(0, 3).map(t => (
                    <span key={t} className="text-[9px] px-1.5 py-0.5 rounded bg-white/[0.04] text-slate-500 border border-white/10">{t}</span>
                  ))}
                  {proj.technologies.length > 3 && (
                    <span className="text-[9px] px-1.5 py-0.5 rounded bg-white/[0.04] text-slate-600">+{proj.technologies.length - 3}</span>
                  )}
                </div>
              </div>
              <ChevronDown className={`w-4 h-4 text-slate-500 flex-shrink-0 transition-transform duration-300 ${openIdx === i ? 'rotate-180' : ''}`} />
            </button>
            <AnimatePresence>
              {openIdx === i && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden"
                >
                  <div className="px-4 pb-4 border-t border-white/5 pt-3 space-y-2">
                    <p className="text-sm text-slate-400 leading-relaxed">{proj.description}</p>
                    {proj.impact && (
                      <div className="flex items-start gap-2 p-2 rounded-lg bg-emerald-500/5 border border-emerald-500/15">
                        <TrendingUp className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0 mt-0.5" />
                        <span className="text-xs text-emerald-300">{proj.impact}</span>
                      </div>
                    )}
                    <div className="flex flex-wrap gap-1.5">
                      {proj.technologies.map(t => (
                        <span key={t} className="text-[10px] px-2 py-0.5 rounded-md bg-white/[0.04] border border-white/10 text-slate-400">{t}</span>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </div>
    </SectionCard>
  );
}

// ─── Certifications ───────────────────────────────────────────────────────────

function CertificationsCard({ analysis, onUpload }: { analysis: ResumeAnalysis; onUpload: () => void }) {
  if (analysis.certifications.length === 0) {
    return (
      <SectionCard title="Certifications" icon={Award} accent="#F59E0B" delay={0.35}>
        <div className="flex flex-col items-center justify-center py-8 text-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">
            <Award className="w-6 h-6 text-amber-400/50" />
          </div>
          <p className="text-sm text-slate-500">No certifications detected in your resume.</p>
          <p className="text-xs text-slate-600 max-w-sm leading-relaxed">
            Adding certifications (AWS, Google, Meta) can boost your ATS score by up to 20 points and improves recruiter trust significantly.
          </p>
          <button
            onClick={onUpload}
            className="mt-1 flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-medium text-amber-300 bg-amber-500/10 border border-amber-500/25 hover:bg-amber-500/20 transition-all duration-300"
          >
            <Upload className="w-3.5 h-3.5" />
            Upload Updated Resume
          </button>
        </div>
      </SectionCard>
    );
  }
  return (
    <SectionCard title="Certifications" icon={Award} accent="#F59E0B" delay={0.35}>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {analysis.certifications.map((cert, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 + i * 0.1 }}
            className="p-3 rounded-xl bg-amber-500/5 border border-amber-500/15 flex items-start gap-3"
          >
            <div className="w-8 h-8 rounded-lg bg-amber-500/15 border border-amber-500/25 flex items-center justify-center flex-shrink-0">
              <Award className="w-4 h-4 text-amber-400" />
            </div>
            <div>
              <div className="font-medium text-white text-sm">{cert.name}</div>
              <div className="text-xs text-slate-500">{cert.issuer} • {cert.year}</div>
              {cert.credentialId && <div className="text-[10px] text-slate-600 mt-0.5">ID: {cert.credentialId}</div>}
            </div>
          </motion.div>
        ))}
      </div>
    </SectionCard>
  );
}

// ─── Keyword Analysis ─────────────────────────────────────────────────────────

function KeywordAnalysisCard({ analysis }: { analysis: ResumeAnalysis }) {
  const found = analysis.keywords.filter(k => k.found);
  const missing = analysis.keywords.filter(k => !k.found);
  const [tab, setTab] = useState<'all' | 'found' | 'missing'>('all');

  const displayed = tab === 'found' ? found : tab === 'missing' ? missing : analysis.keywords;

  return (
    <SectionCard title="Keyword Analysis" icon={Search} accent="#06B6D4" delay={0.4}>
      {/* Stats row */}
      <div className="grid grid-cols-3 gap-3 mb-4">
        {[
          { label: 'Total Keywords', value: analysis.keywords.length, color: '#06B6D4' },
          { label: 'Found', value: found.length, color: '#10B981' },
          { label: 'Missing', value: missing.length, color: '#EF4444' },
        ].map(s => (
          <div key={s.label} className="p-3 rounded-xl text-center bg-white/[0.02] border border-white/5">
            <div className="text-xl font-display font-bold" style={{ color: s.color }}>{s.value}</div>
            <div className="text-[10px] text-slate-500 uppercase mt-0.5">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Tab filter */}
      <div className="flex gap-2 mb-4">
        {(['all', 'found', 'missing'] as const).map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium capitalize transition-all duration-200 ${
              tab === t
                ? 'bg-cyan-500/15 border border-cyan-500/40 text-cyan-300'
                : 'bg-white/[0.03] border border-white/10 text-slate-500 hover:text-slate-300'
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      <div className="flex flex-wrap gap-2">
        {displayed.map((kw, i) => (
          <motion.div
            key={kw.keyword}
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.03 }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-sm border transition-all duration-200 ${
              kw.found
                ? 'bg-emerald-500/10 border-emerald-500/25 text-emerald-300'
                : 'bg-rose-500/8 border-rose-500/20 text-rose-400/80'
            }`}
          >
            {kw.found
              ? <CheckCircle2 className="w-3 h-3 flex-shrink-0" />
              : <X className="w-3 h-3 flex-shrink-0" />
            }
            <span>{kw.keyword}</span>
            {kw.found && kw.frequency > 1 && (
              <span className="text-[9px] font-mono opacity-70">×{kw.frequency}</span>
            )}
            <span className={`text-[8px] uppercase font-medium ml-0.5 opacity-60 ${
              kw.importance === 'high' ? 'text-amber-400' : ''
            }`}>{kw.importance}</span>
          </motion.div>
        ))}
      </div>
    </SectionCard>
  );
}

// ─── Job Compatibility ────────────────────────────────────────────────────────

function JobCompatibilityCard({ analysis }: { analysis: ResumeAnalysis }) {
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);

  return (
    <SectionCard title="Job Role Compatibility" icon={Target} accent="#8B5CF6" delay={0.4}>
      <div className="space-y-3">
        {analysis.jobRoleCompatibility.map((role, i) => (
          <motion.div
            key={role.role}
            initial={{ opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 + i * 0.08 }}
          >
            <button
              onClick={() => setSelectedIdx(selectedIdx === i ? null : i)}
              className="w-full text-left group"
            >
              <div className="flex items-center gap-3 mb-1.5">
                <span className="text-sm font-medium text-white flex-1">{role.role}</span>
                <span className="text-sm font-display font-bold" style={{ color: role.color }}>
                  <AnimatedNumber value={role.score} suffix="%" delay={i * 0.1} />
                </span>
                <span
                  className="text-[10px] font-medium px-2 py-0.5 rounded-full border"
                  style={{ color: role.color, borderColor: `${role.color}40`, background: `${role.color}15` }}
                >
                  {scoreLabel(role.score)}
                </span>
                <ChevronDown className={`w-4 h-4 text-slate-600 transition-transform duration-300 ${selectedIdx === i ? 'rotate-180' : ''}`} />
              </div>
              <ProgressBar value={role.score} color={role.color} height="h-2" delay={i} />
            </button>

            <AnimatePresence>
              {selectedIdx === i && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden"
                >
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3 p-3 rounded-xl bg-white/[0.02] border border-white/5">
                    <div>
                      <p className="text-[10px] uppercase tracking-wider text-emerald-400 mb-1.5 font-medium">Matched Keywords</p>
                      <div className="flex flex-wrap gap-1.5">
                        {role.matchedKeywords.map(k => (
                          <span key={k} className="text-[10px] px-2 py-0.5 rounded-md bg-emerald-500/10 border border-emerald-500/20 text-emerald-300">{k}</span>
                        ))}
                      </div>
                    </div>
                    <div>
                      <p className="text-[10px] uppercase tracking-wider text-rose-400 mb-1.5 font-medium">Missing Keywords</p>
                      <div className="flex flex-wrap gap-1.5">
                        {role.missingKeywords.map(k => (
                          <span key={k} className="text-[10px] px-2 py-0.5 rounded-md bg-rose-500/10 border border-rose-500/20 text-rose-300">{k}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </div>
    </SectionCard>
  );
}

// ─── Improvement Suggestions ──────────────────────────────────────────────────

function SuggestionsCard({ analysis }: { analysis: ResumeAnalysis }) {
  const [openId, setOpenId] = useState<string | null>(analysis.suggestions[0]?.id ?? null);
  const byPriority = [...analysis.suggestions].sort((a, b) => {
    const order = { critical: 0, high: 1, medium: 2, low: 3 };
    return order[a.priority] - order[b.priority];
  });

  return (
    <SectionCard title="Resume Improvement Suggestions" icon={Lightbulb} accent="#F59E0B" delay={0.45}>
      <div className="space-y-3">
        {byPriority.map((s, i) => (
          <motion.div
            key={s.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 + i * 0.07 }}
            className="rounded-xl border border-white/10 overflow-hidden"
          >
            <button
              onClick={() => setOpenId(openId === s.id ? null : s.id)}
              className="w-full flex items-center gap-3 p-4 text-left hover:bg-white/[0.02] transition-colors"
            >
              <span className={`text-[10px] font-bold uppercase px-2 py-1 rounded-lg border flex-shrink-0 ${priorityBg(s.priority)}`}>
                {s.priority}
              </span>
              <span className="flex-1 text-sm font-medium text-white">{s.title}</span>
              <span className="text-[10px] text-slate-500 capitalize hidden sm:block">{s.category}</span>
              <ChevronDown className={`w-4 h-4 text-slate-500 flex-shrink-0 transition-transform duration-300 ${openId === s.id ? 'rotate-180' : ''}`} />
            </button>
            <AnimatePresence>
              {openId === s.id && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden"
                >
                  <div className="px-4 pb-4 border-t border-white/5 pt-3 space-y-2">
                    <p className="text-sm text-slate-400 leading-relaxed">{s.description}</p>
                    {s.example && (
                      <div className="p-3 rounded-lg bg-white/[0.03] border border-white/10">
                        <p className="text-[10px] uppercase tracking-wider text-slate-600 mb-1 font-medium">Example</p>
                        <p className="text-xs text-slate-300 leading-relaxed font-mono">{s.example}</p>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </div>
    </SectionCard>
  );
}

// ─── Shared Section Card ──────────────────────────────────────────────────────

function SectionCard({
  title,
  icon: Icon,
  accent,
  delay = 0,
  children,
}: {
  title: string;
  icon: React.ElementType;
  accent: string;
  delay?: number;
  children: React.ReactNode;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
      className="glass-card p-5 md:p-6"
    >
      <div className="flex items-center gap-2.5 mb-5">
        <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: `${accent}15`, border: `1px solid ${accent}30` }}>
          <Icon className="w-4 h-4" style={{ color: accent }} />
        </div>
        <h2 className="font-display font-semibold text-white text-sm uppercase tracking-wider">{title}</h2>
      </div>
      {children}
    </motion.div>
  );
}

// ─── Empty State ──────────────────────────────────────────────────────────────

function EmptyState({
  dragOver, onDragOver, onDragLeave, onDrop,
  onBrowse, fileInputRef, onFileInput, onUseMock,
}: {
  dragOver: boolean;
  onDragOver: (e: React.DragEvent) => void;
  onDragLeave: () => void;
  onDrop: (e: React.DragEvent) => void;
  onBrowse: () => void;
  fileInputRef: React.RefObject<HTMLInputElement>;
  onFileInput: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onUseMock: () => void;
}) {
  return (
    <div className="space-y-6">
      <input ref={fileInputRef} type="file" accept=".pdf,.doc,.docx" className="hidden" onChange={onFileInput} />
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        <h1 className="font-display font-bold text-2xl md:text-3xl text-white mb-1">Resume Analyzer</h1>
        <p className="text-sm text-slate-500">Upload your resume to get an AI-powered analysis with scores, skill detection, and actionable improvements.</p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
        onClick={onBrowse}
        className={`relative rounded-2xl border-2 border-dashed cursor-pointer transition-all duration-300 overflow-hidden group
          ${dragOver
            ? 'border-cyan-400 bg-cyan-500/10 scale-[1.01]'
            : 'border-white/15 bg-white/[0.02] hover:border-cyan-500/40 hover:bg-cyan-500/5'
          }`}
      >
        {dragOver && <div className="absolute inset-0 bg-gradient-to-br from-cyan-400/10 via-blue-500/5 to-transparent animate-pulse pointer-events-none" />}
        <div className="relative flex flex-col items-center justify-center gap-5 px-6 py-16 text-center">
          <motion.div animate={dragOver ? { scale: 1.15, rotate: -5 } : { scale: 1, rotate: 0 }} transition={{ type: 'spring', stiffness: 300 }} className="relative">
            <div className="absolute inset-0 rounded-full blur-2xl opacity-30 bg-gradient-radial from-cyan-400 to-blue-600" />
            <div className="relative w-20 h-20 rounded-3xl bg-gradient-to-br from-cyan-500/20 to-blue-600/20 border border-cyan-500/30 flex items-center justify-center">
              <Upload className={`w-9 h-9 transition-colors duration-300 ${dragOver ? 'text-cyan-300' : 'text-cyan-500'}`} />
            </div>
          </motion.div>
          <div>
            <p className="font-display font-semibold text-xl text-white mb-2">
              {dragOver ? 'Drop your resume here' : 'Upload your resume'}
            </p>
            <p className="text-slate-500 text-sm">Drag & drop or click to browse • PDF, DOC, DOCX • Max 5 MB</p>
          </div>
          <div className="flex items-center gap-3">
            <span className="px-5 py-2.5 rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 text-white text-sm font-semibold shadow-[0_0_20px_rgba(6,182,212,0.4)] group-hover:shadow-[0_0_35px_rgba(6,182,212,0.6)] transition-all duration-300">
              Browse Files
            </span>
            <span className="text-sm text-slate-600">or</span>
            <button
              onClick={(e) => { e.stopPropagation(); onUseMock(); }}
              className="px-5 py-2.5 rounded-full text-sm font-medium text-cyan-300 border border-cyan-500/30 hover:border-cyan-400/60 hover:bg-cyan-500/10 transition-all duration-300"
            >
              Load Demo Analysis
            </button>
          </div>
        </div>
      </motion.div>

      {/* Feature preview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { icon: ShieldCheck, label: 'ATS Score', desc: 'Pass rate check', color: '#10B981' },
          { icon: Code2, label: 'Skill Detection', desc: 'Tech & soft skills', color: '#06B6D4' },
          { icon: Target, label: 'Role Fit', desc: 'Job compatibility', color: '#8B5CF6' },
          { icon: Lightbulb, label: 'Suggestions', desc: 'Actionable tips', color: '#F59E0B' },
        ].map(({ icon: Icon, label, desc, color }, i) => (
          <motion.div
            key={label}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 + i * 0.07 }}
            className="glass-card p-4 text-center"
          >
            <div className="w-10 h-10 rounded-xl mx-auto mb-2 flex items-center justify-center" style={{ background: `${color}15`, border: `1px solid ${color}30` }}>
              <Icon className="w-5 h-5" style={{ color }} />
            </div>
            <p className="text-sm font-medium text-white">{label}</p>
            <p className="text-[10px] text-slate-500 mt-0.5">{desc}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

// ─── Loading States ───────────────────────────────────────────────────────────

function SkeletonLoader() {
  return (
    <div className="space-y-4 animate-pulse">
      <div className="h-10 bg-white/5 rounded-xl w-64" />
      <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-6 gap-3">
        {Array.from({ length: 6 }).map((_, i) => <div key={i} className="h-24 bg-white/5 rounded-2xl" />)}
      </div>
      <div className="h-48 bg-white/5 rounded-2xl" />
      <div className="grid grid-cols-2 gap-4">
        <div className="h-48 bg-white/5 rounded-2xl" />
        <div className="h-48 bg-white/5 rounded-2xl" />
      </div>
    </div>
  );
}

function AnalyzingLoader({ progress }: { progress: number }) {
  const steps = [
    { label: 'Parsing document structure', done: progress > 15 },
    { label: 'Extracting skills & technologies', done: progress > 35 },
    { label: 'Running ATS compatibility check', done: progress > 55 },
    { label: 'Analyzing keyword density', done: progress > 72 },
    { label: 'Computing job role compatibility', done: progress > 85 },
    { label: 'Generating improvement suggestions', done: progress > 95 },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex flex-col items-center justify-center min-h-[60vh] gap-8 px-6"
    >
      {/* Animated ring */}
      <div className="relative w-32 h-32">
        <div className="absolute inset-0 rounded-full opacity-20 blur-2xl bg-cyan-500 animate-pulse" />
        <svg className="w-32 h-32 -rotate-90 relative" viewBox="0 0 128 128">
          <circle cx="64" cy="64" r="56" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="8" />
          <circle
            cx="64" cy="64" r="56"
            fill="none"
            stroke="url(#analyzeGrad)"
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={2 * Math.PI * 56}
            strokeDashoffset={2 * Math.PI * 56 * (1 - progress / 100)}
            className="transition-all duration-200"
          />
          <defs>
            <linearGradient id="analyzeGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#06B6D4" />
              <stop offset="100%" stopColor="#8B5CF6" />
            </linearGradient>
          </defs>
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <Brain className="w-8 h-8 text-cyan-400 animate-pulse" />
          <span className="text-sm font-mono font-bold text-white mt-1">{progress}%</span>
        </div>
      </div>

      <div className="text-center">
        <h2 className="font-display font-bold text-2xl text-white mb-1">Analyzing Resume…</h2>
        <p className="text-sm text-slate-500">AI is scanning your document for insights</p>
      </div>

      {/* Step progress */}
      <div className="w-full max-w-sm space-y-2.5">
        {steps.map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.15 }}
            className="flex items-center gap-3"
          >
            <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-500 ${
              s.done ? 'bg-emerald-500/20 border border-emerald-500/50' : 'bg-white/5 border border-white/10'
            }`}>
              {s.done
                ? <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                : <div className="w-1.5 h-1.5 rounded-full bg-slate-600" />
              }
            </div>
            <span className={`text-sm transition-colors duration-300 ${s.done ? 'text-slate-300' : 'text-slate-600'}`}>
              {s.label}
            </span>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}

function Lightbulb({ className, style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <svg className={className} style={style} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
    </svg>
  );
}

function ShieldCheck({ className, style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <svg className={className} style={style} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
    </svg>
  );
}
