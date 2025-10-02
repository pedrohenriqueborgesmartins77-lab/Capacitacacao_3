import fastify from "fastify"
import { cepRoutes } from "./routes/cep";
import { serializerCompiler, validatorCompiler, ZodTypeProvider } from "fastify-type-provider-zod";
import { registerRoutes } from "./routes/br-register";
import { cnpjRoutes } from "./routes/cnpj";
import { dddRoutes } from "./routes/ddd";
import { holidaysRoutes } from "./routes/holidays";
import { ufRoutes } from "./routes/uf";
import { empresaBasicoRoutes } from "./routes/endpoints/empresaBasico";
import { empresaPresencaRoutes } from "./routes/endpoints/empresaPresenca";
import { contatoRoutes } from "./routes/endpoints/contato";
import { authRoutes } from "./http/routes/auth.routes";
import fastifyJwt from "@fastify/jwt";

import './lib/database'
import { authcnpjRoutes } from "./http/routes/cnpj.routes";


const app = fastify().withTypeProvider<ZodTypeProvider>()

app.setValidatorCompiler(validatorCompiler);
app.setSerializerCompiler(serializerCompiler)

app.register(registerRoutes);

app.register(cepRoutes);

app.register(cnpjRoutes);

app.register(dddRoutes);

app.register(holidaysRoutes);

app.register(ufRoutes);

app.register(empresaBasicoRoutes);

app.register(empresaPresencaRoutes);

app.register(contatoRoutes);

app.register(authRoutes, { prefix: '/auth' });
app.register(authcnpjRoutes, { prefix: '/cnpj' })

app.register(fastifyJwt, {
    secret: 'supersecreto'
});

app
    .listen({
        port: 3333,
    })
    .then(() => {
        console.log('🚀 HTTP Server Running!')

        console.log(app.printRoutes());
    })