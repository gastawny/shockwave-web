import { useEffect, useState } from 'react'

// Returns true once the component has hydrated on the client.
export function useHydrated() {
  const [hydrated, setHydrated] = useState(false)

  useEffect(() => {
    setHydrated(true)
  }, [])

  return hydrated
}
