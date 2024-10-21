import { type App } from 'vue'
import PrimeVue from 'primevue/config'
import ToastService from 'primevue/toastservice'
import 'primeicons/primeicons.css'
import Drawer from 'primevue/drawer'
import StyleClass from 'primevue/styleclass'
import Ripple from 'primevue/ripple'
import { flexyPreset } from './flexytheme'

import Tabs from 'primevue/tabs'
import TabList from 'primevue/tablist'
import Tab from 'primevue/tab'
import TabPanels from 'primevue/tabpanels'
import TabPanel from 'primevue/tabpanel'
import Panel from 'primevue/panel'
export default {
  install(app: App) {
    app.use(PrimeVue, {
      theme: {
        preset: flexyPreset,
        options: {
          darkModeSelector: '.my-app-dark'
        },
      },
    })
    app.use(ToastService)
    app.component('Drawer', Drawer)
    app.component('Tabs', Tabs)
    app.component('TabList', TabList)
    app.component('Tab', Tab)
    app.component('TabPanels', TabPanels)
    app.component('TabPanel', TabPanel)
    app.component('Panel', Panel)
    app.directive('styleclass', StyleClass)
    app.directive('ripple', Ripple)
  }
}
