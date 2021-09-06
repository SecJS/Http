import constants from './constants'

import { Route } from '@secjs/utils/src/Classes/Route'
import { SecRequest } from './Context/Request/SecRequest'
import { SecResponse } from './Context/Response/SecResponse'
import { createServer, IncomingMessage, Server } from 'http'
import { InternalRouteContract, SecHandlerContract } from '@secjs/contracts'

export class SecJS {
  private nodeServer: Server
  private routeUtils = new Route()
  private routes: InternalRouteContract[] = []

  private async getBody(request: IncomingMessage): Promise<any> {
    const buffers = []

    for await (const chunk of request) {
      buffers.push(chunk)
    }

    if (!buffers.length) return {}

    return JSON.parse(Buffer.concat(buffers).toString())
  }

  private getRoute(url: string, method: string) {
    return (
      this.routes.find(
        route =>
          route.matcher.test(this.routeUtils.removeQueryParams(url)) &&
          route.method === method,
      ) || constants.DEFAULT_ROUTE
    )
  }

  private createRouteHandler(
    path: string,
    method: string,
    secHandler: SecHandlerContract,
  ): void {
    this.routes.push({
      path,
      method: method.toUpperCase(),
      handler: secHandler,
      params: this.routeUtils.getParamsName(path),
      matcher: this.routeUtils.createMatcher(path),
    })
  }

  listen(port?: number, cb?: () => void): void {
    this.nodeServer = createServer(async (request: any, response: any) => {
      const { url, method } = request

      const route = this.getRoute(url, method)

      request.route = route
      request.body = await this.getBody(request)

      return route.handler({
        next: () => console.log('next'),
        request: new SecRequest(request),
        response: new SecResponse(response),
      })
    })

    this.nodeServer.listen(port || constants.PORT, cb)
  }

  close(cb?: (err?: Error) => void): void {
    this.nodeServer.close(cb)
  }

  get(route: string, secHandler: SecHandlerContract): void {
    this.createRouteHandler(route, this.get.name, secHandler)
  }

  post(route: string, secHandler: SecHandlerContract): void {
    this.createRouteHandler(route, this.post.name, secHandler)
  }

  put(route: string, secHandler: SecHandlerContract): void {
    this.createRouteHandler(route, this.put.name, secHandler)
  }

  delete(route: string, secHandler: SecHandlerContract): void {
    this.createRouteHandler(route, this.delete.name, secHandler)
  }
}
