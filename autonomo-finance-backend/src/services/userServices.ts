import { prisma } from "../lib/prisma";

export class UserService {
  async getAllUsers() {
    const users = await prisma.user.findMany()
    return users
}
}
