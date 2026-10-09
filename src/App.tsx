import { useState, useEffect, useCallback } from 'react';
import ParticleBackground from '@/components/ParticleBackground';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import Capabilities from '@/components/Capabilities';
import HowItWorks from '@/components/HowItWorks';
import DashboardPreview from '@/components/DashboardPreview';
import CtaFooter from '@/components/CtaFooter';
import OnboardingWizard from '@/components/onboarding/OnboardingWizard';
import DashboardShell, { type DashPage } from '@/components/dashboard/DashboardShell';
import { ToastProvider } from '@/components/dashboard/Toast';
import OverviewPage from '@/components/dashboard/pages/OverviewPage';
import AnalysisPage from '@/components/dashboard/pages/AnalysisPage';
import MatchesPage from '@/components/dashboard/pages/MatchesPage';
import SkillsPage from '@/components/dashboard/pages/SkillsPage';
import JobsPage from '@/components/dashboard/pages/JobsPage';
import RoadmapPage from '@/components/dashboard/pages/RoadmapPage';
import InterviewPage from '@/components/dashboard/pages/InterviewPage';
import AnalyticsPage from '@/components/dashboard/pages/AnalyticsPage';
import ResumeAnalyzerPage from '@/components/dashboard/pages/ResumeAnalyzerPage';
import type { OnboardingData } from '@/types/onboarding';
import { initialOnboardingData, ONBOARDING_STORAGE_KEY } from '@/types/onboarding';
import { generateDashboardData, type DashboardData } from '@/types/dashboard';

type Route = 'landing' | 'onboarding' | 'dashboard';

function parseHash(): { route: Route; dashPage: DashPage } {
  const hash = window.location.hash;
  if (hash === '#/onboarding') return { route: 'onboarding', dashPage: 'overview' };
  if (hash.startsWith('#/dashboard')) {
    const sub = hash.replace('#/dashboard', '').replace('/', '');
    const validPages: DashPage[] = ['overview', 'analysis', 'matches', 'skills', 'jobs', 'roadmap', 'interview', 'analytics', 'resume'];
    const page = validPages.includes(sub as DashPage) ? (sub as DashPage) : 'overview';
    return { route: 'dashboard', dashPage: page };
  }
  return { route: 'landing', dashPage: 'overview' };
}

function App() {
  const initial = parseHash();
  const [route, setRoute] = useState<Route>(initial.route);
  const [dashPage, setDashPage] = useState<DashPage>(initial.dashPage);
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);

  useEffect(() => {
    const onHashChange = () => {
      const parsed = parseHash();
      setRoute(parsed.route);
      setDashPage(parsed.dashPage);
    };
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  useEffect(() => {
    if (route === 'dashboard') {
      try {
        const stored = localStorage.getItem(ONBOARDING_STORAGE_KEY);
        if (stored) {
          const parsed = JSON.parse(stored) as OnboardingData;
          setDashboardData(generateDashboardData(parsed));
        } else {
          setDashboardData(generateDashboardData(initialOnboardingData));
        }
      } catch {
        setDashboardData(generateDashboardData(initialOnboardingData));
      }
    }
  }, [route]);

  const navigate = useCallback((to: Route) => {
    if (to === 'onboarding') window.location.hash = '#/onboarding';
    else if (to === 'dashboard') window.location.hash = '#/dashboard';
    else window.location.hash = '';
    setRoute(to);
    window.scrollTo(0, 0);
  }, []);

  const navigateDash = useCallback((page: DashPage) => {
    window.location.hash = page === 'overview' ? '#/dashboard' : `#/dashboard/${page}`;
    setDashPage(page);
    window.scrollTo(0, 0);
  }, []);

  if (route === 'onboarding') {
    return (
      <div className="relative min-h-screen bg-onyx-deep overflow-x-hidden">
        <div className="fixed inset-0 grid-pattern opacity-40 pointer-events-none z-0" />
        <div className="fixed inset-0 noise-texture pointer-events-none z-0" />
        <ParticleBackground />
        <div className="relative z-10">
          <OnboardingWizard onComplete={() => navigate('dashboard')} />
        </div>
      </div>
    );
  }

  if (route === 'dashboard' && dashboardData) {
    return (
      <ToastProvider>
        <div className="relative min-h-screen bg-onyx-deep overflow-x-hidden">
          <div className="fixed inset-0 grid-pattern opacity-30 pointer-events-none z-0" />
          <div className="fixed inset-0 noise-texture pointer-events-none z-0" />
          <div className="relative z-10">
            <DashboardShell
              data={dashboardData}
              activePage={dashPage}
              onNavigate={navigateDash}
              onExit={() => navigate('landing')}
            >
              {dashPage === 'overview'   && <OverviewPage data={dashboardData} onNavigate={navigateDash} />}
              {dashPage === 'analysis'   && <AnalysisPage data={dashboardData} onNavigate={navigateDash} />}
              {dashPage === 'resume'     && <ResumeAnalyzerPage />}
              {dashPage === 'matches'    && <MatchesPage data={dashboardData} />}
              {dashPage === 'skills'     && <SkillsPage data={dashboardData} onNavigate={navigateDash} />}
              {dashPage === 'jobs'       && <JobsPage data={dashboardData} />}
              {dashPage === 'roadmap'    && <RoadmapPage data={dashboardData} />}
              {dashPage === 'interview'  && <InterviewPage data={dashboardData} />}
              {dashPage === 'analytics'  && <AnalyticsPage data={dashboardData} onNavigate={navigateDash} />}
            </DashboardShell>
          </div>
        </div>
      </ToastProvider>
    );
  }

  return (
    <div className="relative min-h-screen bg-onyx-deep overflow-x-hidden">
      <div className="fixed inset-0 grid-pattern opacity-40 pointer-events-none z-0" />
      <div className="fixed inset-0 noise-texture pointer-events-none z-0" />
      <ParticleBackground />
      <div className="relative z-10">
        <Navbar onAnalyzeCareer={() => navigate('onboarding')} onLogin={() => navigate('dashboard')} />
        <main>
          <Hero onAnalyzeCareer={() => navigate('onboarding')} />
          <Capabilities />
          <HowItWorks />
          <DashboardPreview />
          <CtaFooter onGetStarted={() => navigate('onboarding')} />
        </main>
      </div>
    </div>
  );
}

export default App;
