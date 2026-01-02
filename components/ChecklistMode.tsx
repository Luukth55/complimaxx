
import React, { useState, useEffect, useMemo } from 'react';
import { 
  Check, 
  CheckCircle,
  Loader2,
  Filter, 
  Upload, 
  FileText, 
  Calendar, 
  Plus, 
  Shield, 
  AlertTriangle, 
  RefreshCw, 
  X,
  Save,
  Search,
  Link,
  Zap,
  MoreVertical,
  ArrowRight,
  Clock
} from 'lucide-react';
import { AuditPackage, ChecklistItem, ChecklistFile } from '../types';

interface ChecklistModeProps {
  data: AuditPackage | null;
  navigate: (route: any) => void;
  onUpdate?: (items: ChecklistItem[]) => void;
}

const CATEGORIES = ['All', 'Audit Prep', 'Control', 'Evidence', 'Gap Remediation', 'Renewal'];
const PRIORITIES = ['High', 'Medium', 'Low'];

const ChecklistMode: React.FC<ChecklistModeProps> = ({ data, navigate, onUpdate }) => {
  const [items, setItems] = useState<ChecklistItem[]>([]);
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<ChecklistItem | null>(null);
  
  const [daysUntilAudit, setDaysUntilAudit] = useState(90);

  useEffect(() => {
    if (data) {
      if (data.audit_meta && data.audit_meta.next_audit_date) {
          const nextDate = new Date(data.audit_meta.next_audit_date);
          const today = new Date();
          const diffTime = nextDate.getTime() - today.getTime();
          setDaysUntilAudit(Math.max(0, Math.ceil(diffTime / (1000 * 60 * 60 * 24))));
      }

      if (data.checklist && data.checklist.length > 0) {
        setItems(data.checklist);
      } else {
        // Generate initial checklist based on controls if none exists
        const newItems: ChecklistItem[] = data.controls.map((c, i) => ({
            id: `TSK-${100 + i}`,
            requirement: `Control Validation: ${c.title}`,
            description: c.description,
            status: 'Not Started',
            assignedTo: c.owner || 'Compliance Team',
            dueDate: data.audit_meta?.next_audit_date || '2025-12-31',
            framework: c.framework_mapping[0]?.framework || 'General',
            category: 'Control',
            priority: i < 3 ? 'High' : 'Medium',
            difficulty: i % 2 === 0 ? 'Medium' : 'Easy',
            recurrence: 'Yearly',
            evidenceFiles: [],
            evidenceNotes: '',
            linkedControl: c.id
        }));
        setItems(newItems);
        if (onUpdate) onUpdate(newItems);
      }
    }
  }, [data]);

  const aiSuggestion = useMemo(() => {
    const todo = items.filter(i => i.status !== 'Complete');
    if (todo.length === 0) return null;
    return [...todo].sort((a, b) => {
        const priorityScore: Record<string, number> = { 'High': 3, 'Medium': 2, 'Low': 1 };
        return priorityScore[b.priority] - priorityScore[a.priority];
    })[0];
  }, [items]);

  const filteredItems = useMemo(() => {
    return items.filter(item => {
        const matchesCategory = activeCategory === 'All' || item.category === activeCategory;
        const matchesSearch = item.requirement.toLowerCase().includes(searchQuery.toLowerCase()) || 
                              item.assignedTo.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesCategory && matchesSearch;
    });
  }, [items, activeCategory, searchQuery]);

  const handleStatusToggle = (id: string) => {
     const updated = items.map(i => i.id === id ? { 
       ...i, 
       status: (i.status === 'Complete' ? 'Not Started' : 'Complete') as ChecklistItem['status'] 
     } : i);
     setItems(updated);
     if (onUpdate) onUpdate(updated);
  };

  const handleSaveTask = () => {
    if (editingItem) {
      const exists = items.find(i => i.id === editingItem.id);
      const updated = exists 
        ? items.map(i => i.id === editingItem.id ? editingItem : i)
        : [editingItem, ...items];
      
      setItems(updated);
      if (onUpdate) onUpdate(updated);
      setIsModalOpen(false);
      setEditingItem(null);
    }
  };

  return (
    <div className="space-y-6 h-full flex flex-col animate-fadeIn">
      {/* HEADER WIDGET */}
      <div className="bg-obsidianNavy border border-deepDivider rounded-2xl p-8 flex flex-col lg:flex-row justify-between items-center gap-6 shadow-2xl relative overflow-hidden">
         <div className="absolute right-0 top-0 h-full w-1/4 bg-brightBlue/5 skew-x-12 transform origin-bottom-right"></div>
         <div className="relative z-10 flex items-center gap-8">
             <div className="text-center">
                 <div className="text-5xl font-black text-white mb-1">{daysUntilAudit}</div>
                 <div className="text-[10px] text-steelGrey uppercase tracking-[0.2em] font-black">Days until Audit</div>
             </div>
             <div className="h-12 w-px bg-deepDivider"></div>
             <div>
                 <h2 className="text-xl font-bold text-white flex items-center">
                     <RefreshCw size={20} className="mr-2 text-brightBlue animate-spin-slow" /> 
                     Compliance Checklist
                 </h2>
                 <p className="text-steelGrey text-sm">Status: <span className="text-emerald-500 font-bold">Operational</span> • {items.filter(i => i.status === 'Complete').length}/{items.length} Completed</p>
             </div>
         </div>
         <button 
           onClick={() => {
             setEditingItem({
               id: `T-${Date.now()}`,
               requirement: '',
               status: 'Not Started',
               assignedTo: '',
               dueDate: new Date().toISOString().split('T')[0],
               framework: 'Internal',
               category: 'Audit Prep',
               priority: 'Medium',
               difficulty: 'Medium',
               recurrence: 'One-time',
               evidenceFiles: []
             });
             setIsModalOpen(true);
           }}
           className="bg-brightBlue hover:bg-blue-600 text-white px-6 py-3 rounded-xl font-black text-xs uppercase tracking-widest transition-all shadow-lg flex items-center"
         >
            <Plus size={18} className="mr-2" /> New Task
         </button>
      </div>

      {/* AI RECOMMENDATION */}
      {aiSuggestion && (
        <div className="bg-brightBlue/10 border border-brightBlue/20 rounded-xl p-4 flex items-center justify-between group">
            <div className="flex items-center">
                <div className="p-2 bg-brightBlue text-white rounded-lg mr-4 shadow-lg group-hover:scale-110 transition-transform">
                    <Zap size={20} />
                </div>
                <div>
                    <span className="text-[10px] font-black text-brightBlue uppercase tracking-widest mb-1 block">AI Priority</span>
                    <h4 className="text-white font-bold text-sm">{aiSuggestion.requirement}</h4>
                </div>
            </div>
            <button 
              onClick={() => { setEditingItem(aiSuggestion); setIsModalOpen(true); }}
              className="text-xs font-black text-white bg-white/5 hover:bg-white/10 px-4 py-2 rounded-lg transition-all flex items-center"
            >
                Start Now <ArrowRight size={14} className="ml-2" />
            </button>
        </div>
      )}

      <div className="flex flex-col lg:flex-row gap-6 flex-1 min-h-0">
          <div className="lg:w-64 space-y-4">
              <div className="bg-obsidianNavy border border-deepDivider rounded-xl p-4">
                  <h3 className="text-[10px] font-black text-steelGrey uppercase tracking-widest mb-4">Filter by Category</h3>
                  <div className="space-y-1">
                      {CATEGORIES.map(cat => (
                          <button 
                            key={cat} 
                            onClick={() => setActiveCategory(cat)} 
                            className={`w-full text-left px-3 py-2 rounded-lg text-xs font-bold transition-all flex justify-between items-center ${activeCategory === cat ? 'bg-brightBlue/10 text-brightBlue border border-brightBlue/20' : 'text-steelGrey hover:bg-white/5'}`}
                          >
                              {cat}
                              <span className="text-[9px] opacity-40">{cat === 'All' ? items.length : items.filter(i => i.category === cat).length}</span>
                          </button>
                      ))}
                  </div>
              </div>
          </div>

          <div className="flex-1 bg-obsidianNavy border border-deepDivider rounded-xl overflow-hidden flex flex-col shadow-xl">
              <div className="p-4 border-b border-deepDivider bg-[#080C14] flex justify-between items-center">
                  <div className="relative w-full max-w-md">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-steelGrey" size={14} />
                      <input 
                        type="text" 
                        placeholder="Search checklist..." 
                        value={searchQuery} 
                        onChange={(e) => setSearchQuery(e.target.value)} 
                        className="w-full bg-obsidianNavy border border-deepDivider rounded-lg pl-9 pr-4 py-2 text-xs text-white outline-none focus:border-brightBlue" 
                      />
                  </div>
              </div>

              <div className="flex-1 overflow-y-auto custom-scrollbar">
                  <table className="w-full text-left">
                      <thead className="bg-[#080C14] sticky top-0 z-10">
                          <tr className="border-b border-deepDivider">
                              <th className="p-4 text-[10px] font-black text-steelGrey uppercase tracking-widest">Task / Requirement</th>
                              <th className="p-4 text-[10px] font-black text-steelGrey uppercase tracking-widest text-center">Status</th>
                              <th className="p-4 text-[10px] font-black text-steelGrey uppercase tracking-widest text-center">Priority</th>
                              <th className="p-4 text-[10px] font-black text-steelGrey uppercase tracking-widest text-right">Deadline</th>
                          </tr>
                      </thead>
                      <tbody className="divide-y divide-deepDivider/40">
                          {filteredItems.map(item => (
                              <tr 
                                key={item.id} 
                                className={`group hover:bg-white/5 transition-all cursor-pointer ${item.status === 'Complete' ? 'opacity-50' : ''}`}
                                onClick={() => { setEditingItem(item); setIsModalOpen(true); }}
                              >
                                  <td className="p-4">
                                      <div className={`text-sm font-bold text-white mb-1 ${item.status === 'Complete' ? 'line-through text-steelGrey' : ''}`}>{item.requirement}</div>
                                      <div className="flex items-center gap-3">
                                          <span className="text-[10px] font-black text-steelGrey uppercase tracking-widest">{item.assignedTo}</span>
                                          {item.linkedControl && (
                                            <span className="text-[9px] font-bold text-brightBlue bg-brightBlue/5 border border-brightBlue/20 px-1.5 py-0.5 rounded flex items-center">
                                              <Shield size={10} className="mr-1" /> {item.linkedControl}
                                            </span>
                                          )}
                                      </div>
                                  </td>
                                  <td className="p-4 text-center">
                                      <button 
                                        onClick={(e) => { e.stopPropagation(); handleStatusToggle(item.id); }}
                                        className={`w-8 h-8 rounded-lg flex items-center justify-center mx-auto border transition-all ${
                                          item.status === 'Complete' 
                                            ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-500' 
                                            : 'bg-white/5 border-white/10 text-steelGrey hover:text-white'
                                        }`}
                                      >
                                          {item.status === 'Complete' ? <CheckCircle size={18} /> : <div className="w-4 h-4 rounded-sm border border-current" />}
                                      </button>
                                  </td>
                                  <td className="p-4 text-center">
                                      <span className={`text-[9px] font-black uppercase px-2 py-1 rounded border ${
                                        item.priority === 'High' ? 'bg-riskHigh/10 text-riskHigh border-riskHigh/20' : 
                                        item.priority === 'Medium' ? 'bg-riskMedium/10 text-riskMedium border-riskMedium/20' : 
                                        'bg-riskLow/10 text-riskLow border-riskLow/20'
                                      }`}>
                                          {item.priority}
                                      </span>
                                  </td>
                                  <td className="p-4 text-right">
                                      <div className="text-[10px] text-steelGrey font-bold flex items-center justify-end"><Clock size={12} className="mr-2" /> {item.dueDate}</div>
                                  </td>
                              </tr>
                          ))}
                      </tbody>
                  </table>
              </div>
          </div>
      </div>

      {/* MODAL */}
      {isModalOpen && editingItem && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
              <div className="bg-[#080C14] border border-deepDivider rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden shadow-2xl flex flex-col">
                  <div className="p-6 border-b border-deepDivider flex justify-between items-start bg-obsidianNavy">
                      <div>
                          <div className="flex items-center gap-2 mb-2">
                              <span className="text-[10px] font-black text-brightBlue bg-brightBlue/10 px-2 py-0.5 rounded uppercase tracking-widest">{editingItem.id}</span>
                              <span className="text-[10px] font-black text-steelGrey uppercase tracking-widest">{editingItem.framework}</span>
                          </div>
                          <h3 className="text-xl font-black text-white">Task Details</h3>
                      </div>
                      <button onClick={() => setIsModalOpen(false)} className="text-steelGrey hover:text-white p-2"><X size={24} /></button>
                  </div>
                  
                  <div className="p-6 overflow-y-auto space-y-6 flex-1 bg-techBlack/50">
                      <div>
                          <label className="text-[10px] font-black text-steelGrey uppercase tracking-widest block mb-2">Task Description</label>
                          <input 
                            type="text" 
                            value={editingItem.requirement} 
                            onChange={(e) => setEditingItem({...editingItem, requirement: e.target.value})}
                            className="w-full bg-obsidianNavy border border-deepDivider rounded-lg p-3 text-sm text-white focus:border-brightBlue outline-none"
                          />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                          <div>
                              <label className="text-[10px] font-black text-steelGrey uppercase tracking-widest block mb-2">Owner</label>
                              <input 
                                type="text" 
                                value={editingItem.assignedTo} 
                                onChange={(e) => setEditingItem({...editingItem, assignedTo: e.target.value})}
                                className="w-full bg-obsidianNavy border border-deepDivider rounded-lg p-2 text-sm text-white focus:border-brightBlue outline-none"
                              />
                          </div>
                          <div>
                              <label className="text-[10px] font-black text-steelGrey uppercase tracking-widest block mb-2">Deadline</label>
                              <input 
                                type="date" 
                                value={editingItem.dueDate} 
                                onChange={(e) => setEditingItem({...editingItem, dueDate: e.target.value})}
                                className="w-full bg-obsidianNavy border border-deepDivider rounded-lg p-2 text-sm text-white focus:border-brightBlue outline-none"
                              />
                          </div>
                      </div>

                      <div className="bg-obsidianNavy/30 p-4 rounded-xl border border-deepDivider border-dashed space-y-4">
                          <label className="text-[10px] font-black text-white uppercase tracking-widest flex items-center"><Upload size={14} className="mr-2 text-emerald-500" /> Evidence & Notes</label>
                          <textarea 
                            value={editingItem.evidenceNotes} 
                            onChange={(e) => setEditingItem({...editingItem, evidenceNotes: e.target.value})}
                            placeholder="Describe where the evidence can be found or add links..."
                            className="w-full h-24 bg-[#080C14] border border-deepDivider rounded-lg p-3 text-xs text-white focus:border-brightBlue outline-none resize-none"
                          />
                          <div className="border-2 border-dashed border-deepDivider rounded-xl p-6 text-center hover:border-brightBlue hover:bg-brightBlue/5 transition-all cursor-pointer">
                              <FileText size={24} className="mx-auto mb-2 text-steelGrey opacity-40" />
                              <p className="text-[10px] font-bold text-steelGrey uppercase tracking-widest">Attach document (Simulation)</p>
                          </div>
                      </div>
                  </div>

                  <div className="p-6 border-t border-deepDivider bg-obsidianNavy flex justify-end gap-3">
                      <button onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-xs font-black text-steelGrey uppercase tracking-widest hover:text-white">Cancel</button>
                      <button 
                        onClick={handleSaveTask}
                        className="bg-brightBlue hover:bg-blue-600 text-white px-8 py-2 rounded-lg font-black text-xs uppercase tracking-widest shadow-lg"
                      >
                          Save
                      </button>
                  </div>
              </div>
          </div>
      )}
    </div>
  );
};

export default ChecklistMode;
