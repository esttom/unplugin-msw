import { createUnplugin } from 'unplugin'
import { MswContext } from './context'
import type { Options } from './types'

const virtualPrefix = 'virtual:'

const workerModuleId = 'unplugin-msw/worker'
const serverModuleId = 'unplugin-msw/server'
const vitestModuleId = 'unplugin-msw/server/vitest'

function resolveVirtualId(moduleId: string) {
  return virtualPrefix + moduleId
}

function unresolveVirtualId(virtualId: string) {
  return virtualId ? virtualId.replace(virtualPrefix, '') : ''
}

export default createUnplugin<Options | undefined>((options) => {
  const ctx = new MswContext(options)

  return {
    name: 'unplugin-msw',
    enforce: 'pre',
    resolveId(id) {
      const moduleId = [workerModuleId, serverModuleId, vitestModuleId].find(_id => id === _id)
      if (moduleId)
        return resolveVirtualId(moduleId)
    },
    async load(id) {
      const unresolvedVirtualId = unresolveVirtualId(id)
      if (unresolvedVirtualId === workerModuleId)
        return await ctx.generateWorker()

      if (unresolvedVirtualId === serverModuleId)
        return await ctx.generateServer()
      if (unresolvedVirtualId === vitestModuleId)
        return await ctx.generateVitestServer()
    },
  }
})
