/**
 * Create a Supabase client with session headers for anonymous users
 */
import { createClient } from '@supabase/supabase-js';
import type { Database } from '@/integrations/supabase/types';
import { getSessionId } from './session';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_PUBLISHABLE_KEY = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

/**
 * Creates a Supabase client with x-session-id header for anonymous users.
 * This is needed because RLS policies check this header for session-based access.
 */
export function getSupabaseWithSession() {
  const sessionId = getSessionId();
  
  return createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
    auth: {
      storage: localStorage,
      persistSession: true,
      autoRefreshToken: true,
    },
    global: {
      headers: {
        'x-session-id': sessionId,
      },
    },
  });
}
