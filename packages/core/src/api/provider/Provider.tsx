import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import React, { useState } from 'react'

import { ApiContext, ProviderProps } from '../_common/types'

const apiContext = React.createContext<ApiContext | null>(null)

export function ApiProvider({ children, baseUrl }: ProviderProps) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 10000,
            retry: false,
          },
        },
      })
  )

  return (
    <apiContext.Provider value={{ baseUrl }}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </apiContext.Provider>
  )
}

export function useApi(hookName: string) {
  const context = React.useContext(apiContext)
  if (context === null) {
    throw new Error(`${hookName} must be used within a ApiProvider`)
  }

  return context
}
