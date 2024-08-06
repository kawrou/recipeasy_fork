import { expect, describe, test } from "vitest";
import { validateLoginForm } from "../../src/validators/validation";

describe("Login form validation", () => {
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

    expect(result).toEqual(null);
  });

  test("If email isn't a string, it throws an error", () => {
    const result = validateLoginForm(1, "abc");

    expect(result).toEqual({
      general: "Email and password must be string.",
    });
  });

  test("If password isn't a string, it throws an error", () => {
    const result = validateLoginForm("test@test.com", 1234);

    expect(result).toEqual({
      general: "Email and password must be string.",
    });
  });
});
