
import React, { useState, useEffect } from 'react';
import Layout from './components/Layout';
import LandingPage from './components/LandingPage';
import AuthPage from './components/AuthPage';
import Dashboard from './components/Dashboard';
import ProjectWorkspace from './components/ProjectWorkspace';
import OutputViewer from './components/OutputViewer';
import ChecklistMode from './components/ChecklistMode';
import GapTracking from './components/GapTracking';
import RenewalMode from './components/RenewalMode';
import TeamManagement from './components/TeamManagement';
import Settings from './components/Settings';
import { AppRoute, AuditPackage, ChecklistItem } from './types';
import { supabase, isSupabaseConfigured } from './services/supabaseClient';
import { storageService } from './services/storageService';
import { Database, AlertTriangle, Copy, CheckCircle, ExternalLink, Code, ChevronDown, ChevronUp, Info, Key } from 'lucide-react';

const DatabaseFixHelper = () => {
    const [copied, setCopied] = useState(false);
    const [isExpanded, setIsExpanded] = useState(false);
    
    const sql = `-- COMPLIMAXX DATABASE SETUP & FIX
CREATE TABLE IF NOT EXISTS public.profiles (
  id uuid REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  full_name text,
  company_name text,
  industry text,
  role text DEFAULT 'Editor',
  updated_at timestamp with time zone DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.audit_projects (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES auth.users NOT NULL,
  title text NOT NULL,
  frameworks text[] DEFAULT '{}',
  readiness_score integer DEFAULT 0,
  status text DEFAULT 'In Progress',
  content jsonb NOT NULL,
  updated_at timestamp with time zone DEFAULT now()
);

ALTER TABLE public.audit_projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users can manage their own projects') THEN
        CREATE POLICY "Users can manage their own projects" ON public.audit_projects FOR ALL USING (auth.uid() = user_id);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users can manage their own profile') THEN
        CREATE POLICY "Users can manage their own profile" ON public.profiles FOR ALL USING (auth.uid() = id);
    END IF;
END $$;`;

    const handleCopy = () => {
        navigator.clipboard.writeText(sql);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className={`mb-6 bg-emerald-500/5 border border-emerald-500/20 p-4 rounded-xl transition-all duration-300`}>
            <div className="flex items-center justify-between cursor-pointer" onClick={() => setIsExpanded(!isExpanded)}>
                <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg bg-emerald-500/20 text-emerald-500`}>
                        <Database size={18} />
                    </div>
                    <div>
                        <h3 className="text-sm font-bold text-white">
                            API Verbinding Actief
                        </h3>
                        <p className="text-xs text-steelGrey">
                            Vergeet niet het SQL script uit te voeren in Supabase om opslag te activeren.
                        </p>
                    </div>
                </div>
                <button className="text-steelGrey p-1 hover:text-white">
                    {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                </button>
            </div>

            {isExpanded && (
                <div className="mt-4 pt-4 border-t border-white/5 animate-fadeIn">
                    <p className="text-xs text-steelGrey mb-4 leading-relaxed">
                        Plak de onderstaande SQL in de <strong>SQL Editor</strong> van je Supabase dashboard om de benodigde tabellen aan te maken. Zonder dit script kunnen projecten niet worden opgeslagen.
                    </p>
                    
                    <div className="relative group">
                        <div className="flex items-center justify-between bg-black/40 px-3 py-1.5 border-x border-t border-deepDivider rounded-t-lg">
                            <span className="text-[10px] font-bold text-steelGrey uppercase flex items-center">
                                <Code size={12} className="mr-2" /> setup_complimaxx.sql
                            </span>
                            <button onClick={handleCopy} className="text-[10px] text-brightBlue hover:text-white transition-colors flex items-center font-bold">
                                {copied ? <><CheckCircle size={10} className="mr-1" /> Gekopieerd</> : <><Copy size={10} className="mr-1" /> Kopieer SQL</>}
                            </button>
                        </div>
                        <pre className="bg-black/60 p-4 rounded-b-lg text-[10px] font-mono text-steelGrey border border-deepDivider overflow-x-auto max-h-32 custom-scrollbar">
                            {sql}
                        </pre>
                    </div>

                    <div className="mt-4 flex items-center gap-3">
                        <a href="https://supabase.com/dashboard/project/oawunlaetnhsgxhvytuz/sql" target="_blank" rel="noopener noreferrer" className="bg-white text-techBlack px-4 py-2 rounded-lg font-bold text-xs flex items-center transition-all hover:bg-gray-200">
                            Open SQL Editor in Dashboard <ExternalLink size={12} className="ml-2" />
                        </a>
                    </div>
                </div>
            )}
        </div>
    );
};

const App: React.FC = () => {
  const [session, setSession] = useState<any>(null);
  const [currentRoute, setCurrentRoute] = useState<AppRoute>(AppRoute.LANDING);
  const [generatedData, setGeneratedData] = useState<AuditPackage | null>(null);
  const [savedProjects, setSavedProjects] = useState<AuditPackage[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      loadAppData(session?.user?.id);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      loadAppData(session?.user?.id);
      if (session) {
        if (currentRoute === AppRoute.LANDING || currentRoute === AppRoute.LOGIN) {
            setCurrentRoute(AppRoute.DASHBOARD);
        }
      } else {
          setCurrentRoute(AppRoute.LANDING);
      }
    });

    return () => subscription.unsubscribe();
  }, [currentRoute]);

  const loadAppData = async (userId?: string) => {
    setLoading(true);
    try {
      const projects = await storageService.getProjects(userId);
      setSavedProjects(projects);
    } catch (err) {
      console.error('Error loading data:', err);
    } finally {
      setLoading(false);
    }
  };

  const navigate = (route: AppRoute, preserveData: boolean = false) => {
    if (route === AppRoute.OUTPUT_VIEWER && currentRoute !== AppRoute.OUTPUT_VIEWER && !preserveData) {
      setGeneratedData(null);
    }
    setCurrentRoute(route);
    window.scrollTo(0,0);
  };

  const handleAuditGenerationComplete = (data: AuditPackage) => {
    setGeneratedData(data);
    navigate(AppRoute.OUTPUT_VIEWER, true);
  };

  const handleSaveProject = async (data: AuditPackage) => {
    try {
      const saved = await storageService.saveProject(data, session?.user?.id);
      setGeneratedData(saved);
      setSavedProjects(prev => {
        const exists = prev.find(p => p.id === saved.id);
        if (exists) return prev.map(p => p.id === saved.id ? saved : p);
        return [saved, ...prev];
      });
    } catch (err) {
      console.error('Save failed:', err);
    }
  };

  const handleUpdateProject = (updates: Partial<AuditPackage>) => {
    if (generatedData) {
      const newData = { ...generatedData, ...updates };
      setGeneratedData(newData);
      handleSaveProject(newData);
    }
  };

  const handleAuthAction = async (email: string, pass: string, isSignup: boolean) => {
      if (isSignup) {
          const { error } = await supabase.auth.signUp({ email, password: pass });
          if (error) throw error;
      } else {
          const { error } = await supabase.auth.signInWithPassword({ email, password: pass });
          if (error) throw error;
      }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-techBlack flex flex-col items-center justify-center text-white p-6">
        <div className="w-12 h-12 border-4 border-brightBlue border-t-transparent rounded-full animate-spin mb-6"></div>
        <h2 className="text-lg font-bold tracking-tight">Complimaxx Workspace laden...</h2>
      </div>
    );
  }

  // PUBLIC ROUTES (NOT LOGGED IN)
  if (!session) {
      if (currentRoute === AppRoute.LOGIN) return <AuthPage onLogin={handleAuthAction} navigate={navigate} />;
      return <LandingPage onEnterWorkspace={() => setCurrentRoute(AppRoute.LOGIN)} navigate={navigate} />;
  }

  // PROTECTED ROUTES (LOGGED IN)
  return (
    <Layout currentRoute={currentRoute} navigate={navigate} isLoggedIn={true} onLogout={() => supabase.auth.signOut()}>
      <DatabaseFixHelper />
      
      {currentRoute === AppRoute.DASHBOARD && <Dashboard navigate={navigate} />}
      {currentRoute === AppRoute.PROJECT_WIZARD && <ProjectWorkspace onComplete={handleAuditGenerationComplete} navigate={navigate} />}
      {currentRoute === AppRoute.OUTPUT_VIEWER && (
        <OutputViewer 
          data={generatedData} 
          savedProjects={savedProjects}
          onSave={handleSaveProject}
          onBack={() => setGeneratedData(null)}
          onSelectProject={(d) => { setGeneratedData(d); navigate(AppRoute.OUTPUT_VIEWER, true); }}
          onNavigateToChecklist={() => navigate(AppRoute.CHECKLIST, true)}
          navigate={navigate}
        />
      )}
      {currentRoute === AppRoute.CHECKLIST && <ChecklistMode data={generatedData} navigate={navigate} onUpdate={(checklist) => handleUpdateProject({ checklist })} />}
      {currentRoute === AppRoute.GAP_TRACKING && <GapTracking data={generatedData} navigate={navigate} onUpdate={(gaps) => handleUpdateProject({ gaps })} />}
      {currentRoute === AppRoute.RENEWAL && <RenewalMode data={generatedData} navigate={navigate} onUpdate={(audit_meta) => handleUpdateProject({ audit_meta })} onChecklistUpdate={(checklist) => handleUpdateProject({ checklist })} />}
      {currentRoute === AppRoute.TEAM && <TeamManagement />}
      {currentRoute === AppRoute.SETTINGS && <Settings />}
    </Layout>
  );
};

export default App;
