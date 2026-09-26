import { Router } from "express";
import { authMiddleware } from "./middlewares/auth-middleware.js";
import { upload } from "./middlewares/upload.js";
import { multerError } from "./middlewares/multerError.js";
import { auth, login, register, logout } from "./controller/userController.js";
import {
  getProducts,
  getProduct,
  deleteProduct,
  createProduct,
} from "./controller/productController.js";

import {
  getCartItems,
  createCartItem,
  deleteCartItem,
  updateCartItem,
} from "./controller/cartItemController.js";
import {
  createOrder,
  getOrders,
  updateOrderStatus,
} from "./controller/pedidoController.js";

export const router = Router();

/**
 * @swagger
 * /login:
 *   post:
 *     summary: Realiza o login do usuário
 *     description: Autentica o usuário e grava o JWT no cookie "user".
 *     tags:
 *       - Autenticação
 *
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: euripides@email.com
 *               password:
 *                 type: string
 *                 format: password
 *                 example: "123456"
 *
 *     responses:
 *       200:
 *         description: Login realizado com sucesso
 *         headers:
 *           Set-Cookie:
 *             description: Cookie contendo o JWT do usuário
 *             schema:
 *               type: string
 *               example: user=token-jwt
 *       400:
 *         description: E-mail e senha são obrigatórios
 *       401:
 *         description: Credenciais inválidas
 *       404:
 *         description: Usuário não encontrado
 */
router.post("/login", login);
//###########################################################################

/**
 * @swagger
 * /logout:
 *   post:
 *     summary: Realiza o logout do usuário
 *     description: Remove o cookie de autenticação "user".
 *     tags:
 *       - Autenticação
 *
 *     security:
 *       - cookieAuth: []
 *
 *     responses:
 *       200:
 *         description: Logout realizado com sucesso
 *       401:
 *         description: Usuário não autenticado
 */
router.post("/logout", authMiddleware, logout);
//###########################################################################

/**
 * @swagger
 * /register:
 *   post:
 *     summary: Cadastra um novo usuário
 *     tags:
 *       - Autenticação
 *
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - password
 *               - cep
 *             properties:
 *               name:
 *                 type: string
 *                 example: Euripides Costa
 *               email:
 *                 type: string
 *                 format: email
 *                 example: euripides@email.com
 *               password:
 *                 type: string
 *                 format: password
 *                 example: "123456"
 *               cep:
 *                 type: string
 *                 example: "01310100"
 *
 *     responses:
 *       201:
 *         description: Usuário cadastrado com sucesso
 *       400:
 *         description: Nome, e-mail, senha e CEP são obrigatórios
 *       409:
 *         description: E-mail já cadastrado
 *       500:
 *         description: Erro no servidor
 */
router.post("/register", register);
//###########################################################################

/**
 * @swagger
 * /me:
 *   get:
 *     summary: Retorna o usuário autenticado
 *     tags:
 *       - Autenticação
 *
 *     security:
 *       - cookieAuth: []
 *
 *     responses:
 *       200:
 *         description: Usuário autenticado
 *       401:
 *         description: Usuário não autenticado
 *       500:
 *         description: Erro no servidor
 */
router.get("/me", authMiddleware, auth);
//###########################################################################

//* Produtos

