
import React, { useState, useEffect } from 'react';
import { 
  Shield, Zap, CheckCircle, ArrowRight, Lock, ChevronDown, Check, 
  Database, Cpu, X, Mail, Linkedin, Twitter, ShieldAlert, Layers, Workflow, 
  Star, ChevronUp, Users, RefreshCw, Globe, Server, Briefcase, Activity, 
  Factory, Leaf, TrendingUp
} from 'lucide-react';
import { AppRoute } from '../types';

interface FrameworkCategory {
  name: string;
  icon: any;
  frameworks: string[];
  color: string;
  bgColor: string;
}

const FRAMEWORK_DATA: FrameworkCategory[] = [
  {
    name: "Information Security & Cybersecurity",
    icon: Shield,
    color: "text-brightBlue",
    bgColor: "bg-brightBlue/10",
    frameworks: [
      "ISO/IEC 27001", "ISO/IEC 27002", "ISO/IEC 27005", "ISO/IEC 27017", "ISO/IEC 27018", 
      "ISO/IEC 27701", "ISO/IEC 27032", "NIST Cybersecurity Framework (CSF)", "NIST SP 800-53", 
      "NIST SP 800-171", "CIS Critical Security Controls", "SOC 2 (AICPA Trust Criteria)", 
      "SOC 1 / SSAE 18", "SOC 3", "PCI-DSS", "FedRAMP", "StateRAMP", "DoD CMMC", 
      "ISO 22301 (Business Continuity)", "ISO 20000-1 (IT Service Management)"
    ]
  },
  {
    name: "Privacy Regulations (Global)",
    icon: Lock,
    color: "text-purple-400",
    bgColor: "bg-purple-400/10",
    frameworks: [
      "GDPR", "CCPA", "CPRA", "HIPAA", "LGPD (Brazil)", "POPIA (South Africa)", 
      "PDPA (Singapore)", "APPI (Japan)", "PIPEDA (Canada)", "NIS2", "ePrivacy Directive", 
      "UK GDPR", "Children’s Online Privacy Protection (COPPA)", "FISMA"
    ]
  },
  {
    name: "Cloud, DevOps & Software",
    icon: Server,
    color: "text-cyan-400",
    bgColor: "bg-cyan-400/10",
    frameworks: [
      "CSA Cloud Controls Matrix (CCM)", "ISO/IEC 27017 (Cloud Security)", 
      "ISO/IEC 27018 (Cloud Privacy)", "Kubernetes Security Benchmarks", 
      "Docker CIS Benchmark", "Secure Software Development Lifecycle (SSDLC)", 
      "OWASP ASVS", "OWASP Top 10", "MITRE ATT&CK"
    ]
  },
  {
    name: "Governance, Risk & Internal Control",
    icon: Briefcase,
    color: "text-orange-400",
    bgColor: "bg-orange-400/10",
    frameworks: [
      "COSO Internal Control", "COSO ERM", "COBIT 2019", "ISO 31000 (Risk Management)", 
      "ISO 38500 (IT Governance)", "Basel III", "SOX (Sarbanes-Oxley)", 
      "Enterprise Risk Management Integrated Framework"
    ]
  },
  {
    name: "Financial & Operational Compliance",
    icon: TrendingUp,
    color: "text-emerald-400",
    bgColor: "bg-emerald-400/10",
    frameworks: [
      "IFRS", "GAAP", "MiFID II", "GxP", "ISO 9001 (Quality Management)", 
      "ISO 14001 (Environmental Management)", "ISO 45001 (Safety Management)", 
      "ISO 50001 (Energy Management)"
    ]
  },
  {
    name: "Healthcare & Life Sciences",
    icon: Activity,
    color: "text-riskHigh",
    bgColor: "bg-riskHigh/10",
    frameworks: [
      "HITRUST CSF", "HIPAA", "HITECH", "ISO 13485", "FDA 21 CFR Part 11", 
      "GAMP 5", "EU MDR", "Clinical Trials E6 (R2) GCP"
    ]
  },
  {
    name: "Automotive & Manufacturing",
    icon: Factory,
    color: "text-slate-400",
    bgColor: "bg-slate-400/10",
    frameworks: [
      "ISO 21434 (Automotive Cybersecurity)", "TISAX", "IATF 16949", 
      "ISO 26262 (Functional Safety)", "IEC 62443 (Industrial Security)", 
      "ISA 99", "NERC CIP"
    ]
  },
  {
    name: "Energy & Infrastructure",
    icon: Leaf,
    color: "text-yellow-400",
    bgColor: "bg-yellow-400/10",
    frameworks: [
      "NERC CIP", "IEC 62351", "ISO 55001", "ISA/IEC 62443", 
      "Nuclear CIP", "Smart Grid Security Standards"
    ]
  },
  {
    name: "AI, Data & Ethics Standards",
    icon: Cpu,
    color: "text-indigo-400",
    bgColor: "bg-indigo-400/10",
    frameworks: [
      "EU AI ACT (Mapped)", "ISO/IEC 42001 (AI Management)", 
      "ISO/IEC 23894 (AI Risk)", "AI Ethics Principles (OECD)", 
      "Model Risk Management (AI/ML)"
    ]
  },
  {
    name: "Supply Chain & Procurement",
    icon: Layers,
    color: "text-teal-400",
    bgColor: "bg-teal-400/10",
    frameworks: [
      "ISO 28000", "CTPAT", "Supply Chain Security Frameworks", 
      "Vendor Risk Management (VRM) Standards"
    ]
  }
];

