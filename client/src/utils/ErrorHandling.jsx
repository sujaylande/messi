import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8000', // Your API base URL
  withCredentials: true, // Important for sending cookies
});

let navigate;

// Initialize navigate outside the interceptor (needs to be within a component context)
export const setupAuthInterceptor = (routerNavigate) => {
  navigate = routerNavigate;
};

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Token is likely expired or invalid
      console.log("Unauthorized request - logging out");
      // Clear any user-related state in your application (e.g., Redux, Zustand, Context)
      localStorage.removeItem('authToken'); // Example: Remove auth token from local storage
      // Redirect the user to the login page
      if (navigate) {
        navigate('/login');
      } else {
        console.error("Navigate function not initialized in interceptor.");
        // Optionally, you could try to reload the page as a fallback
        // window.location.reload();
      }
    }
    return Promise.reject(error);
  }
);

export default api;