import { Request, Response } from "express";
import { UserService } from "../services/userServices";

const userService = new UserService();
export class UserController {
  async addUser(req: Request, res: Response) {
    try {
      const {user, token} = await userService.addUser(req.body);
      return res.status(201).json({user, token});
    } catch (error) {
      console.error(error);
  
      return res.status(500).json({
    error: error instanceof Error
      ? error.message
      : "Erro interno"
  })
    }
  }

  async getAllUsers(req: Request, res: Response) {
    try {
      const users = await userService.getAllUsers();

      if (!users || users.length === 0) {
        return res.status(404).json({ error: "Nenhum usuário encontrado" });
      }
      return res.status(200).json(users);

    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Erro ao buscar usuários" });
    }
  }

  // async createGoal(req: Request, res: Response) {
  //   try {
  //     const goal = await userService.createGoal(req.body);
  //     return res.status(201).json(goal);
  //   } catch (error) {
  //     return res.status(500).json({ error: "Erro ao criar meta" });
  //   }
  // }

  // async getUserGoals(req: Request, res: Response) {
  //   try {
  //     const { userId } = req.params;
  //     const metas = await userService.getUserGoals(userId as string);
  //     return res.status(200).json(metas);
  //   } catch (error) {
  //     return res.status(500).json({ error: "Erro ao buscar metas do usuário" });
  //   }
  // }

  // async getGoalById(req: Request, res: Response) {
  //   try {
  //     const { metaId } = req.params;
  //     const meta = await userService.getGoalById(metaId as string);
  //     return res.status(200).json(meta);
  //   } catch (error) {
  //     return res.status(500).json({ error: "Erro ao buscar meta" });
  //   }
  // }

  // async deleteGoal(req: Request, res: Response) {
  //   try {
  //     const { metaId } = req.params;
  //     await userService.deleteGoal(metaId as string);
  //     return res.status(200).json({ message: "Meta excluída com sucesso" });
  //   } catch (error) {
  //     return res.status(500).json({ error: "Erro ao excluir meta" });
  //   }
  // }

  // async addReleaseToGoal(req: Request, res: Response) {
  //   try {
  //     const { metaId } = req.params;
  //     const lancamento = await userService.addReleaseToGoal(
  //       metaId as string,
  //       req.body,
  //     );
  //     return res.status(201).json(lancamento);
  //   } catch (error) {
  //     return res
  //       .status(500)
  //       .json({ error: "Erro ao adicionar lançamento à meta" });
  //   }
  // }

  // async deleteRelease(req: Request, res: Response) {
  //   try {
  //     const { lancamentoId } = req.params;
  //     await userService.deleteRelease(lancamentoId as string);
  //     return res.status(200).json({ message: "Lançamento excluído com sucesso" });
  //   } catch (error) {
  //     return res.status(500).json({ error: "Erro ao excluir lançamento" });
  //   }
  // }
}
