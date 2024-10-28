import createFetchMock from "vitest-fetch-mock";
import { describe, vi, expect, it, beforeEach } from "vitest";
import { logIn, logOut, refresh } from "../../src/services/authentication";
import { axiosPrivate, axiosPublic } from "../../src/api/axios";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

// Mock fetch function
createFetchMock(vi).enableMocks();

vi.mock("../../src/api/axios");

const TEST_USERNAME = "testUser";
const TEST_PASSWORD = "12345678";

const successfulLogin = {
  success: true,
  response: { data: { token: "jwt-token" } },
};

const unsuccessfulLogin = {
  success: false,
  error: { message: "Please check your login details." },
};

describe("authentication service", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("logIn", () => {
    it("calls the backend API with correct params", async () => {
      axiosPublic.post.mockResolvedValue({
        data: { token: "jwt-token" },
      });

      const response = await logIn(TEST_USERNAME, TEST_PASSWORD);

      expect(axiosPublic.post).toHaveBeenCalledOnce();
      expect(axiosPublic.post).toHaveBeenCalledWith("/tokens", {
        username: TEST_USERNAME,
        password: TEST_PASSWORD,
      });

      expect(response).toEqual(successfulLogin);
    });

    it("returns an error object if the request failed", async () => {
      axiosPublic.post.mockRejectedValue({
        response: {
          data: { message: "Please check your login details." },
          status: 401,
        },
      });

      const response = await logIn(TEST_USERNAME, TEST_PASSWORD);
      expect(response).toEqual(unsuccessfulLogin);
    });

    it("returns an error object if no username or password was provided", async () => {
      const response = await logIn();
      expect(response).toEqual({
        success: false,
        error: { message: "Username and password are required." },
      });
    });
  });

  describe("refresh", () => {
    it("calls the backend API with correct params", async () => {
      // fetch.mockResponseOnce(
      //   JSON.stringify({ token: "testToken", message: "Access token issued." }),
      //   {
      //     status: 201,
      //   },
      // );
      axiosPrivate.post.mockResolvedValue({ data: { token: "jwt-token" } });

      await refresh();

      expect(axiosPublic.post).toHaveBeenCalledOnce();
      expect(axiosPublic.post).toHaveBeenCalledWith("/tokens/refresh");
      // This is an array of the arguments that were last passed to fetch
      // const fetchArguments = fetch.mock.lastCall;
      // const url = fetchArguments[0];
      // const options = fetchArguments[1];

      // expect(url).toEqual(`${BACKEND_URL}/tokens/refresh`);
      // expect(options.method).toEqual("POST");
      // expect(options.credentials).toEqual("include");
    });

    it("returns a success object with an access token if the request was successful", async () => {
      axiosPublic.post.mockResolvedValue({
        data: { token: "jwt-token", message: "Access token issued." },
      });

      const response = await refresh();

      expect(response).toEqual({
        success: true,
        response: {
          data: { token: "jwt-token", message: "Access token issued." },
        },
      });
    });

    it("returns an error object if the request failed", async () => {
      axiosPublic.post.mockRejectedValue({
        response: {
          data: { message: "Unauthorised" },
        },
      });

      const response = await refresh();

      expect(response).toEqual({
        success: false,
        error: { message: "Unauthorised" },
      });
    });
  });

  describe("logOut", () => {
    it("calls the backend API with correct params", async () => {
      axiosPrivate.post.mockResolvedValue({
        message: "Logged out successfully. Cookie cleared.",
      });

      await logOut();

      expect(axiosPrivate.post).toHaveBeenCalledOnce();
      expect(axiosPrivate.post).toHaveBeenCalledWith("/tokens/logout");
    });

    it("Logs a user out", async () => {
      axiosPrivate.post.mockResolvedValue({
        message: "Logged out successfully. Cookie cleared.",
      });

      const response = await logOut();
      expect(response).toEqual({
        success: true,
        response: { message: "Logged out successfully. Cookie cleared." },
      });
    });

    it("returns an error object for network errors", async () => {
      axiosPrivate.post.mockRejectedValue({});
      const response = await logOut();
      expect(response).toEqual({
        success: false,
        error: {
          message:
            "An unexpected error occurred. Please check your internet connection or try again later.",
        },
      });
    });
  });
});
