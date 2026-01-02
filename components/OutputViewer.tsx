
import React, { useState, useEffect } from 'react';
import { 
  GitCommit, 
  Users, 
  ShieldAlert, 
  Shield,
  Target, 
  Key, 
  ClipboardCheck, 
  FileCheck, 
  PieChart,
  BookOpen,
  Download,
  CheckCircle,
  FileText,
  Save,
  ArrowLeft,
  Clock,
  ArrowRight,
  Folder,
  Check,
  Plus,
  Trash2,
  X,
  Pencil,
  Loader2,
  FileType,
  AlertCircle,
  AlertTriangle,
  LayoutGrid
} from 'lucide-react';
import { ResponsiveContainer, PieChart as RechartsPie, Pie, Cell } from 'recharts';
import { AuditPackage, AppRoute } from '../types';

interface OutputViewerProps {
  data: AuditPackage | null;
  savedProjects?: AuditPackage[];
  onSave?: (data: AuditPackage) => Promise<void>;
  onDelete?: (id: string) => Promise<void>;
  onBack?: () => void;
  onSelectProject?: (data: AuditPackage) => void;
  onNavigateToChecklist?: () => void;
  navigate?: (route: AppRoute, preserveData?: boolean) => void;
}

type TabType = 'flow' | 'raci' | 'risks' | 'objectives' | 'keycontrols' | 'tests' | 'evidence' | 'score' | 'mapping';

