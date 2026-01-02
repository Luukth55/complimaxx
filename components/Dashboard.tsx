
import React from 'react';
import { Plus, Shield, CheckCircle, AlertTriangle, FileText, Cloud, CloudOff, Zap, Clock, TrendingUp, Layers, ArrowRight, Folder, UserCheck, Star } from 'lucide-react';
import { AppRoute, AuditPackage } from '../types';
import { isSupabaseConfigured } from '../services/supabaseClient';

interface DashboardProps {
  navigate: (route: AppRoute) => void;
  savedProjects: AuditPackage[];
  profile: any;
  onSelectProject: (project: AuditPackage) => void;
}

const StatCard = ({ label, value, icon: Icon, color, trend, trendUp }: any) => (
  <div className="bg-obsidianNavy border border-white/5 rounded-[32px] p-8 shadow-xl hover:border-brightBlue/30 transition-all group relative overflow-hidden">
    <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
       <Icon size={80} />
    </div>
    <div className="flex justify-between items-start relative z-10">
      <div>
        <p className="text-steelGrey text-[10px] font-black uppercase tracking-[0.4em] mb-3">{label}</p>
        <h3 className="text-4xl font-black text-white mb-2">{value}</h3>
      </div>
      <div className={`p-4 rounded-2xl bg-opacity-10 group-hover:scale-110 transition-transform ${color}`}>
        <Icon size={24} className={color.replace('bg-', 'text-')} />
      </div>
    </div>
    <div className="mt-6 flex items-center text-[10px] text-steelGrey font-black uppercase tracking-widest relative z-10">
      <span className={`${trendUp ? 'text-emerald-500' : 'text-riskHigh'} mr-2 flex items-center`}>
        {trendUp ? <TrendingUp size={12} className="mr-1"/> : <AlertTriangle size={12} className="mr-1"/>}
        {trend}
      </span> 
      Update via Cloud
    </div>
  </div>
);

