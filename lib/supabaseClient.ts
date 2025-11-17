// lib/supabaseClient.ts
import { createClient, SupabaseClient } from '@supabase/supabase-js';

// ---------------------------------------------------
// 1️⃣ Environment variables
// ---------------------------------------------------
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

// ---------------------------------------------------
// 2️⃣ Validate required keys
// ---------------------------------------------------
if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY');
}

if (!serviceRoleKey) {
  console.warn('⚠ SUPABASE_SERVICE_ROLE_KEY not found. Admin client will be disabled.');
}

// ---------------------------------------------------
// 3️⃣ Browser / user client
// ---------------------------------------------------
export const supabase: SupabaseClient = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    storageKey: 'fx-auth-session',
  },
});

// ---------------------------------------------------
// 4️⃣ Admin / server client (use only server-side)
// ---------------------------------------------------
export const supabaseAdmin: SupabaseClient | null = serviceRoleKey
  ? createClient(supabaseUrl, serviceRoleKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    })
  : null;

// ---------------------------------------------------
// 5️⃣ Usage Notes
// ---------------------------------------------------
// Browser: use `supabase` for login, fetching, inserting user-specific data (enforces RLS)
// Server: use `supabaseAdmin` for admin operations, bypass RLS (never expose key to client)
