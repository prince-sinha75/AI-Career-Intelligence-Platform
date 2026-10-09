import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Briefcase, MapPin, Clock, ExternalLink, Bookmark, Search, Filter, CheckCircle2, XCircle, X } from 'lucide-react';
import type { DashboardData, JobRecommendation } from '@/types/dashboard';
import { PageHeader } from './AnalysisPage';
import { useToast } from '../Toast';
import Modal from '../Modal';

export default function JobsPage({ data }: { data: DashboardData }) {
  const [selected, setSelected] = useState<JobRecommendation | null>(null);
  const [saved, setSaved] = useState<Set<string>>(new Set());
  const [searchQuery, setSearchQuery] = useState('');
  const [filterRole, setFilterRole] = useState('');
  const [filterLocation, setFilterLocation] = useState('');
  const [filterExp, setFilterExp] = useState('');
  const [filterMatch, setFilterMatch] = useState('');
  const { toast } = useToast();

  const roles = useMemo(() => [...new Set(data.jobs.map((j) => j.title))], [data.jobs]);
  const locations = useMemo(() => [...new Set(data.jobs.map((j) => j.location))], [data.jobs]);
  const experiences = useMemo(() => [...new Set(data.jobs.map((j) => j.experience))], [data.jobs]);
  const matchRanges = ['90%+', '80%+', '70%+'];

  const filteredJobs = useMemo(() => {
    return data.jobs.filter((job) => {
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        if (!job.title.toLowerCase().includes(q) && !job.company.toLowerCase().includes(q) && !job.skills.some((s) => s.toLowerCase().includes(q))) return false;
      }
      if (filterRole && job.title !== filterRole) return false;
      if (filterLocation && job.location !== filterLocation) return false;
      if (filterExp && job.experience !== filterExp) return false;
      if (filterMatch === '90+' && job.match < 90) return false;
      if (filterMatch === '80+' && job.match < 80) return false;
      if (filterMatch === '70+' && job.match < 70) return false;
      return true;
    });
  }, [data.jobs, searchQuery, filterRole, filterLocation, filterExp, filterMatch]);

  const toggleSave = (id: string) => {
    setSaved((prev) => {
      const next = new Set(prev);
      if (next.has(id)) { next.delete(id); toast('Removed from saved jobs', 'info'); }
      else { next.add(id); toast('Job saved to your list'); }
      return next;
    });
  };

  const clearFilters = () => {
    setSearchQuery(''); setFilterRole(''); setFilterLocation(''); setFilterExp(''); setFilterMatch('');
  };

  const hasFilters = searchQuery || filterRole || filterLocation || filterExp || filterMatch;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Recommended Jobs"
        subtitle={`${filteredJobs.length} of ${data.jobs.length} openings matched`}
        icon={<Briefcase className="w-5 h-5 text-emerald-400" />}
      />

      {/* Search + Filters */}
      <div className="glass-card p-4 space-y-3">
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by title, company, or skill..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/[0.03] border border-white/10 text-sm text-white placeholder:text-slate-600 outline-none focus:border-cyan-500/30 transition-all duration-300"
          />
        </div>

        <div className="flex flex-wrap gap-2">
          <FilterSelect label="Role" value={filterRole} options={roles} onChange={setFilterRole} />
          <FilterSelect label="Location" value={filterLocation} options={locations} onChange={setFilterLocation} />
          <FilterSelect label="Experience" value={filterExp} options={experiences} onChange={setFilterExp} />
          <FilterSelect label="Match" value={filterMatch} options={matchRanges} onChange={setFilterMatch} />
          {hasFilters && (
            <button
              onClick={clearFilters}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs text-slate-400 hover:text-rose-400 transition-colors border border-white/10"
            >
              <X className="w-3 h-3" /> Clear
            </button>
          )}
        </div>
      </div>

      {/* Job cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <AnimatePresence mode="popLayout">
          {filteredJobs.map((job, i) => (
            <motion.div
              key={job.id}
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ delay: i * 0.05 }}
              className="glass-card glass-card-hover p-5 cursor-pointer group"
              onClick={() => setSelected(job)}
            >
              <div className="flex items-start gap-3 mb-3">
                <div className="w-11 h-11 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-xl flex-shrink-0">
                  {job.logo}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-semibold text-white group-hover:text-emerald-300 transition-colors truncate">{job.title}</div>
                  <div className="text-xs text-slate-500">{job.company} • {job.posted}</div>
                </div>
                <button
                  onClick={(e) => { e.stopPropagation(); toggleSave(job.id); }}
                  className={`flex-shrink-0 transition-all duration-300 ${saved.has(job.id) ? 'text-cyan-400' : 'text-slate-600 hover:text-slate-400'}`}
                >
                  <Bookmark className={`w-4 h-4 ${saved.has(job.id) ? 'fill-cyan-400' : ''}`} />
                </button>
              </div>

              <div className="flex items-center gap-3 text-xs text-slate-500 mb-3">
                <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{job.location}</span>
                <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{job.type}</span>
                <span className="text-slate-400">{job.experience}</span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs">
                  <span className="text-emerald-400 flex items-center gap-0.5"><CheckCircle2 className="w-3 h-3" />{job.matchingSkills.length}</span>
                  <span className="text-rose-400 flex items-center gap-0.5"><XCircle className="w-3 h-3" />{job.missingSkills.length}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-cyan-400 font-mono text-xs">{job.salary}</span>
                  <div className="text-lg font-display font-bold text-emerald-400">{job.match}%</div>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {filteredJobs.length === 0 && (
        <div className="glass-card p-12 text-center">
          <Filter className="w-8 h-8 text-slate-600 mx-auto mb-3" />
          <p className="text-sm text-slate-500">No jobs match your filters. Try clearing them.</p>
        </div>
      )}

      {/* Job detail modal */}
      <Modal
        open={!!selected}
        onClose={() => setSelected(null)}
        title={selected?.title || ''}
        subtitle={`${selected?.company} • ${selected?.posted}`}
        icon={Briefcase}
        accent="#10B981"
      >
        {selected && (
          <div className="space-y-5">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-3 rounded-xl bg-white/[0.02] border border-white/10 text-center">
                <div className="text-xl font-display font-bold text-emerald-400">{selected.match}%</div>
                <div className="text-[10px] text-slate-500 uppercase">Match</div>
              </div>
              <div className="p-3 rounded-xl bg-white/[0.02] border border-white/10 text-center">
                <div className="text-xl font-display font-bold text-white">{selected.salary}</div>
                <div className="text-[10px] text-slate-500 uppercase">Salary</div>
              </div>
              <div className="p-3 rounded-xl bg-white/[0.02] border border-white/10 text-center">
                <div className="text-xl font-display font-bold text-white">{selected.location}</div>
                <div className="text-[10px] text-slate-500 uppercase">Location</div>
              </div>
              <div className="p-3 rounded-xl bg-white/[0.02] border border-white/10 text-center">
                <div className="text-xl font-display font-bold text-white">{selected.experience}</div>
                <div className="text-[10px] text-slate-500 uppercase">Experience</div>
              </div>
            </div>

            <p className="text-sm text-slate-400 leading-relaxed">{selected.description}</p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <div className="text-xs text-emerald-400 uppercase tracking-wider mb-2 flex items-center gap-1"><CheckCircle2 className="w-3 h-3" /> Matching Skills</div>
                <div className="flex flex-wrap gap-2">
                  {selected.matchingSkills.length > 0 ? selected.matchingSkills.map((s) => (
                    <span key={s} className="text-[10px] font-mono px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-300">{s}</span>
                  )) : <span className="text-xs text-slate-600">None</span>}
                </div>
              </div>
              <div>
                <div className="text-xs text-rose-400 uppercase tracking-wider mb-2 flex items-center gap-1"><XCircle className="w-3 h-3" /> Missing Skills</div>
                <div className="flex flex-wrap gap-2">
                  {selected.missingSkills.length > 0 ? selected.missingSkills.map((s) => (
                    <span key={s} className="text-[10px] font-mono px-2.5 py-1 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-300">{s}</span>
                  )) : <span className="text-xs text-slate-600">None — perfect match!</span>}
                </div>
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                onClick={() => { toast(`Applied to ${selected.title} at ${selected.company}`); setSelected(null); }}
                className="glow-button flex items-center gap-2 text-sm"
              >
                Apply Now <ExternalLink className="w-4 h-4" />
              </button>
              <button
                onClick={() => toggleSave(selected.id)}
                className="glow-border-button text-sm flex items-center gap-2"
              >
                <Bookmark className={`w-4 h-4 ${saved.has(selected.id) ? 'fill-cyan-400 text-cyan-400' : ''}`} />
                {saved.has(selected.id) ? 'Saved' : 'Save'}
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}

function FilterSelect({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: string[];
  onChange: (v: string) => void;
}) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="px-3 py-2 rounded-xl bg-white/[0.03] border border-white/10 text-xs text-slate-300 outline-none cursor-pointer focus:border-cyan-500/30 transition-all appearance-none"
    >
      <option value="" className="bg-onyx-deep">{label}: All</option>
      {options.map((opt) => (
        <option key={opt} value={opt === '90%+' ? '90+' : opt === '80%+' ? '80+' : opt === '70%+' ? '70+' : opt} className="bg-onyx-deep">{opt}</option>
      ))}
    </select>
  );
}