/**
 * @swagger
 * /create-product:
 *   post:
 *     summary: Cadastra um novo produto
 *     description: >
 *       Cadastra um novo produto no sistema. O envio deve ser realizado
 *       utilizando multipart/form-data, porque a rota recebe uma imagem.
 *     tags:
 *       - Produtos
 *     security:
 *       - cookieAuth: []
 *
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - description
 *               - category
 *               - price
 *               - img
 *             properties:
 *               name:
 *                 type: string
 *                 example: "X-Bacon"
 *               description:
 *                 type: string
 *                 example: "Hambúrguer, queijo, bacon e molho especial"
 *               category:
 *                 type: string
 *                 enum:
 *                   - Hamburger
 *                   - Bebida
 *                   - Porção
 *                 example: "Hamburger"
 *               price:
 *                 type: number
 *                 format: float
 *                 minimum: 0.01
 *                 example: 29.90
 *               img:
 *                 type: string
 *                 format: binary
 *                 description: Imagem do produto
 *
 *     responses:
 *       201:
 *         description: Produto cadastrado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 msg:
 *                   type: string
 *                   example: "Produto cadastrado com sucesso"
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       example: 1
 *                     name:
 *                       type: string
 *                       example: "X-Bacon"
 *                     description:
 *                       type: string
 *                       example: "Hambúrguer, queijo, bacon e molho especial"
 *                     category:
 *                       type: string
 *                       example: "Hamburger"
 *                     price:
 *                       type: number
 *                       format: float
 *                       example: 29.90
 *                     img:
 *                       type: string
 *                       example: "1758894567890-x-bacon.jpg"
 *
 *       400:
 *         description: Dados inválidos ou arquivo de imagem inválido
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 msg:
 *                   type: string
 *             examples:
 *               nomeObrigatorio:
 *                 summary: Nome não informado
 *                 value:
 *                   msg: "Nome do produto é obrigatório"
 *               descricaoObrigatoria:
 *                 summary: Descrição não informada
 *                 value:
 *                   msg: "Descrição do produto é obrigatória"
 *               categoriaObrigatoria:
 *                 summary: Categoria não informada
 *                 value:
 *                   msg: "Categoria do produto é obrigatória"
 *               categoriaInvalida:
 *                 summary: Categoria inválida
 *                 value:
 *                   msg: "Categoria inválida"
 *               precoObrigatorio:
 *                 summary: Preço não informado
 *                 value:
 *                   msg: "Preço do produto é obrigatório"
 *               precoInvalido:
 *                 summary: Preço inválido
 *                 value:
 *                   msg: "Preço do produto inválido"
 *               imagemObrigatoria:
 *                 summary: Imagem não enviada
 *                 value:
 *                   msg: "Imagem do produto é obrigatória"
 *               imagemInvalida:
 *                 summary: Conteúdo do arquivo não é uma imagem válida
 *                 value:
 *                   msg: "O arquivo enviado não é uma imagem válida"
 *
 *       401:
 *         description: Usuário não autenticado
 *
 *       500:
 *         description: Erro interno do servidor
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 msg:
 *                   type: string
 *                   example: "Erro no servidor ao cadastrar produto"
 */

router.post(
  "/create-product",
  authMiddleware,
  upload.single("img"),
  multerError,
  createProduct,
);
//###########################################################################

/**
 * @swagger
 * /get-products:
 *   get:
 *     summary: Retorna todos os produtos
 *     description: Retorna a lista de produtos cadastrados.
 *     tags:
 *       - Produtos
 *     responses:
 *       200:
 *         description: Produtos retornados com sucesso
 */
router.get("/get-products", getProducts);
//###########################################################################

/**
 * @swagger
 * /get-product/{id}:
 *   get:
 *     summary: Busca um produto pelo ID
 *     tags:
 *       - Produtos
 *
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do produto
 *         example: 3
 *
 *     responses:
 *       200:
 *         description: Produto encontrado
 *       404:
 *         description: Produto não encontrado
 */
router.get("/get-product/:id", getProduct);
//###########################################################################

/**
 * @swagger
 * /delete-product/{id}:
 *   delete:
 *     summary: Exclui um produto
 *     description: Exclui um produto pelo ID. O usuário precisa estar autenticado e ser administrador.
 *     tags:
 *       - Produtos
 *
 *     security:
 *       - cookieAuth: []
 *
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID do produto que será excluído
 *         schema:
 *           type: integer
 *         example: 1
 *
 *     responses:
 *       200:
 *         description: Produto excluído com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 msg:
 *                   type: string
 *                   example: Produto deletado com sucesso
 *
 *       400:
 *         description: ID do produto inválido
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 msg:
 *                   type: string
 *                   example: O ID do produto não é válido
 *
 *       401:
 *         description: Usuário não autenticado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 msg:
 *                   type: string
 *                   example: Usuário NÃO autenticado.
 *
 *       403:
 *         description: Usuário autenticado não possui permissão de administrador
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 msg:
 *                   type: string
 *                   example: Acesso negado. Usuário NÃO é admin
 *
 *       404:
 *         description: Produto não encontrado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 msg:
 *                   type: string
 *                   example: Produto NÃO encontrado
 *
 *       405:
 *         description: Produto não pode ser excluído porque está relacionado a itens do carrinho
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 msg:
 *                   type: string
 *                   example: Produto não pode ser excluído, pois existem pedidos em execução ou já executados.
 *
 *       500:
 *         description: Erro interno do servidor
 */
