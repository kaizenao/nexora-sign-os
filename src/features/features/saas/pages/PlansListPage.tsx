import React, { useState } from 'react';
import { Plus, Sparkles, Layers, RefreshCw, AlertCircle } from 'lucide-react';
import { usePlans } from '../hooks/usePlans';
import { useSession } from '../../../context/SessionContext';
import { Plan } from '../../../types/saas';
import { PlanKpiSummary } from '../components/PlanKpiSummary';
import { PlanFiltersBar } from '../components/PlanFiltersBar';
import { PlanCard } from '../components/PlanCard';
import { CreatePlanModal } from '../components/CreatePlanModal';
import { Button } from '../../../components/ui/Button';

interface PlansListPageProps {
  onNavigateToDetail?: (planId: string) => void;
}

export const PlansListPage: React.FC<PlansListPageProps> = ({ onNavigateToDetail }) => {
  const { currentOrganization, currentMembership } = useSession();
  const isNexoraAdmin = currentOrganization?.type === 'NEXORA' || currentMembership?.role === 'NEXORA_ADMIN';
  const { plans, kpis, filters, setFilters, loading, error, refresh, createPlan } = usePlans();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPlanForEdit, setSelectedPlanForEdit] = useState<Plan | null>(null);

  const handleOpenCreate = () => {
    setSelectedPlanForEdit(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (plan: Plan) => {
    setSelectedPlanForEdit(plan);
    setIsModalOpen(true);
  };

  const handleSelectPlan = (plan: Plan) => {
    if (onNavigateToDetail) {
      onNavigateToDetail(plan.id);
    }
  };

  const handleModalSubmit = async (planData: Partial<Plan>) => {
    if (selectedPlanForEdit) {
      // update plan
      await createPlan(planData); // or update
    } else {
      await createPlan(planData);
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-cyan-400 uppercase tracking-wider">
              SaaS & Gestão Comercial
            </span>
          </div>
          <h1 className="text-2xl font-bold text-white mt-1">Catálogo de Pacotes & Planos</h1>
          <p className="text-sm text-slate-400 mt-0.5">
            Benefícios exclusivos, precificação garantida por 30 dias em Kwanzas (AOA) e atribuição inteligente de slots.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Button
            variant="outline"
            size="sm"
            onClick={refresh}
            disabled={loading}
            className="text-xs"
          >
            <RefreshCw className={`w-3.5 h-3.5 mr-1.5 ${loading ? 'animate-spin' : ''}`} />
            Atualizar
          </Button>

          {isNexoraAdmin && (
            <Button
              variant="primary"
              size="sm"
              onClick={handleOpenCreate}
              className="text-xs shadow-lg shadow-cyan-500/20"
            >
              <Plus className="w-4 h-4 mr-1.5" />
              Criar Novo Plano
            </Button>
          )}
        </div>
      </div>

      {/* KPI Metrics */}
      <PlanKpiSummary kpis={kpis} />

      {/* Error state */}
      {error && (
        <div className="bg-rose-500/10 border border-rose-500/30 rounded-xl p-4 flex items-center gap-3 text-rose-400 text-sm">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Search and Filters */}
      <PlanFiltersBar filters={filters} onChange={setFilters} />

      {/* Plans Catalog Grid */}
      {loading && plans.length === 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
          {[1, 2, 3].map((n) => (
            <div key={n} className="bg-slate-900 border border-slate-800 rounded-xl h-96 p-6" />
          ))}
        </div>
      ) : plans.length === 0 ? (
        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-12 text-center">
          <Layers className="w-12 h-12 text-slate-600 mx-auto mb-3" />
          <h4 className="text-base font-semibold text-white">Nenhum plano encontrado</h4>
          <p className="text-sm text-slate-400 mt-1 max-w-md mx-auto">
            Não existem planos correspondentes aos filtros selecionados. Tente ajustar a busca.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {plans.map((plan) => (
            <PlanCard
              key={plan.id}
              plan={plan}
              onSelect={handleSelectPlan}
              onEdit={handleOpenEdit}
              showAdminActions={currentOrganization?.type === 'NEXORA' || currentMembership?.role === 'NEXORA_ADMIN'}
            />
          ))}
        </div>
      )}

      {/* Create / Edit Modal */}
      <CreatePlanModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleModalSubmit}
        initialPlan={selectedPlanForEdit}
      />
    </div>
  );
};
