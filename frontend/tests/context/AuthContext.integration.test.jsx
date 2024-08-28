import { describe, test, expect, beforeEach } from "vitest";
import { render, screen, act } from "@testing-library/react";

import { authStore } from "../../src/api/authStore";
import AuthContext from "../../src/context/AuthContext";
import { AuthProvider } from "../../src/context/AuthContext";

describe("AuthProvider", () => {
  beforeEach(() => {
    authStore.clearAccessToken();
  });
  test("logged in state should initially be false", () => {
    render(
      <AuthProvider>
        <AuthContext.Consumer>
          {({ isLoggedIn }) => (
            <div>{isLoggedIn ? "Logged In" : "Logged Out"}</div>
          )}
        </AuthContext.Consumer>
      </AuthProvider>,
    );

    expect(screen.getByText("Logged Out")).toBeVisible();
  });

  test("logged in state can initially be true", () => {
    authStore.setAccessToken("test-token");

    render(
      <AuthProvider>
        <AuthContext.Consumer>
          {({ isLoggedIn }) => (
            <div>{isLoggedIn ? "Logged In" : "Logged Out"}</div>
          )}
        </AuthContext.Consumer>
      </AuthProvider>,
    );

    expect(screen.getByText("Logged In")).toBeVisible();
  });

  test("should reflect changes in the auth store", () => {
    render(
      <AuthProvider>
        <AuthContext.Consumer>
          {({ isLoggedIn }) => (
            <div>{isLoggedIn ? "Logged In" : "Logged Out"}</div>
          )}
        </AuthContext.Consumer>
      </AuthProvider>,
    );

    expect(screen.getByText("Logged Out")).toBeVisible();

    act(() => {
      authStore.setAccessToken("test-token");
    });

    expect(screen.getByText("Logged In")).toBeVisible();

    act(() => {
      authStore.clearAccessToken();
    });

    expect(screen.getByText("Logged Out")).toBeVisible();
  });
});
