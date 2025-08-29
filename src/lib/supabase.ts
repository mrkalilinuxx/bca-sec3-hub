import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database types
export interface ContentRow {
  id: string;
  section: string;
  content: string;
  updated_at: string;
}

export interface FileRow {
  id: string;
  file_url: string;
  file_name: string;
  uploaded_at: string;
}