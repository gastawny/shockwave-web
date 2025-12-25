import { optionalIf, OptionalIfType } from '@/infra/optionalIf'
import { z } from 'zod'

const idSchema = z.coerce.number({
  required_error: 'O Tipo de Explosivo é obrigatório',
  invalid_type_error: 'O Tipo de Explosivo é obrigatório',
})

const nameSchema = z
  .string()
  .min(2, { message: 'O nome do explosivo deve ter no mínimo 2 caracteres' })

export const ExplosiveSchema = (method: OptionalIfType) =>
  z.object({
    id: optionalIf(idSchema, method, true),
    name: optionalIf(nameSchema, method),
  })

const explosive = ExplosiveSchema('update')
export type Explosive = z.infer<typeof explosive>
