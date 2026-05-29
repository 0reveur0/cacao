import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://adicqqmqdoxrhtrmsykb.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFkaWNxcW1xZG94cmh0cm1zeWtiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk4Mzg4ODEsImV4cCI6MjA5NTQxNDg4MX0.WHYlo1tT00dRhffZ9szYT3M6BGUrW35u4mMRmhCxVcs';

export const supabase = createClient(supabaseUrl, supabaseKey);
