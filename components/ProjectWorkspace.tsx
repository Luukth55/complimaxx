
import React, { useState, useEffect } from 'react';
import { 
  ArrowRight, 
  ArrowLeft, 
  FileText, 
  Check, 
  Search, 
  AlertTriangle,
  Shield,
  Lock,
  Server,
  Briefcase,
  Scale,
  Activity,
  Factory,
  Leaf,
  Globe,
  X,
  Users,
  Plus,
  Trash2,
  ChevronDown,
  ChevronUp,
  Database,
  Zap,
  Clock
} from 'lucide-react';
import { generateAuditPackage } from '../services/geminiService';
import { AuditPackage, AppRoute } from '../types';

interface ProjectWorkspaceProps {
  onComplete: (data: AuditPackage) => void;
  navigate: (route: AppRoute) => void;
}

const FRAMEWORK_CATEGORIES = [
  {
    name: "Privacy & Data Protection",
    icon: Lock,
    frameworks: [
      "GDPR (EU)",
      "CCPA – California Consumer Privacy Act",
      "CPRA – California Privacy Rights Act",
      "DPA – UK Data Protection Act",
      "LGPD – Brazil",
      "PDPA – Singapore",
      "PDPA – Thailand",
      "POPIA – South Africa",
      "PIPEDA – Canada",
      "KVKK – Turkey",
      "VCDPA – Virginia Data Protection Act",
      "UCPA – Utah Consumer Privacy Act",
      "CTDPA – Connecticut Data Privacy Act",
      "ColoPA – Colorado Privacy Act",
      "COPPA – Children’s Online Privacy Protection Act",
      "GLBA – Gramm-Leach-Bliley Act (financial privacy)",
      "FERPA – Family Educational Rights and Privacy Act",
      "HIPAA Privacy Rule"
    ]
  },
  {
    name: "Security & Cybersecurity",
    icon: Shield,
    frameworks: [
      "ISO 27001 – ISMS",
      "ISO 27002 – Security Controls",
      "ISO 27005 – Information Security Risk",
      "ISO 27017 – Cloud Security",
      "ISO 27018 – Cloud PII Protection",
      "ISO 27035 – Incident Management",
      "ISO 27701 – Privacy Information Management",
      "ISO 27799 – Health Information Security",
      "NIST CSF – Cybersecurity Framework",
      "NIST 800-53 – Security & Privacy Controls",
      "NIST 800-171 – Nonfederal Systems Security",
      "SOC 1 – System & Organization Controls",
      "SOC 2 – Trust Services Criteria",
      "SOC 3 – Public SOC report",
      "COBIT 5 / COBIT 2019 – IT Governance",
      "CIS Controls – v8",
      "CMMC – Cybersecurity Maturity Model",
      "MITRE ATT&CK",
      "ITIL Security Management",
      "IEC 62443 – Industrial Cybersecurity",
      "FedRAMP – Cloud Security (US Gov)",
      "FISMA – Federal Information Security",
      "SWIFT CSP – Banking Security",
      "PCIDSS – Payment Card Industry Data Security Standard",
      "TISAX – Automotive Information Security"
    ]
  },
  {
    name: "IT / Technology Management",
    icon: Server,
    frameworks: [
      "ISO 20000 – IT Service Management",
      "ITIL v4 Framework",
      "ISO 24001 – Information & Documentation",
      "ISO 38500 – IT Governance",
      "ISO 30111 – Vulnerability handling",
      "ISO 29100 – Privacy Framework",
      "eTOM – Business Process Framework Telecom",
      "TOGAF – Enterprise Architecture",
      "IT4IT – IT Value Chain",
      "CSA STAR – Cloud Security Alliance Controls",
      "NIS2 – EU Cybersecurity Directive",
      "GDPR (IT Impact)"
    ]
  },
  {
    name: "Finance, Accounting & Reporting",
    icon: Briefcase,
    frameworks: [
      "SOX – Sarbanes-Oxley",
      "ICFR – Internal Controls over Financial Reporting",
      "ISAE 3000 – Assurance Engagements",
      "ISAE 3402 – Service Organization Controls",
      "IFRS / GAAP – Reporting Standards",
      "Basel II / III – Banking Risk",
      "GLBA (Financial)"
    ]
  },
  {
    name: "GRC, Risk & Governance",
    icon: Scale,
    frameworks: [
      "COSO Internal Control Framework",
      "COSO ERM – Enterprise Risk Management",
      "ISO 31000 – Risk Management",
      "ISO 31010 – Risk Assessment Techniques",
      "ISO 37301 – Compliance Management Systems",
      "ISO 37001 – Anti-Bribery / Fraud",
      "ISO 22301 – Business Continuity Management",
      "ISO 22316 – Organizational Resilience",
      "ISO 28000 – Supply Chain Security",
      "ISO 27036 – Supplier Relationships",
      "OECD Corporate Governance Principles",
      "BIS / EBA Guidelines",
      "ECB ICT Risk Framework (Europe)"
    ]
  },
  {
    name: "Healthcare & Medical Compliance",
    icon: Activity,
    frameworks: [
      "HIPAA – Security",
      "HIPAA – Privacy",
      "HITRUST CSF",
      "GCP – Good Clinical Practice",
      "GMP – Good Manufacturing Practice",
      "GLP – Good Laboratory Practice"
    ]
  },
  {
    name: "Industry-Specific Compliance",
    icon: Factory,
    frameworks: [
      "IEC 62443 – Industrial Control Systems",
      "ISA 99 – Automation Security",
      "FAA Safety Standards",
      "EASA Safety Standards",
      "NERC CIP – North America Energy Grid",
      "OSHA Standards – Occupational Safety",
      "MAR – Market Abuse Regulation",
      "EMIR – European Market Infrastructure Regulation",
      "TISAX – Automotive"
    ]
  },
  {
    name: "Environment & ESG Compliance",
    icon: Leaf,
    frameworks: [
      "ISO 14001 – Environmental Management",
      "ISO 45001 – Occupational Health & Safety",
      "ISO 50001 – Energy Management",
      "CSRD – EU Sustainability Directive",
      "ESRS – European Sustainability Reporting Standards",
      "TCFD – Climate Risk Disclosure",
      "SASB Standards",
      "GHG Protocol – Greenhouse Gas Accounting"
    ]
  }
];

