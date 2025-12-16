
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
import { 
  BlogPage, 
  AboutPage, 
  SecurityPage, 
  HelpCenterPage, 
  ContactPage, 
  LegalPage,
  FeaturesPage,
  ProductPage,
  PricingPage,
  GetStartedPage,
  TutorialsPage,
  NewsletterPage
} from './components/PublicInfoPages';
import { AppRoute, AuditPackage } from './types';
import { supabase } from './services/supabaseClient';

const App: React.FC = () => {
  const [session, setSession] = useState<any>(null);
  const [currentRoute, setCurrentRoute] = useState<AppRoute>(AppRoute.LANDING);
  const [generatedData, setGeneratedData] = useState<AuditPackage | null>(null);
  const [savedProjects, setSavedProjects] = useState<AuditPackage[]>([]);
  const [loading, setLoading] = useState(true);

  // Initialize Supabase Auth & Fetch Data
  useEffect(() => {
    const initSession = async () => {
        const { data: { session } } = await supabase.auth.getSession();
        setSession(session);
        if (session) {
            await fetchProjects(session.user.id);
        }
        setLoading(false);
    };
    initSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session) {
          fetchProjects(session.user.id);
          // If we just logged in, go to dashboard
          if (currentRoute === AppRoute.LANDING) {
             setCurrentRoute(AppRoute.DASHBOARD);
          }
      } else {
          setSavedProjects([]);
          setCurrentRoute(AppRoute.LANDING);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchProjects = async (userId: string) => {
    try {
        const { data, error } = await supabase
            .from('audit_projects')
            .select('*')
            .eq('user_id', userId) // Explicitly filter by user_id as a fallback/safety measure
            .order('updated_at', { ascending: false });
        
        if (error) {
            console.error('Supabase Error fetching projects:', JSON.stringify(error, null, 2));
            // Do not throw, just log. This prevents the app from crashing if the table doesn't exist yet.
            return;
        }

        if (data) {
            // Map DB structure to AuditPackage with safe content parsing
            const mapped = data.map((d: any) => ({ 
                ...(d.content && typeof d.content === 'object' ? d.content : {}), 
                id: d.id, // Use DB UUID
                user_id: d.user_id,
                savedAt: d.updated_at 
            }));
            setSavedProjects(mapped);
        }
    } catch (err) {
        console.error('Unexpected error in fetchProjects:', err);
    }
  };

  const handleLogin = async (email: string, pass: string, isSignUp: boolean) => {
      if (isSignUp) {
          return await supabase.auth.signUp({ email, password: pass });
      } else {
          return await supabase.auth.signInWithPassword({ email, password: pass });
      }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate(AppRoute.LANDING);
  };

  const navigate = (route: AppRoute, preserveData: boolean = false) => {
    if (route === AppRoute.OUTPUT_VIEWER && currentRoute !== AppRoute.OUTPUT_VIEWER && !preserveData) {
        setGeneratedData(null);
    }
    setCurrentRoute(route);
    window.location.hash = route;
    window.scrollTo(0,0);
  };

  const handleAuditGenerationComplete = (data: AuditPackage) => {
    setGeneratedData(data);
    navigate(AppRoute.OUTPUT_VIEWER, true);
  };

  const handleSaveProject = async (data: AuditPackage) => {
    if (!session) return;
    
    // Clean payload for JSONB storage
    const contentToSave = { ...data };
    // These specific keys are stored in separate columns in the DB, so remove them from the JSONB blob to avoid duplication
    delete contentToSave.id; 
    delete contentToSave.savedAt;
    delete contentToSave.user_id;

    // Ensure all critical sections are present
    const payloadContent = {
        project_title: data.project_title,
        process_flow: data.process_flow || [],
        raci_matrix: data.raci_matrix || [],
        risks: data.risks || [],
        controls: data.controls || [],
        control_objectives: data.control_objectives || [],
        key_controls: data.key_controls || [],
        test_plans: data.test_plans || [],
        evidence_checklist: data.evidence_checklist || [],
        audit_score: data.audit_score || {},
        framework_mapping: data.framework_mapping || [],
        checklist: data.checklist || [],
        gaps: data.gaps || [],
        audit_meta: data.audit_meta || {},
        ...contentToSave // Catch any other properties
    };

    const payload = {
        user_id: session.user.id,
        title: data.project_title || data.process_flow[0]?.title || 'Untitled Project',
        content: payloadContent,
        updated_at: new Date().toISOString()
    };
    
    let result;
    if (data.id) {
        // Update existing project
        result = await supabase
            .from('audit_projects')
            .update(payload)
            .eq('id', data.id)
            .select();
    } else {
        // Insert new project
        result = await supabase
            .from('audit_projects')
            .insert([payload])
            .select();
    }
    
    if (result.error) {
        console.error('Error saving:', JSON.stringify(result.error, null, 2));
        alert('Failed to save project to database. See console for details.');
    } else {
        const savedItem = result.data[0];
        
        // Construct complete object from DB response
        const newPackage: AuditPackage = { 
            ...(savedItem.content as object), 
            id: savedItem.id, 
            user_id: savedItem.user_id,
            savedAt: savedItem.updated_at 
        } as AuditPackage;
        
        // Update Local State List
        setSavedProjects(prev => {
            const exists = prev.find(p => p.id === newPackage.id);
            if (exists) return prev.map(p => p.id === newPackage.id ? newPackage : p);
            return [newPackage, ...prev];
        });
        
        // Update Current View Data to include the new DB ID (if it was a new insert)
        setGeneratedData(newPackage);
    }
  };

  const handleViewProject = (data: AuditPackage) => {
    setGeneratedData(data);
    navigate(AppRoute.OUTPUT_VIEWER, true);
  };

  const handleBackToProjects = () => {
    setGeneratedData(null);
  };

  // Enhanced Update Handler with Auto-Save
  const handleUpdateProject = async (updates: Partial<AuditPackage>) => {
    if (generatedData) {
        const newData = { ...generatedData, ...updates };
        setGeneratedData(newData);

        // If the project is already saved in Supabase (has an ID), auto-save the changes
        if (newData.id && session) {
             const contentToSave = { ...newData };
             // Clean up root properties before saving content JSONB
             delete contentToSave.id;
             delete contentToSave.savedAt;
             delete contentToSave.user_id;

             try {
                 const { error } = await supabase
                    .from('audit_projects')
                    .update({ 
                        title: newData.project_title || newData.process_flow[0]?.title,
                        content: contentToSave,
                        updated_at: new Date().toISOString()
                    })
                    .eq('id', newData.id);
                 
                 if (error) console.error("Auto-save failed:", error);
                 else {
                     // Update local list to reflect new timestamp/data
                     setSavedProjects(prev => prev.map(p => p.id === newData.id ? { ...newData, savedAt: new Date().toISOString() } : p));
                 }
             } catch (err) {
                 console.error("Auto-save exception:", err);
             }
        }
    }
  };

  if (loading) {
      return <div className="min-h-screen bg-techBlack flex items-center justify-center text-white">Loading...</div>;
  }

  // --- PUBLIC ROUTES ---
  if (!session) {
      if (currentRoute === AppRoute.BLOG) return <BlogPage navigate={navigate} route={currentRoute} />;
      if (currentRoute === AppRoute.ABOUT) return <AboutPage navigate={navigate} route={currentRoute} />;
      if (currentRoute === AppRoute.SECURITY) return <SecurityPage navigate={navigate} route={currentRoute} />;
      if (currentRoute === AppRoute.HELP || currentRoute === AppRoute.FAQ) return <HelpCenterPage navigate={navigate} route={currentRoute} />;
      if (currentRoute === AppRoute.TUTORIALS) return <TutorialsPage navigate={navigate} route={currentRoute} />;
      if (currentRoute === AppRoute.CONTACT) return <ContactPage navigate={navigate} route={currentRoute} />;
      if (currentRoute === AppRoute.PRODUCT) return <ProductPage navigate={navigate} route={currentRoute} />;
      if (currentRoute === AppRoute.FEATURES) return <FeaturesPage navigate={navigate} route={currentRoute} />;
      if (currentRoute === AppRoute.PRICING) return <PricingPage navigate={navigate} route={currentRoute} />;
      if (currentRoute === AppRoute.GET_STARTED) return <GetStartedPage navigate={navigate} route={currentRoute} />;
      if (currentRoute === AppRoute.LEGAL || currentRoute === AppRoute.TERMS) return <LegalPage type="Terms" navigate={navigate} />;
      if (currentRoute === AppRoute.PRIVACY) return <LegalPage type="Privacy" navigate={navigate} />;
      if (currentRoute === AppRoute.COOKIES) return <LegalPage type="Cookies" navigate={navigate} />;
      if (currentRoute === AppRoute.DPA) return <LegalPage type="DPA" navigate={navigate} />;
      if (currentRoute === 'newsletter' as any) return <NewsletterPage navigate={navigate} route={currentRoute} />;

      // Pass the handleLogin to LandingPage
      return <LandingPage onLogin={handleLogin} navigate={navigate} />;
  }

  // --- PROTECTED ROUTES ---
  return (
    <Layout 
      currentRoute={currentRoute} 
      navigate={navigate} 
      isLoggedIn={true}
      onLogout={handleLogout}
    >
      {currentRoute === AppRoute.DASHBOARD && (
        <Dashboard navigate={navigate} />
      )}
      
      {currentRoute === AppRoute.PROJECT_WIZARD && (
        <ProjectWorkspace onComplete={handleAuditGenerationComplete} navigate={navigate} />
      )}
      
      {currentRoute === AppRoute.OUTPUT_VIEWER && (
        <OutputViewer 
            data={generatedData} 
            savedProjects={savedProjects}
            onSave={handleSaveProject}
            onBack={handleBackToProjects}
            onSelectProject={handleViewProject}
            onNavigateToChecklist={() => navigate(AppRoute.CHECKLIST, true)}
            navigate={navigate}
        />
      )}

      {currentRoute === AppRoute.CHECKLIST && (
         <ChecklistMode 
            data={generatedData} 
            navigate={navigate} 
            onUpdate={(checklist) => handleUpdateProject({ checklist })}
         />
      )}

      {currentRoute === AppRoute.GAP_TRACKING && (
         <GapTracking 
            data={generatedData} 
            navigate={navigate}
            onUpdate={(gaps) => handleUpdateProject({ gaps })}
         />
      )}

      {currentRoute === AppRoute.RENEWAL && (
          <RenewalMode 
            data={generatedData}
            navigate={navigate}
            onUpdate={(audit_meta) => handleUpdateProject({ audit_meta })} 
          />
      )}

      {currentRoute === AppRoute.TEAM && (
          <TeamManagement />
      )}

      {currentRoute === AppRoute.SETTINGS && (
          <Settings />
      )}
    </Layout>
  );
};

export default App;
