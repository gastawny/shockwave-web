import { optionalIf, OptionalIfType } from '@/infra/optionalIf'
import { z } from 'zod'

const idSchema = z.coerce.number({
  required_error: 'A Forma de Ameaça é obrigatório',
  invalid_type_error: 'A Forma de Ameaça é obrigatório',
})

const nameSchema = z
  .string()
  .min(2, { message: 'O nome da Forma de Ameaça deve ter no mínimo 2 caracteres' })

export const FormThreatSchema = (method: OptionalIfType) =>
  z.object({
    id: optionalIf(idSchema, method, true),
    name: optionalIf(nameSchema, method),
  })

const formThreat = FormThreatSchema('update')
export type FormThreat = z.infer<typeof formThreat>
