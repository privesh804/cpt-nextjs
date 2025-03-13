"use client";

import axios, {
  AxiosInstance,
  InternalAxiosRequestConfig,
  AxiosResponse,
  AxiosError,
} from "axios";
import { secureStorage } from "@/utils/crypto";
import { getAuth } from "@/utils/auth-helper";

// Function to get base URL dynamically based on user role
const getBaseURL = async (): Promise<string> => {
  const { hostname } = window.location;
  const isLocal = hostname.includes("localhost");
  const isSubdomain = hostname.split(".").length > (isLocal ? 1 : 2);
  const [protocol, domain] = process.env.NEXT_PUBLIC_API_URL?.split(
    "https://"
  ) || ["https://", hostname];

  const subdomainPrefix = isSubdomain ? `${hostname.split(".")[0]}.` : "";
  const baseURL = `https://${protocol}${subdomainPrefix}${domain}`;

  return isLocal
    ? `${baseURL}${isSubdomain ? "/tenant" : ""}`
    : isSubdomain
    ? `${baseURL}/tenant`
    : baseURL;
};

// Create an Axios instance with default base URL
const apiClient: AxiosInstance = axios.create({
  timeout: 30000,
});

// Request Interceptor: Attach Authorization header if token exists
apiClient.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    const token = await getAuth();
    await getBaseURL().then((baseURL) => {
      config.baseURL = baseURL;
    });
    if (token) {
      config.headers["Authorization"] = `Bearer ${token.token}`;
    }
    return config;
  },
  (error: AxiosError) => {
    console.error("Request Error: ", error);
    return Promise.reject(error);
  }
);

// Response Interceptor: Handle the response or errors
apiClient.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error: AxiosError<any>) => {
    if (error.response?.status === 401) {
      console.error("Unauthorized Access. Token may have expired.");
      secureStorage.removeItem("role");
    }
    console.error("Response Error: ", error.response || error.message);
    return Promise.reject(error);
  }
);

export default apiClient;
