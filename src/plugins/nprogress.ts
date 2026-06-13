import { useNProgress } from '@vueuse/integrations/useNProgress';

import axios from 'axios';

import 'nprogress/nprogress.css';

const { isLoading, start, done } = useNProgress(null, {
  showSpinner: false,
  speed: 250,
  minimum: 0.1,
});

let activeRequests = 0;

axios.interceptors.request.use(
  (config) => {
    if (activeRequests === 0) {
      start();
    }
    activeRequests++;
    return config;
  },
  (error) => {
    activeRequests--;
    if (activeRequests === 0) {
      done();
    }
    return Promise.reject(error);
  },
);

axios.interceptors.response.use(
  (response) => {
    activeRequests--;
    if (activeRequests === 0) {
      done();
    }
    return response;
  },
  (error) => {
    activeRequests--;
    if (activeRequests === 0) {
      done();
    }
    return Promise.reject(error);
  },
);

export { done, isLoading, start };
