import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { useFetchRecipes } from "../../hooks/useFetchRecipe";
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
import { FavouriteButton } from "../../components/RecipePage/FavouriteButton";

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

  const handleSaveRecipe = async () => {
    if (
      recipeName === "" ||
      yieldAmount === 0 ||
      recipeTotalTime === 0 ||
      ingredients.some((ingredient) => ingredient === "") ||
      instructions.some((instruction) => instruction === "")
    ) {
      //TODO:This should really be some Modal.
      alert("Please fill out all the required fields");
      return;
    }

    try {
      const data = {
        name: recipeName,
        description: recipeDescription,
        tags: recipeTags,
        totalTime: recipeTotalTime,
        recipeYield: yieldAmount,
        recipeIngredient: ingredients,
        recipeInstructions: instructions,
        url: recipeUrl,
        image: imageUrl,
        dateAdded: new Date().toISOString(),
      };

      await axiosPrivate.patch(`/recipes/${recipe_id}`, data);
      setEditMode(!editMode);
    } catch (err) {
      //TODO: Need to figureout appropriate error modal
      console.log(err);
      if (err?.response.status === 401) {
        navigate("/login");
      }
    }
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
              />
              {/* timeTaken */}
              <RecipeTimeTaken
                timeTaken={recipeTotalTime}
                setTimeTaken={setRecipeTotalTime}
                editMode={editMode}
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
          />
          <InstructionList
            recipeInstructions={instructions}
            setRecipeInstructions={setInstructions}
            editMode={editMode}
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

  return <>{renderPageContent()}</>;
};
