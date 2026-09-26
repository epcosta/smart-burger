import type { Request, Response, NextFunction } from "express";

import jwt from "jsonwebtoken";

export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { user } = req.cookies;

  if (!process.env.JWT_SECRET) {
    res.status(500).json({ msg: "Erro no servidor" });
    return;
  }

  try {
    const decoded = jwt.verify(user, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ msg: "Usuário NÃO autenticado" });
    return;
  }
};
