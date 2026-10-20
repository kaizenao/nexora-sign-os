import React, { useState } from 'react';
import {
  Lock,
  Mail,
  ArrowRight,
  ShieldCheck,
  Loader2,
  Sparkles,
  Zap,
  Globe,
  MonitorCheck,
} from 'lucide-react';
import { Logo } from '../../../components/ui/Logo';
import { useSession } from '../../../context/SessionContext';
import { useToast } from '../../../components/ui/Toast';

export interface LoginPageProps {
  onSuccess: () => void;
  onNavigateToSignUp: () => void;
  onNavigateToLanding?: () => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onSuccess, onNavigateToSignUp, onNavigateToLanding }) => {
  const { login, isLoading } = useSession();
  const { showToast } = useToast();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleStandardLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!email.trim()) {
      setErrorMsg('Por favor, informe o seu e-mail de utilizador.');
      return;
    }

    const success = await login(email, password, rememberMe);
    if (success) {
      showToast('Sessão iniciada com sucesso na plataforma Nexora.', 'success');
      onSuccess();
    } else {
      setErrorMsg('Utilizador não encontrado nos registros do sistema.');
      showToast('E-mail não reconhecido no sistema.', 'danger');
    }
  };

  return (
    <div className="min-h-screen bg-[#060913] text-slate-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden font-sans selection:bg-[#00E5FF]/30 selection:text-[#00E5FF]">
      {/* Dynamic Background Mesh Gradients */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(0,229,255,0.18),rgba(15,23,42,0))] pointer-events-none" />
      <div className="absolute top-1/4 -right-20 w-96 h-96 bg-purple-600/15 rounded-full blur-[120px] pointer-events-none animate-pulse" />
      <div className="absolute bottom-10 -left-20 w-96 h-96 bg-cyan-500/15 rounded-full blur-[120px] pointer-events-none" />
      
      {/* Background Decorative Tech Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b12_1px,transparent_1px),linear-gradient(to_bottom,#1e293b12_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] pointer-events-none" />

      {/* Header Brand */}
      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10 text-center space-y-3">
        <div className="flex justify-center mb-2">
          <div className="relative p-3 rounded-2xl bg-white/[0.03] border border-white/10 shadow-[0_0_30px_rgba(0,229,255,0.15)] backdrop-blur-xl">
            <Logo variant="full" size="lg" />
          </div>
        </div>

        <div className="flex items-center justify-center gap-2">
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-[#00E5FF]/10 text-[#00E5FF] border border-[#00E5FF]/20 flex items-center gap-1 font-mono uppercase tracking-wider">
            <Zap className="w-3 h-3" /> Nexora OS 2.0
          </span>
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-1 font-mono uppercase tracking-wider">
            <Globe className="w-3 h-3" /> Angola (GMT+1)
          </span>
        </div>

        <h2 className="text-2xl font-extrabold text-white font-display tracking-tight">
          Acesso ao Sistema Operativo
        </h2>
        <p className="text-xs text-slate-400 max-w-sm mx-auto">
          Gestão inteligente de DOOH, Inteligência Artificial e monetização de redes de mídia indoor.
        </p>
      </div>

      {/* Card Form */}
      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md relative z-10 px-4">
        <div className="bg-[#0A0E1A]/80 backdrop-blur-2xl border border-white/[0.12] py-8 px-6 shadow-[0_20px_60px_rgba(0,0,0,0.7)] rounded-3xl sm:px-10 relative overflow-hidden group">
          {/* Subtle Ambient Top Border Accent */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#00E5FF] via-purple-500 to-pink-500" />

          {/* Standard Form */}
          <form className="space-y-5" onSubmit={handleStandardLogin}>
            {errorMsg && (
              <div className="p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2.5 shadow-lg animate-in fade-in">
                <span className="font-medium">{errorMsg}</span>
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center justify-between">
                <span>E-mail Corporativo</span>
                <span className="text-[10px] text-slate-500">Obrigatório</span>
              </label>
              <div className="relative group/input">
                <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2 group-focus-within/input:text-[#00E5FF] transition-colors" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="exemplo: mario.silva@empresa.ao"
                  className="w-full bg-slate-900/60 border border-white/10 focus:border-[#00E5FF] focus:ring-2 focus:ring-[#00E5FF]/20 rounded-xl pl-10 pr-4 py-3 text-xs text-white placeholder-slate-500 outline-none transition-all duration-200"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center justify-between">
                <span>Palavra-passe</span>
                <a
                  href="#forgot"
                  onClick={(e) => {
                    e.preventDefault();
                    showToast('Recuperação de acesso ativada via suporte oficial.', 'info');
                  }}
                  className="text-[11px] text-[#00E5FF] hover:text-[#00E5FF]/80 transition-colors"
                >
                  Esqueceu a senha?
                </a>
              </label>
              <div className="relative group/input">
                <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2 group-focus-within/input:text-[#00E5FF] transition-colors" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full bg-slate-900/60 border border-white/10 focus:border-[#00E5FF] focus:ring-2 focus:ring-[#00E5FF]/20 rounded-xl pl-10 pr-4 py-3 text-xs text-white placeholder-slate-500 outline-none transition-all duration-200"
                />
              </div>
            </div>

            <div className="flex items-center justify-between text-xs">
              <label className="flex items-center gap-2 cursor-pointer select-none text-slate-300 hover:text-white transition-colors">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded border-white/20 bg-slate-900 text-[#00E5FF] focus:ring-[#00E5FF] focus:ring-offset-0 cursor-pointer"
                />
                <span>Lembrar esta sessão</span>
              </label>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-[#00E5FF] to-[#0066FF] hover:from-[#00E5FF]/90 hover:to-[#0066FF]/90 text-slate-950 text-xs font-bold transition-all duration-200 shadow-[0_0_25px_rgba(0,229,255,0.35)] flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed transform hover:-translate-y-0.5 active:translate-y-0"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>A Autenticar...</span>
                </>
              ) : (
                <>
                  <span>Entrar no Nexora OS</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Bottom Divider & Sign Up Navigation */}
          <div className="mt-8 text-center text-xs text-slate-400 pt-5 border-t border-white/10 space-y-3">
            <div>
              Ainda não tem uma organização cadastrada?{' '}
              <button
                type="button"
                onClick={onNavigateToSignUp}
                className="text-[#00E5FF] font-bold hover:underline transition-all cursor-pointer block sm:inline mt-1 sm:mt-0"
              >
                Cadastrar Empresa / Anunciante
              </button>
            </div>

            {onNavigateToLanding && (
              <div className="pt-2">
                <button
                  type="button"
                  onClick={onNavigateToLanding}
                  className="text-xs text-slate-500 hover:text-slate-300 transition-colors cursor-pointer inline-flex items-center gap-1.5 group"
                >
                  <span className="group-hover:-translate-x-1 transition-transform">←</span>
                  <span>Voltar à página inicial</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Security Footer Pill */}
        <div className="mt-6 flex items-center justify-center gap-2 text-[11px] text-slate-500">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span>Sessão encriptada de alta segurança SHA-256</span>
        </div>
      </div>
    </div>
  );
};
