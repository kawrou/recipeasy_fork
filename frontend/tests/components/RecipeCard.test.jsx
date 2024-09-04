import { render, screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { vi, describe, test, expect } from "vitest";
import RecipeCard from "../../src/components/Recipe/RecipeCard";
import { MemoryRouter } from "react-router-dom";
import useAxiosPrivate from "../../src/hooks/useAxiosPrivate";

vi.mock("../../src/hooks/useAxiosPrivate", () => {
  const mockAxiosPrviate = {
    patch: vi.fn(),
  };

  return {
    default: () => mockAxiosPrviate,
  };
});

const user = userEvent.setup();

const mockRecipe = {
  _id: "1234",
  image: "some_url",
  name: "testName",
  totalTime: 10,
  favouritedByOwner: false,
};

describe("Post", async () => {
  const mockAxiosPrivate = useAxiosPrivate();

  test("it renders the card", async () => {
    mockAxiosPrivate.patch.mockResolvedValue();

    render(
      <MemoryRouter>
        <RecipeCard recipe={mockRecipe} />
      </MemoryRouter>,
    );

    expect(screen.getByLabelText("reg-heart-icon")).toBeVisible();

    const favBtn = screen.getByRole("button");
    await user.click(favBtn);

    expect(screen.getByLabelText("heart-icon")).toBeVisible();
  });
});
