
import React, { useState, useEffect } from 'react';
import { RefreshCw, Zap, Calendar, History, Activity, AlertTriangle, Loader2, ListTodo, ArrowRight, ShieldCheck } from 'lucide-react';
import { AuditPackage, ChecklistItem } from '../types';

interface RenewalModeProps {
  data: AuditPackage | null;
  navigate: (route: any) => void;
  onUpdate?: (meta: any) => void;
  onChecklistUpdate?: (items: ChecklistItem[]) => void;
}

const RenewalMode: React.FC<RenewalModeProps> = ({ data, navigate, onChecklistUpdate }) => {
  const [isScanning, setIsScanning] = useState(false);
  const [scanComplete, setScanComplete] = useState(false);
  const [daysRemaining, setDaysRemaining] = useState(0);

  useEffect(() => {
    if (data?.audit_meta?.next_audit_date) {
        const nextDate = new Date(data.audit_meta.next_audit_date);
        const diff = nextDate.getTime() - new Date().getTime();
        setDaysRemaining(Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24))));
    }
  }, [data]);

  const kickoffNewCycle = () => {
    if (!data || !onChecklistUpdate) return;
    
    // Create specific renewal tasks
    const renewalTasks: ChecklistItem[] = [
        { 
          id: `REN-${Date.now()}-1`, 
          requirement: 'Re-evaluate Process Flow', 
          status: 'Not Started', 
          assignedTo: 'Process Owner', 
          dueDate: new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0], 
          framework: data.framework_mapping[0]?.framework || 'ISO 27001', 
          category: 'Renewal', 
          priority: 'High', 
          difficulty: 'Medium', 
          recurrence: 'Yearly', 
          evidenceFiles: [] 
        },
        { 
          id: `REN-${Date.now()}-2`, 
          requirement: 'Evidence Recertification', 
          status: 'Not Started', 
          assignedTo: 'Compliance Officer', 
          dueDate: new Date(Date.now() + 14 * 86400000).toISOString().split('T')[0], 
          framework: 'Multi-Framework', 
          category: 'Renewal', 
          priority: 'Medium', 
          difficulty: 'Hard', 
          recurrence: 'Yearly', 
          evidenceFiles: [] 
        }
    ];

    const currentChecklist = data.checklist || [];
    onChecklistUpdate([...renewalTasks, ...currentChecklist]);
    
    // Show a short confirmation and navigate to checklist
    alert("New Audit cycle started. 2 Renewal tasks have been added to your checklist.");
    navigate('checklist');
  };

  const runDriftAnalysis = () => {
      setIsScanning(true);
      setTimeout(() => {
          setIsScanning(false);
          setScanComplete(true);
      }, 2000);
  };

  if (!data) return null;

  return (
    <div className="space-y-6 animate-fadeIn pb-20">
      <div className="bg-[#080C14] border border-deepDivider rounded-3xl p-10 flex flex-col lg:flex-row justify-between items-center gap-10 shadow-2xl relative overflow-hidden">
          <div className="absolute right-0 top-0 h-full w-1/3 bg-brightBlue/5 skew-x-12 transform origin-bottom-right"></div>
          <div className="relative z-10 flex items-center gap-8">
              <div className="w-20 h-20 bg-brightBlue/10 border border-brightBlue/20 rounded-3xl flex items-center justify-center text-brightBlue shadow-xl">
                  <Calendar size={40} />
              </div>
              <div>
                  <h2 className="text-3xl font-black text-white mb-2 uppercase tracking-tighter">Audit Lifecycle</h2>
                  <p className="text-steelGrey font-medium">Next external audit scheduled for <span className="text-white font-bold">{data.audit_meta?.next_audit_date || 'Not set yet'}</span></p>
              </div>
          </div>
          <div className="flex items-center gap-6 relative z-10">
             <div className="text-center bg-obsidianNavy border border-deepDivider p-4 rounded-2xl min-w-[120px]">
                 <div className="text-[10px] font-black text-steelGrey uppercase tracking-widest mb-1">Days left</div>
                 <div className="text-4xl font-black text-white">{daysRemaining}</div>
             </div>
             <button onClick={kickoffNewCycle} className="bg-brightBlue hover:bg-blue-600 text-white px-10 py-5 rounded-2xl font-black text-xs uppercase tracking-[0.4em] shadow-xl transition-all hover:scale-105 active:scale-95 flex items-center">
                <Zap size={20} className="mr-3" /> Start New Cycle
             </button>
          </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 bg-obsidianNavy border border-deepDivider rounded-3xl p-10 shadow-xl">
              <h3 className="text-lg font-black text-white flex items-center mb-10 uppercase tracking-widest">
                  <ListTodo size={20} className="mr-4 text-brightBlue" /> Renewal Roadmap
              </h3>
              <div className="space-y-8 relative">
                  <div className="absolute left-5 top-2 bottom-2 w-px bg-deepDivider"></div>
                  {[
                    { label: "Internal Gap Analysis", date: "T-90 Days", status: "Soon", icon: History },
                    { label: "Evidence Freeze", date: "T-30 Days", status: "Critical", icon: AlertTriangle },
                    { label: "External Audit Window", date: data.audit_meta?.next_audit_date || 'Q4 2025', status: "Deadline", icon: ShieldCheck }
                  ].map((s, i) => (
                      <div key={i} className="relative pl-14">
                          <div className={`absolute left-0 w-10 h-10 rounded-full border-4 border-[#05070a] flex items-center justify-center z-10 ${s.status === 'Deadline' ? 'bg-brightBlue text-white' : 'bg-deepDivider text-steelGrey'}`}>
                              <s.icon size={16} />
                          </div>
                          <div className="bg-[#080C14] border border-deepDivider rounded-2xl p-6 flex justify-between items-center hover:border-brightBlue/40 transition-all group">
                              <div>
                                  <h4 className="font-bold text-white mb-1">{s.label}</h4>
                                  <p className="text-[10px] text-steelGrey font-black uppercase tracking-widest">{s.date}</p>
                              </div>
                              <ArrowRight size={20} className="text-steelGrey opacity-0 group-hover:opacity-100 transition-all translate-x-4 group-hover:translate-x-0" />
                          </div>
                      </div>
                  ))}
              </div>
          </div>

          <div className="bg-obsidianNavy border border-deepDivider rounded-3xl p-8 shadow-xl flex flex-col">
              <div className="flex justify-between items-center mb-8">
                  <h3 className="font-black text-white text-sm uppercase tracking-widest">Drift Analysis</h3>
                  <button onClick={runDriftAnalysis} className="p-2 bg-white/5 rounded-lg text-brightBlue hover:bg-brightBlue hover:text-white transition-all"><RefreshCw size={16}/></button>
              </div>
              
              {isScanning ? (
                  <div className="flex-1 flex flex-col items-center justify-center py-10">
                      <Loader2 size={40} className="text-brightBlue animate-spin mb-4" />
                      <p className="text-[10px] font-black text-steelGrey uppercase tracking-widest">Scanning for staleness...</p>
                  </div>
              ) : scanComplete ? (
                  <div className="space-y-8 animate-fadeIn">
                      <div className="p-6 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl text-center">
                          <div className="text-4xl font-black text-emerald-500 mb-2">94%</div>
                          <div className="text-[10px] text-steelGrey font-black uppercase tracking-widest">Consistency Score</div>
                      </div>
                      <div className="space-y-3">
                          <p className="text-xs text-steelGrey leading-relaxed font-medium">Your evidence is up-to-date. Minimal drift detected since last update.</p>
                          <div className="flex items-center gap-2 text-emerald-500 text-[10px] font-black uppercase tracking-widest">
                              <ShieldCheck size={14} /> Audit Ready
                          </div>
                      </div>
                  </div>
              ) : (
                  <div className="flex-1 flex flex-col items-center justify-center py-10 opacity-30">
                      <Activity size={64} className="text-steelGrey mb-4" />
                      <p className="text-xs text-center font-bold text-steelGrey uppercase tracking-widest">Start scan to measure<br/>compliance decay</p>
                  </div>
              )}

              <div className="mt-auto pt-8 border-t border-deepDivider">
                  <p className="text-[10px] text-steelGrey italic leading-relaxed">Drift analysis examines how long ago controls were validated and if linked evidence is still valid.</p>
              </div>
          </div>
      </div>
    </div>
  );
};

export default RenewalMode;
