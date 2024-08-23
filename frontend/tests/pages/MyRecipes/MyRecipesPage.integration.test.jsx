import { act, render, screen } from "@testing-library/react";
import { vi, describe, test, expect } from "vitest";
import { MyRecipesPage } from "../../../src/pages/MyRecipes/MyRecipesPage";
import { CreateRecipePage } from "../../../src/pages/RecipePage/CreateRecipePage";
import { LoginPage } from "../../../src/pages/Login/LoginPage";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { useFetchRecipes } from "../../../src/hooks/useFetchRecipe";
import { getAllRecipes, getRecipeById } from "../../../src/services/recipes";
import { checkToken } from "../../../src/services/authentication";
import userEvent from "@testing-library/user-event";
import { SingleRecipePage } from "../../../src/pages/RecipePage/SingleRecipePage";
import { AuthProvider } from "../../../src/context/AuthProvider";
import { axiosPrivate } from "../../../src/api/axios";

vi.mock("../../../src/services/recipes");
vi.mock("../../../src/services/authentication");
vi.mock("../../../src/api/axios");

const setTokenMock = vi.fn();
const handleScrapeRecipeMock = vi.fn();
const setRecipeDataMock = vi.fn();
const setUrlMock = vi.fn();
const testToken = "testToken";
const user = userEvent.setup();

