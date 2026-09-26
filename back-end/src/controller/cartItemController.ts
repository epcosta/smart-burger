import type { Request, Response } from "express";
import { prisma } from "../db.js";
export const getCartItems = async (req: Request, res: Response) => {
  try {
    const { user } = req;

    const cartItems = await prisma.cartItem.findMany({
      where: {
        userId: Number(user.id),
      },
      include: { product: true },
    });

    if (cartItems.length == 0) {
      res.status(404).json({ msg: "Não existem Produtos no Carrinho" });
      return;
    }
    console.log(cartItems);

    res.status(200).json(cartItems);
    return;
  } catch (error) {
    res.status(500).json({ msg: "Erro no Servidor", err: error });
    return;
  }
};

export const createCartItem = async (req: Request, res: Response) => {
  try {
    const { user } = req;
    const { productId } = req.body;

    if (!productId) {
      res.json(400).json({ msg: "Produto é obrigatório" });
      return;
    }
    const product = await prisma.product.findUnique({
      where: {
        id: Number(productId),
      },
    });
    if (!product) {
      res.status(404).json({ msg: "Produto NÃO encontrado" });
      return;
    }
    const getCartItem = await prisma.cartItem.findFirst({
      where: {
        productId: Number(productId),
        userId: Number(user.id),
      },
    });

    if (getCartItem) {
      const updateCardItem = await prisma.cartItem.update({
        where: {
          id: Number(getCartItem.id),
        },
        data: {
          qtd: { increment: 1 },
        },
      });
      res
        .status(200)
        .json({ msg: "Produto atualizado com sucesso", data: updateCardItem });
      return;
    } else {
      const createItem = await prisma.cartItem.create({
        data: {
          product: { connect: { id: Number(productId) } },
          user: { connect: { id: Number(user.id) } },
          qtd: 1,
        },
      });

      res
        .status(201)
        .json({ msg: "Produto incluído com sucesso", data: createItem });
      return;
    }
  } catch (error) {
    res.status(500).json({ msg: "Erro no Servidor", err: error });
    return;
  }
};

export const deleteCartItem = async (req: Request, res: Response) => {
  try {
    const { user } = req;
    const id = req.params.id;

    if (Number.isNaN(id)) {
      res.status(400).json({
        msg: "ID do item inválido",
      });
      return;
    }

    const cartItem = await prisma.cartItem.findFirst({
      where: {
        id: Number(id),
        userId: Number(user.id),
      },
    });

    if (!cartItem) {
      res.status(404).json({
        msg: "Item do carrinho NÃO encontrado",
      });
      return;
    }

    const cartItems = await prisma.cartItem.delete({
      where: {
        id: Number(id),
      },
    });

    res.status(200).json({ msg: "Item excluído com sucesso" });
    return;
  } catch (error) {
    res.status(500).json({ msg: "Erro no Servidor", err: error });
    return;
  }
};

export const updateCartItem = async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const { qtd } = req.body;

  if (qtd < 1) {
    res.status(400).json({ msg: "A quantidade não poder ser menor que 1" });
    return;
  }

  try {
    const cartItem = await prisma.cartItem.update({
      where: {
        id,
      },
      data: {
        qtd,
      },
      include: {
        product: true,
      },
    });

    res.status(200).json({
      msg: "Quantidade atualizada com sucesso",
      data: cartItem,
    });
  } catch (error) {
    res.status(500).json({ msg: "Erro no servidor", err: error });
  }
};
