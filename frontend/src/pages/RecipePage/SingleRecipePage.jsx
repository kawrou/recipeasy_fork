import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { useFetchRecipes } from "../../hooks/useFetchRecipe";
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
import { FavouriteButton } from "../../components/RecipePage/FavouriteButton";

import Toast from "../../components/Toast/Toast";

export const SingleRecipePage = () => {
  const navigate = useNavigate();
  const axiosPrivate = useAxiosPrivate();
  const { data, loading, error, fetchRecipes } = useFetchRecipes();

  const { recipe_id } = useParams();

  const [editMode, setEditMode] = useState(false);
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
    if (recipe_id) {
      fetchRecipes(`/recipes/${recipe_id}`);
    } else {
      navigate("/myrecipes");
    }
  }, [fetchRecipes, navigate, recipe_id]);

  useEffect(() => {
    if (error.type === "auth-error") {
      console.log(error.message);
      navigate("/login");
    }

    if (data) {
      setRecipeName(data.name || "");
      setRecipeDescription(data.description || "");
      setYieldAmount(data.recipeYield || 0);
      setRecipeTotalTime(data.totalTime || 0);
      setIngredients(data.recipeIngredient || []);
      setInstructions(data.recipeInstructions || []);
      setImageUrl(data.image || "");
      setRecipeUrl(data.url || "");
      setRecipeTags(data.tags || []);
    }
  }, [data, error, navigate]);

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

    const res = await promiseHandler(
      axiosPrivate.patch(`/recipes/${recipe_id}`, data),
    );

    if (!res.success && res.error?.status === 401) {
      navigate("/login");
    }

    if (!res.success) {
      setToast({
        message: res.error?.message,
        type: "failure",
        isVisible: true,
      });
      return;
    }

    setEditMode(!editMode);
  };

  const renderPageContent = () => {
    if (loading) {
      return <p aria-label="Loading message">Loading ...</p>;
    }

    if (
      error.type === "no-server-response" ||
      error.type === "unexpected-error"
    ) {
      return <p aria-label="error message">{`${error.message}`}</p>;
    }

    if (
      !loading &&
      Object.keys(error).length === 0 &&
      (!data || data.length === 0)
    ) {
      return <p aria-label="Empty Recipes"> No recipe data.</p>;
    }

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
            <div className="flex gap-10 items-center">
              <Tags
                tags={recipeTags}
                setTags={setRecipeTags}
                editMode={editMode}
              />
              {!editMode && (
                <div className="flex-none self-end">
                  <FavouriteButton
                    recipeId={recipe_id}
                    favourited={data.favouritedByOwner}
                    size={50}
                  />
                </div>
              )}
            </div>
          </div>
          <div className="flex flex-1 flex-col gap-10 justify-center px-20 ">
            <RecipeImage imageUrl={imageUrl} />
            <RecipeUrl recipeUrl={recipeUrl} />
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

  return <>{renderPageContent()}</>;
};
