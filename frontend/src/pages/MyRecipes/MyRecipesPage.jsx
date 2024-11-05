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
    <div className="bg-neutral-100 pb-20">
      <section className="bg-white px-6 py-10 lg:py-16">
        <div className="max-w-screen-2xl mx-auto flex flex-col items-center">
          <h1 className="flex items-center text-5xl font-kanit font-bold italic text-primary-500">
            <img
              className="w-16 mb-1.5 -mr-0.5"
              src="../../assets/recipeasyLogo.svg"
              alt="logo"
            />
            ecipeasy
          </h1>
          <p
            aria-label="Page Instructions"
            className="font-poppins py-5 font-light text-sm text-gray-600 max-w-[600px]"
          >
            Simply paste the URL of your favourite recipe page, or manually
            input your cherished recipes, and watch as Recipeasy effortlessly
            generates neatly organised recipes for you to store and access
            anytime, anywhere.
          </p>
          <div className="w-full lg:w-1/2">
            <RecipeScraper setRecipeData={setRecipeData} />
          </div>
        </div>
      </section>

      <section className="max-w-screen-2xl lg:mx-auto px-6 py-10 lg:py-16">
        <h2 className="font-kanit font-extrabold text-5xl text-primary-500 mb-10 ">
          My Recipes
        </h2>
        <div
          className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6"
          role="feed"
        >
          {renderPageContent()}
        </div>
      </section>
    </div>
  );
};
