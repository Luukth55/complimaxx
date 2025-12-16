
import React, { useState, useEffect } from 'react';
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
  MessageSquare
} from 'lucide-react';
import { AuditPackage, ChecklistItem, ChecklistFile } from '../types';

interface ChecklistModeProps {
  data: AuditPackage | null;
  navigate: (route: any) => void;
  onUpdate?: (items: ChecklistItem[]) => void;
}

// Categories for grouping
const CATEGORIES = ['All', 'Audit Prep', 'Control', 'Evidence', 'Gap Remediation', 'Renewal'];

const ChecklistMode: React.FC<ChecklistModeProps> = ({ data, navigate, onUpdate }) => {
  const [items, setItems] = useState<ChecklistItem[]>([]);
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<ChecklistItem | null>(null);
  
  // Drag and Drop State
  const [isDragging, setIsDragging] = useState(false);
  
  // File Input Ref
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  
  // Renewal Logic State
  const [daysUntilAudit, setDaysUntilAudit] = useState(0);

  useEffect(() => {
    // Determine days until audit: Priority 1: Configured Data, Priority 2: Estimation
    if (data && data.audit_meta && data.audit_meta.next_audit_date) {
        const nextDate = new Date(data.audit_meta.next_audit_date);
        const today = new Date();
        const diffTime = nextDate.getTime() - today.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        setDaysUntilAudit(diffDays);
    } else {
        // Fallback
        const today = new Date();
        const nextAudit = new Date(today.setMonth(today.getMonth() + 6));
        const diffTime = Math.abs(nextAudit.getTime() - new Date().getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        setDaysUntilAudit(diffDays);
    }

    if (data) {
      if (data.checklist && data.checklist.length > 0) {
        setItems(data.checklist);
      } else {
        // INTELLIGENT INITIALIZATION FROM GENERATED DATA
        const newItems: ChecklistItem[] = [];

        // 1. Controls -> Control Tasks
        data.controls.forEach((c, i) => {
            newItems.push({
                id: `TSK-${100 + i}`,
                requirement: `Verify Control: ${c.title}`,
                description: c.description,
                status: 'Not Started',
                assignedTo: c.owner || 'Unassigned',
                dueDate: '2024-12-31',
                framework: c.framework_mapping[0]?.framework || 'General',
                category: 'Control',
                priority: 'High',
                recurrence: c.frequency as any || 'Monthly',
                evidenceFiles: [],
                evidenceNotes: '',
                linkedControl: c.id,
                linkedRisk: ''
            });
        });

        // 2. Evidence -> Evidence Tasks
        data.evidence_checklist.forEach((e, i) => {
            newItems.push({
                id: `EVD-${200 + i}`,
                requirement: `Upload Evidence: ${e.title}`,
                description: e.instructions,
                status: 'Not Started',
                assignedTo: 'Process Owner',
                dueDate: '2024-11-30',
                framework: 'General',
                category: 'Evidence',
                priority: e.mandatory ? 'High' : 'Medium',
                recurrence: 'Quarterly',
                evidenceFiles: [],
                evidenceNotes: '',
                linkedControl: e.linked_control,
                linkedRisk: ''
            });
        });

        // 3. Gaps -> Remediation Tasks
        if (data.gaps) {
            data.gaps.forEach((g, i) => {
                newItems.push({
                    id: `GAP-${300 + i}`,
                    requirement: `Remediate: ${g.description}`,
                    description: `Address gap linked to ${g.linkedControl}`,
                    status: g.status === 'Done' ? 'Complete' : 'Not Started',
                    assignedTo: g.owner,
                    dueDate: g.dueDate,
                    framework: 'General',
                    category: 'Gap Remediation',
                    priority: g.priority,
                    recurrence: 'One-time',
                    evidenceFiles: [],
                    evidenceNotes: '',
                    linkedControl: g.linkedControl,
                    linkedRisk: g.linkedRisk
                });
            });
        }
        
        // 4. Add Renewal/Audit Prep Tasks
        newItems.unshift({
            id: 'ADM-001',
            requirement: 'Confirm Scope for Upcoming Audit',
            description: 'Verify that all assets and processes are currently in scope.',
            status: 'In Progress',
            assignedTo: 'CISO',
            dueDate: '2024-10-15',
            framework: 'ISO 27001',
            category: 'Audit Prep',
            priority: 'High',
            recurrence: 'Yearly',
            evidenceFiles: [],
            evidenceNotes: '',
            linkedControl: '',
            linkedRisk: ''
        });

        setItems(newItems);
        // Important: Update parent state so moving away and back preserves these
        if (onUpdate) onUpdate(newItems);
      }
    }
  }, [data]);

  // CRUD OPERATIONS
  const handleAddItem = () => {
    const newItem: ChecklistItem = {
        id: `MAN-${Date.now().toString().slice(-4)}`,
        requirement: 'New Task',
        description: '',
        status: 'Not Started',
        assignedTo: 'Unassigned',
        dueDate: new Date().toISOString().split('T')[0],
        framework: 'General',
        category: 'Audit Prep',
        priority: 'Medium',
        recurrence: 'One-time',
        evidenceFiles: [],
        evidenceNotes: '',
        linkedControl: '',
        linkedRisk: ''
    };
    setEditingItem(newItem);
    setIsModalOpen(true);
  };

  const handleDeleteItem = (id: string) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
        const updated = items.filter(i => i.id !== id);
        setItems(updated);
        if (onUpdate) onUpdate(updated);
        setIsModalOpen(false);
    }
  };

  const handleSaveItem = (item: ChecklistItem) => {
    let updatedItems;
    if (items.find(i => i.id === item.id)) {
        updatedItems = items.map(i => i.id === item.id ? item : i);
    } else {
        updatedItems = [item, ...items];
    }
    setItems(updatedItems);
    if (onUpdate) onUpdate(updatedItems);
    setIsModalOpen(false);
  };

  const handleStatusToggle = (id: string) => {
     const updatedItems = items.map(i => {
         if (i.id === id) {
             const next = i.status === 'Not Started' ? 'In Progress' : i.status === 'In Progress' ? 'Complete' : 'Not Started';
             return { ...i, status: next as any };
         }
         return i;
     });
     setItems(updatedItems);
     if (onUpdate) onUpdate(updatedItems);
  };

  // Drag and Drop Handlers
  const handleDragOver = (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);

      if (e.dataTransfer.files && e.dataTransfer.files.length > 0 && editingItem) {
          const droppedFiles = Array.from(e.dataTransfer.files).map((file: File) => ({
              name: file.name,
              date: new Date().toISOString().split('T')[0],
              size: file.size > 1024 * 1024 
                    ? (file.size / (1024 * 1024)).toFixed(2) + ' MB' 
                    : (file.size / 1024).toFixed(0) + ' KB',
              type: file.type || 'application/octet-stream'
          }));

          setEditingItem({
              ...editingItem,
              evidenceFiles: [...(editingItem.evidenceFiles || []), ...droppedFiles]
          });
      }
  };

  // File Select Handler
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files.length > 0 && editingItem) {
          const selectedFiles = Array.from(e.target.files).map((file: File) => ({
              name: file.name,
              date: new Date().toISOString().split('T')[0],
              size: file.size > 1024 * 1024 
                  ? (file.size / (1024 * 1024)).toFixed(2) + ' MB' 
                  : (file.size / 1024).toFixed(0) + ' KB',
              type: file.type || 'application/octet-stream'
          }));

          setEditingItem({
              ...editingItem,
              evidenceFiles: [...(editingItem.evidenceFiles || []), ...selectedFiles]
          });
          
          // Reset input
          if (fileInputRef.current) {
              fileInputRef.current.value = '';
          }
      }
  };

  const loadDemoData = () => {
      const demoItems: ChecklistItem[] = [
          { id: 'D01', requirement: 'Review Access Control Logs', description: 'Check admin logs for anomalies.', status: 'Complete', assignedTo: 'Security Ops', dueDate: '2024-05-01', framework: 'ISO 27001', category: 'Control', priority: 'High', recurrence: 'Monthly', evidenceFiles: [] },
          { id: 'D02', requirement: 'Upload Penetration Test Report', description: 'Annual external pen test report PDF.', status: 'In Progress', assignedTo: 'CISO', dueDate: '2024-06-15', framework: 'SOC 2', category: 'Evidence', priority: 'High', recurrence: 'Yearly', evidenceFiles: [] },
          { id: 'D03', requirement: 'Fix Vulnerability in HR Portal', description: 'Patch CVE-2024-1234.', status: 'Not Started', assignedTo: 'DevOps', dueDate: '2024-05-10', framework: 'GDPR', category: 'Gap Remediation', priority: 'High', recurrence: 'One-time', evidenceFiles: [] },
      ];
      setItems(demoItems);
  };

  // FILTERING
  const filteredItems = items.filter(item => {
      const matchesCategory = activeCategory === 'All' || item.category === activeCategory;
      const matchesSearch = item.requirement.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            item.assignedTo.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
  });

  const getPriorityColor = (p: string) => {
      switch(p) {
          case 'High': return 'text-riskHigh';
          case 'Medium': return 'text-riskMedium';
          default: return 'text-riskLow';
      }
  };

  const renderStatusBadge = (status: string) => {
      switch(status) {
          case 'Complete': 
              return (
                  <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-riskLow/10 text-riskLow border border-riskLow/20">
                      <CheckCircle size={12} className="mr-1.5" /> Complete
                  </span>
              );
          case 'In Progress': 
              return (
                  <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-brightBlue/10 text-brightBlue border border-brightBlue/20">
                      <Loader2 size={12} className="mr-1.5 animate-spin" /> In Progress
                  </span>
              );
          case 'Review': 
              return (
                  <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-purple-500/10 text-purple-500 border border-purple-500/20">
                      <Eye size={12} className="mr-1.5" /> Review
                  </span>
              );
          default: 
              return (
                  <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-deepDivider/50 text-steelGrey border border-deepDivider">
                      <Clock size={12} className="mr-1.5" /> Not Started
                  </span>
              );
      }
  };

  // EMPTY STATE
  if (!data && items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] text-center bg-obsidianNavy/30 rounded-xl border border-deepDivider border-dashed">
        <div className="p-6 bg-obsidianNavy rounded-full mb-4">
          <Check size={48} className="text-steelGrey" />
        </div>
        <h2 className="text-2xl font-bold text-white mb-2">No Active Checklist</h2>
        <p className="text-steelGrey mb-6 max-w-md">Generate an audit package to populate your compliance checklist, or load demo data to explore.</p>
        <div className="flex gap-4">
            <button 
                onClick={() => navigate('project_wizard')}
                className="bg-brightBlue hover:bg-blue-600 text-white px-6 py-2 rounded-lg font-medium transition-colors"
            >
                Go to Generator
            </button>
            <button 
                onClick={loadDemoData}
                className="border border-deepDivider hover:bg-white/5 text-white px-6 py-2 rounded-lg font-medium transition-colors"
            >
                Load Demo Data
            </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fadeIn h-full flex flex-col">
      {/* 1. RENEWAL WIDGET HEADER */}
      <div className="bg-gradient-to-r from-obsidianNavy to-[#0a1120] border border-deepDivider rounded-xl p-8 relative overflow-hidden flex flex-col lg:flex-row justify-between items-center gap-8">
         <div className="absolute right-0 top-0 h-full w-1/3 bg-brightBlue/5 skew-x-12 transform origin-bottom-right"></div>
         
         <div className="relative z-10 flex flex-col sm:flex-row items-center sm:space-x-8 space-y-4 sm:space-y-0 w-full lg:w-auto">
             <div className="text-center min-w-[140px]">
                 <div className="text-5xl font-bold text-white tracking-tight leading-none mb-2">{daysUntilAudit}</div>
                 <div className="text-xs text-steelGrey uppercase tracking-widest font-semibold">Days Until Audit</div>
             </div>
             <div className="hidden sm:block h-16 w-px bg-deepDivider"></div>
             <div className="text-center sm:text-left">
                 <h2 className="text-2xl font-bold text-white flex items-center justify-center sm:justify-start mb-2">
                    <RefreshCw size={24} className="mr-3 text-brightBlue animate-spin-slow" /> 
                    Audit Prep Center
                 </h2>
                 <p className="text-steelGrey text-sm">
                    {data ? (
                        <span className="flex items-center justify-center sm:justify-start gap-2"><Briefcase size={14}/> Active Project: <span className="text-white font-medium">{data.process_flow[0]?.title}</span></span>
                    ) : (
                        "Next Cycle: ISO 27001 Surveillance (Estimated)"
                    )}
                 </p>
             </div>
         </div>

         <div className="relative z-10 flex flex-col sm:flex-row items-center gap-6 w-full lg:w-auto justify-end">
             <div className="flex flex-col items-center sm:items-end w-full sm:w-auto">
                <div className="flex items-center text-sm text-steelGrey mb-2">
                    <span className="mr-3">Overall Completion</span>
                    <span className="text-white font-bold text-lg">{Math.round((items.filter(i => i.status === 'Complete').length / Math.max(items.length, 1)) * 100)}%</span>
                </div>
                <div className="w-full sm:w-56 bg-deepDivider h-3 rounded-full overflow-hidden">
                    <div className="bg-riskLow h-full transition-all duration-500" style={{ width: `${(items.filter(i => i.status === 'Complete').length / Math.max(items.length, 1)) * 100}%` }}></div>
                </div>
             </div>
             <button 
                onClick={handleAddItem}
                className="w-full sm:w-auto bg-brightBlue hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-bold flex items-center justify-center shadow-lg shadow-brightBlue/20 transition-all whitespace-nowrap"
             >
                 <Plus size={20} className="mr-2" /> Add Task
             </button>
         </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6 h-full min-h-[500px]">
          {/* 2. SIDEBAR FILTERS */}
          <div className="lg:w-64 flex-shrink-0 space-y-4">
             <div className="bg-obsidianNavy border border-deepDivider rounded-xl p-4">
                 <h3 className="font-bold text-white mb-4 flex items-center"><Filter size={16} className="mr-2 text-brightBlue" /> Categories</h3>
                 <div className="space-y-1">
                     {CATEGORIES.map(cat => (
                         <button
                            key={cat}
                            onClick={() => setActiveCategory(cat)}
                            className={`w-full text-left px-3 py-2.5 rounded-lg text-sm transition-all flex justify-between items-center ${
                                activeCategory === cat 
                                ? 'bg-brightBlue/20 text-white border border-brightBlue/30 font-medium' 
                                : 'text-steelGrey hover:bg-white/5 hover:text-white'
                            }`}
                         >
                             {cat}
                             <span className="text-xs bg-black/20 px-2 py-0.5 rounded-full text-white/50">
                                 {cat === 'All' ? items.length : items.filter(i => i.category === cat).length}
                             </span>
                         </button>
                     ))}
                 </div>
             </div>

             <div className="bg-obsidianNavy border border-deepDivider rounded-xl p-4">
                 <h3 className="font-bold text-white mb-4 text-xs uppercase tracking-widest text-steelGrey">By Framework</h3>
                 <div className="space-y-2">
                     {Array.from(new Set(items.map(i => i.framework))).slice(0, 5).map(fw => (
                         <div key={fw} className="flex items-center text-sm text-steelGrey">
                             <div className="w-2 h-2 rounded-full bg-deepDivider mr-2"></div>
                             {fw}
                         </div>
                     ))}
                 </div>
             </div>
          </div>

          {/* 3. TASK LIST */}
          <div className="flex-1 bg-obsidianNavy border border-deepDivider rounded-xl overflow-hidden flex flex-col">
              {/* Toolbar */}
              <div className="p-4 border-b border-deepDivider bg-[#080C14] flex justify-between items-center">
                  <div className="relative w-64">
                      <input 
                        type="text" 
                        placeholder="Search tasks..."
                        className="w-full bg-obsidianNavy border border-deepDivider rounded-lg pl-9 pr-4 py-2 text-sm text-white focus:outline-none focus:border-brightBlue"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                      />
                      <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-steelGrey" />
                  </div>
                  <div className="flex items-center space-x-2">
                      <button className="p-2 text-steelGrey hover:text-white hover:bg-white/5 rounded"><Download size={18} /></button>
                      <button className="p-2 text-steelGrey hover:text-white hover:bg-white/5 rounded"><Filter size={18} /></button>
                  </div>
              </div>

              {/* List */}
              <div className="flex-1 overflow-y-auto custom-scrollbar">
                  <table className="w-full text-left border-collapse">
                      <thead className="bg-obsidianNavy sticky top-0 z-10 shadow-sm">
                          <tr>
                              <th className="p-4 text-xs font-bold text-steelGrey uppercase tracking-wider w-12"></th>
                              <th className="p-4 text-xs font-bold text-steelGrey uppercase tracking-wider">Task / Requirement</th>
                              <th className="p-4 text-xs font-bold text-steelGrey uppercase tracking-wider w-32">Status</th>
                              <th className="p-4 text-xs font-bold text-steelGrey uppercase tracking-wider w-32">Owner</th>
                              <th className="p-4 text-xs font-bold text-steelGrey uppercase tracking-wider w-32">Evidence</th>
                              <th className="p-4 text-xs font-bold text-steelGrey uppercase tracking-wider w-24">Priority</th>
                              <th className="p-4 text-xs font-bold text-steelGrey uppercase tracking-wider w-16"></th>
                          </tr>
                      </thead>
                      <tbody className="divide-y divide-deepDivider/50">
                          {filteredItems.map(item => (
                              <tr 
                                key={item.id} 
                                className="hover:bg-white/5 transition-colors cursor-pointer group"
                                onClick={() => { setEditingItem(item); setIsModalOpen(true); }}
                              >
                                  <td className="p-4 text-center" onClick={(e) => e.stopPropagation()}>
                                      <div 
                                        onClick={() => handleStatusToggle(item.id)}
                                        className={`w-5 h-5 rounded border flex items-center justify-center cursor-pointer transition-all ${
                                            item.status === 'Complete' 
                                            ? 'bg-riskLow border-riskLow' 
                                            : 'border-steelGrey hover:border-brightBlue'
                                        }`}
                                      >
                                          {item.status === 'Complete' && <Check size={12} className="text-white" />}
                                      </div>
                                  </td>
                                  <td className="p-4">
                                      <div className={`font-medium mb-1 transition-all ${item.status === 'Complete' ? 'text-steelGrey line-through decoration-deepDivider' : 'text-white'}`}>
                                          {item.requirement}
                                      </div>
                                      <div className="flex items-center text-xs text-steelGrey space-x-3">
                                          <span className="flex items-center"><Calendar size={10} className="mr-1"/> {item.dueDate}</span>
                                          <span className="bg-deepDivider px-1.5 py-0.5 rounded text-[10px] uppercase">{item.category}</span>
                                          <span className="flex items-center"><RefreshCw size={10} className="mr-1"/> {item.recurrence}</span>
                                      </div>
                                  </td>
                                  <td className="p-4">
                                      {renderStatusBadge(item.status)}
                                  </td>
                                  <td className="p-4">
                                      <div className="flex items-center text-sm text-steelGrey">
                                          <div className="w-6 h-6 rounded-full bg-deepDivider flex items-center justify-center text-[10px] text-white font-bold mr-2 border border-white/10">
                                              {item.assignedTo.charAt(0)}
                                          </div>
                                          {item.assignedTo.split(' ')[0]}
                                      </div>
                                  </td>
                                  <td className="p-4 text-center">
                                      {item.evidenceFiles && item.evidenceFiles.length > 0 ? (
                                          <div className="inline-flex items-center px-2 py-1 bg-brightBlue/10 text-brightBlue text-xs rounded border border-brightBlue/20">
                                              <Paperclip size={10} className="mr-1" /> {item.evidenceFiles.length}
                                          </div>
                                      ) : (
                                          <span className="text-steelGrey text-xs opacity-30">-</span>
                                      )}
                                  </td>
                                  <td className="p-4">
                                      <div className={`flex items-center text-xs font-bold ${getPriorityColor(item.priority)}`}>
                                          <AlertTriangle size={10} className="mr-1" /> {item.priority}
                                      </div>
                                  </td>
                                  <td className="p-4 text-right">
                                      <button className="text-steelGrey hover:text-brightBlue opacity-0 group-hover:opacity-100 transition-opacity">
                                          <Edit3 size={16} />
                                      </button>
                                  </td>
                              </tr>
                          ))}
                      </tbody>
                  </table>
                  {filteredItems.length === 0 && (
                      <div className="p-12 text-center text-steelGrey">
                          No tasks found matching your filters.
                      </div>
                  )}
              </div>
          </div>
      </div>

      {/* 4. EDIT/DETAIL MODAL */}
      {isModalOpen && editingItem && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
              <div className="bg-[#080C14] border border-deepDivider rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl animate-fadeIn">
                  {/* Modal Header */}
                  <div className="p-6 border-b border-deepDivider flex justify-between items-start sticky top-0 bg-[#080C14] z-10">
                      <div>
                          <div className="flex items-center space-x-2 text-xs text-steelGrey uppercase tracking-wider mb-2">
                              <span>{editingItem.id}</span>
                              <span>•</span>
                              <span>{editingItem.framework}</span>
                          </div>
                          <input 
                            type="text" 
                            value={editingItem.requirement}
                            onChange={(e) => setEditingItem({...editingItem, requirement: e.target.value})}
                            className="text-2xl font-bold text-white bg-transparent border-none p-0 focus:ring-0 w-full"
                          />
                      </div>
                      <button onClick={() => setIsModalOpen(false)} className="text-steelGrey hover:text-white p-2">
                          <X size={24} />
                      </button>
                  </div>

                  {/* Modal Body */}
                  <div className="p-6 space-y-8">
                      
                      {/* Grid Properties */}
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          <div>
                              <label className="block text-xs font-bold text-steelGrey mb-1">Status</label>
                              <select 
                                value={editingItem.status}
                                onChange={(e) => setEditingItem({...editingItem, status: e.target.value as any})}
                                className="w-full bg-obsidianNavy border border-deepDivider rounded px-2 py-1.5 text-sm text-white focus:border-brightBlue"
                              >
                                  <option>Not Started</option>
                                  <option>In Progress</option>
                                  <option>Review</option>
                                  <option>Complete</option>
                              </select>
                          </div>
                          <div>
                              <label className="block text-xs font-bold text-steelGrey mb-1">Assigned To</label>
                              <input 
                                type="text" 
                                value={editingItem.assignedTo}
                                onChange={(e) => setEditingItem({...editingItem, assignedTo: e.target.value})}
                                className="w-full bg-obsidianNavy border border-deepDivider rounded px-2 py-1.5 text-sm text-white focus:border-brightBlue"
                              />
                          </div>
                          <div>
                              <label className="block text-xs font-bold text-steelGrey mb-1">Due Date</label>
                              <input 
                                type="date" 
                                value={editingItem.dueDate}
                                onChange={(e) => setEditingItem({...editingItem, dueDate: e.target.value})}
                                className="w-full bg-obsidianNavy border border-deepDivider rounded px-2 py-1.5 text-sm text-white focus:border-brightBlue"
                              />
                          </div>
                          <div>
                              <label className="block text-xs font-bold text-steelGrey mb-1">Priority</label>
                              <select 
                                value={editingItem.priority}
                                onChange={(e) => setEditingItem({...editingItem, priority: e.target.value as any})}
                                className="w-full bg-obsidianNavy border border-deepDivider rounded px-2 py-1.5 text-sm text-white focus:border-brightBlue"
                              >
                                  <option>High</option>
                                  <option>Medium</option>
                                  <option>Low</option>
                              </select>
                          </div>
                      </div>

                       {/* Reference / Meta Properties */}
                       <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-obsidianNavy/30 p-3 rounded-lg border border-deepDivider/50">
                          <div>
                              <label className="block text-xs font-bold text-steelGrey mb-1">Framework</label>
                              <input 
                                type="text" 
                                value={editingItem.framework}
                                onChange={(e) => setEditingItem({...editingItem, framework: e.target.value})}
                                className="w-full bg-obsidianNavy border border-deepDivider rounded px-2 py-1.5 text-sm text-white focus:border-brightBlue"
                              />
                          </div>
                          <div>
                              <label className="block text-xs font-bold text-steelGrey mb-1 flex items-center">
                                  <Shield size={10} className="mr-1"/> Linked Control
                              </label>
                              <input 
                                type="text" 
                                value={editingItem.linkedControl || ''}
                                onChange={(e) => setEditingItem({...editingItem, linkedControl: e.target.value})}
                                className="w-full bg-obsidianNavy border border-deepDivider rounded px-2 py-1.5 text-sm text-white focus:border-brightBlue placeholder-steelGrey/30"
                                placeholder="e.g. C05"
                              />
                          </div>
                          <div>
                              <label className="block text-xs font-bold text-steelGrey mb-1 flex items-center">
                                  <AlertTriangle size={10} className="mr-1"/> Linked Risk
                              </label>
                              <input 
                                type="text" 
                                value={editingItem.linkedRisk || ''}
                                onChange={(e) => setEditingItem({...editingItem, linkedRisk: e.target.value})}
                                className="w-full bg-obsidianNavy border border-deepDivider rounded px-2 py-1.5 text-sm text-white focus:border-brightBlue placeholder-steelGrey/30"
                                placeholder="e.g. R01"
                              />
                          </div>
                      </div>

                      {/* Description */}
                      <div>
                          <label className="block text-sm font-bold text-white mb-2 flex items-center">
                              <FileText size={16} className="mr-2 text-brightBlue"/> Description & Instructions
                          </label>
                          <textarea 
                             value={editingItem.description}
                             onChange={(e) => setEditingItem({...editingItem, description: e.target.value})}
                             className="w-full h-24 bg-obsidianNavy border border-deepDivider rounded-lg p-3 text-sm text-steelGrey focus:text-white focus:border-brightBlue focus:outline-none"
                             placeholder="Add details about what needs to be done..."
                          />
                      </div>

                      {/* EVIDENCE SECTION - THE KEY REQUEST */}
                      <div className="bg-obsidianNavy/50 border border-deepDivider rounded-xl p-5">
                          <label className="block text-sm font-bold text-white mb-4 flex items-center">
                              <Upload size={16} className="mr-2 text-emerald-500"/> Proof of Compliance / Evidence
                          </label>
                          
                          {/* Notes */}
                          <div className="mb-4">
                              <label className="block text-xs font-bold text-steelGrey mb-2 flex items-center">
                                  <MessageSquare size={14} className="mr-2"/> Notes / Observations
                              </label>
                              <textarea 
                                value={editingItem.evidenceNotes || ''}
                                onChange={(e) => setEditingItem({...editingItem, evidenceNotes: e.target.value})}
                                className="w-full h-24 bg-[#080C14] border border-deepDivider rounded-lg p-3 text-sm text-white focus:border-brightBlue focus:outline-none resize-none"
                                placeholder="Add context about the uploaded evidence, external links, or specific observations..."
                              />
                          </div>

                          {/* Existing Files */}
                          {editingItem.evidenceFiles && editingItem.evidenceFiles.length > 0 && (
                              <div className="space-y-2 mb-4">
                                  {editingItem.evidenceFiles.map((file, idx) => (
                                      <div key={idx} className="flex items-center justify-between bg-[#080C14] border border-deepDivider rounded p-2 text-sm group">
                                          <div className="flex items-center text-white overflow-hidden">
                                              <FileText size={14} className="mr-2 text-brightBlue flex-shrink-0" />
                                              <span className="truncate mr-2 font-medium">{file.name}</span>
                                              <span className="text-[10px] text-steelGrey uppercase bg-deepDivider/50 px-1 rounded flex-shrink-0">
                                                  {file.type.split('/')[1] || 'FILE'}
                                              </span>
                                          </div>
                                          <div className="flex items-center text-steelGrey text-xs flex-shrink-0 ml-2">
                                              <span className="mr-3">{file.size}</span>
                                              <button 
                                                onClick={() => {
                                                    const newFiles = [...(editingItem.evidenceFiles || [])];
                                                    newFiles.splice(idx, 1);
                                                    setEditingItem({...editingItem, evidenceFiles: newFiles});
                                                }}
                                                className="hover:text-riskHigh"
                                              >
                                                  <X size={14} />
                                              </button>
                                          </div>
                                      </div>
                                  ))}
                              </div>
                          )}

                          {/* Upload Area */}
                          <input 
                              type="file" 
                              ref={fileInputRef} 
                              onChange={handleFileSelect} 
                              className="hidden" 
                              multiple 
                          />
                          <div 
                               onDragOver={handleDragOver}
                               onDragLeave={handleDragLeave}
                               onDrop={handleDrop}
                               className={`border-2 border-dashed rounded-lg p-6 text-center transition-all cursor-pointer group ${
                                   isDragging 
                                   ? 'border-brightBlue bg-brightBlue/10' 
                                   : 'border-deepDivider hover:border-brightBlue/50 hover:bg-brightBlue/5'
                               }`}
                               onClick={() => fileInputRef.current?.click()}
                          >
                              <div className={`w-10 h-10 rounded-full flex items-center justify-center mx-auto mb-2 transition-colors transform group-hover:scale-110 ${
                                  isDragging ? 'bg-brightBlue/20 text-brightBlue' : 'bg-deepDivider text-steelGrey group-hover:bg-brightBlue/20 group-hover:text-brightBlue'
                              }`}>
                                  <Upload size={18} />
                              </div>
                              <p className="text-sm text-white font-medium">
                                  {isDragging ? "Drop files here to upload" : "Click or Drag to upload evidence"}
                              </p>
                              <p className="text-xs text-steelGrey mt-1">Supports multiple files. PDF, PNG, DOCX (Max 10MB)</p>
                          </div>
                      </div>

                  </div>

                  {/* Footer Actions */}
                  <div className="p-6 border-t border-deepDivider bg-obsidianNavy flex justify-between items-center sticky bottom-0">
                      <button 
                        onClick={() => handleDeleteItem(editingItem.id)}
                        className="text-riskHigh hover:bg-riskHigh/10 px-4 py-2 rounded-lg text-sm font-medium flex items-center transition-colors"
                      >
                          <Trash2 size={16} className="mr-2" /> Delete Task
                      </button>
                      <div className="flex space-x-3">
                          <button 
                            onClick={() => setIsModalOpen(false)}
                            className="text-steelGrey hover:text-white px-4 py-2 text-sm font-medium"
                          >
                              Cancel
                          </button>
                          <button 
                            onClick={() => handleSaveItem(editingItem)}
                            className="bg-brightBlue hover:bg-blue-600 text-white px-6 py-2 rounded-lg text-sm font-bold flex items-center shadow-lg shadow-brightBlue/20"
                          >
                              <Save size={16} className="mr-2" /> Save Changes
                          </button>
                      </div>
                  </div>
              </div>
          </div>
      )}
    </div>
  );
};

export default ChecklistMode;
