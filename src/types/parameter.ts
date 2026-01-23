import { optionalIf, OptionalIfType } from '@/infra/optionalIf'
import { z } from 'zod'

const idSchema = z.coerce.number()

const stringSchema = z.string()

export const ParameterSchema = (method: OptionalIfType) =>
  z.object({
    id: optionalIf(idSchema, method, true),
    symbol: optionalIf(stringSchema, method),
    name: optionalIf(stringSchema, method),
    unit: optionalIf(stringSchema, method),
    value_type: optionalIf(z.enum(['STRING', 'NUMBER', 'TEXT']), method),
  })
const parameter = ParameterSchema('update')
export type Parameter = z.infer<typeof parameter>
