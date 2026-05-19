'use client';

import { useEffect, useState } from 'react';
import { Header } from '@/components/Header';
import { Sidebar } from '@/components/Sidebar';
import { UsuarioSession } from '@/lib/auth';

const mockUsuario: UsuarioSession = {
  id: '1',
  cpf: '000.000.000-00',
  nome: 'Usuário',
  email: 'user@example.com',
  role: 'vendedor',
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [usuario, setUsuario] = useState<UsuarioSession>(mockUsuario);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(false);
  }, []);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Carregando...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header usuario={usuario} />
      <div className="flex">
        <Sidebar usuario={usuario} />
        <main className="flex-1 ml-64 p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
