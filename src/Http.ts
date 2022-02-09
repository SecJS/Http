/**
 * @secjs/http
 *
 * (c) João Lenon <lenon@secjs.com.br>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import fastify, { FastifyInstance, PrintRoutesOptions } from 'fastify'

import { FastifyHandler } from './Utils/FastifyHandler'
import { HttpMethodTypes } from './Contracts/HttpMethodTypes'
import { defaultErrorHandler } from './Utils/defaultErrorHandler'
import { HandlerContract } from './Contracts/Context/HandlerContract'

export class Http {
  private readonly server: FastifyInstance

  constructor() {
    this.server = fastify()
    this.setErrorHandler(defaultErrorHandler)
  }

  setErrorHandler(handler: HandlerContract) {
    const fastifyErrorHandler = FastifyHandler.createErrorHandler(handler)

    this.server.setErrorHandler(fastifyErrorHandler)
  }

  getServer(): FastifyInstance {
    return this.server
  }

  getRoutes(options?: PrintRoutesOptions) {
    return this.server.printRoutes(options)
  }

  use(handler: HandlerContract) {
    this.server.addHook('preHandler', FastifyHandler.createPreHandler(handler))
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
      handler: FastifyHandler.createRequestHandler(handler),
      preHandler:
        middlewares &&
        middlewares.map(mid => FastifyHandler.createPreHandler(mid)),
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
