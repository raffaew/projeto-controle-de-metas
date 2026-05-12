'use client'

import { useState } from 'react'
import type { MetaForm, TipoTrabalho, Meta } from '@/types'
import { LABELS_TIPO, calcularMetaDiaria, formatBRL, MESES } from '@/lib/utils'
import { cn } from '@/lib/cn'

const TIPOS: TipoTrabalho[] = [
  'motorista', 'entregador', 'vendedor', 'freelancer', 'prestador', 'outro',
]

const ICONES_TIPO: Record<TipoTrabalho, string> = {
  motorista:  'car',
  entregador: 'bike',
  vendedor:   'shopping-bag',
  freelancer: 'laptop',
  prestador:  'tool',
  outro:      'briefcase',
}

interface FormMetaProps {
  onSubmit: (meta: Meta) => void
}

export function FormMeta({ onSubmit }: FormMetaProps) {
  const hoje = new Date()
  const [tipo, setTipo]   = useState<TipoTrabalho | ''>('')
  const [form, setForm]   = useState<MetaForm>({
    valorMeta:   0,
    diasTrabalho: 22,
    mes:          hoje.getMonth() + 1,
    ano:          hoje.getFullYear(),
  })
  const [erro, setErro] = useState('')

  const metaDiaria = form.valorMeta > 0 && form.diasTrabalho > 0
    ? calcularMetaDiaria(form.valorMeta, form.diasTrabalho)
    : 0

  function set(field: keyof MetaForm, value: number) {
    setForm(prev => ({ ...prev, [field]: value }))
    setErro('')
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!tipo)              { setErro('Selecione o tipo de trabalho.'); return }
    if (form.valorMeta <= 0) { setErro('Informe a meta de lucro.');     return }
    if (form.diasTrabalho <= 0 || form.diasTrabalho > 31) {
      setErro('Dias de trabalho deve ser entre 1 e 31.'); return
    }

    const nova: Meta = {
      id:           crypto.randomUUID(),
      userId:       'local',
      valorMeta:    form.valorMeta,
      diasTrabalho: form.diasTrabalho,
      metaDiaria,
      mes:          form.mes,
      ano:          form.ano,
      criadoEm:     new Date(),
    }

    onSubmit(nova)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Tipo de trabalho */}
      <div>
        <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-3">
          Tipo de trabalho
        </label>
        <div className="grid grid-cols-3 gap-2">
          {TIPOS.map(t => (
            <button
              key={t}
              type="button"
              onClick={() => { setTipo(t); setErro('') }}
              className={cn(
                'flex flex-col items-center gap-1.5 p-3 rounded-xl border text-xs font-medium transition-all',
                tipo === t
                  ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400'
                  : 'border-zinc-200 dark:border-zinc-700 text-zinc-500 dark:text-zinc-400 hover:border-zinc-300 dark:hover:border-zinc-600 hover:bg-zinc-50 dark:hover:bg-zinc-800'
              )}
            >
              <i className={`ti ti-${ICONES_TIPO[t]} text-[20px]`} aria-hidden />
              {LABELS_TIPO[t].split(' ')[0]}
            </button>
          ))}
        </div>
      </div>

      {/* Período */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs text-zinc-500 dark:text-zinc-400 mb-1.5">Mês</label>
          <select
            value={form.mes}
            onChange={e => set('mes', Number(e.target.value))}
            className="w-full py-2.5 px-3 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-sm text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
          >
            {MESES.map((m, i) => (
              <option key={i} value={i + 1}>{m}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-xs text-zinc-500 dark:text-zinc-400 mb-1.5">Ano</label>
          <input
            type="number"
            value={form.ano}
            onChange={e => set('ano', Number(e.target.value))}
            min={2024}
            max={2030}
            className="w-full py-2.5 px-3 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-sm text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
          />
        </div>
      </div>

      {/* Meta e dias */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs text-zinc-500 dark:text-zinc-400 mb-1.5">Meta de lucro (R$)</label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 text-sm">R$</span>
            <input
              type="number"
              min="0"
              step="50"
              placeholder="2000"
              value={form.valorMeta || ''}
              onChange={e => set('valorMeta', Number(e.target.value))}
              className="w-full pl-9 pr-3 py-2.5 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-sm text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
            />
          </div>
        </div>
        <div>
          <label className="block text-xs text-zinc-500 dark:text-zinc-400 mb-1.5">Dias de trabalho</label>
          <input
            type="number"
            min="1"
            max="31"
            value={form.diasTrabalho}
            onChange={e => set('diasTrabalho', Number(e.target.value))}
            className="w-full py-2.5 px-3 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-sm text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
          />
        </div>
      </div>

      {/* Preview da meta diária */}
      {metaDiaria > 0 && (
        <div className="rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-100 dark:border-emerald-900 p-4">
          <p className="text-xs text-emerald-600 dark:text-emerald-400 mb-0.5">Meta diária necessária</p>
          <p className="text-2xl font-semibold text-emerald-700 dark:text-emerald-300">
            {formatBRL(metaDiaria)}
            <span className="text-sm font-normal text-emerald-500 ml-1">/ dia</span>
          </p>
          <p className="text-xs text-emerald-600/70 dark:text-emerald-500 mt-1">
            {formatBRL(form.valorMeta)} de lucro em {form.diasTrabalho} dias de trabalho
          </p>
        </div>
      )}

      {erro && <p className="text-xs text-red-500">{erro}</p>}

      <button
        type="submit"
        className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:scale-[0.98] text-white text-sm font-semibold transition-all flex items-center justify-center gap-2"
      >
        <i className="ti ti-check text-[16px]" aria-hidden />
        Criar meta
      </button>
    </form>
  )
}
