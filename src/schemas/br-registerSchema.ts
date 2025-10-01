import { z } from 'zod'
import { TypeOf } from 'zod'

export const getRegisterSchema = z.object({
  params: z.object({
    domain: z.string()
  })
})

export type RegisterSchema = TypeOf<typeof getRegisterSchema>;

export interface RegisterRouteInterface {
    Params: RegisterSchema['params']
}