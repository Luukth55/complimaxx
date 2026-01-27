
import React, { useState, useEffect, useCallback, Component, ErrorInfo, ReactNode } from 'react';
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
import { AppRoute, AuditPackage, UserProfile } from './types';
import { supabase } from './services/supabaseClient';
import { storageService } from './services/storageService';

// Error Boundary to catch runtime errors in the workspace
class ErrorBoundary extends Component<{children: ReactNode}, {hasError: boolean, error: Error | null}> {
  constructor(props: {children: ReactNode}) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }
  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }
  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-techBlack text-white flex items-center justify-center p-8">
          <div className="bg-obsidianNavy border border-riskHigh/30 p-12 rounded-[40px] max-w-xl text-center shadow-2xl">
            <AlertCircle size={64} className="text-riskHigh mx-auto mb-8" />
            <h1 className="text-3xl font-black mb-4 uppercase tracking-tighter">System Error</h1>
            <p className="text-steelGrey mb-8 leading-relaxed">The neural workspace encountered a critical error. This session has been isolated to prevent data corruption.</p>
            <div className="bg-black/40 p-4 rounded-xl text-left text-xs font-mono text-riskHigh mb-8 overflow-auto max-h-40 border border-white/5">
              {this.state.error?.message}
            </div>
            <button onClick={() => window.location.reload()} className="bg-brightBlue hover:bg-blue-600 text-white px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-[0.4em] shadow-lg transition-all">
              Re-initialize Session
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

