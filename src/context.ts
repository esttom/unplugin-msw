import path from 'node:path'
import process from 'node:process'
import { scanDirExports } from 'unimport'
import type { MockType, Options } from './types'
import { Code } from './code'

export class MswContext {
  private mockDir: string
  private workerEnabled: boolean

  constructor(options: Options | undefined) {
    this.mockDir = options?.mockDir ?? 'mock/handlers'
    this.workerEnabled = options?.workerEnabled !== undefined ? options.workerEnabled : process.env.NODE_ENV === 'development'
  }

  async generateWorker() {
    if (!this.workerEnabled) {
      const code = new Code()
      code.addExport({
        local: 'worker',
        value: 'undefined',
      })
      return code.generateCode()
    }

    const code = await this.createDefaultHandlerCode()
    code.addImport({
      from: 'msw/browser',
      imported: ['setupWorker'],
    })
    code.addExport({
      local: 'worker',
      value: `setupWorker(...${filterHandler('worker')})`,
    })
    return code.generateCode()
  }

  async generateServer() {
    const code = await this.createDefaultHandlerCode()
    code.addImport({
      from: 'msw/node',
      imported: ['setupServer'],
    })
    code.addExport({
      local: 'server',
      value: `setupServer(...${filterHandler('server')})`,
    })
    return code.generateCode()
  }

  async generateVitestServer() {
    const code = await this.createDefaultHandlerCode()
    code.addImport({
      from: 'msw/node',
      imported: ['setupServer'],
    })
    code.addImport({
      from: 'vitest',
      imported: ['beforeAll', 'afterAll', 'afterEach'],
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

  private async createDefaultHandlerCode() {
    const code = new Code()
    const handlers = await this.searchGlobHandler(this.mockDir)
    for (const handler of handlers) {
      code.addHandlerImport({
        from: handler.replace(/\\/g, '\\\\'),
      })
    }
    return code
  }

  private async searchGlobHandler(mockDir: string) {
    const dirExports = await scanDirExports(path.join(process.cwd(), mockDir))
    return dirExports.filter(d => d.name === 'default').map(d => d.from)
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
