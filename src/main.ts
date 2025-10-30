import App from '@/App.vue'
import router from '@/router'
import { createApp } from 'vue'
import plugins from './plugins'
import '@/custom-tailwind.css'
import  '@/plugins/axios'
import { OpenAPI } from '@/client';

OpenAPI.BASE = import.meta.env.VITE_API_URL

const app = createApp(App)

app.use(router)
app.use(plugins)

app.config.errorHandler = (err, vm, info) => {
  console.error('app error handler: ', err, vm, info)
}
// app.config.globalProperties.$axios = axiosInstance
app.mount('#app')
