
import { supabase, isSupabaseConfigured } from './supabaseClient';
import { AuditPackage, TeamMember, UserProfile, UserPlan, ChecklistItem, Gap } from '../types';

const LOCAL_STORAGE_KEY = 'complimaxx_local_projects';

export const storageService = {
  async getProjects(userId?: string): Promise<AuditPackage[]> {
    if (isSupabaseConfigured && userId) {
      try {
        const { data, error } = await supabase
          .from('audit_projects')
          .select('*')
          .eq('user_id', userId)
          .order('updated_at', { ascending: false });

        if (error) throw error;

        return (data || []).map((d: any) => ({ 
          ...d.content, 
          id: d.id, 
          user_id: d.user_id,
          savedAt: d.updated_at 
        }));
      } catch (err) {
        console.error("Supabase Fetch Error:", err);
      }
    }
    return this.getLocalFallback();
  },

  getLocalFallback(): AuditPackage[] {
    const local = localStorage.getItem(LOCAL_STORAGE_KEY);
    return local ? JSON.parse(local) : [];
  },

  async saveProject(data: AuditPackage, userId?: string): Promise<AuditPackage> {
    if (isSupabaseConfigured && userId) {
      const frameworks = data.framework_mapping?.map(f => f.framework) || [];
      const score = data.audit_score?.total_score || 0;
      
      const payload = {
        user_id: userId,
        title: data.project_title || 'Untitled Project',
        frameworks: frameworks,
        readiness_score: score,
        status: 'Active',
        content: data,
        updated_at: new Date().toISOString()
      };

      try {
        let result;
        if (data.id && data.id.length > 30) {
          result = await supabase.from('audit_projects').update(payload).eq('id', data.id).select();
        } else {
          result = await supabase.from('audit_projects').insert([payload]).select();
        }

        if (result.error) throw result.error;
        const saved = result.data[0];
        return { ...saved.content, id: saved.id, user_id: saved.user_id, savedAt: saved.updated_at };
      } catch (err) {
        console.error("Save failed:", err);
      }
    }

    // Local fallback
    const local = this.getLocalFallback();
    const newId = data.id || `local-${Date.now()}`;
    const newProject = { ...data, id: newId, savedAt: new Date().toISOString() };
    const updated = local.find(p => p.id === newId) ? local.map(p => p.id === newId ? newProject : p) : [newProject, ...local];
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
    return newProject;
  },

  async deleteProject(id: string): Promise<boolean> {
    if (isSupabaseConfigured && id.length > 30) {
      const { error } = await supabase.from('audit_projects').delete().eq('id', id);
      return !error;
    }
    const local = this.getLocalFallback();
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(local.filter(p => p.id !== id)));
    return true;
  },

  async getTeamMembers(companyName?: string): Promise<TeamMember[]> {
    if (isSupabaseConfigured && companyName) {
      const { data } = await supabase.from('profiles').select('*').eq('company_name', companyName);
      return (data || []).map(d => ({
        id: d.id,
        name: `${d.first_name} ${d.last_name}`,
        email: d.email,
        role: d.role,
        status: 'Active',
        lastActive: new Date(d.updated_at).toLocaleDateString()
      }));
    }
    return [];
  },

  async mockInviteMember(companyName: string, email: string, role: string): Promise<boolean> {
    console.log(`Inviting ${email} to ${companyName} as ${role}`);
    await new Promise(r => setTimeout(r, 1000));
    return true;
  },

  async deductCredit(userId: string): Promise<boolean> {
    if (!isSupabaseConfigured) return true;
    const { data: profile } = await supabase.from('profiles').select('credits_remaining, plan').eq('id', userId).single();
    if (!profile || (profile.plan !== 'Enterprise' && profile.credits_remaining <= 0)) return false;
    
    if (profile.plan === 'Enterprise') return true;

    const { error } = await supabase.from('profiles').update({ 
      credits_remaining: profile.credits_remaining - 1,
      updated_at: new Date().toISOString()
    }).eq('id', userId);
    return !error;
  },

  async upgradePlan(userId: string, plan: UserPlan): Promise<boolean> {
    if (!isSupabaseConfigured) return false;
    const config = {
      Essentials: { fw: 2, users: 1, credits: 15 },
      Pro: { fw: 10, users: 3, credits: 60 },
      Enterprise: { fw: 96, users: 10, credits: 9999 }
    }[plan];

    const { error } = await supabase.from('profiles').update({ 
      plan,
      framework_limit: config.fw,
      user_limit: config.users,
      credits_remaining: config.credits,
      credits_total: config.credits,
      updated_at: new Date().toISOString()
    }).eq('id', userId);
    return !error;
  }
};
