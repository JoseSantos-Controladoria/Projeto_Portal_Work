import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Alert, AlertDescription } from '@/app/components/ui/alert';
import { BarChart3, Lock } from 'lucide-react';

export function LoginPage() {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Por favor, preencha todos os campos');
      return;
    }

    const success = await login(email, password);
    if (!success) {
      setError('Email ou senha incorretos');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
      <div className="w-full max-w-md">
        {/* Logo e Título */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-[#2563EB] rounded-2xl mb-4 shadow-lg">
            <BarChart3 className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-slate-900 mb-2">TradeData Manager</h1>
          <p className="text-slate-600">Portal de Relatórios de Trade Marketing</p>
        </div>

        {/* Card de Login */}
        <Card className="shadow-xl border-0 rounded-xl">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl">Bem-vindo</CardTitle>
            <CardDescription>
              Entre com suas credenciais para acessar seus relatórios
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="seu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-11"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Senha</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="h-11"
                />
              </div>

              {error && (
                <Alert variant="destructive" className="py-2">
                  <Lock className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <Button type="submit" className="w-full h-11 bg-[#2563EB] hover:bg-[#1d4ed8]">
                Entrar
              </Button>
            </form>

            {/* Credenciais de Demonstração */}
            <div className="mt-6 pt-6 border-t border-slate-200">
              <p className="text-xs text-slate-500 mb-3 font-medium">Credenciais para demonstração:</p>
              <div className="space-y-2 text-xs text-slate-600">
                <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
                  <p className="font-medium text-slate-700 mb-1">👨‍💼 Administrador (Agência):</p>
                  <p className="font-mono text-xs">admin@tradedata.com</p>
                  <p className="font-mono text-xs">admin123</p>
                </div>
                <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
                  <p className="font-medium text-slate-700 mb-1">👤 Cliente:</p>
                  <p className="font-mono text-xs">carlos@supermercados.com</p>
                  <p className="font-mono text-xs">cliente123</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <p className="text-center text-xs text-slate-500 mt-6">
          © 2026 TradeData Manager. Acesso restrito.
        </p>
      </div>
    </div>
  );
}