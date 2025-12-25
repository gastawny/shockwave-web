import { optionalIf, OptionalIfType } from '@/infra/optionalIf'
import { z } from 'zod'

const idSchema = z.coerce.number({
  required_error: 'O formato do objeto é obrigatório',
  invalid_type_error: 'O formato do objeto é obrigatório',
})

const nameSchema = z
  .string()
  .min(2, { message: 'O nome do explosivo deve ter no mínimo 2 caracteres' })

export const ObjectFormatSchema = (method: OptionalIfType) =>
  z.object({
    id: optionalIf(idSchema, method, true),
    name: optionalIf(nameSchema, method),
  })

const objectFormat = ObjectFormatSchema('update')
export type ObjectFormat = z.infer<typeof objectFormat>
