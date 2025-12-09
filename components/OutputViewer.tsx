

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
  ChevronDown,
  ChevronUp,
  Download,
  Edit3,
  CheckCircle,
  AlertTriangle,
  FileText,
  Search,
  Save,
  ArrowLeft,
  Clock,
  ArrowRight,
  Folder,
  TrendingUp,
  Info,
  AlertCircle,
  Check
} from 'lucide-react';
import { ResponsiveContainer, PieChart as RechartsPie, Pie, Cell, Tooltip as RechartsTooltip } from 'recharts';
import { AuditPackage, RaciMatrixItem } from '../types';

interface OutputViewerProps {
  data: AuditPackage | null;
  savedProjects?: AuditPackage[];
  onSave?: (data: AuditPackage) => void;
  onBack?: () => void;
  onSelectProject?: (data: AuditPackage) => void;
}

type TabType = 'flow' | 'raci' | 'risks' | 'objectives' | 'keycontrols' | 'tests' | 'evidence' | 'score' | 'mapping';

const OutputViewer: React.FC<OutputViewerProps> = ({ 
    data, 
    savedProjects = [], 
    onSave, 
    onBack, 
    onSelectProject 
}) => {
  const [activeTab, setActiveTab] = useState<TabType>('score');
  const [isSaved, setIsSaved] = useState(false);
  
  // RACI Interactive State
  const [raciData, setRaciData] = useState<RaciMatrixItem[]>([]);
  const [raciErrors, setRaciErrors] = useState<Record<number, string>>({});

  // Initialize RACI state when data loads
  useEffect(() => {
    if (data && data.raci_matrix) {
      setRaciData(JSON.parse(JSON.stringify(data.raci_matrix)));
    }
  }, [data]);

  // Validate RACI rows whenever raciData changes
  useEffect(() => {
    const errors: Record<number, string> = {};
    raciData.forEach((row, index) => {
      const roles = Object.values(row.roles);
      const aCount = roles.filter(r => r === 'A').length;
      const rCount = roles.filter(r => r === 'R').length;

      if (aCount === 0) errors[index] = "Missing Accountable (A)";
      else if (aCount > 1) errors[index] = "Multiple Accountables (A)";
      else if (rCount === 0) errors[index] = "Missing Responsible (R)";
    });
    setRaciErrors(errors);
  }, [raciData]);

  const handleSave = () => {
    if (data && onSave) {
        // Create a copy of data with the updated RACI matrix
        const updatedData = { ...data, raci_matrix: raciData };
        onSave(updatedData);
        setIsSaved(true);
        setTimeout(() => setIsSaved(false), 3000);
    }
  };

  const handleRaciCellClick = (rowIndex: number, roleKey: string) => {
    const newData = [...raciData];
    const currentRow = { ...newData[rowIndex] };
    const currentRoles = { ...currentRow.roles };
    
    // Cycle: "" -> R -> A -> C -> I -> ""
    const currentVal = currentRoles[roleKey] || "";
    const sequence = ["", "R", "A", "C", "I"];
    const nextIndex = (sequence.indexOf(currentVal) + 1) % sequence.length;
    currentRoles[roleKey] = sequence[nextIndex];
    
    currentRow.roles = currentRoles;
    newData[rowIndex] = currentRow;
    setRaciData(newData);
  };

  // Helper to determine score grade
  const getScoreGrade = (score: number) => {
    if (score >= 90) return { grade: 'A', color: 'text-emerald-500', label: 'Excellent' };
    if (score >= 80) return { grade: 'B', color: 'text-brightBlue', label: 'Good' };
    if (score >= 70) return { grade: 'C', color: 'text-yellow-500', label: 'Acceptable' };
    if (score >= 60) return { grade: 'D', color: 'text-orange-500', label: 'Weak' };
    return { grade: 'F', color: 'text-riskHigh', label: 'Critical' };
  };

  // List View (My Projects)
  if (!data) {
    if (savedProjects.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center h-[60vh] text-steelGrey">
                <div className="p-6 bg-obsidianNavy rounded-full mb-4">
                    <Folder size={48} className="text-brightBlue opacity-50" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">No Projects Saved</h3>
                <p className="mb-6">Go to the Generator to create your first audit package.</p>
            </div>
        );
    }

    return (
        <div className="space-y-6 animate-fadeIn">
            <h2 className="text-2xl font-bold text-white mb-6">My Projects</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {savedProjects.map((project, index) => (
                    <div 
                        key={index}
                        onClick={() => onSelectProject && onSelectProject(project)}
                        className="bg-obsidianNavy border border-deepDivider rounded-xl p-6 cursor-pointer hover:border-brightBlue transition-all group"
                    >
                        <div className="flex justify-between items-start mb-4">
                            <div className="p-3 bg-brightBlue/10 rounded-lg text-brightBlue group-hover:bg-brightBlue group-hover:text-white transition-colors">
                                <FileText size={24} />
                            </div>
                            <span className="bg-riskLow/10 text-riskLow text-xs px-2 py-1 rounded border border-riskLow/20">
                                Score: {project.audit_score.total_score}
                            </span>
                        </div>
                        <h3 className="text-lg font-bold text-white mb-2 line-clamp-1">
                            {project.process_flow[0]?.title || 'Untitled Project'}
                        </h3>
                        <p className="text-steelGrey text-sm mb-4 line-clamp-2 h-10">
                            {project.process_flow[0]?.summary || 'No description available.'}
                        </p>
                        
                        <div className="flex items-center text-xs text-steelGrey border-t border-deepDivider pt-4">
                            <Clock size={12} className="mr-1" />
                            {project.savedAt ? new Date(project.savedAt).toLocaleDateString() : 'Just now'}
                            <ArrowRight size={14} className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity text-brightBlue" />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
  }

  // Detail View
  const tabs: { id: TabType; label: string; icon: any }[] = [
    { id: 'score', label: 'Readiness Score', icon: PieChart },
    { id: 'flow', label: 'Process Flow', icon: GitCommit },
    { id: 'raci', label: 'RACI Matrix', icon: Users },
    { id: 'risks', label: 'Risks & Controls', icon: ShieldAlert },
    { id: 'objectives', label: 'Control Objectives', icon: Target },
    { id: 'keycontrols', label: 'Key Controls', icon: Key },
    { id: 'tests', label: 'Test Plans', icon: ClipboardCheck },
    { id: 'evidence', label: 'Evidence', icon: FileCheck },
    { id: 'mapping', label: 'Frameworks', icon: BookOpen },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'score':
        const score = data.audit_score.total_score;
        const gradeInfo = getScoreGrade(score);
        // Gauge Chart Data
        const gaugeData = [
          { name: 'Score', value: score, fill: '#008CFF' }, // Bright Blue
          { name: 'Remaining', value: 100 - score, fill: '#1A2333' } // Deep Divider color for background track
        ];

        return (
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 animate-fadeIn">
            {/* Gauge Section */}
            <div className="md:col-span-5 bg-obsidianNavy border border-deepDivider rounded-xl p-8 flex flex-col items-center justify-center relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-brightBlue to-purple-500"></div>
                <h3 className="text-lg font-bold text-white mb-2 flex items-center">
                    <Shield size={20} className="mr-2 text-brightBlue"/> Overall Readiness
                </h3>
                
                <div className="relative w-64 h-48 flex justify-center overflow-hidden">
                     {/* Using Recharts Pie to simulate a gauge */}
                    <ResponsiveContainer width="100%" height="100%">
                        <RechartsPie>
                            <Pie
                                data={gaugeData}
                                cx="50%"
                                cy="75%" // Shift down to make it a half-circle
                                startAngle={180}
                                endAngle={0}
                                innerRadius={80}
                                outerRadius={100}
                                paddingAngle={0}
                                dataKey="value"
                                stroke="none"
                            >
                                {gaugeData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.fill} />
                                ))}
                            </Pie>
                        </RechartsPie>
                    </ResponsiveContainer>
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-0 text-center mt-6">
                        <div className="text-5xl font-bold text-white tracking-tight">{score}</div>
                        <div className={`text-sm font-bold uppercase tracking-wider mt-1 ${gradeInfo.color}`}>
                            {gradeInfo.label}
                        </div>
                    </div>
                </div>
                
                <div className="text-center mt-2 max-w-xs">
                    <p className="text-steelGrey text-sm">
                        Based on coverage of {data.risks.length} risks and {data.controls.length} controls mapped to selected frameworks.
                    </p>
                </div>
            </div>

            {/* Domain Breakdown Section */}
            <div className="md:col-span-7 bg-obsidianNavy border border-deepDivider rounded-xl p-8 flex flex-col justify-center">
                <h3 className="text-lg font-bold text-white mb-6 flex items-center">
                    <TrendingUp size={20} className="mr-2 text-emerald-500"/> Domain Performance
                </h3>
                <div className="space-y-6">
                    {[
                        { label: 'Control Environment', score: data.audit_score.domain_scores.control_environment, color: 'bg-brightBlue' },
                        { label: 'Risk Management', score: data.audit_score.domain_scores.risk_management, color: 'bg-yellow-500' },
                        { label: 'Framework Compliance', score: data.audit_score.domain_scores.framework_compliance, color: 'bg-purple-500' },
                        { label: 'Evidence Quality', score: data.audit_score.domain_scores.evidence_quality, color: 'bg-emerald-500' }
                    ].map((domain, i) => (
                        <div key={i}>
                            <div className="flex justify-between text-sm mb-2">
                                <span className="text-white font-medium">{domain.label}</span>
                                <span className="text-white font-bold">{domain.score}%</span>
                            </div>
                            <div className="w-full bg-[#080C14] h-3 rounded-full overflow-hidden border border-white/5">
                                <div 
                                    className={`h-full rounded-full ${domain.color} transition-all duration-1000 ease-out`} 
                                    style={{ width: `${domain.score}%` }}
                                ></div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Recommendations */}
            <div className="md:col-span-12 bg-obsidianNavy border border-deepDivider rounded-xl p-8">
              <h3 className="text-lg font-bold text-white mb-4 flex items-center">
                 <Target size={20} className="mr-2 text-riskHigh"/> Strategic Recommendations
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {data.audit_score.recommendations.map((rec, i) => (
                  <div key={i} className="flex items-start bg-black/20 p-4 rounded-lg border border-deepDivider">
                    <div className="mt-1 mr-3 min-w-[24px] h-6 rounded bg-brightBlue/10 text-brightBlue flex items-center justify-center text-xs font-bold border border-brightBlue/20">
                        {i+1}
                    </div>
                    <p className="text-steelGrey text-sm">{rec}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case 'flow':
        return (
          <div className="space-y-4 animate-fadeIn">
            {data.process_flow.map((step, index) => (
              <React.Fragment key={step.id}>
                <div className="bg-obsidianNavy border border-deepDivider rounded-lg p-6 hover:border-brightBlue/50 transition-colors relative">
                    {/* Visual Connector Line */}
                    {index < data.process_flow.length - 1 && (
                        <div className="absolute left-1/2 bottom-0 transform translate-y-full w-0.5 h-4 bg-deepDivider -z-10 md:hidden"></div>
                    )}
                    
                    <div className="flex justify-between items-start mb-2">
                    <div className="flex items-center space-x-3">
                        <span className="px-2 py-1 bg-deepDivider rounded text-xs font-mono text-steelGrey">{step.id}</span>
                        <h4 className="text-lg font-bold text-white">{step.title}</h4>
                    </div>
                    <button className="text-steelGrey hover:text-white"><Edit3 size={16} /></button>
                    </div>
                    <p className="text-steelGrey mb-4 text-sm">{step.description}</p>
                    <div className="flex flex-wrap gap-2 text-xs">
                        {step.risk_hotspots.length > 0 && step.risk_hotspots.map((r, i) => (
                            <span key={i} className="px-2 py-1 bg-riskHigh/10 text-riskHigh border border-riskHigh/20 rounded flex items-center">
                                <AlertTriangle size={10} className="mr-1"/> Risk: {r}
                            </span>
                        ))}
                        <span className="px-2 py-1 bg-brightBlue/10 text-brightBlue border border-brightBlue/20 rounded flex items-center">
                            <Users size={10} className="mr-1"/> Owner: {step.owner}
                        </span>
                        {step.linked_key_controls.length > 0 && (
                            <span className="px-2 py-1 bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 rounded flex items-center">
                                <ShieldAlert size={10} className="mr-1"/> Controls: {step.linked_key_controls.join(', ')}
                            </span>
                        )}
                    </div>
                </div>
                {/* Desktop Arrow Connector */}
                {index < data.process_flow.length - 1 && (
                    <div className="hidden md:flex justify-center py-2">
                        <div className="text-deepDivider"><ArrowDownChevron /></div>
                    </div>
                )}
               </React.Fragment>
            ))}
          </div>
        );

      case 'raci':
        // Use local interactive state instead of prop data directly
        const displayData = raciData.length > 0 ? raciData : data.raci_matrix;
        const roles = Object.keys(displayData[0]?.roles || {});
        
        return (
          <div className="space-y-6 animate-fadeIn">
            {/* RACI Legend/Definitions */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-2">
                <div className="bg-obsidianNavy border border-deepDivider p-3 rounded-lg">
                    <div className="flex items-center mb-1">
                        <span className="w-6 h-6 rounded bg-brightBlue/20 text-brightBlue font-bold flex items-center justify-center text-xs mr-2">R</span>
                        <span className="text-white font-bold text-sm">Responsible</span>
                    </div>
                    <p className="text-xs text-steelGrey">Executes the task.</p>
                </div>
                <div className="bg-obsidianNavy border border-deepDivider p-3 rounded-lg">
                    <div className="flex items-center mb-1">
                        <span className="w-6 h-6 rounded bg-rose-500/20 text-rose-500 font-bold flex items-center justify-center text-xs mr-2">A</span>
                        <span className="text-white font-bold text-sm">Accountable</span>
                    </div>
                    <p className="text-xs text-steelGrey">Final decision maker. (One per row)</p>
                </div>
                <div className="bg-obsidianNavy border border-deepDivider p-3 rounded-lg">
                    <div className="flex items-center mb-1">
                        <span className="w-6 h-6 rounded bg-amber-500/20 text-amber-500 font-bold flex items-center justify-center text-xs mr-2">C</span>
                        <span className="text-white font-bold text-sm">Consulted</span>
                    </div>
                    <p className="text-xs text-steelGrey">Expert input required.</p>
                </div>
                <div className="bg-obsidianNavy border border-deepDivider p-3 rounded-lg">
                    <div className="flex items-center mb-1">
                        <span className="w-6 h-6 rounded bg-slate-500/20 text-slate-500 font-bold flex items-center justify-center text-xs mr-2">I</span>
                        <span className="text-white font-bold text-sm">Informed</span>
                    </div>
                    <p className="text-xs text-steelGrey">Notified of outcome.</p>
                </div>
            </div>

            <div className="overflow-x-auto bg-obsidianNavy border border-deepDivider rounded-xl shadow-xl">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-[#080C14] border-b border-deepDivider">
                    <th className="p-4 text-steelGrey font-bold text-xs uppercase tracking-wider w-10 text-center">Status</th>
                    <th className="p-4 text-steelGrey font-bold text-xs uppercase tracking-wider sticky left-0 bg-[#080C14] z-10 w-1/3 border-r border-deepDivider">Process Step</th>
                    {roles.map(r => (
                      <th key={r} className="p-4 text-steelGrey font-bold text-xs uppercase tracking-wider text-center border-l border-deepDivider/50">{r}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {displayData.map((row, rowIndex) => (
                    <tr key={rowIndex} className="border-b border-deepDivider/50 hover:bg-white/5 transition-colors">
                      <td className="p-4 text-center">
                          {raciErrors[rowIndex] ? (
                              <div className="flex justify-center group relative">
                                  <AlertCircle size={16} className="text-riskHigh" />
                                  <div className="absolute left-6 top-0 w-max bg-riskHigh text-white text-xs px-2 py-1 rounded hidden group-hover:block z-50">
                                      {raciErrors[rowIndex]}
                                  </div>
                              </div>
                          ) : (
                              <div className="flex justify-center"><Check size={16} className="text-riskLow" /></div>
                          )}
                      </td>
                      <td className="p-4 text-white font-medium text-sm sticky left-0 bg-obsidianNavy border-r border-deepDivider">
                        {row.process_step}
                      </td>
                      {roles.map(r => {
                          const val = row.roles[r];
                          let badgeClass = 'text-steelGrey bg-transparent opacity-20 hover:opacity-100 hover:bg-white/10'; // Default empty
                          if (val === 'R') badgeClass = 'bg-brightBlue/20 text-brightBlue border border-brightBlue/30 hover:bg-brightBlue/30';
                          if (val === 'A') badgeClass = 'bg-rose-500/20 text-rose-500 border border-rose-500/30 ring-1 ring-rose-500/20 hover:bg-rose-500/30';
                          if (val === 'C') badgeClass = 'bg-amber-500/10 text-amber-500 border border-amber-500/20 hover:bg-amber-500/20';
                          if (val === 'I') badgeClass = 'bg-slate-500/20 text-slate-400 border border-slate-500/20 hover:bg-slate-500/30';

                          return (
                            <td key={r} className="p-2 text-center border-l border-deepDivider/50">
                                <button
                                    onClick={() => handleRaciCellClick(rowIndex, r)}
                                    className={`inline-flex w-10 h-10 rounded-lg items-center justify-center font-bold text-sm shadow-sm transition-all ${badgeClass}`}
                                    title="Click to cycle: R -> A -> C -> I -> Empty"
                                >
                                    {val || '-'}
                                </button>
                            </td>
                          );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            <div className="flex items-center text-xs text-steelGrey mt-2">
                <Info size={14} className="mr-2" />
                <span>Rows are validated to ensure segregation of duties (SoD) and clear accountability ownership. Click cells to edit.</span>
            </div>
          </div>
        );

      case 'risks':
        return (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-fadeIn">
             <div className="space-y-4">
                <h4 className="text-white font-bold mb-2 sticky top-0 bg-techBlack py-2 z-10 border-b border-deepDivider flex items-center">
                    <ShieldAlert size={18} className="mr-2 text-riskHigh"/> Risk Register
                </h4>
                {data.risks.map((risk) => (
                    <div key={risk.id} className="bg-obsidianNavy border border-deepDivider rounded-lg p-5 relative group">
                        <div className="absolute top-4 right-4 text-xs font-bold px-2 py-1 rounded bg-deepDivider text-steelGrey">{risk.id}</div>
                        <h5 className="text-white font-medium pr-8 mb-2 leading-snug">{risk.description}</h5>
                        
                        <div className="flex gap-2 mb-3">
                             <div className="flex-1 bg-black/20 p-2 rounded border border-white/5">
                                 <div className="text-[10px] text-steelGrey uppercase tracking-wide mb-1">Inherent Risk</div>
                                 <div className={`text-xs font-bold ${
                                     risk.inherent_rating.likelihood === 'High' ? 'text-riskHigh' : 'text-yellow-500'
                                 }`}>
                                     {risk.inherent_rating.likelihood} / {risk.inherent_rating.impact}
                                 </div>
                             </div>
                             <div className="flex items-center justify-center text-steelGrey">
                                <ArrowRight size={14} />
                             </div>
                             <div className="flex-1 bg-black/20 p-2 rounded border border-white/5">
                                 <div className="text-[10px] text-steelGrey uppercase tracking-wide mb-1">Residual Risk</div>
                                 <div className={`text-xs font-bold ${
                                     risk.residual_rating.likelihood === 'High' ? 'text-riskHigh' : 'text-riskLow'
                                 }`}>
                                     {risk.residual_rating.likelihood} / {risk.residual_rating.impact}
                                 </div>
                             </div>
                        </div>

                        <div className="text-xs text-brightBlue bg-brightBlue/5 p-2 rounded border border-brightBlue/10">
                            Linked Controls: <span className="text-white">{risk.linked_controls.join(', ')}</span>
                        </div>
                    </div>
                ))}
             </div>
             <div className="space-y-4">
                <h4 className="text-white font-bold mb-2 sticky top-0 bg-techBlack py-2 z-10 border-b border-deepDivider flex items-center">
                    <Shield size={18} className="mr-2 text-brightBlue"/> Controls Catalog
                </h4>
                {data.controls.map((control) => (
                    <div key={control.id} className="bg-obsidianNavy border border-deepDivider rounded-lg p-5 relative">
                        <div className="absolute top-4 right-4 text-xs font-bold px-2 py-1 rounded bg-deepDivider text-steelGrey">{control.id}</div>
                        <h5 className="text-white font-medium pr-8 mb-2">{control.title}</h5>
                        <p className="text-steelGrey text-xs mb-3 leading-relaxed">{control.description}</p>
                        <div className="flex flex-wrap gap-2 text-xs mb-3">
                             <span className="px-2 py-1 bg-deepDivider rounded text-steelGrey">Owner: {control.owner}</span>
                             <span className="px-2 py-1 bg-deepDivider rounded text-steelGrey">{control.frequency}</span>
                             {control.evidence_required && control.evidence_required.length > 0 && (
                                <span className="px-2 py-1 bg-purple-500/10 text-purple-400 border border-purple-500/20 rounded flex items-center">
                                   <FileCheck size={10} className="mr-1"/> Evidence: {control.evidence_required.join(', ')}
                                </span>
                             )}
                        </div>
                        {control.framework_mapping && control.framework_mapping.length > 0 && (
                          <div className="w-full flex flex-wrap gap-2 border-t border-deepDivider/50 pt-2">
                            {control.framework_mapping.map((fm, i) => (
                              <span key={i} className="px-2 py-1 bg-brightBlue/10 text-brightBlue border border-brightBlue/20 rounded text-[10px] font-mono">
                                {fm.framework} {fm.reference}
                              </span>
                            ))}
                          </div>
                        )}
                    </div>
                ))}
             </div>
          </div>
        );

      case 'objectives':
        return (
          <div className="space-y-4 animate-fadeIn">
             {data.control_objectives.map((co) => (
               <div key={co.id} className="bg-obsidianNavy border border-deepDivider rounded-lg p-6">
                 <div className="flex items-center justify-between mb-2">
                   <h4 className="text-white font-bold text-lg"><span className="text-steelGrey font-mono text-sm mr-3">{co.id}</span>{co.title}</h4>
                 </div>
                 <div className="mb-4">
                   <p className="text-sm text-steelGrey font-medium mb-1">Success Criteria:</p>
                   <div className="bg-black/20 p-3 rounded text-sm text-white border-l-4 border-emerald-500">
                     {co.success_criteria}
                   </div>
                 </div>
                 <div className="flex flex-wrap gap-4 text-xs">
                   <div className="bg-deepDivider/50 px-3 py-2 rounded">
                     <span className="text-steelGrey block mb-1">Linked Risks</span>
                     <span className="text-riskHigh font-bold">{co.linked_risks.join(', ')}</span>
                   </div>
                   <div className="bg-deepDivider/50 px-3 py-2 rounded">
                     <span className="text-steelGrey block mb-1">Linked Controls</span>
                     <span className="text-brightBlue font-bold">{co.linked_controls.join(', ')}</span>
                   </div>
                 </div>
               </div>
             ))}
          </div>
        );

      case 'keycontrols':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fadeIn">
            {data.key_controls.map((kc) => {
              // Find the original control details
              const originalControl = data.controls.find(c => c.id === kc.control_id);
              return (
                <div key={kc.id} className="bg-obsidianNavy border border-deepDivider rounded-xl p-6 relative overflow-hidden group hover:border-brightBlue/50 transition-colors">
                  <div className="absolute top-0 right-0 p-2">
                     <Key size={16} className="text-yellow-500 opacity-50" />
                  </div>
                  <div className="mb-4">
                    <span className="text-xs font-mono text-steelGrey bg-deepDivider px-2 py-1 rounded">{kc.id}</span>
                    <span className="mx-2 text-steelGrey">→</span>
                    <span className="text-xs font-mono text-brightBlue bg-brightBlue/10 px-2 py-1 rounded">{kc.control_id}</span>
                  </div>
                  <h5 className="text-white font-bold mb-2">{originalControl?.title || 'Unknown Control'}</h5>
                  <p className="text-steelGrey text-sm mb-4">{kc.reason}</p>
                  
                  <div className="flex flex-wrap gap-2 mb-3">
                    {originalControl?.framework_mapping?.map((fm, i) => (
                      <span key={i} className="text-[10px] bg-white/5 border border-white/10 px-2 py-0.5 rounded text-steelGrey">
                        {fm.framework} {fm.reference}
                      </span>
                    ))}
                  </div>

                  <div className="pt-3 border-t border-deepDivider flex justify-between items-center text-xs">
                    <span className="text-steelGrey">Test Freq: <span className="text-white">{kc.test_frequency}</span></span>
                  </div>
                </div>
              );
            })}
          </div>
        );

      case 'tests':
        return (
          <div className="space-y-6 animate-fadeIn">
            {data.test_plans.map((tp) => (
               <div key={tp.id} className="bg-obsidianNavy border border-deepDivider rounded-xl p-6">
                 <div className="flex justify-between items-start mb-4">
                   <div>
                     <div className="flex items-center space-x-3 mb-1">
                        <span className="text-sm font-mono text-steelGrey bg-deepDivider px-2 py-1 rounded">{tp.id}</span>
                        <h4 className="text-white font-bold text-lg">Test for {tp.control_id}</h4>
                     </div>
                     <p className="text-steelGrey text-sm">{tp.purpose}</p>
                   </div>
                   <div className="text-right text-xs text-steelGrey">
                      <div className="mb-1">Reviewer: {tp.reviewer}</div>
                      <div>Sample: {tp.sampling_frequency}</div>
                   </div>
                 </div>
                 
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                   <div className="bg-black/20 p-4 rounded-lg">
                     <h5 className="text-white text-sm font-bold mb-3 flex items-center"><ClipboardCheck size={14} className="mr-2"/> Test Steps</h5>
                     <ol className="list-decimal list-inside space-y-2 text-sm text-steelGrey">
                       {tp.steps.map((step, i) => (
                         <li key={i}>{step}</li>
                       ))}
                     </ol>
                   </div>
                   <div className="space-y-4">
                      <div className="bg-black/20 p-4 rounded-lg">
                        <h5 className="text-white text-sm font-bold mb-2">Evidence Required</h5>
                        <div className="flex flex-wrap gap-2">
                          {tp.evidence_required.map((ev, i) => (
                             <span key={i} className="px-2 py-1 bg-deepDivider rounded text-xs text-brightBlue flex items-center">
                                <FileText size={10} className="mr-1"/> {ev}
                             </span>
                          ))}
                        </div>
                      </div>
                      <div className="bg-emerald-500/10 border border-emerald-500/20 p-4 rounded-lg">
                        <h5 className="text-emerald-500 text-sm font-bold mb-1">Pass Criteria</h5>
                        <p className="text-sm text-white/80">{tp.pass_fail_criteria}</p>
                      </div>
                   </div>
                 </div>
               </div>
            ))}
          </div>
        );

      case 'evidence':
        return (
          <div className="bg-obsidianNavy border border-deepDivider rounded-xl overflow-hidden animate-fadeIn">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-[#080C14] border-b border-deepDivider">
                  <th className="p-4 text-steelGrey font-medium text-sm w-24">ID</th>
                  <th className="p-4 text-steelGrey font-medium text-sm">Evidence Item</th>
                  <th className="p-4 text-steelGrey font-medium text-sm">Linked Control</th>
                  <th className="p-4 text-steelGrey font-medium text-sm">Format</th>
                  <th className="p-4 text-steelGrey font-medium text-sm w-24">Req.</th>
                </tr>
              </thead>
              <tbody>
                {data.evidence_checklist.map((ev, i) => (
                  <tr key={i} className="border-b border-deepDivider/50 hover:bg-white/5 transition-colors">
                    <td className="p-4 text-steelGrey font-mono text-sm">{ev.id}</td>
                    <td className="p-4">
                      <div className="text-white font-medium mb-1">{ev.title}</div>
                      <div className="text-xs text-steelGrey italic">{ev.instructions}</div>
                    </td>
                    <td className="p-4 text-brightBlue text-sm font-mono">{ev.linked_control}</td>
                    <td className="p-4">
                       <div className="flex gap-1">
                          {ev.file_type.map((ft, j) => (
                            <span key={j} className="text-[10px] uppercase bg-deepDivider px-1.5 py-0.5 rounded text-steelGrey">{ft}</span>
                          ))}
                       </div>
                    </td>
                    <td className="p-4">
                       {ev.mandatory ? 
                          <span className="text-xs bg-riskHigh/10 text-riskHigh px-2 py-1 rounded border border-riskHigh/20">Yes</span> : 
                          <span className="text-xs bg-deepDivider text-steelGrey px-2 py-1 rounded">Opt</span>
                       }
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );

      case 'mapping':
        return (
          <div className="space-y-6 animate-fadeIn">
             {data.framework_mapping.map((fw, idx) => (
               <div key={idx} className="bg-obsidianNavy border border-deepDivider rounded-xl overflow-hidden">
                 <div className="bg-[#080C14] p-4 border-b border-deepDivider flex justify-between items-center">
                    <h3 className="text-white font-bold text-lg flex items-center">
                        <BookOpen size={18} className="mr-2 text-brightBlue"/>
                        {fw.framework}
                    </h3>
                    <span className="text-xs text-steelGrey bg-deepDivider px-2 py-1 rounded">{fw.articles.length} Requirements Mapped</span>
                 </div>
                 
                 {/* Premium Table Layout for Mappings */}
                 <div className="w-full">
                    <table className="w-full text-left">
                        <thead className="bg-obsidianNavy border-b border-deepDivider">
                             <tr>
                                 <th className="p-3 text-xs text-steelGrey uppercase font-bold w-32">Reference</th>
                                 <th className="p-3 text-xs text-steelGrey uppercase font-bold">Linked Controls</th>
                                 <th className="p-3 text-xs text-steelGrey uppercase font-bold">Audit Trail</th>
                             </tr>
                        </thead>
                        <tbody className="divide-y divide-deepDivider/50">
                             {fw.articles.map((art, i) => (
                                <tr key={i} className="hover:bg-white/5 transition-colors">
                                    <td className="p-4 align-top">
                                        <span className="inline-block bg-brightBlue/10 text-brightBlue border border-brightBlue/20 rounded px-2 py-1 text-xs font-mono font-bold">
                                            {art.reference}
                                        </span>
                                    </td>
                                    <td className="p-4 align-top">
                                         <div className="flex flex-wrap gap-2">
                                            {art.linked_controls.map((ctrl, cIdx) => (
                                                <span key={cIdx} className="text-white font-mono text-sm bg-deepDivider/50 px-2 py-1 rounded">
                                                    {ctrl}
                                                </span>
                                            ))}
                                         </div>
                                    </td>
                                    <td className="p-4 align-top text-sm text-steelGrey">
                                        Validated via internal controls {art.linked_controls.join(', ')}.
                                    </td>
                                </tr>
                             ))}
                        </tbody>
                    </table>
                 </div>
               </div>
             ))}
          </div>
        );
      
      default:
        return null;
    }
  };

  // Helper component for visual flow
  const ArrowDownChevron = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M7 13L12 18L17 13M7 6L12 11L17 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );

  return (
    <div className="flex flex-col h-full space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <div className="flex items-center gap-3">
              {onBack && savedProjects.length > 0 && (
                <button onClick={onBack} className="text-steelGrey hover:text-white transition-colors">
                    <ArrowLeft size={20} />
                </button>
              )}
              <h2 className="text-2xl font-bold text-white mb-1">
                {data.process_flow[0]?.title || 'Audit Project'}
              </h2>
          </div>
          <p className="text-steelGrey text-sm ml-8">Generated Documentation Package</p>
        </div>
        <div className="flex gap-2">
             <button className="border border-deepDivider text-steelGrey hover:text-white px-4 py-2 rounded-lg flex items-center text-sm transition-colors hover:bg-white/5">
                <Download size={16} className="mr-2" /> Export
            </button>
            <button 
                onClick={handleSave} 
                disabled={isSaved}
                className={`px-6 py-2 rounded-lg flex items-center text-sm font-bold transition-all shadow-lg ${
                    isSaved 
                        ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20' 
                        : 'bg-brightBlue hover:bg-blue-600 text-white shadow-blue-500/20'
                }`}
            >
                {isSaved ? <CheckCircle size={18} className="mr-2" /> : <Save size={18} className="mr-2" />} 
                {isSaved ? 'Project Saved' : 'Save Project'}
            </button>
        </div>
      </div>

      <div className="flex space-x-1 overflow-x-auto pb-2 border-b border-deepDivider custom-scrollbar">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center px-4 py-2 rounded-lg whitespace-nowrap text-sm font-medium transition-colors ${
                activeTab === tab.id 
                  ? 'bg-brightBlue/10 text-brightBlue border border-brightBlue/20' 
                  : 'text-steelGrey hover:text-white hover:bg-white/5'
              }`}
            >
              <Icon size={16} className="mr-2" />
              {tab.label}
            </button>
          );
        })}
      </div>

      <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
         {renderContent()}
      </div>
    </div>
  );
};

export default OutputViewer;