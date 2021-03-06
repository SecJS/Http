/**
 * @secjs/http
 *
 * (c) João Lenon <lenon@secjs.com.br>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { FastifyError, FastifyReply, FastifyRequest } from 'fastify'

export interface FastifyErrorHandlerContract {
  (
    error: FastifyError,
    request: FastifyRequest,
    reply: FastifyReply,
  ): Promise<void> | void
}
