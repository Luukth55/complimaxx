
import { supabase, isSupabaseConfigured } from './supabaseClient';
import { AuditPackage } from '../types';

const LOCAL_STORAGE_KEY = 'complimaxx_local_projects';

export const storageService = {
  // Haal alle projecten op
  async getProjects(userId?: string): Promise<AuditPackage[]> {
    if (isSupabaseConfigured && userId) {
      const { data, error } = await supabase
        .from('audit_projects')
        .select('*')
        .eq('user_id', userId)
        .order('updated_at', { ascending: false });

      if (!error && data) {
        return data.map((d: any) => ({ 
          ...d.content, 
          id: d.id, 
          user_id: d.user_id,
          savedAt: d.updated_at 
        }));
      }
    }

    // Fallback naar LocalStorage
    const local = localStorage.getItem(LOCAL_STORAGE_KEY);
    return local ? JSON.parse(local) : [];
  },

  // Sla een project op
  async saveProject(data: AuditPackage, userId?: string): Promise<AuditPackage> {
    const frameworks = data.framework_mapping?.map(f => f.framework) || [];
    const score = data.audit_score?.total_score || 0;
    const isComplete = data.checklist?.every(item => item.status === 'Complete') || false;

    if (isSupabaseConfigured && userId) {
      const payload = {
        user_id: userId,
        title: data.project_title || data.process_flow[0]?.title || 'Untitled Project',
        frameworks: frameworks,
        readiness_score: score,
        status: isComplete ? 'Completed' : 'In Progress',
        content: { ...data, id: undefined, user_id: undefined, savedAt: undefined },
        updated_at: new Date().toISOString()
      };

      let result;
      if (data.id && !data.id.startsWith('local-')) {
        result = await supabase.from('audit_projects').update(payload).eq('id', data.id).select();
      } else {
        result = await supabase.from('audit_projects').insert([payload]).select();
      }

      if (result.data) {
        const savedItem = result.data[0];
        return { ...savedItem.content, id: savedItem.id, user_id: savedItem.user_id, savedAt: savedItem.updated_at };
      }
    }

    // LocalStorage Logic
    const localProjects = await this.getProjects();
    const newId = data.id || `local-${Date.now()}`;
    const newProject = { ...data, id: newId, savedAt: new Date().toISOString() };
    
    const updatedProjects = localProjects.find(p => p.id === newId)
      ? localProjects.map(p => p.id === newId ? newProject : p)
      : [newProject, ...localProjects];

    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updatedProjects));
    return newProject;
  },

  // Verwijder een project
  async deleteProject(id: string): Promise<boolean> {
    if (isSupabaseConfigured && !id.startsWith('local-')) {
      const { error } = await supabase.from('audit_projects').delete().eq('id', id);
      return !error;
    }

    const localProjects = await this.getProjects();
    const filtered = localProjects.filter(p => p.id !== id);
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(filtered));
    return true;
  }
};
