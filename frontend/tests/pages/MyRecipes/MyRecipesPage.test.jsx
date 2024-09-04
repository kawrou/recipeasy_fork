import { render, screen } from "@testing-library/react";
import { vi, expect, describe, test, beforeEach } from "vitest";
import { MyRecipesPage } from "../../../src/pages/MyRecipes/MyRecipesPage";
import { useFetchRecipes } from "../../../src/hooks/useFetchRecipe";
import { AuthProvider } from "../../../src/context/AuthProvider";

// MOCKS
// Mocking React Router's useNavigate function
vi.mock("react-router-dom", () => {
  const navigateMock = vi.fn();
  const useNavigateMock = () => navigateMock; // Create a mock function for useNavigate
  return { useNavigate: useNavigateMock, Link: vi.fn() };
});

// Mocking useFetchRecipe
vi.mock("../../../src/hooks/useFetchRecipe");

// Mocking RecipeCard
vi.mock(
  "../../../src/components/Recipe/RecipeCard",
  () => (
    console.log("MyRecipesPage- Unit Tesst: RecipeCard mock called"),
    {
      default: ({ recipe }) => (
        <div>
          <h2>{recipe.title}</h2>
          <p data-testid="recipe duration">{recipe.duration}</p>
        </div>
      ),
    }
  )
);

describe("My Recipes Page", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  test("renders collection and recipes from db", async () => {
    useFetchRecipes.mockReturnValue({
      data: [
        { _id: "12345", title: "Recipe 1", duration: "45" },
        { _id: "23456", title: "Recipe 2", duration: "60" },
      ],
      loading: false,
      error: {},
      fetchRecipes: vi.fn(),
    });

    render(
      <AuthProvider>
        <MyRecipesPage />
      </AuthProvider>,
    );

    const recipeTitles = screen.getAllByRole("heading", { level: 2 });
    const recipeDurations = screen.getAllByTestId("recipe duration");

    expect(recipeTitles[1]).toHaveTextContent("Recipe 1");
    expect(recipeTitles[2]).toHaveTextContent("Recipe 2");
    expect(recipeDurations[0]).toHaveTextContent("45");
    expect(recipeDurations[1]).toHaveTextContent("60");
  });

  test("renders a message when recipes is undefined", async () => {
    useFetchRecipes.mockReturnValue({
      recipes: undefined,
      loading: false,
      error: {},
      fetchRecipes: vi.fn(),
    });

    render(
      <AuthProvider>
        <MyRecipesPage />
      </AuthProvider>,
    );

    expect(screen.getByLabelText("Empty Recipes")).toBeVisible();
  });

  test("renders a message when recipes is an empty array", async () => {
    useFetchRecipes.mockReturnValue({
      recipes: [],
      loading: false,
      error: {},
      fetchRecipes: vi.fn(),
    });

    render(
      <AuthProvider>
        <MyRecipesPage />
      </AuthProvider>,
    );

    expect(screen.getByLabelText("Empty Recipes")).toBeVisible();
  });

  test("renders a loading message when loading is true", async () => {
    useFetchRecipes.mockReturnValue({
      recipes: [],
      loading: true,
      error: {},
      fetchRecipes: vi.fn(),
    });

    render(
      <AuthProvider>
        <MyRecipesPage />
      </AuthProvider>,
    );

    expect(screen.getByLabelText("Loading message")).toBeVisible();
  });
});
