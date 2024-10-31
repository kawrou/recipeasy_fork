import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi, describe, beforeEach, test, expect, it } from "vitest";
import { IngredientList } from "../../src/components/RecipePage/RecipeFields/IngredientList";

const user = userEvent.setup();

let recipeIngredients = [""];

//This doesn't work correctly
const setRecipeIngredients = (el) => {
  recipeIngredients[0] += el;
};

describe("Ingredient list - conditional rendering tests", () => {
  test("doesn't render an input field for recipe ingredients in edit mode", () => {
    render(
      <IngredientList
        recipeIngredients={["first ingredient"]}
        setRecipeIngredients={vi.fn()}
        editMode={false}
        error={null}
        updateErrors={vi.fn()}
      />,
    );

    const ingredient = screen.getByText("first ingredient");
    expect(ingredient).toBeVisible();
    expect(screen.queryByRole("textbox")).not.toBeInTheDocument();
  });

  test("renders a text area, remove ingredient button, and add ingredient button in edit mode", () => {
    render(
      <IngredientList
        recipeIngredients={["first ingredient"]}
        setRecipeIngredients={vi.fn()}
        editMode={true}
        error={null}
        updateErrors={vi.fn()}
      />,
    );

    const textArea = screen.getByRole("textbox");
    const addIngredientBtn = screen.getByLabelText("add-new-ingredient-field");
    const removeIngredientBtn = screen.getByLabelText("remove-ingredient-1");
    expect(textArea).toBeVisible();
    expect(addIngredientBtn).toBeVisible();
    expect(removeIngredientBtn).toBeVisible();
  });

  test("renders a button in edit mode", () => {
    render(
      <IngredientList
        recipeIngredients={["first ingredient"]}
        setRecipeIngredients={vi.fn()}
        editMode={true}
        error={null}
        updateErrors={vi.fn()}
      />,
    );

    const textArea = screen.getByRole("textbox");
    expect(textArea).toBeVisible();
  });
});

describe("Ingredient list - validation UI handling", () => {
  beforeEach(() => {
    recipeIngredients = [""];
  });

  it("Shows a validation message when adding an input field whilst previous one is empty", async () => {
    render(<IngredientList recipeIngredients={[""]} editMode={true} />);
    const addInputFieldBtn = screen.getByRole("button", {
      name: "add-new-ingredient-field",
    });

    await user.click(addInputFieldBtn);

    expect(
      screen.getByText(
        "Please fill in all previous fields before adding a new ingredient.",
      ),
    ).toBeVisible();
  });

  test("validation message disappears after inputting text", async () => {
    render(
      <IngredientList
        setRecipeIngredients={setRecipeIngredients}
        recipeIngredients={recipeIngredients}
        editMode={true}
        updateErrors={vi.fn()}
      />,
    );
    const addInputFieldBtn = screen.getByRole("button", {
      name: "add-new-ingredient-field",
    });

    await user.click(addInputFieldBtn);
    const validationMsg = screen.getByText(
      "Please fill in all previous fields before adding a new ingredient.",
    );

    expect(validationMsg).toBeVisible();
    const inputField = screen.getByRole("textbox");

    await user.type(inputField, "first");
    expect(validationMsg).not.toBeVisible();
  });

  test("validation message disappears after removing input field", async () => {
    render(
      <IngredientList
        setRecipeIngredients={setRecipeIngredients}
        recipeIngredients={recipeIngredients}
        editMode={true}
        updateErrors={vi.fn()}
      />,
    );

    const addInputFieldBtn = screen.getByRole("button", {
      name: "add-new-ingredient-field",
    });

    const removeInputFieldBtn = screen.getByRole("button", {
      name: "remove-ingredient-1",
    });

    await user.click(addInputFieldBtn);
    const validationMsg = screen.getByText(
      "Please fill in all previous fields before adding a new ingredient.",
    );

    expect(validationMsg).toBeVisible();

    await user.click(removeInputFieldBtn);
    expect(validationMsg).not.toBeVisible();
  });
});
