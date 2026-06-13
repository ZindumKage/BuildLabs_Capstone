import axios, { AxiosError } from "axios";

/** Base URL — swap this for your deployed FastAPI URL via env var */
const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000/api/v1";

export const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: { "Content-Type": "application/json" },
  timeout: 10_000,
});

// ─── Request interceptor: attach JWT ────────────────────────────────────────
apiClient.interceptors.request.use(
  (config) => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("access_token");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ─── Response interceptor: surface errors cleanly ───────────────────────────
apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError<{ detail?: string | { msg: string }[] }>) => {
    if (error.response?.status === 401) {
      // Token expired or invalid — clear storage and redirect
      if (typeof window !== "undefined") {
        localStorage.removeItem("access_token");
        window.location.href = "/login";
      }
    }

    // Normalise FastAPI validation errors into a readable string
    const detail = error.response?.data?.detail;
    let message = "An unexpected error occurred.";
    if (typeof detail === "string") {
      message = detail;
    } else if (Array.isArray(detail)) {
      message = detail.map((d) => d.msg).join(", ");
    }

    return Promise.reject(new Error(message));
  }
);
