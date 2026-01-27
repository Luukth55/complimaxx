
import React, { useState, useEffect } from 'react';
import { Users, Shield, UserPlus, Trash2, Loader2, Mail, Clock, AlertTriangle, Lock, X, CheckCircle } from 'lucide-react';
import { TeamMember, UserProfile } from '../types';
import { storageService } from '../services/storageService';

interface TeamManagementProps {
  profile: UserProfile | null;
  navigate: (route: any) => void;
}

const TeamManagement: React.FC<TeamManagementProps> = ({ profile, navigate }) => {
  const [users, setUsers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState<'Editor' | 'Viewer'>('Editor');
  const [inviting, setInviting] = useState(false);
  const [inviteSuccess, setInviteSuccess] = useState(false);

  const companyName = profile?.company_name;
  const userLimit = profile?.user_limit || 1;
  const isLimitReached = users.length >= userLimit;

  useEffect(() => {
    loadTeam();
  }, [companyName]);

  const loadTeam = async () => {
    setLoading(true);
    if (companyName) {
      const members = await storageService.getTeamMembers(companyName);
      setUsers(members);
    }
    setLoading(false);
  };

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteEmail || isLimitReached) return;

    setInviting(true);
    try {
      // In a real app, this would send an email. For this demo, we mock the addition
      // but you can extend storageService to actually save an "invite" record.
      const success = await storageService.mockInviteMember(companyName!, inviteEmail, inviteRole);
      if (success) {
        setInviteSuccess(true);
        setTimeout(() => {
          setInviteSuccess(false);
          setIsInviteModalOpen(false);
          setInviteEmail('');
          loadTeam();
        }, 1500);
      }
    } catch (err) {
      console.error("Invite failed:", err);
    } finally {
      setInviting(false);
    }
  };

  const removeUser = async (id: string) => {
    if(confirm("Are you sure you want to remove this member?")) {
        // In this demo, we'll just filter from local state, 
        // in a real app, you'd call a storageService.removeMember
        setUsers(users.filter(u => u.id !== id));
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <Loader2 size={40} className="text-brightBlue animate-spin mb-4" />
        <p className="text-steelGrey font-black uppercase tracking-widest text-xs">Loading Team...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fadeIn">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-black text-white uppercase tracking-tighter">Team Management</h2>
          <p className="text-steelGrey text-sm">Organization: <span className="text-brightBlue font-bold">{companyName || 'Not Set'}</span> • Plan: <span className="text-white font-bold">{profile?.plan}</span></p>
        </div>
        
        <button 
          onClick={() => setIsInviteModalOpen(true)}
          className={`px-6 py-3 rounded-xl font-black text-xs uppercase tracking-widest flex items-center shadow-lg transition-all active:scale-95 ${
            isLimitReached 
              ? 'bg-white/5 border border-white/10 text-steelGrey cursor-not-allowed' 
              : 'bg-brightBlue hover:bg-blue-600 text-white'
          }`}
        >
          {isLimitReached ? <Lock size={18} className="mr-2 text-riskHigh" /> : <UserPlus size={18} className="mr-2" />}
          Invite Member
        </button>
      </div>

      {isLimitReached && (
        <div className="bg-riskHigh/10 border border-riskHigh/20 p-4 rounded-2xl flex items-center gap-4">
          <AlertTriangle className="text-riskHigh" size={20} />
          <p className="text-xs font-bold text-white">
            You've reached the user limit for your <span className="text-riskHigh">{profile?.plan}</span> plan ({users.length}/{userLimit}). 
            <button onClick={() => navigate('settings')} className="ml-2 text-brightBlue underline">Upgrade your plan to add more seats.</button>
          </p>
        </div>
      )}

      <div className="bg-obsidianNavy border border-deepDivider rounded-3xl overflow-hidden shadow-2xl">
        <div className="p-8 border-b border-deepDivider flex justify-between items-center bg-[#080C14]">
            <h3 className="font-black text-white text-sm uppercase tracking-widest flex items-center">
                <Users size={18} className="mr-3 text-brightBlue"/> Active Members ({users.length})
            </h3>
        </div>
        
        <div className="overflow-x-auto">
            <table className="w-full text-left">
                <thead>
                    <tr className="bg-[#080C14] border-b border-deepDivider">
                        <th className="p-6 text-steelGrey font-black text-[10px] uppercase tracking-[0.2em]">User</th>
                        <th className="p-6 text-steelGrey font-black text-[10px] uppercase tracking-[0.2em]">Role</th>
                        <th className="p-6 text-steelGrey font-black text-[10px] uppercase tracking-[0.2em]">Status</th>
                        <th className="p-6 text-steelGrey font-black text-[10px] uppercase tracking-[0.2em] text-right">Actions</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-deepDivider/50">
                    {users.length === 0 ? (
                        <tr>
                            <td colSpan={4} className="p-20 text-center text-steelGrey italic">
                                No other team members found for this organization.
                            </td>
                        </tr>
                    ) : users.map((user) => (
                        <tr key={user.id} className="hover:bg-white/5 transition-colors group">
                            <td className="p-6">
                                <div className="flex items-center">
                                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-brightBlue to-blue-600 flex items-center justify-center text-white font-black text-lg mr-4 border border-white/10 shadow-lg">
                                        {user.name.charAt(0)}
                                    </div>
                                    <div>
                                        <div className="text-white font-black text-sm">{user.name}</div>
                                        <div className="text-steelGrey text-xs flex items-center mt-1"><Mail size={12} className="mr-1.5"/> {user.email}</div>
                                    </div>
                                </div>
                            </td>
                            <td className="p-6">
                                <div className="flex items-center text-[10px] font-black uppercase tracking-widest text-brightBlue bg-brightBlue/10 border border-brightBlue/20 px-3 py-1.5 rounded-lg w-max">
                                    <Shield size={12} className="mr-2" />
                                    {user.role}
                                </div>
                            </td>
                            <td className="p-6">
                                <span className={`text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-lg border flex items-center w-max ${
                                    user.status === 'Active' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' : 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20'
                                }`}>
                                    <div className={`w-1.5 h-1.5 rounded-full mr-2 ${user.status === 'Active' ? 'bg-emerald-500' : 'bg-yellow-500'}`}></div>
                                    {user.status}
                                </span>
                            </td>
                            <td className="p-6 text-right">
                                <div className="flex items-center justify-end space-x-2">
                                    <div className="text-[10px] text-steelGrey font-bold mr-4 flex items-center"><Clock size={12} className="mr-1.5"/> {user.lastActive}</div>
                                    <button 
                                        className="p-2.5 text-steelGrey hover:text-riskHigh hover:bg-riskHigh/10 rounded-xl transition-all" 
                                        onClick={() => removeUser(user.id)}
                                        title="Remove member"
                                    >
                                        <Trash2 size={18}/>
                                    </button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
      </div>

      {/* INVITE MODAL */}
      {isInviteModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
          <div className="bg-obsidianNavy border border-white/10 rounded-[32px] w-full max-w-md shadow-2xl overflow-hidden animate-fadeIn">
            <div className="p-8 border-b border-white/5 flex justify-between items-center bg-techBlack/40">
              <h3 className="text-xl font-black text-white uppercase tracking-tight">Invite Member</h3>
              <button onClick={() => setIsInviteModalOpen(false)} className="text-steelGrey hover:text-white transition-all"><X size={24} /></button>
            </div>
            
            <form onSubmit={handleInvite} className="p-8 space-y-6">
              <div className="space-y-4">
                <label className="text-[10px] font-black text-steelGrey uppercase tracking-[0.4em]">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-steelGrey" size={16} />
                  <input 
                    required 
                    type="email" 
                    value={inviteEmail}
                    onChange={(e) => setInviteEmail(e.target.value)}
                    placeholder="teammate@company.com"
                    className="w-full bg-techBlack border border-white/10 rounded-xl pl-12 pr-4 py-4 text-sm font-bold text-white outline-none focus:border-brightBlue transition-all"
                  />
                </div>
              </div>

              <div className="space-y-4">
                <label className="text-[10px] font-black text-steelGrey uppercase tracking-[0.4em]">Assigned Role</label>
                <div className="grid grid-cols-2 gap-4">
                  {(['Editor', 'Viewer'] as const).map(role => (
                    <button
                      key={role}
                      type="button"
                      onClick={() => setInviteRole(role)}
                      className={`py-4 rounded-xl border text-[10px] font-black uppercase tracking-widest transition-all ${
                        inviteRole === role 
                          ? 'bg-brightBlue/10 border-brightBlue text-brightBlue' 
                          : 'bg-techBlack border-white/10 text-steelGrey hover:border-white/20'
                      }`}
                    >
                      {role}
                    </button>
                  ))}
                </div>
              </div>

              {isLimitReached && (
                <div className="p-4 bg-riskHigh/10 border border-riskHigh/20 rounded-xl text-riskHigh text-[10px] font-black uppercase tracking-widest flex items-center">
                  <AlertTriangle size={14} className="mr-2" /> Upgrade to add more seats
                </div>
              )}

              <button 
                type="submit" 
                disabled={inviting || !inviteEmail || isLimitReached || inviteSuccess}
                className="w-full bg-brightBlue hover:bg-blue-600 disabled:opacity-50 text-white py-4 rounded-xl font-black text-xs uppercase tracking-[0.4em] shadow-xl transition-all flex items-center justify-center"
              >
                {inviting ? <Loader2 className="animate-spin mr-2" size={18} /> : inviteSuccess ? <CheckCircle className="mr-2" size={18} /> : <UserPlus className="mr-2" size={18} />}
                {inviting ? 'Sending...' : inviteSuccess ? 'Sent!' : 'Send Invitation'}
              </button>
            </form>
          </div>
        </div>
      )}
      
      <div className="bg-brightBlue/5 border border-brightBlue/20 rounded-3xl p-8">
          <h4 className="text-white font-black uppercase tracking-widest text-xs mb-4">About Team Collaboration</h4>
          <p className="text-xs text-steelGrey leading-relaxed">
              Complimaxx uses organization-based isolation. Users who fill in the same 'Company Name' in their settings are automatically grouped within this team overview. Invitations will grant users access to your company's shared workspace.
          </p>
      </div>
    </div>
  );
};

export default TeamManagement;
