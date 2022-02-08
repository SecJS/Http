/**
 * @secjs/http
 *
 * (c) João Lenon <lenon@secjs.com.br>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { BadRequestException } from '@secjs/exceptions'
import { ContextContract } from '../../src/Contracts/Context/ContextContract'

export class TestController {
  async index(ctx: ContextContract) {
    const data: any = { hello: 'world' }

    if (ctx.data.param) data.param = ctx.data.param
    if (ctx.data.midHandler) data.midHandler = ctx.data.midHandler
    if (ctx.data.rscHandler) data.rscHandler = ctx.data.rscHandler
    if (ctx.data.patchHandler) data.patchHandler = ctx.data.patchHandler
    if (ctx.request.queries.test) data.test = ctx.request.query('test')
    if (ctx.request.queries.throwError) throw new BadRequestException('Testing')

    ctx.response.status(200).send(data)
  }

  async show(ctx: ContextContract) {
    const data: any = { hello: 'world' }

    if (ctx.data.param) data.param = ctx.data.param
    if (ctx.data.midHandler) data.midHandler = ctx.data.midHandler
    if (ctx.data.rscHandler) data.rscHandler = ctx.data.rscHandler
    if (ctx.data.patchHandler) data.patchHandler = ctx.data.patchHandler
    if (ctx.request.queries.test) data.test = ctx.request.query('test')
    if (ctx.request.queries.throwError) throw new BadRequestException('Testing')

    ctx.response.status(200).send(data)
  }

  async store(ctx: ContextContract) {
    const data: any = { hello: 'world' }

    if (ctx.data.param) data.param = ctx.data.param
    if (ctx.data.midHandler) data.midHandler = ctx.data.midHandler
    if (ctx.data.rscHandler) data.rscHandler = ctx.data.rscHandler
    if (ctx.data.patchHandler) data.patchHandler = ctx.data.patchHandler
    if (ctx.request.queries.test) data.test = ctx.request.query('test')
    if (ctx.request.queries.throwError) throw new BadRequestException('Testing')

    ctx.response.status(200).send(data)
  }
}
