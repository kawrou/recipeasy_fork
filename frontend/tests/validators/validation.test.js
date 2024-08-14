import { expect, describe, test } from "vitest";
import {
  validateLoginForm,
  validateEmail,
  validatePassword,
  validateSignUpForm,
} from "../../src/validators/validation";

describe("Validators", () => {
  describe("Login form:", () => {
    test("If email string is empty, return a validation object with appropriate validation message", () => {
      const result = validateLoginForm("", "testPassword");

      expect(result).toEqual({
        email: "Email address is required",
      });
    });

    test("If password string is empty, return a validation object with appropriate validation message", () => {
      const result = validateLoginForm("test@test.com", "");

      expect(result).toEqual({
        password: "Password is required",
      });
    });

    test("If email and password strings are empty, return a validation object with appropriate validation message", () => {
      const result = validateLoginForm("", "");

      expect(result).toEqual({
        email: "Email address is required",
        password: "Password is required",
      });
    });

    test("If email and password strings are valid, return an empty validation object", () => {
      const result = validateLoginForm("test@test.com", "testPassword");

      expect(result).toEqual({});
    });

    test("If email isn't a string, it returns an error message", () => {
      const result = validateLoginForm(1, "abc");

      expect(result).toEqual({
        general: "Email and password must be string.",
      });
    });

    test("If password isn't a string, it returns an error message", () => {
      const result = validateLoginForm("test@test.com", 1234);

      expect(result).toEqual({
        general: "Email and password must be string.",
      });
    });
  });

  // describe("email:", () => {
  //   test.each([
  //     [true, "test_email@test-domain.com"],
  //     [false, "invalidEmail"],
  //   ])("returns %s for %s", (expectedResult, password) => {
  //     const result = validateEmail(password);

  //     expect(result).toBe(expectedResult);
  //   });
  // });

  // describe("password:", () => {
  //   test.each([
  //     [true, "Testpassword1!"],
  //     [false, "testpassword1!"],
  //     [false, "Testpassword1"],
  //     [false, "Testpassword!"],
  //     [false, "test"],
  //   ])("returns %s when password is %s", (expectedResult, password) => {
  //     const result = validatePassword(password);

  //     expect(result).toBe(expectedResult);
  //   });
  // });

  describe("validateSignUpForm", () => {
    test("returns an error message when args are empty", () => {
      const errors = validateSignUpForm();

      expect(errors.general).toEqual(
        "Please enter a username, email and password",
      );
    });

    test("returns an error message when args aren't strings", () => {
      const errors = validateSignUpForm(1, 1, 1);

      expect(errors.general).toEqual(
        "Email, password and username must be strings.",
      );
    });

    test("returns an error message email isn't valid", () => {
      const errors = validateSignUpForm(
        "testuser",
        "invalidEmail",
        "Testpassword1!",
      );

      expect(errors.email).toEqual("Enter a valid email address.");
    });

    test.each([
      ["Testpassword1!"], //TODO: shouldn't be passing
      ["testpassword1!"],
      ["Testpassword1"],
      ["Testpassword!"],
      ["test"],
    ])("returns an error message password is %s", (password) => {
      const errors = validateSignUpForm(
        "testuser",
        "test_email@test-domain.com",
        password,
      );

      expect(errors.password).toEqual(
        "Password must be between 8 and 15 characters long with atleast 1 uppercase, 1 number, and 1 special character.",
      );
    });
  });
});
