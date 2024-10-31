import { useState } from "react";

const useRecipeState = (initialData) => {
  const [recipeName, setRecipeName] = useState(initialData?.name || "");
  const [recipeDescription, setRecipeDescription] = useState(
    initialData?.description || "",
  );
  const [yieldAmount, setYieldAmount] = useState(initialData?.recipeYield || 0);
  const [recipeTotalTime, setRecipeTotalTime] = useState(
    initialData?.totalTime || 0,
  );
  const [ingredients, setIngredients] = useState(
    initialData?.recipeIngredient || [],
  );
  const [instructions, setInstructions] = useState(
    initialData?.recipeInstructions || [],
  );
  const [imageUrl, setImageUrl] = useState(initialData?.image || "");
  const [recipeUrl, setRecipeUrl] = useState(initialData?.url || "");
  const [recipeTags, setRecipeTags] = useState(initialData?.tags || []);

  return {
    recipeName,
    setRecipeName,
    recipeDescription,
    setRecipeDescription,
    yieldAmount,
    setYieldAmount,
    recipeTotalTime,
    setRecipeTotalTime,
    ingredients,
    setIngredients,
    instructions,
    setInstructions,
    imageUrl,
    setImageUrl,
    recipeUrl,
    setRecipeUrl,
    recipeTags,
    setRecipeTags,
  };
};

export default useRecipeState;
