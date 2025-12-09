
import React, { useState } from 'react';
import { Users, Mail, Shield, MoreHorizontal, UserPlus, Trash2, Ban } from 'lucide-react';
import { TeamMember } from '../types';

const TeamManagement: React.FC = () => {
  const [users, setUsers] = useState<TeamMember[]>([
    { id: '1', name: 'Alex Johnson', email: 'alex@company.com', role: 'Admin', status: 'Active', lastActive: '2 mins ago' },
    { id: '2', name: 'Sarah Lee', email: 'sarah.l@company.com', role: 'Editor', status: 'Active', lastActive: '4 hours ago' },
    { id: '3', name: 'Mike Chen', email: 'm.chen@company.com', role: 'Viewer', status: 'Pending', lastActive: '-' },
  ]);

  const removeUser = (id: string) => {
    setUsers(users.filter(u => u.id !== id));
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-white">Team Management</h2>
          <p className="text-steelGrey text-sm">Manage access and roles for your compliance team.</p>
        </div>
        <button className="bg-brightBlue hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-medium flex items-center shadow-lg shadow-blue-500/20">
          <UserPlus size={18} className="mr-2" /> Invite User
        </button>
      </div>

      <div className="bg-obsidianNavy border border-deepDivider rounded-xl overflow-hidden">
        <div className="p-6 border-b border-deepDivider flex justify-between items-center">
            <h3 className="font-bold text-white flex items-center"><Users size={18} className="mr-2"/> Active Members ({users.length})</h3>
            <span className="text-xs text-steelGrey bg-deepDivider px-2 py-1 rounded">Pro Plan: 3/10 Seats Used</span>
        </div>
        <table className="w-full text-left">
          <thead>
            <tr className="bg-[#080C14] border-b border-deepDivider">
              <th className="p-5 text-steelGrey font-medium text-sm">User</th>
              <th className="p-5 text-steelGrey font-medium text-sm">Role</th>
              <th className="p-5 text-steelGrey font-medium text-sm">Status</th>
              <th className="p-5 text-steelGrey font-medium text-sm">Last Active</th>
              <th className="p-5 text-steelGrey font-medium text-sm text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id} className="border-b border-deepDivider/50 hover:bg-white/5 transition-colors group">
                <td className="p-5">
                  <div className="flex items-center">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gray-700 to-gray-900 flex items-center justify-center text-white font-bold mr-3 border border-deepDivider">
                        {user.name.charAt(0)}
                    </div>
                    <div>
                        <div className="text-white font-medium">{user.name}</div>
                        <div className="text-steelGrey text-xs flex items-center"><Mail size={10} className="mr-1"/> {user.email}</div>
                    </div>
                  </div>
                </td>
                <td className="p-5">
                   <div className="flex items-center text-sm text-white bg-deepDivider/50 px-2 py-1 rounded w-max">
                        <Shield size={12} className="mr-2 text-brightBlue" />
                        {user.role}
                   </div>
                </td>
                <td className="p-5">
                   <span className={`text-xs px-2 py-1 rounded-full border ${
                       user.status === 'Active' 
                       ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' 
                       : 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20'
                   }`}>
                       {user.status}
                   </span>
                </td>
                <td className="p-5 text-steelGrey text-sm">{user.lastActive}</td>
                <td className="p-5 text-right">
                    <div className="flex items-center justify-end space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button className="p-2 text-steelGrey hover:text-white hover:bg-white/10 rounded" title="Disable"><Ban size={16}/></button>
                        <button 
                            className="p-2 text-riskHigh hover:bg-riskHigh/10 rounded" 
                            title="Remove"
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
        {users.length === 0 && <div className="p-8 text-center text-steelGrey">No users found.</div>}
      </div>
    </div>
  );
};

export default TeamManagement;