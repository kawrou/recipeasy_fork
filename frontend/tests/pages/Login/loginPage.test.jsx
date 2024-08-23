import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { test, vi, describe, beforeEach, expect, it } from "vitest";

import { useNavigate } from "react-router-dom";
import { logIn } from "../../../src/services/authentication";
import { validateLoginForm } from "../../../src/validators/validation";
import { LoginPage } from "../../../src/pages/Login/LoginPage";
import { AuthProvider } from "../../../src/context/AuthProvider";

// Mocking React Router's useNavigate function and NavLink component
vi.mock("react-router-dom", () => {
  const navigateMock = vi.fn();
  const useNavigateMock = () => navigateMock; // Mock useNavigate to return a function
  return {
    useNavigate: useNavigateMock,
    NavLink: () => {}, // Mock NavLink react-router-dom component
    Link: () => {}, // Mock Link react-router-dom component
  };
});

const handleLoginMock = vi.fn();

// Mocking the login service
vi.mock("../../../src/services/authentication", () => {
  const logInMock = vi.fn();
  return { logIn: logInMock };
});

vi.mock("../../../src/validators/validation", () => {
  const validateLoginFormMock = vi.fn();
  return { validateLoginForm: validateLoginFormMock };
});

// Reusable function for filling out login form
const user = userEvent.setup();

const completeLoginForm = async () => {
  const usernameInputEl = screen.getByLabelText("Your username");
  const passwordInputEl = screen.getByLabelText("Password");
  const submitButtonEl = screen.getByRole("button");

  await user.type(usernameInputEl, "testuser");
  await user.type(passwordInputEl, "1234");
  await user.click(submitButtonEl, "button");
};

describe.only("Login Page", () => {
  const navigateMock = useNavigate();
  beforeEach(() => {
    vi.resetAllMocks();
  });
  describe("When a user clicks login button", () => {
    beforeEach(() => {
      render(
        <AuthProvider>
          <LoginPage handleLogin={handleLoginMock} />
        </AuthProvider>
      );
    });

    test("a login request is made", async () => {
      validateLoginForm.mockReturnValue({});

      await completeLoginForm();

      expect(logIn).toHaveBeenCalledWith("testuser", "1234");
    });

    it("navigates to home page on successful login", async () => {
      validateLoginForm.mockReturnValue({});
      logIn.mockResolvedValue("secrettoken123");

      await completeLoginForm();

      expect(navigateMock).toHaveBeenCalledWith("/");
    });

    it("doens't navigate if error logging in", async () => {
      validateLoginForm.mockReturnValue({});

      logIn.mockRejectedValue(new Error("Login failed. Please try again"));

      await completeLoginForm();

      expect(navigateMock).not.toHaveBeenCalled();
    });

    test("error messages is handled correctly", async () => {
      validateLoginForm.mockReturnValue({});
      logIn.mockRejectedValue(new Error("Login failed. Please try again"));

      await completeLoginForm();

      const errMsg = screen.getByText("Login failed. Please try again");

      expect(errMsg).toBeVisible();
    });
  });

  describe("When username and/or password fields are empty:", () => {
    beforeEach(() => {
      render(
        <AuthProvider>
          <LoginPage handleLogin={handleLoginMock} />
        </AuthProvider>
      );
    });

    it("should display username validation error message", async () => {
      validateLoginForm.mockReturnValue({
        username:
          "username address field was empty. Please enter an username address",
      });

      const submitButtonEl = screen.getByRole("button");

      await user.click(submitButtonEl);

      const usernameValidationMsg = screen.getByText(
        "username address field was empty. Please enter an username address."
      );

      expect(usernameValidationMsg).toBeVisible();
    });

    it("should display password validation error message", async () => {
      validateLoginForm.mockReturnValue({
        password: "Password field was empty. Please enter your password",
      });

      const submitButtonEl = screen.getByRole("button");

      await user.click(submitButtonEl);

      const passwordValidationMsg = screen.getByText(
        "Password field was empty. Please enter your password."
      );

      expect(passwordValidationMsg).toBeVisible();
    });

    it("shouldn't navigate upon invalid username", async () => {
      validateLoginForm.mockReturnValue({
        username:
          "username address field was empty. Please enter an username address",
      });

      const submitButtonEl = screen.getByRole("button");
      await user.click(submitButtonEl);

      expect(logIn).not.toHaveBeenCalled();
      expect(navigateMock).not.toHaveBeenCalled();
    });

    it("shouldn't navigate upon invalid password", async () => {
      validateLoginForm.mockReturnValue({
        password: "Password field was empty. Please enter your password",
      });

      const submitButtonEl = screen.getByRole("button");
      await user.click(submitButtonEl);

      expect(logIn).not.toHaveBeenCalled();
      expect(navigateMock).not.toHaveBeenCalled();
    });
  });
});
