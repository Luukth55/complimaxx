
import { createClient } from '@supabase/supabase-js';

// Configuration from project details
const supabaseUrl = 'https://hjssokjbkhetkzeltduf.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imhqc3Nva2pia2hldGt6ZWx0ZHVmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjU4MTg2NDMsImV4cCI6MjA4MTM5NDY0M30.kYbgkK-v-Z0__vrOzGTWJQcC6FkFLY0zfO2aOL1SouA';

export const supabase = createClient(supabaseUrl, supabaseKey);
