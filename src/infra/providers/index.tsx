import { LoadingProvider } from './loading-provider'
import { ReactQueryProvider } from './react-query-provider'

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ReactQueryProvider>
      <LoadingProvider>{children}</LoadingProvider>
    </ReactQueryProvider>
  )
}
