import axios from "axios";

export const axiosInstance = axios.create({
  baseURL:
    import.meta.env.MODE === "development"
      ? "http://localhost:5001/api"
      : "/api",
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
