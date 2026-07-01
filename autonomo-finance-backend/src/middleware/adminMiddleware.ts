import { Request, Response, NextFunction } from "express";

import { prisma } from "../lib/prisma";

export async function adminMiddleware(req: Request, res: Response, next: NextFunction)  {
    try {
        const uderId = req.userId;
        const user = await prisma.user.findUnique({where: {id: uderId as string}});

        if (!user || user.role !== "admin") {
            return res.status(401).json({message: "Acesso não autorizado"});
        }
        next();
    } catch (error) {
        return res.status(500).json({message: "Erro ao verificar permissão"});
    }
}
