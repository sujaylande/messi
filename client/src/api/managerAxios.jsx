// src/api/managerAxios.js
import axios from 'axios';
import { createBrowserHistory } from 'history';

const history = createBrowserHistory();

const managerAxios = axios.create({
  baseURL: 'http://localhost:5000/api/manager',
  withCredentials: true,
});

let isRefreshing = false;

managerAxios.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response && error.response.status === 401 && !originalRequest._retry) {
      
      if (originalRequest.url.includes('/refresh')) {
        console.error("Manager Refresh token invalid. Redirecting...");
        history.push('/'); // manager login page
        window.location.reload();
        return Promise.reject(error);
      }

      if (!isRefreshing) {
        isRefreshing = true;
        originalRequest._retry = true;
        try {
          console.log("Trying manager refresh...");
          await managerAxios.get('/refresh');
          isRefreshing = false;
          return managerAxios(originalRequest);
        } catch (refreshError) {
          console.error("Manager refresh token expired:", refreshError);
          isRefreshing = false;
          history.push('/');
          window.location.reload();
          return Promise.reject(refreshError);
        }
      }
    }

    return Promise.reject(error);
  }
);

export default managerAxios;