router.delete("/delete-product/:id", authMiddleware, deleteProduct);
//###########################################################################

//Carrinho de compras
/**
 * @swagger
 * /get-cartItems:
 *   get:
 *     summary: Retorna os itens do carrinho
 *     description: Retorna todos os produtos existentes no carrinho do usuário autenticado.
 *     tags:
 *       - Carrinho
 *
 *     security:
 *       - cookieAuth: []
 *
 *     responses:
 *       200:
 *         description: Itens do carrinho retornados com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                     description: ID do item do carrinho
 *                     example: 39
 *
 *                   productId:
 *                     type: integer
 *                     description: ID do produto
 *                     example: 3
 *
 *                   userId:
 *                     type: integer
 *                     description: ID do usuário proprietário do carrinho
 *                     example: 23
 *
 *                   qtd:
 *                     type: integer
 *                     description: Quantidade do produto no carrinho
 *                     example: 1
 *
 *                   product:
 *                     type: object
 *                     description: Dados do produto
 *                     properties:
 *                       id:
 *                         type: integer
 *                         description: ID do produto
 *                         example: 3
 *
 *                       name:
 *                         type: string
 *                         description: Nome do produto
 *                         example: SMASH TRIPLO
 *
 *                       description:
 *                         type: string
 *                         description: Descrição do produto
 *                         example: Três finas e crostantes carnes amassadas na chapa, com queijo cheddar, cebola roxa e molho especial no pão de batata.
 *
 *                       price:
 *                         type: number
 *                         format: float
 *                         description: Preço unitário do produto
 *                         example: 34.90
 *
 *                       img:
 *                         type: string
 *                         description: Nome do arquivo da imagem do produto
 *                         example: smash triplo.png
 *
 *                       category:
 *                         type: string
 *                         description: Categoria do produto
 *                         example: Hamburger
 *
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *                         description: Data e hora de criação do produto
 *                         example: "2026-09-09T17:12:02.404Z"
 *
 *       401:
 *         description: Usuário não autenticado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 msg:
 *                   type: string
 *                   example: Usuário NÃO autenticado
 *
 *       404:
 *         description: Não existem produtos no carrinho
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 msg:
 *                   type: string
 *                   example: Não existem Produtos no Carrinho
 *
 *       500:
 *         description: Erro interno do servidor
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 msg:
 *                   type: string
 *                   example: Erro no Servidor
 */
router.get("/get-cartItems", authMiddleware, getCartItems);
//###########################################################################

/**
 * @swagger
 * /create-cartItem:
 *   post:
 *     summary: Adiciona um produto ao carrinho
 *     description: Adiciona um produto ao carrinho do usuário autenticado. Se o produto já estiver no carrinho, incrementa sua quantidade em 1.
 *     tags:
 *       - Carrinho
 *
 *     security:
 *       - cookieAuth: []
 *
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - productId
 *             properties:
 *               productId:
 *                 type: integer
 *                 description: ID do produto que será adicionado ao carrinho
 *                 example: 3
 *
 *     responses:
 *       200:
 *         description: Produto já existia no carrinho e sua quantidade foi incrementada
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 msg:
 *                   type: string
 *                   example: Produto atualizado com sucesso
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       example: 10
 *                     productId:
 *                       type: integer
 *                       example: 3
 *                     userId:
 *                       type: integer
 *                       example: 1
 *                     qtd:
 *                       type: integer
 *                       example: 2
 *
 *       201:
 *         description: Produto incluído no carrinho
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 msg:
 *                   type: string
 *                   example: Produto incluído com sucesso
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       example: 10
 *                     productId:
 *                       type: integer
 *                       example: 3
 *                     userId:
 *                       type: integer
 *                       example: 1
 *                     qtd:
 *                       type: integer
 *                       example: 1
 *
 *       400:
 *         description: Produto não informado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 msg:
 *                   type: string
 *                   example: Produto é obrigatório
 *
 *       401:
 *         description: Usuário não autenticado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 msg:
 *                   type: string
 *                   example: Usuário NÃO autenticado
 *       404:
 *         description: Produto NÃO encontrado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 msg:
 *                   type: string
 *                   example: O produto NÃO FOI encontrado
 *
 *       500:
 *         description: Erro interno do servidor
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 msg:
 *                   type: string
 *                   example: Erro no Servidor
 */
