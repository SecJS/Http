import { IncomingMessage, ServerResponse } from 'http'

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
    handler: (request: IncomingMessage, response: ServerResponse): any => {
      response.writeHead(404, { 'Content-Type': 'application/json' })
      response.write(JSON.stringify({ message: 'Not found!' }))
      response.end()
    },
  },
}
