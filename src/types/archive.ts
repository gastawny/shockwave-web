import { optionalIf, OptionalIfType } from '@/infra/optionalIf'
import { z } from 'zod'

export const ArchiveSchema = (method: OptionalIfType) =>
  z.object({
    id: optionalIf(z.coerce.number(), method, true),
    data: optionalIf(z.string(), method),
  })

const Archive = ArchiveSchema('update')
export type Archive = z.infer<typeof Archive>
