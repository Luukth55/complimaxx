
import React from 'react';
import { 
  ArrowLeft, Shield, Lock, FileText, CheckCircle, Mail, MapPin, 
  Linkedin, Globe, Server, Users, BookOpen, PlayCircle, Search, 
  ChevronRight, ArrowRight, Zap, RefreshCw, Layout, Database,
  CreditCard, Star, Video, Play, HelpCircle, Check,
  GitCommit, AlertOctagon, ClipboardCheck, Sliders, Link, Target,
  Phone, Calendar, PieChart, ShieldAlert, Key, Grid, FileCheck,
  Workflow, Layers, Activity, TrendingDown, Clock
} from 'lucide-react';
import { AppRoute } from '../types';

interface PageProps {
  navigate: (route: AppRoute) => void;
  route: AppRoute;
}

// --- SHARED LAYOUT ---
const PublicPageLayout: React.FC<{
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  navigate: (route: AppRoute) => void;
}> = ({ title, subtitle, children, navigate }) => {
  return (
    <div className="min-h-screen bg-techBlack text-white font-sans">
      {/* Simple Header */}
      <nav className="border-b border-deepDivider bg-techBlack/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center space-x-2 text-brightBlue cursor-pointer" onClick={() => navigate(AppRoute.LANDING)}>
            <div className="w-8 h-8 rounded bg-gradient-to-br from-brightBlue to-blue-600 flex items-center justify-center text-white font-bold text-lg">C</div>
            <span className="text-xl font-bold tracking-tight text-white">Complimaxx</span>
          </div>
          <button onClick={() => navigate(AppRoute.LANDING)} className="text-sm text-steelGrey hover:text-white flex items-center">
            <ArrowLeft size={16} className="mr-2" /> Back to Home
          </button>
        </div>
      </nav>

      <main className="pb-20">
        {/* Hero */}
        <div className="pt-16 pb-12 px-6 text-center border-b border-deepDivider bg-[#080C14]">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-white to-steelGrey">{title}</h1>
          {subtitle && <p className="text-xl text-steelGrey max-w-2xl mx-auto">{subtitle}</p>}
        </div>

        {/* Content */}
        <div className="max-w-7xl mx-auto px-6 pt-12">
            {children}
        </div>
      </main>

      {/* Simple Footer */}
      <footer className="border-t border-deepDivider py-12 text-center text-steelGrey text-sm bg-[#05070B]">
        <div className="flex justify-center space-x-6 mb-4">
            <button onClick={() => navigate(AppRoute.TERMS)} className="hover:text-white">Terms</button>
            <button onClick={() => navigate(AppRoute.PRIVACY)} className="hover:text-white">Privacy</button>
            <button onClick={() => navigate(AppRoute.CONTACT)} className="hover:text-white">Contact</button>
        </div>
        <p>&copy; {new Date().getFullYear()} Complimaxx. All rights reserved.</p>
      </footer>
    </div>
  );
};

