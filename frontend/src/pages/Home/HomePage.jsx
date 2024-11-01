import RecipeScraper from "../../components/RecipeScraper";

export const HomePage = ({ setRecipeData }) => {
  return (
    // <div className="flex flex-col justify-center items-center flex-auto">
    <>
      <section className="flex flex-col lg:flex-row justify-center items-center p-10">
        <div className="flex flex-col items-center text-center lg:text-left max-w-lg">
          <img
            src="/assets/recipeasyLogo.svg"
            className="w-56 py-4"
            alt="Recipeasy logo"
          />
          <h1 className="font-kanit font-extrabold text-primary-500 italic text-6xl pb-4">
            Recipeasy
          </h1>
          <h2 className="font-kanit font-medium text-primary-500 text-xl pb-4">
            Your Hassle-Free Recipe Organiser
          </h2>
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
        <figure className="p-20">
          <img src="/assets/HomepageImage.svg" />
          <figcaption>
            <a
              href="https://www.vecteezy.com/free-vector/cooking"
              className="text-gray-400 hover:text-gray-600"
            >
              Cooking Vectors by Vecteezy
            </a>
          </figcaption>
        </figure>
      </section>

      <section className="bg-slate-300 w-full flex flex-col items-center">
        <figure>
          <img
            src="/import-recipe.png"
            className="w-2/3 py-4 rounded-lg"
            alt="Introducing how to import a recipe with url"
            loading="lazy"
          />
          <figcaption>
            <h2>Import</h2>
            <p>
              Just copy and paste the URL of the recipe you want to save and
              click the "Generate Recipe" button.
            </p>
          </figcaption>
        </figure>
        <figure>
          <img
            src="/edit-recipe.png"
            className="w-2/3 py-4"
            alt="Introducing how to edit a recipe"
            loading="lazy"
          />
          <figcaption>
            <h2>Edit</h2>
            <p>Easily edit the name, ingredients, and instructions.</p>
          </figcaption>
        </figure>
        <figure>
          <img
            src="/recipe-collection.png"
            className="w-2/3 py-4"
            alt="Introducing the recipe collection page"
            loading="lazy"
          />
          <figcaption>
            <h2>Collect</h2>
            <p>View all your saved recipe in one place.</p>
          </figcaption>
        </figure>
      </section>
    </>
    // </div>
  );
};

export default HomePage;
