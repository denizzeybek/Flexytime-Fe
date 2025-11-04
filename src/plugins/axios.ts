import axios from 'axios';

import { EHeader } from '@/common/enums/token.enum';
import { EStorageKeys } from '@/constants/storageKeys';
import router from '@/router/index';
// import { authLoginHeader, bearerHeader } from '@/helpers/auth';

axios.defaults.baseURL = import.meta.env.VITE_API_URL;
axios.interceptors.request.use(
  (config) => {
    const currentRoute = router.currentRoute.value;

    const accessToken = localStorage.getItem(EStorageKeys.TOKEN);

    if (currentRoute.meta.header === EHeader.BASIC) {
      config.headers['Authorization'] =
        'BASIC QzFBMDNCMTAtN0Q1OS00MDdBLUE5M0UtQjcxQUIxN0FEOEMyOjE3N0UzMjk1LTA2NTYtNDMxNy1CQzkxLUREMjcxQTE5QUNGRg==';
    } else if (accessToken) {
      config.headers['Authorization'] = `Bearer ${accessToken}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);
