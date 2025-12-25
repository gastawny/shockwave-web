import { z } from 'zod'

const OptionalI = ['update', 'create', 'update_higher'] as const
export type OptionalIfType = (typeof OptionalI)[number]

export const optionalIf = <T extends z.ZodTypeAny>(
  schema: T,
  opt: OptionalIfType,
  isId = false
) => {
  switch (opt) {
    case 'create': {
      if (isId) {
        return schema.optional()
      }
      return schema
    }
    case 'update': {
      return schema
    }
    case 'update_higher': {
      if (isId) {
        return schema
      }
      return schema.optional().or(z.null())
    }
  }
}
