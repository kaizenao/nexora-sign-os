import React, { useState } from 'react';
import {
  Sparkles,
  Building2,
  Calendar,
  Clock,
  Layers,
  ArrowUpRight,
  ShieldCheck,
  CheckCircle2,
  HardDrive,
  Tv,
  Users,
} from 'lucide-react';
import { useSession } from '../../../context/SessionContext';
import { useMySubscription } from '../hooks/useMySubscription';
import { formatKz, formatDate, formatInterval, formatCommercialModel } from '../utils/saasFormatters';
import { CommercialModelBadge } from '../components/CommercialModelBadge';
import { SubscriptionStatusBadge } from '../components/SubscriptionStatusBadge';
import { SubscriptionUsageCards } from '../components/SubscriptionUsageCards';
import { PlanFeatureGrid } from '../components/PlanFeatureGrid';
import { Button } from '../../../components/ui/Button';

interface MySubscriptionPageProps {
  onExplorePlans?: () => void;
}

export const MySubscriptionPage: React.FC<MySubscriptionPageProps> = ({ onExplorePlans }) => {
  const { currentOrganization } = useSession();
  const { summary, loading, error, refresh } = useMySubscription(currentOrganization?.id);
  const [upgradeRequested, setUpgradeRequested] = useState(false);

  if (loading) {
    return (
      <div className="p-8 text-center text-slate-400 animate-pulse">
        A carregar dados da sua subscrição...
      </div>
    );
  }

  if (error || !summary) {
    return (
      <div className="p-6 max-w-4xl mx-auto space-y-4">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 text-center">
          <Building2 className="w-12 h-12 text-slate-600 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-white">Nenhuma Subscrição Ativa</h3>
          <p className="text-sm text-slate-400 mt-1 max-w-md mx-auto">
            A organização <strong className="text-white">{currentOrganization?.name}</strong> ainda não possui um plano SaaS contratado ou está em processo de ativação.
          </p>
          {onExplorePlans && (
            <div className="mt-5">
              <Button variant="primary" onClick={onExplorePlans}>
                Conhecer Planos Disponíveis
              </Button>
            </div>
          )}
        </div>
      </div>
    );
  }

  const { subscription: sub, plan } = summary;
  const activeAddOns = sub.addOns?.filter((a) => a.active) || [];
  const addOnsTotalKz = activeAddOns.reduce((sum, a) => sum + a.unitPrice * a.quantity, 0);
  const totalMonthlyKz = sub.price + addOnsTotalKz;
  const modelInfo = formatCommercialModel(sub.commercialModel);

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-cyan-400 uppercase tracking-wider">
              Minha Conta & Licenciamento
            </span>
          </div>
          <h1 className="text-2xl font-bold text-white mt-1">Minha Subscrição SaaS</h1>
          <p className="text-sm text-slate-400 mt-0.5">
            Acompanhe a capacidade de rede, cotas de armazenamento e ciclo contratual da sua organização.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {onExplorePlans && (
            <Button variant="outline" size="sm" onClick={onExplorePlans} className="text-xs">
              <Layers className="w-3.5 h-3.5 mr-1.5" />
              Ver Todos os Planos
            </Button>
          )}

          <Button
            variant="primary"
            size="sm"
            onClick={() => setUpgradeRequested(true)}
            className="text-xs shadow-lg shadow-cyan-500/20"
          >
            <ArrowUpRight className="w-4 h-4 mr-1" />
            Fazer Upgrade de Plano
          </Button>
        </div>
      </div>

      {/* Upgrade Request Feedback */}
      {upgradeRequested && (
        <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
            <div>
              <h5 className="text-xs font-semibold text-emerald-300">
                Solicitação de Upgrade Registrada
              </h5>
              <p className="text-xs text-slate-300 mt-0.5">
                Nossa equipe comercial da Nexora entrará em contato para ajustar seus limites de displays e créditos de IA.
              </p>
            </div>
          </div>
          <button
            onClick={() => setUpgradeRequested(false)}
            className="text-xs text-slate-400 hover:text-white px-2.5 py-1 rounded bg-slate-800"
          >
            Dispensar
          </button>
        </div>
      )}

      {/* Plan Card Overview */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <CommercialModelBadge model={sub.commercialModel} />
              <SubscriptionStatusBadge status={sub.status} />
            </div>

            <div className="flex items-center gap-2 mt-1">
              <h2 className="text-2xl font-bold text-white">{plan.name}</h2>
              <span className="text-xs font-mono text-cyan-400 font-semibold px-2 py-0.5 rounded bg-cyan-500/10 border border-cyan-500/20 uppercase">
                {plan.code}
              </span>
            </div>

            <p className="text-sm text-slate-400 mt-1 max-w-xl leading-relaxed">
              {plan.description}
            </p>
          </div>

          {/* Pricing Box */}
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 shrink-0 min-w-[260px]">
            <span className="text-xs font-medium text-slate-400">Valor do Plano Atual</span>
            <div className="flex items-baseline gap-1 mt-0.5">
              <span className="text-2xl font-extrabold text-white">{formatKz(totalMonthlyKz)}</span>
              <span className="text-xs text-slate-400 font-medium">
                {formatInterval(sub.billingInterval)}
              </span>
            </div>

            <div className="mt-3 pt-2.5 border-t border-slate-800/80 flex items-center justify-between text-xs">
              <span className="text-slate-400">Próxima Renovação:</span>
              <span className="font-semibold text-cyan-300">{formatDate(sub.nextRenewalDate)}</span>
            </div>
          </div>
        </div>

        {/* Quick specs banner */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-6 border-t border-slate-800 text-xs">
          <div className="bg-slate-950/60 p-3 rounded-lg border border-slate-800/60">
            <span className="text-slate-500 block">Modelo Operacional</span>
            <span className="font-semibold text-slate-300 mt-1 block">{modelInfo.label}</span>
          </div>

          <div className="bg-slate-950/60 p-3 rounded-lg border border-slate-800/60">
            <span className="text-slate-500 block">Renovação Automática</span>
            <span className="font-semibold text-emerald-400 mt-1 block">
              {sub.autoRenew ? 'Ativa' : 'Manual'}
            </span>
          </div>

          <div className="bg-slate-950/60 p-3 rounded-lg border border-slate-800/60">
            <span className="text-slate-500 block">Início da Subscrição</span>
            <span className="font-semibold text-slate-300 mt-1 block">{formatDate(sub.startDate)}</span>
          </div>

          <div className="bg-slate-950/60 p-3 rounded-lg border border-slate-800/60">
            <span className="text-slate-500 block">Add-ons Contratados</span>
            <span className="font-semibold text-violet-400 mt-1 block">
              {activeAddOns.length > 0 ? `${activeAddOns.length} ativo(s)` : 'Nenhum'}
            </span>
          </div>
        </div>
      </div>

      {/* Usage Telemetry & Limits */}
      <div className="space-y-3">
        <div>
          <h3 className="text-lg font-bold text-white">Capacidade & Consumo Atual</h3>
          <p className="text-xs text-slate-400">
            Uso em tempo real dos recursos contratados pela organização {currentOrganization?.name}.
          </p>
        </div>

        <SubscriptionUsageCards summary={summary} />
      </div>

      {/* Plan Features Included */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
        <h3 className="text-base font-bold text-white mb-1 flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-cyan-400" />
          <span>Recursos Habilitados na sua Conta</span>
        </h3>
        <p className="text-xs text-slate-400 mb-5">
          Funcionalidades disponíveis para você e sua equipe com o plano {plan.name}.
        </p>

        <PlanFeatureGrid features={plan.features} interactive={false} />
      </div>
    </div>
  );
};
