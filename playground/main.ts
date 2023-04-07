import { worker } from 'unplugin-msw/worker'

document.getElementById('app')!.innerHTML = '__UNPLUGIN__'

worker?.start({
  onUnhandledRequest: 'bypass',
})
