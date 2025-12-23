
import { createClient } from '@supabase/supabase-js';

// Geconfigureerd met de door de gebruiker verstrekte gegevens
const supabaseUrl = 'https://oawunlaetnhsgxhvytuz.supabase.co';
const supabaseAnonKey = 'keysb_publishable_r8PpBQMJUFEd95EDv44y9Q_qQwXhvYR';

export const connectionStatus = {
  urlPresent: true,
  keyPresent: true,
  isMock: false
};

let client: any;

try {
  // Initialiseer de echte client met de verstrekte sleutels
  client = createClient(supabaseUrl, supabaseAnonKey);
  console.log("✅ Supabase Client succesvol gekoppeld aan: " + supabaseUrl);
} catch (e) {
  console.error("❌ Fout bij initialiseren Supabase:", e);
  connectionStatus.isMock = true;
}

// Fallback mock (alleen als de initialisatie hierboven onverhoopt faalt)
if (!client || connectionStatus.isMock) {
  client = {
    auth: {
      getSession: async () => ({ data: { session: null }, error: null }),
      onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
      signInWithPassword: async () => ({ error: { message: "Supabase initialisatie fout." } }),
      signUp: async () => ({ error: { message: "Supabase initialisatie fout." } }),
      signOut: async () => {},
      getUser: async () => ({ data: { user: null }, error: null }),
    },
    from: (table: string) => ({
      select: () => ({ 
        eq: () => ({ 
          order: () => ({ data: null, error: { code: 'PGRST204', message: 'Database verbinding mislukt' } }) 
        }),
        single: () => ({ data: null, error: { message: 'Geen verbinding' } })
      }),
      insert: () => ({ select: () => ({ data: null, error: new Error("Opslaan mislukt") }) }),
      update: () => ({ eq: () => ({ select: () => ({ data: null, error: new Error("Update mislukt") }) }) }),
      upsert: () => ({ error: { message: "Upsert mislukt" } }),
    })
  };
}

export const supabase = client;
export const isSupabaseConfigured = !connectionStatus.isMock;
