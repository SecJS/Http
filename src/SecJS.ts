import constants from './constants'

import { Route } from '@secjs/utils/src/Classes/Route'
import { SecRequest } from './Context/Request/SecRequest'
import { SecResponse } from './Context/Response/SecResponse'
import { InternalRouteContract, SecHandlerContract } from '@secjs/contracts'
import { createServer, IncomingMessage, Server, ServerResponse } from 'http'

export class SecJS {
  private nodeServer: Server
  private routeUtils = new Route()
  private routes: InternalRouteContract[] = []

  private async getBody(request: IncomingMessage): Promise<any> {
    const buffers = []

    for await (const chunk of request) {
      buffers.push(chunk)
    }

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
    this.nodeServer = createServer(
      async (request: IncomingMessage, response: ServerResponse) => {
        const { url, method } = request

        response.writeHead(200, {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        })

        const route = this.getRoute(url, method)

        return route.handler({
          next: () => console.log('next'),
          request: new SecRequest(this.getBody(request), route, request),
          response: new SecResponse(response),
        })
      },
    )

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
