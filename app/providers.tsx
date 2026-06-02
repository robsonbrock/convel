'use client';

import { ThemeProvider } from '@/context/ThemeContext';
import { ReactNode, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  {
    auth: {
      persistSession: true,
      storageKey: 'sb-auth-token',
      autoRefreshToken: true,
      detectSessionInUrl: true,
    },
  }
);

function SessionSync({ children }: { children: ReactNode }) {
  useEffect(() => {
    // Detect session from URL (after OAuth callback)
    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log('[SessionSync] Session detected:', session?.user?.email);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.log('[SessionSync] Auth state changed:', { event, email: session?.user?.email });
    });

    return () => {
      subscription?.unsubscribe();
    };
  }, []);

  return children;
}

export function Providers({ children }: { children: ReactNode }) {
  return (
    <SessionSync>
      <ThemeProvider>{children}</ThemeProvider>
    </SessionSync>
  );
}
