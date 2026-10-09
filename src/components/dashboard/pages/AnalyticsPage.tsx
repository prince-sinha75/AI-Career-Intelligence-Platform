import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { BarChart3, TrendingUp, TrendingDown, Lightbulb, ArrowRight } from 'lucide-react';
import type { DashboardData } from '@/types/dashboard';
import { PageHeader } from './AnalysisPage';
import { LineChart, AnimatedNumber, ProgressBar } from '../Charts';
import { useToast } from '../Toast';

type TimeFilter = '1M' | '3M' | '6M' | '1Y';

const filterLabels: Record<TimeFilter, string> = {
  '1M': '1 Month',
  '3M': '3 Months',
  '6M': '6 Months',
  '1Y': '1 Year',
};

export default function AnalyticsPage({
  data,
  onNavigate,
}: {
  data: DashboardData;
  onNavigate: (page: 'roadmap' | 'interview') => void;
}) {
  const [timeFilter, setTimeFilter] = useState<TimeFilter>('3M');
  const { toast } = useToast();

  // Generate extended data for different time ranges
  const chartData = useMemo(() => {
    const base = data.analytics;
    if (timeFilter === '1M') return base.slice(-1);
    if (timeFilter === '3M') return base.slice(-3);
    if (timeFilter === '6M') {
      return [
        { label: 'Apr', readiness: 40, skills: 28, interview: 35, resume: 42 },
        { label: 'May', readiness: 44, skills: 32, interview: 38, resume: 46 },
        ...base,
      ];
    }
    // 1Y
    return [
      { label: 'Jan', readiness: 30, skills: 20, interview: 25, resume: 32 },
      { label: 'Feb', readiness: 35, skills: 25, interview: 30, resume: 38 },
      { label: 'Mar', readiness: 38, skills: 27, interview: 33, resume: 40 },
      { label: 'Apr', readiness: 40, skills: 28, interview: 35, resume: 42 },
      { label: 'May', readiness: 44, skills: 32, interview: 38, resume: 46 },
      ...base,
    ];
  }, [data.analytics, timeFilter]);

  const latest = chartData[chartData.length - 1];
  const first = chartData[0];
  const readinessDelta = latest.readiness - first.readiness;
  const skillsDelta = latest.skills - first.skills;
  const interviewDelta = latest.interview - first.interview;
  const resumeDelta = latest.resume - first.resume;

  const statCards = [
    { label: 'Readiness', value: latest.readiness, delta: readinessDelta, color: '#06B6D4' },
    { label: 'Skill Growth', value: latest.skills, delta: skillsDelta, color: '#8B5CF6' },
    { label: 'Interview', value: latest.interview, delta: interviewDelta, color: '#10B981' },
    { label: 'Resume', value: latest.resume, delta: resumeDelta, color: '#F59E0B' },
  ];

  const biggestImprovement = statCards.reduce((max, s) => (s.delta > max.delta ? s : max), statCards[0]);
  const biggestWeakness = statCards.reduce((min, s) => (s.value < min.value ? s : min), statCards[0]);

  const insights = [
    {
      icon: TrendingUp,
      color: '#10B981',
      title: 'Biggest Improvement',
      text: `Your ${biggestImprovement.label.toLowerCase()} improved by ${biggestImprovement.delta} points over ${filterLabels[timeFilter].toLowerCase()}. Keep this momentum going!`,
    },
    {
      icon: TrendingDown,
      color: '#EF4444',
      title: 'Biggest Weakness',
      text: `${biggestWeakness.label} is your lowest metric at ${biggestWeakness.value}%. Focus on targeted practice to bring this up.`,
    },
    {
      icon: BarChart3,
      color: '#06B6D4',
      title: 'Current Progress',
      text: `You are at ${latest.readiness}% overall readiness — ${latest.readiness >= 70 ? 'placement-ready for most roles' : latest.readiness >= 50 ? 'on track but needs focused effort' : 'in early stages of preparation'}.`,
    },
    {
      icon: Lightbulb,
      color: '#F59E0B',
      title: 'Recommended Next Action',
      text: data.nextAction.description,
      action: data.nextAction.action,
      actionTarget: data.nextAction.category === 'Skill Development' ? 'roadmap' : 'interview' as 'roadmap' | 'interview',
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Career Analytics"
        subtitle="Track your progress across all dimensions"
        icon={<BarChart3 className="w-5 h-5 text-blue-400" />}
      />

      {/* Time filter */}
      <div className="flex items-center gap-2">
        {(Object.keys(filterLabels) as TimeFilter[]).map((key) => (
          <button
            key={key}
            onClick={() => { setTimeFilter(key); toast(`Showing ${filterLabels[key]} data`, 'info'); }}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 ${
              timeFilter === key
                ? 'bg-cyan-500/15 border border-cyan-500/40 text-cyan-300'
                : 'bg-white/[0.03] border border-white/10 text-slate-400 hover:text-white hover:border-white/20'
            }`}
          >
            {filterLabels[key]}
          </button>
        ))}
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="glass-card p-4"
          >
            <div className="text-xs text-slate-500 uppercase tracking-wider mb-1">{stat.label}</div>
            <div className="text-3xl font-display font-bold text-white">
              <AnimatedNumber value={stat.value} suffix="%" delay={i * 0.1} />
            </div>
            <div className={`text-xs font-mono mt-1 flex items-center gap-1 ${stat.delta >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
              {stat.delta >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
              {stat.delta >= 0 ? '+' : ''}{stat.delta} pts
            </div>
            <div className="mt-2">
              <ProgressBar value={stat.value} color={stat.color} delay={i} height="h-1.5" />
            </div>
          </motion.div>
        ))}
      </div>

      {/* Main chart */}
      <div className="glass-card p-6">
        <h3 className="font-display font-semibold text-white text-sm uppercase tracking-wider mb-4">
          Progress Trend — {filterLabels[timeFilter]}
        </h3>
        <LineChart data={chartData} />
      </div>

      {/* Resume improvement chart */}
      <div className="glass-card p-6">
        <h3 className="font-display font-semibold text-white text-sm uppercase tracking-wider mb-4">Resume Improvement Over Time</h3>
        <div className="space-y-3">
          {chartData.map((point, i) => (
            <motion.div
              key={point.label}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.08 }}
              className="flex items-center gap-4"
            >
              <span className="text-xs font-mono text-slate-500 w-10">{point.label}</span>
              <div className="flex-1">
                <ProgressBar value={point.resume} color="#F59E0B" delay={i} height="h-2" />
              </div>
              <span className="text-xs font-mono text-amber-400 w-10 text-right">{point.resume}%</span>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Insights */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {insights.map((insight, i) => {
          const Icon = insight.icon;
          return (
            <motion.div
              key={insight.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="glass-card p-5"
            >
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 rounded-xl flex items-center justify-center border" style={{ background: `${insight.color}10`, borderColor: `${insight.color}25` }}>
                  <Icon className="w-4 h-4" style={{ color: insight.color }} />
                </div>
                <h4 className="text-sm font-semibold text-white">{insight.title}</h4>
              </div>
              <p className="text-sm text-slate-400 leading-relaxed">{insight.text}</p>
              {insight.action && (
                <button
                  onClick={() => { toast(`Starting: ${data.nextAction.title}`); onNavigate(insight.actionTarget!); }}
                  className="mt-3 flex items-center gap-1.5 text-xs text-cyan-400 hover:text-cyan-300 transition-colors"
                >
                  {insight.action} <ArrowRight className="w-3 h-3" />
                </button>
              )}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
