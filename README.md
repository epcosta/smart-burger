# 🍔 Smart Burguer

Sistema web Full Stack para gerenciamento de uma hamburgueria, desenvolvido com **React**, **TypeScript**, **Node.js**, **Express**, **Prisma ORM** e **PostgreSQL**.

O projeto implementa funcionalidades de autenticação, gerenciamento de produtos, carrinho de compras e controle de pedidos, utilizando uma arquitetura separada entre **Frontend**, **Backend** e **Banco de Dados**.

A aplicação também está preparada para execução em ambiente **Docker**, permitindo iniciar toda a infraestrutura através do Docker Compose.

---

## 📋 Sobre o projeto

O **Smart Burguer** foi desenvolvido como um projeto Full Stack com o objetivo de aplicar conceitos utilizados no desenvolvimento de aplicações web modernas.

O sistema permite que usuários realizem cadastro e autenticação, consultem produtos, adicionem itens ao carrinho e realizem pedidos.

Também existem funcionalidades administrativas para gerenciamento dos produtos e acompanhamento dos pedidos realizados.

---

## 🚀 Tecnologias utilizadas

### Frontend

- React
- TypeScript
- Vite
- Tailwind CSS
- React Router
- shadcn/ui
- Lucide React
- Fetch API

### Backend

- Node.js
- TypeScript
- Express
- Prisma ORM
- PostgreSQL
- JWT
- bcrypt
- cookie-parser
- CORS
- Multer
- Swagger / OpenAPI

### Infraestrutura

- Docker
- Docker Compose
- PostgreSQL
- pgAdmin
- Prisma Migrations

---

# 🏗️ Arquitetura

A aplicação é dividida em três serviços principais:

```text
┌───────────────────────────────┐
│           Browser             │
│                               │
│     http://localhost:5173     │
└───────────────┬───────────────┘
                │
                │ HTTP / JSON
                ▼
┌───────────────────────────────┐
│        React + Vite           │
│          Frontend             │
│                               │
│         Porta 5173            │
└───────────────┬───────────────┘
                │
                │ REST API
                ▼
┌───────────────────────────────┐
│      Node.js + Express        │
│           Backend             │
│                               │
│         Porta 3000            │
└───────────────┬───────────────┘
                │
                │ Prisma ORM
                ▼
┌───────────────────────────────┐
│          PostgreSQL           │
│                               │
│ Container: porta 5432         │
│ Host:      porta 5433         │
└───────────────────────────────┘
```

Cada serviço é executado em seu próprio container Docker.

---

# 📁 Estrutura do projeto

```text
hamburger/
│
├── compose.yml
│
├── front-end/
│   ├── src/
│   │   ├── components/
│   │   ├── contexts/
│   │   ├── pages/
│   │   ├── types/
│   │   └── ...
│   │
│   ├── public/
│   ├── package.json
│   ├── vite.config.ts
│   └── Dockerfile
│
└── back-end/
    ├── prisma/
    │   ├── migrations/
    │   └── schema.prisma
    │
    ├── src/
    ├── uploads/
    ├── .env
    ├── package.json
    ├── prisma7.config.ts
    └── Dockerfile
```

> A estrutura pode variar ligeiramente conforme a organização dos controllers, routes, middlewares e demais módulos do backend.

---

# ✨ Funcionalidades

## 👤 Usuários

O sistema possui autenticação baseada em **JWT (JSON Web Token)**.

Principais funcionalidades:

- Cadastro de usuários
- Login
- Logout
- Verificação de usuário autenticado
- Controle de acesso
- Identificação de usuários administradores
- Cookies HTTP para autenticação

Principais endpoints:

```text
POST /register
POST /login
POST /logout
GET  /me
```

---

## 🍔 Produtos

Os produtos podem ser organizados por categorias, como:

- Hamburger
- Bebida
- Porção

O sistema permite:

- Listar produtos
- Consultar produto
- Criar produtos
- Excluir produtos
- Upload de imagens
- Validação de arquivos enviados
- Controle administrativo

