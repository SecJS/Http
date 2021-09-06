import { ServerResponse } from 'http'
import { SecResponseContract } from '@secjs/contracts'

export class SecResponse implements SecResponseContract {
  private vanillaResponse: ServerResponse

  constructor(response: ServerResponse) {
    this.secResponseBuilder(response)
  }

  private secResponseBuilder(response: ServerResponse): void {
    this.vanillaResponse = response
  }

  end(): void {
    this.vanillaResponse.end()
  }

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  send(data?: any): void {
    this.vanillaResponse.end(data)
  }

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  json(data?: any): void {
    this.vanillaResponse.setHeader('Accept', 'application/json')
    this.vanillaResponse.setHeader('Content-Type', 'application/json')

    this.vanillaResponse.end(JSON.stringify(data))
  }

  status(code: number): this {
    this.vanillaResponse.statusCode = code

    return this
  }

  header(header: string, value: any): this {
    this.vanillaResponse.setHeader(header, value)

    return this
  }

  safeHeader(header: string, value: any): this {
    this.vanillaResponse.setHeader(header, value)

    return this
  }

  removeHeader(header: string): this {
    this.vanillaResponse.removeHeader(header)

    return this
  }
}
