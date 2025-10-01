import { FastifyInstance } from "fastify";
import { getUfSchema } from "../schemas/ufSchema";
import { getUfController } from "../controllers/ufController";

export async function ufRoutes (app: FastifyInstance){
    app.get('/api/ibge/uf/:siglaUF', {
        schema: getUfSchema
    },
    getUfController
  )
}