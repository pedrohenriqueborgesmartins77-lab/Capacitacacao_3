import { z } from 'zod'
import { TypeOf } from 'zod'

export const getEmpresaBasicoSchema = z.object({
  params: z.object({
    cnpj: z.string().regex(/^\d{14}$/, 'O CNPJ deve conter apenas 14 números.'),
  }),

  response: z.object({
    200: z.object({
      empresa: z
        .object({
          cnpj: z.string(),
          razaoSocial: z.string(),
          nomeFantasia: z.string().nullable(),
          situacaoCadastral: z.string(),
          dataAbertura: z.string(),
        })
        .optional(),

      endereco: z
        .object({
          cep: z.string(),
          logradouro: z.string(),
          numero: z.string(),
          complemento: z.string().nullable(),
          bairro: z.string(),
          cidade: z.string(),
          uf: z.string(),
        })
        .optional(),

      warnings: z.array(z.string()),
    }),
  }),
})

export type EmpresaBasicoSchema = TypeOf<typeof getEmpresaBasicoSchema>

export interface EmpresaBasicoRouteInterface {
  Params: EmpresaBasicoSchema['params']
}
