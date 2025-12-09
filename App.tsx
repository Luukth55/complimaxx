
import React, { useState } from 'react';
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
import { AppRoute, AuditPackage } from './types';

const App: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentRoute, setCurrentRoute] = useState<AppRoute>(AppRoute.LANDING);
  const [generatedData, setGeneratedData] = useState<AuditPackage | null>(null);
  const [savedProjects, setSavedProjects] = useState<AuditPackage[]>([]);

  // Updated navigate function to accept preserveData flag
  const navigate = (route: AppRoute, preserveData: boolean = false) => {
    // If navigating to My Projects explicitly (e.g. from sidebar), clear data so the list is shown.
    // BUT if preserveData is true (coming from Generator), keep the data.
    if (route === AppRoute.OUTPUT_VIEWER && currentRoute !== AppRoute.OUTPUT_VIEWER && !preserveData) {
        setGeneratedData(null);
    }
    setCurrentRoute(route);
    window.location.hash = route;
  };

  const handleLogin = () => {
    setIsLoggedIn(true);
    navigate(AppRoute.DASHBOARD);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    navigate(AppRoute.LANDING);
  };

  const handleAuditGenerationComplete = (data: AuditPackage) => {
    setGeneratedData(data);
    // Explicitly preserve data when moving to viewer after generation
    navigate(AppRoute.OUTPUT_VIEWER, true);
  };

  const handleSaveProject = (data: AuditPackage) => {
    const timestamp = new Date().toISOString();
    // Check if project with same title already exists to avoid duplicates (simplified)
    const exists = savedProjects.some(p => p.process_flow[0]?.title === data.process_flow[0]?.title);
    
    if (!exists) {
        setSavedProjects(prev => [{ ...data, savedAt: timestamp }, ...prev]);
    } else {
        // Update existing project
         setSavedProjects(prev => prev.map(p => 
            p.process_flow[0]?.title === data.process_flow[0]?.title ? { ...data, savedAt: timestamp } : p
         ));
    }
  };

  const handleViewProject = (data: AuditPackage) => {
    setGeneratedData(data);
  };

  const handleBackToProjects = () => {
    setGeneratedData(null);
  };

  const handleUpdateProject = (updates: Partial<AuditPackage>) => {
    if (generatedData) {
        setGeneratedData({ ...generatedData, ...updates });
    }
  };

  if (!isLoggedIn) {
    return <LandingPage onLogin={handleLogin} />;
  }

  return (
    <Layout 
      currentRoute={currentRoute} 
      navigate={navigate} 
      isLoggedIn={isLoggedIn}
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
          <RenewalMode navigate={navigate} />
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