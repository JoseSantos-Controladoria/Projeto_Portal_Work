import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Label } from "@/app/components/ui/label";
import { 
  Loader2, 
  LogIn
} from "lucide-react";

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
      
      {/* CARD DE LOGIN */}
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md border border-slate-100 relative z-10">
        
        {/* --- BLOCO DA LOGO SIMPLIFICADO --- */}
        <div className="flex flex-col items-center justify-center mb-10">
          <img 
            src="/images/logo-blue.png" 
            alt="Logo Work On" 
            className="h-20 w-auto object-contain"
          />
        </div>
        {/* ---------------------------------- */}

        <div className="space-y-6">
          <div className="space-y-2 text-center">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              Bem-vindo ao Portal BI
            </h1>
            <p className="text-sm text-slate-500">
              Insira suas credenciais para acessar
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-slate-700">E-mail Corporativo</Label>
              <Input
                id="email"
                type="email"
                placeholder="nome@workon.com.br"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-white/50 border-slate-200 focus:bg-white focus:border-blue-500 transition-all h-11"
              />
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="text-slate-700">Senha</Label>
                <a href="#" className="text-xs text-blue-600 hover:text-blue-500 font-medium hover:underline">
                  Esqueceu a senha?
                </a>
              </div>
              <Input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-white/50 border-slate-200 focus:bg-white focus:border-blue-500 transition-all h-11"
              />
            </div>

            {error && (
              <div className="p-3 rounded-md bg-red-50 border border-red-100 text-sm text-red-600 text-center flex items-center justify-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                {error}
              </div>
            )}

            <Button 
              type="submit" 
              className="w-full bg-blue-600 hover:bg-blue-700 h-12 text-base font-medium shadow-lg shadow-blue-900/20 hover:shadow-blue-600/30 transition-all duration-300 mt-2" 
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Autenticando...
                </>
              ) : (
                <>
                  <LogIn className="mr-2 h-4 w-4" />
                  Acessar Plataforma
                </>
              )}
            </Button>
          </form>
        </div>

        <div className="flex justify-center pb-2 pt-8">
          <p className="text-xs text-slate-400 font-medium">
            &copy; 2026 Work On. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </div>
  );
}