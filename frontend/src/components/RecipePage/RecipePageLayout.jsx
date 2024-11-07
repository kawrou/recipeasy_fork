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
    <article className="bg-neutral-200 py-1">
      {/* Top Section */}
      <section className="flex flex-col lg:flex-row lg:divide-x-2 bg-white shadow-md rounded-xl lg:rounded-3xl m-5 py-6 lg:py-20 lg:px-10 gap-5 lg:gap-0">
        {/* Left- Recipe Introductory Details*/}
        <section className="px-4 lg:pr-16 flex flex-col gap-5 lg:gap-10 justify-center basis-1/2">
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
          <div className="flex flex-row items-center lg:items-start">
            <Tags
              tags={recipeTags}
              setTags={setRecipeTags}
              editMode={editMode}
            />
            {!editMode && hasFavouriteButton && (
              <div className="">
                <FavouriteButton
                  recipeId={recipe_id}
                  favourited={favourited}
                  size={50}
                />
              </div>
            )}
          </div>
        </section>

        {/* Right - Recipe Image & Source if exists*/}
        <section className="px-4 lg:pl-8 basis-1/2 flex flex-col items-center justify-center">
          <div className="mb-5">
            <RecipeImage imageUrl={imageUrl} />
          </div>
          <RecipeUrl recipeUrl={recipeUrl} />
        </section>
      </section>

      {/* Bottom Section */}
      <section className="flex flex-col lg:flex-row m-5 gap-5">
        {/* Loop over recipeIngredients array */}
        <div className="basis-1/2">
          <IngredientList
            recipeIngredients={ingredients}
            setRecipeIngredients={setIngredients}
            editMode={editMode}
            error={errors.ingredients}
            updateErrors={(string) => updateErrors("ingredients", string)}
          />
        </div>
        <div className="basis-1/2">
          <InstructionList
            recipeInstructions={instructions}
            setRecipeInstructions={setInstructions}
            editMode={editMode}
            error={errors.instructions}
            updateErrors={(string) => updateErrors("instructions", string)}
          />
        </div>
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
