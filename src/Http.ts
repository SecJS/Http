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

import { Request } from './Context/Request'
import { Response } from './Context/Response'
import { RouteContract } from './Contracts/RouteContract'
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
  private readonly middlewares: FastifyHandlerContract[]

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
      code: code
        .replace(/([A-Z])/g, '_$1')
        .toUpperCase()
        .replace('_', ''),
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

  private createFastifyHandler(handler: (ctx) => Promise<void> | void) {
    return async (req: FastifyRequest, res: FastifyReply, next?: any) => {
      const request = new Request(req)
      const response = new Response(res)

      if (!req.data) req.data = {}

      return handler({ request, response, next, data: req.data })
    }
  }

  getServer(): FastifyInstance {
    return this.server
  }

  use(handler: HandlerContract) {
    this.middlewares.push(this.createFastifyHandler(handler))
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

  get(url: string, handler: HandlerContract) {
    this.routes.push({
      url,
      method: 'GET',
      preHandler: this.middlewares,
      handler: this.createFastifyHandler(handler),
    })
  }

  head(url: string, handler: HandlerContract) {
    this.routes.push({
      url,
      method: 'HEAD',
      preHandler: this.middlewares,
      handler: this.createFastifyHandler(handler),
    })
  }

  post(url: string, handler: HandlerContract) {
    this.routes.push({
      url,
      method: 'POST',
      preHandler: this.middlewares,
      handler: this.createFastifyHandler(handler),
    })
  }

  put(url: string, handler: HandlerContract) {
    this.routes.push({
      url,
      method: 'PUT',
      preHandler: this.middlewares,
      handler: this.createFastifyHandler(handler),
    })
  }

  patch(url: string, handler: HandlerContract) {
    this.routes.push({
      url,
      method: 'PATCH',
      preHandler: this.middlewares,
      handler: this.createFastifyHandler(handler),
    })
  }

  delete(url: string, handler: HandlerContract) {
    this.routes.push({
      url,
      method: 'DELETE',
      preHandler: this.middlewares,
      handler: this.createFastifyHandler(handler),
    })
  }

  options(url: string, handler: HandlerContract) {
    this.routes.push({
      url,
      method: 'OPTIONS',
      preHandler: this.middlewares,
      handler: this.createFastifyHandler(handler),
    })
  }
}
