export interface IUseApiGet<TData, TError = Error> {
  data?: TData
  error: TError | null
  isLoading: boolean
  refetch: () => void
}
