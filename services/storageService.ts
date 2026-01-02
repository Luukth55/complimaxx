
import { supabase, isSupabaseConfigured } from './supabaseClient';
import { AuditPackage } from '../types';

const LOCAL_STORAGE_KEY = 'complimaxx_local_projects';

export const storageService = {
  // Ophalen van alle projecten van de ingelogde gebruiker
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

  // Slaat het VOLLEDIGE pakket op, inclusief checklists, gaps en meta
  async saveProject(data: AuditPackage, userId?: string): Promise<AuditPackage> {
    const frameworks = data.framework_mapping?.map(f => f.framework) || [];
    const score = data.audit_score?.total_score || 0;
    
    // Bereken status op basis van checklist
    const totalTasks = data.checklist?.length || 0;
    const completedTasks = data.checklist?.filter(t => t.status === 'Complete').length || 0;
    const status = totalTasks > 0 && totalTasks === completedTasks ? 'Completed' : 'In Progress';

    if (isSupabaseConfigured && userId) {
      const payload = {
        user_id: userId,
        title: data.project_title || data.process_flow[0]?.title || 'Naamloos Project',
        frameworks: frameworks,
        readiness_score: score,
        status: status,
        // Sla alles op in de content kolom, maar verwijder id/userId om circulariteit te voorkomen
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
        // Check of we updaten of inserten
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
  }
};
