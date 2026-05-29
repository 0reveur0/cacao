// js/supabase-config.js

// Supabase is loaded from CDN and available as a global variable.
const { createClient } = supabase;

// It's generally safe to expose the Anon key in a browser environment.
// Row-level security should be enabled in your Supabase project.
const SUPABASE_URL = 'https://adicqqmqdoxrhtrmsykb.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFkaWNxcW1xZG94cmh0cm1zeWtiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk4Mzg4ODEsImV4cCI6MjA5NTQxNDg4MX0.WHYlo1tT00dRhffZ9szYT3M6BGUrW35u4mMRmhCxVcs';

const supabaseClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Export the client for use in other modules.
export { supabaseClient as supabase };
