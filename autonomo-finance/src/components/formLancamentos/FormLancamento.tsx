'use client'

import { useState } from 'react'
import type { LancamentoForm, GastoForm, CategoriaGasto } from '@/types'
import { LABELS_CATEGORIA, formatBRL, calcularLucro } from '@/lib/utils'
import { cn } from '@/lib/cn'

const CATEGORIAS: CategoriaGasto[] = [
  'combustivel', 'alimentacao', 'manutencao', 'taxas_app', 'outros',
]

interface FormLancamentoProps {
  metaId: string
  metaDiaria: number
  onSubmit: (form: LancamentoForm) => void
  diasTrabalhados: number
  diasTotal: number
}

export function FormLancamento({
  metaId,
  metaDiaria,
  onSubmit,
  diasTrabalhados,
  diasTotal,
}: FormLancamentoProps) {
  const [bruto, setBruto]   = useState('')
  const [gastos, setGastos] = useState<GastoForm[]>([
    {  valor: 0, categoria: 'combustivel' },
  ])
  const [erro, setErro] = useState('')

  const totalGastos = gastos.reduce((s, g) => s + (Number(g.valor) || 0), 0)
  const lucro       = calcularLucro(Number(bruto) || 0, totalGastos)
  const bateuMeta   = lucro >= metaDiaria
  const temBruto    = Number(bruto) > 0

  function addGasto() {
    setGastos(prev => [...prev, {  valor: 0, categoria: 'outros' }])
  }

  function removeGasto(idx: number) {
    setGastos(prev => prev.filter((_, i) => i !== idx))
  }

  function updateGasto(idx: number, field: keyof GastoForm, value: string | number) {
    setGastos(prev => prev.map((g, i) =>
      i === idx ? { ...g, [field]: value } : g
    ))
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!bruto || Number(bruto) <= 0) {
      setErro('Informe o valor bruto do dia.')
      return
    }
    if (diasTrabalhados >= diasTotal) {
      setErro('Todos os dias do ciclo já foram registrados.')
      return
    }
    setErro('')

    const gastosValidos = gastos.filter(g => g.valor > 0)
    onSubmit({ valorBruto: Number(bruto), gastos: gastosValidos })

    setBruto('')
    setGastos([{ valor: 0, categoria: 'combustivel' }])
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Valor bruto */}
      <div>
        <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1.5">
          Valor bruto recebido hoje
        </label>
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 text-sm">R$</span>
          <input
            type="number"
            min="0"
            step="0.01"
            placeholder="0,00"
            value={bruto}
            onChange={e => { setBruto(e.target.value); setErro('') }}
            className="w-full pl-9 pr-4 py-2.5 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-500"
          />
        </div>
      </div>

      {/* Gastos */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
            Gastos do dia
          </label>
          <button
            type="button"
            onClick={addGasto}
            className="text-xs text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1"
          >
            <i className="ti ti-plus text-[13px]" aria-hidden /> Adicionar
          </button>
        </div>

        <div className="space-y-2">
          {gastos.map((g, idx) => (
            <div key={idx} className="flex gap-2 items-center">
              <select
                value={g.categoria}
                onChange={e => updateGasto(idx, 'categoria', e.target.value)}
                className="flex-1 py-2 px-3 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
              >
                {CATEGORIAS.map(c => (
                  <option key={c} value={c}>{LABELS_CATEGORIA[c]}</option>
                ))}
              </select>
              <div className="relative w-28">
                <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-zinc-400 text-xs">R$</span>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder="0,00"
                  value={g.valor || ''}
                  onChange={e => updateGasto(idx, 'valor', Number(e.target.value))}
                  className="w-full pl-8 pr-2 py-2 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
                />
              </div>
              {gastos.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeGasto(idx)}
                  className="text-zinc-400 hover:text-red-500 transition-colors p-1"
                  aria-label="Remover gasto"
                >
                  <i className="ti ti-x text-[14px]" aria-hidden />
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Preview do lucro */}
      {temBruto && (
        <div className={cn(
          'rounded-xl p-4 border',
          bateuMeta
            ? 'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-800'
            : 'bg-amber-50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-800'
        )}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">Lucro do dia</p>
              <p className={cn(
                'text-xl font-semibold',
                bateuMeta ? 'text-emerald-700 dark:text-emerald-400' : 'text-amber-700 dark:text-amber-500'
              )}>
                {formatBRL(lucro)}
              </p>
            </div>
            <div className="text-right">
              <p className="text-xs text-zinc-500 dark:text-zinc-400">Meta do dia</p>
              <p className="text-sm font-medium text-zinc-700 dark:text-zinc-300">{formatBRL(metaDiaria)}</p>
            </div>
          </div>
          <p className={cn(
            'text-xs mt-2 font-medium',
            bateuMeta ? 'text-emerald-600 dark:text-emerald-400' : 'text-amber-600 dark:text-amber-500'
          )}>
            {bateuMeta
              ? `✓ Meta diária batida! (${formatBRL(lucro - metaDiaria)} acima)`
              : `↓ ${formatBRL(metaDiaria - lucro)} abaixo da meta diária`}
          </p>
        </div>
      )}

      {erro && (
        <p className="text-xs text-red-500">{erro}</p>
      )}

      <button
        type="submit"
        className="w-full py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 active:scale-[0.98] text-white text-sm font-medium transition-all flex items-center justify-center gap-2 cursor-pointer"
      >
        <i className="ti ti-plus text-[16px]" aria-hidden />
        Registrar dia {diasTrabalhados + 1} de {diasTotal}
      </button>
    </form>
  )
}
