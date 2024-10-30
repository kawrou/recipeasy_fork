import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import { promiseHandler } from "../../services/promiseHandler";

import { Tags } from "../../components/RecipePage/RecipeFields/Tags";
import { IngredientList } from "../../components/RecipePage/RecipeFields/IngredientList";
import { InstructionList } from "../../components/RecipePage/RecipeFields/InstructionList";
import { RecipeName } from "../../components/RecipePage/RecipeFields/RecipeName";
import { RecipeDescription } from "../../components/RecipePage/RecipeFields/RecipeDescription";
import { RecipeYield } from "../../components/RecipePage/RecipeFields/RecipeYield";
import { RecipeTimeTaken } from "../../components/RecipePage/RecipeFields/RecipeTimeTaken";
import { RecipeImage } from "../../components/RecipePage/RecipeFields/RecipeImage";
import { RecipeUrl } from "../../components/RecipePage/RecipeFields/RecipeUrl";

import { SaveButton } from "../../components/RecipePage/SaveButton";
import { EditButton } from "../../components/RecipePage/EditButton";

import Toast from "../../components/Toast/Toast";

export const CreateRecipePage = ({ recipeData, setRecipeData }) => {
  const navigate = useNavigate();
  const axiosPrivate = useAxiosPrivate();
  const [editMode, setEditMode] = useState(true);

  const [recipeName, setRecipeName] = useState("");
  const [recipeDescription, setRecipeDescription] = useState("");
  const [yieldAmount, setYieldAmount] = useState(0);
  const [recipeTotalTime, setRecipeTotalTime] = useState(0);
  const [ingredients, setIngredients] = useState([]);
  const [instructions, setInstructions] = useState([]);
  const [imageUrl, setImageUrl] = useState("");
  const [recipeTags, setRecipeTags] = useState([]);
  const [url, setUrl] = useState("");

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
        url = "",
      } = recipeData;

      setRecipeName(name);
      setRecipeDescription(description);
      setYieldAmount(recipeYield);
      setRecipeTotalTime(totalTime);
      setIngredients(recipeIngredient);
      setInstructions(recipeInstructions);
      setImageUrl(image);
      setRecipeTags(tags);
      setUrl(url);
    }
  }, [recipeData]);

  const validateForm = () => {
    const newErrors = {};
    if (!recipeName) newErrors.recipeName = "Please enter a recipe name.";

    if (
      instructions.some((instruction) => instruction === "") ||
      instructions.length === 0
    )
      newErrors.recipeInstructions = "Please fill out all the instructions.";

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
      url: url,
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
    <div className="bg-tertiary-500">
      <div className="flex divide-x-2 divide-tertiary-500 justify-center bg-white shadow-md rounded-3xl m-5 mb-2 py-20">
        <div className="flex justify-center w-1/2 flex-col pt-18 px-20 gap-10">
          {/* title */}
          <RecipeName
            name={recipeName}
            setName={setRecipeName}
            editMode={editMode}
            error={errors.recipeName}
            setErrors={setErrors}
          />
          {/* description */}
          <RecipeDescription
            description={recipeDescription}
            setDescription={setRecipeDescription}
            editMode={editMode}
          />
          <div className="flex flex-wrap gap-2 divide-x">
            {/* recipeYield */}
            <RecipeYield
              recipeYield={yieldAmount}
              setRecipeYield={setYieldAmount}
              editMode={editMode}
              error={errors.yieldAmount}
              setErrors={setErrors}
            />
            {/* timeTaken */}
            <RecipeTimeTaken
              timeTaken={recipeTotalTime}
              setTimeTaken={setRecipeTotalTime}
              editMode={editMode}
              error={errors.totalTime}
              setErrors={setErrors}
            />
          </div>
          {/* Tags */}
          <Tags tags={recipeTags} setTags={setRecipeTags} editMode={editMode} />
        </div>
        <div className="flex flex-1 flex-col gap-10 justify-center px-20 ">
          <RecipeImage imageUrl={imageUrl} />
          <RecipeUrl recipeUrl={url} />
        </div>
      </div>
      <div className="h-4 bg-tertiary-500" />
      <div className="flex justify-center  pb-0">
        {/* Loop over recipeIngredients array */}
        <IngredientList
          recipeIngredients={ingredients}
          setRecipeIngredients={setIngredients}
          editMode={editMode}
          error={errors.ingredients}
          updateErrors={updateErrors}
        />
        <InstructionList
          recipeInstructions={instructions}
          setRecipeInstructions={setInstructions}
          editMode={editMode}
          error={errors.recipeInstructions}
          updateErrors={updateErrors}
        />
      </div>

      {editMode ? (
        <SaveButton handleSaveRecipe={handleSaveRecipe} />
      ) : (
        <EditButton editMode={editMode} setEditMode={setEditMode} />
      )}

      {toast.isVisible && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast({ ...toast, isVisible: false })}
        />
      )}
    </div>
  );
};
