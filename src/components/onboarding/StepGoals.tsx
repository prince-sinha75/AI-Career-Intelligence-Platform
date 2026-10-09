import { Clock, BookOpen } from 'lucide-react';
import type { OnboardingData, LearningStyle } from '@/types/onboarding';
import { Field, TextArea, OptionChip } from './ui';

const learningStyles: LearningStyle[] = ['Video', 'Articles', 'Projects', 'Courses', 'Mixed'];
const hourOptions = ['1-3', '4-6', '7-10', '10+'];

export default function StepGoals({
  data,
  update,
  errors,
}: {
  data: OnboardingData;
  update: (patch: Partial<OnboardingData>) => void;
  errors: Record<string, string>;
}) {
  return (
    <div className="space-y-5">
      <Field
        label="What is your primary career goal?"
        error={errors.primaryGoal}
        htmlFor="primaryGoal"
      >
        <TextArea
          id="primaryGoal"
          value={data.primaryGoal}
          onChange={(v) => update({ primaryGoal: v })}
          placeholder="e.g. Land a Machine Learning Engineer role at a top product company within 6 months."
          error={!!errors.primaryGoal}
        />
      </Field>

      <Field
        label="What skills do you want to improve?"
        error={errors.skillsToImprove}
        htmlFor="skillsToImprove"
      >
        <TextArea
          id="skillsToImprove"
          value={data.skillsToImprove}
          onChange={(v) => update({ skillsToImprove: v })}
          placeholder="e.g. System design, Docker, deep learning frameworks, interview communication."
          error={!!errors.skillsToImprove}
        />
      </Field>

      <Field
        label="How many hours per week can you dedicate to learning?"
        error={errors.weeklyHours}
      >
        <div className="flex flex-wrap gap-2.5">
          {hourOptions.map((h) => (
            <OptionChip
              key={h}
              label={`${h} hrs`}
              selected={data.weeklyHours === h}
              onClick={() => update({ weeklyHours: h })}
              icon={<Clock className="w-3.5 h-3.5" />}
            />
          ))}
        </div>
      </Field>

      <Field label="Preferred Learning Style" error={errors.learningStyle}>
        <div className="flex flex-wrap gap-2.5">
          {learningStyles.map((ls) => (
            <OptionChip
              key={ls}
              label={ls}
              selected={data.learningStyle === ls}
              onClick={() => update({ learningStyle: ls })}
              icon={<BookOpen className="w-3.5 h-3.5" />}
            />
          ))}
        </div>
      </Field>
    </div>
  );
}
