import { renderHook, waitFor, act } from "@testing-library/react";
import { useFetchRecipes } from "../../src/hooks/useFetchRecipe";
import { beforeEach, vi, describe, it, expect } from "vitest";
import useAxiosPrivate from "../../src/hooks/useAxiosPrivate";

vi.mock("../../src/hooks/useAxiosPrivate", () => {
  const axiosPrivateMock = {
    get: vi.fn(),
  };

  return {
    default: () => axiosPrivateMock,
  };
});

describe("useFetchRecipe hook:", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("fetches recipes from DB when token is present", async () => {
    const mockRecipes = [
      { _id: "12345", title: "Test Recipe 1", duration: "45" },
      { _id: "23456", title: "Test Recipe 2", duration: "35" },
    ];

    const axiosPrivateMock = useAxiosPrivate();
    axiosPrivateMock.get.mockResolvedValue({ data: { recipes: mockRecipes } });
    const { result } = renderHook(() => useFetchRecipes());

    await act(async () => {
      await result.current.fetchRecipes();
    });

    await waitFor(() => {
      expect(axiosPrivateMock.get).toHaveBeenCalledWith("/recipes");
      expect(result.current.loading).toBeFalsy();
      expect(result.current.error).toBeFalsy();
      expect(result.current.recipes).toEqual(mockRecipes);
    });
  });

  it("returns an error", async () => {
    const axiosPrivateMock = useAxiosPrivate();
    axiosPrivateMock.get.mockRejectedValue(new Error("test error"));
    const { result } = renderHook(() => useFetchRecipes());

    await act(async () => {
      await result.current.fetchRecipes();
    });

    await waitFor(() => {
      expect(result.current.loading).toBeFalsy();
      expect(result.current.error).toEqual(true);
      expect(result.current.recipes).toEqual([]);
      expect(axiosPrivateMock.get).toHaveBeenCalled();
    });
  });
});
