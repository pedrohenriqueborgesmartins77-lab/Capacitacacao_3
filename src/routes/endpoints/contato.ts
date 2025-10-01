import { FastifyInstance } from "fastify";
import { contatoController } from "../../controllers/endpoints/contatoController";


export async function contatoRoutes(app: FastifyInstance) {
  app.get("/contato/:ddd", contatoController);
}