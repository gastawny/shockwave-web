import { TooltipProvider } from '@/components/ui/tooltip'
import { LoadingProvider } from './loading-provider'
import { ReactQueryProvider } from './react-query-provider'
import { ThemeProvider } from './theme-provider'
import { UserProvider } from './user-provider'

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ReactQueryProvider>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
        <TooltipProvider>
          <LoadingProvider>
            <UserProvider>{children}</UserProvider>
          </LoadingProvider>
        </TooltipProvider>
      </ThemeProvider>
    </ReactQueryProvider>
  )
}
