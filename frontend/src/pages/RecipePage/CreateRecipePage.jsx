import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import { promiseHandler } from "../../services/promiseHandler";

import RecipePageLayout from "../../components/RecipePage/RecipePageLayout";

export const CreateRecipePage = ({ recipeData, setRecipeData }) => {
  const navigate = useNavigate();
  const axiosPrivate = useAxiosPrivate();

  const [recipeName, setRecipeName] = useState("");
  const [recipeDescription, setRecipeDescription] = useState("");
  const [yieldAmount, setYieldAmount] = useState(0);
  const [recipeTotalTime, setRecipeTotalTime] = useState(0);
  const [ingredients, setIngredients] = useState([]);
  const [instructions, setInstructions] = useState([]);
  const [imageUrl, setImageUrl] = useState("");
  const [recipeTags, setRecipeTags] = useState([]);
  const [recipeUrl, setRecipeUrl] = useState("");

  const [errors, setErrors] = useState({});

  const [toast, setToast] = useState({
    message: "",
    type: "",
    isVisible: false,
  });

  useEffect(() => {
    if (recipeData) {
      const {
        name = "",
        description = "",
        recipeYield = 0,
        tags = [],
        totalTime = 0,
        recipeIngredient = [],
        recipeInstructions = [],
        image = "",
        recipeUrl = "",
      } = recipeData;

      setRecipeName(name);
      setRecipeDescription(description);
      setYieldAmount(recipeYield);
      setRecipeTotalTime(totalTime);
      setIngredients(recipeIngredient);
      setInstructions(recipeInstructions);
      setImageUrl(image);
      setRecipeTags(tags);
      setRecipeUrl(recipeUrl);
    }
  }, [recipeData]);

  const validateForm = () => {
    const newErrors = {};
    if (!recipeName) newErrors.recipeName = "Please enter a recipe name.";

    if (
      instructions.some((instruction) => instruction === "") ||
      instructions.length === 0
    )
      newErrors.instructions = "Please fill out all the instructions.";

    if (yieldAmount === 0) newErrors.yieldAmount = true;

    if (recipeTotalTime === 0) newErrors.totalTime = true;

    if (
      ingredients.some((ingredient) => ingredient === "") ||
      ingredients.length === 0
    )
      newErrors.ingredients = "Please fill out the missing ingredients.";

    return newErrors;
  };

  /**
   * A callback for child components to update the errors object state in the parent component.
   * Would generally be used when setting the state for a key to false.
   * @param {string} key - A key in the error object.
   * @param {boolean} hasError - The value should generally be false.
   */
  const updateErrors = (key, hasError) => {
    setErrors((prevErrors) => ({
      ...prevErrors,
      [key]: hasError,
    }));
  };

  const handleSaveRecipe = async () => {
    const validationErrors = validateForm();

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      setToast({
        message: "Please fill out all the recipe information.",
        type: "warning",
        isVisible: true,
      });
      return;
    }

    const data = {
      name: recipeName,
      description: recipeDescription,
      tags: recipeTags,
      favouritedByOwner: false,
      totalTime: recipeTotalTime,
      recipeYield: yieldAmount,
      recipeIngredient: ingredients,
      recipeInstructions: instructions,
      url: recipeUrl,
      image: imageUrl,
      dateAdded: new Date().toISOString(),
    };

    const res = await promiseHandler(axiosPrivate.post("/recipes", data));

    if (!res.success) {
      setToast({
        message: res.error?.message,
        type: "failure",
        isVisible: true,
      });
      return;
    }

    //set recipe data to null so that upon revisit, the page will be empty
    setRecipeData(null);
    navigate(`/recipes/${res.response.data.recipeId}`);
  };

  return (
    <RecipePageLayout
      recipeName={recipeName}
      setRecipeName={setRecipeName}
      recipeDescription={recipeDescription}
      setRecipeDescription={setRecipeDescription}
      yieldAmount={yieldAmount}
      setYieldAmount={setYieldAmount}
      recipeTotalTime={recipeTotalTime}
      setRecipeTotalTime={setRecipeTotalTime}
      imageUrl={imageUrl}
      recipeUrl={recipeUrl}
      recipeTags={recipeTags}
      setRecipeTags={setRecipeTags}
      ingredients={ingredients}
      setIngredients={setIngredients}
      instructions={instructions}
      setInstructions={setInstructions}
      editMode={true}
      handleSaveRecipe={handleSaveRecipe}
      errors={errors}
      updateErrors={updateErrors}
      toast={toast}
      setToast={setToast}
    />
  );
};
