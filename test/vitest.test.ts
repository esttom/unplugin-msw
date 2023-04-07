import { describe, expect, it } from 'vitest'
import { setupVitest } from 'unplugin-msw/server/vitest'

setupVitest()

describe('vitest', () => {
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
