import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Label } from "@/app/components/ui/label";
import { 
  Loader2, 
  LogIn, 
  Store, 
  ShoppingCart, 
  TrendingUp, 
  Package, 
  Tag, 
  Megaphone, 
  BarChart3, 
  Truck, 
  Users, 
  ClipboardCheck, 
  QrCode, 
  ScanBarcode, 
  ShoppingBag, 
  Percent
} from "lucide-react";
import { Card, CardContent, CardFooter, CardHeader } from "@/app/components/ui/card";

const TRADE_ICONS = [
  Store, ShoppingCart, TrendingUp, Package, Tag, Megaphone, 
  BarChart3, Truck, Users, ClipboardCheck, QrCode, ScanBarcode, ShoppingBag, Percent
];

const IconMarquee = ({ reverse = false, duration = "40s" }: { reverse?: boolean, duration?: string }) => {
  return (
    // AJUSTE CRÍTICO: Mudei opacity-[0.15] para opacity-40 (Bem mais visível)
    <div className="flex overflow-hidden py-4 select-none opacity-40 pointer-events-none">
      <div 
        className="flex gap-16 shrink-0 items-center justify-around min-w-full"
        style={{
          animation: `marquee${reverse ? '-reverse' : ''} ${duration} linear infinite`
        }}
      >
        {[...TRADE_ICONS, ...TRADE_ICONS, ...TRADE_ICONS].map((Icon, idx) => (
          // Ícones em Azul Vibrante (blue-600)
          <Icon key={idx} className="w-14 h-14 text-blue-600" />
        ))}
      </div>
      <div 
        className="flex gap-16 shrink-0 items-center justify-around min-w-full"
        style={{
          animation: `marquee${reverse ? '-reverse' : ''} ${duration} linear infinite`
        }}
      >
        {[...TRADE_ICONS, ...TRADE_ICONS, ...TRADE_ICONS].map((Icon, idx) => (
          <Icon key={`dup-${idx}`} className="w-14 h-14 text-blue-600" />
        ))}
      </div>
    </div>
  );
};

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
      
      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-100%); }
        }
        @keyframes marquee-reverse {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(0); }
        }
      `}</style>

      {/* BACKGROUND ANIMADO */}
      <div className="absolute inset-0 flex flex-col justify-center -rotate-6 scale-110 z-0">
        <IconMarquee duration="60s" />
        <IconMarquee reverse duration="50s" />
        <IconMarquee duration="70s" />
        <IconMarquee reverse duration="55s" />
        <IconMarquee duration="80s" />
      </div>

      {/* Máscara de Gradiente (Mantida para focar o centro, mas o fundo está mais forte agora) */}
      <div className="absolute inset-0 bg-gradient-to-b from-slate-50/80 via-slate-50/40 to-slate-50/80 z-0 pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-r from-slate-50/80 via-transparent to-slate-50/80 z-0 pointer-events-none" />

      {/* CARD DE LOGIN */}
      <Card className="w-full max-w-md shadow-2xl border-white/50 bg-white/95 backdrop-blur-xl relative z-10 animate-in fade-in zoom-in duration-500">
        <CardHeader className="space-y-6 flex flex-col items-center pt-10 pb-6">
          
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-cyan-500 rounded-2xl blur opacity-30 group-hover:opacity-60 transition duration-1000 group-hover:duration-200" />
            <div className="relative w-24 h-24 bg-white rounded-2xl shadow-xl flex items-center justify-center p-5 ring-1 ring-slate-900/5">
              <img 
                src="/images/work-on.png" 
                alt="Logo Work On" 
                className="w-full h-full object-contain"
              />
            </div>
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
                <Label htmlFor="password" classname="text-slate-700">Senha</Label>
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