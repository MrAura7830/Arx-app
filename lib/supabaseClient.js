import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-key';

// Create a mock client if no real Supabase credentials
const isRealSupabase = process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const supabase = isRealSupabase 
  ? createClient(supabaseUrl, supabaseAnonKey)
  : {
      auth: {
        getUser: () => Promise.resolve({ data: { user: null } }),
        getSession: () => Promise.resolve({ data: { session: null } }),
        onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
        signUp: () => Promise.resolve({ error: { message: 'Demo mode - Supabase not configured' } }),
        signInWithPassword: () => Promise.resolve({ error: { message: 'Demo mode - Supabase not configured' } })
      },
      from: () => ({
        select: () => Promise.resolve({ data: [], error: null }),
        insert: () => Promise.resolve({ data: null, error: { message: 'Demo mode - Supabase not configured' } }),
        delete: () => Promise.resolve({ error: { message: 'Demo mode - Supabase not configured' } })
      })
    };
