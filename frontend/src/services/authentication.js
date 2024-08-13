// docs: https://vitejs.dev/guide/env-and-mode.html
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

export const login = async (username, password) => {
  if (!username || !password) {
    throw new Error("Username and password are required.");
  }

  const payload = {
    username: username,
    password: password,
  };

  const requestOptions = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  };

  try {
    const response = await fetch(`${BACKEND_URL}/tokens`, requestOptions);

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message);
    }

    const data = await response.json();
    return { token: data.token };
  } catch (error) {
    if (error instanceof SyntaxError) {
      throw new Error("Server error. Please try again later.");
    }
    throw new Error(error.message);
  }
};

export const refresh = async () => {
  const requestOptions = {
    method: "POST",
    credentials: "include",
  };

  try {
    const response = await fetch(
      `${BACKEND_URL}/tokens/refresh`,
      requestOptions,
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message);
    }
    const data = await response.json();
    return { token: data.token };
  } catch (err) {
    throw new Error(err.message);
  }
};

export const logOut = async () => {
  const requestOptions = {
    method: "POST",
    credentials: "include",
  };

  try {
    const response = await fetch(
      `${BACKEND_URL}/tokens/logout`,
      requestOptions,
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message);
    }

    if (response.status === 204) {
      return { message: "Logged out successfully." };
    }

    const data = await response.json();
    return { message: data.message };
  } catch (err) {
    throw new Error(err.message);
  }
};

//TODO: Possibly unecessary method:
export const checkToken = async (token) => {
  const requestOptions = {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  //TODO:
  //Refactor to use try/catch block
  // console.log(token)
  const response = await fetch(`${BACKEND_URL}/tokens`, requestOptions);
  if (!response.ok) {
    const error = new Error("Token not valid");
    error.response = response;
    throw error;
  }
};
