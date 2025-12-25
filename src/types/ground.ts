import { optionalIf, OptionalIfType } from '@/infra/optionalIf'
import { z } from 'zod'

const idSchema = z.coerce.number({
  required_error: 'O Tipo de Solo é obrigatório',
  invalid_type_error: 'O Tipo de Solo é obrigatório',
})

const nameSchema = z.string().min(2, { message: 'O nome do solo deve ter no mínimo 2 caracteres' })

const kSchema = z.union([
  z.string().regex(/^(?:[1-9]\d*|0)(?:\.\d{1,2})?$/, {
    message: 'Valor inválido',
  }),
  z.number().nonnegative().min(0),
])

export const GroundSchema = (method: OptionalIfType) =>
  z.object({
    id: optionalIf(idSchema, method, true),
    name: optionalIf(nameSchema, method),
    k: optionalIf(kSchema, method),
  })

const ground = GroundSchema('update')
export type Ground = z.infer<typeof ground>
