import type { Request, Response } from "express";
import { prisma } from "../db.js";
export const createOrder = async (req: Request, res: Response) => {
  const { user } = req;

  try {
    // Verifica itens do carrinho
    const response = await prisma.cartItem.findMany({
      where: {
        userId: Number(user.id),
      },
      include: { product: true },
    });
    // Acumula valores e cria o pedido
    let total = 0;
    let qtd_itens = 0;
    if (response.length === 0) {
      res.status(400).json({ msg: "Não existem itens no Carrinho" });
      return;
    }

    response.forEach((itens) => {
      total += itens.product.price * itens.qtd;
      qtd_itens += itens.qtd;
    });

    const criaPedido = await prisma.pedido.create({
      data: {
        total: Number(total),
        status: "Pendente",
        user: { connect: { id: Number(user.id) } },
        pedidoItens: {
          create: response.map((item) => ({
            productId: item.product.id,
            qtd: item.qtd,
            valor: item.product.price,
          })),
        },
      },
      include: { pedidoItens: true },
    });
    await prisma.cartItem.deleteMany({
      where: {
        userId: user.id,
      },
    });

    res
      .status(201)
      .json({ msg: "Pedido incluido com sucesso", data: criaPedido });
  } catch (error) {
    res.status(500).json({ msg: "Erro no servidor" });
  }
};

export const getOrders = async (req: Request, res: Response) => {
  const status = req.params.status;

  if (!status || Array.isArray(status)) {
    res.status(400).json({
      msg: "O status é obrigatório",
    });
    return;
  }

  try {
    const orders = await prisma.pedido.findMany({
      where: {
        status: status,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
          },
        },
        pedidoItens: true,
      },
    });

    if (orders.length === 0) {
      res
        .status(404)
        .json({ msg: "Não existem pedidos com status - (" + status + ")" });
      return;
    }

    res
      .status(200)
      .json({ msg: "Pedidos selecionados com sucesso", data: orders });
  } catch (error) {}
};

export const updateOrderStatus = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status_pedido } = req.body;

    console.log(id, status_pedido);

    if (!status_pedido) {
      res.status(400).json({
        msg: "Status do pedido não informado",
      });
      return;
    }

    const pedido = await prisma.pedido.update({
      where: {
        id: Number(id),
      },
      data: {
        status: status_pedido,
        dtDeliver: status_pedido === "Retirado" ? new Date() : null,
      },
    });

    res.status(200).json({
      msg: "Status do pedido alterado com sucesso",
      data: pedido,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      msg: "Erro ao alterar status do pedido",
      err: error,
    });
  }
};
