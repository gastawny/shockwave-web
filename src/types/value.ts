import { optionalIf, OptionalIfType } from '@/infra/optionalIf'
import { z } from 'zod'

const idSchema = z.coerce.number().optional()

const valueSchema = z.preprocess(
  (val) => {
    if (val === '') return undefined
    return val
  },
  z.coerce.number({
    required_error: 'Campo obrigatório',
    invalid_type_error: 'Campo obrigatório',
  })
)

export const ValueSchema = (method: OptionalIfType) =>
  z.object({
    id: optionalIf(idSchema, method),
    value: optionalIf(valueSchema, method),
  })

const value = ValueSchema('update')
export type Value = z.infer<typeof value>
