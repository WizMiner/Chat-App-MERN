import axios from "axios";

// Creating an instance of Axios with default configurations
export const axiosInstance = axios.create({
  // Base URL for all API requests
  baseURL: "http://localhost:5000/api",
  
  // Ensures that cookies are included in cross-site requests
  withCredentials: true,
});

// Explanation:
// 1. `baseURL`: Sets a common prefix for all API calls. This eliminates the need to specify the full URL every time you make a request.
//    Example: If you use `axiosInstance.get("/auth")`, the actual request URL will be `http://localhost:5000/api/auth`.
//
// 2. `withCredentials`: Ensures cookies and authentication credentials are sent with requests.
//    Useful for handling sessions or other secure, authenticated operations in your backend.
//
// Usage Example:
// axiosInstance.post("/auth/login", { email: "user@example.com", password: "password123" })
//   .then(response => console.log(response.data))
//   .catch(error => console.error(error));
