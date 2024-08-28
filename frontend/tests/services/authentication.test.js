import createFetchMock from "vitest-fetch-mock";
import { describe, vi, expect, test, beforeEach } from "vitest";
import { logIn, logOut, refresh } from "../../src/services/authentication";
import { axiosPublic } from "../../src/api/axios";
import { authStore } from "../../src/api/authStore";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

// Mock fetch function
createFetchMock(vi).enableMocks();

vi.mock("../../src/api/authStore");

vi.mock("../../src/api/axios", () => {
  const axiosPublicMock = {
    post: vi.fn(),
  };
  return { axiosPublic: axiosPublicMock };
});

describe("authentication service", () => {
  // beforeEach(() => {
  //   vi.resetAllMocks();
  // });

  describe("login", () => {
    test("calls the backend API with correct parameters", async () => {
      const testUsername = "testUser";
      const testPassword = "12345678";

      axiosPublic.post.mockResolvedValue({ data: { token: "test token" } });

      await logIn(testUsername, testPassword);

      // This is an array of the arguments that were last passed to fetch
      const fetchArguments = axiosPublic.post.mock.lastCall;
      const url = fetchArguments[0];
      const data = fetchArguments[1];
      const config = fetchArguments[2];

      expect(url).toEqual("/tokens");
      expect(axiosPublic.post).toHaveBeenCalled();
      expect(data).toEqual({
        username: testUsername,
        password: testPassword,
      });
      expect(config).toEqual({
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      });
    });

    test("returns a token if the request was a success", async () => {
      const testUsername = "testUser";
      const testPassword = "12345678";

      axiosPublic.post.mockResolvedValue({ data: { token: "test token" } });

      await logIn(testUsername, testPassword);

      expect(authStore.setAccessToken).toHaveBeenCalledWith("test token");
    });

    test("throws an error if the request failed", async () => {
      const testUsername = "testUser";
      const testPassword = "12345678";

      axiosPublic.post.mockRejectedValue({
        response: {
          data: { message: "Please check your login details." },
          status: 401,
        },
      });

      await expect(logIn(testUsername, testPassword)).rejects.toThrow(
        "Please check your login details.",
      );
    });

    test("throws an error if no username or password was provided", async () => {
      await expect(logIn()).rejects.toThrow(
        "Username and password are required.",
      );
    });
  });

  describe("logOut", () => {
    test("calls the backend API with correct params", async () => {
      axiosPublic.post.mockResolvedValue({
        data: { message: "Log out successful" },
      });

      await logOut();

      // This is an array of the arguments that were last passed to fetch
      const fetchArguments = axiosPublic.post.mock.lastCall;
      const url = fetchArguments[0];
      const config = fetchArguments[2];

      expect(axiosPublic.post).toHaveBeenCalled();
      expect(url).toEqual("/tokens/logout");
      expect(config).toEqual({
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      });
    });

    test("Logs a user out", async () => {
      axiosPublic.post.mockResolvedValue({
        data: { message: "Logged out successfully." },
      });

      const response = await logOut();
      expect(authStore.clearAccessToken).toHaveBeenCalled();
      expect(response).toEqual("Logged out successfully.");
    });

    test("throws an error for network errors", async () => {
      axiosPublic.post.mockRejectedValue();
      await expect(logOut()).rejects.toThrow("No Server Response");
    });
  });
  // describe("checkToken", () => {
  //   //res.json({ message: 'Token is valid' });
  //   test("sends the correct request to backend url", async () => {
  //     fetch.mockResponseOnce(
  //       JSON.stringify({
  //         status: 200,
  //       }),
  //     );
  //     await checkToken("valid_token");

  //     const fetchArguments = fetch.mock.lastCall;
  //     const url = fetchArguments[0];
  //     const options = fetchArguments[1];

  //     expect(url).toEqual(`${BACKEND_URL}/tokens`);
  //     expect(options.method).toEqual("GET");
  //     expect(options.headers["Authorization"]).toEqual("Bearer valid_token");
  //   });

  //   test("when token is invalid, response is 401 auth error", async () => {
  //     fetch.mockResponseOnce(JSON.stringify({ message: "auth error" }), {
  //       status: 401,
  //     });
  //     await expect(checkToken("invalid_token")).rejects.toThrowError(
  //       "Token not valid",
  //     );
  //   });

  //   test("handles error if request failed", async () => {
  //     fetch.mockRejectOnce(new Error("Internal Server Error"));
  //     await expect(checkToken("invalid_token")).rejects.toThrowError(
  //       "Internal Server Error",
  //     );
  //   });
  // });
  describe("refresh", () => {
    test("calls the backend API with correct params", async () => {
      fetch.mockResponseOnce(
        JSON.stringify({ token: "testToken", message: "Access token issued." }),
        {
          status: 201,
        },
      );

      await refresh();

      // This is an array of the arguments that were last passed to fetch
      const fetchArguments = fetch.mock.lastCall;
      const url = fetchArguments[0];
      const options = fetchArguments[1];

      expect(url).toEqual(`${BACKEND_URL}/tokens/refresh`);
      expect(options.method).toEqual("POST");
      expect(options.credentials).toEqual("include");
    });

    test("returns an access token if the request was successful", async () => {
      fetch.mockResponseOnce(
        JSON.stringify({ token: "testToken", message: "Access token issued." }),
        {
          status: 201,
        },
      );

      const response = await refresh();

      expect(response).toEqual({ token: "testToken" });
    });

    test("throws an error if the request failed", async () => {
      fetch.mockResponseOnce(JSON.stringify({ message: "Forbidden." }), {
        status: 403,
      });

      await expect(refresh()).rejects.toThrow("Forbidden.");
    });
  });
});
