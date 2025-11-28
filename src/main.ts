import { createApp } from 'vue';

import App from '@/App.vue';
import { OpenAPI } from '@/client';
import router from '@/router';

import plugins from './plugins';

import '@/tailwind.css';

import '@/plugins/axios';

OpenAPI.BASE = import.meta.env.VITE_API_URL;

const app = createApp(App);

app.use(router);
app.use(plugins);

app.config.errorHandler = (err, vm, info) => {
  console.error('app error handler: ', err, vm, info);
};
// app.config.globalProperties.$axios = axiosInstance
app.mount('#app');
