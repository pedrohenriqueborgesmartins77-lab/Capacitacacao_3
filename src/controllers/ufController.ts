import { FastifyReply, FastifyRequest } from "fastify";
import { UfRouteInterface } from "../schemas/ufSchema";
import { getUfInfo } from "../clients/getUf";

export async function getUfController (
    request : FastifyRequest<UfRouteInterface>,
    reply : FastifyReply
) {
    const { siglaUF } = request.params;  
    
    try {
        const siglaUFData = await getUfInfo(siglaUF)
        return siglaUFData       
    }catch (error) {
        return reply.code(404).send({error: "Error"})
    }
}
