import { Request, Response } from "express";
import { GoalService } from "../services/goalServices";
import { JwtPayload } from "jsonwebtoken";

const goalService = new GoalService();

export class GoalController {
  async createGoal(req: Request, res: Response) {
    try {
      const goal = await goalService.createGoal(req.body);
      return res.status(201).json(goal);
    } catch (error) {
      return res.status(500).json({ error: "Erro ao criar meta" });
    }
  }

  async getUserGoals(req: Request, res: Response) {
    try {
      const { userId } = req.user as JwtPayload;
      const metas = await goalService.getUserGoals(userId);
      return res.status(200).json(metas);
    } catch (error) {
      return res.status(500).json({ error: "Erro ao buscar metas do usuário" });
    }
  }

  async getGoalById(req: Request, res: Response) {
    try {
      const { metaId } = req.params;
      const meta = await goalService.getGoalById(metaId as string);

      if (!meta) return res.status(404).json({ error: "Meta não encontrada" });
      
      return res.status(200).json(meta);
    } catch (error) {
      return res.status(500).json({ error: "Erro ao buscar meta" });
    }
  }

  async deleteGoal(req: Request, res: Response) {
    try {
      const { metaId } = req.params;
      await goalService.deleteGoal(metaId as string);
      return res.status(200).json({ message: "Meta excluída com sucesso" });
    } catch (error) {
      return res.status(500).json({ error: "Erro ao excluir meta" });
    }
  }
}
