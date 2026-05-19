import { createClient, type SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.SUPABASE_URL || process.env.SUPABASE_URL;
const supabaseKey =
  import.meta.env.SUPABASE_ANON_KEY ||
  import.meta.env.SUPABASE_KEY ||
  process.env.SUPABASE_ANON_KEY ||
  process.env.SUPABASE_KEY;

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseKey);

// Fail soft: when the credentials are not set, export `null` instead of
// calling createClient() (which throws "supabaseUrl is required." at import
// time and would take down any route that imports this module). Callers must
// check for null and skip the Supabase-backed work.
export const supabase: SupabaseClient | null = isSupabaseConfigured
  ? createClient(supabaseUrl as string, supabaseKey as string)
  : null;

if (!isSupabaseConfigured) {
  console.warn(
    '[supabase] SUPABASE_URL / SUPABASE_ANON_KEY not set — Supabase features are disabled.'
  );
}
