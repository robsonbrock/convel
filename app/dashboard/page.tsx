'use client';

import { useEffect, useState } from 'react';
import { UsuarioSession } from '@/lib/auth';
import { Card } from '@/components/ui/Card';

export default function DashboardPage() {
  const [usuario, setUsuario] = useState<UsuarioSession | null>(null);

  useEffect(() => {
    async function fetchSession() {
      try {
        const response = await fetch('/api/auth/me');
        if (response.ok) {
          const data = await response.json();
          setUsuario(data.usuario);
        }
      } catch (error) {
        console.error('Error:', error);
      }
    }

    fetchSession();
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">
          Bem-vindo ao ConVEL
        </h1>
        {usuario && (
          <p className="text-gray-600 mt-2">
            Olá, {usuario.nome}! 👋
          </p>
        )}
      </div>

      <Card>
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Dashboard em Desenvolvimento
          </h2>
          <p className="text-gray-600 mb-6">
            Bem-vindo ao sistema ConVEL de controle de vendas e empréstimos
          </p>
          <p className="text-sm text-gray-500">
            As funcionalidades serão adicionadas nas próximas fases de desenvolvimento
          </p>
        </div>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { icon: '📚', title: 'Livros', desc: 'Catálogo de livros' },
          { icon: '💰', title: 'Vendas', desc: 'Registro de vendas' },
          { icon: '🔄', title: 'Empréstimos', desc: 'Controle de empréstimos' },
          { icon: '👥', title: 'Usuários', desc: 'Gestão de usuários' },
        ].map((widget) => (
          <Card key={widget.title} className="text-center">
            <div className="text-3xl mb-2">{widget.icon}</div>
            <h3 className="font-semibold text-gray-900">{widget.title}</h3>
            <p className="text-xs text-gray-600">{widget.desc}</p>
          </Card>
        ))}
      </div>
    </div>
  );
}
