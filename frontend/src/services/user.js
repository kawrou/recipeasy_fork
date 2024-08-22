const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
import { axiosPublic } from "../api/axios";

// export const signUp = async (email, password, username) => {
//   if (!email || !password || !username) {
//     throw new Error("All fields are required.");
//   }

//   const payload = {
//     email: email,
//     password: password,
//     username: username,
//   };

//   const requestOptions = {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//     },
//     body: JSON.stringify(payload),
//   };

//   try {
//     let response = await fetch(`${BACKEND_URL}/users`, requestOptions);

//     if (!response.ok) {
//       const error = await response.json();
//       throw new Error(error.message);
//     }

//     return;
//   } catch (err) {
//     console.error("Sign up error:", err.message);
//     throw err;
//   }
// };

export const signUp = async (email, password, username) => {
  if (!email || !password || !username) {
    throw new Error("All fields are required.");
  }

  try {
    const data = { email, password, username };
    const config = {
      headers: { "Content-Type": "application/json" },
      withCredentials: true,
    };

    await axiosPublic.post("/users", data, config);
  } catch (error) {
    if (!error?.response) {
      throw new Error("No Server Response");
    }

    if (error.response?.status === 409) {
      throw new Error(error.response.data.message);
    }
    throw error;
  }
};