// --- FEATURES PAGE (REVAMPED) ---
export const FeaturesPage: React.FC<PageProps> = ({ navigate }) => {
  return (
    <PublicPageLayout 
        title="A Connected Operating System" 
        subtitle="Complimaxx isn't just a document generator. It's a unified platform that manages the entire lifecycle of your compliance program."
        navigate={navigate}
    >
        <div className="space-y-32">
            
            {/* 1. THE PLATFORM ECOSYSTEM VISUAL */}
            <div className="relative">
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-bold text-white mb-4">How it works together</h2>
                    <p className="text-steelGrey max-w-2xl mx-auto">
                        Data flows seamlessly between modules. Generating a package automatically populates your checklists, identifies gaps, and schedules renewals.
                    </p>
                </div>

                {/* Ecosystem Diagram */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 relative">
                    {/* Connecting Line (Desktop) */}
                    <div className="hidden md:block absolute top-1/2 left-0 w-full h-0.5 bg-gradient-to-r from-brightBlue/20 via-purple-500/20 to-emerald-500/20 -z-10 border-t border-dashed border-deepDivider"></div>

                    {[
                        { 
                            title: "1. Generator", 
                            icon: Zap, 
                            desc: "Creates the Audit Package", 
                            color: "text-brightBlue",
                            bg: "bg-brightBlue/10 border-brightBlue/30"
                        },
                        { 
                            title: "2. Checklists", 
                            icon: ClipboardCheck, 
                            desc: "Operationalizes Controls", 
                            color: "text-purple-500",
                            bg: "bg-purple-500/10 border-purple-500/30"
                        },
                        { 
                            title: "3. Gap Tracking", 
                            icon: AlertOctagon, 
                            desc: "Fixes Weaknesses", 
                            color: "text-orange-500",
                            bg: "bg-orange-500/10 border-orange-500/30"
                        },
                        { 
                            title: "4. Renewal Mode", 
                            icon: RefreshCw, 
                            desc: "Maintains Compliance", 
                            color: "text-emerald-500",
                            bg: "bg-emerald-500/10 border-emerald-500/30"
                        }
                    ].map((step, i) => (
                        <div key={i} className={`bg-obsidianNavy p-6 rounded-xl border ${step.bg} relative z-10 flex flex-col items-center text-center h-full hover:-translate-y-2 transition-transform duration-300 shadow-xl`}>
                            <div className={`mb-4 p-3 rounded-full bg-[#080C14] border border-deepDivider ${step.color}`}>
                                <step.icon size={24} />
                            </div>
                            <h3 className="text-lg font-bold text-white mb-2">{step.title}</h3>
                            <p className="text-sm text-steelGrey">{step.desc}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* 2. DEEP DIVE: CHECKLISTS */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                <div className="order-2 lg:order-1">
                    <div className="bg-[#080C14] border border-deepDivider rounded-2xl p-6 relative overflow-hidden shadow-2xl">
                        {/* Fake UI */}
                        <div className="flex justify-between items-center mb-6 border-b border-deepDivider pb-4">
                            <div className="flex items-center space-x-2">
                                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                            </div>
                            <div className="text-xs text-steelGrey font-mono">checklist_view.tsx</div>
                        </div>
                        <div className="space-y-3">
                            <div className="bg-obsidianNavy p-4 rounded-lg border border-deepDivider flex justify-between items-center">
                                <div className="flex items-center">
                                    <div className="w-5 h-5 rounded border border-brightBlue bg-brightBlue flex items-center justify-center mr-3"><Check size={12} className="text-white"/></div>
                                    <span className="text-sm text-steelGrey line-through decoration-deepDivider">Review Access Logs (Q3)</span>
                                </div>
                                <span className="text-xs bg-emerald-500/10 text-emerald-500 px-2 py-1 rounded">Done</span>
                            </div>
                            <div className="bg-obsidianNavy p-4 rounded-lg border border-brightBlue/50 shadow-[0_0_15px_rgba(0,140,255,0.1)]">
                                <div className="flex justify-between items-start mb-2">
                                    <div className="flex items-center">
                                        <div className="w-5 h-5 rounded border border-steelGrey mr-3"></div>
                                        <span className="text-sm text-white font-bold">Upload Pen Test Report</span>
                                    </div>
                                    <span className="text-xs bg-brightBlue/10 text-brightBlue px-2 py-1 rounded">In Progress</span>
                                </div>
                                <div className="ml-8 p-3 bg-black/30 rounded border border-dashed border-deepDivider text-xs text-steelGrey flex items-center justify-center">
                                    <FileCheck size={14} className="mr-2"/> Drag & Drop Evidence Here
                                </div>
                            </div>
                            <div className="bg-obsidianNavy p-4 rounded-lg border border-deepDivider opacity-50">
                                <div className="flex items-center">
                                    <div className="w-5 h-5 rounded border border-steelGrey mr-3"></div>
                                    <span className="text-sm text-white">Approve Vendor Risk Policy</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="order-1 lg:order-2">
                    <div className="inline-flex items-center px-3 py-1 rounded-full bg-purple-500/10 text-purple-400 text-xs font-bold uppercase tracking-wider mb-4 border border-purple-500/20">
                        Operationalize
                    </div>
                    <h2 className="text-3xl font-bold text-white mb-4">Smart Checklists & Evidence</h2>
                    <p className="text-lg text-steelGrey mb-6 leading-relaxed">
                        Audits aren't just about writing documents; they're about proving you follow them.
                    </p>
                    <ul className="space-y-4">
                        <li className="flex items-start">
                            <CheckCircle size={20} className="text-purple-500 mr-3 mt-1 shrink-0" />
                            <div>
                                <h4 className="text-white font-bold">Auto-Populated Tasks</h4>
                                <p className="text-sm text-steelGrey">The system automatically creates tasks based on the Controls generated in your audit package.</p>
                            </div>
                        </li>
                        <li className="flex items-start">
                            <CheckCircle size={20} className="text-purple-500 mr-3 mt-1 shrink-0" />
                            <div>
                                <h4 className="text-white font-bold">Evidence Linking</h4>
                                <p className="text-sm text-steelGrey">Upload screenshots, PDFs, or logs directly to the specific control they verify. No more lost Google Drive links.</p>
                            </div>
                        </li>
                        <li className="flex items-start">
                            <CheckCircle size={20} className="text-purple-500 mr-3 mt-1 shrink-0" />
                            <div>
                                <h4 className="text-white font-bold">Frequency Management</h4>
                                <p className="text-sm text-steelGrey">Set recurrence (Daily, Weekly, Quarterly) so you never miss a compliance deadline.</p>
                            </div>
                        </li>
                    </ul>
                </div>
            </div>

            {/* 3. DEEP DIVE: GAP TRACKING */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                <div>
                    <div className="inline-flex items-center px-3 py-1 rounded-full bg-orange-500/10 text-orange-400 text-xs font-bold uppercase tracking-wider mb-4 border border-orange-500/20">
                        Remediate
                    </div>
                    <h2 className="text-3xl font-bold text-white mb-4">Intelligent Gap Tracking</h2>
                    <p className="text-lg text-steelGrey mb-6 leading-relaxed">
                        Complimaxx doesn't just tell you what you have; it tells you what you're missing.
                    </p>
                    <ul className="space-y-4">
                        <li className="flex items-start">
                            <AlertOctagon size={20} className="text-orange-500 mr-3 mt-1 shrink-0" />
                            <div>
                                <h4 className="text-white font-bold">Orphaned Risk Detection</h4>
                                <p className="text-sm text-steelGrey">Automatically flags "High Impact" risks that don't have a mapped control or mitigation strategy.</p>
                            </div>
                        </li>
                        <li className="flex items-start">
                            <AlertOctagon size={20} className="text-orange-500 mr-3 mt-1 shrink-0" />
                            <div>
                                <h4 className="text-white font-bold">Efficiency Analysis</h4>
                                <p className="text-sm text-steelGrey">Identifies "Manual" controls that run frequently (e.g., Daily), suggesting them as candidates for automation to reduce toil.</p>
                            </div>
                        </li>
                        <li className="flex items-start">
                            <AlertOctagon size={20} className="text-orange-500 mr-3 mt-1 shrink-0" />
                            <div>
                                <h4 className="text-white font-bold">Kanban Remediation</h4>
                                <p className="text-sm text-steelGrey">Manage fixes on a drag-and-drop board: To Do, In Progress, Done.</p>
                            </div>
                        </li>
                    </ul>
                </div>
                <div>
                     <div className="bg-[#080C14] border border-deepDivider rounded-2xl p-6 relative overflow-hidden shadow-2xl">
                         {/* Fake Kanban Board */}
                         <div className="grid grid-cols-2 gap-4">
                             <div className="bg-obsidianNavy/50 rounded-xl p-3 border border-deepDivider">
                                 <div className="text-xs font-bold text-steelGrey uppercase mb-3 flex justify-between">
                                     To Do <span className="bg-white/10 px-1.5 rounded text-white">2</span>
                                 </div>
                                 <div className="space-y-2">
                                     <div className="bg-obsidianNavy p-3 rounded border border-riskHigh/30 shadow-sm relative overflow-hidden">
                                         <div className="absolute left-0 top-0 bottom-0 w-1 bg-riskHigh"></div>
                                         <div className="text-xs font-bold text-white mb-1">Missing MFA on VPN</div>
                                         <div className="flex items-center text-[10px] text-riskHigh">
                                             <ShieldAlert size={10} className="mr-1"/> High Risk Gap
                                         </div>
                                     </div>
                                      <div className="bg-obsidianNavy p-3 rounded border border-deepDivider shadow-sm">
                                         <div className="text-xs font-bold text-white mb-1">Update Privacy Policy</div>
                                         <div className="flex items-center text-[10px] text-steelGrey">
                                             GDPR Compliance
                                         </div>
                                     </div>
                                 </div>
                             </div>
                             <div className="bg-obsidianNavy/50 rounded-xl p-3 border border-deepDivider">
                                 <div className="text-xs font-bold text-steelGrey uppercase mb-3 flex justify-between">
                                     Resolved <span className="bg-white/10 px-1.5 rounded text-white">5</span>
                                 </div>
                                 <div className="space-y-2 opacity-60">
                                     <div className="bg-obsidianNavy p-3 rounded border border-deepDivider">
                                         <div className="text-xs text-white line-through">Patch Server 01</div>
                                     </div>
                                      <div className="bg-obsidianNavy p-3 rounded border border-deepDivider">
                                         <div className="text-xs text-white line-through">Offboard Employee X</div>
                                     </div>
                                 </div>
                             </div>
                         </div>
                     </div>
                </div>
            </div>

            {/* 4. DEEP DIVE: RENEWAL MODE */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                <div className="order-2 lg:order-1">
                    <div className="bg-[#080C14] border border-deepDivider rounded-2xl p-6 relative overflow-hidden shadow-2xl">
                        <div className="absolute top-0 right-0 p-4">
                            <div className="animate-pulse flex items-center space-x-2 bg-obsidianNavy border border-deepDivider px-3 py-1 rounded-full">
                                <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                                <span className="text-xs text-white font-bold">Scanning...</span>
                            </div>
                        </div>
                        <div className="mt-8 grid grid-cols-3 gap-4 text-center">
                            <div className="bg-obsidianNavy p-4 rounded-xl border border-deepDivider">
                                <div className="text-2xl font-bold text-white mb-1">45%</div>
                                <div className="text-[10px] text-steelGrey uppercase">Drift Score</div>
                            </div>
                            <div className="bg-obsidianNavy p-4 rounded-xl border border-deepDivider">
                                <div className="text-2xl font-bold text-white mb-1">12</div>
                                <div className="text-[10px] text-steelGrey uppercase">Manual Controls</div>
                            </div>
                            <div className="bg-obsidianNavy p-4 rounded-xl border border-deepDivider">
                                <div className="text-2xl font-bold text-white mb-1">3 wks</div>
                                <div className="text-[10px] text-steelGrey uppercase">Est. Effort</div>
                            </div>
                        </div>
                        <div className="mt-6">
                            <div className="flex justify-between text-xs text-steelGrey mb-2">
                                <span>Control Stability</span>
                                <span>Risk of Failure</span>
                            </div>
                            <div className="w-full h-2 bg-deepDivider rounded-full overflow-hidden">
                                <div className="h-full bg-gradient-to-r from-emerald-500 via-yellow-500 to-riskHigh w-[60%]"></div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="order-1 lg:order-2">
                    <div className="inline-flex items-center px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-4 border border-emerald-500/20">
                        Maintain
                    </div>
                    <h2 className="text-3xl font-bold text-white mb-4">Renewal Mode & Predictive Drift</h2>
                    <p className="text-lg text-steelGrey mb-6 leading-relaxed">
                        Compliance isn't a one-time event. Renewal Mode helps you prepare for next year's audit today.
                    </p>
                    <ul className="space-y-4">
                        <li className="flex items-start">
                            <TrendingDown size={20} className="text-emerald-500 mr-3 mt-1 shrink-0" />
                            <div>
                                <h4 className="text-white font-bold">Drift Detection</h4>
                                <p className="text-sm text-steelGrey">The system analyzes your manual vs. automated controls to predict "Control Decay" over time.</p>
                            </div>
                        </li>
                        <li className="flex items-start">
                            <Clock size={20} className="text-emerald-500 mr-3 mt-1 shrink-0" />
                            <div>
                                <h4 className="text-white font-bold">Audit Effort Prediction</h4>
                                <p className="text-sm text-steelGrey">Estimates whether your next audit will take 3 days or 3 weeks based on your current evidence hygiene.</p>
                            </div>
                        </li>
                        <li className="flex items-start">
                            <RefreshCw size={20} className="text-emerald-500 mr-3 mt-1 shrink-0" />
                            <div>
                                <h4 className="text-white font-bold">Cycle Management</h4>
                                <p className="text-sm text-steelGrey">Configurable for Annual, Semi-Annual, or Quarterly cycles. We remind you when to start preparing.</p>
                            </div>
                        </li>
                    </ul>
                </div>
            </div>

        </div>
    </PublicPageLayout>
  );
};

// --- PRODUCT PAGE (Existing) ---
export const ProductPage: React.FC<PageProps> = ({ navigate }) => {
  const artifacts = [
      {
          title: "Readiness Score",
          icon: PieChart,
          color: "text-brightBlue",
          bg: "bg-brightBlue/10",
          desc: "An instant, quantifiable health check (0-100) of your compliance posture based on coverage of risks and controls."
      },
      {
          title: "Process Flow",
          icon: GitCommit,
          color: "text-purple-500",
          bg: "bg-purple-500/10",
          desc: "AI-visualized step-by-step workflow mapping that automatically identifies 'Risk Hotspots' and decision points."
      },
      {
          title: "RACI Matrix",
          icon: Users,
          color: "text-emerald-500",
          bg: "bg-emerald-500/10",
          desc: "Enforce Segregation of Duties (SoD) by clearly defining who is Responsible, Accountable, Consulted, and Informed for every step."
      },
      {
          title: "Risk Heatmap",
          icon: Grid,
          color: "text-riskHigh",
          bg: "bg-riskHigh/10",
          desc: "Interactive visual matrix plotting Inherent vs. Residual risk based on Impact and Likelihood."
      },
      {
          title: "Control Objectives",
          icon: Target,
          color: "text-orange-500",
          bg: "bg-orange-500/10",
          desc: "High-level strategic goals that group your risks and controls, ensuring alignment with business intent."
      },
      {
          title: "Key Controls",
          icon: Key,
          color: "text-yellow-500",
          bg: "bg-yellow-500/10",
          desc: "The specific, testable activities (Preventive/Detecting) designed to mitigate your identified risks."
      },
      {
          title: "Test Plans",
          icon: ClipboardCheck,
          color: "text-cyan-500",
          bg: "bg-cyan-500/10",
          desc: "Step-by-step instructions for auditors to verify control effectiveness, including sampling methodologies."
      },
      {
          title: "Evidence Checklist",
          icon: FileCheck,
          color: "text-pink-500",
          bg: "bg-pink-500/10",
          desc: "A generated list of required artifacts (logs, screenshots, policies) linked directly to specific controls."
      },
      {
          title: "Framework Mapping",
          icon: BookOpen,
          color: "text-white",
          bg: "bg-white/10",
          desc: "The 'Rosetta Stone' connecting your internal controls to specific articles in ISO, SOC 2, NIST, and more."
      }
  ];

  return (
    <PublicPageLayout 
        title="The Anatomy of an Audit Package" 
        subtitle="Complimaxx doesn't just write text. It architects a complete compliance system. See exactly what you get."
        navigate={navigate}
    >
        <div className="space-y-20">
            
            {/* Visual Intro */}
            <div className="bg-gradient-to-br from-obsidianNavy to-[#0a1120] border border-deepDivider rounded-2xl p-8 md:p-12 relative overflow-hidden text-center">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-brightBlue via-purple-500 to-emerald-500"></div>
                <h2 className="text-3xl font-bold text-white mb-6">One Click, Nine Artifacts.</h2>
                <p className="text-steelGrey text-lg max-w-3xl mx-auto mb-8">
                    Stop manually linking spreadsheets. Our AI generates a relational database of compliance where every risk is linked to a control, and every control is mapped to a framework.
                </p>
                <div className="flex flex-wrap justify-center gap-4">
                     <span className="px-4 py-2 bg-black/40 rounded-full border border-deepDivider text-sm text-steelGrey flex items-center">
                        <CheckCircle size={14} className="text-brightBlue mr-2" /> Relational Mapping
                     </span>
                     <span className="px-4 py-2 bg-black/40 rounded-full border border-deepDivider text-sm text-steelGrey flex items-center">
                        <CheckCircle size={14} className="text-brightBlue mr-2" /> Audit-Grade Language
                     </span>
                     <span className="px-4 py-2 bg-black/40 rounded-full border border-deepDivider text-sm text-steelGrey flex items-center">
                        <CheckCircle size={14} className="text-brightBlue mr-2" /> Instant Export
                     </span>
                </div>
            </div>

            {/* THE ARTIFACT GRID */}
            <div>
                <h3 className="text-2xl font-bold text-white mb-8 border-l-4 border-brightBlue pl-4">Included in every package</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {artifacts.map((item, i) => (
                        <div key={i} className="bg-obsidianNavy border border-deepDivider rounded-xl p-6 hover:border-brightBlue transition-all duration-300 hover:-translate-y-1 group">
                            <div className="flex items-center mb-4">
                                <div className={`p-3 rounded-lg mr-4 ${item.bg} ${item.color} group-hover:scale-110 transition-transform`}>
                                    <item.icon size={24} />
                                </div>
                                <h4 className="text-xl font-bold text-white">{item.title}</h4>
                            </div>
                            <p className="text-steelGrey text-sm leading-relaxed">
                                {item.desc}
                            </p>
                        </div>
                    ))}
                </div>
            </div>

            {/* How it connects */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                <div>
                    <h3 className="text-2xl font-bold text-white mb-4">From "Chaos" to "Connected"</h3>
                    <p className="text-steelGrey mb-6">
                        In traditional audits, these 9 artifacts live in separate documents, emails, and folders. Complimaxx unifies them.
                    </p>
                    <ul className="space-y-4">
                        <li className="flex items-start">
                            <div className="mt-1 mr-3 min-w-[20px] h-5 rounded-full bg-brightBlue/20 text-brightBlue flex items-center justify-center text-xs font-bold">1</div>
                            <span className="text-sm text-white"><strong>Context-Aware:</strong> The AI reads your process description to identify specific risks, not generic ones.</span>
                        </li>
                        <li className="flex items-start">
                            <div className="mt-1 mr-3 min-w-[20px] h-5 rounded-full bg-brightBlue/20 text-brightBlue flex items-center justify-center text-xs font-bold">2</div>
                            <span className="text-sm text-white"><strong>Deep Linking:</strong> If you edit a Control, the Test Plan and Framework Mapping update automatically.</span>
                        </li>
                        <li className="flex items-start">
                            <div className="mt-1 mr-3 min-w-[20px] h-5 rounded-full bg-brightBlue/20 text-brightBlue flex items-center justify-center text-xs font-bold">3</div>
                            <span className="text-sm text-white"><strong>Gap Analysis:</strong> The system automatically flags "Orphaned Risks" (Risks without controls) via the Readiness Score.</span>
                        </li>
                    </ul>
                </div>
                <div className="relative">
                     {/* Abstract visualization of connection */}
                     <div className="bg-[#080C14] border border-deepDivider rounded-xl p-6 relative">
                         <div className="flex justify-between items-center mb-8 opacity-50">
                             <div className="w-12 h-12 rounded bg-deepDivider"></div>
                             <div className="h-0.5 flex-1 bg-deepDivider mx-4 border-t border-dashed"></div>
                             <div className="w-12 h-12 rounded bg-deepDivider"></div>
                         </div>
                         <div className="bg-obsidianNavy border border-brightBlue rounded-lg p-4 shadow-[0_0_30px_rgba(0,140,255,0.1)] relative z-10">
                             <div className="flex items-center mb-3 text-brightBlue">
                                 <ShieldCheck size={20} className="mr-2"/> <span className="font-bold">Control C-04</span>
                             </div>
                             <div className="space-y-2">
                                 <div className="text-xs text-steelGrey flex justify-between">
                                     <span>Mitigates:</span> <span className="text-white">Risk R-12 (Data Loss)</span>
                                 </div>
                                 <div className="text-xs text-steelGrey flex justify-between">
                                     <span>Verified by:</span> <span className="text-white">Test Plan T-02</span>
                                 </div>
                                 <div className="text-xs text-steelGrey flex justify-between">
                                     <span>Maps to:</span> <span className="text-white">ISO 27001 A.9.4</span>
                                 </div>
                             </div>
                         </div>
                     </div>
                </div>
            </div>

            <div className="text-center pt-12 pb-12">
                <button onClick={() => navigate(AppRoute.GET_STARTED)} className="bg-brightBlue hover:bg-blue-600 text-white px-10 py-4 rounded-full font-bold text-lg shadow-lg shadow-blue-500/20 transition-all hover:scale-105">
                    Generate Your First Package
                </button>
            </div>
        </div>
    </PublicPageLayout>
  );
};

// Helper Icon for visual
const ShieldCheck = ({size, className}: any) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        <path d="m9 12 2 2 4-4" />
    </svg>
);

// --- PRICING PAGE ---
export const PricingPage: React.FC<PageProps> = ({ navigate }) => {
    return (
        <PublicPageLayout title="Simple, Transparent Pricing" subtitle="Choose the plan that fits your compliance maturity." navigate={navigate}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
                 <div className="bg-techBlack border border-deepDivider rounded-2xl p-8">
                     <h3 className="text-xl font-bold text-white mb-2">Essentials</h3>
                     <p className="text-steelGrey text-sm mb-6">For small teams.</p>
                     <div className="text-4xl font-bold text-white mb-6">€99<span className="text-lg text-steelGrey font-normal">/mo</span></div>
                     <button onClick={() => navigate(AppRoute.GET_STARTED)} className="w-full bg-deepDivider hover:bg-white/10 text-white font-bold py-3 rounded-lg">Start Trial</button>
                 </div>
                 <div className="bg-obsidianNavy border border-brightBlue rounded-2xl p-8 relative shadow-2xl scale-105">
                     <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-brightBlue text-white text-xs font-bold px-3 py-1 rounded-full uppercase">Most Popular</div>
                     <h3 className="text-xl font-bold text-white mb-2">Pro</h3>
                     <p className="text-steelGrey text-sm mb-6">For growing companies.</p>
                     <div className="text-4xl font-bold text-white mb-6">€299<span className="text-lg text-steelGrey font-normal">/mo</span></div>
                     <button onClick={() => navigate(AppRoute.GET_STARTED)} className="w-full bg-brightBlue hover:bg-blue-600 text-white font-bold py-3 rounded-lg shadow-lg">Start Trial</button>
                 </div>
                 <div className="bg-techBlack border border-deepDivider rounded-2xl p-8">
                     <h3 className="text-xl font-bold text-white mb-2">Enterprise</h3>
                     <p className="text-steelGrey text-sm mb-6">For large organizations.</p>
                     <div className="text-4xl font-bold text-white mb-6">Custom</div>
                     <button onClick={() => navigate(AppRoute.CONTACT)} className="w-full bg-white text-techBlack hover:bg-gray-200 font-bold py-3 rounded-lg">Contact Sales</button>
                 </div>
            </div>
        </PublicPageLayout>
    );
};

// --- ABOUT PAGE ---
export const AboutPage: React.FC<PageProps> = ({ navigate }) => {
    return (
        <PublicPageLayout title="About Complimaxx" subtitle="We're on a mission to automate the pain out of compliance." navigate={navigate}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                <div>
                    <h3 className="text-2xl font-bold text-white mb-4">Our Story</h3>
                    <p className="text-steelGrey leading-relaxed mb-6">
                        Complimaxx was founded by former auditors and security engineers who were tired of managing compliance in spreadsheets. We realized that 80% of audit prep is repetitive pattern matching—perfect for AI.
                    </p>
                    <p className="text-steelGrey leading-relaxed">
                        Today, we help thousands of companies worldwide generate audit-ready documentation in minutes, not months.
                    </p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div className="bg-obsidianNavy p-6 rounded-xl border border-deepDivider text-center">
                        <div className="text-3xl font-bold text-brightBlue mb-1">500+</div>
                        <div className="text-xs text-steelGrey uppercase">Companies</div>
                    </div>
                    <div className="bg-obsidianNavy p-6 rounded-xl border border-deepDivider text-center">
                        <div className="text-3xl font-bold text-purple-500 mb-1">96</div>
                        <div className="text-xs text-steelGrey uppercase">Frameworks</div>
                    </div>
                    <div className="bg-obsidianNavy p-6 rounded-xl border border-deepDivider text-center">
                        <div className="text-3xl font-bold text-emerald-500 mb-1">1M+</div>
                        <div className="text-xs text-steelGrey uppercase">Controls Generated</div>
                    </div>
                    <div className="bg-obsidianNavy p-6 rounded-xl border border-deepDivider text-center">
                        <div className="text-3xl font-bold text-orange-500 mb-1">24/7</div>
                        <div className="text-xs text-steelGrey uppercase">Support</div>
                    </div>
                </div>
            </div>
        </PublicPageLayout>
    );
};

// --- SECURITY PAGE ---
export const SecurityPage: React.FC<PageProps> = ({ navigate }) => {
    return (
        <PublicPageLayout title="Security & Trust" subtitle="Your data security is our top priority." navigate={navigate}>
             <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
                <div className="bg-obsidianNavy p-8 rounded-xl border border-deepDivider">
                    <Shield size={32} className="text-emerald-500 mb-4" />
                    <h3 className="text-xl font-bold text-white mb-2">SOC 2 Type II</h3>
                    <p className="text-steelGrey text-sm">We are SOC 2 Type II compliant, verifying our security, availability, and confidentiality controls.</p>
                </div>
                <div className="bg-obsidianNavy p-8 rounded-xl border border-deepDivider">
                    <Lock size={32} className="text-brightBlue mb-4" />
                    <h3 className="text-xl font-bold text-white mb-2">Data Encryption</h3>
                    <p className="text-steelGrey text-sm">All data is encrypted at rest (AES-256) and in transit (TLS 1.3).</p>
                </div>
                <div className="bg-obsidianNavy p-8 rounded-xl border border-deepDivider">
                    <Server size={32} className="text-purple-500 mb-4" />
                    <h3 className="text-xl font-bold text-white mb-2">Data Residency</h3>
                    <p className="text-steelGrey text-sm">Choose where your data is stored. We offer hosting options in the US, EU, and APAC.</p>
                </div>
            </div>
        </PublicPageLayout>
    );
};

// --- HELP CENTER ---
export const HelpCenterPage: React.FC<PageProps> = ({ navigate }) => {
    return (
        <PublicPageLayout title="Help Center" subtitle="Guides, tutorials, and support for your compliance journey." navigate={navigate}>
             <div className="max-w-2xl mx-auto mb-12">
                 <div className="relative">
                     <input type="text" placeholder="Search for help articles..." className="w-full bg-obsidianNavy border border-deepDivider rounded-lg py-4 pl-12 pr-4 text-white focus:border-brightBlue outline-none" />
                     <Search size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-steelGrey" />
                 </div>
             </div>
             <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                 {['Getting Started', 'Framework Guides', 'Account Management', 'API Documentation', 'Troubleshooting', 'Billing'].map((topic, i) => (
                     <div key={i} className="bg-[#080C14] border border-deepDivider p-6 rounded-xl hover:border-brightBlue cursor-pointer transition-colors group">
                         <h4 className="font-bold text-white mb-2 group-hover:text-brightBlue">{topic}</h4>
                         <p className="text-sm text-steelGrey">View articles &rarr;</p>
                     </div>
                 ))}
             </div>
        </PublicPageLayout>
    );
};

// --- CONTACT PAGE ---
export const ContactPage: React.FC<PageProps> = ({ navigate }) => {
    return (
        <PublicPageLayout title="Contact Us" subtitle="We'd love to hear from you." navigate={navigate}>
             <div className="max-w-xl mx-auto bg-obsidianNavy border border-deepDivider rounded-2xl p-8">
                 <div className="space-y-4">
                     <div>
                         <label className="block text-sm font-bold text-steelGrey mb-2">Name</label>
                         <input type="text" className="w-full bg-[#080C14] border border-deepDivider rounded-lg p-3 text-white focus:border-brightBlue outline-none" />
                     </div>
                     <div>
                         <label className="block text-sm font-bold text-steelGrey mb-2">Email</label>
                         <input type="email" className="w-full bg-[#080C14] border border-deepDivider rounded-lg p-3 text-white focus:border-brightBlue outline-none" />
                     </div>
                     <div>
                         <label className="block text-sm font-bold text-steelGrey mb-2">Message</label>
                         <textarea className="w-full h-32 bg-[#080C14] border border-deepDivider rounded-lg p-3 text-white focus:border-brightBlue outline-none"></textarea>
                     </div>
                     <button className="w-full bg-brightBlue hover:bg-blue-600 text-white font-bold py-3 rounded-lg shadow-lg">Send Message</button>
                 </div>
                 <div className="mt-8 pt-8 border-t border-deepDivider flex justify-between text-steelGrey text-sm">
                     <div className="flex items-center"><Mail size={16} className="mr-2"/> support@complimaxx.com</div>
                     <div className="flex items-center"><Phone size={16} className="mr-2"/> +1 (555) 123-4567</div>
                 </div>
             </div>
        </PublicPageLayout>
    );
};

// --- LEGAL PAGE ---
export const LegalPage: React.FC<{ navigate: (route: AppRoute) => void; type: string }> = ({ navigate, type }) => {
    return (
        <PublicPageLayout title={type} subtitle={`Last updated: ${new Date().toLocaleDateString()}`} navigate={navigate}>
             <div className="max-w-4xl mx-auto bg-obsidianNavy border border-deepDivider rounded-2xl p-12 text-left space-y-8 text-steelGrey">
                 <h2 className="text-2xl font-bold text-white">1. Overview</h2>
                 <p>This is a placeholder for the official {type} document. In a production environment, this page would contain the full legal text prepared by counsel.</p>
                 <h2 className="text-2xl font-bold text-white">2. Data Usage</h2>
                 <p>We respect your data and privacy. Please review our full policies to understand how we collect, store, and process your information.</p>
                 <h2 className="text-2xl font-bold text-white">3. Contact</h2>
                 <p>If you have any questions regarding this document, please contact legal@complimaxx.com.</p>
             </div>
        </PublicPageLayout>
    );
};

// --- GET STARTED PAGE ---
export const GetStartedPage: React.FC<PageProps> = ({ navigate }) => {
    return (
        <PublicPageLayout title="Start Your Free Trial" subtitle="No credit card required. Cancel anytime." navigate={navigate}>
             <div className="max-w-md mx-auto bg-obsidianNavy border border-deepDivider rounded-2xl p-8">
                 <button className="w-full bg-white text-techBlack font-bold py-3 rounded-lg flex items-center justify-center mb-4 hover:bg-gray-100">
                     <img src="https://www.google.com/favicon.ico" alt="Google" className="w-4 h-4 mr-2" />
                     Sign up with Google
                 </button>
                 <div className="text-center text-steelGrey text-xs my-4 uppercase tracking-widest">Or continue with email</div>
                 <div className="space-y-4">
                     <input type="email" placeholder="Work Email" className="w-full bg-[#080C14] border border-deepDivider rounded-lg p-3 text-white focus:border-brightBlue outline-none" />
                     <input type="password" placeholder="Password" className="w-full bg-[#080C14] border border-deepDivider rounded-lg p-3 text-white focus:border-brightBlue outline-none" />
                     <button className="w-full bg-brightBlue hover:bg-blue-600 text-white font-bold py-3 rounded-lg shadow-lg">Create Account</button>
                 </div>
                 <p className="text-xs text-steelGrey text-center mt-6">
                     By signing up, you agree to our <span className="text-brightBlue cursor-pointer" onClick={() => navigate(AppRoute.TERMS)}>Terms</span> and <span className="text-brightBlue cursor-pointer" onClick={() => navigate(AppRoute.PRIVACY)}>Privacy Policy</span>.
                 </p>
             </div>
        </PublicPageLayout>
    );
};

// --- TUTORIALS PAGE ---
export const TutorialsPage: React.FC<PageProps> = ({ navigate }) => {
    return (
        <PublicPageLayout title="Video Tutorials" subtitle="Learn how to master Complimaxx in minutes." navigate={navigate}>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                 {[
                     "How to generate your first audit package",
                     "Customizing controls and risks",
                     "Managing evidence collection",
                     "Using the Renewal Mode dashboard"
                 ].map((title, i) => (
                     <div key={i} className="bg-obsidianNavy border border-deepDivider rounded-xl overflow-hidden group hover:border-brightBlue transition-all cursor-pointer">
                         <div className="h-48 bg-black/50 flex items-center justify-center relative">
                             <PlayCircle size={48} className="text-white opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all" />
                         </div>
                         <div className="p-6">
                             <h3 className="font-bold text-white text-lg mb-2">{title}</h3>
                             <p className="text-sm text-steelGrey">5 min watch</p>
                         </div>
                     </div>
                 ))}
             </div>
        </PublicPageLayout>
    );
};

// --- BLOG PAGE ---
export const BlogPage: React.FC<PageProps> = ({ navigate }) => {
    return (
        <PublicPageLayout title="Compliance Blog" subtitle="Insights, news, and guides from industry experts." navigate={navigate}>
             <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                 {[
                     "The Future of AI in Auditing",
                     "ISO 27001:2022 Changes Explained",
                     "How to Survive a SOC 2 Audit",
                     "GDPR Compliance for Startups",
                     "Automating Evidence Collection",
                     "The Cost of Non-Compliance"
                 ].map((title, i) => (
                     <div key={i} className="bg-obsidianNavy border border-deepDivider rounded-xl overflow-hidden hover:border-brightBlue transition-colors cursor-pointer group">
                         <div className="h-40 bg-gradient-to-br from-gray-800 to-gray-900"></div>
                         <div className="p-6">
                             <div className="text-xs text-brightBlue font-bold uppercase mb-2">Article</div>
                             <h3 className="font-bold text-white text-lg mb-2 group-hover:text-brightBlue transition-colors">{title}</h3>
                             <p className="text-sm text-steelGrey">Read more &rarr;</p>
                         </div>
                     </div>
                 ))}
             </div>
        </PublicPageLayout>
    );
};

// --- NEWSLETTER PAGE ---
export const NewsletterPage: React.FC<PageProps> = ({ navigate }) => {
    return (
        <PublicPageLayout title="Subscribe to Updates" subtitle="Get the latest compliance news delivered to your inbox." navigate={navigate}>
             <div className="max-w-xl mx-auto text-center">
                 <div className="flex gap-4 mb-6">
                     <input type="email" placeholder="Enter your email" className="flex-1 bg-obsidianNavy border border-deepDivider rounded-lg p-4 text-white focus:border-brightBlue outline-none" />
                     <button className="bg-brightBlue hover:bg-blue-600 text-white font-bold px-8 rounded-lg shadow-lg">Subscribe</button>
                 </div>
                 <p className="text-sm text-steelGrey">No spam. Unsubscribe at any time.</p>
             </div>
        </PublicPageLayout>
    );
};
