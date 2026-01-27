
import React from 'react';
import { Plus, Shield, CheckCircle, AlertTriangle, FileText, Cloud, Zap, Clock, TrendingUp, Layers, ArrowRight, Folder, UserCheck, Star, Users, History, Check, Activity, Calendar, RefreshCw, CreditCard } from 'lucide-react';
import { AppRoute, AuditPackage, UserProfile } from '../types';

interface DashboardProps {
  navigate: (route: AppRoute) => void;
  savedProjects: AuditPackage[];
  profile: UserProfile | null;
  onSelectProject: (project: AuditPackage) => void;
}

const HealthMeter = ({ score }: { score: number }) => (
  <div className="relative flex items-center justify-center">
    <svg className="w-32 h-32 transform -rotate-90">
      <circle cx="64" cy="64" r="58" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-white/5" />
      <circle cx="64" cy="64" r="58" stroke="currentColor" strokeWidth="8" fill="transparent" 
        strokeDasharray={364} 
        strokeDashoffset={364 - (364 * score) / 100} 
        strokeLinecap="round"
        className={`${score > 80 ? 'text-emerald-500' : score > 50 ? 'text-yellow-500' : 'text-riskHigh'} transition-all duration-1000 ease-out`} 
      />
    </svg>
    <div className="absolute flex flex-col items-center">
      <span className="text-3xl font-black text-white">{score}%</span>
      <span className="text-[8px] font-black text-steelGrey uppercase tracking-widest">Health</span>
    </div>
  </div>
);

