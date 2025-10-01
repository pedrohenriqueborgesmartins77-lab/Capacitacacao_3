import { FastifyInstance } from "fastify";
import { getCepSchema } from "../schemas/cepSchema";
import { getCepController } from "../controllers/cepController";

export async function cepRoutes(app: FastifyInstance) {
    app.get('/api/cep/:cep', {
        schema: getCepSchema
    },
    getCepController
  )
}