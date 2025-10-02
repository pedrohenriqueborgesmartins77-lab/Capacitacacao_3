import { FastifyInstance, } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { LoginUserInput, loginUserSchema, RegisterUserInput, registerUserSchema } from "../schemas/auth.schemas";
import { createUser, verifyUser } from "../../services/auth.service";

export async function authRoutes(app: FastifyInstance){
    const appWithZod = app.withTypeProvider<ZodTypeProvider>();

    appWithZod.post(
        '/register',
        {
            schema: registerUserSchema,
        },
        async (request, reply) => {
            try {
                await createUser(request.body as RegisterUserInput);

                return reply.status(201).send({ message: 'Usuário registrado com sucesso!'})
            } catch (error: any) {
                if (error.message.includes('usuário já está em uso')) {
                    return reply.status(409).send({ message: error.message });
                }
                return reply.status(500).send({ message: 'Erro interno do servidor' })
            }
        }
    );

    appWithZod.post(
        '/login',
        {
            schema: loginUserSchema,
        },
        async (request, reply) => {
            try {
                const user = await verifyUser(request.body as LoginUserInput)

                const token = app.jwt.sign(
                    {
                        username: user.username
                    },
                    {
                        sub: user.id.toString(),
                    },
                    
                );

                return { token };

            }catch (error: any) {
                return reply.status(401).send({ message: error.message })
            }        
        }
    )
}



