import { defineConfig } from 'vite'
import Inspect from 'vite-plugin-inspect'
import MswPlugin from '../src/vite'

export default defineConfig({
  plugins: [
    Inspect(),
    MswPlugin(),
  ],
})
