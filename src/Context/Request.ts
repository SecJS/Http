/**
 * @secjs/http
 *
 * (c) João Lenon <lenon@secjs.com.br>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { FastifyRequest } from 'fastify'
import { RequestContract } from '../Contracts/Context/RequestContract'

export class Request implements RequestContract {
  private request: FastifyRequest

  constructor(request: FastifyRequest) {
    this.request = request
  }

  get ip(): string {
    return this.request.ip
  }

  get method(): string {
    return this.request.method
  }

  get fullUrl(): string {
    return this.request.url
  }

  get baseUrl(): string {
    return this.request.url.split('?')[0]
  }

  get body(): Record<string, any> {
    return this.request.body
  }

  get params(): Record<string, string> {
    return this.request.params as Record<string, string>
  }

  get queries(): Record<string, string> {
    return this.request.query as Record<string, string>
  }

  get headers(): Record<string, string> {
    return this.request.headers as Record<string, string>
  }

  param(param: string, defaultValue?: string) {
    return this.request.params[param] || defaultValue
  }

  query(query: string, defaultValue?: string) {
    return this.request.query[query] || defaultValue
  }

  header(header: string, defaultValue?: string) {
    return this.request.headers[header] || defaultValue
  }

  payload(payload: string, defaultValue?: string) {
    return this.request.body[payload] || defaultValue
  }
}
