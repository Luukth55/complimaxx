
import React, { useState, useEffect } from 'react';
import { 
  RefreshCw, 
  CheckCircle, 
  AlertTriangle, 
  Loader2, 
  Clock, 
  Activity, 
  Calendar, 
  ListTodo,
  CalendarDays,
  History,
  Copy,
  Info,
  Zap,
  ArrowRight
} from 'lucide-react';
import { AuditPackage, AuditMeta, ChecklistItem } from '../types';

interface RenewalModeProps {
  data: AuditPackage | null;
  navigate: (route: any) => void;
  onUpdate?: (meta: AuditMeta) => void;
  onChecklistUpdate?: (items: ChecklistItem[]) => void;
}

const RenewalMode: React.FC<RenewalModeProps> = ({ data, navigate, onUpdate, onChecklistUpdate }) => {
  const [isScanning, setIsScanning] = useState(false);
  const [scanComplete, setScanComplete] = useState(false);
  const [predictionData, setPredictionData] = useState<any>(null);
  
  const [lastAuditDate, setLastAuditDate] = useState<string>('');
  const [frequency, setFrequency] = useState<'Annual' | 'Semi-Annual' | 'Quarterly'>('Annual');
  const [nextAuditDate, setNextAuditDate] = useState<string>('');
  const [daysRemaining, setDaysRemaining] = useState<number | null>(null);

  useEffect(() => {
    if (data && data.audit_meta) {
        setLastAuditDate(data.audit_meta.last_audit_date);
        setFrequency(data.audit_meta.frequency);
        calculateNextAudit(data.audit_meta.last_audit_date, data.audit_meta.frequency);
    }
  }, [data]);

  const calculateNextAudit = (start: string, freq: string) => {
      if (!start) return;
      const baseDate = new Date(start);
      let monthsToAdd = freq === 'Quarterly' ? 3 : freq === 'Semi-Annual' ? 6 : 12;
      const nextDate = new Date(baseDate);
      nextDate.setMonth(baseDate.getMonth() + monthsToAdd);
      const nextDateStr = nextDate.toISOString().split('T')[0];
      setNextAuditDate(nextDateStr);
      const diffTime = nextDate.getTime() - new Date().getTime();
      setDaysRemaining(Math.ceil(diffTime / (1000 * 60 * 60 * 24)));
  };

  const kickoffAuditCycle = () => {
    if (!data || !onChecklistUpdate) return;
    
    const prepTasks: ChecklistItem[] = [
        { id: 'REN-01', requirement: 'Re-confirm Audit Scope', status: 'Not Started', assignedTo: 'Admin', dueDate: new Date().toISOString().split('T')[0], framework: 'ISO 27001', category: 'Audit Prep', priority: 'High', difficulty: 'Easy', recurrence: 'Yearly', evidenceFiles: [] },
        { id: 'REN-02', requirement: 'Review Asset Inventory', status: 'Not Started', assignedTo: 'IT Manager', dueDate: new Date().toISOString().split('T')[0], framework: 'ISO 27001', category: 'Audit Prep', priority: 'Medium', difficulty: 'Medium', recurrence: 'Yearly', evidenceFiles: [] }
    ];

    const existing = data.checklist || [];
    onChecklistUpdate([...prepTasks, ...existing]);
    alert("Audit Prep taken zijn toegevoegd aan je centrale checklist.");
    navigate('checklist');
  };

  const performDriftAnalysis = () => {
      setIsScanning(true);
      setTimeout(() => {
          setPredictionData({
              driftScore: 35,
              predictedEffort: 'Medium',
              staleItems: data?.controls.slice(0, 3) || []
          });
          setIsScanning(false);
          setScanComplete(true);
      }, 1500);
  };

  if (!data) return null;

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* HEADER WIDGET */}
      <div className="bg-[#080C14] border border-deepDivider rounded-xl p-8 shadow-2xl relative overflow-hidden flex flex-col lg:flex-row justify-between items-center gap-8">
          <div className="absolute right-0 top-0 h-full w-1/4 bg-brightBlue/5 skew-x-12 transform origin-bottom-right"></div>
          <div className="flex items-center gap-6 relative z-10">
              <div className="p-4 bg-brightBlue/10 border border-brightBlue/20 rounded-2xl text-brightBlue shadow-xl shadow-brightBlue/10"><Calendar size={32} /></div>
              <div>
                  <h2 className="text-2xl font-black text-white mb-1">Compliance Lifecycle</h2>
                  <p className="text-steelGrey text-sm font-medium">Monitoring Cycle for <span className="text-white font-bold">{data.project_title}</span></p>
              </div>
          </div>
          <div className="flex gap-4 relative z-10">
             <div className="text-center p-4 bg-obsidianNavy border border-deepDivider rounded-xl">
                 <div className="text-[10px] text-steelGrey font-black uppercase tracking-widest mb-1">Days Remaining</div>
                 <div className={`text-2xl font-black ${daysRemaining && daysRemaining < 60 ? 'text-riskHigh' : 'text-white'}`}>{daysRemaining || '--'}</div>
             </div>
             <button onClick={kickoffAuditCycle} className="bg-white text-techBlack px-8 py-4 rounded-xl font-black text-xs uppercase tracking-widest shadow-xl shadow-white/10 hover:bg-brightBlue hover:text-white transition-all flex items-center">
                <Zap size={18} className="mr-2" /> Kickoff New Cycle
             </button>
          </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-obsidianNavy border border-deepDivider rounded-2xl p-8">
              <h3 className="text-lg font-bold text-white flex items-center mb-8"><ListTodo size={20} className="mr-3 text-brightBlue" /> Audit Preparation Roadmap</h3>
              <div className="space-y-6 relative">
                  <div className="absolute left-4 top-2 bottom-2 w-px bg-deepDivider"></div>
                  {[
                    { label: "Internal Gap Scan", date: "90 days before", status: "Upcoming", icon: History },
                    { label: "Evidence Freeze", date: "30 days before", status: "Critical", icon: AlertTriangle },
                    { label: "Audit Recertification", date: nextAuditDate, status: "Deadline", icon: CalendarDays }
                  ].map((s, i) => (
                      <div key={i} className="relative pl-12">
                          <div className={`absolute left-0 w-8 h-8 rounded-full border-4 border-[#0a1120] flex items-center justify-center z-10 ${s.status === 'Deadline' ? 'bg-brightBlue text-white' : 'bg-deepDivider text-steelGrey'}`}><s.icon size={12} /></div>
                          <div className="bg-[#080C14] border border-deepDivider rounded-xl p-5 flex justify-between items-center hover:border-brightBlue/30 transition-all">
                              <div>
                                  <h4 className="font-bold text-white text-sm mb-1">{s.label}</h4>
                                  <p className="text-xs text-steelGrey uppercase tracking-widest font-black">{s.date}</p>
                              </div>
                              <span className={`text-[10px] font-black px-2 py-1 rounded uppercase border ${s.status === 'Deadline' ? 'bg-brightBlue/10 text-brightBlue border-brightBlue/30' : 'bg-deepDivider text-steelGrey border-deepDivider'}`}>{s.status}</span>
                          </div>
                      </div>
                  ))}
              </div>
          </div>

          <div className="space-y-6">
              <div className="bg-obsidianNavy border border-deepDivider rounded-2xl p-6">
                  <div className="flex justify-between items-center mb-6">
                      <h3 className="font-bold text-white flex items-center"><Activity size={18} className="mr-2 text-brightBlue" /> Predictive Drift</h3>
                      <button onClick={performDriftAnalysis} className="text-[10px] font-black text-brightBlue uppercase tracking-widest hover:underline">Scan Stale Controls</button>
                  </div>
                  {isScanning ? (
                      <div className="py-12 flex flex-col items-center"><Loader2 size={32} className="text-brightBlue animate-spin mb-4" /><p className="text-xs text-steelGrey font-bold uppercase tracking-widest">Analyzing Evidence Age...</p></div>
                  ) : scanComplete ? (
                      <div className="space-y-6 animate-fadeIn">
                          <div className="text-center p-6 bg-black/20 rounded-2xl border border-deepDivider">
                              <div className="text-4xl font-black text-emerald-500 mb-2">{predictionData.driftScore}%</div>
                              <div className="text-[10px] text-steelGrey uppercase font-black tracking-widest">Low Drift Score</div>
                          </div>
                          <button onClick={kickoffAuditCycle} className="w-full border border-deepDivider py-3 rounded-lg text-xs font-black text-white uppercase tracking-widest hover:bg-white/5 transition-all">Generate Refresh Tasks</button>
                      </div>
                  ) : (
                      <div className="py-12 text-center opacity-40">
                          <RefreshCw size={48} className="mx-auto mb-4 text-steelGrey" />
                          <p className="text-xs text-steelGrey font-bold uppercase tracking-widest">Run scan to detect<br/>compliance decay</p>
                      </div>
                  )}
              </div>
              <div className="bg-gradient-to-br from-brightBlue/20 to-transparent border border-brightBlue/30 p-6 rounded-2xl">
                  <h4 className="text-white font-bold flex items-center mb-4"><Info size={16} className="mr-2" /> Auditor Insight</h4>
                  <p className="text-xs text-steelGrey leading-relaxed italic">"Regular evidence refreshes prevent 'The Compliance Rush' during audit windows. Use our drift analyzer every quarter."</p>
              </div>
          </div>
      </div>
    </div>
  );
};

export default RenewalMode;
