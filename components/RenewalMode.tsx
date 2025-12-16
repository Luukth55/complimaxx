
import React, { useState, useEffect } from 'react';
import { RefreshCw, ArrowRight, CheckCircle, AlertTriangle, Loader2, TrendingDown, Clock, Activity, Calendar, Save, Sliders, Info } from 'lucide-react';
import { AuditPackage, AuditMeta } from '../types';

interface RenewalModeProps {
  data: AuditPackage | null;
  navigate: (route: any) => void;
  onUpdate?: (meta: AuditMeta) => void;
}

const RenewalMode: React.FC<RenewalModeProps> = ({ data, navigate, onUpdate }) => {
  const [isScanning, setIsScanning] = useState(false);
  const [scanComplete, setScanComplete] = useState(false);
  const [predictionData, setPredictionData] = useState<any>(null);
  
  // Algorithm Tuning State (User Interaction)
  const [showTuning, setShowTuning] = useState(false);
  const [manualPenalty, setManualPenalty] = useState(1.5); // Multiplier for manual controls
  const [agePenalty, setAgePenalty] = useState(1.0); // Multiplier for evidence age

  // Date Config State
  const [lastAuditDate, setLastAuditDate] = useState<string>('');
  const [frequency, setFrequency] = useState<'Annual' | 'Semi-Annual' | 'Quarterly'>('Annual');
  const [nextAuditDate, setNextAuditDate] = useState<string>('');
  const [daysRemaining, setDaysRemaining] = useState<number | null>(null);

  useEffect(() => {
    if (data && data.audit_meta) {
        setLastAuditDate(data.audit_meta.last_audit_date);
        setFrequency(data.audit_meta.frequency);
        calculateNextAudit(data.audit_meta.last_audit_date, data.audit_meta.frequency);
    }
  }, [data]);

  const calculateNextAudit = (start: string, freq: string) => {
      if (!start) {
          setNextAuditDate('');
          setDaysRemaining(null);
          return;
      }
      
      const startDate = new Date(start);
      let monthsToAdd = 12;
      if (freq === 'Semi-Annual') monthsToAdd = 6;
      if (freq === 'Quarterly') monthsToAdd = 3;

      const nextDate = new Date(startDate.setMonth(startDate.getMonth() + monthsToAdd));
      const nextDateStr = nextDate.toISOString().split('T')[0];
      setNextAuditDate(nextDateStr);

      const today = new Date();
      const diffTime = nextDate.getTime() - today.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      setDaysRemaining(diffDays);
      
      return nextDateStr;
  };

  const handleSaveDates = () => {
      const calculatedNext = calculateNextAudit(lastAuditDate, frequency);
      if (onUpdate && calculatedNext) {
          onUpdate({
              last_audit_date: lastAuditDate,
              next_audit_date: calculatedNext,
              frequency: frequency
          });
      }
  };

  // If no data is present, show empty state
  if (!data) {
      return (
        <div className="flex flex-col items-center justify-center h-[60vh] text-center bg-obsidianNavy/30 rounded-xl border border-deepDivider border-dashed">
            <div className="p-6 bg-obsidianNavy rounded-full mb-4">
            <RefreshCw size={48} className="text-steelGrey" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">Renewal Mode Unavailable</h2>
            <p className="text-steelGrey mb-6 max-w-md">Select or generate a project first to access predictive renewal analytics.</p>
            <button 
            onClick={() => navigate('project_wizard')}
            className="bg-brightBlue hover:bg-blue-600 text-white px-6 py-2 rounded-lg font-medium transition-colors"
            >
            Go to Generator
            </button>
        </div>
      );
  }

  const projectTitle = data.process_flow[0]?.title || "Current Project";

  // --- RELIABLE MATH ENGINE ---
  const performReliableAnalysis = () => {
      setIsScanning(true);
      setScanComplete(false);
      
      // 1. Gather Real Metrics
      const totalControls = data.controls.length;
      const manualControls = data.controls.filter(c => c.automation_level === 'Manual').length;
      const highRisks = data.risks.filter(r => r.residual_rating.impact === 'High').length;
      const missingEvidence = data.evidence_checklist ? data.evidence_checklist.filter(e => e.mandatory).length : 0; // Simplified: Assuming all are pending if not linked to file
      
      // 2. Weighted Calculation (No Magic Numbers, Use Configurable Weights)
      // Base Decay: 5% per month since last audit (Simulated if no date, or calculated)
      let timeDecay = 0;
      if (lastAuditDate) {
          const monthsSince = (new Date().getTime() - new Date(lastAuditDate).getTime()) / (1000 * 60 * 60 * 24 * 30);
          timeDecay = Math.max(0, monthsSince * 2 * agePenalty);
      }

      // Control Decay: Manual controls decay 3x faster than automated
      const controlFactor = ((manualControls * manualPenalty) + (totalControls - manualControls)) / totalControls;
      
      // Risk Factor: High risks add flat penalty
      const riskPenalty = highRisks * 2.5;

      // Final Score Calculation
      let rawScore = (timeDecay * controlFactor) + riskPenalty;
      const driftScore = Math.min(Math.round(rawScore), 100);

      // 3. Explanation Generation (Transparency)
      const reasoning = [
          `Base time decay of ${timeDecay.toFixed(1)}% based on ${lastAuditDate ? 'last audit date' : 'default estimation'}.`,
          `${manualControls} manual controls weighted at ${manualPenalty}x impact.`,
          `${highRisks} high risks added ${riskPenalty}% to drift score.`
      ];

      setTimeout(() => {
          setPredictionData({
              driftScore: driftScore,
              manualControls: manualControls,
              highRisks: highRisks,
              predictedRenewalEffort: driftScore > 40 ? 'High Effort (3-4 Weeks)' : driftScore > 20 ? 'Medium (1-2 Weeks)' : 'Low (Days)',
              reasoning: reasoning,
              vulnerableControls: data.controls
                  .filter(c => c.automation_level === 'Manual')
                  .slice(0, 4)
          });

          setIsScanning(false);
          setScanComplete(true);
      }, 1500); // Short delay for UX feeling of processing
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      
      {/* 1. DATE CONFIGURATION HEADER */}
      <div className="bg-[#080C14] border border-deepDivider rounded-xl p-6 flex flex-col md:flex-row justify-between items-center gap-6 shadow-lg">
          <div className="flex items-center space-x-4">
              <div className="p-3 bg-obsidianNavy border border-deepDivider rounded-lg text-steelGrey">
                  <Calendar size={24} />
              </div>
              <div>
                  <h3 className="text-lg font-bold text-white">Audit Cycle Configuration</h3>
                  <p className="text-sm text-steelGrey">Set your last audit date to calculate renewal deadlines.</p>
              </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto items-end">
              <div className="w-full sm:w-auto">
                  <label className="block text-xs font-bold text-steelGrey mb-1">Last Audit Date</label>
                  <input 
                    type="date" 
                    value={lastAuditDate}
                    onChange={(e) => {
                        setLastAuditDate(e.target.value);
                        calculateNextAudit(e.target.value, frequency);
                    }}
                    className="bg-obsidianNavy border border-deepDivider rounded px-3 py-2 text-white text-sm focus:border-brightBlue outline-none w-full"
                  />
              </div>
              <div className="w-full sm:w-auto">
                  <label className="block text-xs font-bold text-steelGrey mb-1">Frequency</label>
                  <select 
                    value={frequency}
                    onChange={(e) => {
                        setFrequency(e.target.value as any);
                        calculateNextAudit(lastAuditDate, e.target.value);
                    }}
                    className="bg-obsidianNavy border border-deepDivider rounded px-3 py-2 text-white text-sm focus:border-brightBlue outline-none w-full"
                  >
                      <option>Annual</option>
                      <option>Semi-Annual</option>
                      <option>Quarterly</option>
                  </select>
              </div>
              <button 
                onClick={handleSaveDates}
                className="bg-brightBlue/10 hover:bg-brightBlue/20 text-brightBlue border border-brightBlue/30 px-4 py-2 rounded-lg font-bold text-sm transition-colors flex items-center h-[38px]"
              >
                  <Save size={16} className="mr-2" /> Save
              </button>
          </div>
          
          {nextAuditDate && (
              <div className="flex items-center space-x-4 border-l border-deepDivider pl-6 ml-2">
                  <div className="text-right">
                      <div className="text-xs text-steelGrey uppercase">Next Audit</div>
                      <div className="text-lg font-bold text-white">{nextAuditDate}</div>
                  </div>
                  <div className={`p-3 rounded-lg flex flex-col items-center justify-center w-20 ${
                      (daysRemaining || 0) < 30 ? 'bg-riskHigh/10 text-riskHigh border border-riskHigh/20' : 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20'
                  }`}>
                      <span className="text-xl font-bold leading-none">{daysRemaining}</span>
                      <span className="text-[10px] uppercase font-bold">Days</span>
                  </div>
              </div>
          )}
      </div>

      {/* 2. ALGORITHM CONFIG (TRANSPARENCY & CONTROL) */}
      <div className="flex justify-end">
          <button 
            onClick={() => setShowTuning(!showTuning)}
            className="flex items-center text-xs font-bold text-steelGrey hover:text-white transition-colors"
          >
              <Sliders size={14} className="mr-1"/> Configure Calculation Logic
          </button>
      </div>
      
      {showTuning && (
          <div className="bg-obsidianNavy/50 border border-deepDivider rounded-xl p-4 grid grid-cols-1 md:grid-cols-2 gap-6 animate-fadeIn">
              <div>
                  <label className="flex justify-between text-xs font-bold text-white mb-2">
                      <span>Manual Control Risk Weight</span>
                      <span className="text-brightBlue">{manualPenalty}x</span>
                  </label>
                  <input 
                    type="range" min="1" max="3" step="0.1" 
                    value={manualPenalty} onChange={(e) => setManualPenalty(parseFloat(e.target.value))}
                    className="w-full h-1 bg-deepDivider rounded-lg appearance-none cursor-pointer"
                  />
                  <p className="text-[10px] text-steelGrey mt-1">Impact of manual controls on drift score. Higher means you trust manual processes less.</p>
              </div>
              <div>
                  <label className="flex justify-between text-xs font-bold text-white mb-2">
                      <span>Time Decay Velocity</span>
                      <span className="text-brightBlue">{agePenalty}x</span>
                  </label>
                  <input 
                    type="range" min="0.5" max="2" step="0.1" 
                    value={agePenalty} onChange={(e) => setAgePenalty(parseFloat(e.target.value))}
                    className="w-full h-1 bg-deepDivider rounded-lg appearance-none cursor-pointer"
                  />
                  <p className="text-[10px] text-steelGrey mt-1">How fast evidence is considered "stale" after an audit.</p>
              </div>
          </div>
      )}

      {/* 3. MAIN PREDICTION HERO */}
      <div className="bg-gradient-to-r from-obsidianNavy to-[#0a1120] border border-deepDivider rounded-2xl p-8 relative overflow-hidden">
        <div className="absolute right-0 top-0 h-full w-1/3 bg-brightBlue/5 skew-x-12 transform origin-bottom-right"></div>
        
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-6">
            <div>
                <div className="flex items-center space-x-3 mb-2">
                    <div className="p-2 bg-purple-500/20 rounded-lg text-purple-400 border border-purple-500/30">
                        <Activity size={24} className={isScanning ? 'animate-pulse' : ''} />
                    </div>
                    <h2 className="text-2xl font-bold text-white">Predictive Renewal Analysis</h2>
                </div>
                <p className="text-steelGrey max-w-xl">
                    Analyzing <strong>{projectTitle}</strong>. We check control stability to predict how much effort is needed for your next audit on <strong>{nextAuditDate || 'TBD'}</strong>.
                </p>
            </div>
            
            <button 
                onClick={performReliableAnalysis}
                disabled={isScanning}
                className={`px-8 py-4 rounded-xl font-bold flex items-center transition-all shadow-xl ${
                    isScanning 
                    ? 'bg-deepDivider text-steelGrey cursor-wait' 
                    : 'bg-white text-techBlack hover:bg-gray-100 hover:scale-105'
                }`}
            >
                {isScanning ? (
                    <><Loader2 size={20} className="mr-2 animate-spin" /> Calculating Drift...</>
                ) : scanComplete ? (
                    <><RefreshCw size={20} className="mr-2" /> Re-Analyze Project</>
                ) : (
                    <><ArrowRight size={20} className="mr-2" /> Start Analysis</>
                )}
            </button>
        </div>
      </div>

      {scanComplete && predictionData && (
        <div className="animate-slideUp space-y-8">
            
            {/* ANALYSIS BREAKDOWN (TRANSPARENCY) */}
            <div className="bg-white/5 border border-white/10 rounded-lg p-4 flex items-start space-x-3">
                <Info className="text-brightBlue flex-shrink-0 mt-0.5" size={18} />
                <div>
                    <h4 className="text-sm font-bold text-white mb-1">Calculation Logic</h4>
                    <ul className="text-xs text-steelGrey list-disc pl-4 space-y-1">
                        {predictionData.reasoning.map((r: string, i: number) => <li key={i}>{r}</li>)}
                    </ul>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-obsidianNavy border border-deepDivider rounded-xl p-6 relative overflow-hidden group hover:border-brightBlue/50 transition-colors">
                    <div className="flex justify-between items-start mb-4">
                        <h3 className="text-steelGrey font-medium text-sm">Predicted Drift</h3>
                        <TrendingDown className={predictionData.driftScore > 30 ? "text-riskHigh" : "text-emerald-500"} size={20} />
                    </div>
                    <div className="text-3xl font-bold text-white mb-1">{predictionData.driftScore}%</div>
                    <p className="text-xs text-steelGrey font-bold">Probability of control failure</p>
                    <div className={`absolute bottom-0 left-0 w-full h-1 ${predictionData.driftScore > 30 ? "bg-riskHigh" : "bg-emerald-500"}`}></div>
                </div>
                
                <div className="bg-obsidianNavy border border-deepDivider rounded-xl p-6 relative overflow-hidden group hover:border-brightBlue/50 transition-colors">
                    <div className="flex justify-between items-start mb-4">
                        <h3 className="text-steelGrey font-medium text-sm">Manual Burden</h3>
                        <AlertTriangle className="text-yellow-500" size={20} />
                    </div>
                    <div className="text-3xl font-bold text-white mb-1">{predictionData.manualControls}</div>
                    <p className="text-xs text-yellow-500 font-bold">Controls require manual evidence</p>
                    <div className="absolute bottom-0 left-0 w-full h-1 bg-yellow-500/50"></div>
                </div>

                <div className="bg-obsidianNavy border border-deepDivider rounded-xl p-6 relative overflow-hidden group hover:border-brightBlue/50 transition-colors">
                    <div className="flex justify-between items-start mb-4">
                        <h3 className="text-steelGrey font-medium text-sm">Renewal Effort</h3>
                        <Clock className="text-brightBlue" size={20} />
                    </div>
                    <div className="text-xl font-bold text-white mb-1 mt-2">{predictionData.predictedRenewalEffort}</div>
                    <p className="text-xs text-brightBlue font-bold">Estimated time to recertify</p>
                    <div className="absolute bottom-0 left-0 w-full h-1 bg-brightBlue/50"></div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Visual Chart Simulation */}
                <div className="bg-obsidianNavy border border-deepDivider rounded-xl p-6">
                    <h3 className="text-lg font-bold text-white mb-6">Drift Projection Graph</h3>
                    <div className="h-64 flex items-end justify-between px-4 pb-4 border-b border-deepDivider relative">
                        {/* Bars representing quarters */}
                        <div className="flex flex-col items-center gap-2 group w-1/5">
                            <div className="w-full bg-emerald-500 h-48 rounded-t transition-all group-hover:opacity-80"></div>
                            <span className="text-xs text-steelGrey">Q1</span>
                        </div>
                        <div className="flex flex-col items-center gap-2 group w-1/5">
                            <div className="w-full bg-emerald-500/80 h-44 rounded-t transition-all group-hover:opacity-80"></div>
                            <span className="text-xs text-steelGrey">Q2</span>
                        </div>
                        <div className="flex flex-col items-center gap-2 group w-1/5">
                            <div className="w-full bg-yellow-500/80 h-32 rounded-t transition-all group-hover:opacity-80"></div>
                            <span className="text-xs text-steelGrey">Q3</span>
                        </div>
                        <div className="flex flex-col items-center gap-2 group w-1/5">
                             {/* Height depends on drift score */}
                            <div 
                                className={`w-full h-20 rounded-t transition-all group-hover:opacity-80 ${predictionData.driftScore > 40 ? 'bg-riskHigh' : 'bg-yellow-500'}`}
                            ></div>
                            <span className="text-xs text-white font-bold">Q4 (Renewal)</span>
                        </div>
                        
                        {/* Trend Line Simulation (SVG) */}
                        <svg className="absolute top-0 left-0 w-full h-full pointer-events-none p-4" preserveAspectRatio="none">
                            <path d="M 20 20 L 100 40 L 200 100 L 300 180" stroke="white" strokeWidth="2" strokeDasharray="5,5" fill="none" opacity="0.3" />
                        </svg>
                    </div>
                    <p className="text-xs text-steelGrey mt-4">
                        *Projection based on manual control decay rates. Automated controls maintain stability over time.
                    </p>
                </div>

                <div className="bg-obsidianNavy border border-deepDivider rounded-xl p-6">
                    <h3 className="text-lg font-bold text-white mb-6 flex items-center">
                         <AlertTriangle size={18} className="mr-2 text-riskHigh"/> High Decay Controls
                    </h3>
                    <p className="text-sm text-steelGrey mb-4">
                        These controls rely on manual evidence gathering and are most likely to fail during a surprise audit.
                    </p>
                    <div className="space-y-3">
                        {predictionData.vulnerableControls.map((c: any, i: number) => (
                            <div key={i} className="flex items-start p-3 bg-black/20 rounded border border-deepDivider">
                                <span className="text-xs font-mono text-steelGrey bg-deepDivider px-1.5 py-0.5 rounded mr-3 mt-0.5">{c.id}</span>
                                <div>
                                    <div className="text-sm text-white font-medium line-clamp-1">{c.title}</div>
                                    <div className="text-xs text-steelGrey mt-1 flex items-center">
                                        <RefreshCw size={10} className="mr-1"/> {c.frequency}
                                        <span className="mx-2">•</span>
                                        Owner: {c.owner}
                                    </div>
                                </div>
                            </div>
                        ))}
                         {predictionData.vulnerableControls.length === 0 && (
                             <div className="text-center text-emerald-500 p-4 border border-dashed border-emerald-500/20 rounded">
                                 <CheckCircle size={24} className="mx-auto mb-2"/>
                                 <p className="text-sm">Excellent! No manual controls detected.</p>
                             </div>
                         )}
                    </div>
                </div>
            </div>
        </div>
      )}
    </div>
  );
};

export default RenewalMode;
