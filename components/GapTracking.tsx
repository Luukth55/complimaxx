
import React, { useState, useEffect, useMemo } from 'react';
import { AlertOctagon, Plus, Clock, AlertTriangle, X, ShieldAlert, ThumbsUp, ThumbsDown, Zap, Shield, ArrowRight } from 'lucide-react';
import { AuditPackage, Gap } from '../types';

interface GapTrackingProps {
  data: AuditPackage | null;
  navigate: (route: any) => void;
  onUpdate?: (gaps: Gap[]) => void;
}

interface ExtendedGap extends Gap {
    isAiSuggestion?: boolean;
    aiConfidence?: number;
    aiReasoning?: string;
}

const GapTracking: React.FC<GapTrackingProps> = ({ data, navigate, onUpdate }) => {
  const [gaps, setGaps] = useState<ExtendedGap[]>([]);
  const [reviewQueue, setReviewQueue] = useState<ExtendedGap[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
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
        const suggestions: ExtendedGap[] = [];
        let gapCounter = 1;

        // Analyze risks for potential gaps
        data.risks.forEach((risk) => {
            if (risk.residual_rating.impact === 'High') {
                suggestions.push({
                    id: `SUG-${gapCounter++}`,
                    description: `High Residual Risk: ${risk.description}`,
                    linkedRisk: risk.id,
                    linkedControl: risk.linked_controls[0] || 'N/A',
                    owner: 'Risk Officer',
                    status: 'To Do',
                    priority: 'High',
                    dueDate: new Date(Date.now() + 14 * 86400000).toISOString().split('T')[0],
                    isAiSuggestion: true,
                    aiConfidence: 92,
                    aiReasoning: "The current control landscape does not sufficiently cover the impact of this risk."
                });
            }
        });

        // Analyze manual controls
        data.controls.filter(c => c.automation_level === 'Manual' && c.frequency.includes('Daily')).forEach(c => {
             suggestions.push({
                    id: `SUG-${gapCounter++}`,
                    description: `Automation Required: ${c.title}`,
                    linkedRisk: 'Operational Error',
                    linkedControl: c.id,
                    owner: c.owner,
                    status: 'To Do',
                    priority: 'Medium',
                    dueDate: new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0],
                    isAiSuggestion: true,
                    aiConfidence: 85,
                    aiReasoning: "Manual daily controls are prone to error during scaling."
                });
        });

        setReviewQueue(suggestions);
      }
    }
  }, [data]);

  const moveGap = (id: string, newStatus: Gap['status']) => {
    const updated = gaps.map(g => g.id === id ? { ...g, status: newStatus } : g);
    setGaps(updated);
    if (onUpdate) onUpdate(updated);
  };

  const acceptSuggestion = (suggestion: ExtendedGap) => {
      const activeGap = { ...suggestion, id: `GAP-${Date.now().toString().slice(-4)}`, isAiSuggestion: false };
      const updatedGaps = [activeGap, ...gaps];
      setGaps(updatedGaps);
      setReviewQueue(reviewQueue.filter(g => g.id !== suggestion.id));
      if (onUpdate) onUpdate(updatedGaps);
  };

  const handleAddGap = () => {
      if (!newGap.description) return;
      const created: ExtendedGap = {
          id: `GAP-${Date.now().toString().slice(-4)}`,
          description: newGap.description,
          priority: newGap.priority as any,
          owner: newGap.owner || 'Unknown',
          dueDate: newGap.dueDate || new Date().toISOString().split('T')[0],
          status: 'To Do',
          linkedRisk: 'Manual',
          linkedControl: 'Manual',
          isAiSuggestion: false
      };
      const updated = [created, ...gaps];
      setGaps(updated);
      if (onUpdate) onUpdate(updated);
      setIsModalOpen(false);
      setNewGap({ description: '', priority: 'Medium', owner: '', dueDate: new Date().toISOString().split('T')[0] });
  };

  const Column = ({ title, status, color }: { title: string, status: Gap['status'], color: string }) => (
    <div className="flex-1 bg-[#080C14] border border-deepDivider rounded-xl flex flex-col min-h-[500px]">
      <div className={`p-4 border-b border-deepDivider flex justify-between items-center rounded-t-xl bg-gradient-to-r ${color}`}>
        <h3 className="font-black text-white text-[10px] uppercase tracking-widest">{title}</h3>
        <span className="bg-white/10 px-2 py-0.5 rounded text-[10px] text-white font-bold">
          {gaps.filter(g => g.status === status).length}
        </span>
      </div>
      <div className="p-3 space-y-3 flex-1 overflow-y-auto custom-scrollbar">
        {gaps.filter(g => g.status === status).map(gap => (
          <div key={gap.id} className="bg-obsidianNavy p-4 rounded-xl border border-deepDivider hover:border-brightBlue transition-all shadow-lg group relative animate-fadeIn">
            <div className="flex justify-between items-start mb-2">
              <span className="text-[9px] font-mono text-steelGrey uppercase">{gap.id}</span>
              <span className={`text-[9px] font-black uppercase px-1.5 py-0.5 rounded border ${
                gap.priority === 'High' ? 'text-riskHigh border-riskHigh/30 bg-riskHigh/5' : 'text-riskMedium border-riskMedium/30 bg-riskMedium/5'
              }`}>
                {gap.priority}
              </span>
            </div>
            <p className="text-xs text-white mb-4 font-bold leading-tight">{gap.description}</p>
            <div className="flex items-center justify-between text-[10px] text-steelGrey border-t border-deepDivider/50 pt-3">
              <div className="flex items-center">
                <Shield size={10} className="mr-1 text-brightBlue" /> {gap.linkedControl}
              </div>
              <div className="flex items-center"><Clock size={10} className="mr-1" /> {gap.dueDate}</div>
            </div>
            {/* Status Switcher Overlay */}
            <div className="absolute inset-0 bg-obsidianNavy/95 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-xl gap-2 px-4">
                {status !== 'To Do' && <button onClick={() => moveGap(gap.id, 'To Do')} className="flex-1 bg-deepDivider text-[9px] font-black uppercase py-2 rounded text-white">To Do</button>}
                {status !== 'In Progress' && <button onClick={() => moveGap(gap.id, 'In Progress')} className="flex-1 bg-brightBlue text-[9px] font-black uppercase py-2 rounded text-white">Progress</button>}
                {status !== 'Done' && <button onClick={() => moveGap(gap.id, 'Done')} className="flex-1 bg-emerald-500 text-[9px] font-black uppercase py-2 rounded text-white">Resolved</button>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="space-y-6 flex flex-col h-full animate-fadeIn">
      <div className="flex justify-between items-center bg-obsidianNavy p-6 rounded-2xl border border-deepDivider">
        <div>
          <h2 className="text-2xl font-black text-white">Gap Tracking & Remediation</h2>
          <p className="text-steelGrey text-sm">Manage findings and improvement points from your risk analysis.</p>
        </div>
        <button onClick={() => setIsModalOpen(true)} className="bg-brightBlue hover:bg-blue-600 text-white px-6 py-3 rounded-xl font-black text-xs uppercase tracking-widest shadow-lg flex items-center">
            <Plus size={18} className="mr-2" /> New Gap
        </button>
      </div>

      {reviewQueue.length > 0 && (
          <div className="bg-brightBlue/5 border border-brightBlue/20 rounded-2xl p-6">
               <div className="flex items-center gap-3 mb-6">
                   <div className="p-2 bg-brightBlue text-white rounded-lg"><Zap size={20} /></div>
                   <h3 className="text-lg font-bold text-white">AI Findings ({reviewQueue.length})</h3>
               </div>
               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                   {reviewQueue.map(suggestion => (
                       <div key={suggestion.id} className="bg-obsidianNavy/50 border border-deepDivider rounded-xl p-4 flex flex-col">
                           <div className="flex justify-between mb-2">
                               <span className="text-[9px] font-black text-brightBlue uppercase tracking-widest">{suggestion.aiConfidence}% Match</span>
                           </div>
                           <p className="text-white text-sm font-bold mb-2">{suggestion.description}</p>
                           <p className="text-[10px] text-steelGrey italic mb-4 flex-1">"{suggestion.aiReasoning}"</p>
                           <div className="flex gap-2">
                               <button onClick={() => acceptSuggestion(suggestion)} className="flex-1 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-500 border border-emerald-500/20 py-2 rounded text-[10px] font-black uppercase tracking-widest transition-all">Accept</button>
                               <button onClick={() => setReviewQueue(reviewQueue.filter(q => q.id !== suggestion.id))} className="flex-1 bg-white/5 hover:bg-white/10 text-steelGrey py-2 rounded text-[10px] font-black uppercase tracking-widest">Ignore</button>
                           </div>
                       </div>
                   ))}
               </div>
          </div>
      )}

      <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-6">
        <Column title="To Do" status="To Do" color="from-riskHigh/10 to-transparent border-l-4 border-riskHigh" />
        <Column title="In Remediation" status="In Progress" color="from-riskMedium/10 to-transparent border-l-4 border-riskMedium" />
        <Column title="Resolved" status="Done" color="from-riskLow/10 to-transparent border-l-4 border-riskLow" />
      </div>

      {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
              <div className="bg-[#080C14] border border-deepDivider rounded-2xl w-full max-w-lg shadow-2xl animate-fadeIn">
                  <div className="p-6 border-b border-deepDivider flex justify-between items-center">
                      <h3 className="text-xl font-bold text-white">Add Manual Gap</h3>
                      <button onClick={() => setIsModalOpen(false)} className="text-steelGrey hover:text-white"><X size={24}/></button>
                  </div>
                  <div className="p-6 space-y-4">
                      <div>
                          <label className="text-[10px] font-black text-steelGrey uppercase tracking-widest block mb-2">Description</label>
                          <textarea 
                             className="w-full bg-obsidianNavy border border-deepDivider rounded-xl p-4 text-sm text-white focus:border-brightBlue outline-none h-32 resize-none"
                             placeholder="What is the finding?"
                             value={newGap.description}
                             onChange={(e) => setNewGap({...newGap, description: e.target.value})}
                          />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                          <div>
                              <label className="text-[10px] font-black text-steelGrey uppercase tracking-widest block mb-2">Priority</label>
                              <select 
                                className="w-full bg-obsidianNavy border border-deepDivider rounded-lg p-2 text-sm text-white outline-none"
                                value={newGap.priority}
                                onChange={(e) => setNewGap({...newGap, priority: e.target.value as any})}
                              >
                                  <option>High</option><option>Medium</option><option>Low</option>
                              </select>
                          </div>
                          <div>
                              <label className="text-[10px] font-black text-steelGrey uppercase tracking-widest block mb-2">Owner</label>
                              <input 
                                type="text" 
                                className="w-full bg-obsidianNavy border border-deepDivider rounded-lg p-2 text-sm text-white outline-none"
                                placeholder="Owner..."
                                value={newGap.owner}
                                onChange={(e) => setNewGap({...newGap, owner: e.target.value})}
                              />
                          </div>
                      </div>
                  </div>
                  <div className="p-6 border-t border-deepDivider flex justify-end gap-3">
                      <button onClick={() => setIsModalOpen(false)} className="px-6 py-2 text-xs font-black text-steelGrey uppercase tracking-widest">Cancel</button>
                      <button onClick={handleAddGap} disabled={!newGap.description} className="bg-brightBlue hover:bg-blue-600 disabled:opacity-50 text-white px-8 py-2 rounded-lg font-black text-xs uppercase tracking-widest">Create</button>
                  </div>
              </div>
          </div>
      )}
    </div>
  );
};

export default GapTracking;
