import { FastifyRequest, FastifyReply } from 'fastify';
import { ZodError } from 'zod';
import { createRequestContext } from '../../utils/requestContext'; // Este utilitário continua igual
import { getContato } from '../../services/insights/Contato';
import { getContatoSchema } from '../../schemas/endpoints/contatoSchema';

// Tipagem para os parâmetros da rota e da query string para o Fastify
interface RequestParams {
  ddd: string;
}
interface RequestQuery {
  ano?: string;
}

export async function contatoController(
  request: FastifyRequest<{ Params: RequestParams; Querystring: RequestQuery }>,
  reply: FastifyReply,
) {
  try {
    // 1. Validação com Zod (a lógica é a mesma, usamos req.params e req.query)
    const validatedInput = getContatoSchema.parse({
      params: request.params,
      query: request.query,
    });

    const { ddd } = validatedInput.params;
    const { ano } = validatedInput.query;
    
    // 2. Criação do contexto
   const ctx = createRequestContext(request.id);

    // 3. Chamada ao serviço
    const result = await getContato(ddd, ano, ctx);

    // 4. Envio da resposta com Fastify
    return reply.status(200).send(result);

  } catch (error) {
    // Erro de validação do Zod
    if (error instanceof ZodError) {
      return reply.status(400).send({
        message: 'Dados de entrada inválidos.',
        errors: error.flatten().fieldErrors,
      });
    }
    
    // Erros lançados pelo serviço
    if (error instanceof Error) {
        return reply.status(502).send({ // Bad Gateway
            message: error.message
        });
    }

    // Erros inesperados
    request.log.error(error); // Usando o logger do Fastify
    return reply.status(500).send({ message: 'Erro interno do servidor.' });
  }
}