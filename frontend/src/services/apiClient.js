import { refresh } from "../../../api/controllers/authentication";
import { errorHandler } from "./errorHandler";
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const apiClient = async (url, options = {}) => {
  let token;
  try {
    let response = await fetch(url, options);

    if (response.status === 401) {
      try {
        const refreshResponse = await fetch(`${BACKEND_URL}/tokens/refresh`, {
          method: "POST",
          credentials: "include",
        });

        const access = await refreshResponse.json();

        token = access.token;
      } catch (error) {
        throw new Error(error.message);
      }
    }

    const requestOptions = {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    response = await fetch(url, requestOptions);

    const data = await response.json();
    return data;
  } catch (error) {
    throw new Error(error.message);
  }
};

export default apiClient;
