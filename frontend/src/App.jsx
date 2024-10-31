import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import HomePage from "./pages/Home/HomePage";
import { LoginPage } from "./pages/Login/LoginPage";
import { SignupPage } from "./pages/Signup/SignupPage";
import { SingleRecipePage } from "./pages/RecipePage/SingleRecipePage";
import { CreateRecipePage } from "./pages/RecipePage/CreateRecipePage";
import { MyRecipesPage } from "./pages/MyRecipes/MyRecipesPage";
import Navbar from "./components/Navbar";
import { useState, useEffect } from "react";
import { refresh } from "./services/authentication";
import useAuth from "./hooks/useAuth";
const App = () => {
  const { setAuth } = useAuth();
  const [recipeData, setRecipeData] = useState(null);

  useEffect(() => {
    const refreshAccessToken = async () => {
      const result = await refresh();

      if (!result.success) {
        setAuth({});
        return;
      }

      setAuth((prev) => {
        return { ...prev, token: result.response.data.token };
      });
    };

    refreshAccessToken();
  }, [setAuth]);

  return (
    <div className="flex flex-col w-screen min-h-screen">
      <BrowserRouter>
        <header>
          <Navbar />
        </header>
        <main>
          <Routes>
            <Route
              path="/"
              element={<HomePage setRecipeData={setRecipeData} />}
            />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route
              path="/recipes/create"
              element={
                <CreateRecipePage
                  recipeData={recipeData}
                  setRecipeData={setRecipeData}
                />
              }
            />
            <Route path="/recipes/:recipe_id" element={<SingleRecipePage />} />
            {/* <Route
            path="/recipes/favouritedByOwner/:recipe_id"
            element={<SingleRecipePage  />}
          /> */}
            <Route
              path="/myrecipes"
              element={<MyRecipesPage setRecipeData={setRecipeData} />}
            />
          </Routes>
        </main>
      </BrowserRouter>
    </div>
  );
};

export default App;
