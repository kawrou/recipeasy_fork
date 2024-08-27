import { renderHook, waitFor, act } from "@testing-library/react";
import { useFetchRecipes } from "../../src/hooks/useFetchRecipe";
import { beforeEach, vi, describe, it, expect } from "vitest";
// import { getAllRecipes } from "../../src/services/recipes";
import { axiosPrivate } from "../../src/api/axios";

// vi.mock("../../src/services/recipes", () => {
//   const getAllRecipesMock = vi.fn();
//   return { getAllRecipes: getAllRecipesMock };
// });

vi.mock("../../src/api/axios", () => {
  const axiosPrivateMock = {
    get: vi.fn(),
  };
  return { axiosPrivate: axiosPrivateMock };
});

describe("useFetchRecipe hook:", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });
  it("fetches recipes from DB when token is present", async () => {
    const mockRecipes = {
      recipes: [
        { _id: "12345", title: "Test Recipe 1", duration: "45" },
        { _id: "23456", title: "Test Recipe 2", duration: "35" },
      ],
    };

    axiosPrivate.get.mockResolvedValueOnce({ data: mockRecipes });
    const { result } = renderHook(() => useFetchRecipes());

    await act(async () => {
      await result.current.fetchRecipes();
    });

    await waitFor(() => {
      expect(result.current.loading).toBeFalsy();
      expect(result.current.error).toEqual({});
      expect(result.current.recipes).toEqual(mockRecipes.recipes);
    });
  });

  it("sets error message for 401 or 403 status", async () => {
    const { result } = renderHook(() => useFetchRecipes());
    axiosPrivate.get.mockRejectedValueOnce({ response: { status: 401 } });

    await act(async () => {
      await result.current.fetchRecipes();
    });

    await waitFor(() => {
      expect(result.current.loading).toBeFalsy();
      expect(result.current.error).toEqual({
        type: "auth-error",
        message: "Unauthorized access. Please log in again.",
      });
      expect(result.current.recipes).toEqual([]);
    });
  });

  it("sets error message for no server response", async () => {
    const { result } = renderHook(() => useFetchRecipes());

    await act(async () => {
      await result.current.fetchRecipes();
    });

    await waitFor(() => {
      expect(result.current.loading).toBeFalsy();
      expect(result.current.error).toEqual({
        type: "no-server-response",
        message:
          "No Server Response. Please check your internet connection or try again later.",
      });
      expect(result.current.recipes).toEqual([]);
    });
  });

  it("sets a generic error message for other types of errors", async () => {
    const { result } = renderHook(() => useFetchRecipes());
    axiosPrivate.get.mockRejectedValueOnce({ response: { status: 500 } });

    await act(async () => {
      await result.current.fetchRecipes();
    });

    await waitFor(() => {
      expect(result.current.loading).toBeFalsy();
      expect(result.current.error).toEqual({
        type: "unexpected-error",
        message: "An unexpected error occurred.",
      });
      expect(result.current.recipes).toEqual([]);
    });
  });

  it("sets a loading state", async () => {
    const { result } = renderHook(() => useFetchRecipes());

    expect(result.current.loading).toBeTruthy();
  });
});
