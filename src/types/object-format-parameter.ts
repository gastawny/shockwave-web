import { z } from 'zod'
import { ParameterSchema } from './parameter'
import { ObjectFormatSchema } from './object-format'
import { optionalIf, OptionalIfType } from '@/infra/optionalIf'

const idSchema = z.coerce.number()

export const ObjectFormatParameterSchema = (method: OptionalIfType) =>
  z.object({
    id: optionalIf(idSchema, method, true),
    objectFormat: ObjectFormatSchema('update_higher'),
    parameter: ParameterSchema('update_higher'),
  })

const objectFormatParameter = ObjectFormatParameterSchema('update')
export type ObjectFormatParameter = z.infer<typeof objectFormatParameter>
