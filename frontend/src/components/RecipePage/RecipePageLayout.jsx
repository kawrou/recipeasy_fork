import { RecipeName } from "./RecipeFields/RecipeName";
import { RecipeDescription } from "./RecipeFields/RecipeDescription";
import { RecipeYield } from "./RecipeFields/RecipeYield";
import { RecipeTimeTaken } from "./RecipeFields/RecipeTimeTaken";
import { RecipeImage } from "./RecipeFields/RecipeImage";
import { RecipeUrl } from "./RecipeFields/RecipeUrl";
import { Tags } from "./RecipeFields/Tags";
import { FavouriteButton } from "./FavouriteButton";
import { IngredientList } from "./RecipeFields/IngredientList";
import { InstructionList } from "./RecipeFields/InstructionList";
import { SaveButton } from "./SaveButton";
import { EditButton } from "./EditButton";
import Toast from "../Toast/Toast";

const RecipePageLayout = ({
  recipe_id,
  recipeName,
  setRecipeName,
  recipeDescription,
  setRecipeDescription,
  yieldAmount,
  setYieldAmount,
  recipeTotalTime,
  setRecipeTotalTime,
  imageUrl,
  recipeUrl,
  recipeTags,
  setRecipeTags,
  hasFavouriteButton,
  favourited,
  ingredients,
  setIngredients,
  instructions,
  setInstructions,
  editMode,
  setEditMode,
  handleSaveRecipe,
  errors,
  updateErrors,
  toast,
  setToast,
}) => {
  return (
    <article className="bg-tertiary-500">
      <div className="flex divide-x-2 divide-tertiary-500 justify-center bg-white shadow-md rounded-3xl m-5 mb-2 py-20">
        {/* Recipe Introductory Details*/}
        <section className="flex justify-center w-1/2 flex-col pt-18 px-20 gap-10">
          {/* title */}
          <RecipeName
            name={recipeName}
            setName={setRecipeName}
            editMode={editMode}
            error={errors.recipeName}
            updateErrors={(string) => updateErrors("recipeName", string)}
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
              setErrors={(bool) => updateErrors("yieldAmount", bool)}
            />
            {/* timeTaken */}
            <RecipeTimeTaken
              timeTaken={recipeTotalTime}
              setTimeTaken={setRecipeTotalTime}
              editMode={editMode}
              error={errors.totalTime}
              setErrors={(bool) => updateErrors("totalTime", bool)}
            />
          </div>
          {/* Tags */}
          <div className="flex gap-10 items-center">
            <Tags
              tags={recipeTags}
              setTags={setRecipeTags}
              editMode={editMode}
            />
            {!editMode && hasFavouriteButton && (
              <div className="flex-none self-end">
                <FavouriteButton
                  recipeId={recipe_id}
                  favourited={favourited}
                  size={50}
                />
              </div>
            )}
          </div>
        </section>

        {/* Recipe Image & Source if exists*/}
        <section className="flex flex-1 flex-col gap-10 justify-center px-20 ">
          <RecipeImage imageUrl={imageUrl} />
          <RecipeUrl recipeUrl={recipeUrl} />
        </section>
      </div>
      <div className="h-4 bg-tertiary-500" />
      <section className="flex justify-center  pb-0">
        {/* Loop over recipeIngredients array */}
        <IngredientList
          recipeIngredients={ingredients}
          setRecipeIngredients={setIngredients}
          editMode={editMode}
          error={errors.ingredients}
          updateErrors={(string) => updateErrors("ingredients", string)}
        />
        <InstructionList
          recipeInstructions={instructions}
          setRecipeInstructions={setInstructions}
          editMode={editMode}
          error={errors.instructions}
          updateErrors={(string) => updateErrors("instructions", string)}
        />
      </section>

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
    </article>
  );
};

export default RecipePageLayout;
