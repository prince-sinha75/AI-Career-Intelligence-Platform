export type EducationLevel = 'BCA' | 'MCA' | 'B.Tech' | 'M.Tech' | 'Other';
export type WorkType = 'Remote' | 'Hybrid' | 'On-site';
export type ExperienceLevel = 'Fresher' | 'Beginner' | 'Intermediate';
export type LearningStyle = 'Video' | 'Articles' | 'Projects' | 'Courses' | 'Mixed';

export interface OnboardingData {
  fullName: string;
  email: string;
  phone: string;
  educationLevel: EducationLevel | '';
  graduationYear: string;
  customEducation?: string;       // used when educationLevel === 'Other'
  targetRoles: string[];
  preferredIndustry: string;
  customRole?: string;            // used when targetRoles includes 'Other'
  workType: WorkType | '';
  experienceLevel: ExperienceLevel | '';
  skills: string[];
  primaryGoal: string;
  skillsToImprove: string;
  weeklyHours: string;
  learningStyle: LearningStyle | '';
}

export const initialOnboardingData: OnboardingData = {
  fullName: '',
  email: '',
  phone: '',
  educationLevel: '',
  graduationYear: '',
  targetRoles: [],
  preferredIndustry: '',
  workType: '',
  experienceLevel: '',
  skills: [],
  primaryGoal: '',
  skillsToImprove: '',
  weeklyHours: '',
  learningStyle: '',
};

export const SUGGESTED_SKILLS = [
  // Programming Languages
  'Python', 'Java', 'JavaScript', 'TypeScript', 'C++', 'C#', 'Go', 'Rust', 'PHP', 'R',
  // Web & Mobile
  'React', 'Vue.js', 'Angular', 'Node.js', 'Next.js', 'HTML', 'CSS', 'React Native', 'Flutter',
  // Data & AI
  'Machine Learning', 'Data Science', 'Deep Learning', 'SQL', 'MongoDB', 'Data Analysis',
  'TensorFlow', 'PyTorch', 'Pandas', 'Power BI', 'Tableau',
  // Cloud & DevOps
  'AWS', 'Azure', 'GCP', 'Docker', 'Kubernetes', 'CI/CD', 'Linux',
  // Tools
  'Git', 'GitHub', 'Figma', 'Jira', 'Postman',
  // Soft Skills
  'Communication', 'Problem Solving', 'Team Leadership', 'Project Management',
  'Critical Thinking', 'Time Management',
  // Design
  'UI/UX Design', 'Graphic Design', 'Canva', 'Adobe XD',
  // Business & Finance
  'MS Excel', 'Business Analysis', 'Digital Marketing', 'SEO', 'Content Writing', 'Accounting',
];

// Shown as chips directly on the Career Preferences step (max 5 + Other)
export const TARGET_ROLES = [
  'Software Engineer',
  'Data Scientist',
  'Full Stack Developer',
  'UI/UX Designer',
  'Data Analyst',
  'Other',
];

// Shown inside the "Other" dropdown panel
export const OTHER_CAREER_ROLES = [
  // Engineering
  'Frontend Developer',
  'Backend Developer',
  'Mobile App Developer',
  'DevOps Engineer',
  'Machine Learning Engineer',
  'AI/ML Researcher',
  'Cloud Engineer',
  'Site Reliability Engineer',
  'Cybersecurity Analyst',
  'Embedded Systems Engineer',
  'Blockchain Developer',
  'AR/VR Developer',
  // Product & Design
  'Product Manager',
  'Product Designer',
  'Technical Writer',
  'Game Developer',
  // Management & Business
  'Business Analyst',
  'Project Manager',
  'IT Consultant',
  'Scrum Master',
  'Business Intelligence Analyst',
  // Finance & Commerce
  'Financial Analyst',
  'Digital Marketing Manager',
  'E-Commerce Manager',
  'Content Strategist',
  'SEO Specialist',
  // Other
  'Educator / Trainer',
  'Research Scientist',
  'Startup Founder',
];

export const ONBOARDING_STORAGE_KEY = 'careeiriq_onboarding_data';
