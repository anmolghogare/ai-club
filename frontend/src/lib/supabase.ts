import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn(
    '[supabase] VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY is not set.\n' +
    'Copy .env.example to .env and fill in your Supabase credentials.\n' +
    'Member/project data fetching will be disabled until env vars are set.'
  );
}

// Use placeholders so the app doesn't crash on startup — Supabase calls will
// simply return empty results until real credentials are provided via .env
export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseAnonKey || 'placeholder-anon-key'
);
