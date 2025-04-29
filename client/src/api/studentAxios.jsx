// // src/api/axiosInstance.js
// import axios from 'axios';
// import { createBrowserHistory } from 'history';

// const history = createBrowserHistory();

// const axiosInstance = axios.create({
//   baseURL: 'http://localhost:5001/api/student', // Your backend URL
//   withCredentials: true,
// });

// let isRefreshing = false;

// axiosInstance.interceptors.response.use(
//   (response) => response,
//   async (error) => {
//     const originalRequest = error.config;

//     if (error.response && error.response.status === 401 && !originalRequest._retry) {
      
//       // ⚠️ Important: Prevent infinite loops by checking if it's a refresh call itself
//       if (originalRequest.url.includes('/refresh')) {
//         console.error("Refresh token invalid. Redirecting to login...");
//         history.push('/');
//         window.location.reload();
//         return Promise.reject(error);
//       }

//       if (!isRefreshing) {
//         isRefreshing = true;
//         originalRequest._retry = true;
//         try {
//           console.log("Trying refresh token...");
//           await axiosInstance.get('/refresh'); // Try refresh token
//           isRefreshing = false;
//           return axiosInstance(originalRequest); // Retry the original request
//         } catch (refreshError) {
//           console.error("Refresh token expired or invalid:", refreshError);
//           isRefreshing = false;
//           history.push('/');
//           window.location.reload();
//           return Promise.reject(refreshError);
//         }
//       }
//     }

//     return Promise.reject(error);
//   }
// );

// export default axiosInstance;


// src/api/studentAxios.js
import axios from 'axios';
import { createBrowserHistory } from 'history';

const history = createBrowserHistory();

const studentAxios = axios.create({
  baseURL: 'http://localhost:8080/api/student',
  withCredentials: true,
});

let isRefreshing = false;

studentAxios.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response && error.response.status === 401 && !originalRequest._retry) {
      
      if (originalRequest.url.includes('/refresh')) {
        console.error("Student Refresh token invalid. Redirecting...");
        history.push('/'); // student login page
        window.location.reload();
        return Promise.reject(error);
      }

      if (!isRefreshing) {
        isRefreshing = true;
        originalRequest._retry = true;
        try {
          console.log("Trying student refresh...");
          await studentAxios.get('/refresh');
          isRefreshing = false;
          return studentAxios(originalRequest);
        } catch (refreshError) {
          console.error("Student refresh token expired:", refreshError);
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

export default studentAxios;