Exemplos de endpoints:

```text
GET    /get-products
GET    /get-product/:id
POST   /create-product
DELETE /delete-product/:id
```

O upload das imagens é realizado utilizando **Multer**.

---

## 🛒 Carrinho

Usuários autenticados podem adicionar produtos ao carrinho.

Funcionalidades disponíveis:

- Adicionar produto
- Incrementar quantidade
- Diminuir quantidade
- Excluir produto
- Consultar carrinho
- Calcular quantidade de itens
- Calcular valores

Endpoints:

```text
GET    /get-cartItems
POST   /create-cartItem
PATCH  /update-cartItem/:id
DELETE /delete-cartItem/:id
```

---

## 📦 Pedidos

O sistema permite transformar os produtos do carrinho em um pedido.

Os pedidos possuem estados como:

```text
Pendente
Retirado
Cancelado
```

Funcionalidades:

- Criar pedido
- Consultar pedidos por status
- Alterar status
- Registrar data/hora de entrega
- Consultar itens do pedido

Endpoints:

```text
POST  /criar-pedido
GET   /get-orders/:status
PATCH /update-order-status/:id
```

Ao alterar um pedido para **Retirado**, o sistema registra a data/hora da entrega.

---

# 🔐 Autenticação

A autenticação utiliza **JWT** armazenado em cookie.

O frontend envia as credenciais nas requisições através de:

```ts
fetch("http://localhost:3000/me", {
  credentials: "include",
});
```

O backend utiliza middleware para validar o token antes de permitir acesso às rotas protegidas.

Exemplo conceitual:

```text
Browser
   │
   │ Cookie JWT
   ▼
Express
   │
   ▼
authMiddleware
   │
   ├── token inválido → 401
   │
   └── token válido
            │
            ▼
        Controller
```

---

# 🗄️ Banco de dados

O banco utilizado é o **PostgreSQL**.

O acesso ao banco pelo backend é realizado através do **Prisma ORM**.

Entre as principais entidades estão:

```text
User
Product
CartItem
Pedido
PedidoItens
```

O Prisma é responsável por:

- Modelagem das entidades
- Relacionamentos
- Consultas
- Inserções
- Atualizações
- Exclusões
- Migrations

---

# 🐳 Docker

O projeto utiliza Docker para separar os principais serviços da aplicação.

São utilizados três containers:

```text
smart-burger-frontend
smart-burger-backend
smart-burger-postgres
```

A comunicação interna ocorre através da rede criada automaticamente pelo Docker Compose.

---

# 🔌 Portas utilizadas

| Serviço | Host | Container |
|---|---:|---:|
| Frontend | 5173 | 5173 |
| Backend | 3000 | 3000 |
| PostgreSQL | 5433 | 5432 |

O PostgreSQL utiliza `5433` no Windows para evitar conflito com uma instalação local que utilize a porta padrão `5432`.

---

# 🐘 Comunicação com PostgreSQL

Existem duas formas de acessar o PostgreSQL dependendo de onde o cliente está sendo executado.

### Backend dentro do Docker

O backend utiliza o nome do serviço Docker:

```env
DATABASE_URL=postgresql://postgres:1234@postgres:5432/smartburger
```

Nesse caso:

```text
postgres
```

é o hostname do serviço PostgreSQL dentro da rede Docker.

### Aplicações executadas no Windows

Ferramentas como Prisma Studio e pgAdmin podem utilizar:

```text
Host: localhost
Port: 5433
```

Exemplo:

```env
DATABASE_URL=postgresql://postgres:1234@localhost:5433/smartburger
```

---

# ⚙️ Variáveis de ambiente

Crie o arquivo:

```text
back-end/.env
```

Exemplo:

```env
DATABASE_URL=postgresql://postgres:1234@localhost:5433/smartburger
JWT_SECRET=coloque_sua_chave_secreta_aqui
```

> Nunca publique o arquivo `.env` contendo senhas ou chaves reais.

Adicione ao `.gitignore`:

