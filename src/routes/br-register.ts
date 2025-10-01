import { FastifyInstance } from "fastify";
import { getRegisterSchema } from "../schemas/br-registerSchema";
import { getRegisterController } from "../controllers/br-registerController";

export async function registerRoutes(app : FastifyInstance) {
    app.get('/api/registrobr/:domain', {
        schema: getRegisterSchema
    },
    getRegisterController
  ) 
}