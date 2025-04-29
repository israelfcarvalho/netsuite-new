import { NetSuiteError } from './netsuite'

export function errorMiddleware(res: any) {
  throw new NetSuiteError(res)

  return res
}
