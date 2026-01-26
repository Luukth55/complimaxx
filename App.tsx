
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
import { AppRoute, AuditPackage, UserProfile, ChecklistItem, Gap } from './types';
import { storageService } from './services/storageService';
import { supabase } from './services/supabaseClient';

const App: React.FC = () => {
  const [session, setSession] = useState<any>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
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
      } else {
        setLoading(false);
      }

      const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
        setSession(session);
        if (session) {
          await loadUserData(session.user.id);
        } else {
          setProfile(null);
          setSavedProjects([]);
          setCurrentRoute(AppRoute.LANDING);
          setLoading(false);
        }
      });

      return () => subscription.unsubscribe();
    };

    initAuth();
  }, []);

  const loadUserData = async (userId: string) => {
    setLoading(true);
    try {
      // Parallel laden voor snelheid
      const [projects, profileResult] = await Promise.all([
        storageService.getProjects(userId),
        supabase.from('profiles').select('*').eq('id', userId).single()
      ]);

      setSavedProjects(projects);
      
      if (profileResult.data) {
        setProfile(profileResult.data as UserProfile);
      } else {
        // Als profiel er nog niet is (door trigger delay), probeer het na 2 seconden nog eens
        setTimeout(async () => {
          const { data: retryData } = await supabase.from('profiles').select('*').eq('id', userId).single();
          if (retryData) setProfile(retryData as UserProfile);
        }, 2000);
      }
    } catch (err) {
      console.error('Error loading user data:', err);
    } finally {
      setLoading(false);
    }
  };

  const navigate = (route: AppRoute) => {
    setCurrentRoute(route);
    window.scrollTo(0,0);
  };

  const handleAuditGenerationComplete = async (data: AuditPackage) => {
    setIsSyncing(true);
    const userId = session?.user?.id;
    
    const initialChecklist: ChecklistItem[] = data.controls.map((c, i) => ({
        id: `T-${Date.now()}-${i}`,
        requirement: `${c.title} Implementation`,
        description: c.description,
        status: 'Not Started',
        assignedTo: c.owner || 'Process Owner',
        dueDate: new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0],
        framework: c.framework_mapping[0]?.framework || 'General',
        category: 'Control',
        priority: i < 3 ? 'High' : 'Medium',
        difficulty: 'Medium',
        recurrence: 'Yearly',
        evidenceFiles: [],
        evidenceNotes: '',
        linkedControl: c.id
    }));

    const enrichedData: AuditPackage = {
        ...data,
        checklist: initialChecklist,
        gaps: [],
        audit_meta: {
            last_audit_date: '-',
            next_audit_date: new Date(Date.now() + 90 * 86400000).toISOString().split('T')[0],
            frequency: 'Annual'
        }
    };

    const saved = await storageService.saveProject(enrichedData, userId);
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
      setSavedProjects(prev => prev.map(p => p.id === saved.id ? saved : p));
    } catch (err) {
      console.error('Save failed:', err);
    } finally {
      setIsSyncing(false);
    }
  };

  const handleUpdateProject = async (updates: Partial<AuditPackage>) => {
    if (activeProject) {
      const newData = { ...activeProject, ...updates };
      setActiveProject(newData);
      await handleSaveProject(newData);
    }
  };

  const handleAuthAction = async (email: string, pass: string, isSignup: boolean, extra?: any) => {
    let authResult;
    setLoading(true);
    if (isSignup) {
      authResult = await supabase.auth.signUp({ 
        email, 
        password: pass,
        options: { data: { first_name: extra?.firstName, last_name: extra?.lastName } }
      });
      if (authResult.error) {
        setLoading(false);
        throw authResult.error;
      }
    } else {
      authResult = await supabase.auth.signInWithPassword({ email, password: pass });
      if (authResult.error) {
        setLoading(false);
        throw authResult.error;
      }
    }

    if (authResult.data.user) {
      await loadUserData(authResult.data.user.id);
      navigate(AppRoute.DASHBOARD);
    }
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
        <div className="relative mb-8">
            <div className="w-16 h-16 border-4 border-brightBlue border-t-transparent rounded-full animate-spin"></div>
            <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-2 h-2 bg-brightBlue rounded-full animate-pulse"></div>
            </div>
        </div>
        <h2 className="text-sm font-black tracking-[0.5em] text-steelGrey uppercase animate-pulse">Syncing Workspace</h2>
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
      {currentRoute === AppRoute.PROJECT_WIZARD && (
        <ProjectWorkspace 
          onComplete={handleAuditGenerationComplete} 
          navigate={navigate} 
          profile={profile} 
        />
      )}
      {currentRoute === AppRoute.OUTPUT_VIEWER && (
        <OutputViewer 
          data={activeProject} 
          savedProjects={savedProjects}
          onSave={handleSaveProject}
          onDelete={async (id) => { 
            await storageService.deleteProject(id); 
            await loadUserData(session.user.id); 
            setActiveProject(null); 
          }}
          onBack={() => { setActiveProject(null); navigate(AppRoute.DASHBOARD); }}
          onSelectProject={(d) => { setActiveProject(d); }}
          onNavigateToChecklist={() => navigate(AppRoute.CHECKLIST)}
          navigate={navigate}
        />
      )}
      {currentRoute === AppRoute.CHECKLIST && (
          <ChecklistMode 
            data={activeProject} 
            navigate={navigate} 
            onUpdate={(checklist) => handleUpdateProject({ checklist })} 
          />
      )}
      {currentRoute === AppRoute.GAP_TRACKING && (
          <GapTracking 
            data={activeProject} 
            navigate={navigate} 
            onUpdate={(gaps) => handleUpdateProject({ gaps })} 
          />
      )}
      {currentRoute === AppRoute.RENEWAL && (
        <RenewalMode 
          data={activeProject} 
          navigate={navigate} 
          profile={profile}
          onUpdate={(audit_meta) => handleUpdateProject({ audit_meta })} 
          onChecklistUpdate={(checklist) => handleUpdateProject({ checklist })} 
          onRefreshProfile={() => loadUserData(session.user.id)}
        />
      )}
      {currentRoute === AppRoute.TEAM && <TeamManagement profile={profile} navigate={navigate} />}
      {currentRoute === AppRoute.SETTINGS && <Settings profile={profile} onRefresh={() => loadUserData(session.user.id)} />}
    </Layout>
  );
};

export default App;
