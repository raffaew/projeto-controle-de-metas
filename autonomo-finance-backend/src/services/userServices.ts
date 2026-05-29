import { prisma } from "../lib/prisma";
import { User } from "../types";
import jwt from "jsonwebtoken";

export class UserService {
  async addUser(data: User) {
    const user = await prisma.user.upsert({
      where: {
        email: data.email,
      },
      update: {},
      create: data,
    });

    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET!, {
      expiresIn: "3d",
    });

    return { user, token };
  }

  async deleteUser (userId: string) {
    await prisma.user.delete({ where: { id: userId}})
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

}
