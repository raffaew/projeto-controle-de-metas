import type { Meta, Lancamento } from "@prisma/client";



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



export interface User {
  id?: string;
  nome: string;
  email: string;
  imagem?: string;
  tipoTrabalho?: TipoTrabalho;
  criadoEm?: Date;
}

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

export type LancamentoComGastos = Lancamento & {
  gastos: {
    id: string;
    descricao: string;
    valor: number;
    categoria: string;
  }[];
};


export type MetaComLancamentos = Meta & {
  lancamentos: LancamentoComGastos[];
};


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


export interface RelatorioMensal {
  meta: Meta;
  resumo: ResumoMeta;
  topGastos: { categoria: CategoriaGasto; total: number }[];
  melhorDia: LancamentoComGastos | null;
  piorDia: LancamentoComGastos | null;
  diasAcimaMeta: number;
  diasAbaixoMeta: number;
}