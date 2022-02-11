/**
 * @secjs/http
 *
 * (c) João Lenon <lenon@secjs.com.br>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { ErrorContextContract } from './ErrorContextContract'

export interface ErrorHandlerContract {
  (ctx?: ErrorContextContract): Promise<any> | any
}
