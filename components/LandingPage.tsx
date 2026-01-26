
import React, { useState, useEffect } from 'react';
import { 
  Shield, Zap, CheckCircle, ArrowRight, Lock, ChevronDown, Check, 
  Database, Cpu, X, Mail, Linkedin, Twitter, ShieldAlert, Layers, Workflow, 
  Star, ChevronUp, Users, RefreshCw, Globe, Server, Briefcase, Activity, 
  TrendingUp, LayoutDashboard, Clock, MessageSquare, ShieldCheck, Search,
  FileText, Play, CheckSquare, Target, ClipboardCheck, BarChart3, Info,
  AlertOctagon
} from 'lucide-react';
import { AppRoute } from '../types';

interface LandingPageProps {
  onEnterWorkspace: () => void;
  navigate: (route: AppRoute) => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onEnterWorkspace, navigate }) => {
  const [assemblyStep, setAssemblyStep] = useState(0);

  // Sequential animation for the AI Audit Package Assembly
  useEffect(() => {
    const timer = setInterval(() => {
      setAssemblyStep((prev) => (prev + 1) % 5);
    }, 2000);
    return () => clearInterval(timer);
  }, []);

  const assemblyItems = [
    { label: "Framework Mapping", icon: Shield, color: "text-brightBlue", bg: "bg-brightBlue/10" },
    { label: "Risk Identification", icon: ShieldAlert, color: "text-riskHigh", bg: "bg-riskHigh/10" },
    { label: "Control Design", icon: Target, color: "text-orange-400", bg: "bg-orange-400/10" },
    { label: "Evidence Checklist", icon: ClipboardCheck, color: "text-emerald-500", bg: "bg-emerald-500/10" },
  ];

  return (
    <div className="min-h-screen bg-techBlack font-sans text-white selection:bg-brightBlue/30 overflow-x-hidden relative">
      
      {/* 1. NAVBAR */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-techBlack/60 backdrop-blur-xl border-b border-white/5 h-20 flex items-center">
        <div className="max-w-7xl mx-auto w-full px-6 flex justify-between items-center">
          <div className="flex items-center space-x-2 text-brightBlue cursor-pointer" onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brightBlue to-blue-600 flex items-center justify-center text-white font-black text-xl shadow-lg">C</div>
            <span className="text-2xl font-black tracking-tighter text-white">Complimaxx</span>
          </div>
          
          <div className="hidden md:flex items-center space-x-12 text-[11px] font-black text-steelGrey uppercase tracking-[0.3em]">
            <button onClick={() => navigate(AppRoute.FEATURES)} className="hover:text-white transition-colors">Features</button>
            <button onClick={() => {
              const el = document.getElementById('pricing');
              el?.scrollIntoView({ behavior: 'smooth' });
            }} className="hover:text-white transition-colors">Pricing</button>
            <button onClick={() => navigate(AppRoute.ABOUT)} className="hover:text-white transition-colors">Our Logic</button>
          </div>

          <button 
            onClick={onEnterWorkspace}
            className="bg-white/5 hover:bg-brightBlue border border-white/10 hover:border-brightBlue text-white px-8 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all active:scale-95"
          >
            Enter Workspace
          </button>
        </div>
      </nav>

      {/* 2. HERO SECTION */}
      <section className="relative pt-48 pb-32 px-6 overflow-hidden">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-16">
          <div className="flex-1 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 bg-brightBlue/10 text-brightBlue text-[10px] font-black px-4 py-2 rounded-full border border-brightBlue/20 uppercase tracking-[0.4em] mb-8 animate-fadeIn">
                <ShieldCheck size={14} /> The GRC Operating System
            </div>
            <h1 className="text-5xl md:text-7xl font-black tracking-tighter mb-8 leading-[1.1] text-white animate-fadeIn">
              Compliance on <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-brightBlue via-blue-400 to-indigo-400">Autopilot.</span>
            </h1>
            <p className="text-lg text-steelGrey font-medium mb-10 max-w-xl leading-relaxed animate-fadeIn">
              Stop chasing spreadsheets. Complimaxx automates audit-ready frameworks for ISO, NEN, and ISAE. Design, execute, and renew your compliance lifecycle in one neural workspace.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center gap-5 justify-center lg:justify-start animate-fadeIn">
              <button onClick={onEnterWorkspace} className="bg-brightBlue text-white hover:bg-blue-600 px-10 py-5 rounded-2xl font-black text-[11px] uppercase tracking-[0.3em] shadow-[0_20px_50px_rgba(0,140,255,0.3)] transition-all hover:scale-105 active:scale-95 flex items-center">
                Start Free Trial <ArrowRight size={16} className="ml-3" />
              </button>
              <button onClick={() => navigate(AppRoute.TUTORIALS)} className="px-10 py-5 rounded-2xl border border-white/10 text-white hover:bg-white/5 font-black text-[11px] uppercase tracking-[0.3em] transition-all">
                View Demo
              </button>
            </div>
          </div>

          <div className="flex-1 relative w-full max-w-2xl animate-slideInRight">
            <div className="absolute -top-12 -right-4 z-30 animate-float">
                <div className="bg-obsidianNavy border border-brightBlue/30 rounded-2xl p-5 shadow-2xl flex items-center gap-4 max-w-[300px] backdrop-blur-xl">
                    <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center text-emerald-500">
                        <MessageSquare size={20} />
                    </div>
                    <div>
                        <p className="text-[10px] font-black text-white uppercase tracking-tight">Compliance Alert</p>
                        <p className="text-[9px] text-steelGrey font-bold uppercase tracking-widest mt-0.5">Control C-04 evidence verified & approved.</p>
                    </div>
                </div>
            </div>

            <div className="bg-obsidianNavy border border-white/10 rounded-[40px] p-2 shadow-[0_50px_100px_rgba(0,0,0,0.6)] relative overflow-hidden">
                <div className="bg-techBlack rounded-[38px] p-8 aspect-[4/3] flex flex-col relative overflow-hidden">
                    <div className="absolute inset-0 z-20 flex flex-col items-center justify-center pointer-events-none">
                        <div className="w-full max-w-xs space-y-4">
                            {assemblyItems.map((item, idx) => (
                                <div 
                                    key={idx}
                                    className={`p-4 rounded-2xl border transition-all duration-700 transform flex items-center gap-4 ${
                                        assemblyStep >= idx 
                                        ? `opacity-100 translate-y-0 scale-100 ${item.bg} border-${item.color.split('-')[1]}/30` 
                                        : 'opacity-0 translate-y-10 scale-95 border-transparent'
                                    }`}
                                >
                                    <item.icon className={item.color} size={20} />
                                    <span className="text-[10px] font-black uppercase tracking-widest text-white">{item.label}</span>
                                    {assemblyStep > idx && <CheckCircle size={14} className="ml-auto text-emerald-500" />}
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="flex-1 opacity-10 blur-sm flex flex-col">
                        <div className="h-6 w-1/3 bg-white/20 rounded mb-8"></div>
                        <div className="grid grid-cols-2 gap-4 mb-8">
                            <div className="h-24 bg-white/10 rounded-xl"></div>
                            <div className="h-24 bg-white/10 rounded-xl"></div>
                        </div>
                        <div className="flex-1 bg-white/5 rounded-2xl"></div>
                    </div>
                </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. TRUSTED BY GLOBAL BRANDS */}
      <section className="py-20 border-y border-white/5 bg-[#030406]/50">
        <div className="max-w-7xl mx-auto px-6">
          <p className="text-center text-[10px] font-black text-steelGrey uppercase tracking-[0.6em] mb-12">Building authority with Industry Leaders</p>
          <div className="flex flex-wrap justify-center items-center gap-16 md:gap-24 opacity-25 grayscale brightness-200">
             <div className="flex items-center gap-2 font-black text-lg italic"><Briefcase size={20}/> LOGO_ONE</div>
             <div className="flex items-center gap-2 font-black text-lg italic"><Globe size={20}/> TECH_CORP</div>
             <div className="flex items-center gap-2 font-black text-lg italic"><Shield size={20}/> SECURE_X</div>
             <div className="flex items-center gap-2 font-black text-lg italic"><Activity size={20}/> FLOW_IND</div>
             <div className="flex items-center gap-2 font-black text-lg italic"><Database size={20}/> DATA_SYNC</div>
          </div>
        </div>
      </section>

      {/* 5. FEATURES SECTION */}
      <section className="py-40 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-24">
            <h2 className="text-4xl md:text-6xl font-black text-white mb-6 uppercase tracking-tighter">The System in Action.</h2>
            <p className="text-lg text-steelGrey max-w-2xl mx-auto font-medium">Complimaxx isn't just a document generator. It's an active execution layer for your GRC operations.</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
             <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {[
                  { title: "Neural Generation", desc: "Audit packs tailored to your context, not generic templates.", icon: Cpu, color: "text-brightBlue" },
                  { title: "Active Monitoring", desc: "Real-time tracking of control execution and evidence drift.", icon: Activity, color: "text-emerald-500" },
                  { title: "Automated Renewal", desc: "Seamless cycles that keep your compliance fresh and valid.", icon: RefreshCw, color: "text-orange-400" },
                  { title: "Role Isolation", desc: "Clear RACI accountability for every process and control.", icon: Users, color: "text-purple-400" }
                ].map((f, i) => (
                  <div key={i} className="bg-obsidianNavy border border-white/5 rounded-[40px] p-8 hover:border-brightBlue/40 transition-all shadow-xl">
                    <div className={`w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center ${f.color} mb-6 shadow-inner`}><f.icon size={28} /></div>
                    <h3 className="text-lg font-black text-white mb-3 uppercase tracking-tight">{f.title}</h3>
                    <p className="text-xs text-steelGrey leading-relaxed font-bold opacity-70">{f.desc}</p>
                  </div>
                ))}
             </div>
             <div className="relative">
                <div className="bg-gradient-to-br from-obsidianNavy to-techBlack border border-white/10 rounded-[50px] p-12 shadow-2xl overflow-hidden relative">
                    <div className="absolute top-0 right-0 p-10 opacity-5"><BarChart3 size={120} className="text-brightBlue" /></div>
                    <div className="relative z-10">
                        <div className="text-emerald-500 font-black text-4xl mb-4">80%</div>
                        <h4 className="text-xl font-black text-white uppercase tracking-tighter mb-4">Savings in Manual Preparation</h4>
                        <p className="text-steelGrey text-sm font-medium leading-relaxed mb-8">
                            Organizations using Complimaxx reduce audit preparation time from months to weeks, eliminating manual spreadsheet drift.
                        </p>
                        <div className="flex items-center gap-3 text-brightBlue text-[10px] font-black uppercase tracking-widest">
                            <TrendingUp size={14} /> Efficiency increase across 96+ frameworks
                        </div>
                    </div>
                </div>
             </div>
          </div>
        </div>
      </section>

      {/* 6. SERVICES SECTION */}
      <section className="py-40 px-6 bg-[#030406] border-y border-white/5">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-24">
            <h2 className="text-4xl md:text-6xl font-black text-white mb-6 uppercase tracking-tighter text-center">Engineered for Every Scale.</h2>
            <p className="text-lg text-steelGrey max-w-2xl mx-auto font-medium text-center">From agile MKB+ teams to complex Global Enterprises.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
             {[
               { role: "Compliance Officers", outcome: "Save 20h/week", desc: "Stop manual evidence tracking. Use our neural engine to map controls instantly.", icon: Briefcase },
               { role: "Internal Auditors", outcome: "Zero Data Gaps", desc: "Generate evidence checklists that auditors love. Real-time readiness scores.", icon: ClipboardCheck },
               { role: "C-Level / Board", outcome: "Mitigate Risk", desc: "Strategic dashboard visibility into organizational compliance health.", icon: LayoutDashboard }
             ].map((s, i) => (
               <div key={i} className="bg-techBlack border border-white/10 rounded-[48px] p-12 flex flex-col group hover:bg-obsidianNavy transition-all shadow-2xl">
                  <div className="flex justify-between items-start mb-10">
                      <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center text-brightBlue"><s.icon size={32} /></div>
                      <span className="text-[10px] font-black text-emerald-500 bg-emerald-500/10 px-4 py-2 rounded-full border border-emerald-500/20 uppercase tracking-widest">{s.outcome}</span>
                  </div>
                  <h3 className="text-2xl font-black text-white mb-6 uppercase tracking-tighter">{s.role}</h3>
                  <p className="text-sm text-steelGrey leading-relaxed font-bold opacity-80 mb-10">{s.desc}</p>
                  <button className="mt-auto flex items-center text-[10px] font-black text-brightBlue uppercase tracking-[0.3em] hover:text-white transition-colors">
                    Explore Solutions <ArrowRight size={14} className="ml-2" />
                  </button>
               </div>
             ))}
          </div>
        </div>
      </section>

      {/* 7. PRICING SECTION (New Implementation) */}
      <section id="pricing" className="py-40 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-24">
            <h2 className="text-4xl md:text-6xl font-black text-white mb-6 uppercase tracking-tighter">Predictable Growth.</h2>
            <p className="text-lg text-steelGrey max-w-2xl mx-auto font-medium">Clear tiers for every stage of your compliance journey.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch mb-24">
             {[
               { 
                 name: "Essentials", 
                 price: "99", 
                 desc: "For startups building a compliance foundation.",
                 frameworks: "2 Frameworks",
                 users: "1 User Seat",
                 credits: "15 AI Credits / mo",
                 cta: "Get Started",
                 highlight: false 
               },
               { 
                 name: "Pro", 
                 price: "299", 
                 desc: "For growing teams managing multiple standards.",
                 frameworks: "10 Frameworks",
                 users: "3 User Seats",
                 credits: "60 AI Credits / mo",
                 cta: "Initialize Pro",
                 highlight: true 
               },
               { 
                 name: "Enterprise", 
                 price: "699", 
                 desc: "For audit-driven organizations at scale.",
                 frameworks: "All 96 Frameworks",
                 users: "10 User Seats",
                 credits: "Unlimited AI Credits",
                 cta: "Go Enterprise",
                 highlight: false 
               }
             ].map((plan, i) => (
               <div key={i} className={`flex flex-col rounded-[50px] p-12 transition-all duration-500 shadow-2xl relative ${plan.highlight ? 'bg-gradient-to-b from-[#111827] to-techBlack border-2 border-brightBlue scale-105 z-10' : 'bg-obsidianNavy border border-white/5 hover:border-white/10'}`}>
                  {plan.highlight && (
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-brightBlue text-white text-[10px] font-black px-8 py-3 rounded-full uppercase tracking-[0.4em] shadow-lg">Most Popular</div>
                  )}
                  <div className="mb-10 text-center">
                    <h3 className="text-2xl font-black text-white uppercase tracking-tight mb-2">{plan.name}</h3>
                    <p className="text-[10px] font-black text-steelGrey uppercase tracking-widest">{plan.desc}</p>
                  </div>
                  <div className="flex items-baseline justify-center gap-1 mb-12">
                    <span className="text-2xl font-bold text-white">€</span>
                    <span className="text-7xl font-black text-white tracking-tighter">{plan.price}</span>
                    <span className="text-steelGrey font-bold text-xs uppercase tracking-widest">/mo</span>
                  </div>
                  <ul className="space-y-6 mb-12 flex-1">
                    {[plan.frameworks, plan.users, plan.credits, "Full Export Access"].map((feat, fi) => (
                      <li key={fi} className="flex items-center gap-4 text-[11px] font-black text-white/80 uppercase tracking-widest">
                        <Check size={16} className="text-emerald-500 shrink-0" /> {feat}
                      </li>
                    ))}
                  </ul>
                  <button onClick={onEnterWorkspace} className={`w-full py-5 rounded-2xl font-black text-[11px] uppercase tracking-[0.4em] transition-all ${plan.highlight ? 'bg-brightBlue text-white shadow-[0_15px_40px_rgba(0,140,255,0.3)] hover:scale-105' : 'bg-white/5 text-white hover:bg-white/10 border border-white/10'}`}>
                    {plan.cta}
                  </button>
               </div>
             ))}
          </div>

          {/* All Features Banner */}
          <div className="bg-gradient-to-r from-obsidianNavy via-[#0F172A] to-obsidianNavy border border-brightBlue/20 rounded-[40px] p-12 shadow-2xl relative overflow-hidden">
             <div className="absolute top-0 right-0 p-10 opacity-5"><Shield size={100} className="text-brightBlue" /></div>
             <div className="flex flex-col lg:flex-row items-center gap-12 relative z-10">
                <div className="lg:w-1/3 text-center lg:text-left">
                  <div className="inline-flex items-center gap-2 bg-brightBlue/10 text-brightBlue text-[10px] font-black px-4 py-2 rounded-full border border-brightBlue/20 uppercase tracking-[0.4em] mb-4">
                    Full Suite Access
                  </div>
                  <h3 className="text-3xl font-black text-white uppercase tracking-tighter">All Features Included.</h3>
                  <p className="text-steelGrey text-sm font-medium mt-4">We don't believe in feature walls. Every plan gets the full GRC operating system power.</p>
                </div>
                <div className="flex-1 grid grid-cols-2 md:grid-cols-4 gap-6">
                   {[
                     { label: "AI Generator", icon: Zap },
                     { label: "Checklists", icon: CheckSquare },
                     { label: "Gap Tracking", icon: AlertOctagon },
                     { label: "Renewals", icon: RefreshCw },
                     { label: "Evidence Vault", icon: Database },
                     { label: "Team RBAC", icon: Users },
                     { label: "Mappings", icon: Layers },
                     { label: "Risk Matrix", icon: ShieldAlert }
                   ].map((item, idx) => (
                     <div key={idx} className="flex items-center gap-3 bg-white/5 p-4 rounded-2xl border border-white/5">
                        <item.icon size={16} className="text-brightBlue" />
                        <span className="text-[9px] font-black text-white uppercase tracking-widest">{item.label}</span>
                     </div>
                   ))}
                </div>
             </div>
          </div>
        </div>
      </section>

      {/* 8. TESTIMONIALS */}
      <section className="py-40 px-6 bg-[#030406]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-24">
            <h2 className="text-3xl font-black text-white mb-4 uppercase tracking-[0.2em]">Validated by Industry.</h2>
            <p className="text-steelGrey font-bold uppercase tracking-widest text-[10px]">What audit professionals say about Complimaxx</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
             {[
               { name: "Stephen G.", role: "CISO @ Fintech Inc", quote: "Complimaxx turned our ISO 27001 audit into a routine check instead of a crisis." },
               { name: "Arjan S.", role: "Lead Auditor", quote: "The sequential logic of the neural engine is perfect for complex ISAE mappings." },
               { name: "Linda K.", role: "Quality Manager", quote: "Finally, a GRC platform that behaves like a modern operating system, not a database." }
             ].map((t, i) => (
               <div key={i} className="bg-obsidianNavy border border-white/5 rounded-[48px] p-12 shadow-2xl flex flex-col group relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                     <MessageSquare size={64} className="text-brightBlue" />
                  </div>
                  <div className="flex gap-1 mb-8">
                     {[1, 2, 3, 4, 5].map(s => <Star key={s} size={14} className="text-brightBlue fill-brightBlue" />)}
                  </div>
                  <p className="text-lg font-medium text-white leading-relaxed mb-10 italic">"{t.quote}"</p>
                  <div className="mt-auto flex items-center gap-4">
                     <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-brightBlue font-black text-xl">
                        {t.name.charAt(0)}
                     </div>
                     <div>
                        <p className="text-sm font-black text-white uppercase tracking-tight">{t.name}</p>
                        <p className="text-[10px] text-steelGrey font-bold uppercase tracking-widest">{t.role}</p>
                     </div>
                  </div>
               </div>
             ))}
          </div>
        </div>
      </section>

      {/* 9. FOOTER */}
      <footer className="py-24 px-6 border-t border-white/5 bg-[#030406]">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-12 text-left">
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center space-x-2 text-brightBlue mb-8">
              <div className="w-8 h-8 rounded-lg bg-brightBlue flex items-center justify-center text-white font-black text-lg">C</div>
              <span className="text-xl font-black tracking-tighter text-white">Complimaxx</span>
            </div>
            <p className="text-xs text-steelGrey leading-relaxed font-bold uppercase tracking-widest opacity-60">
              The AI Operating System for GRC. <br /> Standardizing audit readiness.
            </p>
          </div>
          {[
            { cat: "Platform", links: ["Features", "Security", "Pricing"] },
            { cat: "Frameworks", links: ["ISO 27001", "NIST CSF", "SOC 2"] },
            { cat: "Company", links: ["About", "Contact", "Terms"] }
          ].map((item, i) => (
             <div key={i}>
                <h4 className="font-black text-white mb-8 uppercase text-[9px] tracking-[0.4em]">{item.cat}</h4>
                <ul className="space-y-4 text-[9px] font-black text-steelGrey uppercase tracking-[0.3em]">
                  {item.links.map(l => (
                    <li key={l}><button onClick={() => {
                      if (l === 'Pricing') {
                        const el = document.getElementById('pricing');
                        el?.scrollIntoView({ behavior: 'smooth' });
                      } else {
                        navigate(AppRoute.FEATURES);
                      }
                    }} className="hover:text-brightBlue transition-colors text-left">{l}</button></li>
                  ))}
                </ul>
             </div>
          ))}
        </div>
        <div className="max-w-7xl mx-auto border-t border-white/5 mt-16 pt-8 text-center text-[8px] font-black uppercase tracking-[1em] text-steelGrey opacity-30">
          COMPLIMAXX OS — {new Date().getFullYear()}
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
