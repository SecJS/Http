/**
 * @secjs/http
 *
 * (c) João Lenon <lenon@secjs.com.br>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

export interface RequestContract {
  ip: string
  method: string
  hostUrl: string
  baseUrl: string
  originalUrl: string
  body: Record<string, any>
  params: Record<string, string>
  queries: Record<string, string>
  headers: Record<string, string>
  param(param: string, defaultValue?: string): string | null
  query(query: string, defaultValue?: string): string | null
  header(header: string, defaultValue?: string): string | string[] | null
  payload(payload: string, defaultValue?: string): any | null
}
