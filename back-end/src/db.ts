//import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../generated/prisma/client.js";

const connectionString = `${process.env.DATABASE_URL}`;

const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

//! Forma antiga
//const prisma = new PrismaClient()

export { prisma };

export async function connection() {
  try {
    await prisma.$connect();
    console.log("Conectado com o DB");
  } catch (error) {
    console.log("Erro ao conectar: ", error);
  }
}
