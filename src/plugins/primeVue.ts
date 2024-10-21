import { type App } from 'vue'
import PrimeVue from 'primevue/config'
import Aura from '@primevue/themes/aura'
import ToastService from 'primevue/toastservice'
import 'primeicons/primeicons.css'
import Drawer from 'primevue/drawer'
import StyleClass from 'primevue/styleclass'
import Ripple from 'primevue/ripple'
import PanelMenu from 'primevue/panelmenu'
import { definePreset } from '@primevue/themes'
import panelMenu from '@primevue/themes/aura/panelMenu'

const flexyPreset = definePreset(Aura, {
  components: {
    panelMenu: {
      extend: {
        root: {
          border: 'none'
        },
        panel: {
          border: 'none'
        }
      }
    }
  }
})

export default {
  install(app: App) {
    app.use(PrimeVue, {
      theme: {
        preset: Aura,
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
