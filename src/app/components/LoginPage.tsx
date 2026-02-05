import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Label } from "@/app/components/ui/label";
import { 
  Loader2, 
  LogIn,
  AlertCircle // Ícone para o erro
} from "lucide-react";

export function LoginPage() {
  // 1. Buscamos o errorMessage direto do contexto (que vem do Backend)
  const { login, errorMessage } = useAuth();
  
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // 2. O login retorna um booleano (true/false), não lança erro
    const success = await login(email, password);

    if (!success) {
      // Se falhou, apenas paramos o loading. 
      // O 'errorMessage' será atualizado automaticamente pelo AuthContext
      setIsLoading(false);
    }
    // Se sucesso, o AuthContext ou App redireciona o usuário (useEffect de auth)
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 relative overflow-hidden">
      
      {/* Background Decorativo (Opcional) */}
      <div className="absolute inset-0 bg-grid-slate-100 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))] -z-0" />

      {/* CARD DE LOGIN */}
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md border border-slate-100 relative z-10 animate-in fade-in zoom-in duration-500">
        
        <div className="flex flex-col items-center justify-center mb-8">
          <img 
            src="/images/logo-blue.png" 
            alt="Logo Work On" 
            className="h-16 w-auto object-contain mb-4"
          />
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
             Bem-vindo ao Data Hub
          </h1>
          <p className="text-sm text-slate-500 mt-1">
             Insira suas credenciais para acessar
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="email" className="text-slate-700 font-medium">E-mail Corporativo</Label>
            <Input
              id="email"
              type="email"
              placeholder="nome@workongroup.com.br"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-slate-50 border-slate-200 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all h-11"
            />
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="password" className="text-slate-700 font-medium">Senha</Label>
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
              className="bg-slate-50 border-slate-200 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all h-11"
            />
          </div>

          {/* 3. Exibição da Mensagem de Erro (Conectada ao Contexto) */}
          {errorMessage && (
            <div className="p-3 rounded-lg bg-red-50 border border-red-100 text-sm text-red-600 flex items-center gap-3 animate-in fade-in slide-in-from-top-2">
              <AlertCircle className="w-5 h-5 text-red-500 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          <Button 
            type="submit" 
            className="w-full bg-blue-600 hover:bg-blue-700 h-12 text-base font-medium shadow-lg shadow-blue-900/10 hover:shadow-blue-600/20 transition-all duration-300" 
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Autenticando...
              </>
            ) : (
              <>
                <LogIn className="mr-2 h-5 w-5" />
                Acessar Plataforma
              </>
            )}
          </Button>
        </form>

        <div className="flex justify-center pt-8">
          <p className="text-xs text-slate-400 font-medium">
            &copy; 2026 Work On. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </div>
  );
}