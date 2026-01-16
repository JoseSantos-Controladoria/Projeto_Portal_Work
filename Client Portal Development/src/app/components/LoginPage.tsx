import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Label } from "@/app/components/ui/label";
import { 
  Loader2, 
  LogIn
} from "lucide-react";
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
      
      {/* CARD DE LOGIN */}
      <Card className="w-full max-w-md shadow-2xl border-white/50 bg-white/95 backdrop-blur-xl relative z-10 animate-in fade-in zoom-in duration-500">
        <CardHeader className="space-y-6 flex flex-col items-center pt-10 pb-6">
          
          <div className="relative w-24 h-24 flex items-center justify-center p-1">
            <img 
              src="/images/work-on.png" 
              alt="Logo Work On" 
              className="w-full h-full object-contain"
            />
          </div>

          <div className="text-center space-y-2">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              Portal Work On
            </h1>
            <p className="text-sm text-slate-500 font-medium">
              Intelligence & Trade Marketing
            </p>
          </div>
        </CardHeader>

        <CardContent>
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
        </CardContent>

        <CardFooter className="flex justify-center pb-8 pt-2">
          <p className="text-xs text-slate-400 font-medium">
            &copy; 2026 Work On. Todos os direitos reservados.
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}