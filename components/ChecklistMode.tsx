
import React, { useState, useEffect } from 'react';
import { Check, Filter, Upload, FileText, Calendar, User } from 'lucide-react';
import { AuditPackage, ChecklistItem } from '../types';

interface ChecklistModeProps {
  data: AuditPackage | null;
  navigate: (route: any) => void;
  onUpdate?: (items: ChecklistItem[]) => void;
}

const ChecklistMode: React.FC<ChecklistModeProps> = ({ data, navigate, onUpdate }) => {
  const [items, setItems] = useState<ChecklistItem[]>([]);
  const [filter, setFilter] = useState('All');

  useEffect(() => {
    if (data) {
      if (data.checklist && data.checklist.length > 0) {
        // Use existing persisted checklist
        setItems(data.checklist);
      } else {
        // Generate fresh checklist from controls
        const generatedItems: ChecklistItem[] = data.controls.map((control, index) => ({
            id: `CH${String(index + 1).padStart(2, '0')}`,
            requirement: control.title,
            status: 'Not Started',
            evidence: false,
            assignedTo: control.owner || 'Unassigned',
            dueDate: '2024-12-31', // Default future date
            framework: control.framework_mapping[0]?.framework || 'General'
        }));
        setItems(generatedItems);
        // Persist immediately
        if (onUpdate) onUpdate(generatedItems);
      }
    }
  }, [data]);

  const toggleStatus = (id: string) => {
    const newItems = items.map(item => {
      if (item.id === id) {
        const nextStatus = item.status === 'Not Started' ? 'In Progress' : item.status === 'In Progress' ? 'Complete' : 'Not Started';
        return { ...item, status: nextStatus as any };
      }
      return item;
    });
    setItems(newItems);
    if (onUpdate) onUpdate(newItems);
  };

  const filteredItems = filter === 'All' ? items : items.filter(i => i.status === filter);

  if (!data) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] text-center bg-obsidianNavy/30 rounded-xl border border-deepDivider border-dashed">
        <div className="p-6 bg-obsidianNavy rounded-full mb-4">
          <Check size={48} className="text-steelGrey" />
        </div>
        <h2 className="text-2xl font-bold text-white mb-2">No Active Checklist</h2>
        <p className="text-steelGrey mb-6 max-w-md">Generate an audit package first to populate your compliance checklist.</p>
        <button 
          onClick={() => navigate('project_wizard')}
          className="bg-brightBlue hover:bg-blue-600 text-white px-6 py-2 rounded-lg font-medium transition-colors"
        >
          Go to Generator
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white">Audit Checklist</h2>
          <p className="text-steelGrey text-sm">Track progress for {data.process_flow[0]?.title || 'Project'}</p>
        </div>
        <div className="flex space-x-2">
            <div className="flex items-center bg-obsidianNavy border border-deepDivider rounded-lg px-3 py-2 text-sm text-steelGrey">
                <span className="mr-2">Progress:</span>
                <span className="text-brightBlue font-bold">
                    {Math.round((items.filter(i => i.status === 'Complete').length / Math.max(items.length, 1)) * 100)}%
                </span>
            </div>
            <button className="bg-brightBlue text-white px-4 py-2 rounded-lg text-sm font-medium">Export Report</button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar Filters */}
        <div className="lg:col-span-1 space-y-4">
          <div className="bg-obsidianNavy border border-deepDivider rounded-xl p-4">
            <h3 className="font-bold text-white mb-4 flex items-center"><Filter size={16} className="mr-2" /> Filters</h3>
            <div className="space-y-2">
              {['All', 'Not Started', 'In Progress', 'Complete'].map(status => (
                <button
                  key={status}
                  onClick={() => setFilter(status)}
                  className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${filter === status ? 'bg-brightBlue/20 text-brightBlue border border-brightBlue/30' : 'text-steelGrey hover:bg-white/5'}`}
                >
                  {status}
                  <span className="float-right text-xs opacity-50 bg-black/20 px-2 rounded-full">
                    {status === 'All' ? items.length : items.filter(i => i.status === status).length}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Main List */}
        <div className="lg:col-span-3">
          <div className="bg-obsidianNavy border border-deepDivider rounded-xl overflow-hidden">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-[#080C14] border-b border-deepDivider">
                  <th className="p-4 text-steelGrey font-medium text-sm w-20">ID</th>
                  <th className="p-4 text-steelGrey font-medium text-sm">Requirement</th>
                  <th className="p-4 text-steelGrey font-medium text-sm w-40">Status</th>
                  <th className="p-4 text-steelGrey font-medium text-sm w-32">Evidence</th>
                  <th className="p-4 text-steelGrey font-medium text-sm w-12"></th>
                </tr>
              </thead>
              <tbody>
                {filteredItems.map(item => (
                  <tr key={item.id} className="border-b border-deepDivider/50 hover:bg-white/5 transition-colors group">
                    <td className="p-4 text-steelGrey font-mono text-xs">{item.id}</td>
                    <td className="p-4">
                      <div className="text-white font-medium mb-1">{item.requirement}</div>
                      <div className="flex gap-3 text-xs text-steelGrey">
                        <span className="flex items-center"><User size={12} className="mr-1"/> {item.assignedTo}</span>
                        <span className="flex items-center"><Calendar size={12} className="mr-1"/> Due {item.dueDate}</span>
                        <span className="bg-deepDivider px-1.5 rounded">{item.framework}</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <button 
                        onClick={() => toggleStatus(item.id)}
                        className={`px-3 py-1 rounded text-xs font-bold border ${
                          item.status === 'Complete' ? 'bg-riskLow/10 text-riskLow border-riskLow/20' :
                          item.status === 'In Progress' ? 'bg-riskMedium/10 text-riskMedium border-riskMedium/20' :
                          'bg-deepDivider/50 text-steelGrey border-deepDivider'
                        }`}
                      >
                        {item.status}
                      </button>
                    </td>
                    <td className="p-4">
                      <button className="flex items-center text-xs text-brightBlue hover:underline">
                        <Upload size={14} className="mr-1" />
                        Upload
                      </button>
                    </td>
                    <td className="p-4 text-right">
                       <button className="text-steelGrey hover:text-white"><FileText size={16} /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filteredItems.length === 0 && (
                <div className="p-8 text-center text-steelGrey">
                    No items found matching this filter.
                </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChecklistMode;