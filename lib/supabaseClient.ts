// lib/supabaseClient.ts
import { createClient, SupabaseClient } from '@supabase/supabase-js';

// ---------------------------------------------------
// 1️⃣ Environment variables
// ---------------------------------------------------
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

// ---------------------------------------------------
// 2️⃣ Validate required keys (soft)
// ---------------------------------------------------
const canInitBrowserClient = Boolean(supabaseUrl && supabaseAnonKey);
if (!canInitBrowserClient) {
  console.warn('Supabase URL/Anon key not set. Public client disabled until env vars are provided.');
}
if (!serviceRoleKey) {
  console.warn('⚠ SUPABASE_SERVICE_ROLE_KEY not found. Admin client will be disabled.');
}

// ---------------------------------------------------
// 3️⃣ Browser / user client
// ---------------------------------------------------
export const supabase: SupabaseClient = canInitBrowserClient
  ? createClient(supabaseUrl!, supabaseAnonKey!, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
        storageKey: 'fx-auth-session',
      },
    })
  // Cast a dummy object to avoid import-time crashes; any usage will fail clearly at call sites if envs are missing
  : ({} as unknown as SupabaseClient);

// ---------------------------------------------------
// 4️⃣ Admin / server client (use only server-side)
// ---------------------------------------------------
export const supabaseAdmin: SupabaseClient | null = serviceRoleKey && supabaseUrl
  ? createClient(supabaseUrl, serviceRoleKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    })
  : null;

// ---------------------------------------------------
// 5️⃣ Helper getter to assert availability at runtime
// ---------------------------------------------------
export function getBrowserClient(): SupabaseClient {
  if (!canInitBrowserClient) {
    throw new Error('Supabase not configured. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY.');
  }
  return supabase;
}
