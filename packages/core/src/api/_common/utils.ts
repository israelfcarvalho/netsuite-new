import { QueryParams } from './types'

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
