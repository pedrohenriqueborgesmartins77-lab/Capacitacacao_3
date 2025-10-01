import z from "zod";
import { TypeOf } from 'zod'

export const getCnpjSchema = z.object({
    params: z.object({
        cnpj: z.string().length(14)
    })
})

export type CnpjSchema = TypeOf<typeof getCnpjSchema>

export interface CnpjRouteInterface {
    Params : CnpjSchema['params']
}