interface LandingPageProps {
  onEnterWorkspace: () => void;
  navigate: (route: AppRoute) => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onEnterWorkspace, navigate }) => {
  const [frameworksExpanded, setFrameworksExpanded] = useState(false);
  const [assemblyProgress, setAssemblyProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setAssemblyProgress(prev => (prev >= 100 ? 0 : prev + 1));
    }, 40);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-techBlack font-sans text-white selection:bg-brightBlue/30 overflow-x-hidden relative">
      
      {/* 1. NAVBAR */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-techBlack/60 backdrop-blur-xl border-b border-white/5 h-20 flex items-center">
        <div className="max-w-7xl mx-auto w-full px-6 flex justify-between items-center">
          <div className="flex items-center space-x-2 text-brightBlue cursor-pointer" onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brightBlue to-blue-600 flex items-center justify-center text-white font-black text-xl shadow-[0_0_20px_rgba(0,140,255,0.4)]">C</div>
            <span className="text-2xl font-black tracking-tighter text-white">Complimaxx</span>
          </div>
          
          <div className="hidden md:flex items-center space-x-12 text-[11px] font-black text-steelGrey uppercase tracking-[0.3em]">
            <button onClick={() => navigate(AppRoute.FEATURES)} className="hover:text-white transition-colors">Features</button>
            <button onClick={() => navigate(AppRoute.PRICING)} className="hover:text-white transition-colors">Pricing</button>
            <button onClick={() => navigate(AppRoute.ABOUT)} className="hover:text-white transition-colors">About Us</button>
          </div>

          <button 
            onClick={onEnterWorkspace}
            className="bg-white/5 hover:bg-brightBlue border border-white/10 hover:border-brightBlue text-white px-8 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all active:scale-95"
          >
            Login
          </button>
        </div>
      </nav>

      {/* 2. HERO SECTION */}
      <section className="relative pt-48 pb-40 px-6">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-16">
          <div className="flex-1 text-center lg:text-left">
            <h1 className="text-5xl md:text-7xl font-black tracking-tighter mb-8 leading-[1.0] text-white animate-fadeIn">
              Turn Compliance Chaos Into <span className="text-transparent bg-clip-text bg-gradient-to-r from-brightBlue via-blue-400 to-indigo-400">Audit-Ready</span> Packages in Minutes.
            </h1>
            <p className="text-xl text-white font-medium mb-6 leading-relaxed animate-fadeIn">
              Complimaxx generates complete ISO/NIST/SOC2 audit documentation — process flows, RACI, risks, controls, test plans, evidence lists — all in one click.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center gap-6 justify-center lg:justify-start mt-10">
              <button onClick={onEnterWorkspace} className="bg-brightBlue text-white hover:bg-blue-600 px-10 py-5 rounded-2xl font-black text-xs uppercase tracking-[0.3em] shadow-2xl transition-all hover:scale-105 active:scale-95 flex items-center">
                Get Started Now <ArrowRight size={18} className="ml-3" />
              </button>
              <button onClick={() => navigate(AppRoute.TUTORIALS)} className="px-10 py-5 rounded-2xl border border-white/10 text-white hover:bg-white/5 font-black text-[10px] uppercase tracking-[0.3em] transition-all">
                See Live Demo
              </button>
            </div>
          </div>

          <div className="flex-1 relative perspective-1200 animate-slideInRight">
             <div className="bg-obsidianNavy border border-white/10 rounded-[50px] p-1 shadow-[0_60px_100px_rgba(0,0,0,0.6)]">
                <div className="bg-techBlack rounded-[48px] h-[500px] w-full relative overflow-hidden flex flex-col items-center justify-center p-12">
                   <div className="text-center mb-12">
                      <h4 className="text-sm font-black text-brightBlue uppercase tracking-[0.5em] mb-4">Neural Assembly Engine</h4>
                   </div>
                   <div className="w-full space-y-8 max-w-sm">
                      {[
                        { label: "Extracting Context...", progress: Math.min(assemblyProgress * 1.5, 100) },
                        { label: "Mapping Frameworks...", progress: Math.min(Math.max(0, (assemblyProgress - 30) * 1.8), 100) },
                        { label: "Generating Artifacts...", progress: Math.min(Math.max(0, (assemblyProgress - 60) * 2.5), 100) }
                      ].map((bar, i) => (
                        <div key={i} className="space-y-3">
                           <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-steelGrey">
                              <span>{bar.label}</span>
                              <span className="text-brightBlue">{Math.floor(bar.progress)}%</span>
                           </div>
                           <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                              <div className="h-full bg-brightBlue transition-all duration-300" style={{ width: `${bar.progress}%` }}></div>
                           </div>
                        </div>
                      ))}
                   </div>
                </div>
             </div>
          </div>
        </div>
      </section>

      {/* 3. BENEFITS SECTION */}
      <section id="features" className="py-40 px-6 text-center">
        <div className="max-w-7xl mx-auto flex flex-col items-center">
          <h2 className="text-4xl md:text-7xl font-black text-white mb-24 uppercase tracking-tighter">Why teams choose Complimaxx.</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 w-full">
            {[
              { title: "⚡ Speed", desc: "Generate complete audit packages 20× faster.", icon: Zap, color: "text-yellow-400" },
              { title: "📊 Accuracy", desc: "Framework-aligned output matching 96+ global standards.", icon: Shield, color: "text-brightBlue" },
              { title: "🛠️ Editable", desc: "Every generated item can be edited inline within the terminal.", icon: Layers, color: "text-purple-400" },
              { title: "📁 Hub", desc: "All processes, risks, and evidence in one unified workspace.", icon: Database, color: "text-emerald-400" },
              { title: "🔍 Gaps", desc: "Instantly detect missing controls and required fixes.", icon: ShieldAlert, color: "text-riskHigh" },
              { title: "🔁 Renewal", desc: "Prepare for yearly audits with automated delta refreshes.", icon: RefreshCw, color: "text-cyan-400" }
            ].map((b, i) => (
              <div key={i} className="bg-obsidianNavy border border-white/5 rounded-[48px] p-12 hover:border-brightBlue/40 transition-all group shadow-2xl flex flex-col items-center">
                <div className={`w-20 h-20 bg-white/5 rounded-3xl flex items-center justify-center ${b.color} mb-10 group-hover:scale-110 transition-transform`}>
                  <b.icon size={36} />
                </div>
                <h3 className="text-2xl font-black text-white mb-6 uppercase tracking-tight">{b.title}</h3>
                <p className="text-steelGrey text-sm leading-relaxed font-bold opacity-70">{b.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. FRAMEWORKS LIBRARY */}
      <section id="frameworks" className="py-40 px-6 flex justify-center flex-col items-center">
        <div className="w-full max-w-6xl">
          <div className={`w-full bg-obsidianNavy border border-white/5 rounded-[60px] p-16 transition-all duration-700 relative overflow-hidden flex flex-col items-center ${frameworksExpanded ? '' : 'hover:border-brightBlue/20 cursor-pointer'}`} onClick={() => !frameworksExpanded && setFrameworksExpanded(true)}>
             <div className="text-center mb-16">
                <h2 className="text-4xl md:text-6xl font-black text-white mb-6 uppercase tracking-tighter">96 Global Frameworks Supported</h2>
                <p className="text-lg text-steelGrey max-w-2xl mx-auto font-medium">Your entire compliance landscape in one platform.</p>
             </div>

             {!frameworksExpanded ? (
               <div className="flex flex-col items-center animate-fadeIn">
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-6 mb-20">
                     {FRAMEWORK_DATA.slice(0, 5).map((category, i) => (
                       <div key={i} className="bg-techBlack p-8 rounded-[32px] border border-white/5 flex flex-col items-center gap-4 group hover:border-brightBlue/30 transition-all">
                          <category.icon size={28} className={category.color} />
                          <span className="text-[9px] font-black uppercase tracking-widest text-steelGrey group-hover:text-white transition-colors text-center">{category.name.split(' ')[0]}</span>
                       </div>
                     ))}
                     <div className="bg-brightBlue text-white p-8 rounded-[32px] font-black text-xl flex items-center justify-center shadow-2xl transition-transform hover:scale-105">+91 More</div>
                  </div>
                  <div className="flex flex-col items-center text-brightBlue font-black uppercase text-[11px] tracking-[0.5em] gap-5 group">
                     <ChevronDown size={32} className="animate-bounce" />
                     Explore Library
                  </div>
               </div>
             ) : (
               <div className="animate-fadeIn w-full">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-20 gap-y-16 w-full text-left">
                     {FRAMEWORK_DATA.map((category, i) => (
                       <div key={i} className="space-y-8">
                          <div className="flex items-center gap-5 border-b border-white/10 pb-6 group">
                             <div className={`p-3 rounded-2xl ${category.bgColor} ${category.color} group-hover:scale-110 transition-transform shadow-lg shadow-black/40`}>
                                <category.icon size={24} />
                             </div>
                             <h3 className="text-sm font-black text-white tracking-[0.3em] uppercase">{category.name}</h3>
                          </div>
                          <div className="flex flex-wrap gap-2.5">
                             {category.frameworks.map((fw, idx) => (
                               <div key={idx} className="bg-techBlack/60 border border-white/5 px-4 py-2 rounded-lg text-[10px] font-black text-steelGrey hover:text-white hover:border-brightBlue/30 transition-all uppercase tracking-widest cursor-default">
                                 {fw}
                               </div>
                             ))}
                          </div>
                       </div>
                     ))}
                  </div>
                  <div className="mt-24 text-center">
                    <button onClick={(e) => { e.stopPropagation(); setFrameworksExpanded(false); }} className="text-brightBlue hover:text-white transition-all flex items-center gap-4 font-black uppercase text-[10px] tracking-[0.4em] bg-brightBlue/10 px-10 py-4 rounded-full border border-brightBlue/20 mx-auto group">
                        <ChevronUp size={24} className="group-hover:-translate-y-1 transition-transform" /> Close Library
                    </button>
                  </div>
               </div>
             )}
          </div>
        </div>
      </section>

      {/* 5. PRICING PREVIEW */}
      <section id="pricing" className="py-40 px-6 flex flex-col items-center">
        <div className="max-w-7xl mx-auto flex flex-col items-center w-full">
          <h2 className="text-5xl md:text-8xl font-black text-white mb-10 uppercase tracking-tighter text-center">Simple Pricing.</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 w-full max-w-6xl items-stretch">
            {[
              { plan: "Essentials", price: "99", features: ["2 Frameworks", "1 User", "15 credits / month", "Full access"] },
              { plan: "Pro", price: "299", features: ["Up to 10 Frameworks", "Up to 3 Users", "60 credits / month"], highlight: true },
              { plan: "Enterprise", price: "699", features: ["All 96 Frameworks", "Up to 10 Users", "Unlimited credits", "Full branding"] }
            ].map((p, i) => (
              <div key={i} className={`rounded-[60px] p-16 flex flex-col items-center border transition-all duration-700 shadow-2xl relative ${p.highlight ? 'bg-gradient-to-b from-[#1C2533] to-techBlack border-2 border-brightBlue scale-105 z-10' : 'bg-obsidianNavy border border-white/5'}`}>
                <h3 className="text-2xl font-black mb-10 uppercase tracking-tight text-white">{p.plan}</h3>
                <div className="text-7xl font-black text-white mb-16 flex items-start">
                   <span className="text-2xl mt-4 mr-2">€</span>{p.price}<span className="text-xl text-steelGrey font-medium self-end mb-4">/mo</span>
                </div>
                <div className="flex-1 w-full flex justify-center mb-20">
                  <ul className="space-y-4 text-left w-fit">
                    {p.features.map((f, fi) => (
                      <li key={fi} className="flex items-center text-[10px] font-black text-steelGrey uppercase tracking-widest">
                        <Check size={14} className="text-brightBlue mr-3 shrink-0" /> {f}
                      </li>
                    ))}
                  </ul>
                </div>
                <button onClick={onEnterWorkspace} className={`w-full py-6 rounded-2xl font-black text-[10px] uppercase tracking-[0.4em] transition-all ${p.highlight ? 'bg-brightBlue text-white shadow-xl' : 'bg-white/5 text-white hover:bg-brightBlue'}`}>
                  Start Trial
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 8. FOOTER */}
      <footer className="py-24 px-6 border-t border-white/5 bg-[#030406]">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-12 items-start w-full text-left">
          <div className="flex flex-col">
            <h4 className="font-black text-white mb-8 uppercase text-[9px] tracking-[0.4em]">Product</h4>
            <ul className="space-y-4 text-[9px] font-black text-steelGrey uppercase tracking-[0.3em]">
              <li><button onClick={() => navigate(AppRoute.FEATURES)} className="hover:text-brightBlue transition-colors text-left">Features</button></li>
              <li><button onClick={() => navigate(AppRoute.PRICING)} className="hover:text-brightBlue transition-colors text-left">Pricing</button></li>
              <li><button onClick={() => navigate(AppRoute.GET_STARTED)} className="hover:text-brightBlue transition-colors text-left">Get Started</button></li>
            </ul>
          </div>

          <div className="flex flex-col">
            <h4 className="font-black text-white mb-8 uppercase text-[9px] tracking-[0.4em]">Company</h4>
            <ul className="space-y-4 text-[9px] font-black text-steelGrey uppercase tracking-[0.3em]">
              <li><button onClick={() => navigate(AppRoute.ABOUT)} className="hover:text-brightBlue transition-colors text-left">About Us</button></li>
              <li><button onClick={() => navigate(AppRoute.CONTACT)} className="hover:text-brightBlue transition-colors text-left">Contact</button></li>
              <li><button onClick={() => navigate(AppRoute.SECURITY)} className="hover:text-brightBlue transition-colors text-left">Security</button></li>
            </ul>
          </div>

          <div className="flex flex-col">
            <h4 className="font-black text-white mb-8 uppercase text-[9px] tracking-[0.4em]">Legal</h4>
            <ul className="space-y-4 text-[9px] font-black text-steelGrey uppercase tracking-[0.3em]">
              <li><button onClick={() => navigate(AppRoute.PRIVACY)} className="hover:text-brightBlue transition-colors text-left">Privacy</button></li>
              <li><button onClick={() => navigate(AppRoute.TERMS)} className="hover:text-brightBlue transition-colors text-left">Terms</button></li>
              <li><button onClick={() => navigate(AppRoute.COOKIES)} className="hover:text-brightBlue transition-colors text-left">Cookies</button></li>
            </ul>
          </div>

          <div className="flex flex-col">
            <h4 className="font-black text-white mb-8 uppercase text-[9px] tracking-[0.4em]">Support</h4>
            <ul className="space-y-4 text-[9px] font-black text-steelGrey uppercase tracking-[0.3em]">
              <li><button onClick={() => navigate(AppRoute.HELP)} className="hover:text-brightBlue transition-colors text-left">Help Center</button></li>
              <li><button onClick={() => navigate(AppRoute.TUTORIALS)} className="hover:text-brightBlue transition-colors text-left">Tutorials</button></li>
              <li><button onClick={() => navigate(AppRoute.FAQ)} className="hover:text-brightBlue transition-colors text-left text-left">FAQ</button></li>
              <li className="flex items-center gap-2 pt-2"><Linkedin size={12} className="text-brightBlue" /> <button className="hover:text-white transition-colors">LinkedIn</button></li>
              <li className="flex items-center gap-2"><Twitter size={12} className="text-brightBlue" /> <button className="hover:text-white transition-colors">Twitter</button></li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto border-t border-white/5 mt-16 pt-8 text-center text-[8px] font-black uppercase tracking-[0.8em] text-steelGrey w-full opacity-30">
          Copyright © Complimaxx — All rights reserved.
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