```gitignore
.env
.env.*
!.env.example
```

Um arquivo `.env.example` pode ser disponibilizado:

```env
DATABASE_URL=
JWT_SECRET=
```

---

# 🐳 Docker Compose

Exemplo da configuração utilizada:

```yaml
services:

  postgres:
    image: postgres:17-alpine
    container_name: smart-burger-postgres

    environment:
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: 1234
      POSTGRES_DB: smartburger

    ports:
      - "5433:5432"

    volumes:
      - postgres_data:/var/lib/postgresql/data

    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U postgres -d smartburger"]
      interval: 5s
      timeout: 5s
      retries: 10


  backend:
    build:
      context: ./back-end

    container_name: smart-burger-backend

    ports:
      - "3000:3000"

    env_file:
      - ./back-end/.env

    environment:
      DATABASE_URL: "postgresql://postgres:1234@postgres:5432/smartburger"

    volumes:
      - ./back-end:/app
      - backend_node_modules:/app/node_modules

    depends_on:
      postgres:
        condition: service_healthy

    command: sh -c "npm install && npx prisma migrate deploy && npm run dev"


  frontend:
    build:
      context: ./front-end

    container_name: smart-burger-frontend

    ports:
      - "5173:5173"

    volumes:
      - ./front-end:/app
      - frontend_node_modules:/app/node_modules

    depends_on:
      - backend

    command: npm run dev -- --host 0.0.0.0


volumes:
  postgres_data:
  backend_node_modules:
  frontend_node_modules:
```

---

# ▶️ Executando o projeto

## Pré-requisitos

É necessário possuir:

- Git
- Docker
- Docker Compose

Clone o repositório:

```bash
git clone <URL_DO_REPOSITORIO>
```

Entre na pasta:

```bash
cd hamburger
```

Configure:

```text
back-end/.env
```

Depois execute:

```bash
docker compose up --build
```

Ou em segundo plano:

```bash
docker compose up -d --build
```

---

# 🌐 Acessando a aplicação

Depois que os containers estiverem funcionando:

### Frontend

```text
http://localhost:5173
```

### Backend

```text
http://localhost:3000
```

### Swagger

```text
http://localhost:3000/api-docs
```

---

# 📊 Verificando os containers

```bash
docker compose ps
```

Exemplo esperado:

```text
smart-burger-frontend
smart-burger-backend
smart-burger-postgres
```

---

# 📜 Visualizando logs

Todos os serviços:

```bash
docker compose logs -f
```

Backend:

```bash
docker compose logs -f backend
```

Frontend:

```bash
docker compose logs -f frontend
```

PostgreSQL:

```bash
docker compose logs -f postgres
```

---

# 🛑 Parando a aplicação

```bash
docker compose down
```

Os dados do PostgreSQL permanecem armazenados no volume Docker.

Para visualizar os volumes:

```bash
docker volume ls
```

> ⚠️ Cuidado com o comando:

```bash
docker compose down -v
```

A opção `-v` remove os volumes associados ao projeto e pode excluir os dados armazenados no PostgreSQL.

---

# 🔄 Desenvolvimento com Hot Reload

Os diretórios do frontend e backend são montados nos containers através de **bind mounts**:

```yaml
volumes:
  - ./front-end:/app
```

e:

```yaml
volumes:
  - ./back-end:/app
```

Isso permite editar o código no VS Code no Windows e disponibilizar as alterações imediatamente dentro dos containers.

Para evitar que os `node_modules` locais sobrescrevam os instalados nos containers são utilizados volumes separados:

```yaml
frontend_node_modules:/app/node_modules
backend_node_modules:/app/node_modules
```

---

# ⚡ Vite + Docker no Windows

Em alguns ambientes Docker Desktop + Windows, eventos de alteração de arquivos podem não ser detectados corretamente pelo Vite.

Nesse caso pode ser utilizado polling no `vite.config.ts`:

```ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],

  server: {
    host: "0.0.0.0",

    watch: {
      usePolling: true,
      interval: 100,
    },
  },
});
```

