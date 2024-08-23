import { describe, expect, test, vi } from "vitest";
import { signUp } from "../../src/services/user";
import { axiosPublic } from "../../src/api/axios";

vi.mock("../../src/api/axios");

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

describe("signUp", () => {
  test("calls the API with correct path, method, body and content-type", async () => {
    const testEmail = "test@testEmail.com";
    const testPassword = "12345678";
    const testUsername = "testUser";

    axiosPublic.post.mockResolvedValue("", {
      status: 201,
    });

    await signUp(testEmail, testPassword, testUsername);

    expect(axiosPublic.post).toHaveBeenCalled(
      "/your/endpoint",
      { email: testEmail, password: testPassword, username: testUsername },
      {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      },
    );
  });

  test("returns nothing if the signUp request was a success", async () => {
    const testEmail = "test@testEmail.com";
    const testPassword = "12345678";
    const testUsername = "testUser";

    axiosPublic.post.mockResolvedValue("", {
      status: 201,
    });

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

    axiosPublic.post.mockResolvedValue(
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