const Dashboard: React.FC<DashboardProps> = ({ navigate, savedProjects, profile, onSelectProject }) => {
  const recentProjects = savedProjects.slice(0, 3);
  const credits = profile?.credits_remaining ?? 0;
  const planName = profile?.plan ?? 'Essentials';
  const isEnterprise = profile?.plan === 'Enterprise';
  
  const avgHealth = savedProjects.length > 0 
    ? Math.round(savedProjects.reduce((acc, p) => acc + (p.audit_score?.total_score || 0), 0) / savedProjects.length)
    : 0;

  return (
    <div className="space-y-10 animate-fadeIn font-sans pb-20">
      
      {/* TOP SECTION: COMMAND CENTER & SUBSCRIPTION */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-gradient-to-br from-obsidianNavy to-techBlack border border-white/10 p-12 rounded-[50px] shadow-2xl relative overflow-hidden flex flex-col md:flex-row items-center gap-12">
            <div className="absolute right-0 top-0 h-full w-1/4 bg-brightBlue/5 skew-x-12 transform origin-bottom-right"></div>
            <HealthMeter score={avgHealth} />
            <div className="relative z-10 flex-1">
                <div className="flex items-center gap-3 mb-4">
                    <h1 className="text-4xl font-black text-white tracking-tighter uppercase">Command Center</h1>
                    <span className="bg-emerald-500/10 text-emerald-500 text-[10px] font-black px-3 py-1 rounded-full border border-emerald-500/20 uppercase tracking-widest flex items-center">
                        <Activity size={12} className="mr-2"/> System Active
                    </span>
                </div>
                <p className="text-steelGrey text-sm font-medium mb-8 leading-relaxed">
                    Monitoring <span className="text-white font-bold">{savedProjects.length} audit-ready frameworks</span>. 
                    Daily control execution is currently <span className="text-emerald-500 font-bold">Optimal</span>.
                </p>
                <div className="flex gap-4">
                    <button 
                        onClick={() => navigate(AppRoute.PROJECT_WIZARD)}
                        className="bg-brightBlue hover:bg-blue-600 text-white px-8 py-4 rounded-2xl font-black text-[10px] uppercase tracking-[0.4em] shadow-xl transition-all hover:scale-105 active:scale-95 flex items-center"
                    >
                        <Plus size={18} className="mr-3" /> New Framework
                    </button>
                    <button 
                        onClick={() => navigate(AppRoute.RENEWAL)}
                        className="bg-white/5 hover:bg-white/10 text-white px-8 py-4 rounded-2xl font-black text-[10px] uppercase tracking-[0.4em] border border-white/10 transition-all"
                    >
                        Cycle Renewal
                    </button>
                </div>
            </div>
        </div>

        {/* SUBSCRIPTION & CREDITS CARD */}
        <div className="bg-gradient-to-br from-brightBlue/10 to-transparent border border-brightBlue/20 p-10 rounded-[40px] shadow-2xl relative overflow-hidden flex flex-col">
            <div className="absolute top-0 right-0 p-6 opacity-20"><CreditCard size={48} className="text-brightBlue" /></div>
            <h3 className="text-[10px] font-black text-brightBlue uppercase tracking-[0.4em] mb-6 flex items-center">
                <Shield size={14} className="mr-2"/> Subscription Status
            </h3>
            
            <div className="space-y-6 flex-1">
              <div>
                <p className="text-[10px] text-steelGrey uppercase tracking-widest mb-1">Current Plan</p>
                <p className="text-3xl font-black text-white uppercase tracking-tight">{planName}</p>
              </div>
              
              <div className="flex items-end justify-between p-4 bg-white/5 rounded-2xl border border-white/5">
                <div>
                  <p className="text-[10px] text-steelGrey uppercase tracking-widest mb-1">AI Credits</p>
                  <p className="text-2xl font-black text-white">{isEnterprise ? '∞' : credits}</p>
                </div>
                <Zap size={24} className="text-brightBlue mb-1" />
              </div>
            </div>

            <button 
              onClick={() => navigate(AppRoute.SETTINGS)} 
              className="mt-8 bg-brightBlue/10 hover:bg-brightBlue/20 text-brightBlue text-[10px] font-black py-4 rounded-xl uppercase tracking-[0.3em] transition-all flex items-center justify-center border border-brightBlue/20"
            >
                Upgrade Plan <ArrowRight size={14} className="ml-2" />
            </button>
        </div>
      </div>

      {/* COMPLIANCE LIFECYCLE TRACKER */}
      <div className="bg-obsidianNavy border border-white/5 rounded-[40px] p-12 shadow-2xl overflow-hidden relative">
          <div className="flex justify-between items-center mb-12">
             <h3 className="text-xs font-black text-white uppercase tracking-[0.4em] flex items-center">
                <Calendar size={18} className="mr-3 text-brightBlue" /> Compliance Operating Cycle
             </h3>
             <div className="text-[10px] font-black text-steelGrey uppercase tracking-widest bg-white/5 px-4 py-2 rounded-full border border-white/5">
                Current Phase: <span className="text-brightBlue">Daily Execution</span>
             </div>
          </div>
          
          <div className="flex items-center justify-between relative px-10">
              <div className="absolute h-1 left-20 right-20 bg-white/5 top-1/2 -translate-y-1/2 -z-0"></div>
              {[
                { label: "Design", icon: Layers, status: "Complete" },
                { label: "Execution", icon: Activity, status: "Active" },
                { label: "Monitoring", icon: Shield, status: "Upcoming" },
                { label: "Audit Prep", icon: CheckCircle, status: "Upcoming" },
                { label: "Renewal", icon: RefreshCw, status: "Cycle End" }
              ].map((step, i) => (
                <div key={i} className="flex flex-col items-center relative z-10">
                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center border-4 border-techBlack shadow-2xl transition-all duration-500 ${
                        step.status === 'Complete' ? 'bg-emerald-500 text-white' : 
                        step.status === 'Active' ? 'bg-brightBlue text-white scale-125 shadow-[0_0_30px_rgba(0,140,255,0.4)]' : 
                        'bg-obsidianNavy text-steelGrey border-deepDivider'
                    }`}>
                        <step.icon size={24} />
                    </div>
                    <span className={`text-[10px] font-black uppercase tracking-widest mt-6 ${step.status === 'Active' ? 'text-white' : 'text-steelGrey'}`}>
                        {step.label}
                    </span>
                </div>
              ))}
          </div>
      </div>

      {/* RECENT ACTIVITY & PROJECTS GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 bg-obsidianNavy border border-white/5 rounded-[40px] p-12 shadow-2xl">
              <div className="flex justify-between items-center mb-10">
                 <h3 className="text-xs font-black text-brightBlue uppercase tracking-[0.4em]">Active Frameworks</h3>
                 <button onClick={() => navigate(AppRoute.OUTPUT_VIEWER)} className="text-[10px] font-black text-steelGrey uppercase hover:text-white transition-all">View Library</button>
              </div>
              <div className="space-y-4">
                {recentProjects.length > 0 ? recentProjects.map(p => (
                  <div 
                    key={p.id} 
                    onClick={() => onSelectProject(p)}
                    className="flex items-center justify-between p-6 bg-techBlack/40 rounded-3xl border border-white/5 hover:border-brightBlue/30 transition-all cursor-pointer group"
                  >
                    <div className="flex items-center gap-6">
                        <div className="w-14 h-14 rounded-2xl bg-white/5 text-brightBlue flex items-center justify-center group-hover:scale-110 transition-transform">
                          <FileText size={24} />
                        </div>
                        <div>
                          <p className="text-sm font-black text-white uppercase tracking-tight mb-1">{p.project_title || "Untitled"}</p>
                          <div className="flex gap-4">
                            <span className="text-[9px] text-steelGrey font-black uppercase tracking-widest flex items-center">
                                <Shield size={10} className="mr-1 text-emerald-500"/> {p.framework_mapping.length} Standards
                            </span>
                            <span className="text-[9px] text-steelGrey font-black uppercase tracking-widest flex items-center">
                                <Clock size={10} className="mr-1 text-brightBlue"/> Synced: {new Date(p.savedAt!).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                    </div>
                    <ArrowRight size={18} className="text-steelGrey opacity-0 group-hover:opacity-100 transition-all -translate-x-4 group-hover:translate-x-0" />
                  </div>
                )) : (
                  <div className="p-12 text-center border border-dashed border-white/5 rounded-3xl">
                    <p className="text-steelGrey text-xs font-bold uppercase tracking-widest">No active frameworks yet.</p>
                  </div>
                )}
              </div>
          </div>

          <div className="bg-obsidianNavy border border-white/5 rounded-[40px] p-12 shadow-2xl">
             <h3 className="text-xs font-black text-steelGrey uppercase tracking-[0.4em] mb-10">Execution Log</h3>
             <div className="space-y-6">
                {[
                  { user: "System", action: "NIST CSF Analysis Refreshed", time: "10m ago" },
                  { user: "Admin", action: "Control C-04 Evidence Approved", time: "1h ago" },
                  { user: "System", action: "Gap Detected: ISO 27001:2022 Mapping", time: "4h ago" },
                  { user: "Editor", action: "Risk Register Updated", time: "1d ago" }
                ].map((act, i) => (
                  <div key={i} className="flex gap-4 items-start pb-6 border-b border-white/5 last:border-0">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-black ${act.user === 'System' ? 'bg-brightBlue/10 text-brightBlue' : 'bg-white/5 text-steelGrey'}`}>
                        {act.user.charAt(0)}
                    </div>
                    <div className="flex-1">
                        <p className="text-xs text-white font-bold">{act.action}</p>
                        <div className="flex justify-between mt-1">
                            <span className="text-[9px] text-steelGrey font-black uppercase tracking-widest">{act.user}</span>
                            <span className="text-[9px] text-steelGrey font-black uppercase tracking-widest">{act.time}</span>
                        </div>
                    </div>
                  </div>
                ))}
             </div>
          </div>
      </div>
    </div>
  );
};

export default Dashboard;
