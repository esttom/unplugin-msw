# unplugin-msw

`unplugin-msw` is a utility plugin that simplifies [msw](https://mswjs.io/) setup and commonizes "worker" and "server" mocks.

## Feature
- msw worker and server creation can be simplified
- mocks can be easily shared and switched between worker and server

## Install

```bash
npm i -D unplugin-msw
```

<details>
<summary>Vite</summary><br>

```ts
// vite.config.ts
import MswPlugin from 'unplugin-msw/vite'

export default defineConfig({
  plugins: [
    MswPlugin(),
    // or
    MswPlugin({
      // default
      mockPath: 'mock/handler', // handler definition path
      workerEnabled: process.env.NODE_ENV === 'development', // worker startup condition
    })
  ],
})
```

Example: [`playground/`](./playground/)

<br></details>

WIP: esbuild, rollup, webpack...

## Setup

install [msw](https://mswjs.io/docs/getting-started/install)

### msw handler definition

Two types of definitions are available: the normal msw handler definition and an extended definition. 
The normal definition is common to both servers and workers, while the extended definition allows the choice of server or worker.

```ts
import { rest } from 'msw'
import type { UnpluginMswHandlers } from 'unplugin-msw/types'

export default [
  // mws definition, use server and worker
  rest.get('https://my-handle-url', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        key: 'value',
      }),
    )
  }),
  // use worker only
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
  // use server only
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
