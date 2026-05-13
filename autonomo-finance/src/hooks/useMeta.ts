'use client'

import { useState, useCallback, useMemo } from 'react'
import type { Meta, Lancamento, LancamentoForm, ResumoMeta } from '@/types'
import { calcularResumo, calcularLucro } from '@/lib/utils'

// Mock local enquanto o backend não está pronto
// Substitua por fetch('/api/metas') depois

export function useMeta() {
  const [meta, setMeta]             = useState<Meta | null>(null)
  const [lancamentos, setlancamentos] = useState<Lancamento[]>([])
  const [loading, setLoading]       = useState(false)
  const [error, setError]           = useState<string | null>(null)

  const resumo: ResumoMeta | null = useMemo(() => {
    if (!meta) return null
    return calcularResumo(meta, lancamentos)
  }, [meta, lancamentos])

  const definirMeta = useCallback((novaMeta: Meta) => {
    setMeta(novaMeta)
    setlancamentos([])
    setError(null)
  }, [])

  const adicionarLancamento = useCallback((form: LancamentoForm) => {
    if (!meta) return

    const totalGastos = form.gastos.reduce((s, g) => s + g.valor, 0)
    const lucro       = calcularLucro(form.valorBruto, totalGastos)

    const novo: Lancamento = {
      id:          crypto.randomUUID(),
      metaId:      meta.id,
      userId:      'local',
      diaNumero:   lancamentos.length + 1,
      valorBruto:  form.valorBruto,
      gastos:      form.gastos.map(g => ({ ...g, id: crypto.randomUUID(), lancamentoId: '' })),
      totalGastos,
      lucro,
      bateuMeta:   lucro >= meta.metaDiaria,
      data:        form.data ?? new Date(),
    }

    setlancamentos(prev => [...prev, novo])
  }, [meta, lancamentos.length])

  const removerLancamento = useCallback((id: string) => {
    setlancamentos(prev =>
      prev
        .filter(l => l.id !== id)
        .map((l, i) => ({ ...l, diaNumero: i + 1 }))
    )
  }, [])

  const resetar = useCallback(() => {
    setMeta(null)
    setlancamentos([])
    setError(null)
  }, [])

  return {
    meta,
    lancamentos,
    resumo,
    loading,
    error,
    definirMeta,
    adicionarLancamento,
    removerLancamento,
    resetar,
  }
}
