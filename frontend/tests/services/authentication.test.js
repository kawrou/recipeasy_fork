import createFetchMock from "vitest-fetch-mock";
import { describe, vi, expect, test, beforeEach } from "vitest";
import { login, logOut, checkToken } from "../../src/services/authentication";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

// Mock fetch function
createFetchMock(vi).enableMocks();

describe("authentication service", () => {
  describe("login", () => {
    test("calls the backend API with correct parameters", async () => {
      const testUsername = "testUser";
      const testPassword = "12345678";

      fetch.mockResponseOnce(JSON.stringify({ token: "testToken" }), {
        status: 201,
      });

      await login(testUsername, testPassword);

      // This is an array of the arguments that were last passed to fetch
      const fetchArguments = fetch.mock.lastCall;
      const url = fetchArguments[0];
      const options = fetchArguments[1];

      expect(url).toEqual(`${BACKEND_URL}/tokens`);
      expect(options.method).toEqual("POST");
      expect(options.body).toEqual(
        JSON.stringify({ username: testUsername, password: testPassword }),
      );
      expect(options.headers["Content-Type"]).toEqual("application/json");
    });

    test("returns the token if the request was a success", async () => {
      const testEmail = "test@testEmail.com";
      const testPassword = "12345678";

      fetch.mockResponseOnce(
        JSON.stringify({ token: "testToken", message: "Login successful." }),
        {
          status: 201,
        },
      );

      const response = await login(testEmail, testPassword);
      expect(response).toEqual({
        token: "testToken",
      });
    });

    test("throws an error if the request failed", async () => {
      const testEmail = "test@testEmail.com";
      const testPassword = "12345678";

      fetch.mockResponseOnce(
        JSON.stringify({ message: "Please check your login details." }),
        {
          status: 401,
        },
      );

      try {
        await login(testEmail, testPassword);
      } catch (err) {
        expect(err.message).toEqual("Please check your login details.");
      }
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

  describe("logOut", () => {
    test("Logs a user out", async () => {
      fetch.mockResponseOnce(
        JSON.stringify({ message: "Logged out successfully. Cookie cleared." }),
        {
          status: 200,
        },
      );

      const response = await logOut();
      expect(response.message).toEqual(
        "Logged out successfully. Cookie cleared.",
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
        new Error("Network error: Failed to connect to server"),
      );
      try {
        await logOut();
      } catch (err) {
        expect(err.message).toEqual(
          "Network error: Failed to connect to server",
        );
      }
    });
  });
});
