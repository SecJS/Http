/**
 * @secjs/http
 *
 * (c) João Lenon <lenon@secjs.com.br>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import '@secjs/ioc/src/utils/global'

import { removeSlash } from '../Utils/removeSlash'
import { HttpMethodTypes } from '../Contracts/HttpMethodTypes'
import { HandlerContract } from '../Contracts/Context/HandlerContract'
import { Is } from '@secjs/utils'

export class Route {
  private readonly url: string
  private readonly handler: HandlerContract
  private readonly methods: HttpMethodTypes[]

  name: string
  deleted: boolean

  private routeMiddlewares: HandlerContract[]
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
    this.routeMiddlewares = []

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

  middleware(middleware: HandlerContract | string, prepend = false): this {
    const setMiddleware = (mid: HandlerContract) => {
      if (prepend) {
        this.routeMiddlewares.unshift(mid)
      } else {
        this.routeMiddlewares.push(mid)
      }
    }

    if (Is.String(middleware)) {
      const middlewares = Container.get('Middlewares') as Record<string, any>
      setMiddleware(middlewares[middleware]['handle'])

      return this
    }

    setMiddleware(middleware)

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
