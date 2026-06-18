import { prisma } from "../lib/prisma";
import type { MetaForm } from "../types"; // ← só esse import
import { Lancamento } from "@prisma/client";

export class GoalService {
  async createGoal(data: MetaForm) {
    const metaDiaria = data.valorMeta / data.diasTrabalho;
    const goal = await prisma.meta.create({
      data: { ...data, metaDiaria },
    });
    if(!goal) throw new Error("Erro ao criar meta");
    return goal;
  }

  async getUserGoals(userId: string) {
    const goals = await prisma.meta.findMany({
      where: { userId },
      include: {
        lancamentos: {
          include: {
            gastos: true,
          },
        },
      },
    });

    return goals.map((meta) => {
      const id = meta.id;

      const lucroAcumulado = meta.lancamentos.reduce(
        (s: number, l: Lancamento) => s + Number(l.lucro),
        0,
      );

      const totalBruto = meta.lancamentos.reduce(
        (s: number, l: Lancamento) => s + Number(l.valorBruto),
        0,
      );

      const totalGastos = meta.lancamentos.reduce(
        (s: number, l: Lancamento) => s + Number(l.totalGastos),
        0,
      );

      const diasTrabalhados = new Set(
        meta.lancamentos.map((l: Lancamento) => {
          const data = new Date(l.data);
          data.setHours(0, 0, 0, 0);

          return data.getTime();
        }),
      ).size;

      const diasRestantes = Math.max(0, meta.diasTrabalho - diasTrabalhados);

      const faltaParaMeta = Math.max(
        0,
        Number(meta.valorMeta) - lucroAcumulado,
      );

      const percentualConcluido =
        Number(meta.valorMeta) > 0
          ? Math.min(100, (lucroAcumulado / Number(meta.valorMeta)) * 100)
          : 0;

      const mediaLucroDia =
        diasTrabalhados > 0 ? lucroAcumulado / diasTrabalhados : 0;

      const metaDiariaAtualizada =
        diasRestantes > 0 ? faltaParaMeta / diasRestantes : 0;

      const projecaoFinal = mediaLucroDia * meta.diasTrabalho;

      const totalDiasMeta = meta.diasTrabalho;

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
          totalDiasMeta,
        },
      };
    });
  }

  async getGoalById(metaId: string) {
    const goal = await prisma.meta.findUnique({
      where: { id: metaId },
      include: {
        lancamentos: {
          include: {
            gastos: true,
          },
        },
      },
    });
    if(!goal) throw new Error("Meta não encontrada");
    return goal;
  }

  async deleteGoal(metaId: string) {
    await prisma.meta.delete({ where: { id: metaId } });
    if(!metaId) throw new Error("Meta não encontrada");
  }
}
