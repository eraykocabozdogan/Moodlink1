import axios, { AxiosInstance, InternalAxiosRequestConfig } from "axios";
import { TokenService } from "@/common/services/TokenService";
import config from "@/common/config";

// Event system for logout
let logoutCallback: (() => Promise<void>) | null = null;

export const setLogoutCallback = (callback: () => Promise<void>) => {
  logoutCallback = callback;
};

export const ApiService: AxiosInstance = axios.create({
  baseURL: config.API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request Interceptor: Add Authorization header and log the request
ApiService.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    console.log(
      `[API Request] ==> ${config.method?.toUpperCase()} ${config.baseURL}${
        config.url
      }`
    );
    const token = await TokenService.getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor: Handle 401 errors and log responses/errors
ApiService.interceptors.response.use(
  (response) => {
    console.log(
      `[API Response] <== ${
        response.status
      } ${response.config.method?.toUpperCase()} ${response.config.url}`
    );
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // Check if the error is 401 and it's not a retry request
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true; // Mark to avoid infinite loops
      console.error(
        "Authentication Error: Token is invalid or expired. Logging out."
      );

      // Use the callback if it's set
      if (logoutCallback) {
        try {
          await logoutCallback();
        } catch (logoutError) {
          console.error("Logout callback failed:", logoutError);
        }
      }

      if (error.response) {
        console.error(
          `[API Error] <== ${
            error.response.status
          } ${error.config.method?.toUpperCase()} ${error.config.url}`,
          error.response.data
        );
      } else if (error.request) {
        console.error("[API Error] No response received:", error.request);
      } else {
        console.error("[API Error] Error setting up request:", error.message);
      }

      // Reject the original request to stop the chain
      return Promise.reject(new Error("Session expired. Please log in again."));
    }

    return Promise.reject(error);
  }
);

export default ApiService;
