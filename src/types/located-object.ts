import { z } from 'zod'
import { ObjectFormatParameterValueSchema } from './object-format-parameter-value'
import { ExplosiveSchema } from './explosive'
import { GroundSchema } from './ground'
import { optionalIf, OptionalIfType } from '@/infra/optionalIf'
import { ObjectFormatSchema } from './object-format'

const idSchema = z.coerce.number({
  required_error: 'O Objeto Localizado é obrigatório',
  invalid_type_error: 'O Objeto Localizado é obrigatório',
})

const nameSchema = z
  .string({
    required_error: 'Nome é obrigatório',
  })
  .min(1, { message: 'Nome é obrigatório' })

export const LocatedObjectSchema = (method: OptionalIfType) =>
  z.object({
    id: optionalIf(idSchema, method, true),
    name: optionalIf(nameSchema, method),
    latitude: optionalIf(
      z.number({
        required_error: 'Latitude é obrigatória',
        invalid_type_error: 'Latitude deve ser um número',
      }),
      method
    ),
    longitude: optionalIf(
      z.number({
        required_error: 'Longitude é obrigatória',
        invalid_type_error: 'Longitude deve ser um número',
      }),
      method
    ),
    explosive: optionalIf(ExplosiveSchema('update_higher'), method),
    ground: optionalIf(GroundSchema('update_higher'), method),
    objectFormat: optionalIf(ObjectFormatSchema('update_higher'), method),
    objectFormatParameterValues: optionalIf(
      z.array(ObjectFormatParameterValueSchema('update_higher'), {
        required_error: 'Valores dos parâmetros são obrigatórios',
        message: 'Valores dos parâmetros são obrigatórios',
      }),
      method
    ),
  })

const locatedObject = LocatedObjectSchema('update')
export type LocatedObject = z.infer<typeof locatedObject>
