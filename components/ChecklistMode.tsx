
import React, { useState, useEffect, useMemo } from 'react';
/* Added Database as DbIcon to lucide-react imports */
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
  Clock, 
  Activity,
  Database as DbIcon
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
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<ChecklistItem | null>(null);
  
  const [daysUntilAudit, setDaysUntilAudit] = useState(90);

  useEffect(() => {
    if (data) {
      if (data.audit_meta && data.audit_meta.next_audit_date) {
          const nextDate = new Date(data.audit_meta.next_audit_date);
          const diffTime = nextDate.getTime() - new Date().getTime();
          setDaysUntilAudit(Math.max(0, Math.ceil(diffTime / (1000 * 60 * 60 * 24))));
      }

      if (data.checklist && data.checklist.length > 0) {
        setItems(data.checklist);
      } else {
        const newItems: ChecklistItem[] = data.controls.map((c, i) => ({
            id: `OS-T-${100 + i}`,
            requirement: `${c.title} Implementation`,
            description: c.description,
            status: 'Not Started',
            assignedTo: c.owner || 'Process Owner',
            dueDate: data.audit_meta?.next_audit_date || '2025-12-31',
            framework: c.framework_mapping[0]?.framework || 'General',
            category: 'Control',
            priority: i < 3 ? 'High' : 'Medium',
            difficulty: 'Medium',
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

  const filteredItems = useMemo(() => {
    return items.filter(item => {
        const matchesCategory = activeCategory === 'All' || item.category === activeCategory;
        const matchesSearch = item.requirement.toLowerCase().includes(searchQuery.toLowerCase());
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
      {/* 1. EXECUTION HEADER */}
      <div className="bg-obsidianNavy border border-deepDivider rounded-[40px] p-10 flex flex-col lg:flex-row justify-between items-center gap-10 shadow-2xl relative overflow-hidden">
         <div className="absolute right-0 top-0 h-full w-1/4 bg-brightBlue/5 skew-x-12 transform origin-bottom-right"></div>
         <div className="relative z-10 flex items-center gap-10">
             <div className="bg-techBlack border border-white/5 p-6 rounded-3xl flex flex-col items-center">
                 <div className="text-4xl font-black text-white mb-1">{items.filter(i => i.status === 'Complete').length}</div>
                 <div className="text-[9px] text-steelGrey uppercase tracking-widest font-black">Executed</div>
             </div>
             <div>
                 <h2 className="text-3xl font-black text-white mb-2 uppercase tracking-tighter">Control Execution</h2>
                 <p className="text-steelGrey text-sm font-medium">Monitoring <span className="text-white font-bold">{items.length} tasks</span> for the current cycle.</p>
             </div>
         </div>
         <div className="flex gap-4 relative z-10">
             <button 
                onClick={() => {
                    setEditingItem({
                        id: `T-${Date.now()}`,
                        requirement: '',
                        status: 'Not Started',
                        assignedTo: '',
                        dueDate: new Date().toISOString().split('T')[0],
                        framework: 'General',
                        category: 'Audit Prep',
                        priority: 'Medium',
                        difficulty: 'Medium',
                        recurrence: 'One-time',
                        evidenceFiles: []
                    });
                    setIsModalOpen(true);
                }}
                className="bg-brightBlue hover:bg-blue-600 text-white px-8 py-4 rounded-2xl font-black text-[10px] uppercase tracking-[0.4em] shadow-xl transition-all"
             >
                <Plus size={18} className="mr-3" /> Add Task
             </button>
         </div>
      </div>

      {/* 2. OPERATING PANE */}
      <div className="flex flex-col lg:flex-row gap-8 flex-1 min-h-0">
          <div className="lg:w-72 space-y-6">
              <div className="bg-obsidianNavy border border-white/5 rounded-[32px] p-8 shadow-xl">
                  <h3 className="text-[10px] font-black text-steelGrey uppercase tracking-[0.4em] mb-8">OS Domains</h3>
                  <div className="space-y-2">
                      {CATEGORIES.map(cat => (
                          <button 
                            key={cat} 
                            onClick={() => setActiveCategory(cat)} 
                            className={`w-full text-left px-4 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex justify-between items-center ${activeCategory === cat ? 'bg-brightBlue/10 text-brightBlue border border-brightBlue/20' : 'text-steelGrey hover:bg-white/5'}`}
                          >
                              {cat}
                              <span className="text-[9px] opacity-40">{cat === 'All' ? items.length : items.filter(i => i.category === cat).length}</span>
                          </button>
                      ))}
                  </div>
              </div>

              <div className="bg-gradient-to-br from-[#1C2533] to-techBlack border border-white/5 rounded-[32px] p-8 shadow-xl">
                  <h4 className="text-[9px] font-black text-brightBlue uppercase tracking-[0.4em] mb-4">Readiness</h4>
                  <div className="text-3xl font-black text-white mb-4">
                      {Math.round((items.filter(i => i.status === 'Complete').length / items.length) * 100 || 0)}%
                  </div>
                  <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                      <div className="h-full bg-brightBlue" style={{ width: `${(items.filter(i => i.status === 'Complete').length / items.length) * 100}%` }}></div>
                  </div>
              </div>
          </div>

          <div className="flex-1 bg-obsidianNavy border border-white/5 rounded-[40px] overflow-hidden flex flex-col shadow-2xl">
              <div className="p-6 border-b border-white/5 bg-techBlack/20 flex justify-between items-center">
                  <div className="relative w-full max-w-md">
                      <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-steelGrey" size={16} />
                      <input 
                        type="text" 
                        placeholder="Filter execution logs..." 
                        value={searchQuery} 
                        onChange={(e) => setSearchQuery(e.target.value)} 
                        className="w-full bg-techBlack border border-white/10 rounded-xl pl-12 pr-6 py-3 text-[11px] font-bold text-white outline-none focus:border-brightBlue" 
                      />
                  </div>
              </div>

              <div className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-4">
                  {filteredItems.map(item => (
                      <div 
                        key={item.id} 
                        onClick={() => { setEditingItem(item); setIsModalOpen(true); }}
                        className={`p-6 rounded-3xl border transition-all cursor-pointer group flex items-center justify-between ${
                            item.status === 'Complete' 
                                ? 'bg-emerald-500/5 border-emerald-500/10' 
                                : 'bg-techBlack/40 border-white/5 hover:border-brightBlue/30'
                        }`}
                      >
                          <div className="flex items-center gap-6">
                              <button 
                                onClick={(e) => { e.stopPropagation(); handleStatusToggle(item.id); }}
                                className={`w-12 h-12 rounded-2xl flex items-center justify-center border transition-all ${
                                  item.status === 'Complete' 
                                    ? 'bg-emerald-500 text-white border-emerald-500' 
                                    : 'bg-white/5 border-white/10 text-steelGrey hover:border-brightBlue group-hover:bg-brightBlue/10'
                                }`}
                              >
                                  {item.status === 'Complete' ? <Check size={24} /> : <Activity size={20} />}
                              </button>
                              <div>
                                  <h4 className={`text-sm font-bold text-white mb-1 ${item.status === 'Complete' ? 'opacity-40 line-through' : ''}`}>{item.requirement}</h4>
                                  <div className="flex items-center gap-4">
                                      <span className="text-[10px] font-black text-steelGrey uppercase tracking-widest">{item.assignedTo}</span>
                                      <span className={`text-[9px] font-black uppercase tracking-widest flex items-center ${
                                          item.priority === 'High' ? 'text-riskHigh' : 'text-steelGrey'
                                      }`}>
                                          <AlertTriangle size={10} className="mr-1" /> {item.priority}
                                      </span>
                                  </div>
                              </div>
                          </div>
                          <div className="text-right">
                              <div className="text-[10px] text-steelGrey font-black uppercase tracking-widest mb-1">Evidence Required</div>
                              <div className="flex justify-end gap-1">
                                  <div className={`w-2 h-2 rounded-full ${item.evidenceFiles?.length ? 'bg-emerald-500' : 'bg-white/10'}`}></div>
                                  <div className="w-2 h-2 rounded-full bg-white/10"></div>
                                  <div className="w-2 h-2 rounded-full bg-white/10"></div>
                              </div>
                          </div>
                      </div>
                  ))}
              </div>
          </div>
      </div>

      {/* MODAL & EVIDENCE UPLOAD SIM */}
      {isModalOpen && editingItem && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
              <div className="bg-[#080C14] border border-white/10 rounded-[40px] w-full max-w-3xl max-h-[90vh] overflow-hidden shadow-2xl flex flex-col">
                  <div className="p-10 border-b border-white/5 flex justify-between items-start bg-obsidianNavy">
                      <div>
                          <div className="flex items-center gap-3 mb-4">
                              <span className="text-[10px] font-black text-brightBlue bg-brightBlue/10 px-3 py-1 rounded-full border border-brightBlue/20 uppercase tracking-widest">{editingItem.id}</span>
                              <span className="text-[10px] font-black text-steelGrey uppercase tracking-widest">{editingItem.category}</span>
                          </div>
                          <h3 className="text-3xl font-black text-white tracking-tighter uppercase">Execution Details</h3>
                      </div>
                      <button onClick={() => setIsModalOpen(false)} className="bg-white/5 hover:bg-riskHigh/10 text-steelGrey hover:text-riskHigh p-3 rounded-2xl transition-all"><X size={24} /></button>
                  </div>
                  
                  <div className="p-10 overflow-y-auto space-y-10 flex-1 custom-scrollbar">
                      <div>
                          <label className="text-[10px] font-black text-steelGrey uppercase tracking-[0.4em] block mb-4">Requirement</label>
                          <input 
                            type="text" 
                            value={editingItem.requirement} 
                            onChange={(e) => setEditingItem({...editingItem, requirement: e.target.value})}
                            className="w-full bg-techBlack border border-white/5 rounded-2xl p-4 text-sm font-bold text-white focus:border-brightBlue outline-none"
                          />
                      </div>

                      <div className="grid grid-cols-2 gap-8">
                          <div>
                              <label className="text-[10px] font-black text-steelGrey uppercase tracking-[0.4em] block mb-4">Assigned To</label>
                              <input 
                                type="text" 
                                value={editingItem.assignedTo} 
                                onChange={(e) => setEditingItem({...editingItem, assignedTo: e.target.value})}
                                className="w-full bg-techBlack border border-white/5 rounded-2xl p-4 text-sm text-white focus:border-brightBlue outline-none"
                              />
                          </div>
                          <div>
                              <label className="text-[10px] font-black text-steelGrey uppercase tracking-[0.4em] block mb-4">Deadline</label>
                              <input 
                                type="date" 
                                value={editingItem.dueDate} 
                                onChange={(e) => setEditingItem({...editingItem, dueDate: e.target.value})}
                                className="w-full bg-techBlack border border-white/5 rounded-2xl p-4 text-sm text-white focus:border-brightBlue outline-none"
                              />
                          </div>
                      </div>

                      <div className="bg-techBlack border border-white/5 rounded-3xl p-8 space-y-6">
                          <label className="text-[10px] font-black text-brightBlue uppercase tracking-[0.4em] flex items-center">
                              <DbIcon size={14} className="mr-2" /> Evidence Repository
                          </label>
                          <textarea 
                            value={editingItem.evidenceNotes} 
                            onChange={(e) => setEditingItem({...editingItem, evidenceNotes: e.target.value})}
                            placeholder="Add narrative or link to internal documentation server..."
                            className="w-full h-32 bg-obsidianNavy border border-white/5 rounded-2xl p-4 text-xs font-medium text-white focus:border-brightBlue outline-none resize-none"
                          />
                          <div className="border-2 border-dashed border-white/5 rounded-2xl p-10 text-center hover:border-brightBlue hover:bg-brightBlue/5 transition-all cursor-pointer group">
                              <Upload size={32} className="mx-auto mb-4 text-steelGrey opacity-40 group-hover:text-brightBlue group-hover:opacity-100 transition-all" />
                              <p className="text-[10px] font-black text-steelGrey uppercase tracking-widest group-hover:text-white transition-all">Click to bind evidence artifact</p>
                          </div>
                      </div>
                  </div>

                  <div className="p-10 border-t border-white/5 bg-obsidianNavy flex justify-end gap-6">
                      <button onClick={() => setIsModalOpen(false)} className="text-[10px] font-black text-steelGrey uppercase tracking-[0.4em] hover:text-white">Discard</button>
                      <button 
                        onClick={handleSaveTask}
                        className="bg-brightBlue hover:bg-blue-600 text-white px-12 py-4 rounded-2xl font-black text-[10px] uppercase tracking-[0.4em] shadow-xl"
                      >
                          Commit Changes
                      </button>
                  </div>
              </div>
          </div>
      )}
    </div>
  );
};

export default ChecklistMode;
