import { type App } from 'vue';
import PrimeVue from 'primevue/config';
import ToastService from 'primevue/toastservice';
import 'primeicons/primeicons.css';
import Drawer from 'primevue/drawer';
import { flexyPreset } from './flexytheme';

import StyleClass from 'primevue/styleclass';
import Ripple from 'primevue/ripple';
import Tooltip from 'primevue/tooltip';

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
import Message from 'primevue/message';
import Breadcrumb from 'primevue/breadcrumb';
import TreeTable from 'primevue/treetable'
import Dialog from 'primevue/dialog';
import FileUpload from 'primevue/fileupload';
import Divider from 'primevue/divider';
import Skeleton from 'primevue/skeleton';
import DatePicker from 'primevue/datepicker';
import ToggleSwitch from 'primevue/toggleswitch';
import SelectButton from 'primevue/selectbutton';
import Stepper from 'primevue/stepper';
import StepList from 'primevue/steplist';
import StepPanels from 'primevue/steppanels';
import StepItem from 'primevue/stepitem';
import Step from 'primevue/step';
import StepPanel from 'primevue/steppanel';
import Chart from 'primevue/chart';


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

    app.component('Chart', Chart);
    app.component('StepPanel', StepPanel);
    app.component('Step', Step);
    app.component('StepItem', StepItem);
    app.component('StepPanels', StepPanels);
    app.component('StepList', StepList);
    app.component('Stepper', Stepper);
    app.component('SelectButton', SelectButton);
    app.component('ToggleSwitch', ToggleSwitch);
    app.component('DatePicker', DatePicker);
    app.component('Skeleton', Skeleton);
    app.component('Divider', Divider);
    app.component('FileUpload', FileUpload);
    app.component('Dialog', Dialog);
    app.component('TreeTable', TreeTable);
    app.component('DatePicker', DatePicker);
    app.component('Breadcrumb', Breadcrumb);
    app.component('Message', Message);
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
    app.directive('tooltip', Tooltip);
  },
};
