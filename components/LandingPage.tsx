import React, { useState, useEffect } from 'react';
import { 
  Shield, 
  Zap, 
  CheckCircle, 
  ArrowRight, 
  Lock,
  ChevronDown,
  Check,
  Play,
  RefreshCw,
  Scale,
  Leaf,
  Server,
  Activity,
  PieChart,
  Target,
  ShieldAlert,
  Briefcase,
  Factory,
  Grid,
  FileCheck,
  MessageSquare,
  Clock,
  TrendingUp,
  Cpu,
  Globe,
  Database,
  Search,
  FileText,
  X,
  Sliders,
  Mail,
  Linkedin,
  Twitter,
  ChevronRight,
  AlertOctagon,
  ClipboardCheck,
  Users
} from 'lucide-react';
import { AppRoute } from '../types';

interface LandingPageProps {
  onEnterWorkspace: () => void;
  navigate: (route: AppRoute) => void;
}

const FAQS = [
  {
    q: "How does the AI ensure audit-grade accuracy?",
    a: "Complimaxx uses the Gemini 3 Pro model, specifically optimized for complex reasoning. It cross-references your process against its knowledge of ISO, NIST, and SOC 2 frameworks to ensure 100% alignment."
  },
  {
    q: "Can I export the generated documentation?",
    a: "Yes. You can export your audit packages to CSV, JSON, PDF, and DOCX. All exports are professionally formatted and ready for auditor review."
  },
  {
    q: "Is my data secure?",
    a: "Absolutely. We use AES-256 encryption and follow strict SOC 2 protocols. Your company data is isolated and never used to train public AI models."
  },
  {
    q: "How does Renewal Mode work?",
    a: "Renewal Mode tracks your audit cycles and identifies 'Drift'—areas where controls or evidence have become stale—helping you prepare for surveillance audits in minutes."
  },
  {
    q: "What frameworks are supported?",
    a: "We support over 96 frameworks, including ISO 27001, SOC 2, NIST CSF, HIPAA, GDPR, PCI DSS, and many industry-specific standards like TISAX or DORA."
  }
];

