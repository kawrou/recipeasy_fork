import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi, describe, beforeEach, test, expect } from "vitest";
import { RecipeName } from "../../src/components/RecipePage/RecipeFields/RecipeName";

const setNameStub = vi.fn();

const errors = {
  recipeName: "Please enter a recipe name.",
};

describe("Validation errors", () => {
  test("renders validation error message", () => {
    render(
      <RecipeName
        name={""}
        setName={setNameStub}
        editMode={true}
        error={errors.recipeName}
      />,
    );
    screen.debug();
    expect(screen.getByText("Please enter a recipe name.")).toBeVisible();
  });
});
