import { HandlerContract } from './HandlerContract'

// TODO Move to @secjs/contracts
export interface RouteContract {
  path: string
  method: string
  params: string[]
  matcher: RegExp
  handler: HandlerContract
}
