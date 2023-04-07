import { rest } from 'msw'
import type { UnpluginMswHandlers } from './../../src/types'

export default [
  rest.get('https://my-handle-url', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        key: 'value',
      }),
    )
  }),
  {
    handler: rest.get('https://worker-only', (req, res, ctx) => {
      return res(
        ctx.status(200),
        ctx.json({
          key: 'value',
        }),
      )
    }),
    type: 'worker',
  },
  {
    handler: rest.get('https://server-only', (req, res, ctx) => {
      return res(
        ctx.status(200),
        ctx.json({
          key: 'value',
        }),
      )
    }),
    type: 'server',
  },
] as UnpluginMswHandlers
