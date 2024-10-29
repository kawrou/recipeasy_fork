import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";

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

import ToastList from "../../components/ToastList/ToastList";

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

  //----------------------------
  const [toasts, setToasts] = useState([]);
  const [autoClose, setAutoClose] = useState(true);
  const [autoCloseDuration, setAutoCloseDuration] = useState(5);
  const [position, setPosition] = useState("bottom-right");

  const removeToast = (id) => {
    setToasts((prevToasts) => prevToasts.filter((toast) => toast.id !== id));
  };

  const removeAllToasts = () => {
    setToasts([]);
  };

  const showToast = (message, type) => {
    const toast = {
      id: Date.now(),
      message,
      type,
    };

    setToasts((prevToasts) => [...prevToasts, toast]);

    if (autoClose) {
      setTimeout(() => {
        removeToast(toast.id);
      }, autoCloseDuration * 1000);
    }
  };
  //--------------------------

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
      newErrors.ingredients = true;

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
      return;
    }

    // if (
      // recipeName === "" ||
      // yieldAmount === 0 ||
      // recipeTotalTime === 0 ||
      // ingredients.some((ingredient) => ingredient === "") ||
      // ingredients.length === 0
      // instructions.some((instruction) => instruction === "") ||
      // instructions.length === 0
    // ) {
      // alert("Please fill out all the required fields");
      // return;
    // }

    //Do we need a Try/Catch block here?
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

    try {
      const response = await axiosPrivate.post("/recipes", data);
      //setRecipeData is set to null so that upon revisit, the page will be empty
      setRecipeData(null);
      navigate(`/recipes/${response.data.recipeId}`);
    } catch (err) {
      console.log("Problem saving recipe.");
    }
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
          setErrors={setErrors}
        />
      </div>

      {editMode ? (
        <SaveButton handleSaveRecipe={handleSaveRecipe} />
      ) : (
        <EditButton editMode={editMode} setEditMode={setEditMode} />
      )}
    </div>
  );
};
