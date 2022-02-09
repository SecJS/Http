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
import { HttpMethodTypes } from './Contracts/HttpMethodTypes'
import { HandlerContract } from './Contracts/Context/HandlerContract'
import { FastifyHandlerContract } from './Contracts/FastifyHandlerContract'

declare module 'fastify' {
  interface FastifyRequest {
    data: Record<string, any>
  }
}

export class Http {
  private readonly server: FastifyInstance

  constructor() {
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
    return async (req: FastifyRequest, res: FastifyReply) => {
      const request = new Request(req)
      const response = new Response(res)

      if (!req.data) req.data = {}
      if (!req.query) req.query = {}
      if (!req.params) req.params = {}

      return handler({
        request,
        response,
        params: req.params,
        queries: req.query,
        data: req.data,
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        next: () => {},
      })
    }
  }

  getServer(): FastifyInstance {
    return this.server
  }

  getRoutes(options?: PrintRoutesOptions) {
    return this.server.printRoutes(options)
  }

  use(handler: HandlerContract) {
    this.server.addHook('preHandler', (req, res, done) => {
      const request = new Request(req)
      const response = new Response(res)

      if (!req.data) req.data = {}
      if (!req.query) req.query = {}
      if (!req.params) req.params = {}

      return handler({
        request,
        response,
        params: req.params as Record<string, string>,
        queries: req.query as Record<string, string>,
        data: req.data,
        next: done,
      })
    })
  }

  listen(
    port?: number,
    cb?: (err: Error | null, address: string) => void,
  ): void | string {
    return this.server.listen(port || 1335, cb)
  }

  close(cb?: () => void): void {
    return this.server.close(cb)
  }

  route(
    url: string,
    methods: HttpMethodTypes[],
    handler: HandlerContract,
    middlewares?: HandlerContract[],
  ) {
    this.server.route({
      url,
      method: methods,
      handler: this.createFastifyHandler(handler),
      preHandler:
        middlewares && middlewares.map(mid => this.createFastifyHandler(mid)),
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
