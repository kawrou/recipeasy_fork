import { NavLink } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { logOut } from "../services/authentication";
import useAuth from "../hooks/useAuth";

const Navbar = () => {
  const { auth, setAuth } = useAuth();
  const { pathname } = useLocation();

  const handleLogout = async () => {
    try {
      await logOut();
      setAuth({});
    } catch (err) {
      console.log(err);
    }
  };

  const isRootPath = () => {
    return pathname === "/";
  };

  const isLoginPath = () => {
    return pathname === "/login";
  };

  const isSignUpPath = () => {
    return pathname === "/signup";
  };

  //If the current path (page) is /login or /signup then the navbar isn't rendered
  if (isLoginPath() || isSignUpPath()) {
    return null;
  }

  return (
    <div className="flex justify-between items-center max-w-screen-2xl mx-auto px-6 h-16">
      {/* Clickable logo link to Home Page */}
      <NavLink className="" to="/">
        <img
          src="/assets/recipeasyLogo.svg"
          className="w-14"
          alt="Recipeasy Homepage Logo Link"
        />
      </NavLink>

      {/* Home Page link is rendered on pages that aren't the Home Page  */}
      <div className="flex font-kanit text-lg items-center gap-5">
        {!isRootPath() && (
          <NavLink
            className="font-bold text-center text-secondary-500 hover:text-blue-900"
            to="/"
          >
            Home
          </NavLink>
        )}

        {/* Conditionally render "My Recipes" link if user is logged in */}
        {auth.token && (
          <NavLink
            className="font-bold text-center text-primary-500 hover:text-primary-700"
            to="/myrecipes"
          >
            My Recipes
          </NavLink>
        )}
      </div>

      <div className="flex font-kanit items-center w-auto gap-2 ">
        {/* Right-aligned Login, Logout, and Signup Links */}
        {/* Conditionally renders the text content of the (Log in / Log out) button */}
        {auth.token ? (
          <NavLink
            onClick={handleLogout}
            className="text-lg px-4 py-2 border rounded-full text-white bg-gray-600 hover:text-gray-600 hover:border-gray-600 hover:bg-white"
            to="/"
          >
            Log Out
          </NavLink>
        ) : (
          <NavLink
            className="text-lg px-4 py-2 border rounded-full text-white bg-secondary-500 border-blue-600 hover:text-secondary-500 hover:bg-white "
            to="/login"
            aria-label="Log in"
          >
            Log In
          </NavLink>
        )}

        {/* Conditionally render Sign Up link */}
        {!auth.token && (
          <NavLink
            className="text-lg px-4 py-2 border rounded-full text-primary-500 border-primary-500 hover:text-white hover:bg-primary-500"
            to="/signup"
            aria-label="Sign Up"
          >
            Sign Up
          </NavLink>
        )}
      </div>
    </div>
  );
};

export default Navbar;
