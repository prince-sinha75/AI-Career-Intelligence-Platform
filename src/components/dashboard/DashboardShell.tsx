import { useState, type ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Brain,
  LayoutDashboard,
  Target,
  Zap,
  Briefcase,
  Route,
  Mic,
  BarChart3,
  FileText,
  LogOut,
  Bell,
  Search,
  Menu,
  X,
  Settings,
} from 'lucide-react';
import type { DashboardData } from '@/types/dashboard';
import { useToast } from './Toast';

export type DashPage =
  | 'overview'
  | 'analysis'
  | 'matches'
  | 'skills'
  | 'jobs'
  | 'roadmap'
  | 'interview'
  | 'analytics'
  | 'resume';

const navItems: { id: DashPage; label: string; icon: typeof LayoutDashboard }[] = [
  { id: 'overview',  label: 'Overview',        icon: LayoutDashboard },
  { id: 'analysis',  label: 'Career Analysis',  icon: Target },
  { id: 'resume',    label: 'Resume Analyzer',  icon: FileText },
  { id: 'matches',   label: 'Career Matches',   icon: Target },
  { id: 'skills',    label: 'Skill Gaps',       icon: Zap },
  { id: 'jobs',      label: 'Jobs',             icon: Briefcase },
  { id: 'roadmap',   label: 'Roadmap',          icon: Route },
  { id: 'interview', label: 'Interviews',       icon: Mic },
  { id: 'analytics', label: 'Analytics',        icon: BarChart3 },
];

export default function DashboardShell({
  data,
  activePage,
  onNavigate,
  onExit,
  children,
}: {
  data: DashboardData;
  activePage: DashPage;
  onNavigate: (page: DashPage) => void;
  onExit: () => void;
  children: ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { toast } = useToast();

  const firstName = data.user.name.split(' ')[0] || 'there';
  const initials = data.user.name
    .split(' ')
    .map((n) => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase() || 'U';

  const handleNav = (page: DashPage) => {
    onNavigate(page);
    setSidebarOpen(false);
  };

  return (
    <div className="min-h-screen flex">
      {/* Mobile overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSidebarOpen(false)}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-30 lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <aside
        className={`fixed lg:sticky top-0 left-0 h-screen w-64 z-40 flex flex-col bg-onyx/80 backdrop-blur-xl border-r border-white/10 transition-transform duration-300 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="flex items-center gap-2 px-5 py-5 border-b border-white/5">
          <div className="relative">
            <div className="absolute inset-0 bg-cyan-500/40 blur-md rounded-full" />
            <div className="relative w-8 h-8 rounded-full bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center">
              <Brain className="w-4 h-4 text-white" />
            </div>
          </div>
          <span className="font-display font-bold text-lg text-white tracking-tight">
            Career<span className="text-cyan-400">IQ</span>
          </span>
          <button onClick={() => setSidebarOpen(false)} className="ml-auto lg:hidden text-slate-400">
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = activePage === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNav(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 ${
                  active
                    ? 'bg-cyan-500/10 border border-cyan-500/30 text-cyan-300'
                    : 'text-slate-400 hover:text-white hover:bg-white/5 border border-transparent'
                }`}
              >
                <Icon className="w-4 h-4 flex-shrink-0" />
                {item.label}
                {active && <span className="ml-auto w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />}
              </button>
            );
          })}
        </nav>

        <div className="px-3 py-4 border-t border-white/5 space-y-1">
          <button
            onClick={() => toast('Settings coming soon', 'info')}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-slate-400 hover:text-white hover:bg-white/5 transition-all duration-300"
          >
            <Settings className="w-4 h-4" />
            Settings
          </button>
          <button
            onClick={onExit}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-slate-400 hover:text-rose-400 hover:bg-rose-500/5 transition-all duration-300"
          >
            <LogOut className="w-4 h-4" />
            Back to Home
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 min-w-0 flex flex-col">
        <header className="sticky top-0 z-20 flex items-center gap-4 px-4 md:px-6 py-3.5 bg-onyx-deep/80 backdrop-blur-xl border-b border-white/5">
          <button onClick={() => setSidebarOpen(true)} className="lg:hidden text-slate-400">
            <Menu className="w-5 h-5" />
          </button>

          <div className="hidden md:flex items-center gap-2 flex-1 max-w-md">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600" />
              <input
                type="text"
                placeholder="Search jobs, skills, resources..."
                className="w-full pl-9 pr-4 py-2 rounded-xl bg-white/[0.03] border border-white/10 text-sm text-white placeholder:text-slate-600 outline-none focus:border-cyan-500/30 transition-all duration-300"
              />
            </div>
          </div>

          <div className="flex items-center gap-3 ml-auto">
            <button
              onClick={() => toast('You have 3 new job matches available', 'info')}
              className="relative w-9 h-9 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-slate-400 hover:text-white hover:border-white/20 transition-all duration-300"
            >
              <Bell className="w-4 h-4" />
              <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
            </button>
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-xs font-bold text-white">
                {initials}
              </div>
              <div className="hidden sm:block">
                <div className="text-sm font-medium text-white">{firstName}</div>
                <div className="text-[10px] text-slate-500">{data.user.educationLevel || 'Student'}</div>
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 p-4 md:p-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={activePage}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}
