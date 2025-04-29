export enum NetSuiteErrorCode {
  SESSION_TIMED_OUT = 'SESSION_TIMED_OUT',
}

export interface RawNetsuiteError {
  error: INetSuiteError
}

export interface INetSuiteError {
  code: string
  message: string
}

export class NetSuiteError implements INetSuiteError {
  code!: string
  message!: string

  constructor(error: string | object) {
    const { code, message } = this.parse(error)

    this.code = code
    this.message = message
  }

  private parse(error: string | object): INetSuiteError {
    switch (typeof error) {
      case 'string': {
        return this.stringToNetsuiteError(error)
      }

      case 'object': {
        if (this.isRawNetSuiteError(error)) {
          return this.rawNetsuiteErrorToNetsuiteError(error)
        } else {
          return {
            code: 'unknown',
            message: JSON.stringify(error),
          }
        }
      }

      default: {
        return {
          code: 'unknown',
          message: 'Something went wrong. Contact Support.',
        }
      }
    }
  }

  private isRawNetSuiteError(error: object): error is RawNetsuiteError {
    if ('error' in error) {
      if (typeof error.error === 'object' && error.error !== null) {
        if ('message' in error.error && 'code' in error.error) {
          return true
        }
      }
    }
    return false
  }

  private rawNetsuiteErrorToNetsuiteError(error: RawNetsuiteError): INetSuiteError {
    return error.error
  }

  private stringToNetsuiteError(error: string): INetSuiteError {
    try {
      const data: unknown = JSON.parse(error.replaceAll('\n', '<br/>').replaceAll("\\'", "'"))
      if (typeof data === 'object' && data !== null) {
        if (this.isRawNetSuiteError(data)) {
          return this.rawNetsuiteErrorToNetsuiteError(data)
        }
      }

      return {
        code: 'unknown',
        message: error,
      }
    } catch (e) {
      console.error(e)
      return {
        code: 'unknown',
        message: error,
      }
    }
  }
}
