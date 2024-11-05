import React from "react";

export const RecipeImage = ({ imageUrl }) => {
  return (
    <div className="bg-gray-300 rounded-3xl aspect-square overflow-hidden max-h-[640px]">
      {imageUrl && (
        <img
          className="object-cover bg-center h-full w-full rounded-3xl"
          src={imageUrl}
          alt="Recipe photo"
        ></img>
      )}
    </div>
  );
};
