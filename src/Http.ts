/**
 * @secjs/http
 *
 * (c) João Lenon <lenon@secjs.com.br>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import fastify, {
  FastifyInstance,
  FastifyReply,
  FastifyRequest,
  PrintRoutesOptions,
} from 'fastify'

import { String } from '@secjs/utils'
import { Request } from './Context/Request'
import { Response } from './Context/Response'
import { RouteContract } from './Contracts/RouteContract'
import { HttpMethodTypes } from './Contracts/HttpMethodTypes'
import { HandlerContract } from './Contracts/Context/HandlerContract'
import { FastifyHandlerContract } from './Contracts/FastifyHandlerContract'

declare module 'fastify' {
  interface FastifyRequest {
    data: Record<string, any>
  }
}

export class Http {
  private readonly routes: RouteContract[]
  private readonly server: FastifyInstance
  private readonly middlewares: HandlerContract[]

  constructor() {
    this.routes = []
    this.middlewares = []

    this.server = fastify()
    this.server.setErrorHandler(Http.defaultErrorHandler)
  }

  private static defaultErrorHandler(
    error: any,
    request: FastifyRequest,
    reply: FastifyReply,
  ) {
    const code = error.code || error.name
    const statusCode = error.statusCode || error.status || 500

    const body = {
      code: String.toSnakeCase(code).toUpperCase(),
      path: request.url,
      method: request.method,
      status: statusCode <= 399 ? 'SUCCESS' : 'ERROR',
      statusCode: statusCode,
      error: {
        name: error.name,
        message: error.message,
        stack: error.stack,
      },
    }

    reply.status(statusCode).send(body)
  }

  private createFastifyHandler(
    handler: (ctx) => Promise<void> | void,
  ): FastifyHandlerContract {
    return async (req: FastifyRequest, res: FastifyReply, next?: any) => {
      const request = new Request(req)
      const response = new Response(res)

      if (!req.data) req.data = {}
      if (!req.query) req.query = {}
      if (!req.params) req.params = {}
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      if (!next) next = () => {}

      return handler({
        request,
        response,
        params: req.params,
        queries: req.query,
        data: req.data,
        next,
      })
    }
  }

  getServer(): FastifyInstance {
    return this.server
  }

  use(handler: HandlerContract) {
    this.middlewares.push(handler)
  }

  getRoutes(options?: PrintRoutesOptions) {
    return this.server.printRoutes(options)
  }

  async listen(
    port?: number,
    cb?: (err: Error | null, address: string) => void,
  ): Promise<void> {
    this.routes.forEach(route => this.server.route(route))

    return this.server.listen(port || 1335, cb)
  }

  async close(cb?: () => void): Promise<void> {
    return this.server.close(cb)
  }

  route(
    url: string,
    methods: HttpMethodTypes[],
    handler: HandlerContract,
    middlewares?: HandlerContract[],
  ) {
    let allMiddlewares = this.middlewares

    if (middlewares && middlewares.length) {
      allMiddlewares = allMiddlewares.concat(middlewares)
    }

    const preHandlers: FastifyHandlerContract[] = allMiddlewares.map(mid =>
      this.createFastifyHandler(mid),
    )

    methods.forEach(method => {
      this.routes.push({
        url,
        method,
        preHandler: preHandlers,
        handler: this.createFastifyHandler(handler),
      })
    })
  }

  get(url: string, handler: HandlerContract, middlewares?: HandlerContract[]) {
    this.route(url, ['GET'], handler, middlewares)
  }

  head(url: string, handler: HandlerContract, middlewares?: HandlerContract[]) {
    this.route(url, ['HEAD'], handler, middlewares)
  }

  post(url: string, handler: HandlerContract, middlewares?: HandlerContract[]) {
    this.route(url, ['POST'], handler, middlewares)
  }

  put(url: string, handler: HandlerContract, middlewares?: HandlerContract[]) {
    this.route(url, ['PUT'], handler, middlewares)
  }

  patch(
    url: string,
    handler: HandlerContract,
    middlewares?: HandlerContract[],
  ) {
    this.route(url, ['PATCH'], handler, middlewares)
  }

  delete(
    url: string,
    handler: HandlerContract,
    middlewares?: HandlerContract[],
  ) {
    this.route(url, ['DELETE'], handler, middlewares)
  }

  options(
    url: string,
    handler: HandlerContract,
    middlewares?: HandlerContract[],
  ) {
    this.route(url, ['OPTIONS'], handler, middlewares)
  }
}
