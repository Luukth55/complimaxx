
import React, { useState } from 'react';
import { User, Building, CreditCard, Save, Loader2, CheckCircle, AlertCircle, Cloud, CloudOff, Database, ShieldCheck, Globe, Key, AlertTriangle, Check, Zap, Star, Shield } from 'lucide-react';
import { supabase, isSupabaseConfigured, connectionStatus } from '../services/supabaseClient';
import { UserProfile, UserPlan } from '../types';
import { storageService } from '../services/storageService';

interface SettingsProps {
  profile: UserProfile | null;
  onRefresh: () => void;
}

const Settings: React.FC<SettingsProps> = ({ profile, onRefresh }) => {
  const [activeTab, setActiveTab] = useState('profile');
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [localProfile, setLocalProfile] = useState({
    full_name: (profile?.first_name || '') + ' ' + (profile?.last_name || ''),
    company_name: profile?.company_name || '',
    industry: profile?.industry || 'SaaS / Tech',
    role: profile?.role || 'Admin'
  });

  const getApiKeyStatus = () => {
    try {
      return typeof process !== 'undefined' && !!process.env.API_KEY;
    } catch {
      return false;
    }
  };

  const handleSave = async () => {
    if (!isSupabaseConfigured || !profile) return;
    setSaving(true);
    setError(null);
    try {
      const names = localProfile.full_name.trim().split(' ');
      const firstName = names[0] || '';
      const lastName = names.slice(1).join(' ') || '';

      const { error } = await supabase.from('profiles').update({
        first_name: firstName,
        last_name: lastName,
        company_name: localProfile.company_name,
        industry: localProfile.industry,
        updated_at: new Date().toISOString()
      }).eq('id', profile.id);

      if (error) throw error;
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
      onRefresh();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleUpgrade = async (plan: UserPlan) => {
    if (!profile) return;
    setSaving(true);
    const success = await storageService.upgradePlan(profile.id, plan);
    if (success) {
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
      onRefresh();
    } else {
      setError("Upgrade failed.");
    }
    setSaving(false);
  };

  const StatusRow = ({ label, status, detail }: { label: string, status: boolean, detail: string }) => (
    <div className="flex items-center justify-between p-4 bg-black/20 rounded-lg border border-deepDivider/50">
        <div className="flex items-center">
            <div className={`p-2 rounded-lg mr-3 ${status ? 'bg-emerald-500/10 text-emerald-500' : 'bg-riskHigh/10 text-riskHigh'}`}>
                {status ? <Check size={16} /> : <AlertTriangle size={16} />}
            </div>
            <div>
                <p className="text-sm font-bold text-white">{label}</p>
                <p className="text-xs text-steelGrey">{detail}</p>
            </div>
        </div>
        <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${status ? 'border-emerald-500/30 text-emerald-500 bg-emerald-500/5' : 'border-riskHigh/30 text-riskHigh bg-riskHigh/5'}`}>
            {status ? 'CONNECTED' : 'DISCONNECTED'}
        </span>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fadeIn">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-2xl font-black text-white uppercase tracking-tighter">Settings</h2>
          <p className="text-steelGrey text-sm">Manage your profile and SaaS plan.</p>
        </div>
      </div>
      
      {error && (
        <div className="bg-riskHigh/10 border border-riskHigh/30 p-4 rounded-lg text-riskHigh text-sm flex items-center">
          <AlertCircle size={16} className="mr-2"/> {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        <nav className="space-y-2">
            <button onClick={() => setActiveTab('profile')} className={`w-full flex items-center p-3 rounded-xl font-bold text-sm transition-all ${activeTab === 'profile' ? 'bg-brightBlue/10 text-brightBlue' : 'text-steelGrey hover:bg-white/5'}`}>
                <User size={18} className="mr-3" /> Profile
            </button>
            <button onClick={() => setActiveTab('billing')} className={`w-full flex items-center p-3 rounded-xl font-bold text-sm transition-all ${activeTab === 'billing' ? 'bg-brightBlue/10 text-brightBlue' : 'text-steelGrey hover:bg-white/5'}`}>
                <CreditCard size={18} className="mr-3" /> Plan & Billing
            </button>
            <button onClick={() => setActiveTab('status')} className={`w-full flex items-center p-3 rounded-xl font-bold text-sm transition-all ${activeTab === 'status' ? 'bg-brightBlue/10 text-brightBlue' : 'text-steelGrey hover:bg-white/5'}`}>
                <Database size={18} className="mr-3" /> Diagnostics
            </button>
        </nav>

        <div className="col-span-3 bg-obsidianNavy border border-deepDivider rounded-3xl p-8 shadow-2xl">
            {activeTab === 'profile' && (
              <div className="space-y-6">
                 <div>
                    <label className="block text-[10px] font-black text-steelGrey uppercase tracking-widest mb-2">Full Name</label>
                    <input type="text" value={localProfile.full_name} onChange={(e) => setLocalProfile({...localProfile, full_name: e.target.value})} className="w-full bg-[#080C14] border border-deepDivider rounded-xl px-4 py-4 text-white focus:border-brightBlue outline-none" />
                 </div>
                 <div>
                    <label className="block text-[10px] font-black text-steelGrey uppercase tracking-widest mb-2">Company Name</label>
                    <input type="text" value={localProfile.company_name} onChange={(e) => setLocalProfile({...localProfile, company_name: e.target.value})} className="w-full bg-[#080C14] border border-deepDivider rounded-xl px-4 py-4 text-white focus:border-brightBlue outline-none" />
                 </div>
                 <div className="pt-6 border-t border-deepDivider flex justify-end">
                    <button onClick={handleSave} disabled={saving} className={`px-8 py-3 rounded-xl font-black text-xs uppercase tracking-widest flex items-center transition-all ${saveSuccess ? 'bg-emerald-500' : 'bg-brightBlue hover:bg-blue-600'} text-white`}>
                        {saving ? <Loader2 size={18} className="mr-2 animate-spin" /> : saveSuccess ? <Check size={18} className="mr-2" /> : <Save size={18} className="mr-2" />}
                        {saving ? 'Saving...' : 'Save Changes'}
                    </button>
                 </div>
              </div>
            )}

            {activeTab === 'billing' && (
              <div className="space-y-8">
                 <div className="bg-brightBlue/10 border border-brightBlue/20 rounded-2xl p-6 flex justify-between items-center">
                    <div>
                        <span className="text-[10px] font-black text-brightBlue uppercase tracking-widest block mb-1">Current Plan</span>
                        <h3 className="text-2xl font-black text-white uppercase">{profile?.plan}</h3>
                    </div>
                    <div className="text-right">
                        <span className="text-[10px] font-black text-steelGrey uppercase tracking-widest block mb-1">Credits Remaining</span>
                        <div className="text-2xl font-black text-white">{profile?.plan === 'Enterprise' ? '∞' : profile?.credits_remaining}</div>
                    </div>
                 </div>

                 <div className="grid grid-cols-1 gap-4">
                    {[
                      { name: 'Essentials' as UserPlan, price: '99', features: ['2 Frameworks', '1 User', '15 Credits'], icon: Zap },
                      { name: 'Pro' as UserPlan, price: '299', features: ['10 Frameworks', '3 Users', '60 Credits'], icon: Star },
                      { name: 'Enterprise' as UserPlan, price: '699', features: ['All 96 Frameworks', '10 Users', 'Unlimited Credits'], icon: Shield }
                    ].map(p => (
                      <div key={p.name} className={`p-6 rounded-2xl border flex items-center justify-between transition-all ${profile?.plan === p.name ? 'border-brightBlue bg-brightBlue/5' : 'border-deepDivider bg-techBlack hover:border-white/20'}`}>
                         <div className="flex items-center gap-4">
                            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${profile?.plan === p.name ? 'bg-brightBlue text-white' : 'bg-deepDivider text-steelGrey'}`}>
                                <p.icon size={20} />
                            </div>
                            <div>
                                <h4 className="font-bold text-white uppercase tracking-tight">{p.name}</h4>
                                <p className="text-[10px] text-steelGrey uppercase font-bold tracking-widest">{p.features.join(' • ')}</p>
                            </div>
                         </div>
                         <button 
                            disabled={profile?.plan === p.name || saving} 
                            onClick={() => handleUpgrade(p.name)}
                            className={`px-6 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${profile?.plan === p.name ? 'bg-brightBlue/20 text-brightBlue cursor-default' : 'bg-white/5 hover:bg-brightBlue text-white border border-white/10'}`}
                        >
                            {profile?.plan === p.name ? 'Active' : 'Switch'}
                         </button>
                      </div>
                    ))}
                 </div>
              </div>
            )}

            {activeTab === 'status' && (
                <div className="space-y-6">
                    <h4 className="text-white font-bold flex items-center uppercase tracking-widest text-xs"><Database size={18} className="mr-2 text-brightBlue"/> Infrastructure Diagnostics</h4>
                    <div className="space-y-3">
                        <StatusRow label="Cloud DB" status={isSupabaseConfigured} detail="Supabase PostgreSQL connectivity." />
                        <StatusRow label="Gemini AI" status={getApiKeyStatus()} detail="Google GenAI API Key verification." />
                    </div>
                </div>
            )}
        </div>
      </div>
    </div>
  );
};

export default Settings;
