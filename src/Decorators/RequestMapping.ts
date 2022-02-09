/**
 * @secjs/http
 *
 * (c) João Lenon <lenon@secjs.com.br>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import 'reflect-metadata'
import { removeSlash } from '../Utils/removeSlash'

export enum RequestMethod {
  GET,
  POST,
  PUT,
  DELETE,
  PATCH,
  ALL,
  OPTIONS,
  HEAD,
}

export function RequestMapper(
  path: string | string[] = '/',
  method: RequestMethod = RequestMethod.GET,
): MethodDecorator {
  if (path.length && !path[0]) path = '/'

  path = removeSlash(path)

  return (
    target: any,
    key: string | symbol,
    descriptor: TypedPropertyDescriptor<any>,
  ) => {
    let routes = Reflect.getMetadata('controller:routes', target.constructor)

    if (!routes) {
      Reflect.defineMetadata(
        'controller:routes',
        (routes = []),
        target.constructor,
      )
    }

    typeof path === 'string'
      ? routes.push({ path, method, handler: target[key] })
      : path.forEach(p =>
          routes.push({ path: p, method, handler: target[key] }),
        )

    Reflect.defineMetadata('controller:routes', routes, target.constructor)

    return descriptor
  }
}

export const createRequestDecorator =
  (method: RequestMethod) =>
  (path?: string | string[]): MethodDecorator =>
    RequestMapper(path, method)

export const Get = createRequestDecorator(RequestMethod.GET)
export const Post = createRequestDecorator(RequestMethod.POST)
export const Put = createRequestDecorator(RequestMethod.PUT)
export const Patch = createRequestDecorator(RequestMethod.PATCH)
export const Delete = createRequestDecorator(RequestMethod.DELETE)
export const All = createRequestDecorator(RequestMethod.ALL)
export const Options = createRequestDecorator(RequestMethod.OPTIONS)
export const Head = createRequestDecorator(RequestMethod.HEAD)
