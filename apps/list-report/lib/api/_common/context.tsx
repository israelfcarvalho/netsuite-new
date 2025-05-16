import React from 'react'

import { ApiProvider, createApiGet, createApiPost } from '@workspace/core/api'

import { environments } from '@/lib/environments'

export const ListReportApiProvider = ({ children }: { children: React.ReactNode }) => {
  return <ApiProvider baseUrl={environments.api.baseUrl}>{children}</ApiProvider>
}

export const useListReportApiGet = createApiGet(environments.api.baseUrl)
export const useListReportApiPost = createApiPost(environments.api.baseUrl)
