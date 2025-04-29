export type ApiBody = Record<string, any>

export interface IUseApiPost<TData, TBody = ApiBody, TError = Error> {
  data?: TData
  error: TError | null
  isPending: boolean
  post(
    body: TBody,
    options?: {
      onSuccess?: () => void
      onError?: (error: TError) => void
    }
  ): void
}
