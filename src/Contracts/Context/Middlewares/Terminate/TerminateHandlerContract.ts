/**
 * @secjs/http
 *
 * (c) João Lenon <lenon@secjs.com.br>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { TerminateContextContract } from './TerminateContextContract'

export interface TerminateHandlerContract {
  (ctx?: TerminateContextContract): Promise<any> | any
}
