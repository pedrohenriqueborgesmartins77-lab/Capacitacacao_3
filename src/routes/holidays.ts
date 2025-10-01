import { FastifyInstance } from "fastify";
import { getHolidaysSchema } from "../schemas/holidaysSchema";
import { getFeriadosController } from "../controllers/holidaysController";

export async function holidaysRoutes (app: FastifyInstance) {
    app.get('/api/feriados/:ano', {
        schema: getHolidaysSchema
    },
    getFeriadosController
  )    
}