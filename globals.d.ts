declare module 'unplugin-msw/worker' {
  import type { SetupWorker } from 'msw'
  export const worker: SetupWorker | undefined
}

declare module 'unplugin-msw/server' {
  import type { SetupServer } from 'msw/node'
  export const server: SetupServer
}

declare module 'unplugin-msw/server/vitest' {
  import type { SetupServer } from 'msw/node'
  export const server: SetupServer
  export const setupVitest: () => void
}
