import { Request, Response } from "express";
import { UserService } from "../services/userServices";

const userService = new UserService();

export class UserController {
  async getAllUsers(req: Request, res: Response) {
    try {
      const users = await userService.getAllUsers();
      return res.json(users);
    } catch (error) {
      return res.status(500).json({ error: "Erro ao buscar usuários" });
    }
  }
}
