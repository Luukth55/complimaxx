
import React, { useState, useEffect } from 'react';
import { User, Building, CreditCard, Save, Loader2, CheckCircle, AlertCircle, Cloud, CloudOff, Database, ShieldCheck, Globe, Key, AlertTriangle, Check } from 'lucide-react';
import { supabase, isSupabaseConfigured, connectionStatus } from '../services/supabaseClient';

const Settings: React.FC = () => {
  const [activeTab, setActiveTab] = useState('profile');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [profile, setProfile] = useState({
    full_name: '',
    company_name: '',
    industry: 'SaaS / Tech',
    role: 'Admin',
    email: ''
  });

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    if (!isSupabaseConfigured) {
        setLoading(false);
        return;
    }
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
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
            role: data.role || 'Admin',
            email: user.email || ''
          });
        } else {
            setProfile(prev => ({ ...prev, email: user.email || '' }));
        }
      }
    } catch (err) {
      console.error("Error loading profile:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!isSupabaseConfigured) {
        setError("Supabase is not configured. Changes cannot be saved to the cloud.");
        return;
    }
    setSaving(true);
    setError(null);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { error } = await supabase.from('profiles').upsert({
        id: user.id,
        full_name: profile.full_name,
        company_name: profile.company_name,
        industry: profile.industry,
        updated_at: new Date().toISOString()
      });

      if (error) throw error;
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="p-12 text-center text-steelGrey"><Loader2 className="animate-spin inline mr-2"/> Loading profile...</div>;

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
          <h2 className="text-2xl font-bold text-white">Account Settings</h2>
          <p className="text-steelGrey text-sm">Manage your profile and organization details.</p>
        </div>
        <div className={`px-3 py-1 rounded-full text-[10px] font-bold border flex items-center ${isSupabaseConfigured ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' : 'bg-riskHigh/10 text-riskHigh border-riskHigh/20'}`}>
           {isSupabaseConfigured ? <Cloud size={12} className="mr-1.5"/> : <CloudOff size={12} className="mr-1.5"/>}
           {isSupabaseConfigured ? 'CONNECTED TO CLOUD' : 'LOCAL STORAGE ONLY'}
        </div>
      </div>
      
      {error && (
        <div className="bg-riskHigh/10 border border-riskHigh/30 p-4 rounded-lg text-riskHigh text-sm flex items-center">
          <AlertCircle size={16} className="mr-2"/> {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        <nav className="space-y-2">
            <button onClick={() => setActiveTab('profile')} className={`w-full flex items-center p-3 rounded-lg ${activeTab === 'profile' ? 'bg-brightBlue/10 text-brightBlue' : 'text-steelGrey hover:bg-white/5'}`}>
                <User size={18} className="mr-3" /> Profile
            </button>
            <button onClick={() => setActiveTab('company')} className={`w-full flex items-center p-3 rounded-lg ${activeTab === 'company' ? 'bg-brightBlue/10 text-brightBlue' : 'text-steelGrey hover:bg-white/5'}`}>
                <Building size={18} className="mr-3" /> Company
            </button>
            <button onClick={() => setActiveTab('status')} className={`w-full flex items-center p-3 rounded-lg ${activeTab === 'status' ? 'bg-brightBlue/10 text-brightBlue' : 'text-steelGrey hover:bg-white/5'}`}>
                <Database size={18} className="mr-3" /> System Status
            </button>
        </nav>

        <div className="col-span-3 bg-obsidianNavy border border-deepDivider rounded-xl p-8 shadow-2xl">
            {activeTab === 'profile' && (
              <div className="space-y-6">
                 <div>
                    <label className="block text-sm font-medium text-steelGrey mb-2">Full Name</label>
                    <input type="text" value={profile.full_name} onChange={(e) => setProfile({...profile, full_name: e.target.value})} className="w-full bg-[#080C14] border border-deepDivider rounded-lg px-4 py-3 text-white focus:border-brightBlue outline-none" />
                 </div>
                 <div>
                    <label className="block text-sm font-medium text-steelGrey mb-2">Email</label>
                    <input type="text" value={profile.email} disabled className="w-full bg-[#080C14] border border-deepDivider rounded-lg px-4 py-3 text-steelGrey opacity-50" />
                 </div>
              </div>
            )}

            {activeTab === 'company' && (
              <div className="space-y-6">
                 <div>
                    <label className="block text-sm font-medium text-steelGrey mb-2">Company Name</label>
                    <input type="text" value={profile.company_name} onChange={(e) => setProfile({...profile, company_name: e.target.value})} className="w-full bg-[#080C14] border border-deepDivider rounded-lg px-4 py-3 text-white focus:border-brightBlue outline-none" />
                 </div>
                 <div>
                    <label className="block text-sm font-medium text-steelGrey mb-2">Industry</label>
                    <select value={profile.industry} onChange={(e) => setProfile({...profile, industry: e.target.value})} className="w-full bg-[#080C14] border border-deepDivider rounded-lg px-4 py-3 text-white outline-none">
                        <option>SaaS / Tech</option><option>Finance</option><option>Healthcare</option><option>Other</option>
                    </select>
                 </div>
              </div>
            )}

            {activeTab === 'status' && (
                <div className="space-y-6">
                    <h4 className="text-white font-bold flex items-center"><Database size={18} className="mr-2 text-brightBlue"/> Connectivity Diagnostics</h4>
                    
                    <div className="space-y-3">
                        <StatusRow 
                            label="Supabase URL" 
                            status={connectionStatus.urlPresent} 
                            detail={connectionStatus.urlPresent ? "Variable SUPABASE_URL is set." : "Environment variable SUPABASE_URL is missing."}
                        />
                        <StatusRow 
                            label="Supabase Anonymous Key" 
                            status={connectionStatus.keyPresent} 
                            detail={connectionStatus.keyPresent ? "Variable SUPABASE_ANON_KEY is set." : "Environment variable SUPABASE_ANON_KEY is missing."}
                        />
                        <StatusRow 
                            label="AI Engine (Gemini 3)" 
                            status={!!process.env.API_KEY} 
                            detail={process.env.API_KEY ? "Google GenAI API Key is configured." : "API_KEY variable is missing."}
                        />
                    </div>

                    <div className="mt-8 p-6 bg-black/40 rounded-xl border border-deepDivider">
                        <h5 className="text-white font-bold text-sm mb-4 flex items-center"><ShieldCheck size={16} className="mr-2 text-brightBlue"/> Operational Mode</h5>
                        <p className="text-sm text-steelGrey leading-relaxed">
                            {isSupabaseConfigured 
                                ? "Complimaxx is currently running in Cloud-Sync mode. All your projects, checklists, and gaps are securely stored in the Supabase database and are accessible everywhere."
                                : "Complimaxx is currently running in Offline/Demo mode. Data is only stored temporarily in your browser's memory. To store data permanently, you must link Supabase via environment variables."
                            }
                        </p>
                    </div>
                </div>
            )}
            
            {activeTab !== 'status' && (
                <div className="mt-8 pt-6 border-t border-deepDivider flex justify-end">
                    <button onClick={handleSave} disabled={saving} className={`px-8 py-2.5 rounded-xl font-bold flex items-center shadow-lg transition-all ${saveSuccess ? 'bg-emerald-500' : 'bg-brightBlue hover:bg-blue-600'} text-white`}>
                        {saving ? <Loader2 size={18} className="mr-2 animate-spin" /> : saveSuccess ? <CheckCircle size={18} className="mr-2" /> : <Save size={18} className="mr-2" />}
                        {saving ? 'Saving...' : saveSuccess ? 'Saved!' : 'Save Changes'}
                    </button>
                </div>
            )}
        </div>
      </div>
    </div>
  );
};

export default Settings;
