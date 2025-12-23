
import React, { useState, useEffect, useMemo } from 'react';
import { 
  Check, 
  CheckCircle,
  Loader2,
  Eye,
  Filter, 
  Upload, 
  FileText, 
  Calendar, 
  User, 
  Plus, 
  Trash2, 
  Edit3, 
  Clock, 
  Shield, 
  AlertTriangle, 
  RefreshCw, 
  Download, 
  X,
  Paperclip,
  Save,
  ChevronDown,
  Search,
  Link,
  Briefcase,
  MessageSquare,
  Zap,
  MoreVertical,
  // Fix: Added missing icon import
  ArrowRight
} from 'lucide-react';
import { AuditPackage, ChecklistItem, ChecklistFile } from '../types';

interface ChecklistModeProps {
  data: AuditPackage | null;
  navigate: (route: any) => void;
  onUpdate?: (items: ChecklistItem[]) => void;
}

const CATEGORIES = ['All', 'Audit Prep', 'Control', 'Evidence', 'Gap Remediation', 'Renewal'];

const ChecklistMode: React.FC<ChecklistModeProps> = ({ data, navigate, onUpdate }) => {
  const [items, setItems] = useState<ChecklistItem[]>([]);
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<ChecklistItem | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  // Fix: Added missing const declaration for useRef
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  
  const [daysUntilAudit, setDaysUntilAudit] = useState(0);

  useEffect(() => {
    if (data && data.audit_meta && data.audit_meta.next_audit_date) {
        const nextDate = new Date(data.audit_meta.next_audit_date);
        const today = new Date();
        const diffTime = nextDate.getTime() - today.getTime();
        setDaysUntilAudit(Math.ceil(diffTime / (1000 * 60 * 60 * 24)));
    } else {
        setDaysUntilAudit(90); // Default placeholder
    }

    if (data) {
      if (data.checklist && data.checklist.length > 0) {
        setItems(data.checklist);
      } else {
        const newItems: ChecklistItem[] = [];
        // Init from data logic... (Same as before but with added Difficulty)
        data.controls.forEach((c, i) => {
            newItems.push({
                id: `TSK-${100 + i}`,
                requirement: `Verify Control: ${c.title}`,
                description: c.description,
                status: 'Not Started',
                assignedTo: c.owner || 'Unassigned',
                dueDate: '2025-06-30',
                framework: c.framework_mapping[0]?.framework || 'ISO 27001',
                category: 'Control',
                priority: 'High',
                difficulty: i % 3 === 0 ? 'Hard' : i % 3 === 1 ? 'Medium' : 'Easy',
                recurrence: 'Monthly',
                evidenceFiles: [],
                evidenceNotes: '',
                linkedControl: c.id
            });
        });
        setItems(newItems);
        if (onUpdate) onUpdate(newItems);
      }
    }
  }, [data]);

  const aiSuggestion = useMemo(() => {
    const todo = items.filter(i => i.status !== 'Complete');
    if (todo.length === 0) return null;
    return todo.sort((a, b) => {
        if (a.priority === 'High' && b.priority !== 'High') return -1;
        return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
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
     const updated = items.map(i => i.id === id ? { ...i, status: (i.status === 'Complete' ? 'Not Started' : 'Complete') as any } : i);
     setItems(updated);
     if (onUpdate) onUpdate(updated);
  };

  const toggleSelectAll = () => {
    if (selectedItems.length === filteredItems.length) setSelectedItems([]);
    else setSelectedItems(filteredItems.map(i => i.id));
  };

  const handleBulkComplete = () => {
    const updated = items.map(i => selectedItems.includes(i.id) ? { ...i, status: 'Complete' as const } : i);
    setItems(updated);
    if (onUpdate) onUpdate(updated);
    setSelectedItems([]);
  };

  const getDifficultyColor = (d: string) => {
      switch(d) {
          case 'Hard': return 'bg-red-500/10 text-red-400 border-red-500/20';
          case 'Medium': return 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20';
          default: return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
      }
  };

  return (
    <div className="space-y-6 h-full flex flex-col">
      {/* RENEWAL WIDGET */}
      <div className="bg-obsidianNavy border border-deepDivider rounded-xl p-8 flex flex-col lg:flex-row justify-between items-center gap-6 shadow-2xl relative overflow-hidden">
         <div className="absolute right-0 top-0 h-full w-1/4 bg-brightBlue/5 skew-x-12 transform origin-bottom-right"></div>
         <div className="relative z-10 flex items-center gap-8">
             <div className="text-center">
                 <div className="text-5xl font-black text-white mb-1">{daysUntilAudit}</div>
                 <div className="text-[10px] text-steelGrey uppercase tracking-[0.2em] font-bold">Days until Audit</div>
             </div>
             <div className="h-12 w-px bg-deepDivider"></div>
             <div>
                 <h2 className="text-xl font-bold text-white flex items-center">
                     <RefreshCw size={20} className="mr-2 text-brightBlue animate-spin-slow" /> 
                     Audit Prep Center
                 </h2>
                 <p className="text-steelGrey text-sm">Status: <span className="text-emerald-500 font-bold">Tracking Active</span></p>
             </div>
         </div>
         <div className="flex items-center gap-4">
            <div className="text-right">
                <div className="text-xs text-steelGrey mb-1 font-bold uppercase tracking-widest">Progress</div>
                <div className="w-48 bg-deepDivider h-2 rounded-full overflow-hidden">
                    <div className="bg-brightBlue h-full transition-all duration-1000" style={{ width: `${(items.filter(i => i.status === 'Complete').length / Math.max(items.length, 1)) * 100}%` }}></div>
                </div>
            </div>
            <button onClick={() => { setEditingItem({ id: `T-${Date.now()}`, requirement: 'Nieuwe Taak', status: 'Not Started', assignedTo: 'Unassigned', dueDate: new Date().toISOString().split('T')[0], framework: 'ISO 27001', category: 'Audit Prep', priority: 'Medium', difficulty: 'Medium', recurrence: 'One-time', evidenceFiles: [] }); setIsModalOpen(true); }} className="bg-brightBlue hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-black text-xs uppercase tracking-widest transition-all shadow-lg shadow-brightBlue/20">
                <Plus size={18} className="mr-2" /> Add Task
            </button>
         </div>
      </div>

      {/* AI SUGGESTION BANNER */}
      {aiSuggestion && (
        <div className="bg-gradient-to-r from-brightBlue/20 to-transparent border border-brightBlue/30 rounded-xl p-4 flex items-center justify-between animate-fadeIn group">
            <div className="flex items-center">
                <div className="p-2 bg-brightBlue text-white rounded-lg mr-4 shadow-lg shadow-brightBlue/40 group-hover:scale-110 transition-transform">
                    <Zap size={20} fill="currentColor" />
                </div>
                <div>
                    <span className="text-[10px] font-black text-brightBlue uppercase tracking-widest mb-1 block">AI Recommended Next Step</span>
                    <h4 className="text-white font-bold">{aiSuggestion.requirement}</h4>
                </div>
            </div>
            <button onClick={() => { setEditingItem(aiSuggestion); setIsModalOpen(true); }} className="text-xs font-black text-white bg-white/10 hover:bg-white/20 px-4 py-2 rounded-lg transition-all flex items-center">
                Focus on Task <ArrowRight size={14} className="ml-2" />
            </button>
        </div>
      )}

      <div className="flex flex-col lg:flex-row gap-6 flex-1 min-h-0">
          {/* SIDEBAR */}
          <div className="lg:w-64 space-y-4">
              <div className="bg-obsidianNavy border border-deepDivider rounded-xl p-4">
                  <h3 className="text-xs font-black text-steelGrey uppercase tracking-widest mb-4">Task Category</h3>
                  <div className="space-y-1">
                      {CATEGORIES.map(cat => (
                          <button key={cat} onClick={() => setActiveCategory(cat)} className={`w-full text-left px-3 py-2 rounded-lg text-sm font-bold transition-all flex justify-between ${activeCategory === cat ? 'bg-brightBlue/10 text-brightBlue border border-brightBlue/20' : 'text-steelGrey hover:bg-white/5'}`}>
                              {cat}
                              <span className="opacity-40">{cat === 'All' ? items.length : items.filter(i => i.category === cat).length}</span>
                          </button>
                      ))}
                  </div>
              </div>
          </div>

          {/* MAIN TABLE */}
          <div className="flex-1 bg-obsidianNavy border border-deepDivider rounded-xl overflow-hidden flex flex-col shadow-xl">
              <div className="p-4 border-b border-deepDivider bg-[#080C14] flex justify-between items-center">
                  <div className="flex items-center gap-4">
                      <div className="relative w-64">
                          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-steelGrey" size={14} />
                          <input type="text" placeholder="Search tasks..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full bg-obsidianNavy border border-deepDivider rounded-lg pl-9 pr-4 py-2 text-xs text-white outline-none focus:border-brightBlue" />
                      </div>
                      {selectedItems.length > 0 && (
                          <div className="flex items-center gap-2 animate-fadeIn">
                              <span className="text-xs font-bold text-brightBlue px-2">{selectedItems.length} geselecteerd</span>
                              <button onClick={handleBulkComplete} className="bg-emerald-500 hover:bg-emerald-600 text-white px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all">Mark as Done</button>
                          </div>
                      )}
                  </div>
              </div>

              <div className="flex-1 overflow-y-auto custom-scrollbar">
                  <table className="w-full text-left">
                      <thead className="bg-[#080C14] sticky top-0 z-10">
                          <tr className="border-b border-deepDivider">
                              <th className="p-4 w-12"><input type="checkbox" checked={selectedItems.length === filteredItems.length && filteredItems.length > 0} onChange={toggleSelectAll} className="accent-brightBlue" /></th>
                              <th className="p-4 text-[10px] font-black text-steelGrey uppercase tracking-widest">Requirement</th>
                              <th className="p-4 text-[10px] font-black text-steelGrey uppercase tracking-widest">Status</th>
                              <th className="p-4 text-[10px] font-black text-steelGrey uppercase tracking-widest">Difficulty</th>
                              <th className="p-4 text-[10px] font-black text-steelGrey uppercase tracking-widest">Deadline</th>
                              <th className="p-4"></th>
                          </tr>
                      </thead>
                      <tbody className="divide-y divide-deepDivider/40">
                          {filteredItems.map(item => (
                              <tr key={item.id} className={`group hover:bg-white/5 transition-all cursor-pointer ${item.status === 'Complete' ? 'opacity-40' : ''}`} onClick={() => { setEditingItem(item); setIsModalOpen(true); }}>
                                  <td className="p-4" onClick={(e) => e.stopPropagation()}>
                                      <input type="checkbox" checked={selectedItems.includes(item.id)} onChange={() => setSelectedItems(prev => prev.includes(item.id) ? prev.filter(i => i !== item.id) : [...prev, item.id])} className="accent-brightBlue" />
                                  </td>
                                  <td className="p-4">
                                      <div className={`text-sm font-bold text-white mb-1 ${item.status === 'Complete' ? 'line-through' : ''}`}>{item.requirement}</div>
                                      <div className="flex items-center gap-3">
                                          <span className="text-[10px] font-black text-steelGrey uppercase tracking-widest">{item.assignedTo}</span>
                                          {item.linkedControl && <span className="text-[10px] font-black text-brightBlue border border-brightBlue/20 px-1.5 py-0.5 rounded flex items-center bg-brightBlue/5"><Shield size={10} className="mr-1" /> {item.linkedControl}</span>}
                                      </div>
                                  </td>
                                  <td className="p-4">
                                      <button onClick={(e) => { e.stopPropagation(); handleStatusToggle(item.id); }} className={`px-2 py-1 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${item.status === 'Complete' ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20' : 'bg-deepDivider text-steelGrey'}`}>
                                          {item.status === 'Complete' ? 'Complete' : 'To Do'}
                                      </button>
                                  </td>
                                  <td className="p-4">
                                      <span className={`px-2 py-0.5 rounded border text-[10px] font-black uppercase tracking-widest ${getDifficultyColor(item.difficulty)}`}>{item.difficulty}</span>
                                  </td>
                                  <td className="p-4">
                                      <div className="text-xs text-steelGrey flex items-center"><Clock size={12} className="mr-2" /> {item.dueDate}</div>
                                  </td>
                                  <td className="p-4 text-right">
                                      <button className="p-2 text-steelGrey hover:text-white transition-colors opacity-0 group-hover:opacity-100"><MoreVertical size={16} /></button>
                                  </td>
                              </tr>
                          ))}
                      </tbody>
                  </table>
              </div>
          </div>
      </div>

      {/* MODAL (Overhauled with Evidence & Metadata focus) */}
      {isModalOpen && editingItem && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
              <div className="bg-[#080C14] border border-deepDivider rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl animate-fadeIn">
                  <div className="p-6 border-b border-deepDivider flex justify-between items-start sticky top-0 bg-[#080C14] z-10">
                      <div>
                          <div className="flex items-center gap-2 mb-2">
                              <span className="text-[10px] font-black text-brightBlue bg-brightBlue/10 px-2 py-0.5 rounded uppercase tracking-widest">{editingItem.id}</span>
                              <span className="text-[10px] font-black text-steelGrey uppercase tracking-widest">{editingItem.framework}</span>
                          </div>
                          <h3 className="text-2xl font-black text-white">{editingItem.requirement}</h3>
                      </div>
                      <button onClick={() => setIsModalOpen(false)} className="text-steelGrey hover:text-white p-2"><X size={24} /></button>
                  </div>
                  <div className="p-6 space-y-8">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="space-y-4">
                              <div>
                                  <label className="text-[10px] font-black text-steelGrey uppercase tracking-widest block mb-2">Difficulty</label>
                                  <div className="flex gap-2">
                                      {['Easy', 'Medium', 'Hard'].map(d => (
                                          <button key={d} onClick={() => setEditingItem({...editingItem, difficulty: d as any})} className={`flex-1 py-2 rounded-lg text-xs font-bold border transition-all ${editingItem.difficulty === d ? 'bg-brightBlue text-white border-brightBlue' : 'bg-obsidianNavy text-steelGrey border-deepDivider hover:border-steelGrey'}`}>{d}</button>
                                      ))}
                                  </div>
                              </div>
                              <div>
                                  <label className="text-[10px] font-black text-steelGrey uppercase tracking-widest block mb-2">Assignee</label>
                                  <input type="text" value={editingItem.assignedTo} onChange={(e) => setEditingItem({...editingItem, assignedTo: e.target.value})} className="w-full bg-obsidianNavy border border-deepDivider rounded-lg p-3 text-sm text-white focus:border-brightBlue outline-none" />
                              </div>
                          </div>
                          <div className="bg-obsidianNavy/30 p-4 rounded-xl border border-deepDivider border-dashed space-y-4">
                              <h4 className="text-xs font-black text-white uppercase tracking-widest flex items-center"><Link size={14} className="mr-2 text-brightBlue" /> Relationships</h4>
                              <div className="space-y-3">
                                  <div className="flex justify-between items-center text-xs">
                                      <span className="text-steelGrey font-bold uppercase tracking-widest">Linked Control</span>
                                      <span className="text-brightBlue font-black">{editingItem.linkedControl || 'None'}</span>
                                  </div>
                                  <div className="flex justify-between items-center text-xs">
                                      <span className="text-steelGrey font-bold uppercase tracking-widest">Linked Risk</span>
                                      <span className="text-riskHigh font-black">{editingItem.linkedRisk || 'None'}</span>
                                  </div>
                              </div>
                          </div>
                      </div>

                      <div className="bg-obsidianNavy/50 border border-deepDivider rounded-xl p-6">
                          <label className="text-sm font-black text-white flex items-center mb-4"><Upload size={16} className="mr-2 text-emerald-500" /> Evidence Management</label>
                          <textarea value={editingItem.evidenceNotes} onChange={(e) => setEditingItem({...editingItem, evidenceNotes: e.target.value})} placeholder="Add evidence notes or links here..." className="w-full h-24 bg-[#080C14] border border-deepDivider rounded-lg p-4 text-sm text-white focus:border-brightBlue outline-none resize-none mb-4" />
                          <div className="border-2 border-dashed border-deepDivider rounded-xl p-8 text-center hover:border-brightBlue hover:bg-brightBlue/5 transition-all cursor-pointer">
                              <Upload size={32} className="mx-auto mb-3 text-steelGrey" />
                              <p className="text-sm font-bold text-white">Drag evidence artifacts here</p>
                              <p className="text-xs text-steelGrey mt-1">PDF, Screenshots, Logs (Max 10MB)</p>
                          </div>
                      </div>
                  </div>
                  <div className="p-6 border-t border-deepDivider bg-obsidianNavy flex justify-end gap-3 sticky bottom-0">
                      <button onClick={() => setIsModalOpen(false)} className="px-6 py-2 text-steelGrey hover:text-white text-sm font-bold">Cancel</button>
                      <button onClick={() => { const updated = items.map(i => i.id === editingItem.id ? editingItem : i); setItems(updated); if(onUpdate) onUpdate(updated); setIsModalOpen(false); }} className="bg-brightBlue hover:bg-blue-600 text-white px-8 py-2 rounded-lg font-black text-xs uppercase tracking-widest shadow-lg shadow-brightBlue/20 transition-all">Save Task</button>
                  </div>
              </div>
          </div>
      )}
    </div>
  );
};

export default ChecklistMode;
