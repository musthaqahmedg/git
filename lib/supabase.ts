import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;

// New Supabase keys (sb_publishable_ / sb_secret_), synced to Vercel by the
// Supabase integration. Legacy names are kept only as a fallback.
const supabasePublishableKey =
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ??
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabaseSecretKey =
  process.env.SUPABASE_SECRET_KEY ?? process.env.SUPABASE_SERVICE_ROLE_KEY;

export const supabase = (supabaseUrl && supabasePublishableKey)
  ? createClient(supabaseUrl, supabasePublishableKey)
  : null;

export const supabaseServer = () => {
  return createClient(
    supabaseUrl!,
    supabaseSecretKey!,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      }
    }
  );
};
