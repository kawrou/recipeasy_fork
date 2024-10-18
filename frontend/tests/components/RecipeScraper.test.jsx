import { render, screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { vi, describe, test, beforeEach, it } from "vitest";
import { expect } from "vitest";
import RecipeScraper from "../../src/components/RecipeScraper";
import * as authenticationServices from "../../src/services/authentication";
import { useNavigate } from "react-router-dom";
import { AuthProvider } from "../../src/context/AuthProvider.jsx";
import useAxiosPrivate from "../../src/hooks/useAxiosPrivate.js";
import Recipe from "../../../api/src/models/recipe.js";
const handleUrlChangeMock = vi.fn();
const handleScrapeRecipeMock = vi.fn();
const setRecipeDataMock = vi.fn();
const setUrlMock = vi.fn();

// Mocking React Router's useNavigate function
vi.mock("react-router-dom", () => {
  const navigateMock = vi.fn();
  const useNavigateMock = () => navigateMock; // Create a mock function for useNavigate
  return { useNavigate: useNavigateMock };
});

vi.mock("../../src/hooks/useAxiosPrivate", () => {
  const axiosPrivateMock = {
    get: vi.fn(),
  };

  return { default: () => axiosPrivateMock };
});

describe("Unit Test: RecipeScraper", () => {
  const axiosPrivate = useAxiosPrivate();
  beforeEach(() => {
    vi.resetAllMocks();
  });

  describe("Generate Recipe button", () => {
    test("url is inputted, it navigates to create page", async () => {
      axiosPrivate.get.mockResolvedValue({
        data: { recipe_data: "test data" },
      });

      const navigateMock = useNavigate();
      render(
        <AuthProvider>
          <RecipeScraper
            // url={"www.test-url.com"}
            // setUrl={setUrlMock}
            // handleUrlChange={handleUrlChangeMock}
            setRecipeData={setRecipeDataMock}
          />
        </AuthProvider>
      );
      const generateRecipeBtn = screen.getByRole("button", {
        name: "Generate",
      });
      const urlInput = screen.getByRole("textbox");
      await userEvent.type(urlInput, "https://www.test-url.com");
      await userEvent.click(generateRecipeBtn);
      expect(navigateMock).toHaveBeenCalledWith("/recipes/create");
      expect(axiosPrivate.get).toHaveBeenCalled();
      expect(axiosPrivate.get).toHaveBeenCalledWith(
        "/recipes/scrape?url=https%3A%2F%2Fwww.test-url.com",
      );
    });

    test("scrapeRecipe func not called when empty URL", async () => {
      const navigateMock = useNavigate();
      render(
        <AuthProvider>
          <RecipeScraper
            // url={""}
            // setUrl={setUrlMock}
            // handleUrlChange={handleUrlChangeMock}
            setRecipeData={setRecipeDataMock}
          />
        </AuthProvider>
      );
      const generateRecipeBtn = screen.getByRole("button", {
        name: "Generate",
      });
      await userEvent.click(generateRecipeBtn);

      expect(axiosPrivate.get).not.toHaveBeenCalled();
      expect(navigateMock).not.toHaveBeenCalled();
    });

    it("Doesn't work with invalid URL strings", async () => {
      const navigateMock = useNavigate();
      render(
        <AuthProvider>
          <RecipeScraper setRecipeData={setRecipeDataMock} />
        </AuthProvider>,
      );
      const generateRecipeBtn = screen.getByRole("button", {
        name: "Generate",
      });
      const urlInput = screen.getByRole("textbox");

      await userEvent.type(urlInput, "invalid url");
      await userEvent.click(generateRecipeBtn);

      expect(screen.getByText("Please enter a valid URL.")).toBeVisible();
      expect(axiosPrivate.get).not.toHaveBeenCalled();
      expect(navigateMock).not.toHaveBeenCalled();
    });
  });

  describe("Enter Manually button", () => {
    test("Enter Manually button navigates to create recipe page", async () => {
      vi.spyOn(authenticationServices, "checkToken").mockResolvedValue(true); //Unecessary?
      const navigateMock = useNavigate();

      render(
        <AuthProvider>
          <RecipeScraper
            // url={""}
            // setUrl={setUrlMock}
            // handleUrlChange={handleUrlChangeMock}
            // handleScrapeRecipe={handleScrapeRecipeMock}
            setRecipeData={setRecipeDataMock}
          />
        </AuthProvider>,
      );

      const enterMaunallyBtn = screen.getByRole("button", { name: "Manually" });
      await userEvent.click(enterMaunallyBtn);

      expect(handleScrapeRecipeMock).not.toHaveBeenCalled();
      expect(navigateMock).toHaveBeenCalledWith("/recipes/create");
    });
  });

  describe("Handles errors", () => {
    test("If token is invalid, it navigates to login page", async () => {
      const navigateMock = useNavigate();

      axiosPrivate.get.mockRejectedValue({ response: { status: 401 } });

      render(
        <AuthProvider>
          <RecipeScraper
            // url={"www.test-url.com"}
            // setUrl={setUrlMock}
            // handleUrlChange={handleUrlChangeMock}
            // handleScrapeRecipe={handleScrapeRecipeMock}
            setRecipeData={setRecipeDataMock}
          />
        </AuthProvider>,
      );

      const generateRecipeBtn = screen.getByRole("button", {
        name: "Generate",
      });
      const urlInput = screen.getByRole("textbox");
      await userEvent.type(urlInput, "https://www.test-url.com");

      await userEvent.click(generateRecipeBtn);

      expect(navigateMock).toHaveBeenCalledWith("/login");
    });
    test("Displays validation message for empty URL field", async () => {
      const navigateMock = useNavigate();
      render(
        <AuthProvider>
          <RecipeScraper
            // url={""}
            // setUrl={setUrlMock}
            // handleUrlChange={handleUrlChangeMock}
            // handleScrapeRecipe={handleScrapeRecipeMock}
            setRecipeData={setRecipeDataMock}
          />
        </AuthProvider>,
      );

      const generateRecipeBtn = screen.getByRole("button", {
        name: "Generate",
      });
      await userEvent.click(generateRecipeBtn);

      expect(screen.getByText("Please enter a valid URL.")).toBeVisible();
      //How about having a red ring around it?
      expect(navigateMock).not.toHaveBeenCalled();
      expect(axiosPrivate.get).not.toHaveBeenCalled();
    });

    test("validation message disappears after entering URL", async () => {
      render(
        <AuthProvider>
          <RecipeScraper
            // url={""}
            // setUrl={setUrlMock}
            // handleUrlChange={handleUrlChangeMock}
            // handleScrapeRecipe={handleScrapeRecipeMock}
            setRecipeData={setRecipeDataMock}
          />
        </AuthProvider>,
      );

      const generateRecipeBtn = screen.getByRole("button", {
        name: "Generate",
      });
      const urlInput = screen.getByRole("textbox");

      await userEvent.click(generateRecipeBtn);

      expect(screen.getByText("Please enter a valid URL.")).toBeVisible();

      await userEvent.type(urlInput, "test-url.com");
      expect(
        screen.queryByText("Please enter a valid URL."),
      ).not.toBeInTheDocument();
    });

    test("Displays error message from API request", async () => {
      axiosPrivate.get.mockRejectedValue({
        response: {
          status: 500,
          message: "There was a problem getting the recipe.",
        },
      });

      const navigateMock = useNavigate();
      render(
        <AuthProvider>
          <RecipeScraper
            // url={"some-url"}
            // setUrl={setUrlMock}
            // handleUrlChange={handleUrlChangeMock}
            // handleScrapeRecipe={handleScrapeRecipeMock}
            setRecipeData={setRecipeDataMock}
          />
        </AuthProvider>,
      );

      const generateRecipeBtn = screen.getByRole("button", {
        name: "Generate",
      });
      const urlInput = screen.getByRole("textbox");
      await userEvent.type(urlInput, "https://www.test-url.com");

      await userEvent.click(generateRecipeBtn);

      expect(
        screen.getByText(
          "There was a problem getting the recipe. Please try again or try a different URL.",
        ),
      ).toBeVisible();
      expect(navigateMock).not.toHaveBeenCalled();
    });
  });
});
