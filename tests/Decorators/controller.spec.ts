import 'reflect-metadata'

import { Controller } from '../../src/Decorators/Controller'

describe('\n Controller Decorator', () => {
  it('should be able to create metadata values for a controller', async () => {
    @Controller()
    class TestController {}

    expect(
      Reflect.getMetadata('controller:path', TestController),
    ).toStrictEqual(['/'])
  })

  it('should be able to add a path to the controller', async () => {
    const path = '/tests'

    @Controller(path)
    class TestController {}

    expect(
      Reflect.getMetadata('controller:path', TestController),
    ).toStrictEqual([path])
  })
})
