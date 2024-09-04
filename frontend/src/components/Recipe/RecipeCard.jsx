import {} from "react";
import { Link } from "react-router-dom";
import { FavouriteButton } from "../../components/RecipePage/FavouriteButton";

const RecipeCard = ({ recipe }) => {
  return (
    <div className="w-full p-4">
      <div className="bg-white rounded-3xl overflow-hidden flex flex-col gap-4 items-center shadow-md p-5">
        <Link
          to={`/recipes/${recipe._id}`}
          className="w-full flex flex-col items-center"
        >
          <div
            className="bg-cover bg-center h-48 w-full rounded-2xl"
            style={{ backgroundImage: `url(${recipe.image})` }}
          ></div>

          <div className="w-full text-left mf-4">
            <h2 className="font-kanit text-2xl font-bold text-primary-500 mb-3">
              {recipe.name}
            </h2>
          </div>
        </Link>
        <div className="flex items-center justify-between w-full mt-4">
          <div className="flex items-center font-kanit font-bold gap-0.5 text-secondary-500">
            <img
              className="size-8 mr-2"
              src="../../assets/timeTakenIcon.svg"
              alt="Timer Image"
            />
            <p>{recipe.totalTime}</p>
            <p> mins</p>
          </div>

          <FavouriteButton
            recipeId={recipe._id}
            favourited={recipe.favouritedByOwner}
            size={30}
          />
        </div>
      </div>
    </div>
  );
};

export default RecipeCard;
