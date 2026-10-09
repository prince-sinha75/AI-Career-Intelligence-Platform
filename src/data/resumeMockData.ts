import type { ResumeAnalysis } from '@/types/resume';

export const mockResumeAnalysis: ResumeAnalysis = {
  id: 'mock-analysis-001',
  analyzedAt: 'Sep 20, 2026 • 2:14 PM',
  resumeFile: {
    name: 'resume.pdf',
    size: 184320,
    type: 'application/pdf',
    lastModified: Date.now(),
  },

  overallScore: 74,
  atsScore: 81,
  contentScore: 72,
  formattingScore: 88,
  keywordScore: 69,
  impactScore: 65,

  summary:
    'A well-structured resume with solid technical foundations and relevant academic projects. ATS compatibility is strong, but the resume lacks quantified impact statements and industry-specific keywords that top recruiters look for. Adding measurable outcomes to your experience bullets and expanding your certifications section will significantly improve shortlisting rates.',

  strengths: [
    'Clean, ATS-friendly formatting with logical section hierarchy',
    'Strong academic background with relevant technical coursework',
    'Good breadth of technical skills matching current market demand',
    'Multiple project entries demonstrating hands-on experience',
    'Contact information is complete and professional',
    'Consistent date formatting throughout the document',
  ],

  weakAreas: [
    'No quantified impact metrics in experience bullets (numbers, percentages)',
    'Missing cloud platform skills (AWS, Azure, GCP) increasingly demanded by employers',
    'Only 1 year of internship experience — portfolio projects need stronger descriptions',
    'Certifications section is empty — adds significant ATS score boost',
    'Action verbs are weak in 3 of 5 experience bullets (used "worked on" vs "engineered")',
    'LinkedIn URL and GitHub profile not included in contact section',
  ],

  technicalSkills: [
    { name: 'Python', confidence: 88, category: 'technical' },
    { name: 'JavaScript', confidence: 82, category: 'technical' },
    { name: 'React', confidence: 79, category: 'technical' },
    { name: 'SQL', confidence: 84, category: 'technical' },
    { name: 'Machine Learning', confidence: 71, category: 'technical' },
    { name: 'Data Analysis', confidence: 76, category: 'technical' },
    { name: 'TypeScript', confidence: 68, category: 'technical' },
    { name: 'Node.js', confidence: 65, category: 'technical' },
    { name: 'REST APIs', confidence: 73, category: 'technical' },
    { name: 'Git', confidence: 90, category: 'tool' },
  ],

  softSkills: [
    { name: 'Problem Solving', confidence: 85, category: 'soft' },
    { name: 'Team Collaboration', confidence: 80, category: 'soft' },
    { name: 'Communication', confidence: 74, category: 'soft' },
    { name: 'Adaptability', confidence: 78, category: 'soft' },
    { name: 'Attention to Detail', confidence: 82, category: 'soft' },
    { name: 'Critical Thinking', confidence: 76, category: 'soft' },
  ],

  technologies: [
    'Python', 'JavaScript', 'TypeScript', 'React', 'Node.js',
    'SQL', 'MongoDB', 'Git', 'GitHub', 'VS Code',
    'Pandas', 'NumPy', 'Scikit-learn', 'Jupyter',
    'HTML5', 'CSS3', 'Tailwind CSS', 'REST APIs',
  ],

  missingSkills: [
    'AWS / Cloud Platforms',
    'Docker & Kubernetes',
    'System Design',
    'CI/CD Pipelines',
    'GraphQL',
    'Redis',
    'Microservices Architecture',
  ],

  recommendedSkills: [
    'AWS (Free Tier + Certified Cloud Practitioner)',
    'Docker basics — containerization is now table stakes',
    'System Design fundamentals for senior role interviews',
    'LangChain / LLM integrations — fastest growing demand in 2026',
    'PostgreSQL advanced queries and indexing',
  ],

  experience: [
    {
      company: 'DataNexus Technologies',
      role: 'Software Engineering Intern',
      duration: '6 months',
      period: 'Jan 2026 – Jun 2026',
      highlights: [
        'Developed RESTful APIs using Node.js and Express for internal data pipeline dashboards',
        'Worked on frontend features in React for the analytics portal used by 200+ internal users',
        'Collaborated with the ML team to integrate a Python-based recommendation engine',
        'Participated in code reviews and daily stand-ups following Agile methodology',
      ],
      technologies: ['Node.js', 'React', 'Python', 'PostgreSQL', 'Git'],
    },
    {
      company: 'Freelance / Self-Employed',
      role: 'Full Stack Developer',
      duration: '8 months',
      period: 'May 2025 – Dec 2025',
      highlights: [
        'Built and deployed 3 client web applications using React and Node.js',
        'Integrated payment gateways and third-party APIs for e-commerce clients',
        'Managed project requirements, timelines, and client communication independently',
      ],
      technologies: ['React', 'Node.js', 'MongoDB', 'Stripe API', 'Vercel'],
    },
  ],

  education: [
    {
      institution: 'Symbiosis Institute of Technology, Pune',
      degree: 'Master of Computer Applications (MCA)',
      field: 'Computer Applications',
      year: '2024 – 2026',
      gpa: '8.4 / 10',
      achievements: [
        'Ranked 3rd in the department for academic performance (Sem 3)',
        'Led a team of 4 for the Final Year Project on NLP-based resume screening',
        'Completed 5 industry-sponsored mini-projects during coursework',
      ],
    },
    {
      institution: 'University of Pune',
      degree: 'Bachelor of Computer Applications (BCA)',
      field: 'Computer Applications',
      year: '2021 – 2024',
      gpa: '7.9 / 10',
      achievements: [
        'Participated in 2 national-level hackathons',
        'Core member of the college coding club',
      ],
    },
  ],

  projects: [
    {
      name: 'AI-Powered Resume Screener',
      description:
        'Built an NLP-based system to automatically parse, score, and rank resumes against job descriptions using Python, SpaCy, and Sentence Transformers. Achieved 87% accuracy on test dataset.',
      technologies: ['Python', 'SpaCy', 'Transformers', 'FastAPI', 'React', 'PostgreSQL'],
      impact: 'Reduced manual screening time by ~70% in simulated HR workflow tests',
      link: 'https://github.com',
    },
    {
      name: 'Real-Time Stock Dashboard',
      description:
        'Developed a full-stack real-time stock market dashboard with WebSocket price feeds, interactive candlestick charts, and portfolio tracking. Deployed on Vercel.',
      technologies: ['React', 'TypeScript', 'Node.js', 'WebSockets', 'Chart.js', 'MongoDB'],
      impact: 'Handles live updates for 50+ stocks simultaneously with sub-100ms UI refresh',
      link: 'https://github.com',
    },
    {
      name: 'Smart Expense Tracker',
      description:
        'Created a cross-platform expense tracker with AI-based category suggestions, monthly trend analysis, and budget alerts. Used React Native for mobile and shared API backend.',
      technologies: ['React Native', 'Node.js', 'Express', 'SQLite', 'OpenAI API'],
      impact: 'Gained 200+ active users within 3 months of release on Google Play',
    },
  ],

  certifications: [
    // Empty — this is intentional; the weakness detection flags this
  ],

  keywords: [
    { keyword: 'Python', found: true, frequency: 7, importance: 'high' },
    { keyword: 'Machine Learning', found: true, frequency: 4, importance: 'high' },
    { keyword: 'React', found: true, frequency: 5, importance: 'high' },
    { keyword: 'SQL', found: true, frequency: 3, importance: 'high' },
    { keyword: 'REST API', found: true, frequency: 4, importance: 'high' },
    { keyword: 'Agile', found: true, frequency: 2, importance: 'medium' },
    { keyword: 'AWS', found: false, frequency: 0, importance: 'high' },
    { keyword: 'Docker', found: false, frequency: 0, importance: 'high' },
    { keyword: 'Kubernetes', found: false, frequency: 0, importance: 'medium' },
    { keyword: 'CI/CD', found: false, frequency: 0, importance: 'high' },
    { keyword: 'TypeScript', found: true, frequency: 2, importance: 'medium' },
    { keyword: 'System Design', found: false, frequency: 0, importance: 'high' },
    { keyword: 'Node.js', found: true, frequency: 4, importance: 'medium' },
    { keyword: 'Git', found: true, frequency: 3, importance: 'medium' },
    { keyword: 'Data Analysis', found: true, frequency: 2, importance: 'medium' },
    { keyword: 'Microservices', found: false, frequency: 0, importance: 'medium' },
    { keyword: 'MongoDB', found: true, frequency: 2, importance: 'low' },
    { keyword: 'Cloud', found: false, frequency: 0, importance: 'high' },
    { keyword: 'GraphQL', found: false, frequency: 0, importance: 'low' },
    { keyword: 'TensorFlow', found: false, frequency: 0, importance: 'medium' },
  ],

  jobRoleCompatibility: [
    {
      role: 'Software Engineer',
      score: 82,
      color: '#06B6D4',
      matchedKeywords: ['Python', 'React', 'REST API', 'Node.js', 'Git', 'Agile', 'TypeScript'],
      missingKeywords: ['AWS', 'Docker', 'System Design', 'CI/CD'],
    },
    {
      role: 'Full Stack Developer',
      score: 79,
      color: '#8B5CF6',
      matchedKeywords: ['React', 'Node.js', 'TypeScript', 'MongoDB', 'REST API', 'Git'],
      missingKeywords: ['AWS', 'Docker', 'GraphQL', 'Microservices'],
    },
    {
      role: 'Data Analyst',
      score: 75,
      color: '#10B981',
      matchedKeywords: ['Python', 'SQL', 'Data Analysis', 'Machine Learning', 'Pandas'],
      missingKeywords: ['Tableau', 'Power BI', 'R', 'Advanced SQL'],
    },
    {
      role: 'Machine Learning Engineer',
      score: 66,
      color: '#F59E0B',
      matchedKeywords: ['Python', 'Machine Learning', 'Scikit-learn', 'Data Analysis'],
      missingKeywords: ['TensorFlow', 'PyTorch', 'MLOps', 'AWS SageMaker', 'Docker'],
    },
    {
      role: 'DevOps Engineer',
      score: 38,
      color: '#EF4444',
      matchedKeywords: ['Git', 'Linux basics'],
      missingKeywords: ['Docker', 'Kubernetes', 'Terraform', 'CI/CD', 'AWS', 'Ansible'],
    },
  ],

  suggestions: [
    {
      id: 's1',
      category: 'impact',
      priority: 'critical',
      title: 'Add quantified metrics to every experience bullet',
      description:
        'Replace vague descriptions with measurable outcomes. Recruiters spend an average of 7 seconds scanning resumes — numbers catch the eye immediately.',
      example:
        'Before: "Developed REST APIs for dashboards" → After: "Engineered 12 REST API endpoints serving 200+ users, reducing dashboard load time by 40%"',
    },
    {
      id: 's2',
      category: 'keywords',
      priority: 'critical',
      title: 'Add AWS, Docker, and CI/CD keywords',
      description:
        '68% of job descriptions for software engineers now require cloud and DevOps fundamentals. Even basic familiarity will significantly boost your ATS score.',
      example: 'Add a "Cloud & DevOps" subsection: AWS (EC2, S3), Docker (basics), GitHub Actions',
    },
    {
      id: 's3',
      category: 'skills',
      priority: 'high',
      title: 'Earn at least one certification and add it',
      description:
        'The certifications section is currently empty, which is a red flag for ATS systems used by top-tier companies. AWS Cloud Practitioner, Google Data Analytics, or Meta React Developer are achievable in 1–3 months.',
    },
    {
      id: 's4',
      category: 'content',
      priority: 'high',
      title: 'Add GitHub and LinkedIn URLs to contact section',
      description:
        '92% of recruiters look up candidates on LinkedIn before calling. Missing these links loses credibility and makes follow-up harder.',
      example: 'linkedin.com/in/yourname  •  github.com/yourhandle',
    },
    {
      id: 's5',
      category: 'experience',
      priority: 'high',
      title: 'Strengthen action verbs in bullet points',
      description:
        'Weak verbs like "worked on," "helped," and "participated in" reduce perceived ownership. Use strong verbs that demonstrate leadership and initiative.',
      example: '"Architected", "Engineered", "Optimized", "Reduced", "Launched", "Led", "Automated"',
    },
    {
      id: 's6',
      category: 'content',
      priority: 'medium',
      title: 'Add a concise professional summary at the top',
      description:
        'A 2–3 line summary helps recruiters immediately understand your profile and keyword-match your resume, improving ATS scoring by 15–25 points on average.',
      example:
        '"MCA graduate with 1+ year building full-stack applications in React, Node.js, and Python. Experienced in REST APIs, ML integration, and agile teams. Seeking a software engineering role in a product-driven environment."',
    },
    {
      id: 's7',
      category: 'formatting',
      priority: 'medium',
      title: 'Keep resume to a single page',
      description:
        'For candidates with under 3 years of experience, a single-page resume performs significantly better. Trim redundant project details to fit cleanly on one page.',
    },
    {
      id: 's8',
      category: 'keywords',
      priority: 'low',
      title: 'Mirror language from target job descriptions',
      description:
        'Paste your top 3 target JDs into a word cloud tool and identify the 10 most frequent phrases. Weave them naturally into your bullets to maximize ATS match.',
    },
  ],

  wordCount: 487,
  pageCount: 2,
  yearsOfExperience: 1,
  contactInfoComplete: false,
};

/**
 * Generates a mock analysis based on uploaded file info.
 * In a real implementation this would call a parsing API.
 */
export function generateMockAnalysis(file: { name: string; size: number; type: string; lastModified: number }): ResumeAnalysis {
  return {
    ...mockResumeAnalysis,
    id: `analysis-${Date.now()}`,
    analyzedAt: new Date().toLocaleString('en-US', {
      month: 'short', day: 'numeric', year: 'numeric',
      hour: 'numeric', minute: '2-digit', hour12: true,
    }),
    resumeFile: file,
  };
}
