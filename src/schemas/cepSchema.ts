import { z  } from 'zod'
import { TypeOf } from 'zod'

export const getCepSchema = z.object({
  params: z.object({
    cep: z.string().length(8)
  })
})

export type CepSchema = TypeOf<typeof getCepSchema>;

export interface CepRouteInterface {
    Params: CepSchema['params']
}