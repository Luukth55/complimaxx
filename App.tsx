
import React, { useState, useEffect } from 'react';
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
  FeaturesPage, 
  PricingPage, 
  AboutPage, 
  ContactPage, 
  SecurityPage, 
  LegalPage, 
  HelpCenterPage, 
  TutorialsPage, 
  FAQPage, 
  GetStartedPage
} from './components/PublicInfoPages';
import { AppRoute, AuditPackage } from './types';
import { storageService } from './services/storageService';
import { supabase, isSupabaseConfigured } from './services/supabaseClient';

const App: React.FC = () => {
  const [session, setSession] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [currentRoute, setCurrentRoute] = useState<AppRoute>(AppRoute.LANDING);
  const [activeProject, setActiveProject] = useState<AuditPackage | null>(null);
  const [savedProjects, setSavedProjects] = useState<AuditPackage[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false);

  useEffect(() => {
    const initAuth = async () => {
      const { data: { session: currentSession } } = await supabase.auth.getSession();
      setSession(currentSession);
      
      if (currentSession) {
        await loadUserData(currentSession.user.id);
      }

      const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
        setSession(session);
        if (session) await loadUserData(session.user.id);
        else {
          setProfile(null);
          setSavedProjects([]);
        }
      });

      setLoading(false);
      return () => subscription.unsubscribe();
    };

    initAuth();
  }, []);

  const loadUserData = async (userId: string) => {
    try {
      const projects = await storageService.getProjects(userId);
      setSavedProjects(projects);

      const { data: profileData } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();
      
      if (profileData) {
        setProfile(profileData);
      }
    } catch (err) {
      console.error('Fout bij laden user data:', err);
    }
  };

  const navigate = (route: AppRoute) => {
    setCurrentRoute(route);
    window.scrollTo(0,0);
  };

  const handleAuditGenerationComplete = async (data: AuditPackage) => {
    setIsSyncing(true);
    const userId = session?.user?.id;
    // Sla direct op in de cloud na generatie
    const saved = await storageService.saveProject(data, userId);
    setActiveProject(saved);
    await loadUserData(userId);
    setIsSyncing(false);
    navigate(AppRoute.OUTPUT_VIEWER);
  };

  const handleSaveProject = async (data: AuditPackage) => {
    const userId = session?.user?.id;
    if (!userId) return;
    setIsSyncing(true);
    try {
      const saved = await storageService.saveProject(data, userId);
      setActiveProject(saved);
      // Update de lokale lijst zodat het dashboard klopt
      setSavedProjects(prev => prev.map(p => p.id === saved.id ? saved : p));
    } catch (err) {
      console.error('Opslaan mislukt:', err);
    } finally {
      setIsSyncing(false);
    }
  };

  const handleUpdateProject = async (updates: Partial<AuditPackage>) => {
    if (activeProject) {
      const newData = { ...activeProject, ...updates };
      // Lokale staat direct updaten voor snelheid
      setActiveProject(newData);
      // Cloud sync op de achtergrond
      await handleSaveProject(newData);
    }
  };

  const handleAuthAction = async (email: string, pass: string, isSignup: boolean, extra?: any) => {
    let authResult;
    if (isSignup) {
      authResult = await supabase.auth.signUp({ 
        email, 
        password: pass,
        options: { data: { first_name: extra?.firstName, last_name: extra?.lastName } }
      });
      
      if (authResult.error) throw authResult.error;

      if (authResult.data.user) {
        await supabase.from('profiles').insert([{
          id: authResult.data.user.id,
          first_name: extra?.firstName,
          last_name: extra?.lastName,
          email: email,
          is_pro: false,
          framework_limit: 2,
          credits_remaining: 15
        }]);
      }
    } else {
      authResult = await supabase.auth.signInWithPassword({ email, password: pass });
      if (authResult.error) throw authResult.error;
    }

    navigate(AppRoute.DASHBOARD);
    return authResult.data;
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setSession(null);
    setProfile(null);
    navigate(AppRoute.LANDING);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-techBlack flex flex-col items-center justify-center text-white p-6">
        <div className="w-12 h-12 border-4 border-brightBlue border-t-transparent rounded-full animate-spin mb-6"></div>
        <h2 className="text-lg font-bold">Complimaxx Cloud Initialiseren...</h2>
      </div>
    );
  }

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
      case AppRoute.LOGIN: return <AuthPage onLogin={handleAuthAction} navigate={navigate} />;
      default: return null;
    }
  };

  const publicContent = renderPublicPage();
  if (publicContent) return publicContent;

  if (!session) {
      return <LandingPage onEnterWorkspace={() => navigate(AppRoute.LOGIN)} navigate={navigate} />;
  }

  return (
    <Layout 
      currentRoute={currentRoute} 
      navigate={navigate} 
      isLoggedIn={true} 
      onLogout={handleLogout}
      isSyncing={isSyncing}
    >
      {currentRoute === AppRoute.DASHBOARD && (
        <Dashboard 
          navigate={navigate} 
          savedProjects={savedProjects} 
          profile={profile}
          onSelectProject={(p) => { setActiveProject(p); navigate(AppRoute.OUTPUT_VIEWER); }} 
        />
      )}
      {currentRoute === AppRoute.PROJECT_WIZARD && <ProjectWorkspace onComplete={handleAuditGenerationComplete} navigate={navigate} />}
      {currentRoute === AppRoute.OUTPUT_VIEWER && (
        <OutputViewer 
          data={activeProject} 
          savedProjects={savedProjects}
          onSave={handleSaveProject}
          onDelete={async (id) => { await storageService.deleteProject(id); loadUserData(session.user.id); setActiveProject(null); }}
          onBack={() => { setActiveProject(null); navigate(AppRoute.DASHBOARD); }}
          onSelectProject={(d) => { setActiveProject(d); }}
          onNavigateToChecklist={() => navigate(AppRoute.CHECKLIST)}
          navigate={navigate}
        />
      )}
      {currentRoute === AppRoute.CHECKLIST && <ChecklistMode data={activeProject} navigate={navigate} onUpdate={(checklist) => handleUpdateProject({ checklist })} />}
      {currentRoute === AppRoute.GAP_TRACKING && <GapTracking data={activeProject} navigate={navigate} onUpdate={(gaps) => handleUpdateProject({ gaps })} />}
      {currentRoute === AppRoute.RENEWAL && <RenewalMode data={activeProject} navigate={navigate} onUpdate={(audit_meta) => handleUpdateProject({ audit_meta })} onChecklistUpdate={(checklist) => handleUpdateProject({ checklist })} />}
      {currentRoute === AppRoute.TEAM && <TeamManagement />}
      {currentRoute === AppRoute.SETTINGS && <Settings />}
    </Layout>
  );
};

export default App;
