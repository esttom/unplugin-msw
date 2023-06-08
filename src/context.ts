import path from 'node:path'
import type { MockType, Options } from './types'
import { Code } from './code'

export function createMswContext(options: Options | undefined) {
  const mockPath = path.join(process.cwd(), options?.mockPath ?? 'mock/handler')
  const workerEnabled = options?.workerEnabled !== undefined ? options.workerEnabled : process.env.NODE_ENV === 'development'

  async function generateWorker() {
    const code = new Code()
    if (!workerEnabled) {
      code.addExport({
        local: 'worker',
        value: 'undefined',
      })
      return code.generateCode()
    }

    code.addImport({
      from: 'msw',
      imported: ['setupWorker'],
    })
    code.addImport({
      from: mockPath.replace(/\\/g, '\\\\'),
      imported: [],
      local: 'handlers',
    })
    code.addExport({
      local: 'worker',
      value: `setupWorker(...${filterHandler('worker')})`,
    })

    return code.generateCode()
  }

  async function generateServer() {
    const code = new Code()
    code.addImport({
      from: 'msw/node',
      imported: ['setupServer'],
    })
    code.addImport({
      from: mockPath.replace(/\\/g, '\\\\'),
      imported: [],
      local: 'handlers',
    })
    code.addExport({
      local: 'server',
      value: `setupServer(...${filterHandler('server')})`,
    })
    return code.generateCode()
  }

  async function generateVitestServer() {
    const code = new Code()
    code.addImport({
      from: 'msw/node',
      imported: ['setupServer'],
    })
    code.addImport({
      from: 'vitest',
      imported: ['beforeAll', 'afterAll', 'afterEach'],
    })
    code.addImport({
      from: mockPath.replace(/\\/g, '\\\\'),
      imported: [],
      local: 'handlers',
    })
    code.addExport({
      local: 'server',
      value: `setupServer(...${filterHandler('server')})`,
    })
    code.addExport({
      local: 'setupVitest',
      value: `() => {
        beforeAll(() => server.listen())
        afterEach(() => server.resetHandlers())
        afterAll(() => server.close())
      }`,
    })
    return code.generateCode()
  }

  return {
    generateWorker,
    generateServer,
    generateVitestServer,
  }
}

function filterHandler(type: MockType) {
  return `handlers
      .filter(h => !(h.type) || h.type === ${typeToString(type)})
      .map(h => h.handler ?? h)
  `
}

function typeToString(type: MockType) {
  return type === 'worker' ? '\'worker\'' : '\'server\''
}
