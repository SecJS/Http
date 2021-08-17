import { Context } from './Contracts/HandlerContract'

export default {
  PORT: 4040,
  DEFAULT_HTTP_CODE: 200,
  DEFAULT_HEADERS: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
  DEFAULT_ROUTE: {
    path: '/',
    method: 'ALL',
    params: [],
    matcher: /\//,
    handler: (ctx: Context): any => {
      ctx.response.writeHead(404, { 'Content-Type': 'application/json' })

      ctx.response.write(JSON.stringify({ message: 'Not found!' }))

      ctx.response.end()
    },
  },
}
