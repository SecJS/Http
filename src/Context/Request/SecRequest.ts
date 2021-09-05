import { Route } from '@secjs/utils/src/Classes/Route'
import { IncomingMessage } from 'http'
import { SecRequestContract, InternalRouteContract } from '@secjs/contracts'

export class SecRequest implements SecRequestContract {
  private _ip = ''
  private _body = ''
  private _method = ''
  private _params = {}
  private _queries = {}
  private _headers = {}
  private _fullUrl = ''
  private _baseUrl = ''
  private _originalUrl = ''
  private routeUtils = new Route()

  constructor(
    body: any,
    route: InternalRouteContract,
    request: IncomingMessage,
  ) {
    this._ip = request.socket.remoteAddress
    this._body = body ? JSON.parse(body) : {}
    this._method = request.method
    this._params = this.routeUtils.getParamsValue(route.path, request.url) || {}
    this._queries = this.routeUtils.getQueryParamsValue(request.url) || {}
    this._headers = request.headers
    this._fullUrl = this.routeUtils.removeQueryParams(request.url)
    this._baseUrl = route.path
    this._originalUrl = request.url
  }

  payload(payload: string, defaultValue?: string): any {
    return this.body[payload] || defaultValue
  }

  param(param: string, defaultValue?: string): string {
    return this.params[param] || defaultValue
  }

  query(query: string, defaultValue?: string): string {
    return this.queries[query] || defaultValue
  }

  header(header: string, defaultValue?: string): string {
    return this._headers[header] || defaultValue
  }

  get ip(): string {
    return this._ip
  }

  get body(): any {
    return this._body
  }

  get params(): any {
    return this._params
  }

  get queries(): any {
    return this._queries
  }

  get method(): string {
    return this._method
  }

  get fullUrl(): string {
    return this._fullUrl
  }

  get baseUrl(): string {
    return this._baseUrl
  }

  get originalUrl(): string {
    return this._originalUrl
  }
}
