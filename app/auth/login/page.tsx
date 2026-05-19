'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';

export default function LoginPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  useEffect(() => {
    // Processar token do hash (quando vindo do OAuth redirect)
    const hash = window.location.hash.substring(1);
    if (hash && hash.includes('access_token')) {
      const params = new URLSearchParams(hash);
      const accessToken = params.get('access_token');

      if (accessToken) {
        console.log('[Login] Token recebido do hash, salvando no localStorage e redirecionando...');
        // Salvar token no localStorage para que possa ser enviado via API
        localStorage.setItem('access_token', accessToken);

        // Limpar o hash da URL
        window.history.replaceState(null, '', '/auth/login');

        // Chamar endpoint para set o cookie via servidor
        fetch('/api/auth/set-cookie', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ token: accessToken }),
        })
          .then(() => {
            console.log('[Login] Cookie setado, redirecionando para dashboard...');
            router.push('/dashboard');
          })
          .catch((err) => {
            console.error('[Login] Erro ao set cookie:', err);
            setError('Erro ao configurar sessão');
          });
      }
    }
  }, [router]);

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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-lg">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-blue-600 rounded-lg flex items-center justify-center mx-auto mb-4">
            <span className="text-white text-2xl font-bold">C</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">ConVEL</h1>
          <p className="text-gray-600 text-sm mt-1">
            Sistema de Controle de Vendas e Empréstimos
          </p>
        </div>

        <div className="space-y-4">
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          <Button
            onClick={handleGoogleLogin}
            variant="primary"
            size="lg"
            className="w-full"
            disabled={loading}
          >
            {loading ? 'Conectando...' : '🔐 Entrar com Google'}
          </Button>
        </div>

        <p className="text-center text-xs text-gray-500 mt-6">
          Acesso restrito para usuários autorizados
        </p>
      </Card>
    </div>
  );
}
