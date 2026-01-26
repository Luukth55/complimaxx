
import { supabase, isSupabaseConfigured } from './supabaseClient';
import { AuditPackage, TeamMember, UserProfile, UserPlan, ChecklistItem, Gap } from '../types';

const LOCAL_STORAGE_KEY = 'complimaxx_local_projects';

export const storageService = {
  async getProjects(userId?: string): Promise<AuditPackage[]> {
    if (isSupabaseConfigured && userId) {
      const { data, error } = await supabase
        .from('audit_projects')
        .select('*')
        .eq('user_id', userId)
        .order('updated_at', { ascending: false });

      if (error) {
        console.error("Supabase Fetch Error:", error.message);
        return this.getLocalFallback();
      }

      if (data) {
        return data.map((d: any) => ({ 
          ...d.content, 
          id: d.id, 
          user_id: d.user_id,
          savedAt: d.updated_at 
        }));
      }
    }
    return this.getLocalFallback();
  },

  getLocalFallback(): AuditPackage[] {
    const local = localStorage.getItem(LOCAL_STORAGE_KEY);
    return local ? JSON.parse(local) : [];
  },

  async saveProject(data: AuditPackage, userId?: string): Promise<AuditPackage> {
    const frameworks = data.framework_mapping?.map(f => f.framework) || [];
    const score = data.audit_score?.total_score || 0;
    
    // Bereken status op basis van checklist voortgang
    const totalTasks = data.checklist?.length || 0;
    const completedTasks = data.checklist?.filter(t => t.status === 'Complete').length || 0;
    let status = 'In Progress';
    if (totalTasks > 0 && totalTasks === completedTasks) status = 'Completed';
    if (totalTasks === 0) status = 'Draft';

    if (isSupabaseConfigured && userId) {
      const payload = {
        user_id: userId,
        title: data.project_title || data.process_flow?.[0]?.title || 'Untitled Project',
        frameworks: frameworks,
        readiness_score: score,
        status: status,
        content: { 
          ...data, 
          id: undefined, 
          user_id: undefined, 
          savedAt: undefined 
        },
        updated_at: new Date().toISOString()
      };

      try {
        let result;
        // Check of het een bestaand project is (UUID check)
        if (data.id && data.id.length > 20 && !data.id.startsWith('local-')) {
          result = await supabase
            .from('audit_projects')
            .update(payload)
            .eq('id', data.id)
            .select();
        } else {
          result = await supabase
            .from('audit_projects')
            .insert([payload])
            .select();
        }

        if (result.error) throw result.error;

        if (result.data && result.data[0]) {
          const savedItem = result.data[0];
          return { 
            ...savedItem.content, 
            id: savedItem.id, 
            user_id: savedItem.user_id, 
            savedAt: savedItem.updated_at 
          };
        }
      } catch (err: any) {
        console.error("Supabase Save Error:", err.message);
      }
    }

    // Fallback naar LocalStorage
    const localProjects = this.getLocalFallback();
    const newId = data.id || `local-${Date.now()}`;
    const newProject = { ...data, id: newId, savedAt: new Date().toISOString() };
    
    const updatedProjects = localProjects.find(p => p.id === newId)
      ? localProjects.map(p => p.id === newId ? newProject : p)
      : [newProject, ...localProjects];

    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updatedProjects));
    return newProject;
  },

  async deleteProject(id: string): Promise<boolean> {
    if (isSupabaseConfigured && id.length > 20 && !id.startsWith('local-')) {
      const { error } = await supabase
        .from('audit_projects')
        .delete()
        .eq('id', id);
      return !error;
    }
    const localProjects = this.getLocalFallback();
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(localProjects.filter(p => p.id !== id)));
    return true;
  },

  async getTeamMembers(companyName?: string): Promise<TeamMember[]> {
    if (isSupabaseConfigured && companyName) {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, first_name, last_name, email, role, updated_at')
        .eq('company_name', companyName);
      
      if (error) return [];
      
      return (data || []).map(d => ({
        id: d.id,
        name: `${d.first_name} ${d.last_name}` || 'Team Member',
        email: d.email || '',
        role: (d.role as any) || 'Editor',
        status: 'Active',
        lastActive: new Date(d.updated_at).toLocaleDateString()
      }));
    }
    return [];
  },

  async deductCredit(userId: string): Promise<boolean> {
    if (!isSupabaseConfigured) return true;

    // Haal huidige credits op
    const { data: profile, error: fetchError } = await supabase
      .from('profiles')
      .select('credits_remaining, plan')
      .eq('id', userId)
      .single();

    if (fetchError || !profile) return false;
    
    if (profile.plan === 'Enterprise') return true;
    if (profile.credits_remaining <= 0) return false;

    // Trek credit af
    const { error: updateError } = await supabase
      .from('profiles')
      .update({ 
        credits_remaining: profile.credits_remaining - 1,
        updated_at: new Date().toISOString()
      })
      .eq('id', userId);

    return !updateError;
  },

  async upgradePlan(userId: string, plan: UserPlan): Promise<boolean> {
    if (!isSupabaseConfigured) return false;

    const planConfig = {
      Essentials: { fw: 2, users: 1, credits: 15 },
      Pro: { fw: 10, users: 3, credits: 60 },
      Enterprise: { fw: 96, users: 10, credits: 9999 }
    };

    const config = planConfig[plan];

    const { error } = await supabase
      .from('profiles')
      .update({ 
        plan, 
        is_pro: plan !== 'Essentials',
        framework_limit: config.fw,
        user_limit: config.users,
        credits_total: config.credits,
        credits_remaining: config.credits,
        updated_at: new Date().toISOString()
      })
      .eq('id', userId);

    return !error;
  }
};
