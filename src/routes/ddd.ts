import { FastifyInstance } from "fastify";
import { getDddSchema } from "../schemas/dddSchema";
import { getDddController } from "../controllers/dddController";

export async function dddRoutes (app: FastifyInstance) {
    app.get('/api/ddd/:ddd', {
        schema: getDddSchema
    },
    getDddController
  )    
}