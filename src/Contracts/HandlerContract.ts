import { IncomingMessage, ServerResponse } from 'http'

export interface Context {
  request: IncomingMessage
  response: ServerResponse
}

// TODO Move to @secjs/contracts
export interface HandlerContract {
  (ctx: Context): Promise<any> | any
}
