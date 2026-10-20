import React, { useState } from 'react';
import {
  Building,
  Briefcase,
  ArrowLeft,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  MessageSquare,
  RefreshCw,
  Zap,
  Globe,
} from 'lucide-react';
import { Logo } from '../../../components/ui/Logo';
import { useSession } from '../../../context/SessionContext';
import { OrganizationType } from '../../../types/auth';
import { useToast } from '../../../components/ui/Toast';

export interface SignUpPageProps {
  onSuccess: () => void;
  onNavigateToLogin: () => void;
  onNavigateToLanding?: () => void;
}

/**
 * SignUpPage — criação de conta de organização num único passo.
 *
 * ⛔ O QUE MUDOU: existia um passo intermédio de "verificação por WhatsApp"
 * (código de 6 dígitos) que bloqueava o registo. Foi retirado a pedido do
 * cliente: o número de WhatsApp continua a ser recolhido como CONTACTO da
 * organização (é por onde chegam as notificações), mas já não é preciso código
 * nenhum para criar a conta.
 */
export const SignUpPage: React.FC<SignUpPageProps> = ({ onSuccess, onNavigateToLogin, onNavigateToLanding }) => {
  const { login } = useSession();
  const { showToast } = useToast();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [orgName, setOrgName] = useState('');
  const [tradeName, setTradeName] = useState('');
  const [orgType, setOrgType] = useState<OrganizationType>('CLIENT');
  const [nif, setNif] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim() || !email.trim() || !orgName.trim() || !password.trim() || !phone.trim()) {
      showToast('Por favor, preencha todos os campos obrigatórios.', 'danger');
      return;
    }
    if (password.trim().length < 8) {
      showToast('A palavra-passe deve ter pelo menos 8 caracteres.', 'danger');
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          org_id: `org-${Date.now()}`,
          org_name: orgName.trim(),
          org_type: orgType,
          email: email.trim().toLowerCase(),
          full_name: name.trim(),
          password,
          phone: phone.trim(),
          nif: nif.trim(),
          role: orgType === 'CLIENT' ? 'CLIENT_OWNER' : orgType === 'ADVERTISER' ? 'ADVERTISER_OWNER' : 'NEXORA_ADMIN',
        }),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        // O servidor é a autoridade: e-mail já registado, password curta, etc.
        showToast(data?.error || 'Não foi possível criar a conta.', 'danger');
        setIsSubmitting(false);
        return;
      }

      const loggedIn = await login(email.trim().toLowerCase(), password);
      if (!loggedIn) {
        showToast(
          'Conta criada',
          'A conta foi criada, mas o início de sessão automático falhou. Entre com o seu e-mail e palavra-passe.',
          'warning'
        );
        onNavigateToLogin();
        return;
      }

      showToast(`Organização "${orgName.trim()}" cadastrada com sucesso!`, 'success');
      onSuccess();
    } catch (err: any) {
      showToast('Erro ao registar a organização.', err?.message || 'Falha de comunicação com o servidor.', 'danger');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#060913] text-slate-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden font-sans selection:bg-[#00E5FF]/30 selection:text-[#00E5FF]">
      {/* Dynamic Background Mesh Gradients */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(6,182,212,0.18),rgba(15,23,42,0))] pointer-events-none" />
      <div className="absolute top-1/4 -left-20 w-96 h-96 bg-purple-600/15 rounded-full blur-[120px] pointer-events-none animate-pulse" />
      <div className="absolute bottom-10 -right-20 w-96 h-96 bg-cyan-500/15 rounded-full blur-[120px] pointer-events-none" />

      {/* Background Decorative Tech Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b12_1px,transparent_1px),linear-gradient(to_bottom,#1e293b12_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] pointer-events-none" />

      {/* Header Brand */}
      <div className="sm:mx-auto sm:w-full sm:max-w-lg relative z-10 text-center space-y-3">
        <div className="flex justify-center mb-2">
          <div className="relative p-3 rounded-2xl bg-white/[0.03] border border-white/10 shadow-[0_0_30px_rgba(0,229,255,0.15)] backdrop-blur-xl">
            <Logo variant="full" size="lg" />
          </div>
        </div>

        <div className="flex items-center justify-center gap-2">
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-[#00E5FF]/10 text-[#00E5FF] border border-[#00E5FF]/20 flex items-center gap-1 font-mono uppercase tracking-wider">
            <Zap className="w-3 h-3" /> Registo Corporativo
          </span>
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-1 font-mono uppercase tracking-wider">
            <Globe className="w-3 h-3" /> Angola (GMT+1)
          </span>
        </div>

        <h2 className="text-2xl font-extrabold text-white font-display tracking-tight">
          Criar Conta de Organização
        </h2>
        <p className="text-xs text-slate-400 max-w-md mx-auto">
          Registe a sua empresa como Parceiro de Espaço ou Anunciante e conecte-se à rede Nexora.
        </p>
      </div>

      {/* Main Container */}
      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-2xl relative z-10 px-4">
        <div className="bg-[#0A0E1A]/80 backdrop-blur-2xl border border-white/[0.12] py-8 px-6 shadow-[0_20px_60px_rgba(0,0,0,0.7)] rounded-3xl sm:px-10 relative overflow-hidden">
          {/* Ambient Top Border Accent */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 via-[#00E5FF] to-purple-500" />

          <form className="space-y-6" onSubmit={handleSubmit}>
            {/* Type Selector */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-2.5">
                Selecione o Tipo de Perfil
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <button
                  type="button"
                  onClick={() => setOrgType('CLIENT')}
                  className={`p-4 rounded-2xl border text-left transition-all cursor-pointer flex items-start gap-3.5 relative overflow-hidden group/card ${
                    orgType === 'CLIENT'
                      ? 'bg-[#00E5FF]/10 border-[#00E5FF] text-white shadow-[0_0_20px_rgba(0,229,255,0.2)]'
                      : 'bg-slate-900/40 border-white/10 text-slate-400 hover:bg-slate-900/70 hover:border-white/20'
                  }`}
                >
                  <div className="p-2 rounded-xl bg-[#00E5FF]/15 border border-[#00E5FF]/30 text-[#00E5FF] shrink-0 mt-0.5">
                    <Building className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-white group-hover/card:text-[#00E5FF] transition-colors">
                      Parceiro / Proprietário de Espaço
                    </p>
                    <p className="text-[11px] text-slate-400 leading-snug mt-1">
                      Tenho locais ou displays físicos para veicular anúncios e receber repasses.
                    </p>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setOrgType('ADVERTISER')}
                  className={`p-4 rounded-2xl border text-left transition-all cursor-pointer flex items-start gap-3.5 relative overflow-hidden group/card ${
                    orgType === 'ADVERTISER'
                      ? 'bg-pink-500/10 border-pink-500 text-white shadow-[0_0_20px_rgba(236,72,153,0.2)]'
                      : 'bg-slate-900/40 border-white/10 text-slate-400 hover:bg-slate-900/70 hover:border-white/20'
                  }`}
                >
                  <div className="p-2 rounded-xl bg-pink-500/15 border border-pink-500/30 text-pink-400 shrink-0 mt-0.5">
                    <Briefcase className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-white group-hover/card:text-pink-400 transition-colors">
                      Anunciante / Agência
                    </p>
                    <p className="text-[11px] text-slate-400 leading-snug mt-1">
                      Quero comprar slots de mídia e veicular campanhas na rede de telas.
                    </p>
                  </div>
                </button>
              </div>
            </div>

            {/* Form Input Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Nome da Organização *
                </label>
                <input
                  type="text"
                  required
                  value={orgName}
                  onChange={(e) => setOrgName(e.target.value)}
                  placeholder="ex: Belas Retail S.A."
                  className="w-full bg-slate-900/60 border border-white/10 focus:border-[#00E5FF] focus:ring-2 focus:ring-[#00E5FF]/20 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 outline-none transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Razão Social Completa
                </label>
                <input
                  type="text"
                  value={tradeName}
                  onChange={(e) => setTradeName(e.target.value)}
                  placeholder="ex: Belas Comércio & Serviços Lda."
                  className="w-full bg-slate-900/60 border border-white/10 focus:border-[#00E5FF] focus:ring-2 focus:ring-[#00E5FF]/20 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 outline-none transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Nome do Responsável *
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="ex: António Mateus"
                  className="w-full bg-slate-900/60 border border-white/10 focus:border-[#00E5FF] focus:ring-2 focus:ring-[#00E5FF]/20 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 outline-none transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  E-mail Corporativo *
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="ex: antonio@belas.ao"
                  className="w-full bg-slate-900/60 border border-white/10 focus:border-[#00E5FF] focus:ring-2 focus:ring-[#00E5FF]/20 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 outline-none transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
                  <MessageSquare className="w-3.5 h-3.5 text-emerald-400" /> WhatsApp / Telefone *
                </label>
                <input
                  type="text"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="244923000000"
                  className="w-full bg-slate-900/60 border border-white/10 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/20 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 outline-none font-mono transition-all"
                />
                <span className="text-[10px] text-slate-500 mt-1 block">
                  Usado para enviar as notificações da conta. Sem código de verificação.
                </span>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  NIF da Empresa (Angola)
                </label>
                <input
                  type="text"
                  value={nif}
                  onChange={(e) => setNif(e.target.value)}
                  placeholder="5401234567"
                  className="w-full bg-slate-900/60 border border-white/10 focus:border-[#00E5FF] focus:ring-2 focus:ring-[#00E5FF]/20 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 outline-none font-mono transition-all"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Palavra-passe (Senha) *
                </label>
                <input
                  type="password"
                  required
                  minLength={8}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Mínimo 8 caracteres"
                  className="w-full bg-slate-900/60 border border-white/10 focus:border-[#00E5FF] focus:ring-2 focus:ring-[#00E5FF]/20 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 outline-none transition-all"
                />
                <span className="text-[10px] text-slate-500 mt-1 block">
                  Guardada com hash scrypt. A conta entra de imediato com estas credenciais.
                </span>
              </div>
            </div>

            {/* Nota de segurança (substitui o antigo passo de verificação) */}
            <div className="p-3.5 rounded-2xl bg-emerald-500/[0.07] border border-emerald-500/25 flex items-start gap-2.5">
              <ShieldCheck className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
              <p className="text-[11px] text-slate-300 leading-relaxed">
                A conta é criada imediatamente, sem passo de verificação por WhatsApp. O acesso fica
                associado a este e-mail e palavra-passe.
              </p>
            </div>

            {/* Submit */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 text-xs font-bold transition-all shadow-[0_0_25px_rgba(16,185,129,0.3)] flex items-center justify-center gap-2 cursor-pointer transform hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-60"
              >
                {isSubmitting ? (
                  <RefreshCw className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Criar Conta</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Switch to Login */}
          <div className="mt-8 text-center text-xs text-slate-400 pt-4 border-t border-white/10 flex items-center justify-center gap-2">
            <span>Já tem uma conta configurada?</span>
            <button
              type="button"
              onClick={onNavigateToLogin}
              className="text-[#00E5FF] font-bold hover:underline transition-colors cursor-pointer flex items-center gap-1"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Voltar ao Login</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
