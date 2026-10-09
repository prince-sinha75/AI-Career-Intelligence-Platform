import { useState } from 'react';
import { Plus, X, Sparkles } from 'lucide-react';
import type { OnboardingData } from '@/types/onboarding';
import { Field } from './ui';

// ─── Categorised skill suggestions ─────────────────────────────────────────

const SKILL_CATEGORIES = [
  {
    label: 'Programming',
    skills: ['Python', 'Java', 'JavaScript', 'TypeScript', 'C++', 'C#', 'Go', 'PHP', 'R', 'Rust'],
  },
  {
    label: 'Web & Mobile',
    skills: ['React', 'Vue.js', 'Angular', 'Node.js', 'Next.js', 'HTML', 'CSS', 'React Native', 'Flutter'],
  },
  {
    label: 'Data & AI',
    skills: ['Machine Learning', 'Data Science', 'Deep Learning', 'SQL', 'MongoDB', 'Data Analysis', 'TensorFlow', 'PyTorch', 'Pandas', 'Power BI', 'Tableau'],
  },
  {
    label: 'Cloud & DevOps',
    skills: ['AWS', 'Azure', 'GCP', 'Docker', 'Kubernetes', 'CI/CD', 'Linux'],
  },
  {
    label: 'Tools',
    skills: ['Git', 'GitHub', 'Figma', 'Jira', 'Postman', 'VS Code'],
  },
  {
    label: 'Design',
    skills: ['UI/UX Design', 'Graphic Design', 'Canva', 'Adobe XD', 'Wireframing'],
  },
  {
    label: 'Business & Other',
    skills: ['MS Excel', 'Business Analysis', 'Digital Marketing', 'SEO', 'Content Writing', 'Project Management', 'Accounting', 'Communication', 'Problem Solving', 'Leadership', 'Critical Thinking'],
  },
];

// ─── Component ──────────────────────────────────────────────────────────────

export default function StepSkills({
  data,
  update,
  errors,
}: {
  data: OnboardingData;
  update: (patch: Partial<OnboardingData>) => void;
  errors: Record<string, string>;
}) {
  const [customSkill, setCustomSkill] = useState('');
  const [activeCategory, setActiveCategory] = useState(SKILL_CATEGORIES[0].label);

  const toggleSkill = (skill: string) => {
    const skills = data.skills.includes(skill)
      ? data.skills.filter((s) => s !== skill)
      : [...data.skills, skill];
    update({ skills });
  };

  const addCustomSkill = () => {
    const trimmed = customSkill.trim();
    if (trimmed && !data.skills.includes(trimmed)) {
      update({ skills: [...data.skills, trimmed] });
    }
    setCustomSkill('');
  };

  const removeSkill = (skill: string) => {
    update({ skills: data.skills.filter((s) => s !== skill) });
  };

  const currentSkills =
    SKILL_CATEGORIES.find((c) => c.label === activeCategory)?.skills ?? [];

  return (
    <div className="space-y-5">
      <Field label="Your Current Skills" error={errors.skills}>
        <p className="text-xs text-slate-500 mb-3">
          Select from any category or add your own. Choose at least 3.
        </p>

        {/* Category tabs */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          {SKILL_CATEGORIES.map((cat) => {
            const selectedCount = cat.skills.filter((s) => data.skills.includes(s)).length;
            const isActive = activeCategory === cat.label;
            return (
              <button
                key={cat.label}
                type="button"
                onClick={() => setActiveCategory(cat.label)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-medium transition-all duration-200 ${
                  isActive
                    ? 'bg-cyan-500/15 border-cyan-500/50 text-cyan-300'
                    : 'bg-white/[0.02] border-white/10 text-slate-400 hover:border-white/20 hover:text-slate-200'
                }`}
              >
                {cat.label}
                {selectedCount > 0 && (
                  <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                    isActive ? 'bg-cyan-500/30 text-cyan-200' : 'bg-white/10 text-slate-400'
                  }`}>
                    {selectedCount}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Skills for active category */}
        <div className="flex flex-wrap gap-2.5 mb-4">
          {currentSkills.map((skill) => {
            const selected = data.skills.includes(skill);
            return (
              <button
                key={skill}
                type="button"
                onClick={() => toggleSkill(skill)}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg border text-xs font-medium transition-all duration-300 ${
                  selected
                    ? 'bg-cyan-500/15 border-cyan-500/50 text-cyan-300'
                    : 'bg-white/[0.02] border-white/10 text-slate-400 hover:border-white/20 hover:text-slate-200'
                }`}
              >
                {selected && <Sparkles className="w-3 h-3" />}
                {skill}
              </button>
            );
          })}
        </div>

        {/* Custom skill input */}
        <div className="flex gap-2.5">
          <input
            type="text"
            value={customSkill}
            onChange={(e) => setCustomSkill(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                addCustomSkill();
              }
            }}
            placeholder="Add a custom skill..."
            className="flex-1 px-4 py-2.5 rounded-xl bg-white/[0.03] border border-white/10 text-sm text-white placeholder:text-slate-600 outline-none focus:border-cyan-500/50 transition-all duration-300"
          />
          <button
            type="button"
            onClick={addCustomSkill}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-white/[0.05] border border-white/10 text-sm text-slate-300 hover:border-cyan-500/30 hover:text-cyan-300 transition-all duration-300"
          >
            <Plus className="w-4 h-4" />
            Add
          </button>
        </div>

        {/* Selected skills */}
        {data.skills.length > 0 && (
          <div className="mt-5">
            <p className="text-xs text-slate-500 uppercase tracking-wider mb-2.5">
              Selected ({data.skills.length})
            </p>
            <div className="flex flex-wrap gap-2">
              {data.skills.map((skill) => (
                <span
                  key={skill}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-xs font-medium text-cyan-300"
                >
                  {skill}
                  <button
                    type="button"
                    onClick={() => removeSkill(skill)}
                    className="hover:text-white transition-colors"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
          </div>
        )}
      </Field>
    </div>
  );
}
