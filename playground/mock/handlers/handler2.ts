import { HttpResponse, http } from 'msw'
import type { UnpluginMswHandlers } from './../../../src/types'

export default [
  http.get('https://ext-handler', () => {
    return HttpResponse.json({
      key: 'value',
    })
  }),
] as UnpluginMswHandlers
