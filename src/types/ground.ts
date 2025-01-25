import { z } from 'zod'

export const GroundSchema = z.object({
  name: z.string().min(2, {
    message: 'O nome do solo deve ter no mínimo 2 caracteres',
  }),
  k: z
    .string()
    .regex(/^(?:[1-9]\d*|0)(?:\.\d{1,2})?$/g, { message: 'Valor inválido' })
    .or(z.number().nonnegative().min(1)),
  id: z.number().int(),
})

export type Ground = z.infer<typeof GroundSchema>
