import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import React, { useState } from 'react'

import { ApiContext, ProviderProps } from '../_common/types'

const contexts: Map<string, React.Context<ApiContext | null>> = new Map([
  ['default', React.createContext<ApiContext | null>(null)],
])

const getApiContext = (baseUrl?: string) => {
  let context = contexts.get(baseUrl ?? 'default')

  if (!context) {
    context = React.createContext<ApiContext | null>(null)
    contexts.set(baseUrl ?? 'default', context)
  }

  return context
}

export function ApiProvider({ children, baseUrl }: ProviderProps) {
  const context = getApiContext(baseUrl)

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

  console.log('ContextProvider', context.Provider)

  return (
    <context.Provider value={{ baseUrl }}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </context.Provider>
  )
}

export function useApi(hookName: string, baseUrl?: string) {
  const context = React.useContext(getApiContext(baseUrl))
  if (context === null) {
    throw new Error(`${hookName} must be used within a ApiProvider`)
  }

  return context
}
