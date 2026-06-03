import { GastoForm, LancamentoForm } from "@/types";
import { prisma } from "../lib/prisma";
import { Lancamento } from "@prisma/client";

export class ReleasesService {
  private async getGoalWithSummary(metaId: string) {
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

    if (!goal) {
      throw new Error("Meta não encontrada");
    }

    const hoje = new Date();
    const dataInicio = new Date(goal.criadoEm);

    const lucroAcumulado = goal.lancamentos.reduce(
      (s: number, l: Lancamento) => s + Number(l.lucro),
      0,
    );

    const totalGastos = goal.lancamentos.reduce(
      (s: number, l: Lancamento) => s + Number(l.totalGastos),
      0,
    );

    const faltaParaMeta = Math.max(0, Number(goal.valorMeta) - lucroAcumulado);

    const diasTrabalhados = new Set(
      goal.lancamentos.map((l: Lancamento) => {
        const data = new Date(l.data);
        data.setHours(0, 0, 0, 0);

        return data.getTime();
      }),
    ).size;

    const diasRestantes = Math.max(0, goal.diasTrabalho - diasTrabalhados);

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

    return {
      ...goal,
      resumo: {
        id: goal.id,
        lucroAcumulado,
        faltaParaMeta,
        totalBruto,
        totalGastos,
        diasTrabalhados,
        totalDiasMeta: goal.diasTrabalho,
        diasRestantes,
        percentualConcluido,
        metaDiariaAtualizada,
        mediaLucroDia,
        projecaoFinal,
      },
    };
  }

  async addReleaseToGoal(metaId: string, data: LancamentoForm) {
    const totalGastos = data.gastos.reduce((s: number, g: GastoForm) => s + g.valor, 0);
    const lucro = data.valorBruto - totalGastos;

    const meta = await prisma.meta.findUnique({ where: { id: metaId } });
    if (!meta) throw new Error("Meta não encontrada");

    const bateuMeta = lucro >= meta.metaDiaria.toNumber();

    const release = await prisma.lancamento.create({
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

    const goal = await this.getGoalWithSummary(metaId);

    return {
      release,
      goal,
    }
  }

  async deleteRelease(lancamentoId: string) {
    const release = await prisma.lancamento.delete({
      where: { id: lancamentoId },
    });

    return this.getGoalWithSummary(release.metaId);
  }
}
