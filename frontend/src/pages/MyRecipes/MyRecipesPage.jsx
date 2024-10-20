import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useFetchRecipes } from "../../hooks/useFetchRecipe";
import RecipeCard from "../../components/Recipe/RecipeCard";
import RecipeScraper from "../../components/RecipeScraper";

export const MyRecipesPage = ({ setRecipeData }) => {
  const navigate = useNavigate();
  const { data, loading, error, fetchRecipes } = useFetchRecipes();

  useEffect(() => {
    fetchRecipes("/recipes");
  }, [fetchRecipes]);

  useEffect(() => {
    if (error.type === "auth-error") {
      // console.log(error.message);
      navigate("/login");
    }
  }, [error, navigate]);

  const renderPageContent = () => {
    if (loading) {
      return <p aria-label="Loading message">Loading ...</p>;
    }

    if (
      error.type === "no-server-response" ||
      error.type === "unexpected-error"
    ) {
      return <p aria-label="error message">{`${error.message}`}</p>;
    }

    if (
      !loading &&
      Object.keys(error).length === 0 &&
      (!data || data.length === 0)
    ) {
      return <p aria-label="Empty Recipes"> Start saving recipes!</p>;
    }

    return data.map((recipe, index) => {
      return <RecipeCard recipe={recipe} key={index} />;
    });
  };

  return (
    <div className="flex flex-col items-center bg-tertiary-500">
      <div className="flex justify-center bg-white shadow-md">
        <div className="flex flex-col items-center w-1/2 py-10 px-20">
          <h1 className="flex items-center mb-6 text-5xl font-kanit font-bold italic text-primary-500">
            <img
              className="w-16 mb-1.5 -mr-0.5"
              src="../../assets/recipeasyLogo.svg"
              alt="logo"
            />
            ecipeasy
          </h1>
          <p
            aria-label="Page Instructions"
            className="font-poppins py-5 font-extralight text-sm text-gray-600"
          >
            Simply paste the URL of your favourite recipe page, or manually
            input your cherished recipes, and watch as Recipeasy effortlessly
            generates neatly organised recipes for you to store and access
            anytime, anywhere.
          </p>
          <RecipeScraper setRecipeData={setRecipeData} />
        </div>
      </div>

      <div className="flex flex-col items-center mx-20 my-10">
        <h2 className="font-kanit font-extrabold text-5xl text-primary-500 bg-white w-fit px-5 py-3 mb-6 rounded-3xl shadow-md">
          {" "}
          My Recipes
        </h2>
        <div
          className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2 flex-wrap"
          role="feed"
        >
          {renderPageContent()}
        </div>
      </div>
    </div>
  );
};
