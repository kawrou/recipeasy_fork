import { BrowserRouter, Route, Routes } from "react-router-dom";
import { scrapeRecipe } from "./services/recipes";

import "./App.css";
import HomePage from "./pages/Home/HomePage";
import { LoginPage } from "./pages/Login/LoginPage";
import { SignupPage } from "./pages/Signup/SignupPage";
import { SingleRecipePage } from "./pages/RecipePage/SingleRecipePage";
import { CreateRecipePage } from "./pages/RecipePage/CreateRecipePage";
import { MyRecipesPage } from "./pages/MyRecipes/MyRecipesPage";
import Navbar from "./components/Navbar";
import { useState } from "react";
import useAuth from "./hooks/useAuth";

const App = () => {
  const [recipeData, setRecipeData] = useState(null);
  const [url, setUrl] = useState("");
  const { auth } = useAuth();

  const handleScrapeRecipe = async () => {
    try {
      const scrapedData = await scrapeRecipe(url, auth.token);
      setRecipeData(scrapedData.recipe_data);
    } catch (error) {
      console.error("Error fetching recipe:", error);
    }
  };

  const handleUrlChange = (e) => {
    setUrl(e.target.value);
  };

  return (
    <div className="flex flex-col w-screen min-h-screen">
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route
            path="/"
            element={
              <HomePage
                handleScrapeRecipe={handleScrapeRecipe}
                url={url}
                setUrl={setUrl}
                handleUrlChange={handleUrlChange}
                setRecipeData={setRecipeData}
              />
            }
          />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route
            path="/recipes/create"
            element={
              <CreateRecipePage
                recipeData={recipeData}
                setRecipeData={setRecipeData}
                url={url}
              />
            }
          />
          <Route
            path="/recipes/:recipe_id"
            element={<SingleRecipePage url={url} />}
          />
          {/* <Route
            path="/recipes/favouritedByOwner/:recipe_id"
            element={<SingleRecipePage token={token} setToken={setToken} />}
          /> */}
          <Route
            path="/myrecipes"
            element={
              <MyRecipesPage
                handleScrapeRecipe={handleScrapeRecipe}
                url={url}
                setUrl={setUrl}
                handleUrlChange={handleUrlChange}
                setRecipeData={setRecipeData}
              />
            }
          />
        </Routes>
      </BrowserRouter>
    </div>
  );
};

export default App;
