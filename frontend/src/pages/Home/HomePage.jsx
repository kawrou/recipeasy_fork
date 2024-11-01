import RecipeScraper from "../../components/RecipeScraper";
import FigureImage from "../../components/HomePageFigureImage";

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

      <section className="bg-backgroundColour py-20 px-10 space-y-28 lg:space-y-44">
        <FigureImage
          image={"/import-recipe.png"}
          alt={"Introducing how to save a recipe from a URL."}
          title={"Import"}
          text={
            "Just copy and paste the URL of the recipe you want to save and click the 'Generate Recipe' button."
          }
        />
        <FigureImage
          image={"/edit-recipe.png"}
          alt={"Introducing how to edit recipe details."}
          title={"Edit"}
          text={"Easily edit the name, ingredients, and instructions."}
        />
        <FigureImage
          image={"/recipe-collection.png"}
          alt={"Introducing the recipe collection page."}
          title={"Collect"}
          text={"View all your saved recipes in one place!"}
        />
      </section>
    </>
  );
};

export default HomePage;
