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
      where: { userId }, include: {
        lancamentos: {
          include: {
            gastos: true,
          },
        },
      },
    });
    return metas;
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
