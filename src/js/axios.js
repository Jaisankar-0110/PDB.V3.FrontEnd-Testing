import axios from "axios";

const baseUrl = import.meta.env.VITE_API_BASE_URL;

const basicAuthUsername = "aliceblue_p@rtnerDa$hb0ard";
const basicAuthPassword = "rnd$$P@rtner$@l1ve";
const basicAuth = btoa(`${basicAuthUsername}:${basicAuthPassword}`);

const createAxios = axios.create({
  baseURL: baseUrl,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'Authorization': `Basic ${basicAuth}`
  },
});

// createAxios.interceptors.request.use(
//   (config) => {
//     const token = sessionStorage.getItem('token');
//     if (token) {
//       config.headers['Authorization'] = `Bearer ${token}`;
//     }
//     return config;
//   },
//   (error) => {
//     return Promise.reject(error);
//   }
// );

createAxios.interceptors.request.use(
  (config) => {
    const basicAuthEndpoints = ['/otp/send-email', '/otp/send', '/otp/login-verify', '/forgotresetpassword/forgot', '/forgotresetpassword/reset', '/otp/verify'];


    const isBasicAuthEndpoint = basicAuthEndpoints.some(endpoint =>
      config.url.includes(endpoint)
    );

    if (isBasicAuthEndpoint) {
      config.headers['Authorization'] = `Basic ${basicAuth}`;
    } else {
      const token = sessionStorage.getItem('token');
      if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
      }
    }

    return config;
  },
  (error) => Promise.reject(error)
);


export default createAxios;
