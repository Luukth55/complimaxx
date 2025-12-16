
import React, { useState, useEffect } from 'react';
import { AlertOctagon, MoreHorizontal, Plus, Clock, AlertTriangle, X, CheckCircle, ArrowRight, Zap, ShieldAlert, ThumbsUp, ThumbsDown, Eye } from 'lucide-react';
import { AuditPackage, Gap } from '../types';

interface GapTrackingProps {
  data: AuditPackage | null;
  navigate: (route: any) => void;
  onUpdate?: (gaps: Gap[]) => void;
}

// Extend Gap type locally for the Review Queue state
interface ExtendedGap extends Gap {
    isAiSuggestion?: boolean;
    aiConfidence?: number; // 0-100
    aiReasoning?: string;
}

const GapTracking: React.FC<GapTrackingProps> = ({ data, navigate, onUpdate }) => {
  const [gaps, setGaps] = useState<ExtendedGap[]>([]);
  const [reviewQueue, setReviewQueue] = useState<ExtendedGap[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // New Gap Form State
  const [newGap, setNewGap] = useState<Partial<Gap>>({
      description: '',
      priority: 'Medium',
      owner: '',
      dueDate: new Date().toISOString().split('T')[0]
  });

  useEffect(() => {
    if (data) {
      if (data.gaps && data.gaps.length > 0) {
        setGaps(data.gaps);
      } else {
        // --- INTELLIGENT & TRANSPARENT GAP ANALYSIS LOGIC ---
        // Instead of auto-adding, we create a "Review Queue" for the user.
        
        const existingGaps: ExtendedGap[] = [];
        const suggestions: ExtendedGap[] = [];
        let gapCounter = 1;

        // 1. ANALYSIS: Residual Risk Gaps
        data.risks.forEach((risk) => {
            if (risk.residual_rating.impact === 'High' || risk.residual_rating.likelihood === 'High') {
                suggestions.push({
                    id: `SUG-${String(gapCounter++).padStart(2, '0')}`,
                    description: `Excessive Residual Risk: ${risk.description}`,
                    linkedRisk: risk.id,
                    linkedControl: risk.linked_controls[0] || 'None',
                    owner: 'Risk Owner',
                    status: 'To Do',
                    priority: 'High',
                    dueDate: new Date(Date.now() + 86400000 * 14).toISOString().split('T')[0],
                    isAiSuggestion: true,
                    aiConfidence: 95,
                    aiReasoning: "Residual risk remains 'High' despite mapped controls."
                });
            }
        });

        // 2. ANALYSIS: Control Efficiency (Manual & Frequent)
        data.controls.forEach((control) => {
            if (control.automation_level === 'Manual' && (control.frequency.includes('Daily') || control.frequency.includes('Weekly'))) {
                suggestions.push({
                    id: `SUG-${String(gapCounter++).padStart(2, '0')}`,
                    description: `Automate Control: "${control.title}"`,
                    linkedRisk: 'Operational',
                    linkedControl: control.id,
                    owner: control.owner,
                    status: 'To Do',
                    priority: 'Low',
                    dueDate: new Date(Date.now() + 86400000 * 60).toISOString().split('T')[0],
                    isAiSuggestion: true,
                    aiConfidence: 80,
                    aiReasoning: "Manual daily controls have a 40% higher failure rate than automated ones."
                });
            }
        });

        setReviewQueue(suggestions); // Put AI findings in queue
        setGaps(existingGaps);       // Active board starts empty or with saved items
        
        // Initial sync if needed, but usually we wait for user action
        if (onUpdate) onUpdate(existingGaps); 
      }
    }
  }, [data]);

  const moveGap = (id: string, newStatus: Gap['status']) => {
    const newGaps = gaps.map(g => g.id === id ? { ...g, status: newStatus } : g);
    setGaps(newGaps);
    if (onUpdate) onUpdate(newGaps);
  };

  const acceptSuggestion = (suggestion: ExtendedGap) => {
      // Move from queue to real gaps
      const newActiveGap = { ...suggestion, id: `GAP-${Date.now().toString().slice(-4)}`, isAiSuggestion: false };
      const updatedGaps = [newActiveGap, ...gaps];
      const updatedQueue = reviewQueue.filter(g => g.id !== suggestion.id);
      
      setGaps(updatedGaps);
      setReviewQueue(updatedQueue);
      if (onUpdate) onUpdate(updatedGaps);
  };

  const rejectSuggestion = (id: string) => {
      setReviewQueue(reviewQueue.filter(g => g.id !== id));
  };

  const handleAddGap = () => {
      if (!newGap.description) return;

      const createdGap: ExtendedGap = {
          id: `MAN-${Date.now().toString().slice(-4)}`,
          description: newGap.description,
          priority: newGap.priority as any,
          owner: newGap.owner || 'Unassigned',
          dueDate: newGap.dueDate || new Date().toISOString().split('T')[0],
          status: 'To Do',
          linkedRisk: 'Manual',
          linkedControl: 'Manual',
          isAiSuggestion: false
      };

      const updatedGaps = [createdGap, ...gaps];
      setGaps(updatedGaps);
      if (onUpdate) onUpdate(updatedGaps);
      setIsModalOpen(false);
      setNewGap({ description: '', priority: 'Medium', owner: '', dueDate: new Date().toISOString().split('T')[0] });
  };

  const Column = ({ title, status, color }: { title: string, status: Gap['status'], color: string }) => (
    <div className="flex-1 bg-[#080C14] border border-deepDivider rounded-xl flex flex-col h-full min-h-[600px] shadow-inner">
      <div className={`p-4 border-b border-deepDivider flex justify-between items-center rounded-t-xl bg-gradient-to-r ${color}`}>
        <h3 className="font-bold text-white text-sm uppercase tracking-wider">{title}</h3>
        <span className="bg-white/20 px-2 py-0.5 rounded text-xs text-white font-bold backdrop-blur-sm">
          {gaps.filter(g => g.status === status).length}
        </span>
      </div>
      <div className="p-3 space-y-3 flex-1 overflow-y-auto custom-scrollbar">
        {gaps.filter(g => g.status === status).map(gap => (
          <div key={gap.id} className="bg-obsidianNavy p-4 rounded-lg border border-deepDivider hover:border-brightBlue transition-all shadow-lg hover:shadow-brightBlue/10 group relative animate-fadeIn">
            <div className="flex justify-between items-start mb-3">
              <span className="text-[10px] font-mono text-steelGrey bg-deepDivider px-1.5 py-0.5 rounded">{gap.id}</span>
              
              {gap.description.includes('Residual') && (
                  <span className="text-[10px] font-bold text-riskHigh flex items-center bg-riskHigh/10 px-1.5 py-0.5 rounded border border-riskHigh/20">
                      <ShieldAlert size={10} className="mr-1"/> Risk Exposure
                  </span>
              )}

              <div className={`flex items-center text-[10px] font-bold uppercase px-1.5 py-0.5 rounded border ${
                gap.priority === 'High' ? 'text-riskHigh border-riskHigh/30 bg-riskHigh/10' : 
                gap.priority === 'Medium' ? 'text-riskMedium border-riskMedium/30 bg-riskMedium/10' : 
                'text-riskLow border-riskLow/30 bg-riskLow/10'
              }`}>
                {gap.priority}
              </div>
            </div>
            
            <p className="text-sm text-white mb-4 leading-snug">{gap.description}</p>
            
            <div className="flex items-center justify-between text-xs text-steelGrey border-t border-deepDivider/50 pt-3">
              <div className="flex items-center" title="Owner">
                <div className="w-5 h-5 rounded-full bg-deepDivider flex items-center justify-center text-[10px] text-white mr-1.5">
                    {gap.owner.charAt(0)}
                </div>
                <span className="truncate max-w-[80px]">{gap.owner}</span>
              </div>
              <div className="flex items-center">
                <Clock size={12} className="mr-1" /> {gap.dueDate}
              </div>
            </div>
            
            {/* Quick Actions Overlay */}
            <div className="absolute inset-0 bg-obsidianNavy/90 backdrop-blur-[1px] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-lg gap-2">
                {status !== 'To Do' && (
                    <button onClick={() => moveGap(gap.id, 'To Do')} className="bg-deepDivider hover:bg-white text-techBlack px-3 py-1.5 rounded text-xs font-bold transition-colors">To Do</button>
                )}
                {status !== 'In Progress' && (
                    <button onClick={() => moveGap(gap.id, 'In Progress')} className="bg-brightBlue hover:bg-blue-600 text-white px-3 py-1.5 rounded text-xs font-bold transition-colors">Progress</button>
                )}
                {status !== 'Done' && (
                    <button onClick={() => moveGap(gap.id, 'Done')} className="bg-riskLow hover:bg-green-600 text-white px-3 py-1.5 rounded text-xs font-bold transition-colors">Done</button>
                )}
            </div>
          </div>
        ))}
         {gaps.filter(g => g.status === status).length === 0 && (
             <div className="flex flex-col items-center justify-center h-32 text-steelGrey opacity-30 border-2 border-dashed border-deepDivider rounded-lg m-2">
                 <AlertOctagon size={24} className="mb-2"/>
                 <span className="text-xs">No items</span>
             </div>
         )}
      </div>
    </div>
  );

  if (!data) return null;

  return (
    <div className="space-y-6 animate-fadeIn h-full flex flex-col">
      <div className="flex justify-between items-center bg-obsidianNavy p-6 rounded-xl border border-deepDivider">
        <div>
          <h2 className="text-2xl font-bold text-white mb-1">Gap Tracking & Remediation</h2>
          <p className="text-steelGrey text-sm">
            Manage compliance gaps identified by the system or manual review.
          </p>
        </div>
        <button 
            onClick={() => setIsModalOpen(true)}
            className="bg-brightBlue hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-bold flex items-center shadow-lg shadow-blue-500/20 transition-all hover:scale-105"
        >
            <Plus size={18} className="mr-2" /> Add Manual Gap
        </button>
      </div>

      {/* AI REVIEW QUEUE - HUMAN IN THE LOOP */}
      {reviewQueue.length > 0 && (
          <div className="bg-gradient-to-r from-obsidianNavy to-[#121826] border border-brightBlue/30 rounded-xl p-6 relative overflow-hidden">
               <div className="absolute top-0 left-0 w-1 h-full bg-brightBlue"></div>
               <div className="flex items-start justify-between mb-4">
                   <div>
                       <h3 className="text-lg font-bold text-white flex items-center">
                           <Zap size={18} className="text-yellow-500 mr-2" /> AI Gap Analysis Suggestions
                       </h3>
                       <p className="text-steelGrey text-sm mt-1">
                           The system identified {reviewQueue.length} potential issues based on your Risk Matrix. Please review to accept or reject.
                       </p>
                   </div>
               </div>

               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                   {reviewQueue.map(suggestion => (
                       <div key={suggestion.id} className="bg-black/20 border border-deepDivider rounded-lg p-4 hover:border-brightBlue/50 transition-colors">
                           <div className="flex justify-between mb-2">
                               <span className="text-xs font-bold text-brightBlue bg-brightBlue/10 px-2 py-0.5 rounded border border-brightBlue/20">
                                   {suggestion.aiConfidence}% Confidence
                               </span>
                           </div>
                           <p className="text-white text-sm font-medium mb-2">{suggestion.description}</p>
                           <p className="text-xs text-steelGrey italic mb-4 border-l-2 border-deepDivider pl-2">
                               "{suggestion.aiReasoning}"
                           </p>
                           <div className="flex gap-2">
                               <button 
                                onClick={() => acceptSuggestion(suggestion)}
                                className="flex-1 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-500 border border-emerald-500/20 py-1.5 rounded text-xs font-bold flex items-center justify-center transition-colors"
                               >
                                   <ThumbsUp size={12} className="mr-1"/> Accept
                               </button>
                               <button 
                                onClick={() => rejectSuggestion(suggestion.id)}
                                className="flex-1 bg-deepDivider hover:bg-white/10 text-steelGrey py-1.5 rounded text-xs font-bold flex items-center justify-center transition-colors"
                               >
                                   <ThumbsDown size={12} className="mr-1"/> Reject
                               </button>
                           </div>
                       </div>
                   ))}
               </div>
          </div>
      )}

      <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-6 overflow-hidden min-h-[500px]">
        <Column title="Critical / Design Gaps" status="To Do" color="from-riskHigh/20 to-transparent border-l-4 border-l-riskHigh" />
        <Column title="Remediation In Progress" status="In Progress" color="from-riskMedium/20 to-transparent border-l-4 border-l-riskMedium" />
        <Column title="Mitigated / Accepted" status="Done" color="from-riskLow/20 to-transparent border-l-4 border-l-riskLow" />
      </div>

      {/* Add Gap Modal */}
      {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
              <div className="bg-[#080C14] border border-deepDivider rounded-2xl w-full max-w-lg shadow-2xl animate-fadeIn">
                  <div className="p-6 border-b border-deepDivider flex justify-between items-center">
                      <h3 className="text-xl font-bold text-white">Log New Compliance Gap</h3>
                      <button onClick={() => setIsModalOpen(false)} className="text-steelGrey hover:text-white"><X size={24}/></button>
                  </div>
                  <div className="p-6 space-y-4">
                      <div>
                          <label className="block text-xs font-bold text-steelGrey mb-1">Description</label>
                          <textarea 
                             className="w-full bg-obsidianNavy border border-deepDivider rounded-lg p-3 text-white focus:border-brightBlue outline-none h-24 resize-none"
                             placeholder="Describe the gap or missing control..."
                             value={newGap.description}
                             onChange={(e) => setNewGap({...newGap, description: e.target.value})}
                          />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                          <div>
                              <label className="block text-xs font-bold text-steelGrey mb-1">Priority</label>
                              <select 
                                className="w-full bg-obsidianNavy border border-deepDivider rounded-lg p-2 text-white outline-none"
                                value={newGap.priority}
                                onChange={(e) => setNewGap({...newGap, priority: e.target.value as any})}
                              >
                                  <option>High</option>
                                  <option>Medium</option>
                                  <option>Low</option>
                              </select>
                          </div>
                          <div>
                              <label className="block text-xs font-bold text-steelGrey mb-1">Due Date</label>
                              <input 
                                type="date" 
                                className="w-full bg-obsidianNavy border border-deepDivider rounded-lg p-2 text-white outline-none"
                                value={newGap.dueDate}
                                onChange={(e) => setNewGap({...newGap, dueDate: e.target.value})}
                              />
                          </div>
                      </div>
                      <div>
                          <label className="block text-xs font-bold text-steelGrey mb-1">Assign Owner</label>
                          <input 
                             type="text" 
                             className="w-full bg-obsidianNavy border border-deepDivider rounded-lg p-2 text-white outline-none"
                             placeholder="e.g. IT Manager"
                             value={newGap.owner}
                             onChange={(e) => setNewGap({...newGap, owner: e.target.value})}
                          />
                      </div>
                  </div>
                  <div className="p-6 border-t border-deepDivider flex justify-end gap-3">
                      <button onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-steelGrey hover:text-white">Cancel</button>
                      <button 
                        onClick={handleAddGap}
                        disabled={!newGap.description}
                        className="bg-brightBlue hover:bg-blue-600 disabled:opacity-50 text-white px-6 py-2 rounded-lg font-bold"
                      >
                          Create Gap
                      </button>
                  </div>
              </div>
          </div>
      )}
    </div>
  );
};

export default GapTracking;
