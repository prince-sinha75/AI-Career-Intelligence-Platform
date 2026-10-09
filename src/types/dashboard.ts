import type { OnboardingData } from './onboarding';

export interface ReadinessBreakdown {
  label: string;
  score: number;
  color: string;
  icon: string;
}

export interface CareerMatch {
  id: string;
  role: string;
  company: string;
  match: number;
  salary: string;
  location: string;
  type: string;
  tags: string[];
  description: string;
  matchingSkills: string[];
  missingSkills: string[];
  requiredSkills: string[];
  overview: string;
  growthAreas: string[];
  learningPath: string[];
}

export interface SkillGap {
  skill: string;
  currentLevel: number;
  requiredLevel: number;
  gap: number;
  priority: 'High' | 'Medium' | 'Low';
  category: string;
  estimatedTime: string;
  resources: { name: string; type: string; url: string }[];
}

export interface JobRecommendation {
  id: string;
  title: string;
  company: string;
  logo: string;
  match: number;
  salary: string;
  location: string;
  type: string;
  posted: string;
  skills: string[];
  matchingSkills: string[];
  missingSkills: string[];
  description: string;
  experience: string;
}

export interface RoadmapItem {
  id: string;
  week: string;
  title: string;
  description: string;
  progress: number;
  status: 'done' | 'active' | 'upcoming';
  skills: string[];
  resources: { name: string; type: string }[];
  estimatedTime: string;
}

export interface InterviewSession {
  id: string;
  date: string;
  topic: string;
  score: number;
  duration: string;
  strengths: string[];
  improvements: string[];
  category: 'Technical' | 'Behavioral' | 'System Design';
  questionsPracticed: number;
}

export interface AnalyticsPoint {
  label: string;
  readiness: number;
  skills: number;
  interview: number;
  resume: number;
}

export interface NextAction {
  title: string;
  description: string;
  impact: number;
  effort: 'Low' | 'Medium' | 'High';
  category: string;
  action: string;
}

export interface DashboardData {
  user: {
    name: string;
    email: string;
    educationLevel: string;
    targetRoles: string[];
    experienceLevel: string;
  };
  overallScore: number;
  breakdown: ReadinessBreakdown[];
  careerMatches: CareerMatch[];
  skillGaps: SkillGap[];
  jobs: JobRecommendation[];
  roadmap: RoadmapItem[];
  interviews: InterviewSession[];
  analytics: AnalyticsPoint[];
  nextAction: NextAction;
  currentSkills: { name: string; level: number }[];
  strengths: string[];
  weaknesses: string[];
  careerFit: string;
  recommendations: string[];
  improvementAreas: { area: string; score: number; action: string }[];
}

function seededRandom(seed: number): () => number {
  let s = seed;
  return () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
}

function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) - hash) + str.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

