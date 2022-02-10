/**
 * @secjs/http
 *
 * (c) João Lenon <lenon@secjs.com.br>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { Route } from './Route'
import { RouteResource } from './RouteResource'
import { InternalServerException } from '@secjs/exceptions'
import { MiddlewareTypes } from '../Contracts/MiddlewareTypes'
import { HandlerContract } from '../Contracts/Context/HandlerContract'
import { InterceptHandlerContract } from '../Contracts/Context/Middlewares/Intercept/InterceptHandlerContract'
import { TerminateHandlerContract } from '../Contracts/Context/Middlewares/Terminate/TerminateHandlerContract'

export class RouteGroup {
  routes: (Route | RouteResource | RouteGroup)[]

  constructor(routes: (Route | RouteResource | RouteGroup)[]) {
    this.routes = routes
  }

  private invoke(
    route: Route | RouteResource | RouteGroup,
    method: string,
    params: any[],
  ) {
    if (route instanceof RouteResource) {
      route.routes.forEach(child => this.invoke(child, method, params))
      return
    }

    if (route instanceof RouteGroup) {
      route.routes.forEach(child => this.invoke(child, method, params))
      return
    }

    if (method === 'as' && !route.name) {
      throw new InternalServerException('Cannot define group name')
    }

    route[method](...params)
  }

  prefix(prefix: string): this {
    this.routes.forEach(route => this.invoke(route, 'prefix', [prefix]))
    return this
  }

  as(name: string): this {
    this.routes.forEach(route => this.invoke(route, 'as', [name, true]))
    return this
  }

  namespace(namespace: string): this {
    this.routes.forEach(route => this.invoke(route, 'namespace', [namespace]))
    return this
  }

  middleware(
    middleware:
      | HandlerContract
      | InterceptHandlerContract
      | TerminateHandlerContract
      | string,
    type: MiddlewareTypes = 'handle',
    prepend = false,
  ): this {
    this.routes.forEach(route => {
      this.invoke(route, 'middleware', [middleware, type, prepend])
    })

    return this
  }
}
