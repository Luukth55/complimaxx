
import React from 'react';
import { Plus, Shield, CheckCircle, AlertTriangle, FileText } from 'lucide-react';
import { AppRoute } from '../types';

interface DashboardProps {
  navigate: (route: AppRoute) => void;
}

const StatCard = ({ label, value, icon: Icon, color, trend }: any) => (
  <div className="bg-obsidianNavy border border-deepDivider rounded-xl p-6 shadow-lg">
    <div className="flex justify-between items-start">
      <div>
        <p className="text-steelGrey text-sm font-medium mb-1">{label}</p>
        <h3 className="text-3xl font-semibold text-white">{value}</h3>
      </div>
      <div className={`p-3 rounded-lg bg-opacity-10 ${color}`}>
        <Icon size={24} className={color.replace('bg-', 'text-')} />
      </div>
    </div>
    <div className="mt-4 flex items-center text-xs text-steelGrey">
      <span className="text-green-400 font-medium mr-1">{trend}</span> since last month
    </div>
  </div>
);

const ProjectCard = ({ title, status, frameworks, date }: any) => (
  <div className="bg-obsidianNavy border border-deepDivider rounded-xl p-5 hover:border-brightBlue transition-colors cursor-pointer group">
    <div className="flex justify-between items-start mb-3">
      <div className="p-2 rounded bg-brightBlue/10 text-brightBlue group-hover:bg-brightBlue group-hover:text-white transition-colors">
        <FileText size={20} />
      </div>
      <span className={`px-2 py-1 rounded text-xs font-medium ${
        status === 'Completed' ? 'bg-riskLow/20 text-riskLow' : 'bg-yellow-500/20 text-yellow-500'
      }`}>
        {status}
      </span>
    </div>
    <h4 className="text-white font-medium mb-1">{title}</h4>
    <p className="text-steelGrey text-sm mb-4">Frameworks: {frameworks.join(', ')}</p>
    <div className="flex items-center justify-between text-xs text-slate-500 border-t border-deepDivider pt-3">
      <span>Updated {date}</span>
      <span>Owner: You</span>
    </div>
  </div>
);

const Dashboard: React.FC<DashboardProps> = ({ navigate }) => {
  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Welcome back, Auditor</h1>
          <p className="text-steelGrey">Here is your compliance overview for this quarter.</p>
        </div>
        <button 
          onClick={() => navigate(AppRoute.PROJECT_WIZARD)}
          className="bg-brightBlue hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-medium shadow-[0_0_15px_rgba(0,140,255,0.3)] transition-all flex items-center"
        >
          <Plus size={20} className="mr-2" />
          Create New Project
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard label="Audit Readiness" value="78%" icon={Shield} color="bg-brightBlue text-brightBlue" trend="+4%" />
        <StatCard label="Open Gaps" value="12" icon={AlertTriangle} color="bg-riskHigh text-riskHigh" trend="-2" />
        <StatCard label="Active Projects" value="3" icon={FileText} color="bg-purple-500 text-purple-500" trend="+1" />
        <StatCard label="Controls Tested" value="145" icon={CheckCircle} color="bg-riskLow text-riskLow" trend="+12" />
      </div>

      {/* Recent Activity / Projects */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-white">Recent Projects</h2>
          <button onClick={() => navigate(AppRoute.OUTPUT_VIEWER)} className="text-brightBlue text-sm hover:underline">View All</button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <ProjectCard 
            title="HR Onboarding Process" 
            status="Completed" 
            frameworks={['ISO 27001', 'SOC 2']} 
            date="2 days ago" 
          />
          <ProjectCard 
            title="Vendor Risk Management" 
            status="In Progress" 
            frameworks={['NIS2']} 
            date="5 hours ago" 
          />
          <ProjectCard 
            title="Cloud Access Control" 
            status="In Progress" 
            frameworks={['ISO 27001']} 
            date="Just now" 
          />
        </div>
      </div>
      
      {/* Plan Usage */}
      <div className="bg-gradient-to-r from-obsidianNavy to-[#0a1120] border border-deepDivider rounded-xl p-6 relative overflow-hidden">
        <div className="relative z-10">
          <h3 className="text-lg font-bold text-white mb-2">Pro Plan Usage</h3>
          <div className="w-full bg-deepDivider rounded-full h-2.5 mb-1 max-w-md">
            <div className="bg-brightBlue h-2.5 rounded-full" style={{ width: '45%' }}></div>
          </div>
          <div className="flex justify-between max-w-md text-xs text-steelGrey mb-4">
             <span>27 / 60 Processes generated</span>
             <span>Reset in 12 days</span>
          </div>
          <button className="text-brightBlue text-sm font-medium hover:text-white transition-colors">Manage Subscription &rarr;</button>
        </div>
        <div className="absolute right-0 top-0 h-full w-1/3 bg-brightBlue/5 skew-x-12 transform origin-bottom-right"></div>
      </div>
    </div>
  );
};

export default Dashboard;