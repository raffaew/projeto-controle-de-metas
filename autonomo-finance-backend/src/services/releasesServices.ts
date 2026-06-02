import { LancamentoForm } from "@/types";
import { prisma } from "../lib/prisma";
import { Lancamento } from "@prisma/client";

export class ReleasesService {
  async addReleaseToGoal(metaId: string, data: LancamentoForm) {
    const totalGastos = data.gastos.reduce((s, g) => s + g.valor, 0);
    const lucro = data.valorBruto - totalGastos;

    const meta = await prisma.meta.findUnique({ where: { id: metaId } });
    if (!meta) throw new Error("Meta não encontrada");

    const bateuMeta = lucro >= meta.metaDiaria.toNumber();

    const lancamento = await prisma.lancamento.create({
      data: {
        metaId,
        valorBruto: data.valorBruto,
        totalGastos,
        lucro,
        bateuMeta,
        gastos: {
          create: data.gastos,
        },
      },
      include: { gastos: true },
    });
    return lancamento;
  }

  async deleteRelease(lancamentoId: string) {
    const release = await prisma.lancamento.delete({
      where: { id: lancamentoId },
    });

    const goal = await prisma.meta.findUnique({
      where: { id: release.metaId },
      include: { lancamentos: {
        include: { gastos: true },
      } },
    });

   if (!goal) {
  throw new Error("Meta não encontrada");
}

const hoje = new Date();
const dataInicio = new Date(goal.criadoEm);

const id = goal.id;

const metaId = release.metaId;

const lucroAcumulado = goal.lancamentos.reduce(
  (s: number, l: Lancamento) => s + Number(l.lucro),
  0,
);

const totalGastos = goal.lancamentos.reduce(
  (s: number, l: Lancamento) => s + Number(l.totalGastos),
  0,
);

const faltaParaMeta = Math.max(
  0,
  Number(goal.valorMeta) - lucroAcumulado,
);

let diasTrabalhados = Math.max(
  0,
  Math.floor(
    (hoje.getTime() - dataInicio.getTime()) / (1000 * 60 * 60 * 24),
  ),
);

const diasRestantes = Math.max(
  0,
  goal.diasTrabalho - diasTrabalhados,
);

const percentualConcluido =
  Number(goal.valorMeta) > 0
    ? Math.min(100, (lucroAcumulado / Number(goal.valorMeta)) * 100)
    : 0;

const mediaLucroDia =
  diasTrabalhados > 0 ? lucroAcumulado / diasTrabalhados : 0;

const metaDiariaAtualizada =
  diasRestantes > 0 ? faltaParaMeta / diasRestantes : 0;

const projecaoFinal = mediaLucroDia * goal.diasTrabalho;

const totalBruto = goal.lancamentos.reduce(
  (s: number, l: Lancamento) => s + Number(l.valorBruto),
  0,
);

hoje.setHours(0, 0, 0, 0);
dataInicio.setHours(0, 0, 0, 0);

const teveLancamentoHoje = goal.lancamentos.some((l: Lancamento) => {
  const dataLancamento = new Date(l.data);
  dataLancamento.setHours(0, 0, 0, 0);

  return dataLancamento.getTime() === hoje.getTime();
});

if (teveLancamentoHoje) {
  diasTrabalhados += 1;
}

const totalDiasMeta = goal.diasTrabalho;

return {
  ...goal,
  resumo: {
    id,
    lucroAcumulado,
    faltaParaMeta,
    totalBruto,
    totalGastos,
    diasTrabalhados,
    totalDiasMeta,
    diasRestantes,
    percentualConcluido,
    metaDiariaAtualizada,
    mediaLucroDia,
    projecaoFinal,
  },
};

  }
}
