import { Request, Response, NextFunction } from "express";

import { prisma } from "../lib/prisma"

export async function goalOwnerMiddleware (req: Request, res: Response, next:NextFunction) {
  try {
    const {metaId} = req.params;
    const  userId  = req.userId;

    if(!metaId) return next();

    const goal =  await prisma.meta.findUnique({where: {id: metaId as string}})

    if(!goal) {
        return res.status(401).json({message: "Meta não encontrada"})
    }

    if(goal?.userId != userId) {
        return res.status(404).json({message: "Você não tem permissão acesssar ou alterar os dados dessa conta!"})
    }

    next();


  } catch (error) {
    return res.status(500).json({message: "Erro ao verificar permissão"});
    
  }
}