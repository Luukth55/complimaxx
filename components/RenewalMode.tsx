
import React from 'react';
import { RefreshCw, ArrowRight, ArrowDownRight } from 'lucide-react';

interface RenewalModeProps {
  navigate: (route: any) => void;
}

const RenewalMode: React.FC<RenewalModeProps> = ({ navigate }) => {
  // Mock data for renewal comparison
  const comparisonData = {
    previousYear: '2023 Audit',
    currentYear: '2024 Renewal',
    changes: [
      { id: 'R03', type: 'Risk', change: 'decreased', prev: 'High', curr: 'Medium', reason: 'New automation controls implemented (C19)' },
      { id: 'C12', type: 'Control', change: 'modified', prev: 'Manual', curr: 'Semi-Automated', reason: 'Tool upgrade' },
      { id: 'P04', type: 'Process', change: 'added', prev: '-', curr: 'New Step', reason: 'Compliance requirement NIS2' },
    ]
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      <div className="flex justify-between items-center border-b border-deepDivider pb-6">
        <div>
          <div className="flex items-center space-x-3 mb-2">
             <div className="p-2 bg-purple-500/20 rounded-lg text-purple-400">
                <RefreshCw size={24} />
             </div>
             <h2 className="text-2xl font-bold text-white">Yearly Renewal Mode</h2>
          </div>
          <p className="text-steelGrey max-w-2xl">
            Automatically compare previous audit cycles with current process inputs to detect drift, new risks, and effectiveness changes.
          </p>
        </div>
        <button className="bg-white text-techBlack hover:bg-gray-100 px-6 py-3 rounded-lg font-bold flex items-center transition-colors">
          Start Renewal Scan <ArrowRight size={18} className="ml-2" />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-obsidianNavy border border-deepDivider rounded-xl p-6">
            <h3 className="text-lg font-bold text-white mb-4">Risk Profile Evolution</h3>
            <div className="h-64 flex items-end justify-around pb-4 border-b border-deepDivider relative">
                {/* Simple Bar Chart Mock */}
                <div className="w-16 bg-deepDivider/50 rounded-t-lg relative group h-[60%]">
                    <div className="absolute bottom-0 w-full bg-riskHigh rounded-t-lg h-[80%] transition-all group-hover:brightness-110"></div>
                    <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-xs text-steelGrey">2023</span>
                </div>
                <div className="w-16 bg-deepDivider/50 rounded-t-lg relative group h-[60%]">
                    <div className="absolute bottom-0 w-full bg-riskMedium rounded-t-lg h-[40%] transition-all group-hover:brightness-110"></div>
                     <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-xs text-white font-bold">2024</span>
                </div>
            </div>
            <div className="mt-4 flex justify-between text-sm">
                <span className="text-steelGrey">Residual Risk Score</span>
                <span className="text-riskLow font-bold flex items-center"><ArrowDownRight size={16} className="mr-1" /> -42% Improved</span>
            </div>
        </div>

        <div className="bg-obsidianNavy border border-deepDivider rounded-xl p-6">
            <h3 className="text-lg font-bold text-white mb-4">Control Effectiveness</h3>
             <div className="space-y-4">
                 <div>
                    <div className="flex justify-between text-sm mb-1">
                        <span className="text-white">Automation Level</span>
                        <span className="text-brightBlue">65% (+15%)</span>
                    </div>
                    <div className="w-full bg-deepDivider h-2 rounded-full overflow-hidden">
                        <div className="bg-brightBlue h-full" style={{width: '65%'}}></div>
                    </div>
                 </div>
                 <div>
                    <div className="flex justify-between text-sm mb-1">
                        <span className="text-white">Evidence Coverage</span>
                        <span className="text-emerald-500">92% (+8%)</span>
                    </div>
                    <div className="w-full bg-deepDivider h-2 rounded-full overflow-hidden">
                        <div className="bg-emerald-500 h-full" style={{width: '92%'}}></div>
                    </div>
                 </div>
             </div>
        </div>
      </div>

      <div>
        <h3 className="text-xl font-bold text-white mb-4">Detected Changes</h3>
        <div className="bg-obsidianNavy border border-deepDivider rounded-xl overflow-hidden">
            <table className="w-full text-left">
                <thead className="bg-[#080C14] border-b border-deepDivider">
                    <tr>
                        <th className="p-4 text-steelGrey font-medium">ID</th>
                        <th className="p-4 text-steelGrey font-medium">Type</th>
                        <th className="p-4 text-steelGrey font-medium">Change</th>
                        <th className="p-4 text-steelGrey font-medium">2023 Value</th>
                        <th className="p-4 text-steelGrey font-medium">2024 Value</th>
                        <th className="p-4 text-steelGrey font-medium">Reason</th>
                    </tr>
                </thead>
                <tbody>
                    {comparisonData.changes.map((item, i) => (
                        <tr key={i} className="border-b border-deepDivider/50 hover:bg-white/5 transition-colors">
                            <td className="p-4 text-steelGrey font-mono text-sm">{item.id}</td>
                            <td className="p-4 text-white text-sm">{item.type}</td>
                            <td className="p-4">
                                <span className={`text-xs px-2 py-1 rounded font-bold uppercase ${
                                    item.change === 'decreased' ? 'bg-emerald-500/10 text-emerald-500' :
                                    item.change === 'added' ? 'bg-brightBlue/10 text-brightBlue' :
                                    'bg-yellow-500/10 text-yellow-500'
                                }`}>
                                    {item.change}
                                </span>
                            </td>
                            <td className="p-4 text-steelGrey text-sm">{item.prev}</td>
                            <td className="p-4 text-white text-sm">{item.curr}</td>
                            <td className="p-4 text-steelGrey text-sm italic">{item.reason}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
      </div>
    </div>
  );
};

export default RenewalMode;