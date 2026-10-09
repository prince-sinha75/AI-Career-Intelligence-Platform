import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft, ArrowRight, Brain, User, Target,
  Sparkles, CheckCircle2, Upload,
} from 'lucide-react';
import type { OnboardingData } from '@/types/onboarding';
import { initialOnboardingData, ONBOARDING_STORAGE_KEY } from '@/types/onboarding';
import type { ResumeFile } from '@/types/resume';
import { RESUME_STORAGE_KEY } from '@/types/resume';
import { generateMockAnalysis } from '@/data/resumeMockData';
import StepProgress from './StepProgress';
import StepBasicInfo from './StepBasicInfo';
import StepCareerPrefs from './StepCareerPrefs';
import StepSkills from './StepSkill';
import StepUploadResume from './StepUploadResume';
import StepGoals from './StepGoals';

const TOTAL_STEPS = 5;

const stepMeta = [
  { title: 'Basic Information',   subtitle: 'Let us get to know you first.',       icon: User },
  { title: 'Career Preferences',  subtitle: 'Tell us about your dream role.',       icon: Target },
  { title: 'Skills',              subtitle: 'What can you do today?',               icon: Sparkles },
  { title: 'Upload Resume',       subtitle: 'Let AI analyze your resume.',          icon: Upload },
  { title: 'Career Goals',        subtitle: 'Where do you want to go?',             icon: CheckCircle2 },
];

function validateStep(
  step: number,
  data: OnboardingData,
  resumeFile: ResumeFile | null,
): Record<string, string> {
  const errors: Record<string, string> = {};

  if (step === 0) {
    if (!data.fullName.trim()) errors.fullName = 'Please enter your full name.';
    if (!data.email.trim()) {
      errors.email = 'Please enter your email.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
      errors.email = 'Please enter a valid email address.';
    }
    if (data.phone && !/^[+\d\s()-]{7,}$/.test(data.phone)) {
      errors.phone = 'Please enter a valid phone number.';
    }
    if (!data.educationLevel) errors.educationLevel = 'Please select your education level.';
    if (!data.graduationYear) errors.graduationYear = 'Please select your graduation year.';
  }

  if (step === 1) {
    if (data.targetRoles.length === 0)
      errors.targetRoles = 'Please select at least one target role.';
    if (!data.preferredIndustry.trim())
      errors.preferredIndustry = 'Please enter your preferred industry.';
    if (!data.workType) errors.workType = 'Please select a work type.';
    if (!data.experienceLevel) errors.experienceLevel = 'Please select your experience level.';
  }

  if (step === 2) {
    if (data.skills.length < 3)
      errors.skills = 'Please select at least 3 skills.';
  }

  if (step === 3) {
    if (!resumeFile) errors.resume = 'Please upload your resume before continuing.';
  }

  if (step === 4) {
    if (!data.primaryGoal.trim())
      errors.primaryGoal = 'Please describe your primary career goal.';
    if (!data.skillsToImprove.trim())
      errors.skillsToImprove = 'Please list skills you want to improve.';
    if (!data.weeklyHours) errors.weeklyHours = 'Please select weekly hours.';
    if (!data.learningStyle) errors.learningStyle = 'Please select a learning style.';
  }

  return errors;
}

