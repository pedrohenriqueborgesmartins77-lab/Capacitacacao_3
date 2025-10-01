import z, { TypeOf } from "zod";

export const getUfSchema = z.object({
    params: z.object({
        siglaUF : z.string()        
    })
})

export type UfSchema = TypeOf<typeof getUfSchema>

export interface UfRouteInterface {
    Params: UfSchema['params']
}