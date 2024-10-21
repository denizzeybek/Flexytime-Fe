import { type App } from 'vue'
import PrimeVue from 'primevue/config'
import ToastService from 'primevue/toastservice'
import 'primeicons/primeicons.css'
import Drawer from 'primevue/drawer'
import StyleClass from 'primevue/styleclass'
import Ripple from 'primevue/ripple'
import { flexyPreset } from './flexytheme'

export default {
  install(app: App) {
    app.use(PrimeVue, {
      theme: {
        preset: flexyPreset,
        options: {
          darkModeSelector: '.my-app-dark'
        }
      },
      pt: {
        global: {
          css: `
            .p-panelmenu  {
              gap:0 !important;
            }
            .p-panelmenu .p-panelmenu-panel {
              border: none;
            }
            `
        }
      }
    })
    app.use(ToastService)
    app.component('Drawer', Drawer)
    app.directive('styleclass', StyleClass)
    app.directive('ripple', Ripple)
  }
}
