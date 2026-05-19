import { Request, Response } from "express";
import { ReleasesService } from "../services/releasesServices";

const releasesService = new ReleasesService();

export class ReleasesController {
    async addReleaseToGoal(req: Request, res: Response) {
        try {
          const { metaId } = req.params;
          const lancamento = await releasesService.addReleaseToGoal(
            metaId as string,
            req.body,
          );
          return res.status(201).json(lancamento);
        } catch (error) {
          return res
            .status(500)
            .json({ error: "Erro ao adicionar lançamento à meta" });
        }
      }
    
      async deleteRelease(req: Request, res: Response) {
        try {
          const { lancamentoId } = req.params;
          await releasesService.deleteRelease(lancamentoId as string);
          return res.status(200).json({ message: "Lançamento excluído com sucesso" });
        } catch (error) {
          return res.status(500).json({ error: "Erro ao excluir lançamento" });
        }
      }
}