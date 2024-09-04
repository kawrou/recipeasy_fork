import { useState } from "react";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";

export const FavouriteButton = ({ recipeId, favourited, size }) => {
  const [favStatus, setFavStatus] = useState(favourited);
  const axiosPrivate = useAxiosPrivate();
  const handleFavButtonClick = async () => {
    try {
      await axiosPrivate.patch(`/recipes/${recipeId}/favourite`);
      setFavStatus((prevStatus) => !prevStatus);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div>
      <button aria-label="favourite-button" onClick={handleFavButtonClick}>
        {favStatus ? (
          <FaHeart
            className="text-primary-500"
            size={size}
            aria-label="heart-icon"
          />
        ) : (
          <FaRegHeart
            className="text-primary-500"
            size={size}
            aria-label="reg-heart-icon"
          />
        )}
      </button>
    </div>
  );
};
