/**
 * @secjs/http
 *
 * (c) João Lenon <lenon@secjs.com.br>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { InterceptContextContract } from './InterceptContextContract'

export interface InterceptHandlerContract {
  (ctx?: InterceptContextContract): Promise<any> | any
}
