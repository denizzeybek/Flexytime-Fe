import type { App } from 'vue'

const modules = import.meta.glob('@/components/ui/global/*.vue', { eager: true })

export default {
  install(app: App) {
    for (const path in modules) {
      const componentName = path.split('/').at(-1)?.split('.')[0]
      app.component(`R${componentName}`, (modules[path] as any).default)
    }
  }
}
