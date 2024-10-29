import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi, describe, beforeEach, test, expect } from "vitest";
import { RecipeInstruction } from "../../src/components/RecipePage/RecipeFields/RecipeInstruction";

const setInstructionStub = vi.fn();

const errors = {
  recipeName: "Please fill in this instruction.",
};

describe("Validation errors", () => {
  test("renders validation error message", () => {
    render(
      <RecipeInstruction
        index={0}
        instruction={""}
        setInstruction={setInstructionStub}
        removeInstruction={vi.fn()}
        editMode={true}
        error={true}
      />,
    );
    screen.debug();
    expect(screen.getByText("Please enter a recipe name.")).toBeVisible();
  });
});
