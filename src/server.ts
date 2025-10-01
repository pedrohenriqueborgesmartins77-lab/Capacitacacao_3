import fastify from "fastify"
import { cepRoutes } from "./routes/cep";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { registerRoutes } from "./routes/br-register";
import { cnpjRoutes } from "./routes/cnpj";
import { dddRoutes } from "./routes/ddd";
import { holidaysRoutes } from "./routes/holidays";
import { ufRoutes } from "./routes/uf";
import { empresaBasicoRoutes } from "./routes/endpoints/empresaBasico";
import { empresaPresencaRoutes } from "./routes/endpoints/empresaPresenca";
import { contatoRoutes } from "./routes/endpoints/contato";


const app = fastify().withTypeProvider<ZodTypeProvider>()

app.register(registerRoutes);

app.register(cepRoutes);

app.register(cnpjRoutes);

app.register(dddRoutes);

app.register(holidaysRoutes);

app.register(ufRoutes);

app.register(empresaBasicoRoutes);

app.register(empresaPresencaRoutes);

app.register(contatoRoutes);

app
    .listen({
        port: 3333,
    })
    .then(() => {
        console.log('HTTP Server Running!')
    })