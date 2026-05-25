import type { Lancamento } from '@/types'
import { formatBRL, LABELS_CATEGORIA } from '@/lib/utils'
import { Badge } from '@/components/ui/Badge'

interface ListalancamentosProps {
  lancamentos: Lancamento[]
  metaDiaria: number
  onRemover?: (id: string) => void
}

export function Listalancamentos({ lancamentos, metaDiaria, onRemover }: ListalancamentosProps) {
  if (lancamentos.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-zinc-400">
        <i className="ti ti-calendar-off text-[32px] mb-3" aria-hidden />
        <p className="text-sm">Nenhum dia registrado ainda</p>
        <p className="text-xs mt-1">Use o formulário ao lado para registrar seu primeiro dia</p>
      </div>
    )
  }

  return (
    <div className="space-y-2">
      {[...lancamentos].reverse().map(l => {
        const superou = (l.lucro ?? 0) > metaDiaria;

        return (
          <div
            key={l.id}
            className="flex items-center gap-3 p-3 rounded-xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 group"
          >
            {/* Dia */}
            <div className="w-9 h-9 rounded-lg bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 flex items-center justify-center shrink-0">
              <span className="text-xs font-semibold text-zinc-600 dark:text-zinc-400">{}</span>
            </div>

            {/* Detalhes */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-0.5">
                <span className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                  {formatBRL(l.lucro ?? 0)}
                </span>
                <Badge variant={l.bateuMeta ? 'success' : superou ? 'success' : 'warning'}>
                  {l.bateuMeta ? (superou ? '↑ Acima' : '✓ Meta') : '↓ Abaixo'}
                </Badge>
              </div>
              <div className="flex items-center gap-3 text-xs text-zinc-400">
                <span>Bruto: {formatBRL(l.valorBruto)}</span>
                {l.totalGastos && l.totalGastos > 0 && (
                  <span className="text-red-400">−{formatBRL(l.totalGastos)}</span>
                )}
              </div>
              {/* Gastos por categoria */}
              {l.gastos.length > 0 && (
                <div className="flex gap-1.5 mt-1.5 flex-wrap">
                  {l.gastos.map(g => (
                    <span
                      key={g.id}
                      className="text-[10px] px-1.5 py-0.5 rounded bg-zinc-200 dark:bg-zinc-700 text-zinc-500 dark:text-zinc-400"
                    >
                      {LABELS_CATEGORIA[g.categoria]}: {formatBRL(g.valor)}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Data */}
            <div className="text-right text-xs text-zinc-400 shrink-0 hidden sm:block">
              {l.data ? new Date(l.data).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' }) : 'Data não disponível'}
            </div>

            {/* Remover */}
            {onRemover && (
              <button
                onClick={() => onRemover(l.id!)}
                className="opacity-0 group-hover:opacity-100 text-zinc-300 hover:text-red-500 transition-all p-1 shrink-0 cursor-pointer"
                aria-label={`Remover dia ${l.diaNumero}`}
              >
                <i className="ti ti-trash text-[14px]" aria-hidden />
              </button>
            )}
          </div>
        )
      })}
    </div>
  )
}
