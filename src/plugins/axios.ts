import axios from 'axios';

// OpenAPI client handles all Authorization headers now
// No need for axios interceptor since we're using OpenAPI services

axios.defaults.baseURL = import.meta.env.VITE_API_URL;
