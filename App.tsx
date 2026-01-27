
import React, { useState, useEffect, useCallback } from 'react';
import { AlertCircle, Loader2 } from 'lucide-react';
import Layout from './components/Layout';
import LandingPage from './components/LandingPage';
import Dashboard from './components/Dashboard';
import ProjectWorkspace from './components/ProjectWorkspace';
import OutputViewer from './components/OutputViewer';
import ChecklistMode from './components/ChecklistMode';
import GapTracking from './components/GapTracking';
import RenewalMode from './components/RenewalMode';
import TeamManagement from './components/TeamManagement';
import Settings from './components/Settings';
import AuthPage from './components/AuthPage';
import { 
  FeaturesPage, PricingPage, AboutPage, ContactPage, 
  SecurityPage, LegalPage, HelpCenterPage, TutorialsPage, 
  FAQPage, GetStartedPage
} from './components/PublicInfoPages';
import { AppRoute, AuditPackage, UserProfile, ChecklistItem } from './types';
import { storageService } from './services/storageService';
import { supabase } from './services/supabaseClient';

// Ensure global process object exists for browser compatibility
if (typeof (window as any).process === 'undefined') {
  (window as any).process = { env: {} };
}

const App: React.FC = () => {
  const [session, setSession] = useState<any>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [currentRoute, setCurrentRoute] = useState<AppRoute>(AppRoute.LANDING);
  const [activeProject, setActiveProject] = useState<AuditPackage | null>(null);
  const [savedProjects, setSavedProjects] = useState<AuditPackage[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false);
  const [globalError, setGlobalError] = useState<string | null>(null);

  const loadUserData = useCallback(async (userId: string) => {
    try {
      const [projects, profileResult] = await Promise.all([
        storageService.getProjects(userId),
        supabase.from('profiles').select('*').eq('id', userId).single()
      ]);

      setSavedProjects(projects);
      if (profileResult.data) {
        setProfile(profileResult.data as UserProfile);
      }
    } catch (err) {
      console.error('Error loading data:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const init = async () => {
      try {
        const { data: { session: cur } } = await supabase.auth.getSession();
        setSession(cur);
        if (cur) await loadUserData(cur.user.id);
        else setLoading(false);

        supabase.auth.onAuthStateChange(async (_event, session) => {
          setSession(session);
          if (session) await loadUserData(session.user.id);
          else {
            setProfile(null);
            setSavedProjects([]);
            setLoading(false);
          }
        });
      } catch (e) {
        setGlobalError("Connection to security layer failed. Refreshing...");
        setLoading(false);
      }
    };
    init();
  }, [loadUserData]);

  const navigate = (route: AppRoute) => {
    setCurrentRoute(route);
    window.scrollTo(0, 0);
  };

  const handleAuditGenerationComplete = async (data: AuditPackage) => {
    setIsSyncing(true);
    const userId = session?.user?.id;
    const saved = await storageService.saveProject(data, userId);
    setActiveProject(saved);
    await loadUserData(userId);
    setIsSyncing(false);
    navigate(AppRoute.OUTPUT_VIEWER);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate(AppRoute.LANDING);
  };

  if (globalError) {
    return (
      <div className="min-h-screen bg-techBlack flex flex-col items-center justify-center text-white p-6">
        <AlertCircle size={48} className="text-riskHigh mb-4" />
        <h2 className="text-xl font-bold mb-4">{globalError}</h2>
        <button onClick={() => window.location.reload()} className="bg-brightBlue px-6 py-2 rounded-lg font-bold">Retry Connection</button>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-techBlack flex flex-col items-center justify-center text-white p-6">
        <div className="w-16 h-16 border-4 border-brightBlue border-t-transparent rounded-full animate-spin mb-4"></div>
        <h2 className="text-xs font-black tracking-[0.4em] text-steelGrey uppercase">Synchronizing Neural Workspace</h2>
      </div>
    );
  }

  // Route Rendering
  const renderPublicPage = () => {
    switch (currentRoute) {
      case AppRoute.FEATURES: return <FeaturesPage navigate={navigate} />;
      case AppRoute.PRICING: return <PricingPage navigate={navigate} />;
      case AppRoute.ABOUT: return <AboutPage navigate={navigate} />;
      case AppRoute.CONTACT: return <ContactPage navigate={navigate} />;
      case AppRoute.SECURITY: return <SecurityPage navigate={navigate} />;
      case AppRoute.FAQ: return <FAQPage navigate={navigate} />;
      case AppRoute.HELP: return <HelpCenterPage navigate={navigate} />;
      case AppRoute.TUTORIALS: return <TutorialsPage navigate={navigate} />;
      case AppRoute.PRIVACY: return <LegalPage navigate={navigate} type="Privacy Policy" />;
      case AppRoute.TERMS: return <LegalPage navigate={navigate} type="Terms of Service" />;
      case AppRoute.COOKIES: return <LegalPage navigate={navigate} type="Cookie Policy" />;
      case AppRoute.DPA: return <LegalPage navigate={navigate} type="Data Processing Agreement" />;
      case AppRoute.GET_STARTED: return <GetStartedPage navigate={navigate} />;
      case AppRoute.LOGIN: return <AuthPage onLogin={async (e, p, s, x) => {
        if (s) return supabase.auth.signUp({ email: e, password: p, options: { data: { first_name: x?.firstName, last_name: x?.lastName } } });
        return supabase.auth.signInWithPassword({ email: e, password: p });
      }} navigate={navigate} />;
      default: return null;
    }
  };

  const publicContent = renderPublicPage();
  if (publicContent) return publicContent;

  if (!session) return <LandingPage onEnterWorkspace={() => navigate(AppRoute.LOGIN)} navigate={navigate} />;

  return (
    <Layout currentRoute={currentRoute} navigate={navigate} isLoggedIn={true} onLogout={handleLogout} isSyncing={isSyncing}>
      {currentRoute === AppRoute.DASHBOARD && <Dashboard navigate={navigate} savedProjects={savedProjects} profile={profile} onSelectProject={(p) => { setActiveProject(p); navigate(AppRoute.OUTPUT_VIEWER); }} />}
      {currentRoute === AppRoute.PROJECT_WIZARD && <ProjectWorkspace onComplete={handleAuditGenerationComplete} navigate={navigate} profile={profile} />}
      {currentRoute === AppRoute.OUTPUT_VIEWER && <OutputViewer data={activeProject} savedProjects={savedProjects} onSave={(d) => storageService.saveProject(d, session.user.id)} onDelete={async (id) => { await storageService.deleteProject(id); loadUserData(session.user.id); }} onBack={() => navigate(AppRoute.DASHBOARD)} onSelectProject={setActiveProject} onNavigateToChecklist={() => navigate(AppRoute.CHECKLIST)} navigate={navigate} />}
      {currentRoute === AppRoute.CHECKLIST && <ChecklistMode data={activeProject} navigate={navigate} onUpdate={(c) => storageService.saveProject({ ...activeProject!, checklist: c }, session.user.id)} />}
      {currentRoute === AppRoute.GAP_TRACKING && <GapTracking data={activeProject} navigate={navigate} onUpdate={(g) => storageService.saveProject({ ...activeProject!, gaps: g }, session.user.id)} />}
      {currentRoute === AppRoute.RENEWAL && <RenewalMode data={activeProject} navigate={navigate} profile={profile} onRefreshProfile={() => loadUserData(session.user.id)} onChecklistUpdate={(c) => storageService.saveProject({ ...activeProject!, checklist: c }, session.user.id)} />}
      {currentRoute === AppRoute.TEAM && <TeamManagement profile={profile} navigate={navigate} />}
      {currentRoute === AppRoute.SETTINGS && <Settings profile={profile} onRefresh={() => loadUserData(session.user.id)} />}
    </Layout>
  );
};

export default App;
