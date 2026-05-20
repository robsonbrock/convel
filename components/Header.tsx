'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { UsuarioSession } from '@/lib/auth';
import { Button } from './ui/Button';
import { useState } from 'react';

interface HeaderProps {
  usuario?: UsuarioSession;
}

export function Header({ usuario }: HeaderProps) {
  const router = useRouter();
  const [openMenu, setOpenMenu] = useState(false);

  async function handleLogout() {
    try {
      const { createClient } = await import('@supabase/supabase-js');
      const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
      );
      await supabase.auth.signOut();
      router.push('/auth/login');
      router.refresh();
    } catch (error) {
      console.error('Logout error:', error);
    }
  }

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold">C</span>
          </div>
          <span className="text-xl font-bold text-gray-900">ConVEL</span>
        </Link>

        {usuario && (
          <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-medium text-gray-900">{usuario.nome}</p>
              <p className="text-xs text-gray-500">{usuario.role}</p>
            </div>

            <div className="relative">
              <button
                onClick={() => setOpenMenu(!openMenu)}
                className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center text-gray-700 font-semibold hover:bg-gray-300 transition-colors"
              >
                {usuario.nome.charAt(0).toUpperCase()}
              </button>

              {openMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg border border-gray-200 shadow-lg">
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
