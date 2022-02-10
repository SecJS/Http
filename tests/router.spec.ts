/**
 * @secjs/http
 *
 * (c) João Lenon <lenon@secjs.com.br>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import '@secjs/ioc/src/utils/global'

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import supertest from 'supertest'

import { Http } from '../src/Http'
import { Router } from '../src/Router/Router'
import { BadRequestException } from '@secjs/exceptions'
import { TestController } from './stubs/TestController'
import { TestMiddleware } from './stubs/TestMiddleware'
import { InterceptMiddleware } from './stubs/InterceptMiddleware'
import { TerminateMiddleware } from './stubs/TerminateMiddleware'
import { HandleMiddleware } from './stubs/HandleMiddleware'

describe('\n Route Class', () => {
  let http: Http
  let router: Router

  const handler = async ctx => {
    const data: any = { hello: 'world' }

    if (ctx.data.param) data.param = ctx.data.param
    if (ctx.data.midHandler) data.midHandler = ctx.data.midHandler
    if (ctx.request.queries.test) data.test = ctx.request.query('test')
    if (ctx.request.queries.throwError) throw new BadRequestException('Testing')

    ctx.response.status(200).send(data)
  }

  beforeAll(async () => {
    Container.singleton(TestController, 'TestController')
    Container.singleton(
      {
        full: new TestMiddleware(),
        handle: new HandleMiddleware(),
        terminate: new TerminateMiddleware(),
        intercept: new InterceptMiddleware(),
      },
      'Middlewares',
    )
  })

  beforeEach(async () => {
    http = new Http()
    router = new Router(http)
  })

  afterEach(async () => {
    await http.close()
  })

  it('should be able to register a new route', async () => {
    router.get('test', handler)
    router.register()

    await http.listen(3040)

    const response = await supertest('http://localhost:3040').get('/test')

    expect(response.status).toBe(200)
    expect(response.body).toStrictEqual({ hello: 'world' })
  })

  it('should be able to register a new route group', async () => {
    router
      .group(() => {
        router.get('test', handler)
        router.post('test', handler)
      })
      .prefix('v1')

    router.register()

    await http.listen(3041)

    {
      const response = await supertest('http://localhost:3041').get('/v1/test')

      expect(response.status).toBe(200)
      expect(response.body).toStrictEqual({ hello: 'world' })
    }
    {
      const response = await supertest('http://localhost:3041').post('/v1/test')

      expect(response.status).toBe(200)
      expect(response.body).toStrictEqual({ hello: 'world' })
    }
  })

  it('should be able to register a new route resource', async () => {
    router.resource('test', new TestController()).only(['store'])
    router.resource('tests', 'TestController').only(['index', 'show', 'store'])

    router.register()

    await http.listen(3042)

    {
      const response = await supertest('http://localhost:3042').post('/test')

      expect(response.status).toBe(200)
      expect(response.body).toStrictEqual({ hello: 'world' })
    }
    {
      const response = await supertest('http://localhost:3042').get('/tests')

      expect(response.status).toBe(200)
      expect(response.body).toStrictEqual({ hello: 'world' })
    }
    {
      const response = await supertest('http://localhost:3042').post('/tests')

      expect(response.status).toBe(200)
      expect(response.body).toStrictEqual({ hello: 'world' })
    }
    {
      const response = await supertest('http://localhost:3042').get('/tests/1')

      expect(response.status).toBe(200)
      expect(response.body).toStrictEqual({ hello: 'world' })
    }
  })

  it('should be able to register a new route with middleware', async () => {
    router
      .get('test', 'TestController.index')
      .middleware('handle')
      .middleware(ctx => {
        ctx.data.midHandler = true

        ctx.next()
      })

    router.register()

    await http.listen(3043)

    const response = await supertest('http://localhost:3043').get('/test')

    expect(response.status).toBe(200)
    expect(response.body).toStrictEqual({
      hello: 'world',
      midHandler: true,
      middlewares: ['handle'],
    })
  })

  it('should be able to register a new group with resource inside', async () => {
    router
      .group(() => {
        router.get('test', 'TestController.show').middleware(ctx => {
          ctx.request.queries.throwError = 'true'

          ctx.next()
        })

        router.patch('test', 'TestController.show').middleware(ctx => {
          ctx.data.midHandler = false
          ctx.data.patchHandler = true

          ctx.next()
        })

        router
          .resource('tests', 'TestController')
          .only(['store'])
          .middleware(ctx => {
            ctx.data.rscHandler = true

            ctx.next()
          })
      })
      .prefix('v1')
      .middleware('handle')
      .middleware(ctx => {
        ctx.data.midHandler = true

        ctx.next()
      })

    router.register()

    await http.listen(3044)

    {
      const response = await supertest('http://localhost:3044').get('/v1/test')

      expect(response.status).toBe(400)
      expect(response.body.midHandler).toBeFalsy()
      expect(response.body.code).toStrictEqual('BAD_REQUEST_EXCEPTION')
      expect(response.body.path).toStrictEqual('/v1/test')
      expect(response.body.method).toStrictEqual('GET')
      expect(response.body.status).toStrictEqual('ERROR')
      expect(response.body.statusCode).toStrictEqual(400)
      expect(response.body.error.name).toStrictEqual('BadRequestException')
      expect(response.body.error.message).toStrictEqual('Testing')
    }
    {
      const response = await supertest('http://localhost:3044').patch(
        '/v1/test',
      )

      expect(response.status).toBe(200)
      expect(response.body).toStrictEqual({
        hello: 'world',
        midHandler: true,
        patchHandler: true,
        middlewares: ['handle'],
      })
    }
    {
      const response = await supertest('http://localhost:3044').post(
        '/v1/tests',
      )

      expect(response.status).toBe(200)
      expect(response.body).toStrictEqual({
        hello: 'world',
        midHandler: true,
        rscHandler: true,
        middlewares: ['handle'],
      })
    }
  })

  it('should be able to register a new route with intercept middleware', async () => {
    router
      .get('test', 'TestController.index')
      .middleware('handle')
      .middleware('intercept')

    router.register()

    await http.listen(3045)

    const response = await supertest('http://localhost:3045').get('/test')

    expect(response.status).toBe(200)
    expect(response.body).toStrictEqual({
      hello: 'world',
      middlewares: ['handle', 'intercept'],
    })
  })

  it('should be able to register a new route with terminate middleware', async () => {
    let terminated = false

    router
      .get('test', 'TestController.index')
      .middleware('handle')
      .middleware(ctx => {
        terminated = true

        ctx.next()
      }, 'terminate')

    router.register()

    await http.listen(3046)

    const response = await supertest('http://localhost:3046').get('/test')

    expect(response.status).toBe(200)
    expect(terminated).toBe(true)
    expect(response.body).toStrictEqual({
      hello: 'world',
      middlewares: ['handle'],
    })
  })

  it('should be able to register a new route with middleware and controller direct class', async () => {
    let terminated = false

    router
      .controller(new TestController())
      .get('test', 'index')
      .middleware(new HandleMiddleware())
      .middleware(ctx => {
        terminated = true

        ctx.next()
      }, 'terminate')

    router.register()

    await http.listen(3047)

    const response = await supertest('http://localhost:3047').get('/test')

    expect(response.status).toBe(200)
    expect(terminated).toBe(true)
    expect(response.body).toStrictEqual({
      hello: 'world',
      middlewares: ['handle'],
    })
  })

  it('should be able to register a new route with middleware direct class on groups', async () => {
    let terminated = false

    router
      .controller(new TestController())
      .group(() => {
        router.get('test', 'index')
      })
      .prefix('api/v1')
      .middleware(new HandleMiddleware())
      .middleware(ctx => {
        terminated = true

        ctx.next()
      }, 'terminate')

    router.register()

    await http.listen(3048)

    const response = await supertest('http://localhost:3048').get(
      '/api/v1/test',
    )

    expect(response.status).toBe(200)
    expect(terminated).toBe(true)
    expect(response.body).toStrictEqual({
      hello: 'world',
      middlewares: ['handle'],
    })
  })
})
