'use client';

import { useRouter } from 'next/navigation';

export default function UsuariosPage() {
  const router = useRouter();

  // Redirect to novo page which now has the full management interface
  if (typeof window !== 'undefined') {
    router.replace('/admin/usuarios/novo');
  }

  return null;
}
