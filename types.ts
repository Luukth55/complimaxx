
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
  type?: string; // Optional type for filtering
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

export interface ChecklistItem {
  id: string;
  requirement: string;
  status: 'Not Started' | 'In Progress' | 'Complete';
  evidence: boolean;
  assignedTo: string;
  dueDate: string;
  framework: string;
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

export interface AuditPackage {
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
  checklist?: ChecklistItem[]; // Persisted checklist state
  gaps?: Gap[]; // Persisted gap tracking state
}

export enum AppRoute {
  LANDING = 'landing',
  DASHBOARD = 'dashboard',
  PROJECT_WIZARD = 'project_wizard',
  OUTPUT_VIEWER = 'output_viewer',
  GAP_TRACKING = 'gap_tracking',
  CHECKLIST = 'checklist',
  RENEWAL = 'renewal',
  TEAM = 'team',
  SETTINGS = 'settings'
}

export interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: 'Admin' | 'Editor' | 'Viewer';
  status: 'Active' | 'Pending';
  lastActive: string;
}