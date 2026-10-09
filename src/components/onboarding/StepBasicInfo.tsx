import { useState, useRef, useEffect } from 'react';
import { GraduationCap, Calendar, ChevronDown, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import type { OnboardingData, EducationLevel } from '@/types/onboarding';
import { Field, TextInput, OptionChip, SelectInput } from './ui';

// The four "known" chips + an Other trigger
const MAIN_LEVELS: EducationLevel[] = ['BCA', 'MCA', 'B.Tech', 'M.Tech'];

// Degrees shown inside the "Other" dropdown
const OTHER_DEGREES = [
  'B.Sc. IT',
  'B.Sc. Computer Science',
  'B.Com',
  'BBA',
  'MBA',
  'B.Sc. Electronics',
  'B.Sc. Mathematics',
  'Diploma in CS',
  'Diploma in IT',
  'B.Sc. Data Science',
  'B.Arch',
  'B.Pharm',
  'B.Sc. Physics',
  'B.Ed',
  'LLB',
  'MBBS',
  'CA / CMA',
  'Other (type below)',
];

export default function StepBasicInfo({
  data,
  update,
  errors,
}: {
  data: OnboardingData;
  update: (patch: Partial<OnboardingData>) => void;
  errors: Record<string, string>;
}) {
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 8 }, (_, i) => String(currentYear + i - 2));

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleOtherChipClick = () => {
    // If a main level is selected, clear it and mark as Other
    if (data.educationLevel !== 'Other') {
      update({ educationLevel: 'Other', customEducation: '' });
    }
    setDropdownOpen((prev) => !prev);
  };

  const selectOtherDegree = (degree: string) => {
    if (degree === 'Other (type below)') {
      update({ customEducation: '' });
    } else {
      update({ customEducation: degree });
    }
    setDropdownOpen(false);
  };

  const isOtherActive = data.educationLevel === 'Other';

  return (
    <div className="space-y-5">
      <Field label="Full Name" error={errors.fullName} htmlFor="fullName">
        <TextInput
          id="fullName"
          value={data.fullName}
          onChange={(v) => update({ fullName: v })}
          placeholder="e.g. Aarav Sharma"
          error={!!errors.fullName}
        />
      </Field>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <Field label="Email" error={errors.email} htmlFor="email">
          <TextInput
            id="email"
            type="email"
            value={data.email}
            onChange={(v) => update({ email: v })}
            placeholder="you@example.com"
            error={!!errors.email}
          />
        </Field>
        <Field label="Phone Number" optional error={errors.phone} htmlFor="phone">
          <TextInput
            id="phone"
            value={data.phone}
            onChange={(v) => update({ phone: v })}
            placeholder="+91 98765 43210"
            error={!!errors.phone}
          />
        </Field>
      </div>

      {/* Education Level */}
      <Field label="Current Education Level" error={errors.educationLevel}>
        <div className="flex flex-wrap gap-2.5">
          {/* Known degree chips */}
          {MAIN_LEVELS.map((level) => (
            <OptionChip
              key={level}
              label={level}
              selected={data.educationLevel === level}
              onClick={() => update({ educationLevel: level, customEducation: '' })}
              icon={<GraduationCap className="w-3.5 h-3.5" />}
            />
          ))}

          {/* "Other" chip with dropdown trigger */}
          <div className="relative" ref={dropdownRef}>
            <button
              type="button"
              onClick={handleOtherChipClick}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-medium transition-all duration-300 ${
                isOtherActive
                  ? 'bg-cyan-500/15 border-cyan-500/50 text-cyan-300 shadow-[0_0_15px_rgba(6,182,212,0.2)]'
                  : 'bg-white/[0.02] border-white/10 text-slate-400 hover:border-white/20 hover:text-slate-200'
              }`}
            >
              <GraduationCap className="w-3.5 h-3.5" />
              {isOtherActive && data.customEducation && data.customEducation !== ''
                ? data.customEducation
                : 'Other'}
              <ChevronDown
                className={`w-3.5 h-3.5 transition-transform duration-200 ${dropdownOpen ? 'rotate-180' : ''}`}
              />
            </button>

            {/* Dropdown panel */}
            <AnimatePresence>
              {dropdownOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -6, scale: 0.97 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -6, scale: 0.97 }}
                  transition={{ duration: 0.18, ease: 'easeOut' }}
                  className="absolute left-0 top-full mt-2 z-30 w-64 backdrop-blur-xl bg-[#090A0F]/95 border border-white/10 rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.6)] overflow-hidden"
                >
                  {/* Accent line */}
                  <div className="h-px bg-gradient-to-r from-transparent via-cyan-500/40 to-transparent" />

                  <div className="p-2 max-h-56 overflow-y-auto">
                    {OTHER_DEGREES.map((degree) => {
                      const isSelected = data.customEducation === degree ||
                        (degree === 'Other (type below)' && isOtherActive && !OTHER_DEGREES.slice(0, -1).includes(data.customEducation ?? ''));
                      return (
                        <button
                          key={degree}
                          type="button"
                          onClick={() => selectOtherDegree(degree)}
                          className={`w-full flex items-center justify-between gap-2 px-3.5 py-2.5 rounded-xl text-sm text-left transition-all duration-200 ${
                            isSelected
                              ? 'bg-cyan-500/15 text-cyan-300'
                              : 'text-slate-400 hover:bg-white/5 hover:text-white'
                          }`}
                        >
                          <span>{degree}</span>
                          {isSelected && <Check className="w-3.5 h-3.5 text-cyan-400 flex-shrink-0" />}
                        </button>
                      );
                    })}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Custom text input when "Other (type below)" is chosen or no preset matches */}
        <AnimatePresence>
          {isOtherActive && (
            data.customEducation === '' ||
            data.customEducation === undefined ||
            !OTHER_DEGREES.slice(0, -1).includes(data.customEducation ?? '')
          ) && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.25 }}
              className="mt-3 overflow-hidden"
            >
              <input
                type="text"
                value={OTHER_DEGREES.slice(0, -1).includes(data.customEducation ?? '') ? '' : (data.customEducation ?? '')}
                onChange={(e) => update({ customEducation: e.target.value })}
                placeholder="Type your degree or programme name…"
                className="w-full px-4 py-3 rounded-xl bg-white/[0.03] border border-white/10 text-sm text-white placeholder:text-slate-600 outline-none focus:border-cyan-500/50 focus:bg-white/[0.05] transition-all duration-300"
              />
            </motion.div>
          )}
        </AnimatePresence>
      </Field>

      <Field
        label="Graduation / Expected Graduation Year"
        error={errors.graduationYear}
        htmlFor="graduationYear"
      >
        <SelectInput
          id="graduationYear"
          value={data.graduationYear}
          onChange={(v) => update({ graduationYear: v })}
          placeholder="Select year"
          options={years}
          error={!!errors.graduationYear}
          icon={<Calendar className="w-4 h-4" />}
        />
      </Field>
    </div>
  );
}
