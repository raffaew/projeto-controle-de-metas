import { LancamentoForm } from "@/types";
import { prisma } from "../lib/prisma";

export class ReleasesService {
  async addReleaseToGoal(metaId: string, data: LancamentoForm) {
    const totalGastos = data.gastos.reduce((s, g) => s + g.valor, 0);
    const lucro = data.valorBruto - totalGastos;

    const meta = await prisma.meta.findUnique({ where: { id: metaId } });
    if (!meta) throw new Error("Meta não encontrada");

    const bateuMeta = lucro >= meta.metaDiaria;

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
    await prisma.lancamento.delete({ where: { id: lancamentoId } });
  }
}
