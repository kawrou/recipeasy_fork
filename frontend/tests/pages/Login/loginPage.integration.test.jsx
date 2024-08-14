import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { test, vi, expect, describe, beforeEach } from "vitest";

import { MemoryRouter, Routes, Route } from "react-router-dom";
import { login } from "../../../src/services/authentication";
import { LoginPage } from "../../../src/pages/Login/LoginPage";
import HomePage from "../../../src/pages/Home/HomePage";
import { SignupPage } from "../../../src/pages/Signup/SignupPage";

const handleLoginMock = vi.fn();

// Mocking the login service
vi.mock("../../../src/services/authentication", () => {
  const loginMock = vi.fn();
  return { login: loginMock };
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

describe("Login Page", () => {
  beforeEach(() => {
    vi.resetAllMocks();
    render(
      <MemoryRouter initialEntries={["/login"]}>
        <Routes>
          <Route
            path="/login"
            element={<LoginPage handleLogin={handleLoginMock} />}
          />
          <Route path="/" element={<HomePage />} />
          <Route path="/signup" element={<SignupPage />} />
        </Routes>
      </MemoryRouter>,
    );
  });

  describe("Login interactions:", () => {
    test("navigates to home page on successful login", async () => {
      login.mockResolvedValue("secrettoken123");

      await completeLoginForm();

      const heading = screen.getByRole("heading", { name: "Recipeasy" });
      expect(heading).toBeVisible();
    });

    test("doesn't navigate if username cannot be found", async () => {
      login.mockRejectedValue(new Error("username not found"));

      await completeLoginForm();

      const errorMsg = screen.getByText("username not found");
      expect(errorMsg).toBeVisible();

      const heading = screen.queryByRole("heading", { name: "Recipeasy" });
      expect(heading).not.toBeInTheDocument();
    });

    test("doesn't navigate if username is incorrect", async () => {
      login.mockRejectedValue(new Error("Password is incorrect"));

      await completeLoginForm();

      const errorMsg = screen.getByText("Password is incorrect");
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
      login.mockResolvedValue("secrettoken123");

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

//TODO: Maybe these could be used for SignupPage instead.
// All these tests aren't applicable anymore
//This is an integration test
//   test("If a user's username doesn't have an '@'", async () => {
//     validateForm.mockReturnValue({
//       username: "username is invalid. Please include an @",
//     });

//     await typeusernameInput("test");

//     const usernameValidationMsg = screen.getByText(
//       "username is invalid. Please include an @."
//     );

//     expect(usernameValidationMsg).toBeVisible();

//     // await waitFor(() => {
//     //   const usernameValidationMsg = screen.getByText(
//     //     "username is invalid. Please include an @."
//     //   );

//     //   expect(usernameValidationMsg).toBeVisible();
//     // });
//   });
//   //This is an integration test
//   test("If a user's username doesn't have a domain extentension", async () => {
//     validateForm.mockReturnValue({
//       username: "username is invalid. Please include a domain name in your username",
//     });

//     await typeusernameInput("test@");

//     const usernameValidationMsg = screen.getByText(
//       "username is invalid. Please include a domain name in your username."
//     );

//     expect(usernameValidationMsg).toBeVisible();

//     // await waitFor(() => {
//     //   const usernameValidationMsg = screen.getByText(
//     //     "username is invalid. Please include a domain name in your username."
//     //   );

//     //   expect(usernameValidationMsg).toBeVisible();
//     // });
//   });

//   test("If a user's username is invalid, it shouldn't navigate", async () => {
//     validateForm.mockReturnValue({ username: "invalid" });

//     await typeusernameInput("test");
//     const submitButtonEl = screen.getByRole("button");
//     await user.click(submitButtonEl);

//     expect(login).not.toHaveBeenCalled();
//     expect(navigateMock).not.toHaveBeenCalled();
//   });

//   //This is an integration test
//   test("If a user's password doesn't have a capital letter", async () => {
//     validateForm.mockReturnValue({
//       password: "Password must contain a capital letter",
//     });

//     await typePasswordInput("password");

//     await waitFor(() => {
//       const passwordValidationMsg = screen.getByText(
//         "Password must contain a capital letter."
//       );

//       expect(passwordValidationMsg).toBeVisible();
//     });
//   });

//   //This is an integration test
//   test.each([
//     ["a"],
//     ["aa"],
//     ["aaa"],
//     ["aaaa"],
//     ["aaaaa"],
//     ["aaaaaa"],
//     ["aaaaaaa"],
//   ])("If a user's password isn't 8 chars long: '%s'", async (input) => {
//     validateForm.mockReturnValue({
//       password: "Password must be atleast 8 characters long",
//     });

//     await typePasswordInput(input);

//     await waitFor(() => {
//       const passwordValidationMsg = screen.getByText(
//         "Password must be atleast 8 characters long."
//       );

//       expect(passwordValidationMsg).toBeVisible();
//     });
//   });

//   //this is an integration test
//   test("If a user's password doens't contain special characters", async () => {
//     validateForm.mockReturnValue({
//       password: "Password must contain atleast one special character",
//     });

//     await typePasswordInput("password");

//     await waitFor(() => {
//       const passwordValidationMsg = screen.getByText(
//         "Password must contain atleast one special character."
//       );

//       expect(passwordValidationMsg).toBeVisible();
//     });
//   });

//   //this is an integration test
//   test("If a user's password doens't contain a number", async () => {
//     validateForm.mockReturnValue({
//       password: "Password must contain atleast one number",
//     });

//     await typePasswordInput("password");

//     await waitFor(() => {
//       const passwordValidationMsg = screen.getByText(
//         "Password must contain atleast one number."
//       );

//       expect(passwordValidationMsg).toBeVisible();
//     });
//   });

//   test("If a user's password is invalid, it shouldn't navigate", async () => {
//     validateForm.mockReturnValue({ username: "invalid" });

//     await typeusernameInput("test");
//     const submitButtonEl = screen.getByRole("button");
//     await user.click(submitButtonEl);

//     expect(login).not.toHaveBeenCalled();
//     expect(navigateMock).not.toHaveBeenCalled();
//   });
