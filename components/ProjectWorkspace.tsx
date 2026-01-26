
import React, { useState, useEffect } from 'react';
import { 
  Shield, Lock, Database, Zap, Check, AlertTriangle, ArrowRight, Clock, ShieldCheck, Cpu, ChevronRight, ChevronLeft, Loader2
} from 'lucide-react';
import { generateAuditPackage } from '../services/geminiService';
import { AuditPackage, AppRoute, UserProfile } from '../types';
import { storageService } from '../services/storageService';

interface ProjectWorkspaceProps {
  onComplete: (data: AuditPackage) => void;
  navigate: (route: AppRoute) => void;
  profile: UserProfile | null;
}

const FRAMEWORK_CATEGORIES = [
  {
    name: "Dutch & Regional (NEN/BIO)",
    icon: ShieldCheck,
    frameworks: ["NEN 7510 (Zorg)", "BIO (Overheid)", "ISAE 3402 Type II", "NEN-EN-ISO 9001"]
  },
  {
    name: "Information Security (ISO/SOC)",
    icon: Shield,
    frameworks: ["ISO 27001", "NIST CSF", "SOC 2"]
  },
  {
    name: "Privacy & AI",
    icon: Lock,
    frameworks: ["GDPR / AVG (EU)", "EU AI ACT", "ISO 42001"]
  }
];

