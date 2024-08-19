import { refresh } from "../../../api/controllers/authentication";
import { errorHandler } from "./errorHandler";
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const apiClient = async (url, options = {}) => {
  let token;
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

      token = refreshResponse.data.token;
    }

    const requestOptions = {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    response = await errorHandler(fetch(url, requestOptions));

    if (response.success === false) {
      throw new Error(response.error);
    }

    const data = await response.data.json();
    return data;
  } catch (error) {
    throw new Error(error.message);
  }
};

export default apiClient;
