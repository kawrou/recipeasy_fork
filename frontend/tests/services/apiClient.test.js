import createFetchMock from "vitest-fetch-mock";
import { describe, vi, expect, test, it } from "vitest";
import apiClient from "../../src/services/apiClient";

createFetchMock(vi).enableMocks();

describe.skip("apiClient tests", () => {
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
    fetch
      .mockResponseOnce(
        JSON.stringify({
          message: "unauthorized",
        }),
        {
          status: 401,
        },
      )
      .mockResponseOnce(
        JSON.stringify({
          token: "accessToken",
          message: "Access token issued.",
        }),
        {
          status: 201,
          headers: { "Content-Type": "application/json" },
        },
      )
      .mockResponseOnce(
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
});
