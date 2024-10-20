import type { App } from 'vue'

import globalComponents from './globalComponents'
import i18n from './i18n'
import pinia from './pinia'
import primeVue from './primeVue'
export default {
  install(app: App) {
    app.use(pinia)
    app.use(i18n)
    app.use(globalComponents)
    app.use(primeVue)
  }
}
