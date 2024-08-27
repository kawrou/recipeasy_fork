import { act, render, screen } from "@testing-library/react";
import { vi, describe, test, expect, it, beforeEach } from "vitest";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Route, Routes } from "react-router-dom";

import { MyRecipesPage } from "../../../src/pages/MyRecipes/MyRecipesPage";
import { CreateRecipePage } from "../../../src/pages/RecipePage/CreateRecipePage";
import { LoginPage } from "../../../src/pages/Login/LoginPage";
import { SingleRecipePage } from "../../../src/pages/RecipePage/SingleRecipePage";
import { axiosPrivate } from "../../../src/api/axios";

vi.mock("../../../src/api/axios", () => {
  const axiosPrivateMock = {
    get: vi.fn(),
  };
  return { axiosPrivate: axiosPrivateMock };
});

const handleScrapeRecipeMock = vi.fn();
const setRecipeDataMock = vi.fn();
const setUrlMock = vi.fn();
const handleUrlChangeMock = vi.fn();

const user = userEvent.setup();

describe("When My Recipes Page is first rendered", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it("renders fetched recipes", async () => {
    axiosPrivate.get.mockResolvedValue({
      data: {
        recipes: [
          { _id: 1, name: "test recipe 1", totalTime: 45, image: "test_url" },
          { _id: 2, name: "test recipe 2", totalTime: 30, image: "test_url" },
        ],
      },
    });

    await act(async () => {
      render(
        <MemoryRouter initialEntries={["/myrecipes"]}>
          <Routes>
            <Route
              path="/myrecipes"
              element={
                <MyRecipesPage
                  handleScrapeRecipe={handleScrapeRecipeMock}
                  url={""}
                  setUrl={setUrlMock}
                  handleUrlChange={handleUrlChangeMock}
                />
              }
            />
          </Routes>
        </MemoryRouter>,
      );
    });

    const recipeTitles = screen.getAllByRole("heading", { level: 2 });

    expect(recipeTitles.length).toEqual(3);
    expect(recipeTitles[1]).toHaveTextContent("test recipe 1");
    expect(recipeTitles[2]).toHaveTextContent("test recipe 2");
  });

  it("shows a message when recipes is undefined", async () => {
    axiosPrivate.get.mockReturnValue({ data: { recipes: undefined } });

    await act(async () => {
      render(
        <MemoryRouter initialEntries={["/myrecipes"]}>
          <Routes>
            <Route
              path="/myrecipes"
              element={
                <MyRecipesPage
                  handleScrapeRecipe={handleScrapeRecipeMock}
                  url={""}
                  setUrl={setUrlMock}
                  handleUrlChange={handleUrlChangeMock}
                />
              }
            />
          </Routes>
        </MemoryRouter>,
      );
    });

    const recipeMsg = screen.getByLabelText("Empty Recipes");
    expect(recipeMsg).toHaveTextContent("Start saving recipes!");
    expect(recipeMsg).toBeVisible();
  });

  it("shows a message when recipes is an empty array", async () => {
    axiosPrivate.get.mockReturnValue({ data: { recipes: [] } });

    await act(async () => {
      render(
        <MemoryRouter initialEntries={["/myrecipes"]}>
          <Routes>
            <Route
              path="/myrecipes"
              element={
                <MyRecipesPage
                  handleScrapeRecipe={handleScrapeRecipeMock}
                  url={""}
                  setUrl={setUrlMock}
                  handleUrlChange={handleUrlChangeMock}
                />
              }
            />
          </Routes>
        </MemoryRouter>,
      );
    });

    const recipeMsg = screen.getByLabelText("Empty Recipes");
    expect(recipeMsg).toHaveTextContent("Start saving recipes!");
    expect(recipeMsg).toBeVisible();
  });

  it("navigates to login if request returns a 401 or 403", async () => {
    axiosPrivate.get.mockRejectedValue({ response: { status: 401 } });

    await act(async () => {
      render(
        <MemoryRouter initialEntries={["/myrecipes"]}>
          <Routes>
            <Route
              path="/myrecipes"
              element={
                <MyRecipesPage
                  handleScrapeRecipe={handleScrapeRecipeMock}
                  url={""}
                  setUrl={setUrlMock}
                  handleUrlChange={handleUrlChangeMock}
                />
              }
            />
            <Route path="/login" element={<LoginPage />} />
          </Routes>
        </MemoryRouter>,
      );
    });
    const myRecipesH2El = screen.queryByRole("heading", {
      level: 2,
      name: "My Recipes",
    });
    expect(myRecipesH2El).not.toBeInTheDocument();

    const loginPageH1El = screen.getByRole("heading", { level: 1 });
    expect(loginPageH1El).toBeVisible();
  });

  it("shows loading message if loading", async () => {
    axiosPrivate.get.mockImplementation(() => {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve({
            recipes: [
              { _id: 1, name: "test recipe 1", totalTime: 45 },
              { _id: 2, name: "test recipe 2", totalTime: 30 },
            ],
            token: "returned token",
          });
        }, 1000);
      });
    });

    await act(async () => {
      render(
        <MemoryRouter initialEntries={["/myrecipes"]}>
          <Routes>
            <Route
              path="/myrecipes"
              element={
                <MyRecipesPage
                  handleScrapeRecipe={handleScrapeRecipeMock}
                  url={""}
                  setUrl={setUrlMock}
                  handleUrlChange={handleUrlChangeMock}
                />
              }
            />
          </Routes>
        </MemoryRouter>,
      );
    });

    const loadingMsg = screen.getByLabelText("Loading message");
    expect(loadingMsg).toBeVisible();
    expect(loadingMsg).toHaveTextContent("Loading ...");
  });

  it("shows error message for no server response", async () => {
    await act(async () => {
      render(
        <MemoryRouter initialEntries={["/myrecipes"]}>
          <Routes>
            <Route
              path="/myrecipes"
              element={
                <MyRecipesPage
                  handleScrapeRecipe={handleScrapeRecipeMock}
                  url={""}
                  setUrl={setUrlMock}
                  handleUrlChange={handleUrlChangeMock}
                />
              }
            />
            <Route path="/login" element={<LoginPage />} />
          </Routes>
        </MemoryRouter>,
      );
    });

    const errMessage = screen.getByLabelText("error message");
    expect(errMessage).toBeVisible();
  });

  it("shows error message for response codes that aren't 401 or 43", async () => {
    axiosPrivate.get.mockRejectedValue({ response: { status: 500 } });

    await act(async () => {
      render(
        <MemoryRouter initialEntries={["/myrecipes"]}>
          <Routes>
            <Route
              path="/myrecipes"
              element={
                <MyRecipesPage
                  handleScrapeRecipe={handleScrapeRecipeMock}
                  url={""}
                  setUrl={setUrlMock}
                  handleUrlChange={handleUrlChangeMock}
                />
              }
            />
            <Route path="/login" element={<LoginPage />} />
          </Routes>
        </MemoryRouter>,
      );
    });

    const errMessage = screen.getByLabelText("error message");
    expect(errMessage).toBeVisible();
  });
});

