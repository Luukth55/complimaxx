
import React, { useState } from 'react';
import { Users, Shield, UserPlus, Trash2, Ban } from 'lucide-react';
import { TeamMember } from '../types';

const TeamManagement: React.FC = () => {
  const [users, setUsers] = useState<TeamMember[]>([
      { id: '1', name: 'Local Admin (You)', email: 'admin@complimaxx.internal', role: 'Admin', status: 'Active', lastActive: 'Today' },
      { id: '2', name: 'Compliance Officer', email: 'officer@example.com', role: 'Editor', status: 'Pending', lastActive: 'N/A' }
  ]);

  const removeUser = (id: string) => {
    if(confirm("Are you sure? This is a local simulation.")) {
        setUsers(users.filter(u => u.id !== id));
    }
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-white">Team Management</h2>
          <p className="text-steelGrey text-sm">Collaboration is currently limited to this local browser session.</p>
        </div>
        <button className="bg-brightBlue hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-medium flex items-center shadow-lg shadow-blue-500/20">
          <UserPlus size={18} className="mr-2" /> Invite User (Demo)
        </button>
      </div>

      <div className="bg-orange-500/10 border border-orange-500/30 p-4 rounded-xl text-orange-500 text-sm flex items-center">
          <span className="mr-3">ℹ️</span> Offline Mode: Data is only stored on this device.
      </div>

      <div className="bg-obsidianNavy border border-deepDivider rounded-xl overflow-hidden shadow-xl">
        <div className="p-6 border-b border-deepDivider flex justify-between items-center bg-[#080C14]">
            <h3 className="font-bold text-white flex items-center"><Users size={18} className="mr-2 text-brightBlue"/> Active Members ({users.length})</h3>
        </div>
        
        <div className="overflow-x-auto">
            <table className="w-full text-left">
                <thead>
                    <tr className="bg-[#080C14] border-b border-deepDivider">
                        <th className="p-5 text-steelGrey font-bold text-xs uppercase tracking-wider">User</th>
                        <th className="p-5 text-steelGrey font-bold text-xs uppercase tracking-wider">Role</th>
                        <th className="p-5 text-steelGrey font-bold text-xs uppercase tracking-wider">Status</th>
                        <th className="p-5 text-steelGrey font-bold text-xs uppercase tracking-wider text-right">Actions</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-deepDivider/50">
                    {users.map((user) => (
                        <tr key={user.id} className="hover:bg-white/5 transition-colors group">
                            <td className="p-5">
                                <div className="flex items-center">
                                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-brightBlue to-blue-600 flex items-center justify-center text-white font-bold mr-3 border border-white/10 shadow-lg">
                                        {user.name.charAt(0)}
                                    </div>
                                    <div>
                                        <div className="text-white font-bold">{user.name}</div>
                                        <div className="text-steelGrey text-xs">{user.email}</div>
                                    </div>
                                </div>
                            </td>
                            <td className="p-5">
                                <div className="flex items-center text-xs text-white bg-brightBlue/10 border border-brightBlue/20 px-2 py-1 rounded w-max">
                                    <Shield size={12} className="mr-2 text-brightBlue" />
                                    {user.role}
                                </div>
                            </td>
                            <td className="p-5">
                                <span className={`text-xs px-2 py-1 rounded-full border ${
                                    user.status === 'Active' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' : 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20'
                                }`}>
                                    {user.status}
                                </span>
                            </td>
                            <td className="p-5 text-right">
                                <div className="flex items-center justify-end space-x-2 opacity-0 group-hover:opacity-100 transition-all">
                                    <button 
                                        className="p-2 text-riskHigh hover:bg-riskHigh/10 rounded-lg" 
                                        onClick={() => removeUser(user.id)}
                                    >
                                        <Trash2 size={16}/>
                                    </button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
      </div>
    </div>
  );
};

export default TeamManagement;
