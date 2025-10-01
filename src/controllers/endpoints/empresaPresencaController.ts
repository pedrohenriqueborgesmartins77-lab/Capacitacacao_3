import { FastifyRequest, FastifyReply } from 'fastify';
import { z } from 'zod';
import { createRequestContext } from '../../utils/requestContext';
import { getEmpresaPresenca } from '../../services/insights/empresaPresenca';

// Define um schema para validar os parâmetros da URL
const paramsSchema = z.object({
  cnpj: z.string().length(14, 'O CNPJ deve ter 14 dígitos.'),
});

async function get(
  request: FastifyRequest<{ Params: z.infer<typeof paramsSchema> }>,
  reply: FastifyReply,
) {
  try {
    const { cnpj } = request.params;

    // Cria o contexto para rastreabilidade e logs
    const ctx = createRequestContext(request.id);
    ctx.logger.info({ cnpj }, 'Iniciando busca de empresa básico');

    const result = await getEmpresaPresenca(cnpj, ctx);

    return reply.status(200).send(result);
  } catch (error) {
    // Captura qualquer erro inesperado no fluxo
    request.log.error(error, 'Erro inesperado ao processar a requisição de empresa básico');
    return reply.status(500).send({ error: 'Erro interno do servidor' });
  }
}

export const empresaPresencaController = { get };