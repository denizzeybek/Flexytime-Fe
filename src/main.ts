import App from '@/App.vue'
import router from '@/router'
import '@/styles/index.scss'
import { createApp } from 'vue'
import plugins from './plugins'
import '@/style.css'
import  '@/plugins/axios'

const app = createApp(App)

app.use(router)
app.use(plugins)

app.config.errorHandler = (err, vm, info) => {
  console.error('app error handler: ', err, vm, info)
}
// app.config.globalProperties.$axios = axiosInstance
app.mount('#app')
