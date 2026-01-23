import { z } from 'zod'
import { UserSchema } from './user'

export const TokenSchema = z.object({
  user: UserSchema('create'),
  authenticated: z.boolean(),
  created: z
    .string()
    .datetime({ offset: true })
    .transform((val) => new Date(val)),
  expiration: z
    .string()
    .datetime({ offset: true })
    .transform((val) => new Date(val)),
  accessToken: z.string(),
  refreshToken: z.string(),
})

const token = TokenSchema
export type Token = z.infer<typeof token>
