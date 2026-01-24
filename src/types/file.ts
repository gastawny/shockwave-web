import { z } from 'zod'

export const FileSchema = z.object({
  id: z.coerce.number(),
  name: z.string(),
  path: z.string().or(z.null()),
  data: z.string(),
})

export type FileType = z.infer<typeof FileSchema>