describe("When a user clicks on:", () => {
  test("generate recipe btn, it navigates to recipe page", async () => {
    axiosPrivate.get.mockResolvedValue({
      data: {
        recipes: [],
      },
    });

    await act(async () => {
      render(
        <MemoryRouter initialEntries={["/myrecipes"]}>
          <Routes>
            <Route
              path="/myrecipes"
              element={
                <MyRecipesPage
                  handleScrapeRecipe={handleScrapeRecipeMock}
                  url={""}
                  setUrl={setUrlMock}
                  handleUrlChange={handleUrlChangeMock}
                />
              }
            />
            <Route path="/recipes/create" element={<CreateRecipePage />} />
          </Routes>
        </MemoryRouter>,
      );
    });

    const generateRecipeBtn = screen.getByRole("button", { name: "Generate" });
    await user.click(generateRecipeBtn);

    const yieldEl = screen.getByText("Serves");
    const tagsEl = screen.getByText("Tags:");
    const recipeSaveBtn = screen.getByRole("button", { name: "Save" });

    expect(yieldEl).toBeVisible();
    expect(tagsEl).toBeVisible();
    expect(recipeSaveBtn).toBeVisible();
  });

  test("enter Manually btn, it navigates to recipe page", async () => {
    axiosPrivate.get.mockResolvedValue({
      data: {
        recipes: [],
      },
    });

    await act(async () => {
      render(
        <MemoryRouter initialEntries={["/myrecipes"]}>
          <Routes>
            <Route
              path="/myrecipes"
              element={
                <MyRecipesPage
                  handleScrapeRecipe={handleScrapeRecipeMock}
                  url={""}
                  setUrl={setUrlMock}
                  handleUrlChange={handleUrlChangeMock}
                  setRecipeData={setRecipeDataMock}
                />
              }
            />
            <Route path="/recipes/create" element={<CreateRecipePage />} />
          </Routes>
        </MemoryRouter>,
      );
    });

    const generateRecipeBtn = screen.getByRole("button", { name: "Manually" });
    await user.click(generateRecipeBtn);

    const yieldEl = screen.getByText("Serves");
    const tagsEl = screen.getByText("Tags:");
    const recipeSaveBtn = screen.getByRole("button", { name: "Save" });

    expect(yieldEl).toBeVisible();
    expect(tagsEl).toBeVisible();
    expect(recipeSaveBtn).toBeVisible();
  });

  //TODO: Research how to check URL, otherwise I'll need to mock getRecipeById. Or there might be a way to check if the Link was called with the correct URL
  test.todo("a recipe card, it navigates to that recipe's page", async () => {
    axiosPrivate.get.mockResolvedValue({
      data: {
        recipes: [
          { _id: 1, name: "test recipe 1", totalTime: 45, image: "test_url" },
          { _id: 2, name: "test recipe 2", totalTime: 30, image: "test_url" },
        ],
      },
    });

    await act(async () => {
      render(
        <MemoryRouter initialEntries={["/myrecipes"]}>
          <Routes>
            <Route
              path="/myrecipes"
              element={
                <MyRecipesPage
                  handleScrapeRecipe={handleScrapeRecipeMock}
                  setRecipeData={setRecipeDataMock}
                  setUrl={setUrlMock}
                />
              }
            />
            <Route path="/recipes/:recipe_id" element={<SingleRecipePage />} />
          </Routes>
        </MemoryRouter>,
      );
    });

    const recipeCardLink = screen.getAllByRole("link");
    await user.click(recipeCardLink[0]);
    screen.debug();
  });
});
