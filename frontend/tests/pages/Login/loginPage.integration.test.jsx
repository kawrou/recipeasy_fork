import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { test, vi, expect, describe, beforeEach } from "vitest";

import { MemoryRouter, Routes, Route } from "react-router-dom";
import { logIn } from "../../../src/services/authentication";
import { LoginPage } from "../../../src/pages/Login/LoginPage";
import HomePage from "../../../src/pages/Home/HomePage";
import { SignupPage } from "../../../src/pages/Signup/SignupPage";
import { AuthProvider } from "../../../src/context/AuthProvider";

const handleLoginMock = vi.fn();

// Mocking the login service
vi.mock("../../../src/services/authentication", () => {
  const loginMock = vi.fn();
  return { logIn: loginMock };
});

const user = userEvent.setup();

// Reusable function for filling out login form
const completeLoginForm = async () => {
  const usernameInputEl = screen.getByLabelText("Your username");
  const passwordInputEl = screen.getByLabelText("Password");
  const submitButtonEl = screen.getByRole("button");

  await user.type(usernameInputEl, "testuser");
  await user.type(passwordInputEl, "1234");
  await user.click(submitButtonEl, "button");
};

const typeusernameInput = async (value) => {
  const usernameInputEl = screen.getByLabelText("Your username");
  await user.type(usernameInputEl, value);
};

const typePasswordInput = async (value) => {
  const pwInputEl = screen.getByLabelText("Password");
  await user.type(pwInputEl, value);
};

const successfulLogin = {
  success: true,
  response: { data: { token: "jwt-token" } },
};

const unsuccessfulLogin = {
  success: false,
  error: { message: "Please check your login details." },
};

describe("Login Page", () => {
  beforeEach(() => {
    vi.resetAllMocks();
    render(
      <MemoryRouter initialEntries={["/login"]}>
        <AuthProvider>
          <Routes>
            <Route
              path="/login"
              element={<LoginPage handleLogin={handleLoginMock} />}
            />
            <Route path="/" element={<HomePage />} />
            <Route path="/signup" element={<SignupPage />} />
          </Routes>
        </AuthProvider>
      </MemoryRouter>,
    );
  });

  describe("Login interactions:", () => {
    test("navigates to home page on successful login", async () => {
      logIn.mockResolvedValue(successfulLogin);

      await completeLoginForm();

      const heading = screen.getByRole("heading", { name: "Recipeasy" });
      expect(heading).toBeVisible();
    });

    test("doesn't navigate if login unsuccesful", async () => {
      logIn.mockResolvedValue(unsuccessfulLogin);

      await completeLoginForm();

      const errorMsg = screen.getByText("Please check your login details.");
      expect(errorMsg).toBeVisible();

      const heading = screen.queryByRole("heading", { name: "Recipeasy" });
      expect(heading).not.toBeInTheDocument();
    });
  });

  describe("Form validation msg should appear and doesn't navigate to HomePage", () => {
    test("when username field is empty on submit", async () => {
      const submitButtonEl = screen.getByRole("button");

      await user.click(submitButtonEl);

      const usernameValidationMsg = screen.getByText(
        "Username address is required.",
      );

      expect(usernameValidationMsg).toBeVisible();

      const heading = screen.queryByRole("heading", { name: "Recipeasy" });
      expect(heading).not.toBeInTheDocument();
    });

    test("when password field is empty on submit", async () => {
      const submitButtonEl = screen.getByRole("button");

      await user.click(submitButtonEl);

      const passwordValidationMsg = screen.getByText("Password is required.");

      expect(passwordValidationMsg).toBeVisible();

      const heading = screen.queryByRole("heading", { name: "Recipeasy" });
      expect(heading).not.toBeInTheDocument();
    });
  });

  describe("When a user enters valid username/password after invalid input:", () => {
    test("username validation message should disappear", async () => {
      const submitButtonEl = screen.getByRole("button");

      await user.click(submitButtonEl);

      const usernameValidationMsg = screen.getByText(
        "Username address is required.",
      );

      expect(usernameValidationMsg).toBeVisible();

      await typeusernameInput("test@test.com");
      await user.click(submitButtonEl);

      await expect(usernameValidationMsg).not.toBeVisible();
    });
    test("password validation message should disapear", async () => {
      const submitButtonEl = screen.getByRole("button");

      await user.click(submitButtonEl);

      const passwordValidationMsg = screen.getByText("Password is required.");

      expect(passwordValidationMsg).toBeVisible();

      await typePasswordInput("testPassword");
      await user.click(submitButtonEl);

      await expect(passwordValidationMsg).not.toBeVisible();
    });
    test("validation messages should disappear and navigate to Home Page", async () => {
      logIn.mockResolvedValue(successfulLogin);

      const submitButtonEl = screen.getByRole("button");
      await user.click(submitButtonEl);

      await typeusernameInput("test@test.com");
      await typePasswordInput("testPassword");
      await user.click(submitButtonEl);

      const heading = screen.queryByRole("heading", { name: "Recipeasy" });
      expect(heading).toBeVisible();
    });
  });

  describe("Navigation buttons", () => {
    test("When a user clicks on the logo, it should navigate to home page", async () => {
      const logoLinkEl = screen.getByRole("link", { name: "logo ecipeasy" });
      await user.click(logoLinkEl);

      const heading = screen.getByRole("heading", { name: "Recipeasy" });
      expect(heading).toBeVisible();
    });
    test("When a user clicks on the 'Back to homepage' button, it should navigate to home page", async () => {
      const homepageLinkEl = screen.getByRole("link", {
        name: "← Back to homepage",
      });
      await user.click(homepageLinkEl);

      const heading = screen.getByRole("heading", { name: "Recipeasy" });
      expect(heading).toBeVisible();
    });
    test("When a user clicks on the 'Sign up' button, it should navigate to SignUp page", async () => {
      const signUpBtnEl = screen.getByRole("link", { name: "Sign up" });
      await user.click(signUpBtnEl);

      const logoLinkEl = screen.getByRole("link", { name: "logo ecipeasy" });
      expect(logoLinkEl).toBeVisible();
    });
  });
});
