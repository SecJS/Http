/**
 * @secjs/http
 *
 * (c) João Lenon <lenon@secjs.com.br>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { FastifyReply, FastifyRequest } from 'fastify'

export interface FastifyHandlerContract {
  (
    request: FastifyRequest,
    reply: FastifyReply,
    next?: any,
  ): Promise<void> | void
}
