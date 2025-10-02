import { FastifyInstance } from "fastify";
import { authMiddleware } from "../middleware/auth.middleware";
import { z } from "zod";
import { associateCnpjName, findCnpj } from "../../services/cnpj.service";

// Schema para o POST
const cnpjNameSchema = {
    params: z.object({
        cnpj: z.string().length(14, 'O CNPJ deve ter 14 dígitos.')
    }),
    body: z.object({
        name: z.string().min(2, 'O nome deve ter no mínimo 2 caracteres.')
    })
};

// Schema para o GET
const getCnpjSchema = {
    params: z.object({
        cnpj: z.string().length(14, 'O CNPJ deve ter 14 dígitos.')
    }),
};

// UMA ÚNICA FUNÇÃO PARA TODAS AS ROTAS DE CNPJ
export async function authcnpjRoutes(app: FastifyInstance) {
    // ROTA POST PARA ASSOCIAR NOME
    app.post(
        '/:cnpj/name',
        {
            preHandler: [authMiddleware],
            schema: cnpjNameSchema,
        },
        async (request, reply) => {
            const { cnpj } = request.params as z.infer<typeof cnpjNameSchema.params>;
            const { name } = request.body as z.infer<typeof cnpjNameSchema.body>;
            const userId = request.user.sub;

            await associateCnpjName({ cnpj, name, userId });

            return reply.status(201).send({
                message: `Nome '${name}' associado ao CNPJ '${cnpj}' pelo usuário ${userId}`
            });
        }
    );

    // ROTA GET PARA BUSCAR CNPJ
    app.get(
        '/:cnpj',
        {
            preHandler: [authMiddleware],
            schema: getCnpjSchema,
        },
        async (request, reply) => {
            const { cnpj } = request.params as z.infer<typeof getCnpjSchema.params>;
            const result = await findCnpj(cnpj);

            if (result) {
                return reply.status(200).send(result);
            }
            return reply.status(404).send({ message: 'CNPJ não registrado.' });
        }
    );
}
