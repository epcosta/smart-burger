import type { Request, Response } from "express";
import { prisma } from "../db.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400).json({ message: "E-mail e senha são obrigatórios" });
    return;
  }

  const user = await prisma.user.findFirst({
    where: {
      email,
    },
  });
  if (!user) {
    res.status(404).json({ message: "Usuário NÃO encontrado" });
    return;
  }
  const compare = await bcrypt.compare(password, user?.password);

  if (!compare) {
    res.status(401).json({ message: "Credenciais invalidas" });
    return;
  }

  const infoUser = {
    id: user.id,
    name: user.name,
    email: user.email,
    cep: user.cep,
    admin: user.admin,
  };
  if (!process.env.JWT_SECRET) {
    return;
  }
  var token = jwt.sign(infoUser, process.env.JWT_SECRET);
  res.cookie("user", token, {
    maxAge: 18000000,
  });
  res.status(200).json(infoUser);
};

export const register = async (req: Request, res: Response) => {
  const { name, email, password, cep } = req.body;

  try {
    if (!name || !email || !password || !cep) {
      res
        .status(400)
        .json({ message: "Nome, e-mail , senha e CEP são obrigatórios" });
      return;
    }
    const hash = await bcrypt.hash(password, 10);

    const user = await prisma.user.findFirst({
      where: {
        email,
      },
    });
    if (user?.email) {
      res.status(409).json({ message: "Email já cadastrado" });
      return;
    }
    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        password: hash,
        cep,
      },
    });

    res.status(201).json({ user: newUser });
  } catch (error) {
    res.status(500).json({ message: "Erro no Servidor" });
    return;
  }
};
export const auth = async (req: Request, res: Response) => {
  try {
    const { user } = req;
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ msg: "Erro no Servidor" });
    return;
  }
};

export const logout = async (req: Request, res: Response) => {
  const { user } = req.cookies;
  if (!user) {
    res.status(401).json({
      msg: "Usuário não autenticado",
    });
    return;
  }

  res.clearCookie("user");
  res.status(200).json({ msg: "Logout realizado com sucesso" });
};
