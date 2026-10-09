import { useState, useRef, useEffect } from 'react';
import { Briefcase, Building2, Clock, ChevronDown, Check, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import type { OnboardingData, WorkType, ExperienceLevel } from '@/types/onboarding';
import { TARGET_ROLES, OTHER_CAREER_ROLES } from '@/types/onboarding';
import { Field, OptionChip } from './ui';

const workTypes: WorkType[] = ['Remote', 'Hybrid', 'On-site'];
const experienceLevels: ExperienceLevel[] = ['Fresher', 'Beginner', 'Intermediate'];

// Roles shown as regular chips (everything except 'Other')
const MAIN_ROLES = TARGET_ROLES.filter((r) => r !== 'Other');

export default function StepCareerPrefs({
  data,
  update,
  errors,
}: {
  data: OnboardingData;
  update: (patch: Partial<OnboardingData>) => void;
  errors: Record<string, string>;
}) {
  const [otherDropdownOpen, setOtherDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOtherDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const toggleRole = (role: string) => {
    const roles = data.targetRoles.includes(role)
      ? data.targetRoles.filter((r) => r !== role)
      : [...data.targetRoles, role];
    update({ targetRoles: roles });
  };

  // Roles the user picked from the OTHER_CAREER_ROLES list
  const selectedOtherRoles = data.targetRoles.filter((r) => OTHER_CAREER_ROLES.includes(r));
  const hasOtherSelections = selectedOtherRoles.length > 0;

  return (
    <div className="space-y-5">
      {/* Target Career Roles */}
      <Field label="Target Career Role" error={errors.targetRoles}>
        <p className="text-xs text-slate-500 mb-3">
          Select all roles you're interested in.
        </p>

        <div className="flex flex-wrap gap-2.5">
          {/* Main role chips */}
          {MAIN_ROLES.map((role) => (
            <OptionChip
              key={role}
              label={role}
              selected={data.targetRoles.includes(role)}
              onClick={() => toggleRole(role)}
              icon={<Briefcase className="w-3.5 h-3.5" />}
            />
          ))}

          {/* "Other" dropdown chip */}
          <div className="relative" ref={dropdownRef}>
            <button
              type="button"
              onClick={() => setOtherDropdownOpen((p) => !p)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-medium transition-all duration-300 ${
                hasOtherSelections
                  ? 'bg-cyan-500/15 border-cyan-500/50 text-cyan-300 shadow-[0_0_15px_rgba(6,182,212,0.2)]'
                  : 'bg-white/[0.02] border-white/10 text-slate-400 hover:border-white/20 hover:text-slate-200'
              }`}
            >
              <Briefcase className="w-3.5 h-3.5" />
              Other
              {hasOtherSelections && (
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-cyan-500/30 text-cyan-200">
                  {selectedOtherRoles.length}
                </span>
              )}
              <ChevronDown
                className={`w-3.5 h-3.5 transition-transform duration-200 ${otherDropdownOpen ? 'rotate-180' : ''}`}
              />
            </button>

            {/* Dropdown panel */}
            <AnimatePresence>
              {otherDropdownOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -6, scale: 0.97 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -6, scale: 0.97 }}
                  transition={{ duration: 0.18, ease: 'easeOut' }}
                  className="absolute left-0 top-full mt-2 z-30 w-72 backdrop-blur-xl bg-[#090A0F]/95 border border-white/10 rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.6)] overflow-hidden"
                >
                  {/* Accent line */}
                  <div className="h-px bg-gradient-to-r from-transparent via-cyan-500/40 to-transparent" />

                  <div className="p-2 max-h-64 overflow-y-auto">
                    {OTHER_CAREER_ROLES.map((role) => {
                      const selected = data.targetRoles.includes(role);
                      return (
                        <button
                          key={role}
                          type="button"
                          onClick={() => toggleRole(role)}
                          className={`w-full flex items-center justify-between gap-2 px-3.5 py-2.5 rounded-xl text-sm text-left transition-all duration-200 ${
                            selected
                              ? 'bg-cyan-500/15 text-cyan-300'
                              : 'text-slate-400 hover:bg-white/5 hover:text-white'
                          }`}
                        >
                          <span>{role}</span>
                          {selected && <Check className="w-3.5 h-3.5 text-cyan-400 flex-shrink-0" />}
                        </button>
                      );
                    })}
                  </div>

                  {/* Footer hint */}
                  <div className="px-4 py-2.5 border-t border-white/5">
                    <p className="text-[10px] text-slate-600">Click a role to select / deselect it.</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Selected "Other" role tags */}
        <AnimatePresence>
          {hasOtherSelections && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.22 }}
              className="overflow-hidden"
            >
              <div className="flex flex-wrap gap-2 mt-3 pt-3 border-t border-white/5">
                {selectedOtherRoles.map((role) => (
                  <span
                    key={role}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-xs font-medium text-cyan-300"
                  >
                    {role}
                    <button
                      type="button"
                      onClick={() => toggleRole(role)}
                      className="hover:text-white transition-colors"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </Field>

      {/* Preferred Industry */}
      <Field
        label="Preferred Industry"
        error={errors.preferredIndustry}
        htmlFor="preferredIndustry"
      >
        <div className="relative">
          <Building2 className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
          <input
            id="preferredIndustry"
            type="text"
            value={data.preferredIndustry}
            onChange={(e) => update({ preferredIndustry: e.target.value })}
            placeholder="e.g. Fintech, Healthcare, SaaS"
            className={`w-full pl-10 pr-4 py-3 rounded-xl bg-white/[0.03] border text-sm text-white placeholder:text-slate-600 outline-none transition-all duration-300 ${
              errors.preferredIndustry
                ? 'border-rose-500/50 focus:border-rose-400'
                : 'border-white/10 focus:border-cyan-500/50 focus:bg-white/[0.05]'
            }`}
          />
        </div>
      </Field>

      {/* Preferred Work Type */}
      <Field label="Preferred Work Type" error={errors.workType}>
        <div className="flex flex-wrap gap-2.5">
          {workTypes.map((wt) => (
            <OptionChip
              key={wt}
              label={wt}
              selected={data.workType === wt}
              onClick={() => update({ workType: wt })}
            />
          ))}
        </div>
      </Field>

      {/* Experience Level */}
      <Field label="Experience Level" error={errors.experienceLevel}>
        <div className="flex flex-wrap gap-2.5">
          {experienceLevels.map((el) => (
            <OptionChip
              key={el}
              label={el}
              selected={data.experienceLevel === el}
              onClick={() => update({ experienceLevel: el })}
              icon={<Clock className="w-3.5 h-3.5" />}
            />
          ))}
        </div>
      </Field>
    </div>
  );
}