router.post("/create-cartItem", authMiddleware, createCartItem);
//###########################################################################

/**
 * @swagger
 * /update-cartItem/{id}:
 *   patch:
 *     summary: Atualiza a quantidade de um item do carrinho
 *     description: >
 *       Atualiza a quantidade de um produto existente no carrinho.
 *       A quantidade mínima permitida é 1.
 *     tags:
 *       - Carrinho
 *
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do item do carrinho
 *         example: 39
 *
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - qtd
 *             properties:
 *               qtd:
 *                 type: integer
 *                 minimum: 1
 *                 description: Nova quantidade do produto no carrinho
 *                 example: 3
 *
 *     responses:
 *       200:
 *         description: Quantidade atualizada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 msg:
 *                   type: string
 *                   example: Quantidade atualizada com sucesso
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       example: 39
 *                     productId:
 *                       type: integer
 *                       example: 3
 *                     userId:
 *                       type: integer
 *                       example: 23
 *                     qtd:
 *                       type: integer
 *                       example: 3
 *                     product:
 *                       type: object
 *                       properties:
 *                         id:
 *                           type: integer
 *                           example: 3
 *                         name:
 *                           type: string
 *                           example: SMASH TRIPLO
 *                         description:
 *                           type: string
 *                           example: Três finas e crostantes carnes amassadas na chapa, com queijo cheddar, cebola roxa e molho especial no pão de batata.
 *                         price:
 *                           type: number
 *                           format: float
 *                           example: 34.9
 *                         img:
 *                           type: string
 *                           example: smash-triplo.png
 *                         category:
 *                           type: string
 *                           example: Hamburger
 *                         createdAt:
 *                           type: string
 *                           format: date-time
 *                           example: 2026-09-09T17:10:37.479Z
 *
 *       400:
 *         description: Quantidade inválida
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 msg:
 *                   type: string
 *                   example: A quantidade não poder ser menor que 1
 *
 *       500:
 *         description: Erro interno do servidor
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 msg:
 *                   type: string
 *                   example: Erro no servidor
 *                 err:
 *                   type: object
 */
router.patch("/update-cartItem/:id", authMiddleware, updateCartItem);
//###########################################################################

/**
 * @swagger
 * /delete-cartItem/{id}:
 *   delete:
 *     summary: Exclui um item do carrinho
 *     description: Exclui um item do carrinho pertencente ao usuário autenticado.
 *     tags:
 *       - Carrinho
 *
 *     security:
 *       - cookieAuth: []
 *
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID do item do carrinho que será excluído
 *         schema:
 *           type: integer
 *         example: 39
 *
 *     responses:
 *       200:
 *         description: Item excluído com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 msg:
 *                   type: string
 *                   example: Item excluído com sucesso
 *
 *       400:
 *         description: ID do item inválido
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 msg:
 *                   type: string
 *                   example: ID do item inválido
 *
 *       401:
 *         description: Usuário não autenticado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 msg:
 *                   type: string
 *                   example: Usuário NÃO autenticado
 *
 *       404:
 *         description: Item não encontrado no carrinho do usuário
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 msg:
 *                   type: string
 *                   example: Item do carrinho NÃO encontrado
 *
 *       500:
 *         description: Erro interno do servidor
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 msg:
 *                   type: string
 *                   example: Erro no Servidor
 */

router.delete("/delete-cartItem/:id", authMiddleware, deleteCartItem);
//###########################################################################

