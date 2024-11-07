import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { useFetchRecipes } from "../../hooks/useFetchRecipe";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import { promiseHandler } from "../../services/promiseHandler";

import RecipePageLayout from "../../components/RecipePage/RecipePageLayout";

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
      // console.log(error.message);
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
      <RecipePageLayout
        recipe_id={recipe_id}
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
        hasFavouriteButton={true}
        favourited={data.favouritedByOwner}
        ingredients={ingredients}
        setIngredients={setIngredients}
        instructions={instructions}
        setInstructions={setInstructions}
        editMode={editMode}
        setEditMode={setEditMode}
        handleSaveRecipe={handleSaveRecipe}
        errors={errors}
        updateErrors={updateErrors}
        toast={toast}
        setToast={setToast}
      />
    );
  };

  return <>{renderPageContent()}</>;
};
