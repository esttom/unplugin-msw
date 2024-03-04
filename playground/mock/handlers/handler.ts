import { HttpResponse, http } from 'msw'
import type { UnpluginMswHandlers } from './../../../src/types'

export default [
  http.get('https://my-handle-url', () => {
    return HttpResponse.json({
      key: 'value',
    })
  }),
  {
    handler: http.get('https://worker-only', () => {
      return HttpResponse.json({
        key: 'value',
      })
    }),
    type: 'worker',
  },
  {
    handler: http.get('https://server-only', () => {
      return HttpResponse.json({
        key: 'value',
      })
    }),
    type: 'server',
  },
] as UnpluginMswHandlers
