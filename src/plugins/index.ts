import vClickOutside from "click-outside-vue3";

import primeVue from './primeVue/primeVue';
import globalComponents from './globalComponents';
import i18n from './i18n';
import pinia from './pinia';
import toast from './toast';

import type { App } from 'vue';

export default {
  install(app: App) {
    app.use(pinia);
    app.use(i18n);
    app.use(globalComponents);
    app.use(primeVue);
    app.use(toast);
    app.use(vClickOutside as any);
  },
};
