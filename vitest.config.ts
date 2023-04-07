import { defineConfig } from 'vitest/config'
import MswPlugin from './src'

export default defineConfig(() => {
  return {
    plugins: [
      MswPlugin.vite({
        mockPath: 'playground/src/handler',
      }),
    ],
  }
})
