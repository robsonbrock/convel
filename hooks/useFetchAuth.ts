import { useCallback } from 'react';
import { createClient } from '@supabase/supabase-js';

export function useFetchAuth() {
  return useCallback(async (url: string, options?: RequestInit) => {
    // Get token from localStorage (set by Supabase)
    const token = localStorage.getItem('sb-auth-token');
    let authToken = '';

    if (token) {
      try {
        const parsed = JSON.parse(token);
        authToken = parsed.access_token;
      } catch (e) {
        // Token might be in different format
        authToken = token;
      }
    }

    const headers = new Headers(options?.headers || {});

    if (authToken) {
      headers.set('Authorization', `Bearer ${authToken}`);
    }

    return fetch(url, {
      ...options,
      headers,
    });
  }, []);
}
