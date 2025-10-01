import { FastifyReply, FastifyRequest } from "fastify";
import { CepRouteInterface } from "../schemas/cepSchema";
import { getCepInfo } from "../clients/getCep";

export async function getCepController(
    request: FastifyRequest<CepRouteInterface>,
    reply: FastifyReply
) {
    const { cep } = request.params;

    try {
        const cepData = await getCepInfo(cep);
        return cepData
    }catch (error) {
        return reply.code(404).send({ error: "Error"})
    }
}