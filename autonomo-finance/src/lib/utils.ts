import type { CategoriaGasto, TipoTrabalho } from '@/types'



export function formatBRL(value: number | string): string {
  const num = Number(value)
  if (isNaN(num)) return 'R$ 0,00'
  return num.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 2,
  })
}

export function formatPercent(value: number): string {
  return `${Math.round(value)}%`
}


export function calculateDailyGoal(valorMeta: number, diasTrabalho: number): number {
  if (diasTrabalho === 0) return 0
  return valorMeta / diasTrabalho
}

export function calculateProfit(bruto: number, totalGastos: number): number {
  return bruto - totalGastos
}



export const LABELS_TYPE: Record<TipoTrabalho, string> = {
  motorista:  'Motorista',
  entregador: 'Entregador',
  vendedor:   'Vendedor',
  freelancer: 'Freelancer',
  prestador:  'Prestador de serviço',
  outro:      'Outro',
}

export const LABELS_CATEGORIES: Record<CategoriaGasto, string> = {
  combustivel: 'Combustível',
  alimentacao: 'Alimentação',
  manutencao:  'Manutenção',
  taxas_app:   'Taxas de app',
  outros:      'Outros',
}

export const ICONS_CATEGORIES: Record<CategoriaGasto, string> = {
  combustivel: 'gas-station',
  alimentacao: 'bowl-spoon',
  manutencao:  'tool',
  taxas_app:   'device-mobile',
  outros:      'dots-horizontal',
}

export const MONTHS = [
  'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
  'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro',
]


export function dayStatus(lucro: number, metaDiaria: number) {
  if (lucro >= metaDiaria * 1.2) return { label: 'Acima ↑', color: 'success' }
  if (lucro >= metaDiaria)        return { label: 'Meta ✓',  color: 'success' }
  if (lucro >= metaDiaria * 0.8)  return { label: 'Quase',   color: 'warning' }
  return                                 { label: 'Abaixo',  color: 'danger'  }
}

export function statusGoal(pct: number) {
  if (pct >= 100) return { label: 'Concluída!', color: 'success' }
  if (pct >= 60)  return { label: 'No caminho', color: 'info'    }
  if (pct >= 30)  return { label: 'Atenção',    color: 'warning' }
  return                 { label: 'Em risco',   color: 'danger'  }
}
