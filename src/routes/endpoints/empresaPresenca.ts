import { ZodTypeProvider } from "fastify-type-provider-zod";
import { FastifyInstance } from "fastify";
import { empresaPresencaController } from "../../controllers/endpoints/empresaPresencaController";
import { getEmpresaPresencaSchema } from "../../schemas/endpoints/empresaPresencaSchema";


export async function empresaPresencaRoutes(app: FastifyInstance) {
  const appWithZod = app.withTypeProvider<ZodTypeProvider>();

  appWithZod.get("/empresa-presenca/:cnpj", { schema: getEmpresaPresencaSchema }, empresaPresencaController.get);
}
