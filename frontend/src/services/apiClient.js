import { errorHandler } from "./errorHandler";
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const apiClient = async (url, options = {}) => {
  try {
    let response = await fetch(url, options);

    if (response.ok) {
      const data = await response.json();
      return data;
    }

    if (response.status === 401) {
      const refreshResponse = await errorHandler(
        fetch(`${BACKEND_URL}/tokens/refresh`, {
          method: "POST",
          credentials: "include",
        }),
      );

      if (refreshResponse.success === false) {
        throw new Error(refreshResponse.error);
      }

      const data = await refreshResponse.data.json();
      const token = data.token;
      options.headers = {
        ...options.headers,
        Authorization: `Bearer ${token}`,
      };
      response = await errorHandler(fetch(url, options));

      if (response.success === false) {
        throw new Error(response.error);
      }

      return await response.data.json();
    }
  } catch (error) {
    throw new Error(error.message);
  }
};

export default apiClient;
