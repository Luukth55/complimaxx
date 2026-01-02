
import React, { useState } from 'react';
import { 
  Shield, Lock, FileText, CheckCircle, Mail, Briefcase, 
  Linkedin, Globe, Server, Users, BookOpen, PlayCircle, Search, 
  ArrowRight, Zap, RefreshCw, Database,
  CreditCard, Star, Play, HelpCircle, Check,
  GitCommit, AlertOctagon, ClipboardCheck, Sliders, Target,
  Phone, PieChart, ShieldAlert, FileCheck,
  Workflow, Layers, Clock, ChevronDown, Info, ShieldCheck, Cpu, History, Twitter
} from 'lucide-react';
import { AppRoute } from '../types';

interface NavProps {
  navigate: (route: AppRoute) => void;
}

// --- SHARED LAYOUT FOR PUBLIC PAGES ---
const PublicPageLayout: React.FC<{
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  navigate: (route: AppRoute) => void;
}> = ({ title, subtitle, children, navigate }) => {
  return (
    <div className="min-h-screen bg-techBlack text-white font-sans selection:bg-brightBlue/30">
      {/* Navbar exactly as requested: Logo left, Links middle, Login right */}
      <nav className="border-b border-deepDivider bg-techBlack/80 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center space-x-3 text-brightBlue cursor-pointer" onClick={() => navigate(AppRoute.LANDING)}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brightBlue to-blue-600 flex items-center justify-center text-white font-black text-xl shadow-lg">C</div>
            <span className="text-2xl font-black tracking-tighter text-white">Complimaxx</span>
          </div>
          <div className="hidden md:flex items-center space-x-12 text-[11px] font-black text-steelGrey uppercase tracking-[0.3em]">
            <button onClick={() => navigate(AppRoute.FEATURES)} className="hover:text-white transition-colors">Features</button>
            <button onClick={() => navigate(AppRoute.PRICING)} className="hover:text-white transition-colors">Pricing</button>
            <button onClick={() => navigate(AppRoute.ABOUT)} className="hover:text-white transition-colors">About Us</button>
          </div>
          <button onClick={() => navigate(AppRoute.LOGIN)} className="bg-white/5 hover:bg-brightBlue border border-white/10 hover:border-brightBlue text-white px-8 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all active:scale-95">
            Login
          </button>
        </div>
      </nav>

      <main className="pb-32">
        <div className="pt-24 pb-20 px-6 text-center border-b border-deepDivider bg-[#080C14] relative overflow-hidden">
          <div className="absolute inset-0 bg-tech-grid opacity-10"></div>
          <div className="relative z-10">
            <h1 className="text-5xl md:text-7xl font-black mb-6 tracking-tighter text-white animate-fadeIn">{title}</h1>
            {subtitle && <p className="text-xl text-steelGrey max-w-3xl mx-auto font-medium leading-relaxed">{subtitle}</p>}
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-6 pt-24">
            {children}
        </div>
      </main>

      <footer className="border-t border-deepDivider py-24 bg-[#030406]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-12 items-start w-full text-left">
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
                <li><button onClick={() => navigate(AppRoute.FAQ)} className="hover:text-brightBlue transition-colors text-left">FAQ</button></li>
                <li className="flex items-center gap-2 pt-2"><Linkedin size={12} className="text-brightBlue" /> <button className="hover:text-white transition-colors text-left">LinkedIn</button></li>
                <li className="flex items-center gap-2"><Twitter size={12} className="text-brightBlue" /> <button className="hover:text-white transition-colors text-left">Twitter</button></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-white/5 mt-16 pt-8 text-center text-[8px] font-black uppercase tracking-[0.8em] text-steelGrey w-full opacity-30">
            Copyright © Complimaxx — All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

// --- FEATURES PAGE ---
export const FeaturesPage: React.FC<NavProps> = ({ navigate }) => {
  const capabilities = [
    { title: "AI Audit Package Generator", desc: "Automatically generate complete audit documentation based on your selected frameworks and context.", icon: Zap, color: "text-yellow-400" },
    { title: "Process Flow (P01–Pxx)", desc: "Structured, standardized process flows that align with audit expectations and best practices.", icon: GitCommit, color: "text-brightBlue" },
    { title: "RACI Matrix", desc: "Define responsibilities clearly across teams to reduce ambiguity and audit findings.", icon: Users, color: "text-purple-400" },
    { title: "Risk & Control Matrix", desc: "Map risks to controls and ensure coverage across all compliance domains.", icon: ShieldAlert, color: "text-riskHigh" },
    { title: "Control Objectives", desc: "Translate abstract requirements into actionable, testable controls.", icon: Target, color: "text-orange-400" },
    { title: "Test Plans", desc: "Prepare audit-ready test scenarios aligned with each control.", icon: ClipboardCheck, color: "text-cyan-400" },
    { title: "Evidence Checklist", desc: "Track required evidence and upload documentation in one place.", icon: FileCheck, color: "text-emerald-400" },
    { title: "Audit Readiness Score", desc: "Get a real-time view of how prepared your organization is for an audit.", icon: PieChart, color: "text-pink-400" },
    { title: "Framework Mapping", desc: "Map processes and controls across multiple frameworks without duplication.", icon: BookOpen, color: "text-white" },
    { title: "Gap Tracking", desc: "Identify, assign, and resolve compliance gaps systematically.", icon: AlertOctagon, color: "text-red-500" },
    { title: "Renewal Mode", desc: "Re-evaluate processes and controls during audits or periodic renewals using AI.", icon: RefreshCw, color: "text-blue-400" },
    { title: "Editor Mode", desc: "Fully editable outputs — nothing is locked or black-boxed.", icon: Sliders, color: "text-steelGrey" },
    { title: "Project Workspace", desc: "Manage all compliance work in a structured, centralized environment.", icon: Layers, color: "text-indigo-400" },
  ];

  return (
    <PublicPageLayout 
        title="AI-Powered Compliance." 
        subtitle="Complimaxx helps organizations design, manage, and renew audit-ready processes — faster, clearer, and with zero manual spreadsheet pain."
        navigate={navigate}
    >
        <div className="space-y-40">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-20 items-center">
                <div className="space-y-8">
                    <h2 className="text-4xl font-black text-white uppercase tracking-tighter">The Full Lifecycle.</h2>
                    <p className="text-lg text-steelGrey leading-relaxed font-medium">
                        Instead of spreadsheets, static templates, or fragmented tools, Complimaxx provides a single workspace where compliance frameworks, processes, controls, risks, and evidence come together.
                    </p>
                    <p className="text-lg text-steelGrey leading-relaxed font-medium">
                        Built with Gemini 3.0 AI and a secure Supabase infrastructure, Complimaxx supports the full compliance lifecycle — from first implementation to recurring audits and renewals.
                    </p>
                </div>
                <div className="bg-obsidianNavy border border-white/5 rounded-[60px] p-12 shadow-2xl relative">
                    <h3 className="text-sm font-black text-brightBlue uppercase tracking-[0.5em] mb-12">How it works</h3>
                    <div className="space-y-10">
                        {[
                            { step: "01", title: "Select Framework", desc: "Choose from ISO, SOC, NIST, GDPR, NIS2, and more." },
                            { step: "02", title: "Generate with AI", desc: "Audit-ready processes, controls, and RACI in minutes." },
                            { step: "03", title: "Collect Evidence", desc: "Assign roles, track gaps, and upload evidence." },
                            { step: "04", title: "Renew Continuously", desc: "Stay compliant as your organization evolves." }
                        ].map((s, i) => (
                            <div key={i} className="flex gap-6 items-start">
                                <span className="text-xl font-black text-white/20">{s.step}</span>
                                <div>
                                    <h4 className="text-white font-bold mb-1 uppercase tracking-tight">{s.title}</h4>
                                    <p className="text-sm text-steelGrey leading-relaxed">{s.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div>
                <h2 className="text-4xl md:text-7xl font-black text-white mb-24 uppercase tracking-tighter text-center">Core Capabilities.</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {capabilities.map((c, i) => (
                        <div key={i} className="bg-obsidianNavy border border-white/5 rounded-[48px] p-12 hover:border-brightBlue transition-all group shadow-2xl flex flex-col">
                            <div className={`w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center ${c.color} mb-10 group-hover:scale-110 transition-transform`}>
                                <c.icon size={32} />
                            </div>
                            <h3 className="text-xl font-black text-white mb-6 uppercase tracking-tight">{c.title}</h3>
                            <p className="text-steelGrey text-sm leading-relaxed font-bold opacity-70 group-hover:opacity-100">{c.desc}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    </PublicPageLayout>
  );
};

// --- PRICING PAGE ---
export const PricingPage: React.FC<NavProps> = ({ navigate }) => {
  return (
    <PublicPageLayout 
        title="Simple Pricing." 
        subtitle="Full Power. No Feature Walls. All plans include full access to the complete Complimaxx platform."
        navigate={navigate}
    >
        <div className="space-y-32">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                {[
                  { plan: "Essentials", price: "99", desc: "Best for startups and small teams starting with structured compliance.", features: ["2 Frameworks", "1 User", "15 credits / month", "Full access"] },
                  { plan: "Pro", price: "299", desc: "Best for growing organizations managing multiple standards.", features: ["Up to 10 Frameworks", "Up to 3 Users", "60 credits / month"], highlight: true },
                  { plan: "Enterprise", price: "699", desc: "Best for mature, audit-driven organizations.", features: ["All 96 Frameworks", "Up to 10 Users", "Unlimited credits", "Full branding"] }
                ].map((p, i) => (
                  <div key={i} className={`rounded-[60px] p-16 flex flex-col items-center border transition-all duration-700 shadow-2xl relative ${p.highlight ? 'bg-gradient-to-b from-[#1C2533] to-techBlack border-2 border-brightBlue scale-105 z-10' : 'bg-obsidianNavy border border-white/5 hover:border-brightBlue/30'}`}>
                    {p.highlight && <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-brightBlue text-white text-[10px] font-black px-12 py-3.5 rounded-full uppercase tracking-[0.5em] shadow-lg">Most Popular</div>}
                    <h3 className="text-2xl font-black mb-4 uppercase tracking-tight text-white">{p.plan}</h3>
                    <p className="text-[10px] text-steelGrey uppercase font-black tracking-widest mb-10 text-center leading-relaxed">{p.desc}</p>
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
                    <button onClick={() => navigate(AppRoute.GET_STARTED)} className={`w-full py-6 rounded-2xl font-black text-[10px] uppercase tracking-[0.4em] transition-all ${p.highlight ? 'bg-brightBlue text-white shadow-xl hover:scale-105' : 'bg-white/5 text-white hover:bg-brightBlue'}`}>
                      Start Free Trial
                    </button>
                  </div>
                ))}
            </div>

            <div className="bg-obsidianNavy border border-white/5 rounded-[60px] p-16 max-w-4xl mx-auto shadow-2xl">
                <h3 className="text-2xl font-black text-white mb-10 uppercase tracking-tighter text-center">How AI Credits Work.</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                    <div className="space-y-6">
                        <h4 className="text-brightBlue font-black uppercase text-xs tracking-widest">Credits Consumed By:</h4>
                        <ul className="space-y-4">
                            {["Generating a new process", "Renewing a process for an audit cycle", "Re-mapping processes to new frameworks"].map((item, i) => (
                                <li key={i} className="flex items-center text-sm font-bold text-white"><Zap size={14} className="mr-3 text-brightBlue" /> {item}</li>
                            ))}
                        </ul>
                    </div>
                    <div className="opacity-50 space-y-6">
                        <h4 className="text-steelGrey font-black uppercase text-xs tracking-widest">Always Free / Unlimited:</h4>
                        <ul className="space-y-4">
                            {["Editing artifacts", "Evidence uploads", "Exports", "Daily collaboration"].map((item, i) => (
                                <li key={i} className="flex items-center text-sm font-bold text-steelGrey"><Check size={14} className="mr-3" /> {item}</li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    </PublicPageLayout>
  );
};

// --- GET STARTED PAGE ---
export const GetStartedPage: React.FC<NavProps> = ({ navigate }) => {
    return (
        <PublicPageLayout 
            title="Start Your Journey." 
            subtitle="Getting started with Complimaxx takes minutes — not months. Build audit readiness with confidence."
            navigate={navigate}
        >
            <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-20 items-center">
                <div className="space-y-12">
                    <h2 className="text-4xl font-black text-white uppercase tracking-tighter">Roadmap to Readiness.</h2>
                    <div className="space-y-10">
                        {[
                            { step: "01", title: "Create Identity", desc: "Securely register your organizational workspace." },
                            { step: "02", title: "Select Frameworks", desc: "Choose from 96 global standards to align with." },
                            { step: "03", title: "Generate Artifacts", desc: "Build your first audit package with neural automation." },
                            { step: "04", title: "Invite Collaborators", desc: "Bring your team into the workflow for evidence collection." },
                            { step: "05", title: "Prepare for Audit", desc: "Generate exports and readiness scores for auditors." }
                        ].map((s, i) => (
                            <div key={i} className="flex gap-8 items-start">
                                <div className="w-12 h-12 bg-brightBlue/10 rounded-xl flex items-center justify-center text-brightBlue font-black text-lg border border-brightBlue/20 shrink-0">{s.step}</div>
                                <div>
                                    <h4 className="text-white font-bold text-xl mb-1 uppercase tracking-tight">{s.title}</h4>
                                    <p className="text-steelGrey font-medium leading-relaxed">{s.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="bg-obsidianNavy border border-white/5 rounded-[60px] p-16 shadow-2xl flex flex-col items-center text-center">
                    <Star size={48} className="text-brightBlue mb-8 animate-pulse" />
                    <h3 className="text-3xl font-black text-white mb-6 uppercase tracking-tight">Access Terminal.</h3>
                    <p className="text-steelGrey font-medium mb-12 leading-relaxed">No credit card required for the first 3 days. Start your audit-ready transformation today.</p>
                    <button onClick={() => navigate(AppRoute.LOGIN)} className="w-full bg-brightBlue hover:bg-blue-600 text-white py-6 rounded-2xl font-black text-xs uppercase tracking-[0.4em] shadow-xl mb-6">Create Free Account</button>
                    <button onClick={() => navigate(AppRoute.CONTACT)} className="w-full bg-white/5 hover:bg-white/10 text-white py-6 rounded-2xl font-black text-xs uppercase tracking-[0.4em] border border-white/10">Book a Demo</button>
                </div>
            </div>
        </PublicPageLayout>
    );
};

// --- ABOUT PAGE ---
export const AboutPage: React.FC<NavProps> = ({ navigate }) => {
    return (
        <PublicPageLayout 
            title="Company." 
            subtitle="Automating the fragmentation, speed, and manual overhead of global compliance work."
            navigate={navigate}
        >
            <div className="max-w-4xl mx-auto space-y-24">
                <div className="bg-obsidianNavy border border-white/5 rounded-[60px] p-20 text-center shadow-2xl relative overflow-hidden">
                    <div className="absolute inset-0 bg-tech-grid opacity-5"></div>
                    <h2 className="text-4xl font-black text-white mb-12 uppercase tracking-tighter">About Us.</h2>
                    <p className="text-xl text-steelGrey leading-relaxed font-medium mb-12">
                        Complimaxx was built to solve a simple problem: compliance work is too manual, too fragmented, and too slow.
                    </p>
                    <p className="text-xl text-steelGrey leading-relaxed font-medium">
                        We combine AI, process design, and audit expertise to help organizations build compliance systems that actually scale. Our mission is to make enterprise-grade compliance accessible — without complexity, spreadsheets, or vendor lock-in.
                    </p>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                    {[
                        { label: "Founding", val: "2024" },
                        { label: "Frameworks", val: "96+" },
                        { label: "Security", val: "AES-256" },
                        { label: "Support", val: "24/7" }
                    ].map((item, i) => (
                        <div key={i} className="text-center">
                            <div className="text-4xl font-black text-white mb-2 tracking-tighter">{item.val}</div>
                            <div className="text-[10px] font-black text-brightBlue uppercase tracking-widest">{item.label}</div>
                        </div>
                    ))}
                </div>
            </div>
        </PublicPageLayout>
    );
};

// --- CONTACT PAGE ---
export const ContactPage: React.FC<NavProps> = ({ navigate }) => {
    return (
        <PublicPageLayout 
            title="Contact." 
            subtitle="Have questions, need support, or want to discuss enterprise deployments? We respond within one business day."
            navigate={navigate}
        >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-20">
                <div className="space-y-12">
                    <h2 className="text-3xl font-black text-white uppercase tracking-tighter">Our Channels.</h2>
                    <div className="space-y-8">
                        <div className="flex items-center gap-6 group">
                            <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center text-brightBlue group-hover:bg-brightBlue group-hover:text-white transition-all shadow-xl"><Mail size={24} /></div>
                            <div>
                                <div className="text-[10px] font-black text-steelGrey uppercase tracking-widest mb-1">Support</div>
                                <div className="text-lg font-bold text-white">support@complimaxx.com</div>
                            </div>
                        </div>
                        <div className="flex items-center gap-6 group">
                            <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center text-purple-400 group-hover:bg-purple-500 group-hover:text-white transition-all shadow-xl"><Briefcase size={24} /></div>
                            <div>
                                <div className="text-[10px] font-black text-steelGrey uppercase tracking-widest mb-1">Sales</div>
                                <div className="text-lg font-bold text-white">sales@complimaxx.com</div>
                            </div>
                        </div>
                        <div className="flex items-center gap-6 group">
                            <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center text-emerald-400 group-hover:bg-emerald-500 group-hover:text-white transition-all shadow-xl"><Linkedin size={24} /></div>
                            <div>
                                <div className="text-[10px] font-black text-steelGrey uppercase tracking-widest mb-1">Corporate</div>
                                <div className="text-lg font-bold text-white">linkedin.com/company/complimaxx</div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="bg-obsidianNavy border border-white/5 rounded-[60px] p-16 shadow-2xl">
                    <form className="space-y-8" onSubmit={(e) => e.preventDefault()}>
                        <div>
                            <label className="text-[10px] font-black text-steelGrey uppercase tracking-[0.4em] mb-4 block">Full Name</label>
                            <input type="text" className="w-full bg-[#080C14] border border-white/5 rounded-2xl px-8 py-5 text-white focus:border-brightBlue outline-none font-medium transition-all" placeholder="John Doe" />
                        </div>
                        <div>
                            <label className="text-[10px] font-black text-steelGrey uppercase tracking-[0.4em] mb-4 block">Email Address</label>
                            <input type="email" className="w-full bg-[#080C14] border border-white/5 rounded-2xl px-8 py-5 text-white focus:border-brightBlue outline-none font-medium transition-all" placeholder="name@company.com" />
                        </div>
                        <div>
                            <label className="text-[10px] font-black text-steelGrey uppercase tracking-[0.4em] mb-4 block">Inquiry Type</label>
                            <select className="w-full bg-[#080C14] border border-white/5 rounded-2xl px-8 py-5 text-white focus:border-brightBlue outline-none font-medium transition-all">
                                <option>General Inquiry</option>
                                <option>Enterprise Demo</option>
                                <option>Technical Support</option>
                                <option>Partnership</option>
                            </select>
                        </div>
                        <button className="w-full bg-brightBlue hover:bg-blue-600 text-white py-6 rounded-2xl font-black text-xs uppercase tracking-[0.4em] shadow-xl transition-all active:scale-95">Send Message</button>
                    </form>
                </div>
            </div>
        </PublicPageLayout>
    );
};

// --- SECURITY PAGE ---
export const SecurityPage: React.FC<NavProps> = ({ navigate }) => {
    return (
        <PublicPageLayout 
            title="Security." 
            subtitle="Foundationally built on secure industry standards to protect your most sensitive compliance artifacts."
            navigate={navigate}
        >
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                {[
                    { title: "Secure Cloud Infra", desc: "Built on Supabase (PostgreSQL) with dedicated database isolation and SOC2-compliant data centers.", icon: Database, color: "text-emerald-400" },
                    { title: "End-to-End Encryption", desc: "All data is encrypted both at rest (AES-256) and in transit (TLS 1.3) following banking protocols.", icon: Lock, color: "text-brightBlue" },
                    { title: "RBAC Controls", desc: "Granular Role-Based Access Control ensures only authorized team members see sensitive data.", icon: ShieldCheck, color: "text-purple-400" },
                    { title: "Isolated AI Contexts", desc: "Neural processing occurs in strictly isolated sessions to prevent any cross-tenant data leakage.", icon: Cpu, color: "text-yellow-400" },
                    { title: "Regular Reviews", desc: "Infrastructure and code are subject to recurring security audits and vulnerability scans.", icon: History, color: "text-riskHigh" },
                    { title: "SLA Guaranteed", desc: "High availability architecture with 99.9% uptime guaranteed for critical audit windows.", icon: Globe, color: "text-blue-400" }
                ].map((s, i) => (
                    <div key={i} className="bg-obsidianNavy border border-white/5 rounded-[48px] p-12 hover:border-emerald-400 transition-all group shadow-2xl">
                        <div className={`w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center ${s.color} mb-10 group-hover:scale-110 transition-transform`}><s.icon size={32} /></div>
                        <h3 className="text-xl font-black text-white mb-6 uppercase tracking-tight">{s.title}</h3>
                        <p className="text-steelGrey text-sm leading-relaxed font-bold opacity-70 group-hover:opacity-100">{s.desc}</p>
                    </div>
                ))}
            </div>
        </PublicPageLayout>
    );
};

// --- LEGAL PAGES (Generic) ---
export const LegalPage: React.FC<{ navigate: (route: AppRoute) => void; type: string }> = ({ navigate, type }) => {
    return (
        <PublicPageLayout 
            title={type} 
            subtitle={`Official documentation for the Complimaxx platform. Last updated: ${new Date().toLocaleDateString()}`}
            navigate={navigate}
        >
            <div className="max-w-4xl mx-auto bg-obsidianNavy border border-white/5 rounded-[60px] p-20 text-left space-y-12 shadow-2xl">
                 <div className="flex items-center gap-4 text-brightBlue mb-12">
                     <Info size={32} />
                     <h2 className="text-2xl font-black uppercase tracking-tighter">Standard {type} Provisions.</h2>
                 </div>
                 <div className="space-y-8 text-steelGrey leading-relaxed font-medium">
                    <p>Complimaxx respects your trust and processes all personal data in accordance with applicable laws, including GDPR and CCPA. We collect only what is necessary to provide and improve our core neural automation services.</p>
                    <h3 className="text-white font-black uppercase text-sm tracking-widest mt-12">1. Scope of Use</h3>
                    <p>By using Complimaxx, you agree to our terms. We provide an AI-powered operating system for audit readiness. Users are responsible for the accuracy of organizational context provided to the engine.</p>
                    <h3 className="text-white font-black uppercase text-sm tracking-widest mt-12">2. Data Processor Agreement</h3>
                    <p>Complimaxx acts as a data processor for customer data. Our standard DPA outlines security measures, subprocessors, and data handling responsibilities in compliance with GDPR regulations.</p>
                    <h3 className="text-white font-black uppercase text-sm tracking-widest mt-12">3. Limitations</h3>
                    <p>While Complimaxx generates audit-ready artifacts, it is a tool for efficiency and documentation. Professional certification requires formal review by accredited independent auditors.</p>
                    <div className="pt-12 border-t border-white/5 flex justify-between items-center text-[10px] font-black uppercase tracking-[0.4em]">
                        <span>Complimaxx Legal Dept.</span>
                        <button className="text-brightBlue hover:underline">Request Full Contract PDF</button>
                    </div>
                 </div>
            </div>
        </PublicPageLayout>
    );
};

// --- HELP CENTER ---
export const HelpCenterPage: React.FC<NavProps> = ({ navigate }) => {
    return (
        <PublicPageLayout 
            title="Help Center." 
            subtitle="Step-by-step guides, best practices, and masterclasses in neural compliance."
            navigate={navigate}
        >
            <div className="max-w-3xl mx-auto mb-24">
                <div className="relative group">
                    <Search className="absolute left-8 top-1/2 -translate-y-1/2 text-steelGrey group-focus-within:text-brightBlue transition-colors" size={24} />
                    <input type="text" placeholder="Search knowledge base..." className="w-full bg-obsidianNavy border border-white/5 rounded-[32px] py-8 pl-20 pr-10 text-white text-lg font-medium focus:border-brightBlue outline-none shadow-2xl transition-all" />
                </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {[
                    { topic: "Getting Started", count: 12, icon: Play },
                    { topic: "Framework Guides", count: 48, icon: BookOpen },
                    { topic: "Account & Billing", count: 8, icon: CreditCard },
                    { topic: "API & Dev Docs", count: 15, icon: Workflow },
                    { topic: "Troubleshooting", count: 24, icon: ShieldAlert },
                    { topic: "Governance Tips", count: 32, icon: Target }
                ].map((item, i) => (
                    <div key={i} className="bg-obsidianNavy border border-white/5 p-12 rounded-[48px] hover:border-brightBlue cursor-pointer transition-all group shadow-2xl flex flex-col items-center">
                        <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center text-brightBlue mb-10 group-hover:scale-110 transition-transform"><item.icon size={32} /></div>
                        <h4 className="font-black text-white mb-4 uppercase tracking-tight">{item.topic}</h4>
                        <p className="text-sm text-steelGrey font-bold uppercase tracking-widest">{item.count} Articles &rarr;</p>
                    </div>
                ))}
            </div>
        </PublicPageLayout>
    );
};

// --- TUTORIALS PAGE ---
export const TutorialsPage: React.FC<NavProps> = ({ navigate }) => {
    return (
        <PublicPageLayout 
            title="Tutorials." 
            subtitle="Master the Complimaxx terminal in minutes with our visual learning library."
            navigate={navigate}
        >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                {[
                    { title: "Set up your first compliance project", time: "5 min" },
                    { title: "Generate and renew processes", time: "8 min" },
                    { title: "Prepare for audits (Masterclass)", time: "15 min" },
                    { title: "Manage frameworks and teams", time: "6 min" }
                ].map((item, i) => (
                    <div key={i} className="bg-obsidianNavy border border-white/5 rounded-[60px] overflow-hidden group hover:border-brightBlue transition-all cursor-pointer shadow-2xl">
                        <div className="h-72 bg-black/50 flex items-center justify-center relative">
                            <div className="absolute inset-0 bg-tech-grid opacity-10"></div>
                            <Play size={64} className="text-white opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all filter drop-shadow-2xl" />
                        </div>
                        <div className="p-12">
                            <h3 className="font-black text-white text-2xl mb-4 uppercase tracking-tighter">{item.title}</h3>
                            <p className="text-sm text-steelGrey font-bold uppercase tracking-widest flex items-center"><Clock size={14} className="mr-2" /> {item.time} watch time</p>
                        </div>
                    </div>
                ))}
            </div>
        </PublicPageLayout>
    );
};

// --- FAQ PAGE ---
export const FAQPage: React.FC<NavProps> = ({ navigate }) => {
    const [openIdx, setOpenIdx] = useState<number | null>(null);
    const faqs = [
        { q: "Is every feature included in all plans?", a: "Yes. All plans include full access to the entire platform including Checklists, Gap Tracking, and Renewal Mode. We only scale by complexity and frameworks." },
        { q: "What happens if I run out of AI credits?", a: "You can continue editing and viewing your data. AI generation and renewals resume after your monthly credit reset or a manual plan upgrade." },
        { q: "Can I downgrade my plan?", a: "Yes. Existing data remains accessible, but AI credit limits and framework caps apply immediately after the downgrade." },
        { q: "Is Complimaxx suitable for enterprise audits?", a: "Absolutely. Complimaxx is designed for formal ISO 27001, SOC 2, NIST, and NIS2 audit environments, reducing manual prep time by up to 80%." }
    ];

    return (
        <PublicPageLayout 
            title="FAQ." 
            subtitle="Common questions about the Complimaxx platform, pricing, and AI engine."
            navigate={navigate}
        >
            <div className="max-w-4xl mx-auto space-y-4">
                {faqs.map((item, i) => (
                    <div key={i} className="bg-obsidianNavy border border-white/5 rounded-[32px] overflow-hidden transition-all shadow-xl">
                        <button 
                            onClick={() => setOpenIdx(openIdx === i ? null : i)}
                            className="w-full px-12 py-10 flex justify-between items-center text-left hover:bg-white/5 transition-colors"
                        >
                            <span className="text-lg font-black text-white uppercase tracking-tight">{item.q}</span>
                            <div className={`transition-transform duration-300 ${openIdx === i ? 'rotate-180' : ''}`}>
                                <ChevronDown size={24} className="text-brightBlue" />
                            </div>
                        </button>
                        {openIdx === i && (
                            <div className="px-12 pb-10 animate-fadeIn">
                                <p className="text-steelGrey text-lg leading-relaxed font-medium border-t border-white/5 pt-8">{item.a}</p>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </PublicPageLayout>
    );
};
