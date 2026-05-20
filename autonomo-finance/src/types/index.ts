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

export type NavPage = "dashboard" | "metas" | "lancamentos" | "relatorios";

// ─── Entidades do banco ────────────────────────────────────────────────────────

export interface User {
  id?: string;
  nome: string;
  email: string;
  imagem?: string;
  tipoTrabalho?: TipoTrabalho;
  criadoEm?: Date;
}

export interface Meta {
  id: string;
  userId: string;
  tipoTrabalho: TipoTrabalho;
  valorMeta: number;
  diasTrabalho: number;
  metaDiaria: number; // valorMeta / diasTrabalho
  mes: number; // 1–12
  ano: number;
  criadoEm: Date;
}

export interface Lancamento {
  id: string;
  metaId: string;
  userId: string;
  diaNumero: number; // 1, 2, 3... dentro do ciclo
  valorBruto: number;
  gastos: Gasto[];
  totalGastos: number; // soma calculada
  lucro: number; // bruto - totalGastos
  bateuMeta: boolean; // lucro >= meta.metaDiaria
  data: Date;
}

export interface Gasto {
  id: string;
  lancamentoId: string;
  descricao: string;
  valor: number;
  categoria: CategoriaGasto;
}

// ─── Tipos de formulário (sem id, sem campos calculados) ───────────────────────

export interface MetaForm {
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

// ─── Tipos calculados para o dashboard (não persistidos) ──────────────────────

export interface ResumoMeta {
  meta: Meta;
  lucroAcumulado: number;
  totalGastos: number;
  totalBruto: number;
  faltaParaMeta: number;
  diasTrabalhados: number;
  diasRestantes: number;
  percentualConcluido: number; // 0–100
  mediaLucroDia: number; // média real até hoje
  metaDiariaAtualizada: number; // recalculada com dias restantes
  projecaoFinal: number; // se manter a média atual
  lancamentos: Lancamento[];
}

export interface DiaHistorico {
  diaNumero: number;
  lucro: number;
  metaDiaria: number;
  bateuMeta: boolean;
  valorBruto: number;
  totalGastos: number;
}

// ─── Tipos de relatório ───────────────────────────────────────────────────────

export interface RelatorioMensal {
  meta: Meta;
  resumo: ResumoMeta;
  topGastos: { categoria: CategoriaGasto; total: number }[];
  melhorDia: Lancamento | null;
  piorDia: Lancamento | null;
  diasAcimaMeta: number;
  diasAbaixoMeta: number;
}

// ─── API response helpers ─────────────────────────────────────────────────────

export interface ApiResponse<T> {
  data?: T;
  error?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
}