const LandingPage: React.FC<LandingPageProps> = ({ onEnterWorkspace, navigate }) => {
  const [showNotification, setShowNotification] = useState(false);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');
  const [aiStep, setAiStep] = useState(0);

  const aiSteps = ["Extracting...", "Mapping...", "Generating..."];

  useEffect(() => {
    const timer = setTimeout(() => setShowNotification(true), 3000);
    const interval = setInterval(() => {
      setAiStep((prev) => (prev + 1) % aiSteps.length);
    }, 2000);
    return () => {
      clearTimeout(timer);
      clearInterval(interval);
    };
  }, []);

  return (
    <div className="min-h-screen bg-techBlack font-sans text-white overflow-x-hidden selection:bg-brightBlue/30">
      
      {/* 1. FLOATING PILL NAVBAR */}
      <div className="fixed top-8 left-0 right-0 z-50 flex justify-center px-6">
        <nav className="w-full max-w-6xl h-16 bg-obsidianNavy/80 backdrop-blur-xl border border-white/10 rounded-full flex items-center justify-between px-8 shadow-2xl">
          {/* Left: Logo */}
          <div className="flex items-center space-x-2 text-brightBlue group cursor-pointer" onClick={() => navigate(AppRoute.LANDING)}>
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-brightBlue to-blue-600 flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-brightBlue/20">C</div>
            <span className="text-2xl font-black tracking-tighter text-white">Complimaxx</span>
          </div>
          
          {/* Center: Navigation Links */}
          <div className="hidden lg:flex items-center space-x-10 text-[11px] font-black text-steelGrey uppercase tracking-widest">
            <button onClick={() => navigate(AppRoute.PRODUCT)} className="hover:text-white transition-colors">Product</button>
            <button onClick={() => navigate(AppRoute.FEATURES)} className="hover:text-white transition-colors">Features</button>
            <button onClick={() => navigate(AppRoute.TUTORIALS)} className="hover:text-white transition-colors">How It Works</button>
            <button onClick={() => navigate(AppRoute.PRICING)} className="hover:text-white transition-colors">Pricing</button>
            <div className="relative group">
              <button className="hover:text-white transition-colors flex items-center">Resources <ChevronDown size={14} className="ml-1" /></button>
              <div className="absolute top-full left-1/2 -translate-x-1/2 mt-4 w-48 bg-obsidianNavy border border-deepDivider rounded-2xl shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all p-2">
                <button onClick={() => navigate(AppRoute.FAQ)} className="w-full text-left p-3 hover:bg-white/5 rounded-lg text-[10px] font-black uppercase tracking-widest text-steelGrey hover:text-white">FAQ</button>
                <button onClick={() => navigate(AppRoute.TUTORIALS)} className="w-full text-left p-3 hover:bg-white/5 rounded-lg text-[10px] font-black uppercase tracking-widest text-steelGrey hover:text-white">Tutorials</button>
              </div>
            </div>
          </div>

          {/* Right: Login Button */}
          <button 
            onClick={() => navigate(AppRoute.LOGIN)}
            className="bg-brightBlue hover:bg-blue-600 text-white px-8 py-2.5 rounded-full font-black text-xs uppercase tracking-widest transition-all shadow-xl active:scale-95 shadow-brightBlue/20"
          >
            Start Free Trial
          </button>
        </nav>
      </div>

      {/* 2. HERO SECTION */}
      <section className="relative pt-48 pb-20 px-6 text-center overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1200px] h-[600px] bg-brightBlue/5 rounded-full blur-[120px] -z-10"></div>
        
        <div className="max-w-5xl mx-auto flex flex-col items-center">
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-brightBlue/10 border border-brightBlue/20 text-brightBlue text-[10px] font-black uppercase tracking-[0.2em] mb-10 animate-fadeIn">
            <Zap size={14} className="mr-2" /> Powered by Gemini 3 Pro Enterprise
          </div>
          
          <h1 className="text-6xl md:text-8xl font-black tracking-tighter mb-8 leading-[0.9] animate-fadeIn">
            Turn Compliance Chaos <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-brightBlue via-softBlue to-white">Into Audit-Ready Packages in Minutes.</span>
          </h1>
          
          <p className="text-xl text-steelGrey max-w-3xl mb-12 leading-relaxed animate-fadeIn" style={{ animationDelay: '0.1s' }}>
            Complimaxx generates complete ISO/NIST/SOC2 audit documentation — process flows, RACI, risks, controls, test plans, and evidence lists — all in one click.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center gap-6 mb-8 animate-fadeIn" style={{ animationDelay: '0.2s' }}>
            <button onClick={() => navigate(AppRoute.LOGIN)} className="bg-white text-techBlack hover:bg-fogGrey px-10 py-5 rounded-full font-black text-lg shadow-2xl transition-all transform hover:-translate-y-1 flex items-center">
              Start Free 3-Day Trial <ArrowRight size={20} className="ml-3" />
            </button>
            <button onClick={() => navigate(AppRoute.TUTORIALS)} className="px-10 py-5 rounded-full border border-deepDivider text-white hover:bg-white/5 font-bold text-lg transition-all flex items-center">
               <Play size={18} className="mr-3 text-brightBlue" /> See Live Demo
            </button>
          </div>
          <p className="text-xs font-bold text-steelGrey uppercase tracking-widest opacity-60">Say goodbye to spreadsheets, consultants, and manual prep.</p>
        </div>

        {/* Hero Visual - Skewed Dashboard with AI Progress */}
        <div className="mt-24 max-w-6xl mx-auto relative perspective-1000 animate-slideInRight px-6">
           {showNotification && (
              <div className="absolute -top-12 right-10 lg:right-20 bg-white p-4 rounded-2xl shadow-2xl flex items-center gap-4 animate-fadeIn border border-fogGrey z-50">
                  <div className="w-10 h-10 rounded-full bg-emerald-500 flex items-center justify-center text-white shadow-lg">
                      <Check size={20} />
                  </div>
                  <div className="text-left">
                      <div className="text-[10px] font-black text-techBlack uppercase leading-none mb-1">Package Generated</div>
                      <div className="text-[12px] text-slate-500 leading-tight">ISO 27001 ready for <span className="font-bold">Financia Global</span></div>
                  </div>
              </div>
           )}

           <div className="bg-obsidianNavy border border-deepDivider rounded-[40px] p-6 shadow-2xl rotate-y-[-10deg] transform transition-transform hover:rotate-y-[0deg] duration-1000 overflow-hidden">
              <div className="bg-[#05070B] rounded-[30px] border border-deepDivider h-[500px] flex flex-col relative">
                  <div className="h-12 border-b border-deepDivider flex items-center px-8 justify-between bg-obsidianNavy/50">
                     <div className="flex gap-2">
                        <div className="w-3 h-3 rounded-full bg-red-500/30"></div>
                        <div className="w-3 h-3 rounded-full bg-yellow-500/30"></div>
                        <div className="w-3 h-3 rounded-full bg-green-500/30"></div>
                     </div>
                     <div className="text-[10px] text-steelGrey font-bold uppercase tracking-widest opacity-50">audit_engine_v3.0</div>
                  </div>
                  
                  <div className="absolute inset-0 flex flex-col items-center justify-center z-20 pointer-events-none">
                     <div className="bg-brightBlue/10 border border-brightBlue/30 backdrop-blur-md p-6 rounded-2xl flex items-center gap-6 animate-fadeIn">
                        <div className="w-12 h-12 rounded-full bg-brightBlue flex items-center justify-center text-white">
                           <RefreshCw size={24} className="animate-spin" />
                        </div>
                        <div className="text-left">
                           <div className="text-xs font-black text-brightBlue uppercase tracking-widest mb-1">{aiSteps[aiStep]}</div>
                           <div className="text-white font-bold h-6 transition-all">{aiStep === 0 ? "Analyzing process steps..." : aiStep === 1 ? "Mapping to ISO 27001 Annex A..." : "Finalizing audit package..."}</div>
                        </div>
                     </div>
                  </div>

                  <div className="flex-1 p-10 grid grid-cols-12 gap-8 opacity-20 blur-[2px]">
                     <div className="col-span-4 space-y-6">
                        <div className="h-32 bg-deepDivider rounded-3xl"></div>
                        <div className="h-32 bg-deepDivider rounded-3xl"></div>
                     </div>
                     <div className="col-span-8 bg-deepDivider rounded-3xl"></div>
                  </div>
              </div>
           </div>
        </div>
      </section>

      {/* 3. PARTNERS SECTION */}
      <section className="py-24 border-y border-deepDivider bg-[#080C14]">
        <div className="max-w-7xl mx-auto px-6 text-center">
           <p className="text-[10px] font-black uppercase tracking-[0.4em] text-steelGrey mb-12">Trusted by compliance, IT, and security teams worldwide</p>
           <div className="flex flex-wrap justify-center items-center gap-16 opacity-30 grayscale hover:grayscale-0 transition-all cursor-default">
              <div className="flex items-center gap-2 text-2xl font-black tracking-tighter"><div className="w-6 h-6 rounded-full bg-blue-500"/> FinTech Co.</div>
              <div className="flex items-center gap-2 text-2xl font-black tracking-tighter"><div className="w-6 h-6 rounded-full bg-purple-500"/> SecureCloud</div>
              <div className="flex items-center gap-2 text-2xl font-black tracking-tighter"><div className="w-6 h-6 rounded-full bg-orange-500"/> AutoGroup</div>
              <div className="flex items-center gap-2 text-2xl font-black tracking-tighter"><div className="w-6 h-6 rounded-full bg-blue-600"/> HealthNet</div>
              <div className="flex items-center gap-2 text-2xl font-black tracking-tighter"><div className="w-6 h-6 rounded-full bg-emerald-500"/> DataLabs</div>
           </div>
        </div>
      </section>

      {/* 4. BENEFITS SECTION */}
      <section id="features" className="py-32 px-6">
        <div className="max-w-7xl mx-auto text-center">
           <h2 className="text-5xl font-black mb-6">Benefits — Why teams choose Complimaxx</h2>
           <p className="text-xl text-steelGrey mb-20 max-w-2xl mx-auto">Stop writing documents manually. Start automating your success.</p>
           
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
              {[
                { title: "⚡ Speed", desc: "Generate complete audit packages 20× faster than manual consulting.", icon: Zap },
                { title: "📊 Accuracy", desc: "Framework-aligned output matching ISO, NIST, SOC2, COBIT, and more.", icon: Shield },
                { title: "🛠️ Fully Editable", desc: "Every generated item — from risks to evidence lists — can be edited inline.", icon: Sliders },
                { title: "📁 Centralized Compliance Hub", desc: "All processes, risks, gaps, and evidence in one workspace.", icon: Database },
                { title: "🔍 Gap Detection", desc: "Instantly detect missing controls and required improvements.", icon: ShieldAlert },
                { title: "🔁 Yearly Renewal Mode", desc: "Prepare for yearly audits with automated delta updates and evidence refresh.", icon: RefreshCw }
              ].map((f, i) => (
                <div key={i} className="bg-obsidianNavy border border-deepDivider rounded-[32px] p-10 hover:border-brightBlue/50 transition-all group text-left h-full">
                   <div className="w-16 h-16 bg-brightBlue/10 rounded-2xl flex items-center justify-center text-brightBlue mb-8 group-hover:scale-110 transition-transform">
                      <f.icon size={32} />
                   </div>
                   <h3 className="text-2xl font-black text-white mb-4 leading-tight">{f.title}</h3>
                   <p className="text-steelGrey text-sm leading-relaxed">{f.desc}</p>
                </div>
              ))}
           </div>
        </div>
      </section>

      {/* 6. PRICING SECTION */}
      <section id="pricing" className="py-32 px-6 text-center">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-5xl font-black mb-6">Pricing — Built for Scale</h2>
          <div className="flex justify-center items-center gap-4 mb-20">
            <span className={`text-sm font-bold ${billingCycle === 'monthly' ? 'text-white' : 'text-steelGrey'}`}>Monthly</span>
            <button 
              onClick={() => setBillingCycle(billingCycle === 'monthly' ? 'yearly' : 'monthly')}
              className="w-14 h-8 bg-obsidianNavy border border-deepDivider rounded-full relative p-1 transition-all"
            >
              <div className={`w-6 h-6 bg-brightBlue rounded-full transition-all transform ${billingCycle === 'yearly' ? 'translate-x-6' : 'translate-x-0'}`}></div>
            </button>
            <span className={`text-sm font-bold ${billingCycle === 'yearly' ? 'text-white' : 'text-steelGrey'}`}>Yearly <span className="text-emerald-500 font-black ml-1">(20% OFF)</span></span>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 items-stretch">
            {/* Essentials */}
            <div className="bg-techBlack border border-deepDivider rounded-[40px] p-10 flex flex-col items-start text-left hover:border-brightBlue transition-all">
              <h3 className="text-2xl font-black text-white mb-2">Essentials</h3>
              <p className="text-sm text-steelGrey mb-10 h-10">For solo founders or small teams starting with compliance.</p>
              <div className="text-5xl font-black text-white mb-10">€99<span className="text-xl font-normal text-steelGrey">/mo</span></div>
              <ul className="space-y-4 mb-12 flex-1">
                <li className="flex items-center text-sm text-steelGrey font-bold"><CheckCircle size={16} className="text-brightBlue mr-3" /> 2 Frameworks (ISO 27001 + SOC 2)</li>
                <li className="flex items-center text-sm text-steelGrey font-bold"><CheckCircle size={16} className="text-brightBlue mr-3" /> 1 User</li>
                <li className="flex items-center text-sm text-steelGrey font-bold"><CheckCircle size={16} className="text-brightBlue mr-3" /> 15 Processes / month</li>
              </ul>
              <button onClick={() => navigate(AppRoute.LOGIN)} className="w-full py-5 rounded-2xl border border-deepDivider text-white font-black hover:bg-white/5 transition-all text-sm uppercase tracking-widest">Start Trial</button>
            </div>

            {/* Pro */}
            <div className="bg-obsidianNavy border-2 border-brightBlue rounded-[40px] p-10 flex flex-col items-start text-left relative scale-105 shadow-2xl z-10">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-brightBlue text-white text-[10px] font-black px-5 py-2 rounded-full uppercase tracking-[0.3em]">Most Popular</div>
              <h3 className="text-2xl font-black text-white mb-2">Pro</h3>
              <p className="text-sm text-steelGrey mb-10 h-10">For growing teams managing multiple audits.</p>
              <div className="text-5xl font-black text-white mb-10">€299<span className="text-xl font-normal text-steelGrey">/mo</span></div>
              <ul className="space-y-4 mb-12 flex-1 text-white">
                <li className="flex items-center text-sm font-bold"><CheckCircle size={16} className="text-brightBlue mr-3" /> 10 Frameworks</li>
                <li className="flex items-center text-sm font-bold"><CheckCircle size={16} className="text-brightBlue mr-3" /> 3 Users</li>
                <li className="flex items-center text-sm font-bold"><CheckCircle size={16} className="text-brightBlue mr-3" /> 60 Processes / month</li>
              </ul>
              <button onClick={() => navigate(AppRoute.LOGIN)} className="w-full py-5 rounded-2xl bg-brightBlue text-white font-black hover:bg-blue-600 transition-all shadow-xl text-sm uppercase tracking-widest shadow-brightBlue/30">Start Trial</button>
            </div>

            {/* Enterprise */}
            <div className="bg-techBlack border border-deepDivider rounded-[40px] p-10 flex flex-col items-start text-left hover:border-brightBlue transition-all">
              <h3 className="text-2xl font-black text-white mb-2">Enterprise</h3>
              <p className="text-sm text-steelGrey mb-10 h-10">For companies managing mature compliance programs.</p>
              <div className="text-5xl font-black text-white mb-10">€699<span className="text-xl font-normal text-steelGrey">/mo</span></div>
              <ul className="space-y-4 mb-12 flex-1 text-steelGrey">
                <li className="flex items-center text-sm font-bold"><CheckCircle size={16} className="text-brightBlue mr-3" /> All 96 Frameworks</li>
                <li className="flex items-center text-sm font-bold"><CheckCircle size={16} className="text-brightBlue mr-3" /> 10 Users</li>
                <li className="flex items-center text-sm font-bold"><CheckCircle size={16} className="text-brightBlue mr-3" /> Unlimited Processes</li>
              </ul>
              <button onClick={() => navigate(AppRoute.CONTACT)} className="w-full py-5 rounded-2xl border border-deepDivider text-white font-black hover:bg-white/5 transition-all text-sm uppercase tracking-widest">Contact Sales</button>
            </div>
          </div>
        </div>
      </section>

      {/* 8. FAQ SECTION */}
      <section id="faq" className="py-32 px-6 max-w-4xl mx-auto">
        <h2 className="text-5xl font-black text-center mb-16">Frequently Asked Questions</h2>
        <div className="space-y-4">
          {FAQS.map((faq, i) => (
            <div key={i} className="bg-obsidianNavy border border-deepDivider rounded-2xl overflow-hidden">
              <button 
                onClick={() => setOpenFaqIndex(openFaqIndex === i ? null : i)}
                className="w-full p-6 text-left flex justify-between items-center hover:bg-white/5 transition-all"
              >
                <span className="font-bold text-white">{faq.q}</span>
                <ChevronDown size={20} className={`text-steelGrey transition-transform ${openFaqIndex === i ? 'rotate-180' : ''}`} />
              </button>
              {openFaqIndex === i && (
                <div className="px-6 pb-6 text-steelGrey text-sm leading-relaxed border-t border-deepDivider/50 pt-4 animate-fadeIn">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* 10. FOOTER */}
      <footer className="py-24 px-6 border-t border-deepDivider bg-[#05070B]">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-5 gap-16 mb-24 text-left">
          <div className="col-span-2">
            <div className="flex items-center space-x-2 text-brightBlue mb-8">
              <div className="w-9 h-9 rounded-xl bg-brightBlue flex items-center justify-center text-white font-bold text-xl shadow-lg">C</div>
              <span className="text-2xl font-black tracking-tighter text-white">Complimaxx</span>
            </div>
            <p className="text-steelGrey text-sm mb-8 max-w-sm">The world's first AI-driven operating system for Audit, Risk & Compliance. Architected for speed and accuracy.</p>
            <div className="flex gap-4">
              <button className="text-steelGrey hover:text-white transition-colors"><Linkedin size={20}/></button>
              <button className="text-steelGrey hover:text-white transition-colors"><Twitter size={20}/></button>
              <button className="text-steelGrey hover:text-white transition-colors"><Mail size={20}/></button>
            </div>
          </div>
          
          <div>
            <h4 className="font-black text-white mb-6 uppercase text-[10px] tracking-[0.4em]">Product</h4>
            <ul className="space-y-4 text-xs font-bold text-steelGrey uppercase tracking-widest">
              <li><button onClick={() => navigate(AppRoute.FEATURES)} className="hover:text-white transition-colors">Features</button></li>
              <li><button onClick={() => navigate(AppRoute.PRICING)} className="hover:text-white transition-colors">Pricing</button></li>
              <li><button onClick={() => navigate(AppRoute.LOGIN)} className="hover:text-white transition-colors">Get Started</button></li>
            </ul>
          </div>

          <div>
            <h4 className="font-black text-white mb-6 uppercase text-[10px] tracking-[0.4em]">Company</h4>
            <ul className="space-y-4 text-xs font-bold text-steelGrey uppercase tracking-widest">
              <li><button onClick={() => navigate(AppRoute.ABOUT)} className="hover:text-white transition-colors">About Us</button></li>
              <li><button onClick={() => navigate(AppRoute.CONTACT)} className="hover:text-white transition-colors">Contact</button></li>
            </ul>
          </div>

          <div>
            <h4 className="font-black text-white mb-6 uppercase text-[10px] tracking-[0.4em]">Legal</h4>
            <ul className="space-y-4 text-xs font-bold text-steelGrey uppercase tracking-widest">
              <li><button onClick={() => navigate(AppRoute.PRIVACY)} className="hover:text-white transition-colors">Privacy Policy</button></li>
              <li><button onClick={() => navigate(AppRoute.TERMS)} className="hover:text-white transition-colors">Terms of Service</button></li>
            </ul>
          </div>
        </div>

        <div className="max-w-7xl mx-auto border-t border-deepDivider pt-12 text-center text-[10px] font-black uppercase tracking-widest text-steelGrey">
          &copy; {new Date().getFullYear()} Complimaxx AI Solutions B.V. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;