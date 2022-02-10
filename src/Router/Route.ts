/**
 * @secjs/http
 *
 * (c) João Lenon <lenon@secjs.com.br>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import '@secjs/ioc/src/utils/global'

import { Is } from '@secjs/utils'
import { removeSlash } from '../Utils/removeSlash'
import { InternalServerException } from '@secjs/exceptions'
import { MiddlewareTypes } from '../Contracts/MiddlewareTypes'
import { HttpMethodTypes } from '../Contracts/HttpMethodTypes'
import { HandlerContract } from '../Contracts/Context/HandlerContract'
import { MiddlewareTypesContract } from '../Contracts/MiddlewareTypesContract'
import { InterceptHandlerContract } from '../Contracts/Context/Middlewares/Intercept/InterceptHandlerContract'
import { TerminateHandlerContract } from '../Contracts/Context/Middlewares/Terminate/TerminateHandlerContract'

export class Route {
  private readonly url: string
  private readonly handler: HandlerContract
  private readonly methods: HttpMethodTypes[]

  name: string
  deleted: boolean

  private routeMiddlewares: MiddlewareTypesContract
  private routeNamespace: string

  private prefixes: string[]

  constructor(
    url: string,
    methods: HttpMethodTypes[],
    handler: HandlerContract | string,
  ) {
    this.url = url
    this.deleted = false
    this.methods = methods
    this.prefixes = []
    this.deleted = false
    this.routeMiddlewares = { handlers: [], terminators: [], interceptors: [] }

    if (typeof handler === 'string') {
      const [controller, method] = handler.split('.')

      handler = Container.get(controller)[method] as HandlerContract
    }

    this.handler = handler
  }

  private getUrl(): string {
    const url = removeSlash(this.url) as string

    const prefix = this.prefixes
      .slice()
      .reverse()
      .map(p => removeSlash(p))
      .join('')

    return prefix ? `${prefix}${url === '/' ? '' : url}` : url
  }

  prefix(prefix): this {
    this.prefixes.push(prefix)

    return this
  }

  as(name: string, prepend = false): this {
    this.name = prepend ? `${name}.${this.name}` : name

    return this
  }

  namespace(namespace: string, overwrite = false): this {
    if (!this.routeNamespace || overwrite) {
      this.routeNamespace = namespace
    }

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
    const dictionary = {
      handle: 'handlers',
      terminate: 'terminators',
      intercept: 'interceptors',
    }

    const insertionType = prepend ? 'unshift' : 'push'

    if (Is.String(middleware)) {
      const mid = Container.get('Middlewares')[middleware]

      if (!mid) {
        throw new InternalServerException(
          `Middleware ${middleware} not found in IoC container`,
        )
      }

      if (mid['handle'])
        this.routeMiddlewares.handlers[insertionType](mid['handle'])
      if (mid['intercept'])
        this.routeMiddlewares.interceptors[insertionType](mid['intercept'])
      if (mid['terminate'])
        this.routeMiddlewares.terminators[insertionType](mid['terminate'])

      return this
    }

    this.routeMiddlewares[dictionary[type]][insertionType](middleware)

    return this
  }

  toJSON() {
    return {
      name: this.name,
      url: this.getUrl(),
      handler: this.handler,
      methods: this.methods,
      middlewares: this.routeMiddlewares,
      meta: {
        namespace: this.routeNamespace,
      },
    }
  }
}
