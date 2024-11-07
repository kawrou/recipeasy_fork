import RecipeScraper from "../../components/RecipeScraper";
import FigureImage from "../../components/HomePageFigureImage";
import {
  heroDescription,
  heroDescription2,
  descriptionA1,
  descriptionA2,
  descriptionB1,
  descriptionB2,
  descriptionC1,
  descriptionC2,
} from "../../lib/HomePageText";

export const HomePage = ({ setRecipeData }) => {
  return (
    <>
      <section className="max-w-screen-2xl mx-auto flex flex-col lg:flex-row lg:space-x-52 justify-center items-center py-10 lg:py-28 px-6">
        <div className="flex flex-col gap-6 items-center text-center max-w-lg ">
          <img
            src="/assets/recipeasyLogo.svg"
            className="w-1/4 lg:w-1/2 "
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
            {heroDescription2}
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

      <section className="bg-neutral-100 py-16 lg:py-36 px-6">
        <div className="max-w-screen-2xl flex flex-col items-center mx-auto gap-16 lg:gap-36">
          <FigureImage
            video={"/recipeasy-scraping-introduction-2024-11-07.webm"}
            image={"/import-recipe.png"}
            alt={"Introducing how to save a recipe from a URL."}
            title={"Import"}
            text={descriptionA2}
          />
          <FigureImage
            video={"/recipeasy-editing-intro-2024-11-07.webm"}
            alt={"Introducing how to edit recipe details."}
            title={"Edit"}
            text={descriptionB2}
            reverse={true}
          />
          <FigureImage
            video={"/recipeasy-collection-intro-2024-11-07.webm"}
            alt={"Introducing the recipe collection page."}
            title={"Collect"}
            text={descriptionC2}
          />
        </div>
      </section>
    </>
  );
};

export default HomePage;
