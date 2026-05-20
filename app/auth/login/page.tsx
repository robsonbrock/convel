'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';

export default function LoginPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleGoogleLogin() {
    setError('');
    setLoading(true);

    try {
      const response = await fetch('/api/auth/google', {
        method: 'POST',
      });

      if (!response.ok) {
        const data = await response.json();
        setError(data.message || 'Falha ao conectar com Google');
        return;
      }

      const { url } = await response.json();
      window.location.href = url;
    } catch (err) {
      setError('Erro ao conectar com o servidor');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-primary-99 flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-elevation-3">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-primary-40 rounded-lg flex items-center justify-center mx-auto mb-4">
            <span className="text-primary-99 text-2xl font-bold">C</span>
          </div>
          <h1 className="text-headline-md text-primary-10 font-semibold">ConVEL</h1>
          <p className="text-body-md text-secondary-50 mt-2">
            Sistema de Controle de Vendas e Empréstimos
          </p>
        </div>

        <div className="space-y-4">
          {error && (
            <div className="bg-error-95 border-l-4 border-error-40 rounded-md p-4">
              <p className="text-body-sm text-error-40 font-medium">{error}</p>
            </div>
          )}

          <Button
            onClick={handleGoogleLogin}
            variant="filled"
            size="lg"
            className="w-full"
            disabled={loading}
          >
            {loading ? 'Conectando...' : '🔐 Entrar com Google'}
          </Button>
        </div>

        <div className="mt-6 pt-4 border-t border-secondary-90">
          <p className="text-center text-body-sm text-secondary-60">
            Acesso restrito para usuários autorizados
          </p>
        </div>
      </Card>
    </div>
  );
}
