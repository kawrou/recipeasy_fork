import createFetchMock from "vitest-fetch-mock";
import { describe, vi, expect, test, it, beforeEach } from "vitest";
import apiClient from "../../src/services/apiClient";
import { promiseHandler } from "../../src/services/promiseHandler";

createFetchMock(vi).enableMocks();

vi.mock("../../src/services/promiseHandler", () => {
  const promiseHandlerMock = vi.fn();
  return {
    promiseHandler: promiseHandlerMock,
  };
});

describe("apiClient tests", () => {
  beforeEach(() => {
    fetch.resetMocks();
  });

  test("calls the backend API with correct parameters", async () => {
    fetch.mockResponseOnce(JSON.stringify({ message: "success" }), {
      status: 201,
    });

    const testUrl = "backend/url";
    const requestOptions = {
      method: "GET",
      headers: {
        Authorization: "Bearer token",
      },
    };

    await apiClient(testUrl, requestOptions);

    const fetchArguments = fetch.mock.lastCall;
    const url = fetchArguments[0];
    const options = fetchArguments[1];

    expect(url).toEqual(testUrl);
    expect(options.method).toEqual("GET");
  });

  test("successful request returns data", async () => {
    fetch.mockResponseOnce(
      JSON.stringify({ recipeData: ["recipe"], message: "success" }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      },
    );

    const testUrl = "backend/url";
    const requestOptions = {
      method: "GET",
      headers: {
        Authorization: "Bearer token",
      },
    };

    const response = await apiClient(testUrl, requestOptions);

    expect(response.message).toBe("success");
    expect(response.recipeData[0]).toBe("recipe");
  });

  it("handles errors", async () => {
    fetch.mockRejectOnce(new Error("fake error message"));

    const testUrl = "backend/url";
    const requestOptions = {
      method: "GET",
      headers: {
        Authorization: "Bearer token",
      },
    };

    await expect(apiClient(testUrl, requestOptions)).rejects.toThrow(
      "error message",
    );
  });

  it("handles authentication", async () => {
    const promiseHandlerMock = promiseHandler;
    promiseHandlerMock
      .mockResolvedValueOnce({
        success: true,
        data: {
          json: async () => ({ token: "newAccessToken" }),
        },
      })
      .mockResolvedValueOnce({
        success: true,
        data: {
          json: async () => ({ recipeData: ["recipe"], message: "success" }),
        },
      });

    fetch.mockResponseOnce(
      JSON.stringify({
        message: "unauthorized",
      }),
      {
        status: 401,
      },
    );

    const testUrl = "backend/url";
    const requestOptions = {
      method: "GET",
      headers: {
        Authorization: "Bearer token",
      },
    };

    const response = await apiClient(testUrl, requestOptions);

    expect(response.message).toBe("success");
    expect(response.recipeData[0]).toBe("recipe");
  });
});
