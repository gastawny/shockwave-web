import { optionalIf, OptionalIfType } from '@/infra/optionalIf'
import { Roles } from '@/utils/constants/roles'
import { z } from 'zod'

export const UserSchema = (method: OptionalIfType) =>
  z.object({
    id: optionalIf(z.coerce.number(), method, true),
    email: optionalIf(
      z
        .string({
          required_error: 'O email é obrigatório',
        })
        .email({
          message: 'Email inválido',
        }),
      method
    ),
    firstName: optionalIf(
      z
        .string({
          required_error: 'O nome é obrigatório',
        })
        .min(1, {
          message: 'O nome deve ter ao menos 1 caractere',
        }),
      method
    ),
    lastName: optionalIf(
      z
        .string({
          required_error: 'O sobrenome é obrigatório',
        })
        .min(1, {
          message: 'O sobrenome deve ter ao menos 1 caractere',
        }),
      method
    ),
    roles: z.array(z.enum(Roles)).optional(),
  })

const user = UserSchema('update')
export type User = z.infer<typeof user>
