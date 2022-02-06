/**
 * @secjs/http
 *
 * (c) João Lenon <lenon@secjs.com.br>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { NextContract } from './NextContract'
import { RequestContract } from './RequestContract'
import { ResponseContract } from './ResponseContract'

export interface ContextContract {
  request: RequestContract
  response: ResponseContract
  next?: NextContract
  data?: Record<string, any>
}
