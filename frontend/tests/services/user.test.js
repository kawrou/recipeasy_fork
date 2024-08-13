import createFetchMock from "vitest-fetch-mock";
import { describe, vi, expect, test } from "vitest";
import { signUp } from "../../src/services/user";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

// Mock fetch function
createFetchMock(vi).enableMocks();

describe("signUp", () => {
  test("calls the API with correct path, method, body and content-type", async () => {
    const testEmail = "test@testEmail.com";
    const testPassword = "12345678";
    const testUsername = "testUser";

    fetch.mockResponseOnce("", {
      status: 201,
    });

    await signUp(testEmail, testPassword, testUsername);

    // This is an array of the arguments that were last passed to fetch
    const fetchArguments = fetch.mock.lastCall;
    const url = fetchArguments[0];
    const options = fetchArguments[1];

    expect(url).toEqual(`${BACKEND_URL}/users`);
    expect(options.method).toEqual("POST");
    expect(options.body).toEqual(
      JSON.stringify({
        email: testEmail,
        password: testPassword,
        username: testUsername,
      }),
    );
    expect(options.headers["Content-Type"]).toEqual("application/json");
  });

  test("returns nothing if the signUp request was a success", async () => {
    const testEmail = "test@testEmail.com";
    const testPassword = "12345678";
    const testUsername = "testUser";

    fetch.mockResponseOnce(JSON.stringify(""), {
      status: 201,
    });

    const response = await signUp(testEmail, testPassword, testUsername);
    expect(response).toEqual(undefined);
  });

  test("throws an error if not all fields are supplied", async () => {
    const testEmail = "test@testEmail.com";
    const testPassword = "12345678";
    const testUsername = "";

    // fetch.mockResponseOnce(JSON.stringify({ message: "User already exists" }), {
    //   status: 400,
    // });

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

    fetch.mockResponseOnce(
      JSON.stringify({ message: "Username or email already exists." }),
      {
        status: 409,
      },
    );

    try {
      await signUp(testEmail, testPassword, testUsername);
    } catch (err) {
      expect(err.message).toEqual("Username or email already exists.");
    }
  });
});
