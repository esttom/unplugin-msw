import type { RequestHandler } from 'msw'

export interface Options {
  mockPath?: string
  workerEnabled?: boolean
}

export type MockType = 'worker' | 'server'

export interface UnpluginMswHandler {
  handler: RequestHandler
  type: MockType
}

export type UnpluginMswHandlers = Array<RequestHandler | UnpluginMswHandler>
