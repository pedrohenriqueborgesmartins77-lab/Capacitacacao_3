import z, { TypeOf } from "zod";

export const registerUserSchema = z.object({
    body: z.object({
        username: z.string().min(3,{ message: 'O nome de usuário deve ter no mínimo 3 caracteres'}),
        password: z.string()
        .min(6, { message: ' A senha deve conter no mínimo 6 caracteres.' })
        .regex(/[a-zA-Z]/, { message: 'A senha deve conter ao mínimo uma letra.'})
        .regex(/[^a-zA-Z0-9]/, { message: 'A senha preciaa conter pelo menos um símbolo especial'})
    }),
})

export const loginUserSchema = z.object({
    body: z.object({
        username: z.string(),
        password: z.string(),
    })
})

export type RegisterUserInput = TypeOf<typeof registerUserSchema>['body'];
export type LoginUserInput = z.infer<typeof loginUserSchema>['body'];
