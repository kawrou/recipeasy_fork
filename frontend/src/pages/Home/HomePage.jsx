import RecipeScraper from "../../components/RecipeScraper";

export const HomePage = ({ setRecipeData }) => {
  return (
    <>
      <section className="min-h-screen flex flex-col lg:flex-row lg:space-x-52 justify-center items-center p-10">
        <div className="flex flex-col space-y-6 items-center text-center max-w-lg ">
          <img
            src="/assets/recipeasyLogo.svg"
            className="w-1/3 lg:w-1/2 "
            alt="Recipeasy logo"
          />
          <h1 className="font-kanit font-extrabold text-primary-500 italic text-5xl lg:text-7xl ">
            Recipeasy
          </h1>
          <h2 className="font-kanit font-medium text-primary-500 text-lg lg:text-2xl ">
            Your Hassle-Free Recipe Organiser
          </h2>
          <p
            aria-label="Page Instructions"
            className="font-poppins  font-extralight text-sm lg:text-lg text-gray-600"
          >
            Simply paste the URL of your favourite recipe page, or manually
            input your cherished recipes, and watch as Recipeasy effortlessly
            generates neatly organised recipes for you to store and access
            anytime, anywhere.
          </p>
          <div className="w-full">
            <RecipeScraper setRecipeData={setRecipeData} />
          </div>
        </div>
        <figure className="">
          <img src="/assets/HomepageImage.svg" />
          <figcaption>
            <a
              href="https://www.vecteezy.com/free-vector/cooking"
              className="text-gray-400 hover:text-gray-600 text-sm font-poppins"
            >
              Cooking Vectors by Vecteezy
            </a>
          </figcaption>
        </figure>
      </section>

      <section className="bg-backgroundColour py-20 px-10">
        <figure className="">
          <img
            src="/import-recipe.png"
            className="lg:w-2/3 mx-auto rounded-xl shadow-xl"
            alt="Introducing how to import a recipe with url"
            loading="lazy"
          />
          <figcaption className="bg-white m-7 p-4 rounded-xl shadow-xl lg:w-1/3 lg:mx-auto">
            <h2 className="font-kanit text-lg lg:text-2xl">Import</h2>
            <p className="font-poppins text-sm lg:text-lg">
              Just copy and paste the URL of the recipe you want to save and
              click the "Generate Recipe" button.
            </p>
          </figcaption>
        </figure>
        {/* <figure className="text-center">
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
        <figure className="text-center">
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
        </figure> */}
      </section>
    </>
  );
};

export default HomePage;
