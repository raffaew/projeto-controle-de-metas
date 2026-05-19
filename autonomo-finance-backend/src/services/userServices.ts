import { prisma } from "../lib/prisma";
import { Prisma } from "@prisma/client";

export class UserService {
  async addUser(data: Prisma.UserCreateInput) {
    const user = await prisma.user.upsert({
      where: {
        email: data.email,
      },
      update: {},
      create: data,
    });

    return user;
  }

  async getAllUsers() {
    const users = await prisma.user.findMany({
      include: {
        metas: {
          include: {
            lancamentos: {
              include: {
                gastos: true,
              },
            },
          },
        },
      },
    });
    return users;
  }

  async createGoal(data: Prisma.MetaCreateInput) {
    const goal = await prisma.meta.create({ data });
    return goal;
  }

  async getUserGoals(userId: string) {
    const metas = await prisma.meta.findMany({
      where: { userId },
    });
    return metas;
  }

  async getGoalById(metaId: string) {
    const meta = await prisma.meta.findUnique({ where: { id: metaId } });
    return meta;
  }

  async deleteGoal(metaId: string) {
    await prisma.meta.delete({ where: { id: metaId } });
  }

  // async addReleaseToGoal(metaId: string, data: Prisma.LancamentoCreateInput) {
  //   const lancamento = await prisma.lancamento.create({
  //     data: {
  //       ...data,
  //       meta: { connect: { id: metaId } },
  //     },
  //   });
  //   return lancamento;
  // }

  // async deleteRelease(lancamentoId: string) {
  //   await prisma.lancamento.delete({ where: { id: lancamentoId } });
  // }
}
