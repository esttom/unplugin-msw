# unplugin-msw

`unplugin-msw` is a utility plugin that simplifies [msw](https://mswjs.io/) setup and commonizes "worker" and "server" mocks.

| msw | unplugin-msw |
| -- | -- |
| 1.x | 0.3.0 |
| 2.x | >= 0.4.0 |

## Feature
- msw worker and server creation can be simplified
- mocks can be easily shared and switched between worker and server

## Install

```bash
npm i -D unplugin-msw
```

### Vite

```ts
// vite.config.ts
import MswPlugin from 'unplugin-msw/vite'

export default defineConfig({
  plugins: [
    MswPlugin(),
    // or
    MswPlugin({
      // default
      mockDir: 'mock/handlers', // handler definition directory
      workerEnabled: process.env.NODE_ENV === 'development', // worker startup condition
    })
  ],
})
```

Example: [`playground/`](./playground/)

WIP: esbuild, rollup, webpack...

## Setup

install [msw](https://mswjs.io/docs/getting-started/install)

### msw handler definition

Two types of definitions are available: the normal msw handler definition and an extended definition.
The normal definition is common to both servers and workers, while the extended definition allows the choice of server or worker.

[!WARNING]
Creates a handler that combines all files under the specified directory. Each handler should be exported by default.

```ts
import { HttpResponse, http } from 'msw'
import type { UnpluginMswHandlers } from 'unplugin-msw/types'

export default [
  // mws definition, use server and worker
  http.get('https://my-handle-url', () => {
    return HttpResponse.json({
      key: 'value',
    })
  }),
  // use worker only
  {
    handler: http.get('https://worker-only', () => {
      return HttpResponse.json({
        key: 'value',
      })
    }),
    type: 'worker',
  },
  // use server only
  {
    handler: http.get('https://server-only', () => {
      return HttpResponse.json({
        key: 'value',
      })
    }),
    type: 'server',
  },
] as UnpluginMswHandlers
```

### use worker or server

<details>
<summary>worker (for frontend)</summary><br>

setup [msw worker](https://mswjs.io/docs/getting-started/integrate/browser)


```ts
import { worker } from 'unplugin-msw/worker'

// worker is undefined when 'workerEnabled' === false
worker?.start()
```

<br></details>


<details>
<summary>server (for server, unit test)</summary><br>

```ts
// unit test
import { server } from 'unplugin-msw/server'

beforeAll(() => {
  server.listen()
})

afterAll(() => {
  server.close()
})
```

<br></details>

<details>
<summary>server (for vitest)</summary><br>

```ts
import { setupVitest } from 'unplugin-msw/server/vitest'

/**
 * setupVitest is shorthand
 * () => {
 *   beforeAll(() => server.listen())
 *   afterEach(() => server.resetHandlers())
 *   afterAll(() => server.close())
 * }
 */
setupVitest()
```

<br></details>

## TypeScript

```json
{
  "compilerOptions": {
    "types": [
      "unplugin-msw/globals"
    ]
  }
}
```

## Credit

- [msw](https://mswjs.io/)
- [unplugin](https://github.com/unjs/unplugin)
