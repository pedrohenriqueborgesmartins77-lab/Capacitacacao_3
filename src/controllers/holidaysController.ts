import { FastifyReply, FastifyRequest } from "fastify";
import { HolidaysRouteInterface } from "../schemas/holidaysSchema";
import { getHolidaysInfo } from "../clients/getFeriados";

export async function getFeriadosController (
    request: FastifyRequest<HolidaysRouteInterface>,
    reply: FastifyReply
) {
    const { ano, estado } = request.params;

    try {
        const anoData = await getHolidaysInfo(ano, estado)
        return anoData
    }catch (error) {
        return reply.code(404).send({error: "Error"})        
    }
}