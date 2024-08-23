import { render, screen, waitFor } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { userEvent } from "@testing-library/user-event";
import { HomePage } from "../../src/pages/Home/HomePage";
import { vi, expect, describe, test, beforeEach } from "vitest";
import { checkToken } from "../../src/services/authentication";
import RecipeScraper from "../../src/components/RecipeScraper";
import { AuthProvider } from "../../src/context/AuthProvider";

// MOCKS
// Mock useNavigate to test useNavigate logic in isolation
// https://stackoverflow.com/questions/66284286/react-jest-mock-usenavigate & vitest env suggestion
const mockUseNavigate = vi.fn();
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockUseNavigate,
  };
});

const checkTokenMock = vi.fn();
const handleUrlChangeMock = vi.fn();
const handleScrapeRecipeMock = vi.fn();
const handleEnterManuallyMock = vi.fn();

// REUSABLE BITS OF CODE
const url = "some url";

const clickGenerateRecipe = async () => {
  const user = userEvent.setup();
  const searchbar = screen.getByRole("textbox");
  const generateRecipeBtn = screen.getByRole("button", { name: "Generate" });
  await user.type(searchbar, url);
  await user.click(generateRecipeBtn);
};

const clickEnterManually = async () => {
  const user = userEvent.setup();
  const enterManuallyBtn = screen.getByRole("button", { name: "Manually" });
  await user.click(enterManuallyBtn);
};

// TESTS
describe("When a user is logged in and:", () => {
  test("enters a url, it appears on the screen", async () => {
    render(
      <AuthProvider>
        <BrowserRouter>
          <HomePage />
        </BrowserRouter>
      </AuthProvider>,
    );
    const user = userEvent.setup();
    const searchbar = screen.getByRole("textbox");
    await user.type(searchbar, "Hello, world!");
    expect(searchbar.value).toBe("Hello, world!");
  });
});
