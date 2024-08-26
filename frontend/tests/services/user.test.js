import createFetchMock from "vitest-fetch-mock";
import { describe, vi, expect, test } from "vitest";
import { signUp } from "../../src/services/user";
import { axiosPublic } from "../../src/api/axios";
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

vi.mock("../../src/api/axios", () => {
  const mockAxiosPublic = {
    post: vi.fn(),
  };
  return {
    axiosPublic: mockAxiosPublic,
  };
});


describe("signUp", () => {
  test("calls the API with correct path, method, body and content-type", async () => {
    const testEmail = "test@testEmail.com";
    const testPassword = "12345678";
    const testUsername = "testUser";

    axiosPublic.post.mockResolvedValueOnce({ message: "success" });

    await signUp(testEmail, testPassword, testUsername);

    // This is an array of the arguments that were last passed to fetch
    const fetchArguments = axiosPublic.post.mock.lastCall;

    const url = fetchArguments[0];
    const data = fetchArguments[1];
    const config = fetchArguments[2];

    expect(url).toEqual("/users");
    expect(data).toEqual({
      email: testEmail,
      password: testPassword,
      username: testUsername,
    });
    expect(config.headers["Content-Type"]).toBe("application/json");
  });

  test("returns nothing if the signUp request was a success", async () => {
    const testEmail = "test@testEmail.com";
    const testPassword = "12345678";
    const testUsername = "testUser";

    axiosPublic.post.mockResolvedValueOnce({ message: "success" });

    const response = await signUp(testEmail, testPassword, testUsername);
    expect(response).toEqual(undefined);
  });

  test("throws an error if not all fields are supplied", async () => {
    const testEmail = "test@testEmail.com";
    const testPassword = "12345678";
    const testUsername = "";

    try {
      await signUp(testEmail, testPassword, testUsername);
    } catch (err) {
      expect(err.message).toEqual("All fields are required.");
    }
  });

  test("throws an error if the request failed", async () => {
    const testEmail = "test@testEmail.com";
    const testPassword = "12345678";
    const testUsername = "testUser";

    axiosPublic.post.mockRejectedValueOnce({
      response: {
        status: 409,
        data: { message: "Username or email already exists." },
      },
    });

    try {
      await signUp(testEmail, testPassword, testUsername);
    } catch (err) {
      expect(err.message).toEqual("Username or email already exists.");
    }
  });
});
