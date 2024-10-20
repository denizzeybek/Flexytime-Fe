import { type App } from 'vue'
import PrimeVue from 'primevue/config'
import Aura from '@primevue/themes/aura'
import ToastService from 'primevue/toastservice'
import 'primeicons/primeicons.css'
import Drawer from 'primevue/drawer'
import StyleClass from 'primevue/styleclass'
import Ripple from 'primevue/ripple'

export default {
  install(app: App) {
    app.use(PrimeVue, {
      theme: {
        preset: Aura,
        options: {
          darkModeSelector: '.my-app-dark'
        },
      }
    })
    app.use(ToastService)
    app.component('Drawer', Drawer)
    app.directive('styleclass', StyleClass)
    app.directive('ripple', Ripple)
  }
}