const ProjectWorkspace: React.FC<ProjectWorkspaceProps> = ({ onComplete, navigate, profile }) => {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [loadingStatus, setLoadingStatus] = useState('Initializing Engine...');
  const [error, setError] = useState<string | null>(null);
  
  const [processName, setProcessName] = useState('');
  const [description, setDescription] = useState('');
  const [selectedFrameworks, setSelectedFrameworks] = useState<string[]>([]);
  
  const [contextAnswers, setContextAnswers] = useState({
    operationalGoal: '',
    trigger: '',
    systems: '',
    dataSensitivity: 'Internal'
  });

  const frameworkLimit = profile?.framework_limit ?? 2;
  const isEnterprise = profile?.plan === 'Enterprise';
  const creditsRemaining = profile?.credits_remaining ?? 15; // Fallback naar 15 bij nieuwe users

  // Animatie voor de loading status
  useEffect(() => {
    if (loading) {
      const statuses = [
        "Analyzing process context...",
        "Identifying framework-specific risks...",
        "Generating control objectives...",
        "Designing RACI accountability matrix...",
        "Structuring evidence checklist...",
        "Calculating initial audit score..."
      ];
      let i = 0;
      const interval = setInterval(() => {
        setLoadingStatus(statuses[i % statuses.length]);
        i++;
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [loading]);

  const toggleFramework = (fw: string) => {
    if (selectedFrameworks.includes(fw)) {
      setSelectedFrameworks(prev => prev.filter(f => f !== fw));
    } else {
      if (selectedFrameworks.length >= frameworkLimit) {
        setError(`Your current plan only supports ${frameworkLimit} frameworks. Upgrade in Settings for more.`);
        return;
      }
      setError(null);
      setSelectedFrameworks(prev => [...prev, fw]);
    }
  };

  const handleNextStep = (e: React.FormEvent) => {
    e.preventDefault();
    if (!processName || !description || selectedFrameworks.length === 0) {
      setError("Please complete all fields and select at least one framework.");
      return;
    }
    setError(null);
    setStep(2);
    window.scrollTo({top: 0, behavior: 'smooth'});
  };

  const handleGenerate = async () => {
    // Geen harde blokkade meer op profile, we proberen gewoon de credit-check in storageService
    if (!isEnterprise && creditsRemaining <= 0 && profile) {
      setError("No AI credits remaining. Please upgrade your plan in Settings.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // 1. Generate via AI
      const fullContext = `
        Process: ${processName}
        Description: ${description}
        Goal: ${contextAnswers.operationalGoal}
        Systems: ${contextAnswers.systems}
        Trigger: ${contextAnswers.trigger}
        Data Sensitivity: ${contextAnswers.dataSensitivity}
      `;

      const data = await generateAuditPackage(
        processName, 
        fullContext, 
        selectedFrameworks
      );
      
      // 2. Deduct credit (StorageService handelt checks op background af)
      if (profile) {
        await storageService.deductCredit(profile.id);
      }

      data.project_title = processName;
      onComplete(data);
    } catch (err: any) {
      console.error("Generation Error:", err);
      setError(err.message || "Failed to generate audit pack. The AI engine timed out. Try again with a shorter description.");
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-[70vh] text-center animate-fadeIn">
        <div className="relative mb-12">
           <div className="w-24 h-24 border-b-4 border-brightBlue rounded-full animate-spin"></div>
           <Cpu className="absolute inset-0 m-auto text-brightBlue animate-pulse" size={32} />
        </div>
        <h2 className="text-3xl font-black text-white mb-2 uppercase tracking-tighter">Neural Assembly</h2>
        <p className="text-steelGrey font-mono text-[10px] uppercase tracking-[0.4em] animate-pulse">{loadingStatus}</p>
        <div className="mt-12 max-w-xs w-full h-1 bg-white/5 rounded-full overflow-hidden">
            <div className="h-full bg-brightBlue animate-[scanLine_4s_linear_infinite] w-1/2"></div>
        </div>
      </div>
    );
  }

  const isStep1Complete = processName && description && selectedFrameworks.length > 0;

  return (
    <div className="max-w-5xl mx-auto py-8 space-y-8 pb-32">
      {/* Header */}
      <div className="flex justify-between items-end mb-4">
        <div>
          <h1 className="text-4xl font-black text-white uppercase tracking-tighter">Audit Generator</h1>
          <p className="text-steelGrey text-sm">Step {step} of 2: {step === 1 ? 'Framework & Core' : 'Operational Context'}</p>
        </div>
        <div className="bg-obsidianNavy border border-white/5 px-6 py-3 rounded-2xl flex items-center gap-4">
           {!profile && <div className="w-4 h-4 border-2 border-brightBlue/20 border-t-brightBlue rounded-full animate-spin"></div>}
           <div className="text-right">
              <p className="text-[10px] font-black text-steelGrey uppercase tracking-widest">Available Credits</p>
              <p className="text-xl font-black text-white">{isEnterprise ? '∞' : creditsRemaining}</p>
           </div>
           <Zap className="text-brightBlue" size={24} />
        </div>
      </div>

      <div className="bg-obsidianNavy border border-white/5 rounded-[40px] p-1 shadow-2xl overflow-hidden">
        <div className="bg-techBlack/40 p-10 md:p-12">
          {step === 1 && (
            <div className="space-y-10 animate-fadeIn">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                <div className="space-y-8">
                  <div className="space-y-4">
                    <label className="text-[10px] font-black text-steelGrey uppercase tracking-[0.4em] ml-1">Process Title</label>
                    <input 
                      type="text" 
                      placeholder="e.g. ISO 27001 Access Control"
                      value={processName}
                      onChange={(e) => setProcessName(e.target.value)}
                      className="w-full bg-obsidianNavy border border-white/5 rounded-2xl px-6 py-5 text-white focus:border-brightBlue outline-none font-bold placeholder:text-white/10 transition-all"
                    />
                  </div>
                  <div className="space-y-4">
                    <label className="text-[10px] font-black text-steelGrey uppercase tracking-[0.4em] ml-1">Context / Scope</label>
                    <textarea 
                      placeholder="Describe the scope, organizational goals, and current pain points for the AI to analyze..."
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      className="w-full h-64 bg-obsidianNavy border border-white/5 rounded-3xl px-6 py-6 text-white focus:border-brightBlue outline-none font-medium placeholder:text-white/10 resize-none text-sm leading-relaxed transition-all"
                    />
                  </div>
                </div>

                <div className="bg-obsidianNavy border border-white/5 rounded-[32px] p-8 flex flex-col h-full">
                  <div className="flex justify-between items-center mb-8">
                    <h3 className="text-[10px] font-black text-white uppercase tracking-[0.4em]">Standards ({selectedFrameworks.length}/{frameworkLimit})</h3>
                    {selectedFrameworks.length > 0 && (
                      <button onClick={() => setSelectedFrameworks([])} className="text-[10px] text-riskHigh font-black uppercase tracking-widest hover:underline">Clear</button>
                    )}
                  </div>
                  <div className="flex-1 space-y-8 overflow-y-auto pr-2 custom-scrollbar max-h-[450px]">
                    {FRAMEWORK_CATEGORIES.map((cat) => (
                      <div key={cat.name} className="space-y-4">
                        <div className="flex items-center gap-2 opacity-50">
                          <cat.icon size={14} />
                          <h4 className="text-[9px] font-black text-steelGrey uppercase tracking-widest">{cat.name}</h4>
                        </div>
                        <div className="grid grid-cols-1 gap-2">
                          {cat.frameworks.map(fw => {
                            const isSelected = selectedFrameworks.includes(fw);
                            return (
                              <button 
                                key={fw} 
                                onClick={() => toggleFramework(fw)}
                                className={`text-left px-5 py-4 rounded-2xl border text-[11px] font-black uppercase tracking-widest transition-all flex items-center justify-between group ${
                                  isSelected 
                                    ? 'bg-brightBlue/10 border-brightBlue text-brightBlue shadow-[0_0_20px_rgba(0,140,255,0.1)]' 
                                    : 'bg-techBlack border-white/5 text-steelGrey hover:border-white/20'
                                }`}
                              >
                                {fw}
                                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${isSelected ? 'bg-brightBlue border-brightBlue text-white' : 'border-white/10 group-hover:border-white/30'}`}>
                                  {isSelected && <Check size={12} />}
                                </div>
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {error && (
                <div className="p-5 rounded-2xl bg-riskHigh/10 border border-riskHigh/20 text-riskHigh text-xs font-black flex items-center animate-fadeIn">
                  <AlertTriangle size={18} className="mr-3 shrink-0" /> {error}
                </div>
              )}

              <div className="pt-8 border-t border-white/5 flex justify-end">
                <button 
                  onClick={handleNextStep}
                  disabled={!isStep1Complete}
                  className="group bg-brightBlue hover:bg-blue-600 disabled:opacity-30 disabled:cursor-not-allowed text-white px-12 py-5 rounded-2xl font-black text-[10px] uppercase tracking-[0.4em] shadow-xl transition-all flex items-center hover:scale-[1.02] active:scale-95"
                >
                  Define Context <ChevronRight size={18} className="ml-3 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-10 animate-fadeIn">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <div className="space-y-6">
                  <div className="space-y-4">
                    <label className="text-[10px] font-black text-steelGrey uppercase tracking-[0.4em] ml-1">Process Trigger</label>
                    <input 
                      type="text" 
                      placeholder="What event starts this lifecycle?"
                      value={contextAnswers.trigger}
                      onChange={(e) => setContextAnswers({...contextAnswers, trigger: e.target.value})}
                      className="w-full bg-obsidianNavy border border-white/5 rounded-2xl px-6 py-5 text-white focus:border-brightBlue outline-none"
                    />
                  </div>
                  <div className="space-y-4">
                    <label className="text-[10px] font-black text-steelGrey uppercase tracking-[0.4em] ml-1">Core Tech Stack</label>
                    <input 
                      type="text" 
                      placeholder="List systems (AWS, Azure, SAP, etc.)"
                      value={contextAnswers.systems}
                      onChange={(e) => setContextAnswers({...contextAnswers, systems: e.target.value})}
                      className="w-full bg-obsidianNavy border border-white/5 rounded-2xl px-6 py-5 text-white focus:border-brightBlue outline-none"
                    />
                  </div>
                </div>
                <div className="space-y-6">
                  <div className="space-y-4">
                    <label className="text-[10px] font-black text-steelGrey uppercase tracking-[0.4em] ml-1">Primary Compliance Goal</label>
                    <input 
                      type="text" 
                      placeholder="What is the desired audit outcome?"
                      value={contextAnswers.operationalGoal}
                      onChange={(e) => setContextAnswers({...contextAnswers, operationalGoal: e.target.value})}
                      className="w-full bg-obsidianNavy border border-white/5 rounded-2xl px-6 py-5 text-white focus:border-brightBlue outline-none"
                    />
                  </div>
                  <div className="space-y-4">
                    <label className="text-[10px] font-black text-steelGrey uppercase tracking-[0.4em] ml-1">Sensitivity Level</label>
                    <div className="grid grid-cols-2 gap-3">
                      {['Public', 'Internal', 'Confidential', 'Restricted'].map(lv => (
                        <button 
                          key={lv}
                          onClick={() => setContextAnswers({...contextAnswers, dataSensitivity: lv})}
                          className={`py-4 rounded-xl border text-[10px] font-black uppercase tracking-widest transition-all ${
                            contextAnswers.dataSensitivity === lv 
                              ? 'bg-brightBlue text-white border-brightBlue' 
                              : 'bg-obsidianNavy border-white/5 text-steelGrey hover:border-white/20'
                          }`}
                        >
                          {lv}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {error && (
                <div className="p-5 rounded-2xl bg-riskHigh/10 border border-riskHigh/20 text-riskHigh text-xs font-black flex items-center animate-fadeIn">
                  <AlertTriangle size={18} className="mr-3 shrink-0" /> {error}
                </div>
              )}

              <div className="pt-8 border-t border-white/5 flex justify-between items-center">
                <button onClick={() => setStep(1)} className="group text-steelGrey hover:text-white font-black text-[10px] uppercase tracking-[0.4em] flex items-center transition-all">
                  <ChevronLeft size={18} className="mr-3 group-hover:-translate-x-1 transition-transform" /> Back
                </button>
                <button 
                  onClick={handleGenerate}
                  className="bg-brightBlue hover:bg-blue-600 text-white px-12 py-5 rounded-2xl font-black text-xs uppercase tracking-[0.4em] shadow-[0_20px_40px_rgba(0,140,255,0.3)] flex items-center transition-all hover:scale-[1.02] active:scale-95"
                >
                  <Zap size={20} className="mr-3" /> Initialize Audit OS
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProjectWorkspace;
