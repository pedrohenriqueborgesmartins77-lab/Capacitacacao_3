import { ZodTypeProvider } from "fastify-type-provider-zod";
import { FastifyInstance } from "fastify";
import { empresaBasicoController } from "../../controllers/endpoints/empresaBasicoController";
import { getEmpresaBasicoSchema } from "../../schemas/endpoints/empresaBasicoSchema";

export async function empresaBasicoRoutes(app: FastifyInstance) {
  const appWithZod = app.withTypeProvider<ZodTypeProvider>();

  appWithZod.get("/empresa-basico/:cnpj", { schema: getEmpresaBasicoSchema }, empresaBasicoController.get);
}
