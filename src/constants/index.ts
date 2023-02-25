const isProduction = true;

export const REJIG_BASE_URL = isProduction
  ? "https://www.rejig.app"
  : "http://localhost:3000";

export const SUPABASE_BASE_URL = isProduction
  ? "https://rtvflcioatnrdqlvxonx.supabase.co"
  : "http://localhost:54321";

export const SUPABASE_ANON_KEY = isProduction
  ? "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ0dmZsY2lvYXRucmRxbHZ4b254Iiwicm9sZSI6ImFub24iLCJpYXQiOjE2NzA4OTk1MjksImV4cCI6MTk4NjQ3NTUyOX0.zJaRjmwgtuO-QbdkpBs_9M9LN9rYPVoBmS74xpArVtw"
  : "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0";