/**
 * @swagger
 * /create-order:
 *   post:
 *     summary: Cria um novo pedido
 *     description: Cria um pedido utilizando todos os produtos existentes no carrinho do usuário autenticado. Após a criação do pedido, os itens são removidos do carrinho.
 *     tags:
 *       - Pedidos
 *
 *     security:
 *       - cookieAuth: []
 *
 *     responses:
 *       201:
 *         description: Pedido criado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 msg:
 *                   type: string
 *                   example: Pedido incluido com sucesso
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       description: ID do pedido
 *                       example: 15
 *
 *                     total:
 *                       type: number
 *                       format: float
 *                       description: Valor total do pedido
 *                       example: 75.80
 *
 *                     status:
 *                       type: string
 *                       description: Status atual do pedido
 *                       example: Pendente
 *
 *                     userId:
 *                       type: integer
 *                       description: ID do usuário que realizou o pedido
 *                       example: 23
 *
 *                     pedidoItens:
 *                       type: array
 *                       description: Itens que fazem parte do pedido
 *                       items:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: integer
 *                             example: 32
 *
 *                           productId:
 *                             type: integer
 *                             description: ID do produto
 *                             example: 1
 *
 *                           qtd:
 *                             type: integer
 *                             description: Quantidade do produto
 *                             example: 2
 *
 *                           valor:
 *                             type: number
 *                             format: float
 *                             description: Valor unitário do produto no momento do pedido
 *                             example: 28.90
 *
 *                           pedidoId:
 *                             type: integer
 *                             description: ID do pedido
 *                             example: 15
 *
 *       400:
 *         description: Carrinho vazio
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 msg:
 *                   type: string
 *                   example: Não existem itens no Carrinho
 *
 *       401:
 *         description: Usuário não autenticado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 msg:
 *                   type: string
 *                   example: Usuário NÃO autenticado
 *
 *       500:
 *         description: Erro interno do servidor
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 msg:
 *                   type: string
 *                   example: Erro no servidor
 */
router.post("/create-order", authMiddleware, createOrder);
//###########################################################################

/**
 * @swagger
 * /get-orders/{status}:
 *   get:
 *     summary: Lista os pedidos por status
 *     description: Retorna todos os pedidos que possuem o status informado.
 *     tags:
 *       - Pedidos
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: status
 *         required: true
 *         schema:
 *           type: string
 *         description: Status dos pedidos que serão consultados
 *         example: Pendente
 *     responses:
 *       200:
 *         description: Pedidos encontrados com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 msg:
 *                   type: string
 *                   example: Pedidos encontrados com sucesso
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                         example: 15
 *                       total:
 *                         type: number
 *                         format: float
 *                         example: 68.90
 *                       status:
 *                         type: string
 *                         example: Pendente
 *                       userId:
 *                         type: integer
 *                         example: 23
 *                       createAt:
 *                         type: string
 *                         format: date-time
 *                         example: "2026-09-25T13:35:20.000Z"
 *                       dtDeliver:
 *                         type: string
 *                         format: date-time
 *                         nullable: true
 *                         example: null
 *       401:
 *         description: Usuário não autenticado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 msg:
 *                   type: string
 *                   example: Usuário não autenticado
 *       500:
 *         description: Erro interno do servidor
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 msg:
 *                   type: string
 *                   example: Erro no Servidor
 */
router.get("/get-orders/:status", authMiddleware, getOrders);
//###########################################################################

/**
 * @swagger
 * /update-order-status/{id}:
 *   patch:
 *     summary: Atualiza o status de um pedido
 *     description: >
 *       Atualiza o status do pedido informado.
 *       Quando o novo status for "Retirado", a data e hora da retirada
 *       são gravadas no campo dtDeliver.
 *       Para os demais status, dtDeliver é definido como null.
 *     tags:
 *       - Pedidos
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do pedido
 *         example: 15
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - status_pedido
 *             properties:
 *               status_pedido:
 *                 type: string
 *                 example: Retirado
 *                 description: Novo status do pedido
 *                 enum:
 *                   - Pendente
 *                   - Retirado
 *                   - Cancelado
 *     responses:
 *       200:
 *         description: Status do pedido atualizado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 msg:
 *                   type: string
 *                   example: Status do pedido alterado com sucesso
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       example: 15
 *                     total:
 *                       type: number
 *                       format: float
 *                       example: 68.90
 *                     status:
 *                       type: string
 *                       example: Retirado
 *                     userId:
 *                       type: integer
 *                       example: 23
 *                     createAt:
 *                       type: string
 *                       format: date-time
 *                       example: "2026-09-25T13:35:20.000Z"
 *                     dtDeliver:
 *                       type: string
 *                       format: date-time
 *                       nullable: true
 *                       example: "2026-09-25T14:10:35.000Z"
 *       400:
 *         description: Dados inválidos
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 msg:
 *                   type: string
 *                   example: Status do pedido não informado
 *       401:
 *         description: Usuário não autenticado
 *       404:
 *         description: Pedido não encontrado
 *       500:
 *         description: Erro interno do servidor
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 msg:
 *                   type: string
 *                   example: Erro ao alterar status do pedido
 */
router.patch("/update-order-status/:id", authMiddleware, updateOrderStatus);
//###########################################################################
