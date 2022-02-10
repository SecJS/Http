/**
 * @secjs/http
 *
 * (c) João Lenon <lenon@secjs.com.br>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { MiddlewareContract } from '../../src/Contracts/MiddlewareContract'
import { ContextContract } from '../../src/Contracts/Context/ContextContract'

export class HandleMiddleware implements MiddlewareContract {
  async handle(ctx: ContextContract) {
    ctx.data.middleware = 'handle'

    ctx.next()
  }
}
