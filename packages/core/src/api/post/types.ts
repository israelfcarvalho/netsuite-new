export type ApiBody = Record<string, any>

export interface IUseApiPost<TData, TBody = ApiBody, TError = Error> {
  data?: TData
  error: TError | null
  isPending: boolean
  post(body: TBody): void
}
