import { axiosPublic } from "../api/axios";
import { promiseHandler } from "./promiseHandler";

// docs: https://vitejs.dev/guide/env-and-mode.html
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
const LOGIN_URL = "/tokens";

/**
 * @typedef {Object} PromiseResponse
 * @property {boolean} success - Indicates if the operation was successful.
 * @property {Object} [response] - The data returned if the operation was successful.
 * @property {Object} [error] - An object containing error details if the operation failed.
 * @property {string} error.message - The error message associated with the error.
 */

/**
 * @description - Takes a username and password param and makes a fetch request.
 * @async
 * @param {string} username - The username of the user.
 * @param {string} password - The password of the user.
 * @returns {Promise<PromiseResponse>} A promise that resolves to an object indicating the success status and user authentication or error information.
 */
export const logIn = async (username, password) => {
  if (!username || !password) {
    return {
      success: false,
      error: { message: "Username and password are required." },
    };
  }
  const data = { username, password };

  const res = await promiseHandler(axiosPublic.post(`${LOGIN_URL}`, data));
  return res;
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

export const logOut = async () => {
  const requestOptions = {
    method: "POST",
    credentials: "include",
  };

  try {
    const response = await fetch(
      `${BACKEND_URL}/tokens/logout`,
      requestOptions,
    );

    if (!response.ok) {
      const error = await response.json();
      console.log(error.message);
      throw new Error(error.message);
    }

    if (response.status === 204) {
      console.log("Logged out successfull.");
      return { message: "Logged out successfully." };
    }

    const data = await response.json();
    console.log(data.message);
    return { message: data.message };
  } catch (err) {
    console.log(err);
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
