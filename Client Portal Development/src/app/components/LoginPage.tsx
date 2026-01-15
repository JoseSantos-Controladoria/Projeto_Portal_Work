import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Label } from "@/app/components/ui/label";
import { Loader2, LogIn } from "lucide-react";
import { Card, CardContent, CardFooter, CardHeader } from "@/app/components/ui/card";

export function LoginPage() {
  const { login } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      await login(email, password);
    } catch (err) {
      setError("Credenciais inválidas. Tente novamente.");
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 relative overflow-hidden">
      
      {/* Fundo Decorativo (Opcional) */}
      <div className="absolute inset-0 bg-grid-slate-200 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))] -z-10" />

      <Card className="w-full max-w-md shadow-2xl border-slate-100 bg-white/80 backdrop-blur-sm">
        <CardHeader className="space-y-6 flex flex-col items-center pt-10 pb-6">
          
          {/* LOGO DA EMPRESA */}
          <div className="w-20 h-20 bg-white rounded-2xl shadow-lg shadow-blue-900/10 flex items-center justify-center p-4">
            <img 
              src="/images/work-on.png" 
              alt="Logo Work On" 
              className="w-full h-full object-contain"
            />
          </div>

          <div className="text-center space-y-2">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              Bem-vindo ao Portal Analytics
            </h1>
            <p className="text-sm text-slate-500">
              Insira suas credenciais para acessar nosso portal.
            </p>
          </div>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">E-mail </Label>
              <Input
                id="email"
                type="email"
                placeholder="nome@empresa.com.br"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-slate-50 border-slate-200"
              />
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Senha</Label>
                <a href="#" className="text-xs text-blue-600 hover:text-blue-500 font-medium">
                  Esqueceu a senha?
                </a>
              </div>
              <Input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-slate-50 border-slate-200"
              />
            </div>

            {error && (
              <div className="p-3 rounded-md bg-red-50 border border-red-100 text-sm text-red-600 text-center">
                {error}
              </div>
            )}

            <Button 
              type="submit" 
              className="w-full bg-blue-600 hover:bg-blue-700 h-11 text-base shadow-lg shadow-blue-900/20 transition-all duration-300" 
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Entrando...
                </>
              ) : (
                <>
                  <LogIn className="mr-2 h-4 w-4" />
                  Acessar Plataforma
                </>
              )}
            </Button>
          </form>
        </CardContent>

        <CardFooter className="flex justify-center pb-8 pt-2">
          <p className="text-xs text-slate-400">
            &copy; 2026 Work On. Todos os direitos reservados.
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}