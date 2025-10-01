import { FastifyInstance } from "fastify";
import { getCnpjSchema } from "../schemas/cnpjSchema";
import { getCnpjController } from "../controllers/cnpjController";

export async function cnpjRoutes (app: FastifyInstance) {
    app.get('/api/cnpj/:cnpj', {
        schema: getCnpjSchema
    },
    getCnpjController
  )       
}