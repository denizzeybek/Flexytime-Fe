import type { App } from 'vue'
import Toast, { type PluginOptions } from 'vue-toastification'
import 'vue-toastification/dist/index.css'

const options: PluginOptions = {
  timeout: 3000,
  hideProgressBar: true
}

export default {
  install(app: App) {
    app.use(Toast, options)
  }
}
