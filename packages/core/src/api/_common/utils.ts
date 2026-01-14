import { HTTP_STATUS_CODES } from './constants'
import { NetSuiteError, RawNetsuiteError } from './error/netsuite'
import { HeadersMap, QueryParams } from './types'

export function mountUrl(baseUrl: string, route: string, params: QueryParams = {}) {
  let hasDomain = false

  try {
    const _url = new URL(baseUrl)
    hasDomain = !!_url.hostname
  } catch (e) {
    if (typeof e === 'object' && e !== null && 'toString' in e) {
      localStorage.setItem('mount-url-error_error', e.toString())
    }
    localStorage.setItem('mount-url-error_url', baseUrl)
  }

  const newUrl = trimSlashes(baseUrl)
  const newRoute = trimSlashes(route)
  const stringParams = queryParamsToString(params)

  const url = newRoute ? trimSlashes(`${newUrl}/${newRoute}${stringParams}`) : trimSlashes(`${newUrl}${stringParams}`)

  return hasDomain ? url : `/${url}`
}

export function trimSlashes(value: string): string {
  const newValueArray = value.trim().split('')

  if (!newValueArray.length) {
    return newValueArray.join('')
  }

  const firstIndex = 0
  const lastIndex = newValueArray.length - 1
  const slash = '/'

  const newValue = newValueArray.reduce((result, currentValue, currentIndex) => {
    if ([firstIndex, lastIndex].includes(currentIndex) && currentValue === slash) {
      return result
    }

    return result.concat(currentValue)
  }, '')

  return newValue != value ? trimSlashes(newValue) : value
}

export function queryParamsToString(params: QueryParams) {
  const queryParams = new URLSearchParams()

  Object.entries(params).forEach(([Key, value]) => {
    if (value != undefined) {
      queryParams.append(Key, value.toString())
    }
  })

  return queryParams.size > 0 ? `?${queryParams.toString()}` : ''
}

export const headersMap: HeadersMap = {
  'Content-Type': {
    name: 'Content-Type',
    values: {
      'application/json': 'application/json',
      'text/html': 'text/html',
    },
  },
}

export function responseMiddleware<TData>(res: Response) {
  return new Promise<TData>((resolve, reject) => {
    if (res.ok) {
      if (res.status === HTTP_STATUS_CODES.CREATED) {
        const contentLength = res.headers.get('content-length')
        if (contentLength && parseInt(contentLength) === 0) {
          resolve(undefined as TData)
          return
        }
      }

      res
        .json()
        .then<TData>((res) => {
          resolve(res)

          return res
        })
        .catch((error) => {
          reject(new NetSuiteError(error.message))
        })
    } else {
      const headerContentTypes = res.headers.get(headersMap['Content-Type'].name) ?? ''
      const contentTypeAppJson = headersMap['Content-Type'].values['application/json']
      const contentTypeIsApplicationJson = headerContentTypes.includes(contentTypeAppJson)

      if (contentTypeIsApplicationJson) {
        res.text().then((res) => {
          // eslint-disable-next-line no-useless-escape
          reject(JSON.parse(res.replaceAll("\\'", '').replaceAll('\n', '<br/>').replaceAll("\'", '')))
        })
      } else {
        const error: RawNetsuiteError = {
          error: {
            code: 'unknow',
            message: `[${res.status}] uknown reason. Contact Support`,
          },
        }

        reject(error)
      }
    }
  })
}
