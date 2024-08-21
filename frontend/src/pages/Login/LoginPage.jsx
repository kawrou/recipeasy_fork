import { useState, useEffect } from "react";
import { useNavigate, NavLink, Link } from "react-router-dom";
import { logIn } from "../../services/authentication";
import { validateLoginForm } from "../../validators/validation";
import useAuth from "../../hooks/useAuth";

//TODO:
// A logged in user can still access this page by typing the route in the URL
// It'll be better for UX if it were handled

export const LoginPage = () => {
  const { setAuth } = useAuth();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [validationMsg, setValidationMsg] = useState({});

  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setValidationMsg({});
    const validationErrors = validateLoginForm(username, password);

    if (Object.keys(validationErrors).length > 0) {
      setValidationMsg(validationErrors);
      return;
    }

    try {
      const accessToken = await logIn(username, password);
      setAuth(accessToken);
      navigate("/");
    } catch (err) {
      setError(`${err.message}`);
    }
  };

  const handleusernameChange = (e) => {
    e.preventDefault();
    setUsername(e.target.value);
  };

  const handlePasswordChange = (e) => {
    e.preventDefault();
    setPassword(e.target.value);
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
          <div className="w-full bg-white rounded-lg shadow shadow-tertiary-500 border  md:mt-0 sm:max-w-md xl:p-0 ">
            <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
              <h1 className="text-xl font-bold leading-tight tracking-tight text-secondary-500 md:text-2xl">
                Log in to your account
              </h1>
              <form className="space-y-4 md:space-y-6" onSubmit={handleSubmit}>
                <div>
                  <label
                    htmlFor="username"
                    className="block mb-2 text-sm text-left font-light text-gray-600"
                  >
                    Your username
                  </label>
                  <input
                    type="username"
                    name="username"
                    id="username"
                    className="outline-none focus:ring-1 bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5"
                    placeholder="name@domain.com"
                    value={username}
                    onChange={handleusernameChange}
                  />
                  {validationMsg.username && (
                    <span className="text-red-500">
                      {validationMsg.username}.
                    </span>
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
                    placeholder="••••••••••••••••"
                    className="outline-none focus:ring-1 bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5"
                    value={password}
                    onChange={handlePasswordChange}
                  />
                  {validationMsg.password && (
                    <span className="text-red-500">
                      {validationMsg.password}.
                    </span>
                  )}
                </div>
                <button
                  type="submit"
                  className="w-full text-white bg-secondary-500 hover:bg-blue-900 focus:ring-4 focus:outline-none focus:ring-blue-300 font-kanit font-bold text-lg rounded-lg px-5 py-2.5 text-center"
                >
                  Log in
                </button>
                {error && <span className="text-red-500">{error}</span>}
                {validationMsg.general && (
                  <span className="text-red-500">{validationMsg.general}</span>
                )}
                <p className="text-sm font-light text-gray-500">
                  Don’t have an account yet?{" "}
                  <Link
                    to="/signup"
                    className="font-medium text-primary-500 hover:text-rose-400"
                  >
                    Sign up
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
