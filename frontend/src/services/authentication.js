import { axiosPublic } from "../api/axios";
import { authStore } from "../api/authStore";

// docs: https://vitejs.dev/guide/env-and-mode.html
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
const LOGIN_URL = "/tokens";
const LOGOUT_URL = "/tokens/logout";
export const logIn = async (username, password) => {
  if (!username || !password) {
    throw new Error("Username and password are required.");
  }

  const data = { username, password };

  const config = {
    headers: { "Content-Type": "application/json" },
    withCredentials: true,
  };

  try {
    const response = await axiosPublic.post(`${LOGIN_URL}`, data, config);
    authStore.setAccessToken(response?.data?.token);
  } catch (err) {
    if (!err?.response) {
      throw new Error("No Server Response");
    }

    if (err?.response.status === 401 || err?.response.status === 400) {
      throw new Error(err.response.data.message);
    }
    throw err;
  }
};

export const logOut = async () => {
  const config = {
    headers: { "Content-Type": "application/json" },
    withCredentials: true,
  };

  try {
    const response = await axiosPublic.post(LOGOUT_URL, {}, config);
    authStore.clearAccessToken();
    console.log(response.data.message);
    return response.data.message;
  } catch (err) {
    if (!err?.response) {
      throw new Error("No Server Response");
    }
    throw err;
  }
};

export const refresh = async () => {
  const requestOptions = {
    method: "POST",
    credentials: "include",
  };

  try {
    const response = await fetch(
      `${BACKEND_URL}/tokens/refresh`,
      requestOptions,
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message);
    }
    const data = await response.json();
    return { token: data.token };
  } catch (err) {
    throw new Error(err.message);
  }
};

//TODO: Possibly unecessary method:
export const checkToken = async (token) => {
  const requestOptions = {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  //TODO:
  //Refactor to use try/catch block
  // console.log(token)
  const response = await fetch(`${BACKEND_URL}/tokens`, requestOptions);
  if (!response.ok) {
    const error = new Error("Token not valid");
    error.response = response;
    throw error;
  }
};
