/**
 * @secjs/http
 *
 * (c) João Lenon <lenon@secjs.com.br>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

/* eslint-disable @typescript-eslint/no-empty-function */

import { Request } from '../Context/Request'
import { Response } from '../Context/Response'
import { HandlerContract } from '../Contracts/Context/HandlerContract'
import { FastifyReply, FastifyRequest } from 'fastify'

declare module 'fastify' {
  interface FastifyRequest {
    data: Record<string, any>
  }
}

export class FastifyHandler {
  static createPreHandler(handler: HandlerContract) {
    return (req, res, done) => {
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
    }
  }

  static createErrorHandler(handler: HandlerContract) {
    return (error: any, req: FastifyRequest, res: FastifyReply) => {
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
        next: () => {},
        error,
      })
    }
  }

  static createRequestHandler(handler: HandlerContract) {
    return async (req: FastifyRequest, res: FastifyReply) => {
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
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        next: () => {},
      })
    }
  }
}
