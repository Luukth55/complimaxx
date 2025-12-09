
import React, { useState } from 'react';
import { 
  Shield, 
  Zap, 
  CheckCircle, 
  ArrowRight, 
  Layout, 
  Globe, 
  Users, 
  FileText, 
  Lock,
  ChevronDown,
  ChevronUp,
  X,
  Check,
  Star,
  Play,
  RefreshCw,
  Search,
  Database
} from 'lucide-react';

interface LandingPageProps {
  onLogin: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onLogin }) => {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

  const toggleFaq = (index: number) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-techBlack font-sans text-white overflow-x-hidden selection:bg-brightBlue/30">
      {/* Navbar */}
      <nav className="border-b border-deepDivider bg-techBlack/80 backdrop-blur-md sticky top-0 z-50 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center space-x-2 text-brightBlue cursor-pointer" onClick={() => window.scrollTo(0,0)}>
            <div className="w-8 h-8 rounded bg-gradient-to-br from-brightBlue to-blue-600 flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-brightBlue/20">C</div>
            <span className="text-xl font-bold tracking-tight text-white">Complimaxx</span>
          </div>
          
          <div className="hidden md:flex items-center space-x-8 text-sm font-medium text-steelGrey">
            <a href="#product" className="hover:text-white transition-colors">Product</a>
            <a href="#features" className="hover:text-white transition-colors">Features</a>
            <a href="#how-it-works" className="hover:text-white transition-colors">How it Works</a>
            <a href="#pricing" className="hover:text-white transition-colors">Pricing</a>
            <a href="#resources" className="hover:text-white transition-colors">Resources</a>
          </div>

          <div className="flex items-center gap-4">
             <button onClick={onLogin} className="text-sm font-bold text-white hover:text-brightBlue transition-colors">Login</button>
             <button 
                onClick={onLogin}
                className="bg-white text-techBlack hover:bg-gray-100 px-5 py-2 rounded-full font-bold text-sm transition-all shadow-[0_0_15px_rgba(255,255,255,0.1)] hover:shadow-[0_0_20px_rgba(255,255,255,0.3)]"
            >
                Start Free Trial
            </button>
          </div>
        </div>
      </nav>

      {/* 1. HERO SECTION */}
      <section className="pt-28 pb-20 px-6 text-center relative overflow-hidden">
        {/* Background Effects */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-brightBlue/10 rounded-full blur-[120px] -z-10 animate-pulse"></div>
        <div className="absolute top-20 right-0 w-[400px] h-[400px] bg-purple-500/5 rounded-full blur-[100px] -z-10"></div>
        
        <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-8 max-w-5xl mx-auto leading-tight">
          Turn Compliance Chaos Into <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-brightBlue to-purple-400">Audit-Ready Packages in Minutes.</span>
        </h1>
        
        <p className="text-xl text-steelGrey max-w-3xl mx-auto mb-10 leading-relaxed">
          Complimaxx generates complete ISO/NIST/SOC2 audit documentation — process flows, RACI, risks, controls, test plans, evidence lists — all in one click.
        </p>
        
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-20">
          <button onClick={onLogin} className="bg-brightBlue hover:bg-blue-600 text-white px-8 py-4 rounded-full font-bold text-lg shadow-[0_0_30px_rgba(0,140,255,0.3)] hover:shadow-[0_0_40px_rgba(0,140,255,0.5)] transition-all flex items-center transform hover:-translate-y-1">
            Start Free 3-Day Trial <ArrowRight size={20} className="ml-2" />
          </button>
          <button className="px-8 py-4 rounded-full border border-deepDivider text-white hover:bg-white/5 font-bold text-lg transition-colors flex items-center">
            <Play size={18} className="mr-2 text-brightBlue" /> See Live Demo
          </button>
        </div>

        {/* Product Visual */}
        <div className="max-w-6xl mx-auto bg-obsidianNavy rounded-xl border border-deepDivider shadow-2xl p-2 relative overflow-hidden group perspective-1000">
            <div className="bg-[#080C14] rounded-lg aspect-[16/9] flex items-center justify-center relative overflow-hidden border border-deepDivider/50">
                 {/* Dashboard UI Simulation */}
                 <div className="absolute inset-0 flex p-6">
                    {/* Sidebar */}
                    <div className="w-64 border-r border-deepDivider pr-6 hidden md:block space-y-6">
                        <div className="h-8 w-32 bg-deepDivider/30 rounded mb-8"></div>
                        <div className="space-y-3">
                            <div className="h-10 w-full bg-brightBlue/10 border-l-2 border-brightBlue rounded flex items-center px-3"><div className="w-20 h-2 bg-brightBlue/50 rounded"></div></div>
                            <div className="h-10 w-full bg-transparent rounded flex items-center px-3"><div className="w-24 h-2 bg-deepDivider/50 rounded"></div></div>
                            <div className="h-10 w-full bg-transparent rounded flex items-center px-3"><div className="w-16 h-2 bg-deepDivider/50 rounded"></div></div>
                        </div>
                    </div>
                    {/* Main Content */}
                    <div className="flex-1 pl-6">
                        <div className="flex justify-between items-center mb-8">
                             <div>
                                 <div className="h-6 w-48 bg-white/20 rounded mb-2"></div>
                                 <div className="h-4 w-64 bg-deepDivider/50 rounded"></div>
                             </div>
                             <div className="h-10 w-32 bg-brightBlue rounded shadow-lg shadow-brightBlue/20"></div>
                        </div>
                        {/* Cards */}
                        <div className="grid grid-cols-3 gap-6 mb-8">
                            <div className="h-32 bg-obsidianNavy border border-deepDivider rounded-xl p-4 flex flex-col justify-between">
                                <div className="w-8 h-8 rounded bg-riskLow/20 mb-2"></div>
                                <div className="h-2 w-12 bg-riskLow/50 rounded"></div>
                            </div>
                            <div className="h-32 bg-obsidianNavy border border-deepDivider rounded-xl p-4 flex flex-col justify-between">
                                <div className="w-8 h-8 rounded bg-riskMedium/20 mb-2"></div>
                                <div className="h-2 w-12 bg-riskMedium/50 rounded"></div>
                            </div>
                            <div className="h-32 bg-obsidianNavy border border-deepDivider rounded-xl p-4 flex flex-col justify-between">
                                <div className="w-8 h-8 rounded bg-brightBlue/20 mb-2"></div>
                                <div className="h-2 w-12 bg-brightBlue/50 rounded"></div>
                            </div>
                        </div>
                        {/* Table */}
                        <div className="space-y-4">
                            <div className="h-12 w-full bg-obsidianNavy border border-deepDivider rounded flex items-center px-4"><div className="w-full h-2 bg-deepDivider/30 rounded"></div></div>
                            <div className="h-12 w-full bg-obsidianNavy border border-deepDivider rounded flex items-center px-4"><div className="w-3/4 h-2 bg-deepDivider/30 rounded"></div></div>
                            <div className="h-12 w-full bg-obsidianNavy border border-deepDivider rounded flex items-center px-4"><div className="w-5/6 h-2 bg-deepDivider/30 rounded"></div></div>
                        </div>
                    </div>
                 </div>
                 
                 {/* Floating Processing Badge */}
                 <div className="absolute bottom-10 right-10 bg-techBlack border border-brightBlue/30 text-brightBlue px-4 py-2 rounded-full text-sm font-mono shadow-xl flex items-center animate-pulse">
                    <RefreshCw size={14} className="mr-2 animate-spin" /> Generating Audit Package...
                 </div>
            </div>
        </div>
      </section>

      {/* 2. PARTNERS SECTION */}
      <section className="py-10 border-y border-deepDivider bg-[#080C14]">
        <div className="max-w-7xl mx-auto px-6 text-center">
            <p className="text-sm text-steelGrey mb-8 font-medium uppercase tracking-widest">Trusted by compliance, IT, and security teams worldwide</p>
            <div className="flex flex-wrap justify-center items-center gap-12 md:gap-20 opacity-40 hover:opacity-80 transition-opacity duration-500 grayscale">
                 <span className="text-2xl font-bold font-sans tracking-tighter">FinTech Co.</span>
                 <span className="text-xl font-bold font-serif">SecureCloud</span>
                 <span className="text-xl font-bold font-mono tracking-widest">AUTOGROUP</span>
                 <span className="text-2xl font-extrabold italic">HealthNet</span>
                 <span className="text-xl font-bold">DataLabs</span>
                 <span className="text-xl font-bold font-serif">RiskPartners</span>
                 <span className="text-xl font-bold tracking-tight">ControlHub</span>
            </div>
        </div>
      </section>

      {/* 3. BENEFITS SECTION */}
      <section id="features" className="py-24 px-6 max-w-7xl mx-auto">
        <div className="text-center mb-16 max-w-3xl mx-auto">
          <span className="text-brightBlue font-bold tracking-wider text-sm uppercase mb-2 block">Why teams choose Complimaxx</span>
          <h2 className="text-3xl md:text-5xl font-bold mb-6">Focus on security, not paperwork</h2>
          <p className="text-xl text-steelGrey">We automate the boring parts of compliance so you can focus on risk management.</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Card 1 */}
          <div className="bg-obsidianNavy p-8 rounded-2xl border border-deepDivider hover:border-brightBlue transition-all duration-300 group hover:-translate-y-1">
             <div className="w-12 h-12 bg-brightBlue/10 rounded-xl flex items-center justify-center text-brightBlue mb-6 group-hover:scale-110 transition-transform">
                <Zap size={24} />
             </div>
             <h3 className="text-xl font-bold text-white mb-3">Speed</h3>
             <p className="text-steelGrey leading-relaxed">
               Generate complete audit packages 20× faster than manual drafting or consulting.
             </p>
          </div>

          {/* Card 2 */}
          <div className="bg-obsidianNavy p-8 rounded-2xl border border-deepDivider hover:border-brightBlue transition-all duration-300 group hover:-translate-y-1">
             <div className="w-12 h-12 bg-purple-500/10 rounded-xl flex items-center justify-center text-purple-500 mb-6 group-hover:scale-110 transition-transform">
                <CheckCircle size={24} />
             </div>
             <h3 className="text-xl font-bold text-white mb-3">Accuracy</h3>
             <p className="text-steelGrey leading-relaxed">
               Framework-aligned output matching ISO, NIST, SOC2, COBIT, and more precisely.
             </p>
          </div>

          {/* Card 3 */}
          <div className="bg-obsidianNavy p-8 rounded-2xl border border-deepDivider hover:border-brightBlue transition-all duration-300 group hover:-translate-y-1">
             <div className="w-12 h-12 bg-emerald-500/10 rounded-xl flex items-center justify-center text-emerald-500 mb-6 group-hover:scale-110 transition-transform">
                <FileText size={24} />
             </div>
             <h3 className="text-xl font-bold text-white mb-3">Fully Editable</h3>
             <p className="text-steelGrey leading-relaxed">
               Every generated item — from risks to evidence lists — can be edited inline.
             </p>
          </div>

          {/* Card 4 */}
          <div className="bg-obsidianNavy p-8 rounded-2xl border border-deepDivider hover:border-brightBlue transition-all duration-300 group hover:-translate-y-1">
             <div className="w-12 h-12 bg-orange-500/10 rounded-xl flex items-center justify-center text-orange-500 mb-6 group-hover:scale-110 transition-transform">
                <Database size={24} />
             </div>
             <h3 className="text-xl font-bold text-white mb-3">Centralized Compliance Hub</h3>
             <p className="text-steelGrey leading-relaxed">
               All processes, risks, gaps, and evidence stored securely in one workspace.
             </p>
          </div>

          {/* Card 5 */}
          <div className="bg-obsidianNavy p-8 rounded-2xl border border-deepDivider hover:border-brightBlue transition-all duration-300 group hover:-translate-y-1">
             <div className="w-12 h-12 bg-rose-500/10 rounded-xl flex items-center justify-center text-rose-500 mb-6 group-hover:scale-110 transition-transform">
                <Search size={24} />
             </div>
             <h3 className="text-xl font-bold text-white mb-3">Gap Detection</h3>
             <p className="text-steelGrey leading-relaxed">
               Instantly detect missing controls and required improvements before the auditor does.
             </p>
          </div>

          {/* Card 6 */}
          <div className="bg-obsidianNavy p-8 rounded-2xl border border-deepDivider hover:border-brightBlue transition-all duration-300 group hover:-translate-y-1">
             <div className="w-12 h-12 bg-cyan-500/10 rounded-xl flex items-center justify-center text-cyan-500 mb-6 group-hover:scale-110 transition-transform">
                <RefreshCw size={24} />
             </div>
             <h3 className="text-xl font-bold text-white mb-3">Yearly Renewal Mode</h3>
             <p className="text-steelGrey leading-relaxed">
               Prepare for yearly audits with automated delta updates and evidence refresh.
             </p>
          </div>
        </div>
      </section>

      {/* 4. HOW IT WORKS SECTION */}
      <section id="how-it-works" className="py-24 bg-[#080C14] border-y border-deepDivider">
        <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-16">
                <h2 className="text-3xl md:text-5xl font-bold mb-4">Get compliant in 3 simple steps</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
                {/* Connecting Lines (Desktop) */}
                <div className="hidden md:block absolute top-12 left-[20%] w-[25%] h-0.5 border-t-2 border-dashed border-deepDivider/50"></div>
                <div className="hidden md:block absolute top-12 right-[20%] w-[25%] h-0.5 border-t-2 border-dashed border-deepDivider/50"></div>

                <div className="text-center relative z-10">
                    <div className="w-24 h-24 bg-obsidianNavy border-2 border-brightBlue rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-8 shadow-[0_0_20px_rgba(0,140,255,0.2)]">1</div>
                    <h3 className="text-xl font-bold text-white mb-3">Provide your process</h3>
                    <p className="text-steelGrey max-w-xs mx-auto">Upload text, paste a procedure, or briefly describe your workflow.</p>
                </div>

                <div className="text-center relative z-10">
                    <div className="w-24 h-24 bg-obsidianNavy border-2 border-purple-500 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-8 shadow-[0_0_20px_rgba(168,85,247,0.2)]">2</div>
                    <h3 className="text-xl font-bold text-white mb-3">Select frameworks</h3>
                    <p className="text-steelGrey max-w-xs mx-auto">Choose ISO 27001, NIST CSF, SOC 2, GDPR, or any of the 96 supported frameworks.</p>
                </div>

                <div className="text-center relative z-10">
                    <div className="w-24 h-24 bg-obsidianNavy border-2 border-emerald-500 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-8 shadow-[0_0_20px_rgba(16,185,129,0.2)]">3</div>
                    <h3 className="text-xl font-bold text-white mb-3">Generate package</h3>
                    <p className="text-steelGrey max-w-xs mx-auto">Receive Process Flow, RACI, RCM, Controls, Test Plans, and Evidence Checklist.</p>
                </div>
            </div>

            <div className="mt-16 text-center">
                 <button onClick={onLogin} className="text-brightBlue hover:text-white font-bold text-lg flex items-center justify-center mx-auto group">
                    Generate Your First Audit Package <ArrowRight size={20} className="ml-2 group-hover:translate-x-1 transition-transform" />
                 </button>
            </div>
        </div>
      </section>

      {/* 5. PRICING SECTION */}
      <section id="pricing" className="py-24 px-6 max-w-7xl mx-auto">
         <div className="text-center mb-12">
             <span className="text-brightBlue font-bold tracking-wider text-sm uppercase mb-2 block">Pricing</span>
             <h2 className="text-3xl md:text-5xl font-bold mb-6">Why buy and how it helps</h2>
             
             {/* Toggle */}
             <div className="flex items-center justify-center gap-4 mt-8">
                 <span className={`text-sm font-medium ${billingCycle === 'monthly' ? 'text-white' : 'text-steelGrey'}`}>Monthly</span>
                 <button 
                    onClick={() => setBillingCycle(billingCycle === 'monthly' ? 'yearly' : 'monthly')}
                    className="w-14 h-7 bg-deepDivider rounded-full p-1 relative transition-colors duration-300 ease-in-out focus:outline-none"
                 >
                     <div className={`w-5 h-5 bg-brightBlue rounded-full shadow-md transform transition-transform duration-300 ${billingCycle === 'yearly' ? 'translate-x-7' : ''}`}></div>
                 </button>
                 <span className={`text-sm font-medium ${billingCycle === 'yearly' ? 'text-white' : 'text-steelGrey'}`}>
                     Yearly <span className="text-emerald-500 text-xs font-bold ml-1">(20% OFF)</span>
                 </span>
             </div>
         </div>

         <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
             {/* ESSENTIALS */}
             <div className="bg-techBlack border border-deepDivider rounded-2xl p-8 hover:border-deepDivider/80 transition-all">
                 <h3 className="text-xl font-bold text-white mb-2">Essentials</h3>
                 <p className="text-steelGrey text-sm mb-6 h-10">For solo founders or small teams starting with compliance.</p>
                 <div className="text-4xl font-bold text-white mb-6">€99<span className="text-lg text-steelGrey font-normal">/mo</span></div>
                 
                 <button onClick={onLogin} className="w-full bg-deepDivider hover:bg-white/10 text-white font-bold py-3 rounded-lg mb-8 transition-colors">Start Trial</button>
                 
                 <ul className="space-y-4 text-sm text-steelGrey">
                     <li className="flex items-center"><Check size={16} className="text-white mr-3 shrink-0"/> 2 Frameworks (ISO + SOC2)</li>
                     <li className="flex items-center"><Check size={16} className="text-white mr-3 shrink-0"/> 1 User</li>
                     <li className="flex items-center"><Check size={16} className="text-white mr-3 shrink-0"/> 15 Processes / month</li>
                     <li className="flex items-center"><Check size={16} className="text-white mr-3 shrink-0"/> All Features Included</li>
                     <li className="flex items-center"><Check size={16} className="text-white mr-3 shrink-0"/> Editor Mode</li>
                     <li className="flex items-center"><Check size={16} className="text-white mr-3 shrink-0"/> Evidence Checklist</li>
                     <li className="flex items-center"><Check size={16} className="text-white mr-3 shrink-0"/> Simple Exports (PDF/DOCX)</li>
                 </ul>
             </div>

             {/* PRO (Highlighted) */}
             <div className="bg-obsidianNavy border border-brightBlue rounded-2xl p-8 relative shadow-2xl scale-105 z-10">
                 <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-brightBlue text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">Most Popular</div>
                 <h3 className="text-xl font-bold text-white mb-2">Pro</h3>
                 <p className="text-steelGrey text-sm mb-6 h-10">For growing teams managing multiple audits.</p>
                 <div className="text-4xl font-bold text-white mb-6">€299<span className="text-lg text-steelGrey font-normal">/mo</span></div>
                 
                 <button onClick={onLogin} className="w-full bg-brightBlue hover:bg-blue-600 text-white font-bold py-3 rounded-lg mb-8 transition-colors shadow-lg shadow-brightBlue/20">Start Trial</button>
                 
                 <ul className="space-y-4 text-sm text-white">
                     <li className="flex items-center"><Check size={16} className="text-brightBlue mr-3 shrink-0"/> 10 Frameworks</li>
                     <li className="flex items-center"><Check size={16} className="text-brightBlue mr-3 shrink-0"/> 3 Users</li>
                     <li className="flex items-center"><Check size={16} className="text-brightBlue mr-3 shrink-0"/> 60 Processes / month</li>
                     <li className="flex items-center"><Check size={16} className="text-brightBlue mr-3 shrink-0"/> All Features Included</li>
                     <li className="flex items-center"><Check size={16} className="text-brightBlue mr-3 shrink-0"/> Priority Generation</li>
                     <li className="flex items-center"><Check size={16} className="text-brightBlue mr-3 shrink-0"/> Advanced Export Templates</li>
                     <li className="flex items-center"><Check size={16} className="text-brightBlue mr-3 shrink-0"/> Gap Tracking</li>
                     <li className="flex items-center"><Check size={16} className="text-brightBlue mr-3 shrink-0"/> Checklists + Test Plans</li>
                     <li className="flex items-center"><Check size={16} className="text-brightBlue mr-3 shrink-0"/> Yearly Renewal Mode</li>
                 </ul>
             </div>

             {/* ENTERPRISE */}
             <div className="bg-techBlack border border-deepDivider rounded-2xl p-8 hover:border-deepDivider/80 transition-all">
                 <h3 className="text-xl font-bold text-white mb-2">Enterprise</h3>
                 <p className="text-steelGrey text-sm mb-6 h-10">For companies managing mature compliance programs.</p>
                 <div className="text-4xl font-bold text-white mb-6">€699<span className="text-lg text-steelGrey font-normal">/mo</span></div>
                 
                 <button className="w-full bg-white text-techBlack hover:bg-gray-200 font-bold py-3 rounded-lg mb-8 transition-colors">Contact Sales</button>
                 
                 <ul className="space-y-4 text-sm text-steelGrey">
                     <li className="flex items-center"><Check size={16} className="text-white mr-3 shrink-0"/> 96 Frameworks</li>
                     <li className="flex items-center"><Check size={16} className="text-white mr-3 shrink-0"/> 10 Users</li>
                     <li className="flex items-center"><Check size={16} className="text-white mr-3 shrink-0"/> Unlimited Processes</li>
                     <li className="flex items-center"><Check size={16} className="text-white mr-3 shrink-0"/> All Features Included</li>
                     <li className="flex items-center"><Check size={16} className="text-white mr-3 shrink-0"/> White-Label Reports</li>
                     <li className="flex items-center"><Check size={16} className="text-white mr-3 shrink-0"/> SSO (SAML/OAuth)</li>
                     <li className="flex items-center"><Check size={16} className="text-white mr-3 shrink-0"/> Private Workspaces</li>
                     <li className="flex items-center"><Check size={16} className="text-white mr-3 shrink-0"/> Dedicated Onboarding</li>
                 </ul>
             </div>
         </div>
      </section>

      {/* 6. TESTIMONIALS SECTION */}
      <section className="py-24 bg-[#080C14] border-y border-deepDivider">
        <div className="max-w-7xl mx-auto px-6">
            <h2 className="text-3xl font-bold text-center mb-16">Loved by people worldwide</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Testimonial 1 */}
                <div className="bg-obsidianNavy p-8 rounded-2xl border border-deepDivider">
                    <div className="flex text-yellow-500 mb-4">
                        <Star size={16} fill="currentColor" /><Star size={16} fill="currentColor" /><Star size={16} fill="currentColor" /><Star size={16} fill="currentColor" /><Star size={16} fill="currentColor" />
                    </div>
                    <p className="text-lg text-white mb-6">"Complimaxx cut our ISO prep time from 3 months to 2 weeks. The RCM output alone saved us a full audit cycle."</p>
                    <div className="flex items-center">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center font-bold text-white mr-3">HS</div>
                        <div>
                            <div className="font-bold text-white text-sm">Head of Security</div>
                            <div className="text-xs text-steelGrey">FinTech Co.</div>
                        </div>
                    </div>
                </div>

                {/* Testimonial 2 */}
                <div className="bg-obsidianNavy p-8 rounded-2xl border border-deepDivider">
                    <div className="flex text-yellow-500 mb-4">
                        <Star size={16} fill="currentColor" /><Star size={16} fill="currentColor" /><Star size={16} fill="currentColor" /><Star size={16} fill="currentColor" /><Star size={16} fill="currentColor" />
                    </div>
                    <p className="text-lg text-white mb-6">"No more spreadsheets. No more panic before audits. Our team actually understands our controls now."</p>
                    <div className="flex items-center">
                        <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-full flex items-center justify-center font-bold text-white mr-3">CL</div>
                        <div>
                            <div className="font-bold text-white text-sm">Compliance Lead</div>
                            <div className="text-xs text-steelGrey">Healthcare Group</div>
                        </div>
                    </div>
                </div>

                {/* Testimonial 3 */}
                <div className="bg-obsidianNavy p-8 rounded-2xl border border-deepDivider">
                    <div className="flex text-yellow-500 mb-4">
                        <Star size={16} fill="currentColor" /><Star size={16} fill="currentColor" /><Star size={16} fill="currentColor" /><Star size={16} fill="currentColor" /><Star size={16} fill="currentColor" />
                    </div>
                    <p className="text-lg text-white mb-6">"The evidence checklist and renewal mode changed everything. We’re always audit-ready."</p>
                    <div className="flex items-center">
                        <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-600 rounded-full flex items-center justify-center font-bold text-white mr-3">JD</div>
                        <div>
                            <div className="font-bold text-white text-sm">CISO</div>
                            <div className="text-xs text-steelGrey">DataLabs</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
      </section>

      {/* 7. FAQ SECTION */}
      <section className="py-24 px-6 max-w-4xl mx-auto">
         <h2 className="text-3xl font-bold text-center mb-12">Frequently Asked Questions</h2>
         
         <div className="space-y-4">
            {[
                { q: "Is the generated output editable?", a: "Yes — every process, control, test step, and evidence item can be edited, commented, and versioned directly within the platform or after exporting." },
                { q: "Which frameworks are supported?", a: "Complimaxx includes 96 global frameworks including ISO 27001, NIST CSF, SOC 2, GDPR, PCI DSS, COBIT, HIPAA, and industry-specific standards like TISAX and NERC CIP." },
                { q: "How secure is my data?", a: "We prioritize security. We use encrypted storage, strict role-based access controls, secure cloud hosting, and we are fully GDPR compliant. We do not train our public models on your confidential process data." },
                { q: "Can I export everything?", a: "Yes — full packages can be exported to DOCX, PDF, and XLSX formats compatible with standard audit workflows." },
                { q: "Does Complimaxx replace auditors?", a: "No — it makes your organization audit-ready. Auditors appreciate the structured, standardized documentation, which significantly speeds up their review process." }
            ].map((item, index) => (
                <div key={index} className="bg-obsidianNavy border border-deepDivider rounded-xl overflow-hidden">
                    <button 
                        onClick={() => toggleFaq(index)}
                        className="w-full px-6 py-5 flex items-center justify-between text-left hover:bg-white/5 transition-colors"
                    >
                        <span className="font-bold text-white">{item.q}</span>
                        {openFaqIndex === index ? <ChevronUp size={20} className="text-brightBlue"/> : <ChevronDown size={20} className="text-steelGrey"/>}
                    </button>
                    {openFaqIndex === index && (
                        <div className="px-6 pb-5 text-steelGrey leading-relaxed border-t border-deepDivider/50 pt-4">
                            {item.a}
                        </div>
                    )}
                </div>
            ))}
         </div>
      </section>

      {/* 8. FINAL CTA */}
      <section className="py-20 px-6">
         <div className="max-w-5xl mx-auto bg-gradient-to-r from-brightBlue/20 to-purple-500/20 rounded-3xl p-12 text-center border border-white/10 relative overflow-hidden">
             <div className="absolute top-0 left-0 w-full h-full bg-noise opacity-10"></div>
             <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 relative z-10">
                 Ready to generate your first audit package?
             </h2>
             <p className="text-xl text-steelGrey mb-10 max-w-2xl mx-auto relative z-10">
                 Simplify compliance. Save months of work.
             </p>
             <button onClick={onLogin} className="relative z-10 bg-white text-techBlack hover:bg-gray-100 px-8 py-4 rounded-full font-bold text-lg transition-all shadow-xl hover:shadow-2xl hover:scale-105">
                Start Free 3-Day Trial
             </button>
         </div>
      </section>

      {/* 9. FOOTER */}
      <footer className="border-t border-deepDivider bg-[#05070B] pt-16 pb-12 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
            <div className="col-span-2 md:col-span-1">
                <div className="flex items-center space-x-2 text-brightBlue mb-6">
                    <div className="w-6 h-6 rounded bg-gradient-to-br from-brightBlue to-blue-600 flex items-center justify-center text-white font-bold text-xs">C</div>
                    <span className="text-lg font-bold tracking-tight text-white">Complimaxx</span>
                </div>
                <p className="text-steelGrey text-sm mb-4">
                    The enterprise AI audit platform for ISO, SOC 2, and more.
                </p>
            </div>
            
            <div>
                <h4 className="font-bold text-white mb-4">Product</h4>
                <ul className="space-y-3 text-sm text-steelGrey">
                    <li><a href="#" className="hover:text-brightBlue transition-colors">Product</a></li>
                    <li><a href="#" className="hover:text-brightBlue transition-colors">Features</a></li>
                    <li><a href="#" className="hover:text-brightBlue transition-colors">Pricing</a></li>
                    <li><a href="#" className="hover:text-brightBlue transition-colors">Get Started</a></li>
                </ul>
            </div>

            <div>
                <h4 className="font-bold text-white mb-4">Company</h4>
                <ul className="space-y-3 text-sm text-steelGrey">
                    <li><a href="#" className="hover:text-brightBlue transition-colors">About Us</a></li>
                    <li><a href="#" className="hover:text-brightBlue transition-colors">Contact</a></li>
                    <li><a href="#" className="hover:text-brightBlue transition-colors">Legal</a></li>
                    <li><a href="#" className="hover:text-brightBlue transition-colors">Privacy Policy</a></li>
                    <li><a href="#" className="hover:text-brightBlue transition-colors">Terms of Service</a></li>
                    <li><a href="#" className="hover:text-brightBlue transition-colors">Cookie Policy</a></li>
                    <li><a href="#" className="hover:text-brightBlue transition-colors">Data Processing Agreement</a></li>
                    <li><a href="#" className="hover:text-brightBlue transition-colors">Security</a></li>
                </ul>
            </div>

            <div>
                <h4 className="font-bold text-white mb-4">Support & Social</h4>
                <ul className="space-y-3 text-sm text-steelGrey">
                    <li><a href="#" className="hover:text-brightBlue transition-colors">Help Center</a></li>
                    <li><a href="#" className="hover:text-brightBlue transition-colors">Tutorials</a></li>
                    <li><a href="#" className="hover:text-brightBlue transition-colors">FAQ</a></li>
                    <li><a href="#" className="hover:text-brightBlue transition-colors">LinkedIn</a></li>
                    <li><a href="#" className="hover:text-brightBlue transition-colors">Twitter</a></li>
                    <li><a href="#" className="hover:text-brightBlue transition-colors">Newsletter Signup</a></li>
                </ul>
            </div>
        </div>
        
        <div className="max-w-7xl mx-auto border-t border-deepDivider pt-8 text-center text-steelGrey text-sm">
            <p>&copy; {new Date().getFullYear()} Complimaxx. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
