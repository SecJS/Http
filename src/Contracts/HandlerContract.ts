import { IncomingMessage, ServerResponse } from 'http'

// TODO Move to @secjs/contracts
export interface HandlerContract {
  (request: IncomingMessage, response: ServerResponse): Promise<any> | any
}
