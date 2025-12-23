
import React from 'react';
import { Plus, Shield, CheckCircle, AlertTriangle, FileText, Cloud, CloudOff, RefreshCcw, ArrowRight, Zap, Clock } from 'lucide-react';
import { AppRoute } from '../types';
import { isSupabaseConfigured } from '../services/supabaseClient';

interface DashboardProps {
  navigate: (route: AppRoute) => void;
}

const StatCard = ({ label, value, icon: Icon, color, trend }: any) => (
  <div className="bg-obsidianNavy border border-deepDivider rounded-xl p-6 shadow-lg hover:border-brightBlue/30 transition-all group">
    <div className="flex justify-between items-start">
      <div>
        <p className="text-steelGrey text-[10px] font-black uppercase tracking-[0.2em] mb-2">{label}</p>
        <h3 className="text-3xl font-black text-white">{value}</h3>
      </div>
      <div className={`p-3 rounded-lg bg-opacity-10 group-hover:scale-110 transition-transform ${color}`}>
        <Icon size={24} className={color.replace('bg-', 'text-')} />
      </div>
    </div>
    <div className="mt-4 flex items-center text-xs text-steelGrey">
      <span className="text-emerald-500 font-bold mr-1">{trend}</span> since last month
    </div>
  </div>
);

const Dashboard: React.FC<DashboardProps> = ({ navigate }) => {
  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Welcome Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 bg-[#080C14] border border-deepDivider p-8 rounded-2xl shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 h-full w-1/4 bg-brightBlue/5 skew-x-12 transform origin-bottom-right"></div>
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-2">
             <h1 className="text-3xl font-black text-white tracking-tight">Welcome, Compliance Hero</h1>
             {isSupabaseConfigured ? (
               <div className="flex items-center text-[10px] font-black text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20 tracking-widest uppercase">
                 <Cloud size={10} className="mr-1" /> LIVE SYNC
               </div>
             ) : (
               <div className="flex items-center text-[10px] font-black text-riskHigh bg-riskHigh/10 px-2 py-0.5 rounded border border-riskHigh/20 tracking-widest uppercase">
                 <CloudOff size={10} className="mr-1" /> LOCAL MODE
               </div>
             )}
          </div>
          <p className="text-steelGrey text-sm font-medium">Your audit environment is <span className="text-emerald-500 font-bold">Stable</span>. 12 tasks pending for ISO 27001.</p>
        </div>
        <button 
          onClick={() => navigate(AppRoute.PROJECT_WIZARD)}
          className="bg-brightBlue hover:bg-blue-600 text-white px-8 py-4 rounded-xl font-black text-xs uppercase tracking-widest shadow-xl shadow-brightBlue/20 transition-all hover:scale-105 active:scale-95 flex items-center relative z-10"
        >
          <Plus size={20} className="mr-2" />
          Start New Audit
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* STATS */}
          <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
              <StatCard label="Audit Readiness" value="84%" icon={Shield} color="bg-brightBlue" trend="+4%" />
              <StatCard label="Active Gaps" value="8" icon={AlertTriangle} color="bg-riskHigh" trend="-3" />
              <StatCard label="Evidence Health" value="92%" icon={CheckCircle} color="bg-emerald-500" trend="+12%" />
              <StatCard label="Pending Tasks" value="14" icon={FileText} color="bg-purple-500" trend="-2" />
          </div>

          {/* CRITICAL PATH WIDGET */}
          <div className="bg-gradient-to-br from-obsidianNavy to-[#121826] border border-brightBlue/30 rounded-2xl p-6 shadow-2xl relative group">
              <div className="absolute top-0 left-0 w-1 h-full bg-brightBlue"></div>
              <h3 className="text-xs font-black text-brightBlue uppercase tracking-widest mb-6 flex items-center">
                  <Zap size={14} className="mr-2 fill-current" /> Critical Path Next Step
              </h3>
              <div className="space-y-4">
                  <div className="p-4 bg-white/5 rounded-xl border border-white/5">
                      <div className="flex items-center gap-2 mb-2 text-[10px] font-black text-steelGrey uppercase tracking-widest">
                          <Clock size={12} /> Due in 2 days
                      </div>
                      <h4 className="text-white font-bold text-lg mb-2">Review Access Logs for SOC 2</h4>
                      <p className="text-xs text-steelGrey leading-relaxed mb-4 line-clamp-2">Validate that all admin access logs from the last quarter have been reviewed and signed off by the CISO.</p>
                      <button onClick={() => navigate(AppRoute.CHECKLIST)} className="w-full bg-white text-techBlack py-2.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all hover:bg-brightBlue hover:text-white">Open Task</button>
                  </div>
                  <div className="text-[10px] text-steelGrey font-bold text-center italic opacity-40">Generated by Compliance AI engine</div>
              </div>
          </div>
      </div>

      {/* RECENT PROJECTS SIMULATED */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-black text-white uppercase tracking-widest opacity-40">Recent Workspace Activity</h2>
          <button onClick={() => navigate(AppRoute.OUTPUT_VIEWER)} className="text-brightBlue text-xs font-black uppercase tracking-widest hover:underline">View All Projects</button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
                { title: 'ISO 27001 ISMS Setup', status: 'In Progress', frameworks: ['ISO 27001', 'SOC 2'], score: 65 },
                { title: 'NIS2 Directive Mapping', status: 'Completed', frameworks: ['NIS2', 'ISO 27001'], score: 98 }
            ].map((p, i) => (
                <div key={i} className="bg-obsidianNavy border border-deepDivider rounded-2xl p-6 hover:border-brightBlue transition-all cursor-pointer group">
                    <div className="flex justify-between mb-4">
                        <div className="p-2 bg-brightBlue/10 text-brightBlue rounded-lg group-hover:bg-brightBlue group-hover:text-white transition-colors">
                            <FileText size={20} />
                        </div>
                        <div className="text-right">
                            <div className="text-[10px] text-steelGrey font-black uppercase tracking-widest mb-1">Readiness Score</div>
                            <div className={`text-xl font-black ${p.score > 80 ? 'text-emerald-500' : 'text-brightBlue'}`}>{p.score}%</div>
                        </div>
                    </div>
                    <h4 className="text-lg font-bold text-white mb-1">{p.title}</h4>
                    <p className="text-xs text-steelGrey mb-4">{p.frameworks.join(' • ')}</p>
                    <div className="w-full bg-deepDivider h-1.5 rounded-full overflow-hidden">
                        <div className={`h-full ${p.score > 80 ? 'bg-emerald-500' : 'bg-brightBlue'}`} style={{ width: `${p.score}%` }}></div>
                    </div>
                </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
