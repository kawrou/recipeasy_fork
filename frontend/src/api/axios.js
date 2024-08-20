import axios from "axios";
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

export default axios.create({
  baseURL: BACKEND_URL || "https://localhost:3000",
});

export const axiosPrivate = axios.create({
  baseURL: BACKEND_URL || "https://localhost:3000",
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
});
