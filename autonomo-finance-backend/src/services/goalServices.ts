import { prisma } from "../lib/prisma";
import type { MetaForm } from "../types"; // ← só esse import


export class GoalService {
  async createGoal(data: MetaForm) {
    const metaDiaria = data.valorMeta / data.diasTrabalho;
    const goal = await prisma.meta.create({
      data: { ...data, metaDiaria },
    });
    return goal;
  }

 async getUserGoals(userId: string) {
  const metas = await prisma.meta.findMany({
    where: { userId },
    include: {
      lancamentos: {
        include: {
          gastos: true,
        },
      },
    },
  })

  // calcula o resumo para cada meta
  return metas.map(meta => {
    const id = meta.id
    const lucroAcumulado  = meta.lancamentos.reduce((s, l) => s + Number(l.lucro), 0)
    const totalBruto      = meta.lancamentos.reduce((s, l) => s + Number(l.valorBruto), 0)
    const totalGastos     = meta.lancamentos.reduce((s, l) => s + Number(l.totalGastos), 0)
    const diasTrabalhados = meta.lancamentos.length

    const faltaParaMeta        = Math.max(0, Number(meta.valorMeta) - lucroAcumulado)
    const diasRestantes        = Math.max(0, meta.diasTrabalho - diasTrabalhados)
    const percentualConcluido  = Number(meta.valorMeta) > 0
      ? Math.min(100, (lucroAcumulado / Number(meta.valorMeta)) * 100)
      : 0
    const mediaLucroDia        = diasTrabalhados > 0 ? lucroAcumulado / diasTrabalhados : 0
    const metaDiariaAtualizada = diasRestantes > 0 ? faltaParaMeta / diasRestantes : 0
    const projecaoFinal        = mediaLucroDia * meta.diasTrabalho

    return {
      ...meta,
      resumo: {
        id,
        lucroAcumulado,
        totalBruto,
        totalGastos,
        faltaParaMeta,
        diasTrabalhados,
        diasRestantes,
        percentualConcluido,
        mediaLucroDia,
        metaDiariaAtualizada,
        projecaoFinal,
      }
    }
  })
}

  async getGoalById(metaId: string) {
    const meta = await prisma.meta.findUnique({
      where: { id: metaId },
      include: {
        lancamentos: {
          include: {
            gastos: true,
          },
        },
      },
    });
    return meta;
  }

  async deleteGoal(metaId: string) {
    await prisma.meta.delete({ where: { id: metaId } });
  }
}
