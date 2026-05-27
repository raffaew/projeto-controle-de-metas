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

export interface User {
  id?: string;
  nome: string;
  email: string;
  imagem?: string;
  tipoTrabalho?: TipoTrabalho;
  criadoEm?: Date;
}

export interface Meta {
  id?: string;
  userId?: string;
  tipoTrabalho: TipoTrabalho;
  valorMeta: number;
  lancamento?: Lancamento[];
  diasTrabalho: number;
  metaDiaria: number; // valorMeta / diasTrabalho
  mes: number; // 1–12
  ano: number;
  criadoEm: Date;
}

export interface Lancamento {
  id?: string;

  diaNumero?: number;
  valorBruto: number;
  gastos: Gasto[];
  totalGastos?: number;
  lucro?: number;
  bateuMeta?: boolean;
  data?: Date;
}

export interface Gasto {
  id?: string;
  valor: number;
  categoria: CategoriaGasto;
}

export interface MetaForm {
  valorMeta: number;
  diasTrabalho: number;
  mes: number;
  ano: number;
}

export interface LancamentoForm {
  valorBruto: number;
  gastos: GastoForm[];
  data?: Date;
}

export interface GastoForm {
  valor: number;
  categoria: CategoriaGasto;
}

export interface ResumoMeta {
  id?: string;
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
}

export interface DiaHistorico {
  diaNumero: number;
  lucro: number;
  metaDiaria: number;
  bateuMeta: boolean;
  valorBruto: number;
  totalGastos: number;
}

export interface RelatorioMensal {
  meta: Meta;
  resumo: ResumoMeta;
  topGastos: { categoria: CategoriaGasto; total: number }[];
  melhorDia: Lancamento | null;
  piorDia: Lancamento | null;
  diasAcimaMeta: number;
  diasAbaixoMeta: number;
}

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

export interface MetaCard {
  id: string;
  tipoTrabalho: TipoTrabalho;
  mes: number;
  ano: number;
  valorMeta: number;
  metaDiaria: number;
  lucroAcumulado: number;
  diasTrabalhados: number;
  diasRestantes: number;
  percentualConcluido: number;
  faltaParaMeta: number;
  metaDiariaAtualizada: number;
  lancamentos?: Lancamento[];
  resumo: ResumoMeta;
}
