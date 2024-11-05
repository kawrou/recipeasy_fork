import { Link } from "react-router-dom";
import { FavouriteButton } from "../../components/RecipePage/FavouriteButton";

const RecipeCard = ({ recipe }) => {
  return (
    <article className=" overflow-hidden bg-white rounded-2xl flex flex-col justify-between gap-4 shadow-lg">
      <Link to={`/recipes/${recipe._id}`} className="">
        <figure className="">
          {recipe.image ? (
            <div className="overflow-hidden h-40">
              <img
                src={recipe.image}
                alt={`${recipe.name} photo`}
                loading="lazy"
                className="object-cover bg-center h-full w-full transition-transform duration-300 ease-in-out transform hover:scale-105"
              ></img>
            </div>
          ) : (
            <div className="h-40 w-full bg-gray-200"></div>
          )}
          <figcaption className="text-left px-2">
            <h3 className="font-kanit lg:text-lg text-orange-800 mb-3 hover:text-orange-200">
              {recipe.name}
            </h3>
          </figcaption>
        </figure>
      </Link>
      <div className="flex items-center justify-between px-2 mb-4">
        <div className="flex items-center font-kanit text-gray-800">
          <img
            className="size-8 mr-2"
            src="../../assets/timeTakenIcon.svg"
            alt="Timer Image"
          />
          <time dateTime={`PT${recipe.totalTime}M`} className="text-sm">
            {recipe.totalTime} mins
          </time>
        </div>

        <FavouriteButton
          recipeId={recipe._id}
          favourited={recipe.favouritedByOwner}
          size={30}
        />
      </div>
    </article>
  );
};

export default RecipeCard;
