
import React, { useState, useEffect } from 'react';
import { User, Building, CreditCard, Bell, Save, Loader2, CheckCircle } from 'lucide-react';
import { supabase } from '../services/supabaseClient';

const Settings: React.FC = () => {
  const [activeTab, setActiveTab] = useState('profile');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  
  // Profile State
  const [userEmail, setUserEmail] = useState('');
  const [profile, setProfile] = useState({
    full_name: '',
    company_name: '',
    industry: 'SaaS / Tech',
    role: 'Admin'
  });

  useEffect(() => {
      loadProfile();
  }, []);

  const loadProfile = async () => {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
          setUserEmail(user.email || '');
          
          const { data, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', user.id)
            .single();
            
          if (data) {
              setProfile({
                  full_name: data.full_name || '',
                  company_name: data.company_name || '',
                  industry: data.industry || 'SaaS / Tech',
                  role: data.role || 'Admin'
              });
          }
      }
      setLoading(false);
  };

  const handleSave = async () => {
      setSaving(true);
      setSaveSuccess(false);
      
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { error } = await supabase
        .from('profiles')
        .upsert({
            id: user.id,
            full_name: profile.full_name,
            company_name: profile.company_name,
            industry: profile.industry,
            updated_at: new Date().toISOString()
        });

      setSaving(false);
      if (!error) {
          setSaveSuccess(true);
          setTimeout(() => setSaveSuccess(false), 3000);
      } else {
          console.error("Error saving profile:", error);
          alert("Failed to save profile.");
      }
  };

  const renderContent = () => {
    switch(activeTab) {
      case 'profile':
        return (
          <div className="space-y-6 animate-fadeIn">
             <div>
                <label className="block text-sm font-medium text-steelGrey mb-2">Full Name</label>
                <input 
                    type="text" 
                    value={profile.full_name}
                    onChange={(e) => setProfile({...profile, full_name: e.target.value})}
                    placeholder="Enter your name" 
                    className="w-full bg-[#080C14] border border-deepDivider rounded-lg px-4 py-3 text-white focus:outline-none focus:border-brightBlue" 
                />
             </div>
             <div>
                <label className="block text-sm font-medium text-steelGrey mb-2">Email Address</label>
                <input type="email" value={userEmail} disabled className="w-full bg-[#080C14] border border-deepDivider rounded-lg px-4 py-3 text-white focus:outline-none focus:border-brightBlue opacity-70 cursor-not-allowed" />
             </div>
             <div>
                <label className="block text-sm font-medium text-steelGrey mb-2">Role</label>
                <input type="text" value={profile.role} disabled className="w-full bg-[#080C14] border border-deepDivider rounded-lg px-4 py-3 text-steelGrey opacity-50 cursor-not-allowed" />
             </div>
          </div>
        );
      case 'company':
        return (
          <div className="space-y-6 animate-fadeIn">
             <div>
                <label className="block text-sm font-medium text-steelGrey mb-2">Company Name</label>
                <input 
                    type="text" 
                    value={profile.company_name}
                    onChange={(e) => setProfile({...profile, company_name: e.target.value})}
                    placeholder="Acme Corp" 
                    className="w-full bg-[#080C14] border border-deepDivider rounded-lg px-4 py-3 text-white focus:outline-none focus:border-brightBlue" 
                />
             </div>
             <div>
                <label className="block text-sm font-medium text-steelGrey mb-2">Industry</label>
                <select 
                    value={profile.industry}
                    onChange={(e) => setProfile({...profile, industry: e.target.value})}
                    className="w-full bg-[#080C14] border border-deepDivider rounded-lg px-4 py-3 text-white focus:outline-none focus:border-brightBlue"
                >
                    <option>SaaS / Tech</option>
                    <option>Finance</option>
                    <option>Healthcare</option>
                    <option>Manufacturing</option>
                    <option>Other</option>
                </select>
             </div>
             <div>
                <label className="block text-sm font-medium text-steelGrey mb-2">Compliance Contact</label>
                <input type="text" value={userEmail} disabled className="w-full bg-[#080C14] border border-deepDivider rounded-lg px-4 py-3 text-white focus:outline-none focus:border-brightBlue opacity-70" />
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

  if (loading) {
      return <div className="text-white p-8">Loading profile...</div>;
  }

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
                    <button 
                        onClick={handleSave}
                        disabled={saving}
                        className={`px-6 py-2 rounded-lg font-medium flex items-center shadow-lg transition-all ${
                            saveSuccess 
                            ? 'bg-emerald-500 text-white shadow-emerald-500/20' 
                            : 'bg-brightBlue hover:bg-blue-600 text-white shadow-blue-500/20'
                        }`}
                    >
                        {saving ? (
                            <Loader2 size={18} className="mr-2 animate-spin" />
                        ) : saveSuccess ? (
                            <CheckCircle size={18} className="mr-2" />
                        ) : (
                            <Save size={18} className="mr-2" />
                        )}
                        {saving ? 'Saving...' : saveSuccess ? 'Saved!' : 'Save Changes'}
                    </button>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
