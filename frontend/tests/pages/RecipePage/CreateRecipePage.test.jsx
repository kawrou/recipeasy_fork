import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi, describe, beforeEach, test, expect, it} from "vitest";
import { CreateRecipePage } from "../../../src/pages/RecipePage/CreateRecipePage";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { AuthProvider } from "../../../src/context/AuthProvider";

const user = userEvent.setup();

describe("Validation errors:", () => {
  test.each([
    ["Please enter a recipe name.", "recipe name"],
    ["Please fill out all the instructions.", "recipe instruction"],
    ["Please fill out the missing ingredients.", "recipe ingredient"],
  ])("shows '%s' when saving with an empty %s", async (message, field) => {
    render(
      <MemoryRouter initialEntries={["/recipes/create"]}>
        <AuthProvider>
          <Routes>
            <Route path="/recipes/create" element={<CreateRecipePage />} />
          </Routes>
        </AuthProvider>
      </MemoryRouter>,
    );

    const saveBtn = screen.getByRole("button", { name: "Save" });
    await user.click(saveBtn);

    const validationMessage = screen.getByText(message);

    expect(validationMessage).toBeVisible();
  });

  test("emtpy recipe name validation message disappears after input", async () => {
    render(
      <MemoryRouter initialEntries={["/recipes/create"]}>
        <AuthProvider>
          <Routes>
            <Route path="/recipes/create" element={<CreateRecipePage />} />
          </Routes>
        </AuthProvider>
      </MemoryRouter>,
    );
    const recipeNameField = screen.getByRole("textbox", {
      name: "recipe-name",
    });
    const saveBtn = screen.getByRole("button", { name: "Save" });
    await user.click(saveBtn);

    const recipeNameValidationMessage = screen.getByText(
      "Please enter a recipe name.",
    );

    expect(recipeNameValidationMessage).toBeVisible();

    await user.type(recipeNameField, "Recipe Name");
    expect(recipeNameValidationMessage).not.toBeVisible();
  });

  test.each([
    // [
    //   "recipe name",
    //   "textbox",
    //   "recipe-name",
    //   "Please enter a recipe name.",
    //   "Recipe Name",
    // ],
    [
      "instruction",
      "button",
      "add-new-instruction-field",
      "textbox",
      "recipe-instruction-1",
      "Please fill out all the instructions.",
      "Instruction 1",
    ],
    [
      "ingredient",
      "button",
      "add-new-ingredient-field",
      "textbox",
      "ingredient-1",
      "Please fill out the missing ingredients.",
      "Ingredient 1",
    ],
  ])(
    "empty %s validation message disappears after input",
    async (title, role, name, role2, name2, message, text) => {
      render(
        <MemoryRouter initialEntries={["/recipes/create"]}>
          <AuthProvider>
            <Routes>
              <Route path="/recipes/create" element={<CreateRecipePage />} />
            </Routes>
          </AuthProvider>
        </MemoryRouter>,
      );

      const addBtn = screen.getByRole(role, { name: name });
      await user.click(addBtn);

      const textInput = screen.getByRole(role2, { name: name2 });

      const saveBtn = screen.getByRole("button", { name: "Save" });
      await user.click(saveBtn);

      const validationMsg = screen.getByText(message);

      expect(validationMsg).toBeVisible();

      await user.type(textInput, text);
      expect(validationMsg).not.toBeVisible();
    },
  );
});