const ProjectWorkspace: React.FC<ProjectWorkspaceProps> = ({ onComplete, navigate }) => {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Accordion state
  const [expandedCategories, setExpandedCategories] = useState<string[]>([]);

  // Form State
  const [processName, setProcessName] = useState('');
  const [description, setDescription] = useState('');
  const [selectedFrameworks, setSelectedFrameworks] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Context Builder State - ENHANCED
  const [contextAnswers, setContextAnswers] = useState({
    operationalGoal: '',
    trigger: '', // New: What starts the process?
    volume: 'Daily', // New: Frequency/Volume
    systems: '',
    dataSensitivity: 'Internal', // New: Confidentiality Level
    knownRisks: ''
  });

  // Stakeholders State
  const [stakeholders, setStakeholders] = useState<{ role: string; name: string }[]>([
    { role: 'Process Owner', name: '' },
    { role: 'IT Manager', name: '' }
  ]);

  const addStakeholder = () => {
    setStakeholders([...stakeholders, { role: '', name: '' }]);
  };

  const removeStakeholder = (index: number) => {
    const newStakeholders = [...stakeholders];
    newStakeholders.splice(index, 1);
    setStakeholders(newStakeholders);
  };

  const updateStakeholder = (index: number, field: 'role' | 'name', value: string) => {
    const newStakeholders = [...stakeholders];
    newStakeholders[index][field] = value;
    setStakeholders(newStakeholders);
  };

  const toggleFramework = (fw: string) => {
    if (selectedFrameworks.includes(fw)) {
      setSelectedFrameworks(prev => prev.filter(f => f !== fw));
    } else {
      setSelectedFrameworks(prev => [...prev, fw]);
    }
  };

  const toggleCategory = (categoryName: string) => {
    setExpandedCategories(prev => 
      prev.includes(categoryName) 
        ? prev.filter(c => c !== categoryName)
        : [...prev, categoryName]
    );
  };

  // Auto-expand categories when searching
  useEffect(() => {
    if (searchQuery) {
        setExpandedCategories(FRAMEWORK_CATEGORIES.map(c => c.name));
    } else {
        setExpandedCategories([]);
    }
  }, [searchQuery]);

  const handleGenerate = async () => {
    if (!processName || !description || selectedFrameworks.length === 0) {
      setError("Please fill in all required fields.");
      return;
    }

    setLoading(true);
    setError(null);

    // Format stakeholders for the prompt
    const stakeholdersList = stakeholders
      .filter(s => s.role.trim() !== '' || s.name.trim() !== '')
      .map(s => `- ${s.role}: ${s.name}`)
      .join('\n');

    // Combine context into description for the AI - ENHANCED PROMPT
    const fullPrompt = `
      PROCESS NAME: ${processName}
      DESCRIPTION: ${description}
      
      OPERATIONAL CONTEXT (Critical for Process Flow & Test Plans):
      - Primary Goal: ${contextAnswers.operationalGoal}
      - Process Trigger (Start Event): ${contextAnswers.trigger}
      - Frequency/Volume: ${contextAnswers.volume} (This determines automation needs and sampling size for Test Plans)
      
      TECHNICAL CONTEXT (Critical for Risk Heatmap & Controls):
      - Systems Used: ${contextAnswers.systems}
      - Data Classification: ${contextAnswers.dataSensitivity} (Use this to determine Impact Rating in Risk Heatmap)
      - Known Risks/Pain Points: ${contextAnswers.knownRisks}
      
      STAKEHOLDERS (For RACI Matrix):
      ${stakeholdersList || 'No specific stakeholders provided, suggest standard roles.'}
    `;

    try {
      const data = await generateAuditPackage(processName, fullPrompt, selectedFrameworks);
      
      // FORCE TITLE OVERRIDE: Ensure the output title matches the user input
      data.project_title = processName;

      onComplete(data);
    } catch (err: any) {
      console.error(err);
      setError("Failed to generate audit package. Ensure your API key is set or try again.");
      setLoading(false);
    }
  };

  const filteredCategories = FRAMEWORK_CATEGORIES.map(cat => ({
    name: cat.name,
    icon: cat.icon,
    frameworks: cat.frameworks.filter(fw => 
      fw.toLowerCase().includes(searchQuery.toLowerCase())
    )
  })).filter(cat => cat.frameworks.length > 0);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-[calc(100vh-100px)] text-center">
        <div className="w-16 h-16 border-4 border-brightBlue border-t-transparent rounded-full animate-spin mb-6"></div>
        <h2 className="text-2xl font-bold text-white mb-2">Analyzing Framework Requirements...</h2>
        <p className="text-steelGrey max-w-md mb-8">Our AI is reasoning through {selectedFrameworks.length} frameworks to map specific controls and articles to your process.</p>
        
        <div className="w-64 space-y-3">
            <div className="flex items-center text-sm text-brightBlue animate-pulse">
                <div className="w-2 h-2 bg-brightBlue rounded-full mr-3"></div>
                Analyzing {selectedFrameworks[0] || 'Frameworks'}...
            </div>
            <div className="flex items-center text-sm text-steelGrey opacity-75">
                <div className="w-2 h-2 bg-steelGrey rounded-full mr-3"></div>
                Designing Process Flow & RACI...
            </div>
             <div className="flex items-center text-sm text-steelGrey opacity-50">
                <div className="w-2 h-2 bg-steelGrey rounded-full mr-3"></div>
                Mapping Controls to Articles...
            </div>
             <div className="flex items-center text-sm text-steelGrey opacity-25">
                <div className="w-2 h-2 bg-steelGrey rounded-full mr-3"></div>
                Generating Test Plans...
            </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto py-8">
      {/* Stepper */}
      <div className="flex items-center justify-between mb-12 relative max-w-2xl mx-auto">
        <div className="absolute left-0 top-1/2 w-full h-1 bg-deepDivider -z-10"></div>
        {[1, 2, 3].map((s) => (
          <div 
            key={s} 
            className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-colors border-4 border-techBlack ${
              s <= step ? 'bg-brightBlue text-white' : 'bg-obsidianNavy text-steelGrey border-deepDivider'
            }`}
          >
            {s < step ? <Check size={16} /> : s}
          </div>
        ))}
      </div>

      <div className="bg-obsidianNavy border border-deepDivider rounded-xl p-8 shadow-xl">
        {step === 1 && (
          <div className="space-y-8 animate-fadeIn">
            {/* Header */}
            <div className="border-b border-deepDivider pb-6">
              <h2 className="text-3xl font-bold text-white mb-2">New Audit Project</h2>
              <p className="text-steelGrey">Define your process and select the compliance frameworks to generate your audit package.</p>
            </div>
            
            {/* Process Details Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column: Process Info */}
                <div className="lg:col-span-1 space-y-6">
                    <div>
                        <label className="block text-sm font-bold text-white mb-2">Process Name</label>
                        <input 
                            type="text" 
                            className="w-full bg-[#080C14] border border-deepDivider rounded-lg px-4 py-3 text-white focus:outline-none focus:border-brightBlue focus:ring-1 focus:ring-brightBlue/50 transition-all"
                            placeholder="e.g. Employee Onboarding"
                            value={processName}
                            onChange={(e) => setProcessName(e.target.value)}
                        />
                    </div>
                     <div>
                        <label className="block text-sm font-bold text-white mb-2">Process ID <span className="text-steelGrey font-normal">(Optional)</span></label>
                        <input 
                            type="text" 
                            className="w-full bg-[#080C14] border border-deepDivider rounded-lg px-4 py-3 text-white focus:outline-none focus:border-brightBlue focus:ring-1 focus:ring-brightBlue/50 transition-all"
                            placeholder="e.g. HR-001"
                        />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-white mb-2">Description</label>
                      <textarea 
                        className="w-full bg-[#080C14] border border-deepDivider rounded-lg px-4 py-3 text-white focus:outline-none focus:border-brightBlue focus:ring-1 focus:ring-brightBlue/50 min-h-[160px] transition-all"
                        placeholder="Describe the process steps, actors involved, and key outcomes..."
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                      />
                    </div>
                </div>

                {/* Right Column: Framework Selector */}
                <div className="lg:col-span-2 flex flex-col h-full min-h-[600px] bg-[#080C14] border border-deepDivider rounded-xl overflow-hidden">
                     <div className="p-6 border-b border-deepDivider bg-obsidianNavy/50">
                        <h3 className="text-lg font-bold text-white mb-4">Select Frameworks</h3>
                        
                        {/* Search */}
                        <div className="relative">
                          <Search size={18} className="absolute left-4 top-1/2 transform -translate-y-1/2 text-steelGrey" />
                          <input 
                            type="text" 
                            placeholder="Search 96+ frameworks..." 
                            className="w-full bg-techBlack border border-deepDivider rounded-xl pl-12 pr-10 py-3 text-sm text-white focus:outline-none focus:border-brightBlue transition-all"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                          />
                          {searchQuery && (
                            <button 
                                onClick={() => setSearchQuery('')}
                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-steelGrey hover:text-white"
                            >
                                <X size={14} />
                            </button>
                          )}
                        </div>

                        {/* Selected Count */}
                        <div className="flex justify-between items-center mt-4">
                            <span className="text-xs text-steelGrey">
                                {selectedFrameworks.length === 0 
                                    ? "Select at least one framework" 
                                    : <span className="text-brightBlue flex items-center"><Check size={12} className="mr-1"/> {selectedFrameworks.length} Selected</span>}
                            </span>
                            {selectedFrameworks.length > 0 && (
                                <button onClick={() => setSelectedFrameworks([])} className="text-xs text-steelGrey hover:text-white underline">
                                    Reset
                                </button>
                            )}
                        </div>
                     </div>

                     <div className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-4 bg-techBlack/50">
                        {filteredCategories.map((category) => {
                          const Icon = category.icon;
                          const hasSelection = category.frameworks.some(fw => selectedFrameworks.includes(fw));
                          const isExpanded = expandedCategories.includes(category.name);
                          
                          return (
                            <div key={category.name} className={`rounded-xl border transition-all duration-300 ${
                                hasSelection ? 'bg-obsidianNavy border-brightBlue/30' : 'bg-obsidianNavy/30 border-deepDivider'
                            }`}>
                                {/* Category Header */}
                                <div 
                                    className="flex items-center justify-between p-4 cursor-pointer hover:bg-white/5 transition-colors select-none"
                                    onClick={() => toggleCategory(category.name)}
                                >
                                     <div className="flex items-center">
                                         <div className={`p-2 rounded-lg mr-3 ${hasSelection ? 'bg-brightBlue text-white' : 'bg-deepDivider text-steelGrey'}`}>
                                            <Icon size={18} />
                                         </div>
                                         <div>
                                            <h4 className={`text-sm font-bold ${hasSelection ? 'text-white' : 'text-steelGrey'}`}>{category.name}</h4>
                                            {hasSelection && (
                                                <div className="text-xs text-brightBlue mt-1 flex items-center animate-fadeIn">
                                                    <span className="w-1.5 h-1.5 rounded-full bg-brightBlue mr-1.5"></span>
                                                    {category.frameworks.filter(fw => selectedFrameworks.includes(fw)).length} selected
                                                </div>
                                            )}
                                         </div>
                                     </div>
                                     <div className={`text-steelGrey transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}>
                                         <ChevronDown size={18} />
                                     </div>
                                </div>
                                
                                {/* Frameworks */}
                                {isExpanded && (
                                    <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-3 border-t border-deepDivider/50 animate-fadeIn bg-black/10">
                                         {category.frameworks.map((fw) => {
                                              const isSelected = selectedFrameworks.includes(fw);
                                              return (
                                                <div 
                                                  key={fw}
                                                  onClick={() => toggleFramework(fw)}
                                                  className={`cursor-pointer px-3 py-2.5 rounded-lg border text-sm transition-all flex items-start ${
                                                    isSelected 
                                                      ? 'bg-brightBlue/10 border-brightBlue text-white shadow-inner' 
                                                      : 'bg-techBlack border-deepDivider text-steelGrey hover:border-steelGrey/50 hover:bg-white/5'
                                                  }`}
                                                >
                                                  <div className={`mt-0.5 mr-3 w-4 h-4 rounded border flex items-center justify-center shrink-0 transition-colors ${
                                                    isSelected 
                                                      ? 'bg-brightBlue border-brightBlue' 
                                                      : 'border-steelGrey/30'
                                                  }`}>
                                                    {isSelected && <Check size={10} className="text-white" />}
                                                  </div>
                                                  <span className="leading-tight">{fw}</span>
                                                </div>
                                              );
                                        })}
                                    </div>
                                )}
                            </div>
                          );
                        })}
                        
                        {filteredCategories.length === 0 && (
                           <div className="text-center py-12 text-steelGrey">
                               <p>No frameworks found matching "{searchQuery}".</p>
                           </div>
                        )}
                     </div>
                </div>
            </div>

            <div className="pt-6 flex justify-end border-t border-deepDivider">
              <button 
                onClick={() => setStep(2)}
                disabled={!processName || !description || selectedFrameworks.length === 0}
                className="bg-brightBlue disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-600 text-white px-8 py-3 rounded-lg font-bold flex items-center transition-colors shadow-lg shadow-blue-500/20"
              >
                Next Step <ArrowRight size={18} className="ml-2" />
              </button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-8 animate-fadeIn">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 border-b border-deepDivider pb-6">
                <div>
                    <h2 className="text-2xl font-bold text-white mb-2">Context Builder</h2>
                    <p className="text-steelGrey text-sm max-w-xl">
                        To generate a precise Risk & Control Matrix, the AI needs to understand the specific environment of your process.
                    </p>
                </div>
                <div className="text-right hidden md:block">
                     <div className="text-xs text-steelGrey uppercase tracking-wider mb-1">Targeting</div>
                     <div className="flex -space-x-2 justify-end">
                        {selectedFrameworks.slice(0, 5).map((fw, i) => (
                             <div key={i} className="w-8 h-8 rounded-full bg-deepDivider border border-obsidianNavy flex items-center justify-center text-[10px] text-white font-bold" title={fw}>
                                {fw.charAt(0)}
                             </div>
                        ))}
                        {selectedFrameworks.length > 5 && (
                             <div className="w-8 h-8 rounded-full bg-brightBlue border border-obsidianNavy flex items-center justify-center text-[10px] text-white font-bold">
                                +{selectedFrameworks.length - 5}
                             </div>
                        )}
                     </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* COLUMN 1: OPERATIONAL CONTEXT (Flow & Test Plans) */}
                <div className="space-y-6">
                    <h3 className="text-white font-bold flex items-center border-b border-deepDivider pb-2">
                        <Zap size={16} className="text-yellow-500 mr-2" /> Operational Context
                    </h3>
                    
                    <div>
                        <label className="block text-xs font-bold text-steelGrey mb-1">Primary Operational Goal</label>
                        <input 
                            type="text" 
                            className="w-full bg-[#080C14] border border-deepDivider rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-brightBlue"
                            placeholder="e.g. Ensure accurate payroll data..."
                            value={contextAnswers.operationalGoal}
                            onChange={(e) => setContextAnswers({...contextAnswers, operationalGoal: e.target.value})}
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-bold text-steelGrey mb-1">Process Trigger</label>
                            <input 
                                type="text" 
                                className="w-full bg-[#080C14] border border-deepDivider rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-brightBlue"
                                placeholder="e.g. New Ticket"
                                value={contextAnswers.trigger}
                                onChange={(e) => setContextAnswers({...contextAnswers, trigger: e.target.value})}
                            />
                        </div>
                        <div>
                             <label className="block text-xs font-bold text-steelGrey mb-1">Frequency / Volume</label>
                             <select 
                                className="w-full bg-[#080C14] border border-deepDivider rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-brightBlue"
                                value={contextAnswers.volume}
                                onChange={(e) => setContextAnswers({...contextAnswers, volume: e.target.value})}
                             >
                                 <option>Daily (High Volume)</option>
                                 <option>Weekly</option>
                                 <option>Monthly</option>
                                 <option>Quarterly</option>
                                 <option>Ad-hoc / Manual</option>
                             </select>
                        </div>
                    </div>
                </div>

                {/* COLUMN 2: TECHNICAL CONTEXT (Heatmap & Controls) */}
                <div className="space-y-6">
                     <h3 className="text-white font-bold flex items-center border-b border-deepDivider pb-2">
                        <Shield size={16} className="text-brightBlue mr-2" /> Risk & Data Profile
                    </h3>

                    <div className="grid grid-cols-2 gap-4">
                         <div>
                            <label className="block text-xs font-bold text-steelGrey mb-1">IT Systems Used</label>
                            <input 
                                type="text" 
                                className="w-full bg-[#080C14] border border-deepDivider rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-brightBlue"
                                placeholder="e.g. SAP, Jira"
                                value={contextAnswers.systems}
                                onChange={(e) => setContextAnswers({...contextAnswers, systems: e.target.value})}
                            />
                         </div>
                         <div>
                             <label className="block text-xs font-bold text-steelGrey mb-1">Data Sensitivity</label>
                             <select 
                                className="w-full bg-[#080C14] border border-deepDivider rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-brightBlue"
                                value={contextAnswers.dataSensitivity}
                                onChange={(e) => setContextAnswers({...contextAnswers, dataSensitivity: e.target.value})}
                             >
                                 <option>Public / Low</option>
                                 <option>Internal Only</option>
                                 <option>Confidential (PII/Financial)</option>
                                 <option>Restricted (Critical IP)</option>
                             </select>
                        </div>
                    </div>

                    <div>
                         <label className="block text-xs font-bold text-steelGrey mb-1">Known Risks / Pain Points</label>
                         <textarea 
                            className="w-full bg-[#080C14] border border-deepDivider rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-brightBlue h-20 resize-none"
                            placeholder="e.g. Previous audit finding regarding access control..."
                            value={contextAnswers.knownRisks}
                            onChange={(e) => setContextAnswers({...contextAnswers, knownRisks: e.target.value})}
                        />
                    </div>
                </div>
            </div>
            
            {/* Stakeholders Section */}
            <div className="border-t border-deepDivider pt-6">
                 <div className="flex justify-between items-center mb-4">
                     <label className="text-sm font-bold text-white flex items-center">
                         <Users size={14} className="text-brightBlue mr-2"/>
                         Process Stakeholders
                     </label>
                     <span className="text-xs text-steelGrey">Add employees involved to auto-populate the RACI matrix</span>
                 </div>
                 
                 <div className="bg-[#080C14] border border-deepDivider rounded-xl overflow-hidden">
                     <div className="grid grid-cols-12 bg-obsidianNavy/50 border-b border-deepDivider p-3 text-xs font-bold text-steelGrey uppercase tracking-wider">
                         <div className="col-span-5">Function / Role</div>
                         <div className="col-span-6">Name</div>
                         <div className="col-span-1"></div>
                     </div>
                     {stakeholders.map((stakeholder, index) => (
                         <div key={index} className="grid grid-cols-12 p-2 border-b border-deepDivider/50 items-center group hover:bg-white/5 transition-colors">
                             <div className="col-span-5 pr-2">
                                 <input 
                                     type="text" 
                                     className="w-full bg-transparent border border-transparent hover:border-deepDivider focus:border-brightBlue rounded px-2 py-1.5 text-white text-sm focus:outline-none transition-all placeholder-steelGrey/50"
                                     placeholder="e.g. HR Manager"
                                     value={stakeholder.role}
                                     onChange={(e) => updateStakeholder(index, 'role', e.target.value)}
                                 />
                             </div>
                             <div className="col-span-6 pr-2">
                                 <input 
                                     type="text" 
                                     className="w-full bg-transparent border border-transparent hover:border-deepDivider focus:border-brightBlue rounded px-2 py-1.5 text-white text-sm focus:outline-none transition-all placeholder-steelGrey/50"
                                     placeholder="e.g. John Doe"
                                     value={stakeholder.name}
                                     onChange={(e) => updateStakeholder(index, 'name', e.target.value)}
                                 />
                             </div>
                             <div className="col-span-1 flex justify-center">
                                 <button 
                                     onClick={() => removeStakeholder(index)}
                                     className="text-steelGrey hover:text-riskHigh p-1.5 rounded opacity-0 group-hover:opacity-100 transition-all"
                                 >
                                     <Trash2 size={14} />
                                 </button>
                             </div>
                         </div>
                     ))}
                     <div className="p-2">
                         <button 
                             onClick={addStakeholder}
                             className="w-full py-2 border border-dashed border-deepDivider rounded text-sm text-steelGrey hover:text-brightBlue hover:border-brightBlue/50 hover:bg-brightBlue/5 transition-all flex items-center justify-center"
                         >
                             <Plus size={14} className="mr-2" /> Add Stakeholder
                         </button>
                     </div>
                 </div>
            </div>

            {error && (
              <div className="p-4 rounded bg-riskHigh/10 border border-riskHigh text-riskHigh text-sm flex items-center">
                <AlertTriangle size={16} className="mr-2" />
                {error}
              </div>
            )}

            <div className="pt-6 border-t border-deepDivider flex justify-between">
              <button 
                onClick={() => setStep(1)}
                className="text-steelGrey hover:text-white px-4 py-3 font-medium flex items-center transition-colors"
              >
                <ArrowLeft size={18} className="mr-2" /> Back
              </button>
              <button 
                onClick={handleGenerate}
                className="bg-brightBlue hover:bg-blue-600 text-white px-8 py-3 rounded-lg font-bold shadow-[0_0_20px_rgba(0,140,255,0.4)] transition-all flex items-center"
              >
                Generate Audit Package <FileText size={18} className="ml-2" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectWorkspace;
