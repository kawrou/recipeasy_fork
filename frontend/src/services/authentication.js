import { axiosPrivate, axiosPublic } from "../api/axios";
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
 * @description Takes a username and password param and makes a fetch request.
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

  const res = await promiseHandler(axiosPublic.post("/tokens", data));
  return res;
};

/**
 * @description Uses the http-only cookie to retrieve a JWT access token.
 * @returns {Promise<PromiseResponse>}
 */
export const refresh = async () => {
  const res = await promiseHandler(axiosPublic.post("/tokens/refresh"));
  return res;
};

export const logOut = async () => {
  const res = await promiseHandler(axiosPrivate.post("/tokens/logout"));
  return res;
};
