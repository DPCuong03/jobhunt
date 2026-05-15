import axios, { AxiosInstance } from "axios";

const api: AxiosInstance = axios.create({
  baseURL: "/api/proxy",
  withCredentials: true,
});

// Track refresh state to prevent multiple simultaneous refresh attempts
let isRefreshing = false;
let failedQueue: Array<{
  onSuccess: () => void;
  onFailed: (error: any) => void;
}> = [];

const processQueue = (error: any = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.onFailed(error);
    } else {
      prom.onSuccess();
    }
  });

  failedQueue = [];
};

/**
 * Request interceptor - log requests for debugging
 */
api.interceptors.request.use(
  (config) => {
    console.log(
      `API Request: ${config.method?.toUpperCase()} ${config.baseURL}${config.url}`,
    );
    return config;
  },
  (error) => Promise.reject(error),
);

/**
 * Response interceptor - handle errors and token refresh
 */
api.interceptors.response.use(
  (response) => {
    console.log(
      `API Response: ${response.status} ${response.config.baseURL}${response.config.url}`,
    );
    return response;
  },
  async (error) => {
    const originalRequest = error.config as any;

    if (error.response) {
      console.error(
        `API Error: ${error.response.status} ${originalRequest.url} - ${error.response.data?.message || error.message}`,
      );
    } else if (error.request) {
      console.error(
        `Network Error: ${originalRequest.url} - No response received`,
        error.message,
      );
    } else {
      console.error(`Request Error: ${error.message}`);
    }

    // Don't retry refresh endpoint itself
    if (originalRequest.url?.includes("/auth/refresh-token")) {
      console.log("Refresh endpoint failed - not retrying");
      return Promise.reject(error);
    }

    // Handle 401 (Unauthorized) - attempt token refresh
    if (error.response?.status === 401 && !originalRequest._retry) {
      console.log(
        "Got 401 - attempting token refresh for:",
        originalRequest.url,
      );

      if (isRefreshing) {
        console.log("Token refresh already in progress - queuing request");
        return new Promise((resolve, reject) => {
          failedQueue.push({
            onSuccess: () => {
              console.log(
                "Retrying queued request after refresh:",
                originalRequest.url,
              );
              resolve(api(originalRequest));
            },
            onFailed: (err: any) => {
              console.error("Queued request failed:", originalRequest.url);
              reject(err);
            },
          });
        });
      }

      isRefreshing = true;
      originalRequest._retry = true;

      try {
        console.log("🔄 Attempting to refresh token...");
        await axios.post(
          "/api/proxy/auth/refresh-token",
          {},
          { withCredentials: true },
        );
        console.log("✅ Token refresh successful");
        isRefreshing = false;
        processQueue();

        // Retry original request
        console.log("Retrying original request:", originalRequest.url);
        return api(originalRequest);
      } catch (refreshError) {
        console.error("Token refresh failed");
        isRefreshing = false;
        processQueue(refreshError);

        // Clear user from localStorage and redirect
        localStorage.removeItem("user");
        if (typeof window !== "undefined") {
          const currentPath = window.location.pathname;
          const isOnLoginPage =
            currentPath === "/login" || currentPath === "/admin/login";
          if (!isOnLoginPage) {
            window.location.href = currentPath.startsWith("/admin")
              ? "/admin/login"
              : "/login";
          }
        }

        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  },
);

export default api;
