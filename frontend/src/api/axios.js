import axios from "axios";
import { authStore } from "./authStore";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

export const axiosPublic = axios.create({
  baseURL: BACKEND_URL || "https://localhost:3000",
});

export const axiosPrivate = axios.create({
  baseURL: BACKEND_URL || "https://localhost:3000",
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
});

axiosPublic.interceptors.request.use((config) => {
  return config;
});

axiosPrivate.interceptors.request.use(
  (config) => {
    if (!config.headers["Authorization"]) {
      const accessToken = authStore.getAccessToken();
      config.headers["Authorization"] = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => {
    Promise.reject(error);
  }
);

axiosPrivate.interceptors.response.use(
  (response) => response,

  async (error) => {
    const prevRequest = error?.config;

    if (error?.response.status === 401 && !prevRequest?.sent) {
      prevRequest.sent = true;
      const newAccessToken = await refresh();
      prevRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;
      return axiosPrivate(prevRequest);
    }

    return Promise.reject(error);
  }
);

const refresh = async () => {
  const response = await axiosPublic.post("/tokens/refresh", {
    withCredentials: true,
  });
  console.log("prev", JSON.stringify(authStore.getAccessToken));
  console.log("refresh", response.data.token);
  authStore.setAccessToken(response.data.token);
  return response.data.token;
};
