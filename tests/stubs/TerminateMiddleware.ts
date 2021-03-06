/**
 * @secjs/http
 *
 * (c) João Lenon <lenon@secjs.com.br>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { MiddlewareContract } from '../../src/Contracts/MiddlewareContract'
import { TerminateContextContract } from '../../src/Contracts/Context/Middlewares/Terminate/TerminateContextContract'

export class TerminateMiddleware implements MiddlewareContract {
  async terminate(ctx: TerminateContextContract) {
    console.log('Request terminated!')

    ctx.next()
  }
}
