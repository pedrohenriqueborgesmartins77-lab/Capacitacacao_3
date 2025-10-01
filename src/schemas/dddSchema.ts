import z, { TypeOf } from "zod";

export const getDddSchema = z.object({
    params: z.object({
        ddd: z.string().length(2)
    })
})

export type DddSchema = TypeOf<typeof getDddSchema>

export interface DddRouteInterface {
    Params: DddSchema['params']
}