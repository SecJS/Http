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
import { FastifyReply, FastifyRequest } from 'fastify'
import { HandlerContract } from '../Contracts/Context/HandlerContract'
import { ErrorHandlerContract } from '../Contracts/Context/Error/ErrorHandlerContract'
import { HandleHandlerContract } from '../Contracts/Context/Middlewares/Handle/HandleHandlerContract'
import { InterceptHandlerContract } from '../Contracts/Context/Middlewares/Intercept/InterceptHandlerContract'

declare module 'fastify' {
  interface FastifyRequest {
    data: Record<string, any>
  }
}

export class FastifyHandler {
  static createOnSendHandler(handler: InterceptHandlerContract) {
    return (req, res, payload, done) => {
      const request = new Request(req)
      const response = new Response(res)

      if (!req.data) req.data = {}
      if (!req.query) req.query = {}
      if (!req.params) req.params = {}

      const body = JSON.parse(payload)

      return handler({
        request,
        response,
        body,
        params: req.params as Record<string, string>,
        queries: req.query as Record<string, string>,
        data: req.data,
        next: () => done(null, JSON.stringify(body)),
      })
    }
  }

  static createDoneHandler(handler: HandleHandlerContract) {
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

  static createErrorHandler(handler: ErrorHandlerContract) {
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
      })
    }
  }
}
