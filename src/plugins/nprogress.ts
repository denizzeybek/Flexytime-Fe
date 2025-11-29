import { useNProgress } from '@vueuse/integrations/useNProgress';

import axios from 'axios';

import 'nprogress/nprogress.css';

// Initialize NProgress with VueUse
const { isLoading, start, done } = useNProgress(null, {
  showSpinner: false,
  speed: 250,
  minimum: 0.1,
});

// Track active requests to handle concurrent calls
let activeRequests = 0;

// Request interceptor
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

// Response interceptor
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
