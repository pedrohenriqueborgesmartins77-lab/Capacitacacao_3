import { FastifyReply, FastifyRequest } from "fastify";
import { RegisterRouteInterface } from "../schemas/br-registerSchema";
import { getRegisterInfo } from "../clients/get-br-register";

export async function getRegisterController(
    request : FastifyRequest<RegisterRouteInterface>,
    reply: FastifyReply
) {
    const { domain } = request.params;

    try {
        const registerData = await getRegisterInfo(domain);
        return registerData              
    }catch (error) {
        return reply.code(404).send({ error: "Error"})
    }
}
