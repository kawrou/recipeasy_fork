import { useState } from "react";
import { useNavigate, NavLink, Link } from "react-router-dom";

import { signUp } from "../../services/user";
import { validateSignUpForm } from "../../validators/validation";
//TODO:
// A logged in user can still access this page by typing the route in the URL
// It'll be better for UX if it were handled

export const SignupPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [formErrors, setFormErrors] = useState({});

  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    const errors = validateSignUpForm(email, password, username);

    // if there are errors stop signup submission
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    try {
      await signUp(email, password, username);
      navigate("/login");
    } catch (err) {
      //TODO: Better handling of errors
      // catch if username or email is not unique and show error
      setFormErrors({
        ...formErrors,
        username: "Username and Email must be unique.",
      });
      navigate("/signup");
    }
  };

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
    setFormErrors({ ...formErrors, email: "" }); // clear errors when the user starts typing
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
    setFormErrors({ ...formErrors, password: "" });
  };

  const handleUsernameChange = (event) => {
    setUsername(event.target.value);
    setFormErrors({ ...formErrors, username: "" });
  };

  return (
    <>
      <section className="font-poppins">
        <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
          <NavLink
            to="/"
            className="flex items-center mb-6 text-5xl font-kanit font-bold italic text-primary-500 hover:text-primary-500"
          >
            <img
              className="w-16 mb-1.5 -mr-0.5"
              src="/assets/recipeasyLogo.svg"
              alt="logo"
            />
            ecipeasy
          </NavLink>
          <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0">
            <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
              <h1 className="text-xl font-bold leading-tight tracking-tight text-secondary-500 md:text-2xl">
                Create an account
              </h1>
              <form className="space-y-4 md:space-y-6" action="#">
                <div>
                  <label
                    htmlFor="username"
                    className="block mb-2 text-sm text-left font-light text-gray-600"
                  >
                    Username
                  </label>
                  <input
                    type="text"
                    name="username"
                    id="username"
                    value={username}
                    placeholder="username"
                    className="outline-none focus:ring-1 bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5"
                    onChange={handleUsernameChange}
                  />
                  {formErrors.username && (
                    <div className="text-red-500">{formErrors.username}</div>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="email"
                    className="block mb-2 text-sm text-left font-light text-gray-600"
                  >
                    Your email
                  </label>
                  <input
                    type="text"
                    name="email"
                    id="email"
                    value={email}
                    className="outline-none focus:ring-1 bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5"
                    placeholder="name@company.com"
                    onChange={handleEmailChange}
                  />
                  {formErrors.email && (
                    <div className="text-red-500">{formErrors.email}</div>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="password"
                    className="block mb-2 text-sm text-left font-light text-gray-600"
                  >
                    Password
                  </label>
                  <input
                    type="password"
                    name="password"
                    id="password"
                    value={password}
                    placeholder="••••••••••••••••"
                    className="outline-none focus:ring-1 bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5"
                    onChange={handlePasswordChange}
                  />
                  {formErrors.password && (
                    <div className="text-red-500">{formErrors.password}</div>
                  )}
                </div>

                <button
                  type="submit"
                  role="submit-button"
                  value="Submit"
                  className="w-full text-white bg-secondary-500 hover:bg-blue-900 focus:ring-4 focus:outline-none focus:ring-blue-300 font-kanit font-bold text-lg rounded-lg px-5 py-2.5 text-center"
                  onClick={handleSubmit}
                >
                  Create an account
                </button>

                <p className="text-sm font-light text-gray-500">
                  Already have an account?{" "}
                  <Link
                    to="/login"
                    className="font-medium text-primary-500 hover:text-rose-400"
                  >
                    Login here
                  </Link>
                </p>
              </form>
            </div>
          </div>
          <Link
            to="/"
            className="font-medium text-sm text-primary-500 hover:text-rose-400 pt-5"
          >
            ← Back to homepage
          </Link>
        </div>
      </section>
    </>
  );
};
