"use client";
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useState, useEffect, createContext, useContext } from 'react';
import type { SupabaseClient } from '@supabase/supabase-js';

const SupabaseCtx = createContext<SupabaseClient | null>(null);

export default function SupabaseProvider({ children, initialSession }: { children: React.ReactNode; initialSession: any }) {
  const hasEnv = Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
  const [client, setClient] = useState<SupabaseClient | null>(null);

  useEffect(() => {
    if (!hasEnv) {
      console.warn('Supabase env variables missing. Rendering without Supabase client.');
      return;
    }
    const c = createClientComponentClient();
    setClient(c);

    const { data } = c.auth.onAuthStateChange((event, session) => {
      // No-op; keep for cookie sync if needed
      if (process.env.NODE_ENV === 'development') {
        console.log('Auth state changed:', event, session?.user?.email || 'no session');
      }
    });

    return () => {
      data.subscription.unsubscribe();
    };
  }, [hasEnv]);

  return <SupabaseCtx.Provider value={client}>{children}</SupabaseCtx.Provider>;
}

export function useSupabase() {
  return useContext(SupabaseCtx);
}
