
import { MetricCard } from '@/components/ui/MetricCard'
import { ProgressBar } from '@/components/ui/ProgressBar'
import type { ResumoMeta } from '@/types'
import { formatBRL, statusMeta } from '@/lib/utils'

interface ResumoCardsProps {
  resumo: ResumoMeta
}

export function ResumoCards({ resumo }: ResumoCardsProps) {
  const {
    lucroAcumulado,
    faltaParaMeta,
    diasTrabalhados,
    diasRestantes,
    percentualConcluido,
    metaDiariaAtualizada,
    projecaoFinal,
    totalBruto,
  } = resumo

  const status = statusMeta(percentualConcluido)

  return (
    <div className="space-y-4">
      {/* Grid de métricas */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-4">
        <MetricCard
          label="Lucro acumulado"
          value={formatBRL(lucroAcumulado)}
          sub={`de ${formatBRL(totalBruto)}`}
          variant="success"
          icon="trending-up"
        />
        <MetricCard
          label="Falta para a meta"
          value={formatBRL(faltaParaMeta)}
          variant={faltaParaMeta === 0 ? 'success' : 'info'}
          icon="target"
        />
        <MetricCard
          label="Dias trabalhados"
          value={String(diasTrabalhados)}
          sub={`de ${diasRestantes} dias`}
          icon="calendar-check"
        />
        <MetricCard
          label="Dias restantes"
          value={String(diasRestantes)}
          variant={diasRestantes <= 3 ? 'warning' : 'default'}
          icon="calendar-time"
        />
      </div>

      {/* Barra de progresso */}
      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-4">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
            Progresso da meta
          </span>
          <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
            status.color === 'success' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400' :
            status.color === 'warning' ? 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-400' :
            status.color === 'danger'  ? 'bg-red-100 text-red-600 dark:bg-red-950 dark:text-red-400' :
            'bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-400'
          }`}>
            {status.label}
          </span>
        </div>

        <ProgressBar value={percentualConcluido} />

        {/* Alertas de ritmo */}
        <div className="mt-4 grid grid-cols-2 gap-3">
          {diasRestantes > 0 && (
            <div className="rounded-lg bg-zinc-50 dark:bg-zinc-800/50 p-3">
              <p className="text-xs text-zinc-500 dark:text-zinc-400 mb-0.5">Meta diária atualizada</p>
              <p className="text-base font-semibold text-zinc-900 dark:text-zinc-100">
                {formatBRL(metaDiariaAtualizada)}
                <span className="text-xs font-normal text-zinc-400 ml-1">/dia</span>
              </p>
            </div>
          )}
          <div className="rounded-lg bg-zinc-50 dark:bg-zinc-800/50 p-3">
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mb-0.5">Projeção no ritmo atual</p>
            <p className={`text-base font-semibold ${
              projecaoFinal >= totalBruto
                ? 'text-emerald-600 dark:text-emerald-400'
                : 'text-amber-600 dark:text-amber-400'
            }`}>
              {formatBRL(projecaoFinal)}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
