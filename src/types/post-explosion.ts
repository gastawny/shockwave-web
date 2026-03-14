import { z } from 'zod'
import { optionalIf, OptionalIfType } from '@/infra/optionalIf'
import { FileSchema } from './file'

export const PostExplosionSchema = (method: OptionalIfType) =>
  z.object({
    id: optionalIf(
      z.coerce.number({
        required_error: 'O Objeto Localizado é obrigatório',
        invalid_type_error: 'O Objeto Localizado é obrigatório',
      }),
      method,
      true
    ),
    name: optionalIf(
      z
        .string({
          required_error: 'Nome é obrigatório',
        })
        .min(1, { message: 'Nome é obrigatório' }),
      method
    ),
    street: optionalIf(
      z.string({ required_error: 'Rua é obrigatória' }).min(1, { message: 'Rua é obrigatória' }),
      method
    ),
    number: optionalIf(
      z
        .string({ required_error: 'Número é obrigatório' })
        .min(1, { message: 'Número é obrigatório' }),
      method
    ),
    city: optionalIf(
      z
        .string({ required_error: 'Cidade é obrigatória' })
        .min(1, { message: 'Cidade é obrigatória' }),
      method
    ),
    cep: optionalIf(
      z.string({ required_error: 'CEP é obrigatório' }).min(1, { message: 'CEP é obrigatório' }),
      method
    ),
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
    description: optionalIf(
      z
        .string({ required_error: 'Este campo é obrigatório' })
        .min(1, { message: 'Este campo é obrigatório' }),
      method
    ),
    files: FileSchema.array().optional(),
    vestigeDistance: optionalIf(
      z.coerce.number({
        required_error: 'A distância de vestígio é obrigatória',
        invalid_type_error: 'A distância de vestígio deve ser um número',
      }),
      method
    ),
  })

const postExplosion = PostExplosionSchema('update')
export type PostExplosion = z.infer<typeof postExplosion>