const App: React.FC = () => {
  const [currentRoute, setCurrentRoute] = useState<AppRoute>(AppRoute.LANDING);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [currentProject, setCurrentProject] = useState<AuditPackage | null>(null);
  const [savedProjects, setSavedProjects] = useState<AuditPackage[]>([]);
  const [isSyncing, setIsSyncing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Sync user profile from database
  const refreshProfile = useCallback(async (userId: string) => {
    try {
      const { data, error } = await supabase.from('profiles').select('*').eq('id', userId).single();
      if (error) throw error;
      setUserProfile(data);
    } catch (err) {
      console.error("Profile refresh failed:", err);
    }
  }, []);

  // Fetch projects from storage service
  const fetchProjects = useCallback(async (userId: string) => {
    setIsSyncing(true);
    try {
      const projects = await storageService.getProjects(userId);
      setSavedProjects(projects);
    } catch (err) {
      console.error("Project fetch failed:", err);
    } finally {
      setIsSyncing(false);
    }
  }, []);

  // Initialize Auth state and subscribe to changes
  useEffect(() => {
    const initAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        setIsLoggedIn(true);
        await refreshProfile(session.user.id);
        await fetchProjects(session.user.id);
        setCurrentRoute(AppRoute.DASHBOARD);
      }
      setIsLoading(false);
    };

    initAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session) {
        setIsLoggedIn(true);
        await refreshProfile(session.user.id);
        await fetchProjects(session.user.id);
        if (currentRoute === AppRoute.LANDING || currentRoute === AppRoute.LOGIN) {
          setCurrentRoute(AppRoute.DASHBOARD);
        }
      } else {
        setIsLoggedIn(false);
        setUserProfile(null);
        setSavedProjects([]);
        setCurrentProject(null);
        setCurrentRoute(AppRoute.LANDING);
      }
    });

    return () => subscription.unsubscribe();
  }, [refreshProfile, fetchProjects]);

  // Centralized navigation handler
  const handleNavigate = (route: AppRoute) => {
    setCurrentRoute(route);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Auth operations
  const handleLogin = async (email: string, pass: string, isSignup: boolean, extra?: { firstName: string, lastName: string }) => {
    if (isSignup) {
      const { data, error } = await supabase.auth.signUp({
        email,
        password: pass,
        options: {
          data: {
            first_name: extra?.firstName || '',
            last_name: extra?.lastName || '',
          }
        }
      });
      if (error) throw error;
      return data;
    } else {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password: pass });
      if (error) throw error;
      return data;
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  // Project lifecycle management
  const handleProjectComplete = async (data: AuditPackage) => {
    if (userProfile) {
      const saved = await storageService.saveProject(data, userProfile.id);
      setCurrentProject(saved);
      await fetchProjects(userProfile.id);
      setCurrentRoute(AppRoute.OUTPUT_VIEWER);
    }
  };

  const handleSaveProject = async (data: AuditPackage) => {
    if (userProfile) {
      setIsSyncing(true);
      const saved = await storageService.saveProject(data, userProfile.id);
      setCurrentProject(saved);
      await fetchProjects(userProfile.id);
      setIsSyncing(false);
    }
  };

  const handleDeleteProject = async (id: string) => {
    if (confirm("Permanently delete this project?")) {
      const success = await storageService.deleteProject(id);
      if (success && userProfile) {
        if (currentProject?.id === id) setCurrentProject(null);
        await fetchProjects(userProfile.id);
      }
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-techBlack flex items-center justify-center">
        <Loader2 className="animate-spin text-brightBlue" size={48} />
      </div>
    );
  }

  const renderContent = () => {
    switch (currentRoute) {
      case AppRoute.LANDING:
        return <LandingPage onEnterWorkspace={() => handleNavigate(isLoggedIn ? AppRoute.DASHBOARD : AppRoute.LOGIN)} navigate={handleNavigate} />;
      case AppRoute.LOGIN:
        return <AuthPage onLogin={handleLogin} navigate={handleNavigate} />;
      case AppRoute.DASHBOARD:
        return <Dashboard navigate={handleNavigate} savedProjects={savedProjects} profile={userProfile} onSelectProject={(p) => { setCurrentProject(p); handleNavigate(AppRoute.OUTPUT_VIEWER); }} />;
      case AppRoute.PROJECT_WIZARD:
        return <ProjectWorkspace onComplete={handleProjectComplete} navigate={handleNavigate} profile={userProfile} />;
      case AppRoute.OUTPUT_VIEWER:
        return <OutputViewer data={currentProject} savedProjects={savedProjects} onSave={handleSaveProject} onDelete={handleDeleteProject} onBack={() => handleNavigate(AppRoute.DASHBOARD)} onSelectProject={(p) => setCurrentProject(p)} navigate={handleNavigate} />;
      case AppRoute.CHECKLIST:
        return <ChecklistMode data={currentProject} navigate={handleNavigate} onUpdate={(items) => currentProject && handleSaveProject({ ...currentProject, checklist: items })} />;
      case AppRoute.GAP_TRACKING:
        return <GapTracking data={currentProject} navigate={handleNavigate} onUpdate={(gaps) => currentProject && handleSaveProject({ ...currentProject, gaps: gaps })} />;
      case AppRoute.RENEWAL:
        return <RenewalMode data={currentProject} navigate={handleNavigate} onChecklistUpdate={(items) => currentProject && handleSaveProject({ ...currentProject, checklist: items })} profile={userProfile} onRefreshProfile={() => userProfile && refreshProfile(userProfile.id)} />;
      case AppRoute.TEAM:
        return <TeamManagement profile={userProfile} navigate={handleNavigate} />;
      case AppRoute.SETTINGS:
        return <Settings profile={userProfile} onRefresh={() => userProfile && refreshProfile(userProfile.id)} />;
      
      // Public Information Pages
      case AppRoute.FEATURES: return <FeaturesPage navigate={handleNavigate} />;
      case AppRoute.PRICING: return <PricingPage navigate={handleNavigate} />;
      case AppRoute.ABOUT: return <AboutPage navigate={handleNavigate} />;
      case AppRoute.CONTACT: return <ContactPage navigate={handleNavigate} />;
      case AppRoute.SECURITY: return <SecurityPage navigate={handleNavigate} />;
      case AppRoute.PRIVACY: return <LegalPage navigate={handleNavigate} type="Privacy Policy" />;
      case AppRoute.TERMS: return <LegalPage navigate={handleNavigate} type="Terms of Service" />;
      case AppRoute.COOKIES: return <LegalPage navigate={handleNavigate} type="Cookie Policy" />;
      case AppRoute.HELP: return <HelpCenterPage navigate={handleNavigate} />;
      case AppRoute.TUTORIALS: return <TutorialsPage navigate={handleNavigate} />;
      case AppRoute.FAQ: return <FAQPage navigate={handleNavigate} />;
      case AppRoute.GET_STARTED: return <GetStartedPage navigate={handleNavigate} />;
      
      default:
        return <Dashboard navigate={handleNavigate} savedProjects={savedProjects} profile={userProfile} onSelectProject={(p) => { setCurrentProject(p); handleNavigate(AppRoute.OUTPUT_VIEWER); }} />;
    }
  };

  return (
    <ErrorBoundary>
      <Layout 
        currentRoute={currentRoute} 
        navigate={handleNavigate} 
        isLoggedIn={isLoggedIn} 
        onLogout={handleLogout}
        isSyncing={isSyncing}
      >
        {renderContent()}
      </Layout>
    </ErrorBoundary>
  );
};

export default App;
