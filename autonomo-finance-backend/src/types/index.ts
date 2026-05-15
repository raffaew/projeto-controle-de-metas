import type { Meta, Lancamento } from "@prisma/client";

// ─── Enums ────────────────────────────────────────────────────────────────────

export type TipoTrabalho =
  | "motorista"
  | "entregador"
  | "vendedor"
  | "freelancer"
  | "prestador"
  | "outro";

export type CategoriaGasto =
  | "combustivel"
  | "alimentacao"
  | "manutencao"
  | "taxas_app"
  | "outros";

// ─── Tipos de entrada (o que chega no service via controller) ─────────────────

export interface MetaForm {
  userId: string;
  tipoTrabalho: TipoTrabalho;
  valorMeta: number;
  diasTrabalho: number;
  mes: number;
  ano: number;
}

export interface LancamentoForm {
  metaId: string;
  valorBruto: number;
  gastos: GastoForm[];
  data?: Date;
}

export interface GastoForm {
  descricao: string;
  valor: number;
  categoria: CategoriaGasto;
}

// ─── Tipos de resposta da API ─────────────────────────────────────────────────

export interface ApiResponse<T> {
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
}

// ─── Tipos calculados (montados no service antes de responder) ────────────────

// Lançamento com gastos incluídos — o Prisma não inclui relações por padrão
export type LancamentoComGastos = Lancamento & {
  gastos: {
    id: string;
    descricao: string;
    valor: number;
    categoria: string;
  }[];
};

// Meta com lançamentos incluídos
export type MetaComLancamentos = Meta & {
  lancamentos: LancamentoComGastos[];
};

// Resumo calculado — retornado pela rota de relatórios
export interface ResumoMeta {
  meta: Meta;
  lucroAcumulado: number;
  totalGastos: number;
  totalBruto: number;
  faltaParaMeta: number;
  diasTrabalhados: number;
  diasRestantes: number;
  percentualConcluido: number;
  mediaLucroDia: number;
  metaDiariaAtualizada: number;
  projecaoFinal: number;
  lancamentos: LancamentoComGastos[];
}

// Relatório mensal — retornado pela rota de relatórios
export interface RelatorioMensal {
  meta: Meta;
  resumo: ResumoMeta;
  topGastos: { categoria: CategoriaGasto; total: number }[];
  melhorDia: LancamentoComGastos | null;
  piorDia: LancamentoComGastos | null;
  diasAcimaMeta: number;
  diasAbaixoMeta: number;
}