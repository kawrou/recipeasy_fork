import { render, screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { FavouriteButton } from "../../src/components/RecipePage/FavouriteButton";
import { vi, beforeEach, describe, test, expect } from "vitest";
import useAxiosPrivate from "../../src/hooks/useAxiosPrivate";

vi.mock("../../src/hooks/useAxiosPrivate", () => {
  const axiosPrivateMock = {
    patch: vi.fn(),
  };
  return {
    default: () => axiosPrivateMock,
  };
});
const user = userEvent.setup();

describe("When a user clicks the button:", () => {
  const axiosPrivateMock = useAxiosPrivate();
  beforeEach(() => {
    vi.clearAllMocks();
    render(<FavouriteButton recipeId={"1234"} favourited={false} />);
  });

  test("unfavourited becomes favourited", async () => {
    axiosPrivateMock.patch.mockResolvedValue();

    const favouriteBtn = screen.getByRole("button", {
      name: "favourite-button",
    });

    expect(screen.getByLabelText("reg-heart-icon")).toBeVisible();
    await user.click(favouriteBtn);
    expect(screen.getByLabelText("heart-icon")).toBeVisible();
  });

  test("favourited becomes unfavourited", async () => {
    axiosPrivateMock.patch.mockResolvedValue();

    const favouriteBtn = screen.getByRole("button", {
      name: "favourite-button",
    });

    await user.click(favouriteBtn);
    expect(screen.getByLabelText("heart-icon")).toBeVisible();

    await user.click(favouriteBtn);
    expect(screen.getByLabelText("reg-heart-icon")).toBeVisible();
    expect(axiosPrivateMock.patch).toHaveBeenCalledTimes(2);
  });

  test("heart icon doesn't toggle if there is an error", async () => {
    const favouriteBtn = screen.getByRole("button", {
      name: "favourite-button",
    });
    axiosPrivateMock.patch.mockRejectedValue();

    await user.click(favouriteBtn);
    expect(screen.queryByLabelText("heart-icon")).not.toBeInTheDocument();
    expect(screen.getByLabelText("reg-heart-icon")).toBeVisible();
  });
});
