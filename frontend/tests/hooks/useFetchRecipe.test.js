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
    vi.resetAllMocks();
  });

  it("fetches recipes from DB when token is present", async () => {
    const mockRecipes = [
      { _id: "12345", title: "Test Recipe 1", duration: "45" },
      { _id: "23456", title: "Test Recipe 2", duration: "35" },
    ];

    const axiosPrivateMock = useAxiosPrivate();
    axiosPrivateMock.get.mockResolvedValue({ data: { data: mockRecipes } });
    const { result } = renderHook(() => useFetchRecipes());

    await act(async () => {
      await result.current.fetchRecipes("/recipes");
    });

    await waitFor(() => {
      expect(axiosPrivateMock.get).toHaveBeenCalledWith("/recipes");
      expect(result.current.loading).toBeFalsy();
      expect(result.current.error).toBeFalsy();
      expect(result.current.data).toEqual(mockRecipes);
    });
  });

  it("returns an error for 401 status", async () => {
    const axiosPrivateMock = useAxiosPrivate();
    axiosPrivateMock.get.mockRejectedValue({ response: { status: 401 } });
    const { result } = renderHook(() => useFetchRecipes());

    await act(async () => {
      await result.current.fetchRecipes("/recipes");
    });

    await waitFor(() => {
      expect(result.current.loading).toBeFalsy();
      expect(result.current.error.type).toBe("auth-error");
      expect(result.current.error.message).toBe(
        "Unauthorized access. Please log in again.",
      );
      expect(result.current.data).toEqual([]);
      expect(axiosPrivateMock.get).toHaveBeenCalled();
    });
  });

  it("returns an error for 403 status", async () => {
    const axiosPrivateMock = useAxiosPrivate();
    axiosPrivateMock.get.mockRejectedValue({ response: { status: 403 } });
    const { result } = renderHook(() => useFetchRecipes());

    await act(async () => {
      await result.current.fetchRecipes("/recipes");
    });

    await waitFor(() => {
      expect(result.current.loading).toBeFalsy();
      expect(result.current.error.type).toBe("auth-error");
      expect(result.current.error.message).toBe(
        "Unauthorized access. Please log in again.",
      );
      expect(result.current.data).toEqual([]);
      expect(axiosPrivateMock.get).toHaveBeenCalled();
    });
  });

  it("returns an error when no response", async () => {
    const axiosPrivateMock = useAxiosPrivate();
    const { result } = renderHook(() => useFetchRecipes());

    await act(async () => {
      await result.current.fetchRecipes("/recipes");
    });

    await waitFor(() => {
      expect(result.current.loading).toBeFalsy();
      expect(result.current.error.type).toBe("no-server-response");
      expect(result.current.error.message).toBe(
        "No Server Response. Please check your internet connection or try again later.",
      );
      expect(result.current.data).toEqual([]);
      expect(axiosPrivateMock.get).toHaveBeenCalled();
    });
  });
});
