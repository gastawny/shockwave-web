import { z } from 'zod'
import { optionalIf, OptionalIfType } from '@/infra/optionalIf'
import { FormThreatSchema } from './form-threat'
import { LocatedObjectSchema } from './located-object'
import { FileSchema } from './file'

const idSchema = z.number()
const stringSchema = z.string({ required_error: 'Este campo é obrigatório' })

export const BombThreatSchema = (method: OptionalIfType) => {
  const BaseSchema = z.object({
    id: optionalIf(idSchema, method, true),
    formThreat: FormThreatSchema('update_higher'),
    name: optionalIf(stringSchema.min(1, { message: 'A identificação é obrigatória' }), method),
    formThreatDescription: optionalIf(
      stringSchema.min(1, { message: 'Este campo é obrigatório' }),
      method
    ),
    objectType: z.enum(['located_object', 'not_located']),
    files: FileSchema.array().optional(),
  })

  const WithLocatedObjectSchema = BaseSchema.extend({
    objectType: z.literal('located_object'),
    locatedObject: LocatedObjectSchema('update_higher'),
    objectNotFoundDescription: z.null(),
  })

  const WithoutLocatedObjectSchema = BaseSchema.extend({
    objectType: z.literal('not_located'),
    locatedObject: z.null(),
    objectNotFoundDescription: stringSchema.min(1, { message: 'A descrição é obrigatória' }),
  })

  return z.discriminatedUnion('objectType', [WithLocatedObjectSchema, WithoutLocatedObjectSchema])
}

const bombThreat = BombThreatSchema('update')
export type BombThreat = z.infer<typeof bombThreat>
