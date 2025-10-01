import { FastifyReply, FastifyRequest } from "fastify";
import { CnpjRouteInterface } from "../schemas/cnpjSchema";
import { getCnpjInfo } from "../clients/getCnpj";

export async function getCnpjController (
    request: FastifyRequest<CnpjRouteInterface>,
    reply: FastifyReply
) {
    const { cnpj } = request.params;

    try {
        const cnpjData = await getCnpjInfo(cnpj);
        return cnpjData
    }catch (error) {
        return reply.code(404).send({error: "Error"})
    }
}