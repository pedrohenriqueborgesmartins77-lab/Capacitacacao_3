import { z } from 'zod';

export const getContatoSchema = z.object({
  params: z.object({
    ddd: z.string()
           .length(2, "O DDD deve ter exatamente 2 dígitos.")
           .regex(/^[0-9]+$/, "O DDD deve conter apenas números."),
  }),
  query: z.object({
    ano: z.string()
           .regex(/^\d{4}$/, "O ano deve estar no formato YYYY.")
           .optional(),
  }),
});