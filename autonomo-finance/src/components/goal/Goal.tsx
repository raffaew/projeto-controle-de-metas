import { Badge } from "@/components/ui/Badge";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { formatBRL, MONTHS, LABELS_TYPE } from "@/lib/utils";
import type { MetaCard } from "@/types";

interface GoalViewProps {
  metas: MetaCard[];
  loading: boolean;
  onViewGoal: (meta: MetaCard) => void;
  onDeleteGoal: (id: string) => void;
  onNewGoal: () => void;
}

function getStatus(pct: number): {
  label: string;
  variant: "success" | "info" | "warning" | "danger";
} {
  if (pct >= 100) return { label: "Concluída", variant: "success" };
  if (pct >= 60) return { label: "Em andamento", variant: "info" };
  if (pct >= 30) return { label: "Atenção", variant: "warning" };
  return { label: "Em risco", variant: "danger" };
}

function GoalCardItem({
  meta,
  onVer,
  onDeletar,
}: {
  meta: MetaCard;
  onVer: () => void;
  onDeletar: () => void;
}) {
  const status = getStatus(meta.resumo.percentualConcluido);

  return (
    <div
      className="
      bg-white dark:bg-zinc-900
      border border-zinc-200 dark:border-zinc-800
      rounded-2xl
      p-5
      flex flex-col gap-4
      hover:border-zinc-300 dark:hover:border-zinc-700
      transition-colors
    "
    >
      {/* Cabeçalho */}
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs text-zinc-500 uppercase tracking-widest mb-1">
            {LABELS_TYPE[meta.tipoTrabalho]} · {MONTHS[meta.mes - 1]} {meta.ano}
          </p>

          <p className="text-base font-medium text-zinc-900 dark:text-zinc-100">
            {formatBRL(meta.valorMeta)}

            <span className="text-sm font-normal text-zinc-500 ml-1">meta</span>
          </p>
        </div>

        <Badge variant={status.variant}>{status.label}</Badge>
      </div>

      <ProgressBar
        value={meta.resumo.percentualConcluido}
        label="Progresso"
        showPercent
      />

      <div className="grid grid-cols-2 gap-2">
        <div className="bg-zinc-50 dark:bg-zinc-800/60 rounded-xl p-3">
          <p className="text-xs text-zinc-500 mb-0.5">Lucro acumulado</p>

          <p className="text-sm font-medium text-emerald-500 dark:text-emerald-400">
            {formatBRL(meta.resumo.lucroAcumulado)}
          </p>
        </div>

        <div className="bg-zinc-50 dark:bg-zinc-800/60 rounded-xl p-3">
          <p className="text-xs text-zinc-500 mb-0.5">Falta para meta</p>

          <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
            {formatBRL(meta.resumo.faltaParaMeta)}
          </p>
        </div>

        <div className="bg-zinc-50 dark:bg-zinc-800/60 rounded-xl p-3">
          <p className="text-xs text-zinc-500 mb-0.5">Dias trabalhados</p>

          <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
            {meta.resumo.diasTrabalhados} {" "}
            <span className="text-zinc-500 font-normal">
              de {meta.resumo.totalDiasMeta}
            </span>
          </p>
        </div>

        <div className="bg-zinc-50 dark:bg-zinc-800/60 rounded-xl p-3">
          <p className="text-xs text-zinc-500 mb-0.5">Meta diária</p>

          <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
            {formatBRL(meta.resumo.metaDiariaAtualizada)}
          </p>
        </div>
      </div>

      <div className="flex gap-2 pt-1 border-t border-zinc-200 dark:border-zinc-800">
        <button
          onClick={onVer}
          className="
            cursor-pointer
            flex-1
            flex items-center justify-center gap-2
            py-2
            rounded-xl
            border border-zinc-200 dark:border-zinc-700
            text-sm font-medium
            text-zinc-700 dark:text-zinc-200
            hover:bg-zinc-100 dark:hover:bg-zinc-800
            transition-colors
          "
        >
          <i className="ti ti-layout-dashboard text-[16px]" aria-hidden />
          Ver dashboard
        </button>

        <button
          onClick={onDeletar}
          className="
            cursor-pointer
            w-9 h-9
            flex items-center justify-center
            rounded-xl
            border border-zinc-200 dark:border-zinc-700
            text-zinc-500
            hover:text-red-400
            hover:border-red-300 dark:hover:border-red-900
            hover:bg-red-50 dark:hover:bg-red-950/30
            transition-colors
          "
          aria-label="Excluir meta"
        >
          <i className="ti ti-trash text-[15px]" aria-hidden />
        </button>
      </div>
    </div>
  );
}

export function Goal({
  metas,
  loading = false,
  onViewGoal,
  onDeleteGoal,
  onNewGoal,
}: GoalViewProps) {
  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-5 h-5 rounded-full border-2 border-emerald-500 border-t-transparent animate-spin" />
      </div>
    );
  }

  return (
    <>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs text-zinc-500 uppercase tracking-widest mb-1">
            Minhas metas
          </p>
          <h1 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-100">
            Selecione uma meta
          </h1>
        </div>
        <button
          onClick={onNewGoal}
          className="cursor-pointer flex items-center gap-1.5 text-xs text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors border border-zinc-200 dark:border-zinc-700 rounded-lg px-3 py-2"
        >
          <i className="ti ti-refresh text-[14px]" aria-hidden />
          Nova meta
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {metas.map((meta) => (
          <GoalCardItem
            key={meta.id}
            meta={meta}
            onVer={() => onViewGoal(meta)}
            onDeletar={() => onDeleteGoal(meta.id)}
          />
        ))}
      </div>
    </>
  );
}
