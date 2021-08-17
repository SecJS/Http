import constants from './constants'

import { getParams } from './getParams'
import { createMatcher } from './createMatcher'

import { RouteContract } from './Contracts/RouteContract'
import { HandlerContract } from './Contracts/HandlerContract'
import { createServer, IncomingMessage, Server, ServerResponse } from 'http'

export class Sec {
  private nodeServer: Server
  private routes: RouteContract[] = [constants.DEFAULT_ROUTE]

  private createRouteHandler(
    path: string,
    method: string,
    secHandler: HandlerContract,
  ): void {
    this.routes.push({
      path,
      method: method.toUpperCase(),
      handler: secHandler,
      params: getParams(path),
      matcher: createMatcher(path),
    })
  }

  constructor() {
    this.nodeServer = createServer(
      (request: IncomingMessage, response: ServerResponse) => {
        const { url, method } = request

        response.writeHead(
          constants.DEFAULT_HTTP_CODE,
          constants.DEFAULT_HEADERS,
        )

        const chosen =
          this.routes.find(
            route => route.matcher.test(url) && route.method === method,
          ) || this.routes[0]

        return chosen.handler(request, response)
      },
    )
  }

  // eslint-disable-next-line @typescript-eslint/ban-types
  listen(port?: number, cb?: () => void): void {
    this.nodeServer.listen(port || constants.PORT, cb)
  }

  close(cb?: (err?: Error) => void): void {
    this.nodeServer.close(cb)
  }

  get(route: string, secHandler: HandlerContract): void {
    this.createRouteHandler(route, this.get.name, secHandler)
  }

  post(route: string, secHandler: HandlerContract): void {
    this.createRouteHandler(route, this.post.name, secHandler)
  }

  put(route: string, secHandler: HandlerContract): void {
    this.createRouteHandler(route, this.put.name, secHandler)
  }

  delete(route: string, secHandler: HandlerContract): void {
    this.createRouteHandler(route, this.delete.name, secHandler)
  }
}
