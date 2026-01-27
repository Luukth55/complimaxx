
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

  const companyName = profile?.company_name || 'My Organization';
  const userLimit = profile?.user_limit || 1;
  const isLimitReached = users.length >= userLimit;

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      const members = await storageService.getTeamMembers(companyName);
      setUsers(members);
      setLoading(false);
    };
    load();
  }, [companyName]);

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteEmail || isLimitReached) return;

    setInviting(true);
    const success = await storageService.mockInviteMember(companyName, inviteEmail, inviteRole);
    if (success) {
      setInviteSuccess(true);
      setTimeout(() => {
        setInviteSuccess(false);
        setIsInviteModalOpen(false);
        setInviteEmail('');
      }, 1500);
    }
    setInviting(false);
  };

  if (loading) return <div className="flex justify-center py-20"><Loader2 className="animate-spin text-brightBlue" size={40} /></div>;

  return (
    <div className="space-y-8 animate-fadeIn">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-black text-white uppercase tracking-tighter">Team Management</h2>
          <p className="text-steelGrey text-sm">Organization: <span className="text-brightBlue font-bold">{companyName}</span></p>
        </div>
        <button 
          onClick={() => setIsInviteModalOpen(true)}
          className={`px-6 py-3 rounded-xl font-black text-xs uppercase tracking-widest flex items-center transition-all ${isLimitReached ? 'bg-white/5 text-steelGrey cursor-not-allowed border border-white/5' : 'bg-brightBlue hover:bg-blue-600 text-white'}`}
        >
          {isLimitReached ? <Lock size={16} className="mr-2" /> : <UserPlus size={16} className="mr-2" />}
          Invite Member
        </button>
      </div>

      {isLimitReached && (
        <div className="bg-riskHigh/10 border border-riskHigh/20 p-4 rounded-xl flex items-center gap-3 text-xs font-bold text-white">
          <AlertTriangle className="text-riskHigh" /> You have reached the user limit for your current plan. Upgrade to add more seats.
        </div>
      )}

      <div className="bg-obsidianNavy border border-deepDivider rounded-3xl overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-techBlack border-b border-deepDivider">
            <tr>
              <th className="p-6 text-[10px] text-steelGrey uppercase font-black">Member</th>
              <th className="p-6 text-[10px] text-steelGrey uppercase font-black">Role</th>
              <th className="p-6 text-[10px] text-steelGrey uppercase font-black">Status</th>
              <th className="p-6 text-[10px] text-steelGrey uppercase font-black text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-deepDivider/50">
            {users.map(user => (
              <tr key={user.id} className="hover:bg-white/5 transition-colors">
                <td className="p-6">
                  <div className="font-bold text-white">{user.name}</div>
                  <div className="text-xs text-steelGrey">{user.email}</div>
                </td>
                <td className="p-6 text-xs font-bold text-brightBlue uppercase">{user.role}</td>
                <td className="p-6 text-xs text-emerald-500 font-bold uppercase">{user.status}</td>
                <td className="p-6 text-right"><button className="text-steelGrey hover:text-riskHigh transition-colors"><Trash2 size={18} /></button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isInviteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
          <div className="bg-obsidianNavy border border-white/10 rounded-[32px] w-full max-w-md p-8 animate-fadeIn">
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-xl font-black text-white uppercase">Invite to {companyName}</h3>
              <button onClick={() => setIsInviteModalOpen(false)}><X size={24} className="text-steelGrey hover:text-white" /></button>
            </div>
            <form onSubmit={handleInvite} className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-steelGrey uppercase">Teammate Email</label>
                <input required type="email" value={inviteEmail} onChange={e => setInviteEmail(e.target.value)} className="w-full bg-techBlack border border-white/10 rounded-xl px-4 py-4 text-white focus:border-brightBlue outline-none" placeholder="name@company.com" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                {['Editor', 'Viewer'].map(role => (
                  <button key={role} type="button" onClick={() => setInviteRole(role as any)} className={`py-4 rounded-xl border font-black text-[10px] uppercase tracking-widest transition-all ${inviteRole === role ? 'bg-brightBlue/10 border-brightBlue text-brightBlue' : 'border-white/5 text-steelGrey'}`}>
                    {role}
                  </button>
                ))}
              </div>
              <button disabled={inviting || isLimitReached || inviteSuccess} type="submit" className="w-full bg-brightBlue hover:bg-blue-600 py-4 rounded-xl font-black text-[10px] uppercase tracking-[0.4em] shadow-xl flex justify-center items-center">
                {inviting ? <Loader2 className="animate-spin mr-2" /> : inviteSuccess ? <CheckCircle className="mr-2" /> : <UserPlus className="mr-2" />}
                {inviting ? 'Sending...' : inviteSuccess ? 'Sent!' : 'Send Invitation'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default TeamManagement;
