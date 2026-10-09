// ─── Resume Analysis Types ─────────────────────────────────────────────────

export interface ResumeFile {
  name: string;
  size: number;
  type: string; // 'application/pdf' | 'application/msword' | etc.
  lastModified: number;
}

export interface SkillEntry {
  name: string;
  confidence: number; // 0–100
  category: 'technical' | 'soft' | 'tool' | 'language';
}

export interface ExperienceEntry {
  company: string;
  role: string;
  duration: string;
  period: string;
  highlights: string[];
  technologies: string[];
}

export interface EducationEntry {
  institution: string;
  degree: string;
  field: string;
  year: string;
  gpa?: string;
  achievements?: string[];
}

export interface ProjectEntry {
  name: string;
  description: string;
  technologies: string[];
  impact?: string;
  link?: string;
}

export interface CertificationEntry {
  name: string;
  issuer: string;
  year: string;
  credentialId?: string;
}

export interface KeywordMatch {
  keyword: string;
  found: boolean;
  frequency: number;
  importance: 'high' | 'medium' | 'low';
}

export interface JobRoleCompatibility {
  role: string;
  score: number; // 0–100
  color: string;
  matchedKeywords: string[];
  missingKeywords: string[];
}

export interface ImprovementSuggestion {
  id: string;
  category: 'formatting' | 'content' | 'keywords' | 'skills' | 'experience' | 'impact';
  priority: 'critical' | 'high' | 'medium' | 'low';
  title: string;
  description: string;
  example?: string;
}

export interface ResumeAnalysis {
  id: string;
  analyzedAt: string;
  resumeFile: ResumeFile;

  // Scores
  overallScore: number;       // 0–100
  atsScore: number;           // 0–100
  contentScore: number;       // 0–100
  formattingScore: number;    // 0–100
  keywordScore: number;       // 0–100
  impactScore: number;        // 0–100

  // Summary
  strengths: string[];
  weakAreas: string[];
  summary: string;

  // Skills
  technicalSkills: SkillEntry[];
  softSkills: SkillEntry[];
  technologies: string[];
  missingSkills: string[];
  recommendedSkills: string[];

  // Sections
  experience: ExperienceEntry[];
  education: EducationEntry[];
  projects: ProjectEntry[];
  certifications: CertificationEntry[];

  // Analysis
  keywords: KeywordMatch[];
  jobRoleCompatibility: JobRoleCompatibility[];
  suggestions: ImprovementSuggestion[];

  // Metadata
  wordCount: number;
  pageCount: number;
  yearsOfExperience: number;
  contactInfoComplete: boolean;
}

// Storage key for persisted resume state
export const RESUME_STORAGE_KEY = 'careeriq_resume_analysis';
