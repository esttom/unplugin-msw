import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { server } from 'unplugin-msw/server'

beforeAll(() => {
  server.listen()
})

afterAll(() => {
  server.close()
})

describe('server', () => {
  it('exist URL', async () => {
    const data = await fetch('https://my-handle-url')
    expect(data.status).toBe(200)
  })

  it('server only URL', async () => {
    const data = await fetch('https://server-only')
    expect(data.status).toBe(200)
  })

  it('worker only URL', async () => {
    expect(() => fetch('https://worker-only')).rejects.toThrowError()
  })
})
