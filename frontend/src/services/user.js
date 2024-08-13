const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

export const signUp = async (email, password, username) => {
  if (!email || !password || !username) {
    throw new Error("All fields are required.");
  }

  const payload = {
    email: email,
    password: password,
    username: username,
  };

  const requestOptions = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  };

  try {
    let response = await fetch(`${BACKEND_URL}/users`, requestOptions);

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message);
    }

    return;
  } catch (err) {
    console.error("Sign up error:", err.message);
    throw err;
  }
};
