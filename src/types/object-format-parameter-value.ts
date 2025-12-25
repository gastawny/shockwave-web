import { OptionalIfType } from '@/infra/optionalIf'
import { z } from 'zod'
import { ValueSchema } from './value'
import { ObjectFormatParameterSchema } from './object-format-parameter'

const idSchema = z.number().optional()

export const ObjectFormatParameterValueSchema = (method: OptionalIfType) =>
  z.object({
    id: idSchema,
    value: ValueSchema('update_higher'),
    objectFormatParameter: ObjectFormatParameterSchema('update_higher'),
  })

const objectFormatParameterValue = ObjectFormatParameterValueSchema('update')
export type ObjectFormatParameterValue = z.infer<typeof objectFormatParameterValue>
