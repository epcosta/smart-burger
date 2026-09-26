import type { Request, Response } from "express";
import { prisma } from "../db.js";
import fs from "fs";
import path from "path";
import { validarImagem } from "../utils/validarImagem.js";
import { excluirImagem } from "../utils/excluirImagem.js";

export const getProducts = async (req: Request, res: Response) => {
  try {
    const products = await prisma.product.findMany();

    if (products.length == 0) {
      res.status(404).json({ msg: "Produtos NÃO encontrados" });
      return;
    }

    res.status(200).json(products);
    return;
  } catch (error) {
    res.status(500).json({ msg: "Erro no Servidor", err: error });
    return;
  }
};

export const getProduct = async (req: Request, res: Response) => {
  const id = Number(req.params.id);

  try {
    const product = await prisma.product.findUnique({
      where: {
        id: id,
      },
    });
    if (!product) {
      res.status(404).json({ msg: "Produto NÃO encontrado" });
      return;
    }

    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ msg: "Erro no Servidor", err: error });
  }
};

export const deleteProduct = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { admin } = req.user;

    if (!id) {
      res.status(400).json({ msg: "ID do produto é obrigatório" });
      return;
    }

    if (Number.isNaN(id)) {
      res.status(400).json({
        msg: "ID do produto inválido",
      });
      return;
    }

    if (!admin) {
      res.status(403).json({ msg: "Acesso negado. Usuário NÃO é admin" });
      return;
    }

    const isproduct = await prisma.product.findUnique({
      where: {
        id: Number(id),
      },
    });

    if (!isproduct) {
      res.status(404).json({
        msg: "Produto não encontrado",
      });
      return;
    }

    const verificaProduto = await prisma.cartItem.findFirst({
      where: {
        productId: Number(id),
      },
    });
    if (verificaProduto) {
      res.status(405).json({
        msg: "Produto não pode ser excluído, pois existem pedidos em execução ou já executados.",
      });
      return;
    }

    const product = await prisma.product.delete({
      where: {
        id: Number(id),
      },
    });

    if (isproduct.img) {
      const caminhoImagem = path.join(process.cwd(), "uploads", isproduct.img);
      excluirImagem(caminhoImagem);
    }

    res.status(200).json({ msg: "Produto deletado com sucesso", product });
  } catch (error: any) {
    if (error.code === "P2025") {
      res.status(404).json({ msg: "Produto NÃO encontrado" });
      return;
    }
    res.status(500).json({ msg: "Erro no Servidor", err: error });
  }
};

export const createProduct = async (req: Request, res: Response) => {
  try {
    const { name, description, category, price } = req.body;

    if (!name?.trim()) {
      excluirImagem(req.file?.path);

      res.status(400).json({
        msg: "Nome do produto é obrigatório",
      });
      return;
    }

    if (!description?.trim()) {
      excluirImagem(req.file?.path);

      res.status(400).json({
        msg: "Descrição do produto é obrigatória",
      });
      return;
    }

    if (!category?.trim()) {
      excluirImagem(req.file?.path);

      res.status(400).json({
        msg: "Categoria do produto é obrigatória",
      });
      return;
    }

    const categoriasPermitidas = ["Hamburger", "Bebida", "Porção"];

    if (!categoriasPermitidas.includes(category)) {
      excluirImagem(req.file?.path);

      res.status(400).json({
        msg: "Categoria inválida",
      });
      return;
    }

    if (price === undefined || price === null || String(price).trim() === "") {
      excluirImagem(req.file?.path);

      res.status(400).json({
        msg: "Preço do produto é obrigatório",
      });
      return;
    }

    const preco = Number(price);

    if (Number.isNaN(preco) || preco <= 0) {
      excluirImagem(req.file?.path);

      res.status(400).json({
        msg: "Preço do produto inválido",
      });
      return;
    }

    if (!req.file) {
      res.status(400).json({
        msg: "Imagem do produto é obrigatória",
      });
      return;
    }

    const imagemValida = await validarImagem(req.file.path);

    if (!imagemValida) {
      excluirImagem(req.file.path);

      res.status(400).json({
        msg: "O arquivo enviado não é uma imagem válida",
      });

      return;
    }

    const produto = await prisma.product.create({
      data: {
        name: name.trim(),
        description: description.trim(),
        category,
        price: preco,
        img: req.file.filename,
      },
    });

    res.status(201).json({
      msg: "Produto cadastrado com sucesso",
      data: produto,
    });
  } catch (error) {
    excluirImagem(req.file?.path);

    res.status(500).json({
      msg: "Erro no servidor ao cadastrar produto",
    });
  }
};