describe("When My Recipes Page is first rendered", () => {
  //TODO: This test failes because RecipeCard is making another FETCH request which overides the mock below
  test("renders fetched recipes", async () => {
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
          <AuthProvider>
            <Routes>
              <Route
                path="/myrecipes"
                element={
                  <MyRecipesPage
                    token={testToken}
                    setToken={setTokenMock}
                    handleScrapeRecipe={handleScrapeRecipeMock}
                  />
                }
              />
            </Routes>
          </AuthProvider>
        </MemoryRouter>
      );
    });

    const recipeTitles = screen.getAllByRole("heading", { level: 2 });

    expect(recipeTitles.length).toEqual(3);
    expect(recipeTitles[1]).toHaveTextContent("test recipe 1");
    expect(recipeTitles[2]).toHaveTextContent("test recipe 2");
  });

  test("shows a message when recipes is undefined", async () => {
    axiosPrivate.get.mockResolvedValue({
      data: {
        recipes: undefined,
      },
    });

    await act(async () => {
      render(
        <MemoryRouter initialEntries={["/myrecipes"]}>
          <AuthProvider>
            <Routes>
              <Route
                path="/myrecipes"
                element={
                  <MyRecipesPage handleScrapeRecipe={handleScrapeRecipeMock} />
                }
              />
            </Routes>
          </AuthProvider>
        </MemoryRouter>
      );
    });

    const recipeMsg = screen.getByLabelText("Empty Recipes");
    expect(recipeMsg).toBeVisible();
  });

  test("shows a message when recipes is an empty array", async () => {
    axiosPrivate.get.mockResolvedValue({
      data: {
        recipes: [],
      },
    });

    await act(async () => {
      render(
        <MemoryRouter initialEntries={["/myrecipes"]}>
          <AuthProvider>
            <Routes>
              <Route
                path="/myrecipes"
                element={
                  <MyRecipesPage
                    token={testToken}
                    setToken={setTokenMock}
                    handleScrapeRecipe={handleScrapeRecipeMock}
                  />
                }
              />
            </Routes>
          </AuthProvider>
        </MemoryRouter>
      );
    });

    const recipeMsg = screen.getByLabelText("Empty Recipes");
    expect(recipeMsg).toBeVisible();
  });

  test("navigates to login if error during HTTP request", async () => {
    axiosPrivate.get.mockRejectedValue({
      response: {
        data: { message: "" },
      },
    });

    await act(async () => {
      render(
        <MemoryRouter initialEntries={["/myrecipes"]}>
          <AuthProvider>
            <Routes>
              <Route
                path="/myrecipes"
                element={
                  <MyRecipesPage
                    token={testToken}
                    setToken={setTokenMock}
                    handleScrapeRecipe={handleScrapeRecipeMock}
                  />
                }
              />
              <Route path="/login" element={<LoginPage />} />
            </Routes>
          </AuthProvider>
        </MemoryRouter>
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

  test.skip("shows loading message if loading", async () => {
    axiosPrivate.post.mockImplementation(() => {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve({
            data: {
              recipes: [],
            },
          });
        }, 1000);
      });
    });

    await act(async () => {
      render(
        <MemoryRouter initialEntries={["/myrecipes"]}>
          <AuthProvider>
            <Routes>
              <Route
                path="/myrecipes"
                element={
                  <MyRecipesPage
                    token={testToken}
                    setToken={setTokenMock}
                    handleScrapeRecipe={handleScrapeRecipeMock}
                  />
                }
              />
              <Route path="/login" element={<LoginPage />} />
            </Routes>
          </AuthProvider>
        </MemoryRouter>
      );
    });

    const loadingMsg = screen.getByLabelText("Loading message");
    expect(loadingMsg).toBeVisible();
    expect(loadingMsg).toHaveTextContent("Loading ...");
  });

  test("navigates to /login when there is an error", async () => {
    axiosPrivate.mockRejectedValue(new Error("Error retrieving recipe"));

    await act(async () => {
      render(
        <MemoryRouter initialEntries={["/myrecipes"]}>
          <AuthProvider>
            <Routes>
              <Route
                path="/myrecipes"
                element={
                  <MyRecipesPage handleScrapeRecipe={handleScrapeRecipeMock} />
                }
              />
              <Route path="/login" element={<LoginPage />} />
            </Routes>
          </AuthProvider>
        </MemoryRouter>
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
});

describe("When a user clicks on:", () => {
  // test.only("generate recipe btn, it navigates to recipe page", async () => {
  //   axiosPrivate.get.mockResolvedValue({
  //     data: {
  //       recipes: [],
  //     },
  //   });

  //   await act(async () => {
  //     render(
  //       <MemoryRouter initialEntries={["/myrecipes"]}>
  //         <AuthProvider>
  //           <Routes>
  //             <Route
  //               path="/myrecipes"
  //               element={
  //                 <MyRecipesPage handleScrapeRecipe={handleScrapeRecipeMock} />
  //               }
  //             />
  //             <Route path="/recipes/create" element={<CreateRecipePage />} />
  //           </Routes>
  //         </AuthProvider>
  //       </MemoryRouter>,
  //     );
  //   });

  //   const generateRecipeBtn = screen.getByRole("button", { name: "Generate" });
  //   await user.click(generateRecipeBtn);

  //   const yieldEl = screen.getByText("Serves");
  //   const tagsEl = screen.getByText("Tags:");
  //   const recipeSaveBtn = screen.getByRole("button", { name: "Save" });

  //   expect(yieldEl).toBeVisible();
  //   expect(tagsEl).toBeVisible();
  //   expect(recipeSaveBtn).toBeVisible();
  // });

  // test("enter Manually btn, it navigates to recipe page", async () => {
  //   getAllRecipes.mockReturnValue({
  //     recipes: [],
  //     token: "returned token",
  //   });

  //   await act(async () => {
  //     render(
  //       <MemoryRouter initialEntries={["/myrecipes"]}>
  //         <Routes>
  //           <Route
  //             path="/myrecipes"
  //             element={
  //               <MyRecipesPage
  //                 token={testToken}
  //                 setToken={setTokenMock}
  //                 handleScrapeRecipe={handleScrapeRecipeMock}
  //                 setRecipeData={setRecipeDataMock}
  //                 setUrl={setUrlMock}
  //               />
  //             }
  //           />
  //           <Route path="/recipes/create" element={<CreateRecipePage />} />
  //         </Routes>
  //       </MemoryRouter>
  //     );
  //   });

  //   const generateRecipeBtn = screen.getByRole("button", { name: "Manually" });
  //   await user.click(generateRecipeBtn);

  //   const yieldEl = screen.getByText("Serves");
  //   const tagsEl = screen.getByText("Tags:");
  //   const recipeSaveBtn = screen.getByRole("button", { name: "Save" });

  //   expect(yieldEl).toBeVisible();
  //   expect(tagsEl).toBeVisible();
  //   expect(recipeSaveBtn).toBeVisible();
  // });

  //TODO: Research how to check URL, otherwise I'll need to mock getRecipeById. Or there might be a way to check if the Link was called with the correct URL
  test.todo("a recipe card, it navigates to that recipe's page", async () => {
    axiosPrivate.get.mockResolvedValue({
      data: {
        recipes: [{ _id: 1, name: "test recipe", totalTime: 60 }],
      },
    });

    await act(async () => {
      render(
        <MemoryRouter initialEntries={["/myrecipes"]}>
          <AuthProvider>
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
              <Route
                path="/recipes/:recipe_id"
                element={<SingleRecipePage />}
              />
            </Routes>
          </AuthProvider>
        </MemoryRouter>
      );
    });

    const recipeCardLink = screen.getAllByRole("link");
    await user.click(recipeCardLink[0]);
    // screen.debug();
  });
});
