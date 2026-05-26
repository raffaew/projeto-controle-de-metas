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

}