export function generateDashboardData(onboarding: OnboardingData): DashboardData {
  const rng = seededRandom(hashString(onboarding.email || onboarding.fullName));
  const pick = <T>(arr: T[]): T => arr[Math.floor(rng() * arr.length)];

  const baseScore = 55 + Math.floor(rng() * 25);
  const userSkills = onboarding.skills.length > 0 ? onboarding.skills : ['Python', 'SQL', 'React'];

  const breakdown: ReadinessBreakdown[] = [
    { label: 'Technical Skills', score: baseScore + Math.floor(rng() * 10), color: '#06B6D4', icon: 'Code' },
    { label: 'Resume Quality', score: baseScore - 5 + Math.floor(rng() * 10), color: '#8B5CF6', icon: 'FileText' },
    { label: 'Interview Prep', score: baseScore - 10 + Math.floor(rng() * 15), color: '#3B82F6', icon: 'Mic' },
    { label: 'Project Portfolio', score: baseScore - 3 + Math.floor(rng() * 12), color: '#10B981', icon: 'FolderKanban' },
    { label: 'Online Presence', score: baseScore - 8 + Math.floor(rng() * 15), color: '#F59E0B', icon: 'Globe' },
  ];

  const overallScore = Math.round(breakdown.reduce((s, b) => s + b.score, 0) / breakdown.length);

  const roles = onboarding.targetRoles.length > 0 ? onboarding.targetRoles : ['Software Engineer'];
  const companies = ['TechFlow AI', 'DataNexus', 'CloudScale', 'Quantum Labs', 'ByteForge', 'NeuralSoft', 'InnoTech', 'DevSphere'];
  const allSkills = ['Python', 'JavaScript', 'React', 'SQL', 'Machine Learning', 'Docker', 'System Design', 'AWS', 'TypeScript', 'Node.js', 'Kubernetes', 'Deep Learning'];

  const currentSkills = userSkills.map((s) => ({
    name: s,
    level: 40 + Math.floor(rng() * 50),
  }));

  const careerMatches: CareerMatch[] = roles.slice(0, 3).map((role, i) => {
    const requiredSkills = pick([allSkills.slice(0, 5), allSkills.slice(2, 7), allSkills.slice(4, 9)]);
    const matchingSkills = requiredSkills.filter((s) => userSkills.includes(s));
    const missingSkills = requiredSkills.filter((s) => !userSkills.includes(s));
    return {
      id: `match-${i}`,
      role,
      company: pick(companies),
      match: 78 + Math.floor(rng() * 18),
      salary: `${6 + Math.floor(rng() * 14)}-${10 + Math.floor(rng() * 18)} LPA`,
      location: pick(['Bangalore', 'Remote', 'Hyderabad', 'Pune', 'Mumbai', 'Delhi NCR']),
      type: onboarding.workType || pick(['Remote', 'Hybrid', 'On-site']),
      tags: pick([['AI/ML', 'Python', 'Cloud'], ['Full Stack', 'React', 'Node.js'], ['Data', 'SQL', 'Analytics']]),
      description: `A ${role} role aligned with your profile in ${onboarding.preferredIndustry || 'Technology'}, requiring strong fundamentals and hands-on project experience.`,
      matchingSkills,
      missingSkills,
      requiredSkills,
      overview: `As a ${role}, you would work on ${pick(['building scalable systems', 'developing ML models', 'creating data pipelines', 'designing user-facing applications'])} in the ${onboarding.preferredIndustry || 'technology'} sector. This role aligns well with your ${onboarding.experienceLevel || 'fresher'} background.`,
      growthAreas: pick([
        ['Leadership', 'System Architecture', 'Mentoring'],
        ['Deep Learning', 'MLOps', 'Research'],
        ['Full Stack', 'DevOps', 'Product Thinking'],
      ]),
      learningPath: missingSkills.slice(0, 3).map((s) => `Master ${s}`),
    };
  });

  const skillGaps: SkillGap[] = allSkills
    .filter((s) => !userSkills.includes(s))
    .slice(0, 5)
    .map((skill) => {
      const current = Math.floor(rng() * 30);
      const required = 70 + Math.floor(rng() * 25);
      const gap = required - current;
      return {
        skill,
        currentLevel: current,
        requiredLevel: required,
        gap,
        priority: gap > 50 ? 'High' : gap > 30 ? 'Medium' : 'Low',
        category: pick(['Technical', 'Cloud', 'Architecture', 'AI/ML', 'DevOps']),
        estimatedTime: pick(['2-3 weeks', '4-6 weeks', '1-2 weeks', '6-8 weeks']),
        resources: [
          { name: `${skill} Fundamentals`, type: 'Course', url: '#' },
          { name: `Hands-on ${skill} Project`, type: 'Project', url: '#' },
        ],
      };
    });

  const jobs: JobRecommendation[] = Array.from({ length: 6 }, (_, i) => {
    const jobSkills = allSkills.slice(i * 2 % 8, (i * 2 % 8) + 5);
    return {
      id: `job-${i}`,
      title: pick(roles),
      company: pick(companies),
      logo: pick(['🤖', '📊', '☁️', '⚡', '🔧', '🧠']),
      match: 72 + Math.floor(rng() * 25),
      salary: `${5 + Math.floor(rng() * 10)}-${12 + Math.floor(rng() * 15)} LPA`,
      location: pick(['Bangalore', 'Remote', 'Hyderabad', 'Pune', 'Mumbai']),
      type: pick(['Remote', 'Hybrid', 'On-site']),
      posted: pick(['2 days ago', '1 week ago', '3 days ago', 'Just now', '5 days ago']),
      skills: jobSkills,
      matchingSkills: jobSkills.filter((s) => userSkills.includes(s)),
      missingSkills: jobSkills.filter((s) => !userSkills.includes(s)),
      description: `We are looking for a passionate ${pick(roles)} to join our growing team. You will work on cutting-edge projects and collaborate with experienced engineers in a fast-paced environment.`,
      experience: pick(['0-2 years', '1-3 years', '2-4 years', 'Fresher', 'Entry Level']),
    };
  });

  const roadmap: RoadmapItem[] = [
    {
      id: 'r1',
      week: 'Week 1-2',
      title: 'Core Fundamentals Sprint',
      description: 'Strengthen your grasp on data structures and algorithmic problem solving.',
      progress: 100,
      status: 'done',
      skills: ['Algorithms', 'Data Structures'],
      resources: [
        { name: 'DSA Crash Course', type: 'Course' },
        { name: 'LeetCode 75 Problems', type: 'Practice' },
      ],
      estimatedTime: '2 weeks',
    },
    {
      id: 'r2',
      week: 'Week 3-4',
      title: skillGaps[0] ? `${skillGaps[0].skill} Deep Dive` : 'Advanced Topics Sprint',
      description: `Master ${skillGaps[0]?.skill || 'key technical skills'} through structured learning and hands-on projects.`,
      progress: 45 + Math.floor(rng() * 20),
      status: 'active',
      skills: skillGaps.slice(0, 2).map((s) => s.skill),
      resources: [
        { name: 'Interactive Tutorial Series', type: 'Video' },
        { name: 'Build a Mini Project', type: 'Project' },
      ],
      estimatedTime: '3 weeks',
    },
    {
      id: 'r3',
      week: 'Week 5-6',
      title: 'System Design & Architecture',
      description: 'Learn scalable system design principles and cloud deployment strategies.',
      progress: 0,
      status: 'upcoming',
      skills: ['System Design', 'AWS', 'Docker'],
      resources: [
        { name: 'System Design Primer', type: 'Article' },
        { name: 'Architecture Case Studies', type: 'Course' },
      ],
      estimatedTime: '4 weeks',
    },
    {
      id: 'r4',
      week: 'Week 7-8',
      title: 'Mock Interview Sprint',
      description: 'Practice technical and behavioral interviews with AI-powered simulations.',
      progress: 0,
      status: 'upcoming',
      skills: ['Communication', 'Problem Solving'],
      resources: [
        { name: 'AI Mock Interview Sessions', type: 'Practice' },
        { name: 'Behavioral Prep Guide', type: 'Article' },
      ],
      estimatedTime: '2 weeks',
    },
  ];

  const interviews: InterviewSession[] = [
    {
      id: 'iv1',
      date: 'Sep 12, 2026',
      topic: 'Technical — DSA & Problem Solving',
      score: 78,
      duration: '32 min',
      strengths: ['Clear problem breakdown', 'Good time complexity analysis'],
      improvements: ['Edge case handling', 'Optimize brute-force solutions'],
      category: 'Technical',
      questionsPracticed: 45,
    },
    {
      id: 'iv2',
      date: 'Sep 8, 2026',
      topic: 'Behavioral — Team Collaboration',
      score: 85,
      duration: '25 min',
      strengths: ['Structured STAR responses', 'Strong communication'],
      improvements: ['Add more concrete metrics to answers'],
      category: 'Behavioral',
      questionsPracticed: 30,
    },
    {
      id: 'iv3',
      date: 'Sep 3, 2026',
      topic: 'Technical — System Design',
      score: 62,
      duration: '40 min',
      strengths: ['Identified key components correctly'],
      improvements: ['Scalability considerations', 'Database trade-offs'],
      category: 'System Design',
      questionsPracticed: 20,
    },
  ];

  const analytics: AnalyticsPoint[] = [
    { label: 'Jun', readiness: 48, skills: 35, interview: 40, resume: 50 },
    { label: 'Jul', readiness: 55, skills: 42, interview: 52, resume: 58 },
    { label: 'Aug', readiness: 64, skills: 55, interview: 60, resume: 65 },
    { label: 'Sep', readiness: overallScore, skills: Math.round(overallScore * 0.85), interview: Math.round(overallScore * 0.75), resume: Math.round(overallScore * 0.8) },
  ];

  const nextAction: NextAction = {
    title: skillGaps[0] ? `Start the ${skillGaps[0].skill} learning sprint` : 'Complete your first mock interview',
    description: skillGaps[0]
      ? `Closing your ${skillGaps[0].skill} gap could boost your readiness by ${Math.min(15, Math.floor(skillGaps[0].gap / 5))} points. This is your highest-priority gap right now.`
      : 'Practicing a mock interview will sharpen your communication and boost your interview readiness score.',
    impact: 12,
    effort: skillGaps[0]?.priority === 'High' ? 'Medium' : 'Low',
    category: skillGaps[0] ? 'Skill Development' : 'Interview Practice',
    action: skillGaps[0] ? 'Start Sprint' : 'Start Interview',
  };

  const strengths = breakdown.filter((b) => b.score >= 65).map((b) => b.label);
  const weaknesses = breakdown.filter((b) => b.score < 65).map((b) => b.label);
  const topRole = roles[0] || 'Software Engineer';

  const careerFit = `Based on your profile — ${userSkills.join(', ')}, ${onboarding.experienceLevel || 'fresher'} experience, and interest in ${topRole} — you show strong alignment with ${roles.join(' and ')} roles. Your technical foundation is solid, but targeted improvement in ${skillGaps.slice(0, 2).map((s) => s.skill).join(' and ')} would significantly increase your market readiness.`;

  const recommendations = [
    `Focus on closing your ${skillGaps[0]?.skill || 'top skill gap'} — it is your highest-impact improvement area.`,
    `Build 2-3 portfolio projects showcasing ${userSkills.slice(0, 3).join(', ')} to strengthen your resume.`,
    `Practice mock interviews targeting ${weaknesses[0] || 'interview preparation'} to boost confidence.`,
    `Contribute to open source or build a GitHub presence to improve your online profile.`,
  ];

  const improvementAreas = breakdown
    .sort((a, b) => a.score - b.score)
    .slice(0, 3)
    .map((b) => ({
      area: b.label,
      score: b.score,
      action: b.score >= 70
        ? 'Maintain and refine — you are above average here.'
        : b.score >= 50
          ? 'Add structured practice and real-world projects to this area.'
          : 'Prioritize this — it is dragging down your overall readiness.',
    }));

  return {
    user: {
      name: onboarding.fullName,
      email: onboarding.email,
      educationLevel: onboarding.educationLevel,
      targetRoles: roles,
      experienceLevel: onboarding.experienceLevel,
    },
    overallScore,
    breakdown,
    careerMatches,
    skillGaps,
    jobs,
    roadmap,
    interviews,
    analytics,
    nextAction,
    currentSkills,
    strengths,
    weaknesses,
    careerFit,
    recommendations,
    improvementAreas,
  };
}
