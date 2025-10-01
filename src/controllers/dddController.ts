import { FastifyReply, FastifyRequest } from "fastify";
import { DddRouteInterface } from "../schemas/dddSchema";
import { getDddInfo } from "../clients/getddd";

export async function getDddController (
    request: FastifyRequest<DddRouteInterface>,
    reply: FastifyReply
) {
    const { ddd } = request.params;

    try {
        const dddData = await getDddInfo(ddd);
        return dddData   
    }catch (error) {
        return reply.code(404).send({error: "Error"})
    }
}