const Dashboard: React.FC<DashboardProps> = ({ navigate, savedProjects, profile, onSelectProject }) => {
  const recentProjects = savedProjects.slice(0, 3);
  const credits = profile?.credits_remaining ?? 0;
  const isPro = profile?.is_pro ?? false;
  const frameworkLimit = profile?.framework_limit ?? 2;

  return (
    <div className="space-y-10 animate-fadeIn font-sans pb-20">
      
      {/* HEADER HERO */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-10 bg-gradient-to-br from-obsidianNavy to-techBlack border border-white/5 p-12 rounded-[50px] shadow-2xl relative overflow-hidden">
        <div className="absolute right-0 top-0 h-full w-1/3 bg-brightBlue/5 skew-x-12 transform origin-bottom-right"></div>
        <div className="relative z-10">
          <div className="flex items-center gap-4 mb-4">
             <h1 className="text-4xl font-black text-white tracking-tighter uppercase">Welkom, {profile?.first_name || 'Admin'}</h1>
             <div className="flex items-center text-[9px] font-black text-emerald-500 bg-emerald-500/10 px-3 py-1.5 rounded-full border border-emerald-500/20 tracking-[0.4em] uppercase">
                <Cloud size={10} className="mr-2" /> Cloud Synced
             </div>
             {isPro && (
                <div className="flex items-center text-[9px] font-black text-yellow-500 bg-yellow-500/10 px-3 py-1.5 rounded-full border border-yellow-500/20 tracking-[0.4em] uppercase">
                    <Star size={10} className="mr-2" /> Enterprise
                </div>
             )}
          </div>
          <p className="text-steelGrey text-sm font-medium">U heeft <span className="text-brightBlue font-black">{credits} credits</span> resterend voor deze periode.</p>
        </div>
        
        <div className="flex items-center gap-4 relative z-10">
          <button 
            onClick={() => navigate(AppRoute.PROJECT_WIZARD)}
            className="bg-brightBlue hover:bg-blue-600 text-white px-10 py-5 rounded-2xl font-black text-[10px] uppercase tracking-[0.4em] shadow-[0_20px_40px_rgba(0,140,255,0.2)] transition-all hover:scale-105 active:scale-95 flex items-center"
          >
            <Plus size={20} className="mr-3" />
            Nieuw Project
          </button>
        </div>
      </div>

      {/* STATS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <StatCard label="Credits" value={credits.toString()} icon={Zap} color="bg-yellow-500" trend="Maandelijks" trendUp={true} />
          <StatCard label="Limiet" value={`${frameworkLimit} FWS`} icon={Layers} color="bg-purple-500" trend="Frameworks" trendUp={true} />
          <StatCard label="Hygiëne" value="92%" icon={CheckCircle} color="bg-emerald-500" trend="+12.0%" trendUp={true} />
          <StatCard label="Projecten" value={savedProjects.length.toString()} icon={FileText} color="bg-brightBlue" trend="Totaal" trendUp={true} />
      </div>

      {/* MAIN CONTENT SPLIT */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Recent Projects */}
          <div className="lg:col-span-2 bg-obsidianNavy border border-white/5 rounded-[40px] p-12">
              <div className="flex justify-between items-center mb-10">
                 <h3 className="text-xs font-black text-brightBlue uppercase tracking-[0.4em] flex items-center">
                    <Clock size={16} className="mr-3" /> Recente Projecten
                 </h3>
                 <button 
                  onClick={() => navigate(AppRoute.OUTPUT_VIEWER)}
                  className="text-[10px] font-black text-steelGrey uppercase tracking-widest hover:text-white transition-colors"
                 >
                   Bekijk Alles
                 </button>
              </div>
              
              {recentProjects.length === 0 ? (
                <div className="py-20 text-center opacity-40">
                   <Folder size={48} className="mx-auto mb-4" />
                   <p className="text-xs font-black uppercase tracking-widest">Nog geen projecten in de cloud.</p>
                </div>
              ) : (
                <div className="space-y-6">
                    {recentProjects.map((p, i) => (
                      <div 
                        key={p.id} 
                        onClick={() => onSelectProject(p)}
                        className="flex items-center justify-between p-6 bg-techBlack/40 rounded-3xl border border-white/5 hover:border-brightBlue/30 transition-all group cursor-pointer"
                      >
                        <div className="flex items-center gap-6">
                            <div className="w-14 h-14 rounded-2xl bg-white/5 text-brightBlue flex items-center justify-center group-hover:scale-110 transition-transform">
                              <FileText size={24} />
                            </div>
                            <div>
                              <div className="text-sm font-black text-white uppercase tracking-tight mb-1">{p.project_title || "Naamloos"}</div>
                              <div className="text-[10px] text-steelGrey font-bold uppercase tracking-widest">{p.framework_mapping.length} Frameworks • Score: {p.audit_score?.total_score}%</div>
                            </div>
                        </div>
                        <button className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-steelGrey group-hover:bg-brightBlue group-hover:text-white transition-all">
                            <ArrowRight size={16} />
                        </button>
                      </div>
                    ))}
                </div>
              )}
          </div>

          {/* AI Advisor Card */}
          <div className="bg-gradient-to-br from-[#1C2533] to-techBlack border border-brightBlue/20 rounded-[40px] p-12 flex flex-col items-center justify-center text-center">
              <div className="w-20 h-20 rounded-full bg-brightBlue/10 flex items-center justify-center mb-8 relative">
                 <UserCheck size={40} className="text-brightBlue" />
                 <div className="absolute inset-0 bg-brightBlue rounded-full blur-2xl opacity-20"></div>
              </div>
              <h4 className="text-white font-black uppercase tracking-[0.3em] text-sm mb-4">Cloud Status</h4>
              <p className="text-xs text-steelGrey leading-loose mb-10 font-medium">U bent ingelogd als <span className="text-brightBlue font-black">{profile?.email}</span>. Alle wijzigingen in checklists en gaps worden real-time opgeslagen.</p>
              <button 
                onClick={() => navigate(AppRoute.SETTINGS)} 
                className="bg-white text-techBlack hover:bg-brightBlue hover:text-white w-full py-5 rounded-2xl text-[10px] font-black uppercase tracking-[0.4em] transition-all shadow-xl"
              >
                Account Instellingen
              </button>
          </div>
      </div>
    </div>
  );
};

export default Dashboard;
