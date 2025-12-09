
import React, { useState, useEffect } from 'react';
import { AlertOctagon, MoreHorizontal, Plus, Clock, AlertTriangle } from 'lucide-react';
import { AuditPackage, Gap } from '../types';

interface GapTrackingProps {
  data: AuditPackage | null;
  navigate: (route: any) => void;
  onUpdate?: (gaps: Gap[]) => void;
}

const GapTracking: React.FC<GapTrackingProps> = ({ data, navigate, onUpdate }) => {
  const [gaps, setGaps] = useState<Gap[]>([]);

  useEffect(() => {
    if (data) {
      if (data.gaps && data.gaps.length > 0) {
        // Use existing persisted gaps
        setGaps(data.gaps);
      } else {
        // Simulate gaps based on AI recommendations and risks
        const initialGaps: Gap[] = [
            ...data.audit_score.recommendations.map((rec, i) => ({
            id: `G${String(i + 1).padStart(2, '0')}`,
            description: rec,
            linkedRisk: 'General',
            linkedControl: 'N/A',
            owner: 'Unassigned',
            status: 'To Do' as const,
            priority: 'High' as const,
            dueDate: '2024-05-20'
            })),
            // Add fake gaps from risks
            ...data.risks.slice(0, 2).map((r, i) => ({
            id: `G${String(i + 5).padStart(2, '0')}`,
            description: `Mitigation needed for: ${r.description}`,
            linkedRisk: r.id,
            linkedControl: r.linked_controls[0] || 'Missing',
            owner: 'Process Owner',
            status: 'In Progress' as const,
            priority: (r.inherent_rating.impact === 'High' ? 'High' : 'Medium') as 'High' | 'Medium' | 'Low',
            dueDate: '2024-06-15'
            }))
        ];
        setGaps(initialGaps);
        if (onUpdate) onUpdate(initialGaps);
      }
    }
  }, [data]);

  const moveGap = (id: string, newStatus: Gap['status']) => {
    const newGaps = gaps.map(g => g.id === id ? { ...g, status: newStatus } : g);
    setGaps(newGaps);
    if (onUpdate) onUpdate(newGaps);
  };

  const Column = ({ title, status, color }: { title: string, status: Gap['status'], color: string }) => (
    <div className="flex-1 bg-obsidianNavy/50 border border-deepDivider rounded-xl flex flex-col h-full min-h-[500px]">
      <div className={`p-4 border-b border-deepDivider flex justify-between items-center ${color}`}>
        <h3 className="font-bold text-white">{title}</h3>
        <span className="bg-black/30 px-2 py-0.5 rounded text-xs text-white/80">
          {gaps.filter(g => g.status === status).length}
        </span>
      </div>
      <div className="p-3 space-y-3 flex-1 bg-[#080C14]/50">
        {gaps.filter(g => g.status === status).map(gap => (
          <div key={gap.id} className="bg-obsidianNavy p-4 rounded-lg border border-deepDivider hover:border-brightBlue/50 transition-all cursor-move shadow-sm group">
            <div className="flex justify-between items-start mb-2">
              <span className="text-xs font-mono text-steelGrey bg-deepDivider px-1.5 rounded">{gap.id}</span>
              <button className="text-steelGrey hover:text-white opacity-0 group-hover:opacity-100 transition-opacity"><MoreHorizontal size={14} /></button>
            </div>
            <p className="text-sm text-white mb-3 line-clamp-3">{gap.description}</p>
            <div className="flex items-center justify-between text-xs">
              <div className={`flex items-center ${
                gap.priority === 'High' ? 'text-riskHigh' : gap.priority === 'Medium' ? 'text-riskMedium' : 'text-riskLow'
              }`}>
                <AlertTriangle size={12} className="mr-1" /> {gap.priority}
              </div>
              <div className="flex items-center text-steelGrey">
                <Clock size={12} className="mr-1" /> {new Date(gap.dueDate).toLocaleDateString(undefined, {month:'short', day:'numeric'})}
              </div>
            </div>
            
            {/* Quick Actions for Demo */}
            <div className="mt-3 pt-2 border-t border-deepDivider/50 flex justify-between opacity-0 group-hover:opacity-100 transition-opacity">
                {status !== 'To Do' && <button onClick={() => moveGap(gap.id, 'To Do')} className="text-[10px] text-steelGrey hover:text-white">To Do</button>}
                {status !== 'In Progress' && <button onClick={() => moveGap(gap.id, 'In Progress')} className="text-[10px] text-steelGrey hover:text-white">Doing</button>}
                {status !== 'Done' && <button onClick={() => moveGap(gap.id, 'Done')} className="text-[10px] text-steelGrey hover:text-white">Done</button>}
            </div>
          </div>
        ))}
         {gaps.filter(g => g.status === status).length === 0 && (
             <div className="text-center py-8 text-steelGrey text-sm italic opacity-50">No gaps in this stage</div>
         )}
      </div>
    </div>
  );

  if (!data) {
     return (
      <div className="flex flex-col items-center justify-center h-[60vh] text-center bg-obsidianNavy/30 rounded-xl border border-deepDivider border-dashed">
        <div className="p-6 bg-obsidianNavy rounded-full mb-4">
          <AlertOctagon size={48} className="text-steelGrey" />
        </div>
        <h2 className="text-2xl font-bold text-white mb-2">Gap Analysis Unavailable</h2>
        <p className="text-steelGrey mb-6 max-w-md">Generate an audit package to automatically detect control gaps and missing evidence.</p>
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
    <div className="space-y-6 animate-fadeIn h-full flex flex-col">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-white">Gap Tracking System</h2>
          <p className="text-steelGrey text-sm">Manage remediation for {data.process_flow[0]?.title}</p>
        </div>
        <button className="bg-brightBlue hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-medium flex items-center shadow-lg shadow-blue-500/20">
            <Plus size={18} className="mr-2" /> Add Manual Gap
        </button>
      </div>

      <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-6 overflow-hidden min-h-[600px]">
        <Column title="Identified Gaps" status="To Do" color="border-l-4 border-l-riskHigh" />
        <Column title="Remediation In Progress" status="In Progress" color="border-l-4 border-l-riskMedium" />
        <Column title="Resolved" status="Done" color="border-l-4 border-l-riskLow" />
      </div>
    </div>
  );
};

export default GapTracking;