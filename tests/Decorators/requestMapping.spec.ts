/* eslint-disable @typescript-eslint/ban-ts-comment,@typescript-eslint/no-empty-function */
// @ts-nocheck

import 'reflect-metadata'

import { Controller } from '../../src/Decorators/Controller'
import { Get, Post, Delete } from '../../src/Decorators/RequestMapping'

describe('\n Request Mapping Decorators', () => {
  it('should be able to create a controller with routes inside', async () => {
    @Controller()
    class TestController {
      @Get()
      async get() {}

      @Post()
      async post() {}
    }

    const testController = new TestController()

    const path = Reflect.getMetadata('controller:path', TestController)
    const routes = Reflect.getMetadata('controller:routes', TestController)

    expect(path).toStrictEqual(['/'])

    expect(routes[0]).toStrictEqual({
      path: '/',
      method: 0,
      handler: testController.get,
    })
    expect(routes[1]).toStrictEqual({
      path: '/',
      method: 1,
      handler: testController.post,
    })
  })

  it('should be able to create a controller with routes inside and map the paths', async () => {
    @Controller('api/v1')
    class TestController {
      @Get('tests')
      async get() {}

      @Post('/tests/')
      async post() {}
    }

    const testController = new TestController()

    const path = Reflect.getMetadata('controller:path', TestController)
    const routes = Reflect.getMetadata('controller:routes', TestController)

    expect(path).toStrictEqual(['/api/v1'])
    expect(routes[0]).toStrictEqual({
      path: '/api/v1/tests',
      method: 0,
      handler: testController.get,
    })
    expect(routes[1]).toStrictEqual({
      path: '/api/v1/tests',
      method: 1,
      handler: testController.post,
    })
  })

  it('should be able to map a controller using arrays in paths to create more entries', async () => {
    @Controller(['/api/v1', 'api/v2'])
    class TestController {
      @Delete(['tests', '/tests/v2'])
      async delete() {}
    }

    const testController = new TestController()

    const path = Reflect.getMetadata('controller:path', TestController)
    const routes = Reflect.getMetadata('controller:routes', TestController)

    expect(path).toStrictEqual(['/api/v1', '/api/v2'])

    expect(routes[0]).toStrictEqual({
      path: '/api/v1/tests',
      method: 3,
      handler: testController.delete,
    })

    expect(routes[1]).toStrictEqual({
      path: '/api/v1/tests/v2',
      method: 3,
      handler: testController.delete,
    })

    expect(routes[2]).toStrictEqual({
      path: '/api/v2/tests',
      method: 3,
      handler: testController.delete,
    })

    expect(routes[3]).toStrictEqual({
      path: '/api/v2/tests/v2',
      method: 3,
      handler: testController.delete,
    })
  })
})