Assim, alterações realizadas no VS Code são detectadas pelo Vite dentro do container.

---

# 🧬 Prisma Migrations

As migrations ficam armazenadas em:

```text
back-end/prisma/migrations
```

Em ambiente Docker, as migrations existentes podem ser aplicadas através de:

```bash
docker compose exec backend npx prisma migrate deploy
```

O Compose também pode executar automaticamente:

```bash
npx prisma migrate deploy
```

antes de iniciar o backend.

---

## Criando uma nova migration

Durante o desenvolvimento, depois de modificar:

```text
prisma/schema.prisma
```

execute:

```bash
docker compose exec backend npx prisma migrate dev --name nome_da_migration
```

Exemplo:

```bash
docker compose exec backend npx prisma migrate dev --name adiciona_campo_produto
```

Depois disso, a nova migration será criada em:

```text
prisma/migrations/
```

---

# 🔎 Prisma Studio

Como o PostgreSQL do Docker está disponível no Windows através da porta `5433`, o Prisma Studio pode ser executado diretamente no host.

Exemplo:

```bash
npx prisma studio --url="postgresql://postgres:1234@localhost:5433/smartburger"
```

Também é possível definir uma porta:

```bash
npx prisma studio --port 5555 --url="postgresql://postgres:1234@localhost:5433/smartburger"
```

---

# 📚 Documentação da API

A API possui documentação utilizando **Swagger / OpenAPI**.

Com o backend em execução:

```text
http://localhost:3000/api-docs
```

A documentação apresenta os endpoints disponíveis, parâmetros, formatos de requisição, respostas HTTP e autenticação necessária.

---

# 🖼️ Upload de imagens

O backend utiliza **Multer** para realizar upload das imagens dos produtos.

Os arquivos são armazenados no diretório:

```text
uploads/
```

O sistema realiza validações antes de armazenar o arquivo e associa o nome da imagem ao produto correspondente no banco de dados.

Na exclusão de um produto, a aplicação também pode remover o arquivo físico correspondente.

---

# 🔒 Segurança

Algumas práticas utilizadas no projeto:

- Senhas armazenadas utilizando hash com bcrypt
- Autenticação JWT
- JWT armazenado em cookie HTTP
- Middleware para proteção das rotas
- Controle de acesso administrativo
- Validação dos dados recebidos pela API
- Validação de uploads
- Variáveis sensíveis armazenadas em `.env`
- Configuração CORS para comunicação entre frontend e backend

---

# 🛠️ Comandos úteis

```bash
# Subir toda a aplicação
docker compose up -d

# Recriar imagens
docker compose up -d --build

# Ver containers
docker compose ps

# Logs do backend
docker compose logs -f backend

# Logs do frontend
docker compose logs -f frontend

# Entrar no backend
docker compose exec backend sh

# Entrar no PostgreSQL
docker compose exec postgres psql -U postgres -d smartburger

# Aplicar migrations
docker compose exec backend npx prisma migrate deploy

# Criar migration
docker compose exec backend npx prisma migrate dev --name nome_migration

# Gerar Prisma Client
docker compose exec backend npx prisma generate

# Reiniciar frontend
docker compose restart frontend

# Reiniciar backend
docker compose restart backend

# Parar a aplicação
docker compose down
```

---

# 📌 Status do projeto

Projeto em desenvolvimento.

Funcionalidades implementadas incluem:

- Autenticação
- Cadastro de usuários
- Produtos
- Upload de imagens
- Carrinho de compras
- Criação de pedidos
- Gerenciamento de status dos pedidos
- Dockerização da aplicação
- PostgreSQL
- Prisma ORM
- Swagger

Novas funcionalidades e melhorias podem ser adicionadas conforme a evolução do projeto.

---

# 👨‍💻 Autor

**Euripides Costa**

Desenvolvido como projeto de estudo e portfólio Full Stack.

Tecnologias principais:

**React • TypeScript • Node.js • Express • Prisma • PostgreSQL • Docker**