const OutputViewer: React.FC<OutputViewerProps> = ({ 
    data, 
    savedProjects = [], 
    onSave, 
    onDelete,
    onBack, 
    onSelectProject,
    onNavigateToChecklist,
    navigate
}) => {
  const [activeTab, setActiveTab] = useState<TabType>('score');
  const [isSaving, setIsSaving] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [localData, setLocalData] = useState<AuditPackage | null>(data);
  const [showExportMenu, setShowExportMenu] = useState(false);
  
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [titleDraft, setTitleDraft] = useState("");

  useEffect(() => {
    setLocalData(data);
    if (data) {
        setTitleDraft(data.project_title || data.process_flow[0]?.title || 'Audit Project');
    }
  }, [data]);

  const handleSave = async () => {
    if (localData && onSave) {
        setIsSaving(true);
        const finalData = { ...localData, project_title: titleDraft };
        try {
            await onSave(finalData);
            setIsSaving(false);
            setIsSaved(true);
            setTimeout(() => setIsSaved(false), 2000);
        } catch (error) {
            console.error("Save failed", error);
            setIsSaving(false);
        }
    }
  };

  const handleExport = (type: 'csv' | 'json') => {
      if (!localData) return;
      const fileName = `complimaxx_${localData.project_title || 'export'}_${new Date().toISOString().split('T')[0]}`;

      if (type === 'json') {
          const blob = new Blob([JSON.stringify(localData, null, 2)], { type: "application/json" });
          const url = URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;
          link.download = `${fileName}.json`;
          link.click();
      } else if (type === 'csv') {
          let csv = "RISK REGISTER\nID,Category,Description,Likelihood,Impact\n";
          localData.risks.forEach(r => {
              csv += `${r.id},${r.category},"${r.description.replace(/"/g, '""')}",${r.residual_rating.likelihood},${r.residual_rating.impact}\n`;
          });
          const blob = new Blob([csv], { type: "text/csv" });
          const url = URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;
          link.download = `${fileName}.csv`;
          link.click();
      }
      setShowExportMenu(false);
  };

  const getScoreGrade = (score: number) => {
    if (score >= 90) return { grade: 'A', color: 'text-emerald-500', label: 'Excellent' };
    if (score >= 80) return { grade: 'B', color: 'text-brightBlue', label: 'Good' };
    if (score >= 70) return { grade: 'C', color: 'text-yellow-500', label: 'Acceptable' };
    return { grade: 'F', color: 'text-riskHigh', label: 'Critical' };
  };

  const renderScoreTab = () => {
    if (!localData) return null;
    const scoreData = [
        { name: 'Control Env', value: localData.audit_score.domain_scores.control_environment, color: '#0088FE' },
        { name: 'Risk Mgmt', value: localData.audit_score.domain_scores.risk_management, color: '#00C49F' },
        { name: 'Compliance', value: localData.audit_score.domain_scores.framework_compliance, color: '#FFBB28' },
        { name: 'Evidence', value: localData.audit_score.domain_scores.evidence_quality, color: '#FF8042' },
    ];
    const { grade, color, label } = getScoreGrade(localData.audit_score.total_score);

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fadeIn">
            <div className="lg:col-span-1 bg-obsidianNavy border border-deepDivider rounded-xl p-6 flex flex-col items-center justify-center relative overflow-hidden shadow-xl">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-riskHigh via-yellow-500 to-emerald-500"></div>
                <h3 className="text-lg font-bold text-white mb-6">Audit Readiness Score</h3>
                <div className="relative w-48 h-48 flex items-center justify-center">
                     <ResponsiveContainer width="100%" height="100%">
                        <RechartsPie data={scoreData} innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value" stroke="none">
                          {scoreData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                        </RechartsPie>
                     </ResponsiveContainer>
                     <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                        <span className={`text-4xl font-bold ${color}`}>{localData.audit_score.total_score}</span>
                        <span className="text-xs text-steelGrey uppercase font-bold">{label} ({grade})</span>
                     </div>
                </div>
                <div className="grid grid-cols-2 gap-4 w-full mt-8">
                    {scoreData.map(d => (
                        <div key={d.name} className="text-center">
                            <div className="text-[10px] text-steelGrey uppercase mb-1">{d.name}</div>
                            <div className="text-sm font-bold text-white">{d.value}%</div>
                        </div>
                    ))}
                </div>
            </div>
            <div className="lg:col-span-2 bg-obsidianNavy border border-deepDivider rounded-xl p-6 shadow-xl">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-lg font-bold text-white flex items-center"><Target size={20} className="mr-2 text-brightBlue" /> Strategic Recommendations</h3>
                    <button 
                      onClick={() => navigate && navigate(AppRoute.CHECKLIST)}
                      className="text-[10px] font-black text-brightBlue hover:text-white uppercase tracking-widest bg-brightBlue/10 px-4 py-2 rounded-lg border border-brightBlue/20"
                    >
                      Start Workflow
                    </button>
                </div>
                <div className="space-y-3">
                    {localData.audit_score.recommendations.map((rec, i) => (
                        <div key={i} className="flex items-start bg-black/20 p-4 rounded-lg border border-deepDivider/50 hover:border-brightBlue/30 transition-all">
                            <div className="mt-1 w-6 h-6 rounded-full bg-brightBlue/10 text-brightBlue flex items-center justify-center text-xs font-bold mr-3 border border-brightBlue/20 shrink-0">{i + 1}</div>
                            <p className="text-steelGrey text-sm leading-relaxed">{rec}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
  };

  const renderRaciTab = () => {
    if (!localData || !localData.raci_matrix.length) return null;
    const roles = Object.keys(localData.raci_matrix[0].roles);
    return (
        <div className="overflow-x-auto bg-obsidianNavy border border-deepDivider rounded-xl shadow-xl animate-fadeIn">
            <table className="w-full text-left border-collapse">
                <thead>
                    <tr className="bg-[#080C14] border-b border-deepDivider">
                        <th className="p-4 text-steelGrey font-bold text-xs uppercase tracking-wider w-1/3">Process Step</th>
                        {roles.map(r => <th key={r} className="p-4 text-steelGrey font-bold text-xs uppercase tracking-wider text-center border-l border-deepDivider/50">{r}</th>)}
                    </tr>
                </thead>
                <tbody>
                    {localData.raci_matrix.map((row, i) => (
                        <tr key={i} className="border-b border-deepDivider/50 hover:bg-white/5 transition-colors">
                            <td className="p-4 text-white font-medium text-sm">{row.process_step}</td>
                            {roles.map(r => (
                                <td key={r} className="p-4 text-center border-l border-deepDivider/50">
                                    <span className={`inline-flex w-8 h-8 rounded-lg items-center justify-center font-bold text-xs transition-all ${
                                        row.roles[r] === 'A' ? 'bg-riskHigh/20 text-riskHigh border border-riskHigh/30 shadow-[0_0_10px_rgba(255,77,79,0.1)]' : 
                                        row.roles[r] === 'R' ? 'bg-brightBlue/20 text-brightBlue border border-brightBlue/30 shadow-[0_0_10px_rgba(0,140,255,0.1)]' : 
                                        row.roles[r] ? 'bg-deepDivider text-white/50 border border-white/10' : 'text-steelGrey opacity-20'
                                    }`}>{row.roles[r] || '-'}</span>
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
  };

  if (!localData) {
      return (
        <div className="space-y-8 animate-fadeIn">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-black text-white uppercase tracking-tighter">My Projects</h2>
                <button 
                  onClick={() => navigate && navigate(AppRoute.PROJECT_WIZARD)}
                  className="bg-brightBlue hover:bg-blue-600 text-white px-6 py-3 rounded-xl font-black text-xs uppercase tracking-widest flex items-center shadow-lg"
                >
                  <Plus size={18} className="mr-2" /> New Project
                </button>
            </div>

            {savedProjects.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-[60vh] text-steelGrey text-center bg-obsidianNavy border border-deepDivider rounded-[40px] p-12">
                    <div className="p-6 bg-techBlack rounded-full mb-6 border border-deepDivider"><Folder size={48} className="text-brightBlue opacity-30" /></div>
                    <h3 className="text-xl font-bold text-white mb-2">No projects yet</h3>
                    <p className="max-w-xs mx-auto text-sm mb-8">Start the AI Generator to build your first audit package.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {savedProjects.map((p) => (
                        <div 
                          key={p.id} 
                          className="bg-obsidianNavy border border-deepDivider p-8 rounded-[32px] hover:border-brightBlue transition-all cursor-pointer group flex flex-col relative"
                          onClick={() => onSelectProject && onSelectProject(p)}
                        >
                            <div className="flex justify-between items-start mb-6">
                                <div className="p-3 bg-white/5 rounded-2xl text-brightBlue"><FileText size={24}/></div>
                                <div className="flex gap-2">
                                    <button 
                                      onClick={(e) => { e.stopPropagation(); onDelete && onDelete(p.id!); }}
                                      className="p-2 text-steelGrey hover:text-riskHigh transition-colors"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </div>
                            <h3 className="text-lg font-black text-white mb-2 line-clamp-1">{p.project_title || "Untitled Project"}</h3>
                            <div className="flex items-center gap-4 text-[10px] text-steelGrey font-black uppercase tracking-widest mb-6">
                                <span className="flex items-center"><Clock size={12} className="mr-1"/> {new Date(p.savedAt!).toLocaleDateString()}</span>
                                <span className="flex items-center text-emerald-500"><Shield size={12} className="mr-1"/> {p.audit_score?.total_score}% Score</span>
                            </div>
                            <div className="mt-auto pt-6 border-t border-deepDivider flex justify-between items-center text-[10px] font-black uppercase tracking-widest">
                                <span className="text-steelGrey">{p.framework_mapping.length} Frameworks</span>
                                <span className="text-brightBlue group-hover:translate-x-1 transition-transform flex items-center">Open <ArrowRight size={14} className="ml-2"/></span>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
      );
  }

  const tabs: { id: TabType; label: string; icon: any }[] = [
    { id: 'score', label: 'Score', icon: PieChart },
    { id: 'flow', label: 'Process', icon: GitCommit },
    { id: 'raci', label: 'RACI', icon: Users },
    { id: 'risks', label: 'Risks', icon: ShieldAlert },
    { id: 'keycontrols', label: 'Controls', icon: Key },
    { id: 'evidence', label: 'Evidence', icon: FileCheck },
    { id: 'mapping', label: 'Mapping', icon: BookOpen },
  ];

  return (
    <div className="flex flex-col h-full space-y-6">
      <div className="flex justify-between items-center bg-obsidianNavy p-6 rounded-2xl border border-deepDivider shadow-lg">
        <div className="flex items-center space-x-4">
           <button 
             onClick={onBack} 
             className="p-2 rounded-lg hover:bg-white/5 text-steelGrey hover:text-white transition-all"
             title="Back to overview"
            >
                <LayoutGrid size={20}/>
            </button>
           <div className="h-8 w-px bg-deepDivider mx-2"></div>
           <div>
              <div className="flex items-center group cursor-pointer" onClick={() => setIsEditingTitle(true)}>
                <h2 className="text-xl font-black text-white transition-all group-hover:text-brightBlue uppercase tracking-tight">
                    {localData.project_title || "Audit Project"}
                </h2>
                <Pencil size={14} className="ml-3 text-steelGrey opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              <p className="text-steelGrey text-[10px] font-black uppercase tracking-widest flex items-center mt-1">
                  <Shield size={12} className="mr-1 text-brightBlue"/> {localData.framework_mapping.length} Frameworks Linked
              </p>
           </div>
        </div>
        <div className="flex gap-3">
            <div className="relative">
                <button onClick={() => setShowExportMenu(!showExportMenu)} className="border border-deepDivider text-steelGrey hover:text-white px-4 py-2 rounded-lg flex items-center text-[10px] font-black uppercase tracking-widest transition-colors hover:bg-white/5">
                    <Download size={14} className="mr-2" /> Export
                </button>
                {showExportMenu && (
                    <div className="absolute top-full right-0 mt-2 w-48 bg-obsidianNavy border border-deepDivider rounded-xl shadow-2xl z-50 overflow-hidden animate-fadeIn">
                        <button onClick={() => handleExport('csv')} className="w-full text-left px-4 py-3 hover:bg-white/5 text-xs text-white flex items-center transition-colors font-bold"><FileType size={16} className="mr-2 text-emerald-500" /> CSV (Excel)</button>
                        <button onClick={() => handleExport('json')} className="w-full text-left px-4 py-3 hover:bg-white/5 text-xs text-white flex items-center border-t border-deepDivider transition-colors font-bold"><GitCommit size={16} className="mr-2 text-yellow-500" /> JSON (Raw)</button>
                    </div>
                )}
            </div>
            <button onClick={handleSave} disabled={isSaving} className="bg-brightBlue hover:bg-blue-600 text-white px-6 py-2 rounded-lg flex items-center text-[10px] font-black uppercase tracking-widest shadow-lg transition-all active:scale-95">
                {isSaving ? <Loader2 size={16} className="mr-2 animate-spin" /> : isSaved ? <CheckCircle size={16} className="mr-2" /> : <Save size={16} className="mr-2" />}
                {isSaving ? 'Saving...' : isSaved ? 'Saved!' : 'Save Now'}
            </button>
        </div>
      </div>

      <div className="flex space-x-1 border-b border-deepDivider pb-2 overflow-x-auto no-scrollbar">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`flex items-center px-4 py-2 rounded-lg whitespace-nowrap text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === tab.id ? 'bg-brightBlue/10 text-brightBlue border border-brightBlue/20' : 'text-steelGrey hover:text-white hover:bg-white/5'}`}>
              <Icon size={14} className="mr-2" /> {tab.label}
            </button>
          );
        })}
      </div>

      <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
         {activeTab === 'score' && renderScoreTab()}
         {activeTab === 'raci' && renderRaciTab()}
         
         {activeTab === 'flow' && (
             <div className="space-y-6 animate-fadeIn">
                 {localData.process_flow.map((step, idx) => (
                     <div key={step.id} className="bg-obsidianNavy border border-deepDivider p-6 rounded-xl flex gap-6 relative group overflow-hidden">
                         <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity"><GitCommit size={64}/></div>
                         <div className="flex flex-col items-center">
                             <div className="w-10 h-10 rounded-full bg-brightBlue text-white flex items-center justify-center font-bold text-lg mb-2 shadow-lg shadow-blue-500/20">{idx + 1}</div>
                             {idx < localData.process_flow.length - 1 && <div className="flex-1 w-0.5 bg-deepDivider"></div>}
                         </div>
                         <div className="flex-1">
                             <h4 className="text-white font-bold text-lg mb-2">{step.title}</h4>
                             <p className="text-steelGrey text-sm mb-4 leading-relaxed">{step.summary}</p>
                             <div className="flex flex-wrap gap-2">
                                 {step.risk_hotspots.map((risk, ri) => (
                                     <span key={ri} className="text-[10px] bg-riskHigh/10 text-riskHigh border border-riskHigh/20 px-2 py-0.5 rounded flex items-center font-bold uppercase tracking-widest">
                                         <AlertTriangle size={10} className="mr-1"/> {risk}
                                     </span>
                                 ))}
                             </div>
                         </div>
                     </div>
                 ))}
             </div>
         )}

         {activeTab === 'risks' && (
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-fadeIn">
                 {localData.risks.map(r => (
                     <div key={r.id} className="bg-obsidianNavy border border-deepDivider p-6 rounded-2xl hover:border-riskHigh/30 transition-all group relative">
                         <div className="flex justify-between items-start mb-4">
                             <div className="flex flex-col">
                                <span className="text-[10px] font-black text-steelGrey uppercase tracking-widest">{r.id} • {r.category}</span>
                                <h4 className="text-white font-bold text-sm mt-1">{r.description}</h4>
                             </div>
                             <div className={`flex flex-col items-end`}>
                                 <span className={`text-[9px] font-black px-2 py-1 rounded uppercase border ${r.residual_rating.impact === 'High' ? 'bg-riskHigh/10 text-riskHigh border-riskHigh/20' : 'bg-riskLow/10 text-riskLow border-riskLow/20'}`}>
                                     Residual Impact: {r.residual_rating.impact}
                                 </span>
                             </div>
                         </div>
                         <div className="flex gap-4 mt-4 border-t border-deepDivider pt-3 opacity-60 group-hover:opacity-100 transition-opacity">
                             <div className="text-[10px] font-black uppercase text-steelGrey tracking-widest">Linked Controls: <span className="text-brightBlue">{r.linked_controls.join(', ')}</span></div>
                         </div>
                     </div>
                 ))}
             </div>
         )}

         {activeTab === 'keycontrols' && (
             <div className="space-y-4 animate-fadeIn">
                 {localData.key_controls.map(kc => {
                     const ctrl = localData.controls.find(c => c.id === kc.control_id);
                     return (
                         <div key={kc.id} className="bg-obsidianNavy border border-deepDivider p-6 rounded-2xl flex gap-6 hover:border-emerald-500/30 transition-all">
                             <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center flex-shrink-0 border border-emerald-500/20 shadow-lg shadow-emerald-500/10"><Key size={24}/></div>
                             <div className="flex-1">
                                 <div className="flex justify-between items-start mb-2">
                                     <h4 className="text-white font-bold text-lg">{ctrl?.title || kc.control_id}</h4>
                                     <span className="text-[10px] bg-deepDivider text-steelGrey px-2 py-1 rounded uppercase font-black tracking-widest">{ctrl?.automation_level}</span>
                                 </div>
                                 <p className="text-steelGrey text-sm mb-4 leading-relaxed">{ctrl?.description}</p>
                                 <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-black/20 p-3 rounded-lg border border-deepDivider/50">
                                     <div className="text-[10px] text-steelGrey font-black uppercase tracking-widest">FREQUENCY<br/><span className="text-white font-bold">{ctrl?.frequency}</span></div>
                                     <div className="text-[10px] text-steelGrey font-black uppercase tracking-widest">OWNER<br/><span className="text-white font-bold">{ctrl?.owner}</span></div>
                                     <div className="text-[10px] text-steelGrey font-black uppercase tracking-widest">STATUS<br/><span className="text-white font-bold truncate block">Operational</span></div>
                                     <div className="text-[10px] text-steelGrey font-black uppercase tracking-widest">MAPPING<br/><span className="text-brightBlue font-bold truncate block">{ctrl?.framework_mapping[0]?.reference}</span></div>
                                 </div>
                             </div>
                         </div>
                     );
                 })}
             </div>
         )}
         
         {activeTab === 'evidence' && (
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 animate-fadeIn">
                 {localData.evidence_checklist.map(ev => (
                     <div key={ev.id} className="bg-obsidianNavy border border-deepDivider p-6 rounded-2xl hover:bg-white/5 transition-all group">
                         <div className="flex justify-between items-start mb-4">
                             <div className="p-2 bg-brightBlue/10 text-brightBlue rounded-lg group-hover:bg-brightBlue group-hover:text-white transition-colors">
                                 <FileCheck size={20}/>
                             </div>
                             {ev.mandatory && <span className="text-[9px] bg-riskHigh/10 text-riskHigh font-black px-2 py-0.5 rounded border border-riskHigh/20 uppercase tracking-widest">Mandatory</span>}
                         </div>
                         <h4 className="text-white font-bold text-sm mb-2">{ev.title}</h4>
                         <p className="text-steelGrey text-xs mb-4 line-clamp-2 h-8 leading-relaxed">{ev.instructions}</p>
                         <div className="flex flex-wrap gap-1">
                             {ev.file_type.map(ft => (
                                 <span key={ft} className="text-[9px] bg-techBlack text-steelGrey px-1.5 py-0.5 rounded uppercase font-black border border-deepDivider">{ft}</span>
                             ))}
                         </div>
                     </div>
                 ))}
             </div>
         )}

         {activeTab === 'mapping' && (
             <div className="space-y-6 animate-fadeIn">
                 {localData.framework_mapping.map(fm => (
                     <div key={fm.framework} className="bg-obsidianNavy border border-deepDivider rounded-2xl overflow-hidden shadow-xl">
                         <div className="bg-[#080C14] p-4 border-b border-deepDivider flex items-center">
                             <BookOpen size={18} className="mr-3 text-brightBlue" />
                             <h4 className="font-black text-white text-sm uppercase tracking-tight">{fm.framework}</h4>
                         </div>
                         <div className="p-4 space-y-2">
                             {fm.articles.map((art, ai) => (
                                 <div key={ai} className="flex items-center justify-between p-3 bg-black/20 rounded-lg border border-deepDivider/50 hover:border-brightBlue/20 transition-all">
                                     <span className="text-xs font-mono text-white font-bold">{art.reference}</span>
                                     <div className="flex gap-2">
                                         {art.linked_controls.map(lc => (
                                             <span key={lc} className="text-[9px] bg-brightBlue/10 text-brightBlue px-2 py-0.5 rounded font-black border border-brightBlue/20 uppercase tracking-widest">{lc}</span>
                                         ))}
                                     </div>
                                 </div>
                             ))}
                         </div>
                     </div>
                 ))}
             </div>
         )}
      </div>

      {isEditingTitle && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
              <div className="bg-[#080C14] border border-deepDivider rounded-2xl w-full max-w-md shadow-2xl p-8 animate-fadeIn">
                  <h3 className="text-xl font-bold text-white mb-6">Rename Project</h3>
                  <input 
                    autoFocus
                    type="text"
                    value={titleDraft}
                    onChange={(e) => setTitleDraft(e.target.value)}
                    className="w-full bg-obsidianNavy border border-deepDivider rounded-lg px-4 py-3 text-white focus:border-brightBlue outline-none mb-6"
                    placeholder="Enter project name..."
                  />
                  <div className="flex justify-end gap-3">
                      <button onClick={() => setIsEditingTitle(false)} className="px-4 py-2 text-steelGrey hover:text-white transition-colors text-xs font-bold uppercase tracking-widest">Cancel</button>
                      <button 
                        onClick={() => {
                            if (localData) setLocalData({...localData, project_title: titleDraft});
                            setIsEditingTitle(false);
                        }} 
                        className="bg-brightBlue hover:bg-blue-600 text-white px-6 py-2 rounded-lg font-black text-xs uppercase tracking-widest shadow-lg"
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

export default OutputViewer;