export default function OnboardingWizard({
  onComplete,
}: {
  onComplete: () => void;
}) {
  const [step, setStep] = useState(0);
  const [data, setData] = useState<OnboardingData>(initialOnboardingData);
  const [resumeFile, setResumeFile] = useState<ResumeFile | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(ONBOARDING_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored) as OnboardingData;
        setData({ ...initialOnboardingData, ...parsed });
      }
      // Restore previously saved resume file info
      const storedResume = localStorage.getItem(RESUME_STORAGE_KEY);
      if (storedResume) {
        const parsedResume = JSON.parse(storedResume);
        if (parsedResume?.resumeFile) {
          setResumeFile(parsedResume.resumeFile);
        }
      }
    } catch {
      // ignore parse errors
    }
  }, []);

  // Persist onboarding data to localStorage on every change
  useEffect(() => {
    try {
      localStorage.setItem(ONBOARDING_STORAGE_KEY, JSON.stringify(data));
    } catch {
      // ignore storage errors
    }
  }, [data]);

  const update = useCallback((patch: Partial<OnboardingData>) => {
    setData((prev) => ({ ...prev, ...patch }));
  }, []);

  const handleFileChange = useCallback((file: ResumeFile | null) => {
    setResumeFile(file);
    if (errors.resume) setErrors((prev) => ({ ...prev, resume: '' }));
  }, [errors.resume]);

  const handleNext = () => {
    const stepErrors = validateStep(step, data, resumeFile);
    setErrors(stepErrors);
    if (Object.keys(stepErrors).length > 0) return;

    if (step < TOTAL_STEPS - 1) {
      setStep((s) => s + 1);
    } else {
      // Persist resume analysis to localStorage before completing
      if (resumeFile) {
        try {
          const analysis = generateMockAnalysis(resumeFile);
          localStorage.setItem(RESUME_STORAGE_KEY, JSON.stringify(analysis));
        } catch {
          // ignore storage errors
        }
      }
      // Navigate directly to dashboard — skip success screen
      onComplete();
    }
  };

  const handleBack = () => {
    setErrors({});
    if (step > 0) setStep((s) => s - 1);
  };

  const meta = stepMeta[step];
  const MetaIcon = meta.icon;

  return (
    <div className="relative min-h-screen flex items-center justify-center px-6 py-20">
      {/* Radial glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-cyan-500/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[300px] h-[300px] bg-violet-500/8 rounded-full blur-[100px] pointer-events-none" />

      <div className="relative z-10 w-full max-w-2xl">
        {/* Logo */}
        <div className="flex items-center justify-center gap-2 mb-8">
          <div className="relative">
            <div className="absolute inset-0 bg-cyan-500/40 blur-md rounded-full" />
            <div className="relative w-9 h-9 rounded-full bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center">
              <Brain className="w-5 h-5 text-white" />
            </div>
          </div>
          <span className="font-display font-bold text-xl text-white tracking-tight">
            Career<span className="text-cyan-400">IQ</span>
          </span>
        </div>

        {/* Progress indicator */}
        <StepProgress current={step} total={TOTAL_STEPS} />

        {/* Card */}
        <div className="glass-card p-6 md:p-10">
          {/* Step header */}
          <div className="flex items-center gap-3 mb-6">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 border ${
              step === 3
                ? 'bg-violet-500/10 border-violet-500/30'
                : 'bg-cyan-500/10 border-cyan-500/30'
            }`}>
              <MetaIcon className={`w-5 h-5 ${step === 3 ? 'text-violet-400' : 'text-cyan-400'}`} />
            </div>
            <div>
              <h2 className="font-display font-semibold text-lg text-white">
                {meta.title}
              </h2>
              <p className="text-xs text-slate-500">{meta.subtitle}</p>
            </div>
            <div className="ml-auto text-xs font-mono text-slate-600">
              {step + 1} of {TOTAL_STEPS}
            </div>
          </div>

          {/* Step content with slide animation */}
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
            >
              {step === 0 && <StepBasicInfo data={data} update={update} errors={errors} />}
              {step === 1 && <StepCareerPrefs data={data} update={update} errors={errors} />}
              {step === 2 && <StepSkills data={data} update={update} errors={errors} />}
              {step === 3 && (
                <StepUploadResume
                  resumeFile={resumeFile}
                  onFileChange={handleFileChange}
                  error={errors.resume}
                />
              )}
              {step === 4 && <StepGoals data={data} update={update} errors={errors} />}
            </motion.div>
          </AnimatePresence>

          {/* Navigation buttons */}
          <div className="flex items-center justify-between mt-8 pt-6 border-t border-white/5">
            <button
              onClick={handleBack}
              disabled={step === 0}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-300 ${
                step === 0
                  ? 'text-slate-700 cursor-not-allowed'
                  : 'text-slate-300 hover:text-white hover:bg-white/5'
              }`}
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </button>

            <button
              onClick={handleNext}
              className="glow-button flex items-center gap-2 group text-sm"
            >
              {step === TOTAL_STEPS - 1 ? (
                <>
                  Analyze My Career
                  <CheckCircle2 className="w-4 h-4" />
                </>
              ) : step === 3 ? (
                <>
                  {resumeFile ? 'Analyze Resume' : 'Upload to Continue'}
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </>
              ) : (
                <>
                  Continue
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
