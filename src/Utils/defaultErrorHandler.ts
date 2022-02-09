/**
 * @secjs/http
 *
 * (c) João Lenon <lenon@secjs.com.br>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { String } from '@secjs/utils'
import { ContextContract } from '../Contracts/Context/ContextContract'

export function defaultErrorHandler({
  error,
  request,
  response,
}: ContextContract) {
  const code = error.code || error.name
  const statusCode = error.statusCode || error.status || 500

  const body = {
    code: String.toSnakeCase(code).toUpperCase(),
    path: request.baseUrl,
    method: request.method,
    status: statusCode <= 399 ? 'SUCCESS' : 'ERROR',
    statusCode: statusCode,
    error: {
      name: error.name,
      message: error.message,
      stack: error.stack,
    },
  }

  response.status(statusCode).send(body)
}
