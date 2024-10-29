import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi, describe, beforeEach, test, expect } from "vitest";
import { CreateRecipePage } from "../../../src/pages/RecipePage/CreateRecipePage";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { AuthProvider } from "../../../src/context/AuthProvider";

const user = userEvent.setup();

describe("Validation errors", () => {
  test("empty recipe name", async () => {
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

    const recipeNameValidationMessage = screen.getByText(
      "Please enter a recipe name.",
    );

    expect(recipeNameValidationMessage).toBeVisible();
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
});
