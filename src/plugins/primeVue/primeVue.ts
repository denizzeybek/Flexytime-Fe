import { type App } from 'vue';
import PrimeVue from 'primevue/config';
import ToastService from 'primevue/toastservice';
import 'primeicons/primeicons.css';
import Drawer from 'primevue/drawer';
import StyleClass from 'primevue/styleclass';
import Ripple from 'primevue/ripple';
import { flexyPreset } from './flexytheme';

import Tabs from 'primevue/tabs';
import TabList from 'primevue/tablist';
import Tab from 'primevue/tab';
import TabPanels from 'primevue/tabpanels';
import TabPanel from 'primevue/tabpanel';
import Panel from 'primevue/panel';

import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Rating from 'primevue/rating';
import Tag from 'primevue/tag';
import ColumnGroup from 'primevue/columngroup';
import Row from 'primevue/row';
import Card from 'primevue/card';
import Checkbox from 'primevue/checkbox';
import Password from 'primevue/password';
import Select from 'primevue/select';
import MultiSelect from 'primevue/multiselect';
import Menu from 'primevue/menu';
export default {
  install(app: App) {
    app.use(PrimeVue, {
      theme: {
        preset: flexyPreset,
        options: {
          darkModeSelector: '.my-app-dark',
        },
      },
    });
    app.use(ToastService);

    app.component('Menu', Menu);
    app.component('Drawer', Drawer);
    app.component('Select', Select);
    app.component('MultiSelect', MultiSelect);
    app.component('Tabs', Tabs);
    app.component('TabList', TabList);
    app.component('Tab', Tab);
    app.component('TabPanels', TabPanels);
    app.component('TabPanel', TabPanel);
    app.component('Panel', Panel);
    app.component('DataTable', DataTable);
    app.component('Column', Column);
    app.component('ColumnGroup', ColumnGroup);
    app.component('Row', Row);
    app.component('Rating', Rating);
    app.component('Tag', Tag);
    app.component('Card', Card);
    app.component('Checkbox', Checkbox);
    app.component('Password', Password);

    app.directive('styleclass', StyleClass);
    app.directive('ripple', Ripple);
  },
};
