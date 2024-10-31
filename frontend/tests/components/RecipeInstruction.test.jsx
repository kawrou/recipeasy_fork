import { render, screen } from "@testing-library/react";
import { vi, describe, test, expect } from "vitest";
import { RecipeInstruction } from "../../src/components/RecipePage/RecipeFields/RecipeInstruction";

const setInstructionStub = vi.fn();
const removeInstructionStub = vi.fn();

describe("RecipeInstruction component test", () => {
  test("renders a button if in edit mode", () => {
    render(
      <RecipeInstruction
        index={0}
        instruction={""}
        setInstruction={setInstructionStub}
        removeInstruction={removeInstructionStub}
        editMode={true}
        error={null}
      />,
    );

    const removeInstructionButton = screen.getByRole("button");
    expect(removeInstructionButton).toBeVisible();
  });

  test("renders a text area if in edit mode", () => {
    render(
      <RecipeInstruction
        index={0}
        instruction={""}
        setInstruction={setInstructionStub}
        removeInstruction={removeInstructionStub}
        editMode={true}
        error={null}
      />,
    );
    const textArea = screen.getByRole("textbox");
    expect(textArea).toBeVisible();
  });

  test("renders the instruction when not in edit mode", () => {
    render(
      <RecipeInstruction
        index={0}
        instruction={"first instruction"}
        setInstruction={setInstructionStub}
        removeInstruction={removeInstructionStub}
        editMode={false}
        error={null}
      />,
    );
    const instruction = screen.getByText("first instruction");
    expect(instruction).toBeVisible();
    expect(screen.queryByRole("textbox")).not.toBeInTheDocument();
  });
});
