'use client'

import { toast } from './ui/use-toast'

export function debug(message: any) {
  toast({
    description: (
      <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
        <code className="text-white">{JSON.stringify(message, null, 2)}</code>
      </pre>
    ),
  })
}
