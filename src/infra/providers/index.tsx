import { LoadingProvider } from './loading-provider'
import { ReactQueryProvider } from './react-query-provider'
import { ThemeProvider } from './theme-provider'

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ReactQueryProvider>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
        <LoadingProvider>{children}</LoadingProvider>
      </ThemeProvider>
    </ReactQueryProvider>
  )
}
