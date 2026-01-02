
import { createClient } from '@supabase/supabase-js';

// Gebruik van de verstrekte credentials
const supabaseUrl = 'https://qvjzuchlapionsqebhvj.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF2anp1Y2hsYXBpb25zcWViaHZqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjczNTQ2MjgsImV4cCI6MjA4MjkzMDYyOH0.gKazolYLog4KQ-iGylM61vHno-if7z8YlDSEA2zqv4o';

export const connectionStatus = {
  urlPresent: !!supabaseUrl,
  keyPresent: !!supabaseAnonKey,
  isMock: false
};

// Initialiseer de echte client
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export const isSupabaseConfigured = true;
