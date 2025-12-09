
import React, { useState } from 'react';
import { User, Building, CreditCard, Bell, Save } from 'lucide-react';

const Settings: React.FC = () => {
  const [activeTab, setActiveTab] = useState('profile');

  const renderContent = () => {
    switch(activeTab) {
      case 'profile':
        return (
          <div className="space-y-6 animate-fadeIn">
             <div>
                <label className="block text-sm font-medium text-steelGrey mb-2">Full Name</label>
                <input type="text" defaultValue="John Doe" className="w-full bg-[#080C14] border border-deepDivider rounded-lg px-4 py-3 text-white focus:outline-none focus:border-brightBlue" />
             </div>
             <div>
                <label className="block text-sm font-medium text-steelGrey mb-2">Email Address</label>
                <input type="email" defaultValue="john@example.com" className="w-full bg-[#080C14] border border-deepDivider rounded-lg px-4 py-3 text-white focus:outline-none focus:border-brightBlue" />
             </div>
             <div>
                <label className="block text-sm font-medium text-steelGrey mb-2">Role</label>
                <input type="text" defaultValue="Lead Auditor" disabled className="w-full bg-[#080C14] border border-deepDivider rounded-lg px-4 py-3 text-steelGrey opacity-50 cursor-not-allowed" />
             </div>
          </div>
        );
      case 'company':
        return (
          <div className="space-y-6 animate-fadeIn">
             <div>
                <label className="block text-sm font-medium text-steelGrey mb-2">Company Name</label>
                <input type="text" defaultValue="Acme Corp" className="w-full bg-[#080C14] border border-deepDivider rounded-lg px-4 py-3 text-white focus:outline-none focus:border-brightBlue" />
             </div>
             <div>
                <label className="block text-sm font-medium text-steelGrey mb-2">Industry</label>
                <select className="w-full bg-[#080C14] border border-deepDivider rounded-lg px-4 py-3 text-white focus:outline-none focus:border-brightBlue">
                    <option>SaaS / Tech</option>
                    <option>Finance</option>
                    <option>Healthcare</option>
                </select>
             </div>
             <div>
                <label className="block text-sm font-medium text-steelGrey mb-2">Compliance Contact</label>
                <input type="text" defaultValue="legal@acme.com" className="w-full bg-[#080C14] border border-deepDivider rounded-lg px-4 py-3 text-white focus:outline-none focus:border-brightBlue" />
             </div>
          </div>
        );
      case 'billing':
        return (
          <div className="space-y-6 animate-fadeIn">
             <div className="bg-brightBlue/10 border border-brightBlue rounded-lg p-6 flex justify-between items-center">
                <div>
                    <h3 className="text-white font-bold text-lg">Pro Plan</h3>
                    <p className="text-brightBlue text-sm">€299 / month</p>
                </div>
                <button className="bg-brightBlue text-white px-4 py-2 rounded-lg text-sm font-bold">Manage</button>
             </div>
             <div>
                <h4 className="text-white font-medium mb-4">Payment Methods</h4>
                <div className="flex items-center justify-between p-4 bg-[#080C14] rounded-lg border border-deepDivider">
                    <div className="flex items-center">
                        <CreditCard className="text-steelGrey mr-3" />
                        <span className="text-white">Visa ending in 4242</span>
                    </div>
                    <button className="text-sm text-steelGrey hover:text-white">Edit</button>
                </div>
             </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <h2 className="text-2xl font-bold text-white">Account Settings</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        <div className="col-span-1">
            <nav className="space-y-2">
                <button onClick={() => setActiveTab('profile')} className={`w-full flex items-center p-3 rounded-lg transition-colors ${activeTab === 'profile' ? 'bg-obsidianNavy text-white border-l-2 border-brightBlue' : 'text-steelGrey hover:bg-white/5'}`}>
                    <User size={18} className="mr-3" /> Profile
                </button>
                <button onClick={() => setActiveTab('company')} className={`w-full flex items-center p-3 rounded-lg transition-colors ${activeTab === 'company' ? 'bg-obsidianNavy text-white border-l-2 border-brightBlue' : 'text-steelGrey hover:bg-white/5'}`}>
                    <Building size={18} className="mr-3" /> Company
                </button>
                 <button onClick={() => setActiveTab('billing')} className={`w-full flex items-center p-3 rounded-lg transition-colors ${activeTab === 'billing' ? 'bg-obsidianNavy text-white border-l-2 border-brightBlue' : 'text-steelGrey hover:bg-white/5'}`}>
                    <CreditCard size={18} className="mr-3" /> Billing
                </button>
                 <button className="w-full flex items-center p-3 rounded-lg text-steelGrey hover:bg-white/5">
                    <Bell size={18} className="mr-3" /> Notifications
                </button>
            </nav>
        </div>

        <div className="col-span-1 md:col-span-3">
            <div className="bg-obsidianNavy border border-deepDivider rounded-xl p-8">
                {renderContent()}
                
                <div className="mt-8 pt-6 border-t border-deepDivider flex justify-end">
                    <button className="bg-brightBlue hover:bg-blue-600 text-white px-6 py-2 rounded-lg font-medium flex items-center shadow-lg shadow-blue-500/20">
                        <Save size={18} className="mr-2" /> Save Changes
                    </button>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;