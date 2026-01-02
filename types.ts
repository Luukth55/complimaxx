
// Data Structures for the AI Generated Content

export interface ProcessFlowStep {
  id: string;
  title: string;
  summary: string;
  description: string;
  risk_hotspots: string[];
  decision_points: Array<{ decision: string; yes_action: string; no_action: string }>;
  approvals_required: string[];
  lead_time: string;
  dependencies: string[];
  owner: string;
  linked_key_controls: string[];
}

export interface RaciMatrixItem {
  process_step: string;
  roles: {
    admin: string;
    qa: string;
    it: string;
    analyst: string;
    audit: string;
    [key: string]: string;
  };
}

export interface Risk {
  id: string;
  category: string;
  description: string;
  inherent_rating: { likelihood: string; impact: string };
  residual_rating: { likelihood: string; impact: string };
  linked_controls: string[];
}

export interface Control {
  id: string;
  title: string;
  description: string;
  framework_mapping: Array<{ framework: string; reference: string }>;
  frequency: string;
  owner: string;
  automation_level: string;
  evidence_required: string[];
}

export interface ControlObjective {
  id: string;
  title: string;
  linked_risks: string[];
  linked_controls: string[];
  success_criteria: string;
}

export interface KeyControl {
  id: string;
  control_id: string;
  reason: string;
  test_frequency: string;
  type?: string; 
}

export interface TestPlan {
  id: string;
  control_id: string;
  purpose: string;
  reviewer: string;
  sampling_frequency: string;
  evidence_required: string[];
  steps: string[];
  pass_fail_criteria: string;
}

export interface EvidenceItem {
  id: string;
  title: string;
  linked_control: string;
  mandatory: boolean;
  file_type: string[];
  instructions: string;
}

export interface AuditScore {
  total_score: number;
  domain_scores: {
    control_environment: number;
    risk_management: number;
    framework_compliance: number;
    evidence_quality: number;
  };
  recommendations: string[];
}

export interface FrameworkMapItem {
  framework: string;
  articles: Array<{ reference: string; linked_controls: string[] }>;
}

export interface ChecklistFile {
  name: string;
  date: string;
  size: string;
  type: string;
}

export interface ChecklistItem {
  id: string;
  requirement: string; 
  description?: string; 
  status: 'Not Started' | 'In Progress' | 'Review' | 'Complete';
  assignedTo: string;
  dueDate: string;
  framework: string;
  category: 'Audit Prep' | 'Control' | 'Evidence' | 'Gap Remediation' | 'Renewal';
  priority: 'High' | 'Medium' | 'Low';
  difficulty: 'Easy' | 'Medium' | 'Hard';
  recurrence: 'One-time' | 'Monthly' | 'Quarterly' | 'Yearly';
  evidenceNotes?: string;
  evidenceFiles?: ChecklistFile[];
  linkedControl?: string;
  linkedRisk?: string;
}

export interface Gap {
  id: string;
  description: string;
  linkedRisk: string;
  linkedControl: string;
  owner: string;
  status: 'To Do' | 'In Progress' | 'Done';
  priority: 'High' | 'Medium' | 'Low';
  dueDate: string;
}

export interface AuditMeta {
    last_audit_date: string; 
    next_audit_date: string; 
    frequency: 'Annual' | 'Semi-Annual' | 'Quarterly';
}

export interface AuditPackage {
  id?: string; 
  user_id?: string; 
  project_title?: string;
  process_flow: ProcessFlowStep[];
  raci_matrix: RaciMatrixItem[];
  risks: Risk[];
  controls: Control[];
  control_objectives: ControlObjective[];
  key_controls: KeyControl[];
  test_plans: TestPlan[];
  evidence_checklist: EvidenceItem[];
  audit_score: AuditScore;
  framework_mapping: FrameworkMapItem[];
  savedAt?: string;
  checklist?: ChecklistItem[]; 
  gaps?: Gap[]; 
  audit_meta?: AuditMeta; 
}

export enum AppRoute {
  LANDING = 'landing',
  LOGIN = 'login',
  DASHBOARD = 'dashboard',
  PROJECT_WIZARD = 'project_wizard',
  OUTPUT_VIEWER = 'output_viewer',
  GAP_TRACKING = 'gap_tracking',
  CHECKLIST = 'checklist',
  RENEWAL = 'renewal',
  TEAM = 'team',
  SETTINGS = 'settings',
  FEATURES = 'features',
  TUTORIALS = 'tutorials',
  ABOUT = 'about',
  PRICING = 'pricing',
  CONTACT = 'contact',
  SECURITY = 'security',
  PRIVACY = 'privacy',
  TERMS = 'terms',
  PRODUCT = 'product',
  FAQ = 'faq',
  COOKIES = 'cookies',
  DPA = 'dpa',
  GET_STARTED = 'get_started',
  // Fix: Added missing HELP route
  HELP = 'help'
}

export interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: 'Admin' | 'Editor' | 'Viewer';
  status: 'Active' | 'Pending';
  lastActive: string;
}
