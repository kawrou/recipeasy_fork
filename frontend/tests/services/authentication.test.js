import createFetchMock from "vitest-fetch-mock";
import { describe, vi, expect, test } from "vitest";
import { logIn, logOut, refresh } from "../../src/services/authentication";
import { axiosPublic } from "../../src/api/axios";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

// Mock fetch function
createFetchMock(vi).enableMocks();

vi.mock("../../src/api/axios");

const TEST_USERNAME = "testUser";
const TEST_PASSWORD = "12345678";

describe("authentication service", () => {
  describe("logIn", () => {
    test("calls the backend API with correct params", async () => {
      axiosPublic.post.mockResolvedValue({
        data: { token: "testToken" },
        status: 201,
      });

      const response = await logIn(TEST_USERNAME, TEST_PASSWORD);

      expect(axiosPublic.post).toHaveBeenCalledOnce();
      expect(axiosPublic.post).toHaveBeenCalledWith(
        "/tokens",
        { username: TEST_USERNAME, password: TEST_PASSWORD },
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );

      expect(response).toEqual("testToken");
    });

    test("throws an error if the request failed", async () => {
      axiosPublic.post.mockRejectedValue({
        response: {
          data: { message: "Please check your login details." },
          status: 401,
        },
      });

      await expect(logIn(TEST_USERNAME, TEST_PASSWORD)).rejects.toThrow(
        "Please check your login details."
      );
    });

    test("throws an error if no username or password was provided", async () => {
      await expect(logIn()).rejects.toThrow(
        "Username and password are required."
      );
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
        }
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
        }
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

  describe("logOut", () => {
    test("calls the backend API with correct params", async () => {
      fetch.mockResponseOnce(
        JSON.stringify({ token: "testToken", message: "Access token issued." }),
        {
          status: 201,
        }
      );

      await logOut();

      // This is an array of the arguments that were last passed to fetch
      const fetchArguments = fetch.mock.lastCall;
      const url = fetchArguments[0];
      const options = fetchArguments[1];

      expect(url).toEqual(`${BACKEND_URL}/tokens/logout`);
      expect(options.method).toEqual("POST");
      expect(options.credentials).toEqual("include");
    });
    test("Logs a user out", async () => {
      fetch.mockResponseOnce(
        JSON.stringify({ message: "Logged out successfully. Cookie cleared." }),
        {
          status: 200,
        }
      );

      const response = await logOut();
      expect(response.message).toEqual(
        "Logged out successfully. Cookie cleared."
      );
    });
    test("handles 204 status by returning a message", async () => {
      fetch.mockResponseOnce(null, {
        status: 204,
      });

      const response = await logOut();
      expect(response.message).toEqual("Logged out successfully.");
    });
    test("throws an error for network errors", async () => {
      fetch.mockRejectOnce(
        new Error("Network error: Failed to connect to server.")
      );

      await expect(refresh()).rejects.toThrow(
        "Network error: Failed to connect to server."
      );
    });
  });
});
