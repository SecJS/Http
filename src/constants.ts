import { SecContextContract } from '@secjs/contracts'

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
    handler: ({ response }: SecContextContract): any => {
      return response
        .status(404)
        .json(JSON.stringify({ message: 'Not found!' }))
    },
  },
}
