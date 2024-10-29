import { useState } from "react";
import { FaPlus, FaTimes } from "react-icons/fa"; // Import icons from FontAwesome

export const IngredientList = ({
  recipeIngredients,
  setRecipeIngredients,
  editMode,
  error,
  updateErrors,
}) => {
  const [localError, setLocalError] = useState("");

  /**
   * Checks a given ingredients array for an empty string.
   * @param {Array} ingredients
   * @returns A boolean.
   */
  const hasEmptyField = (ingredients) => {
    return ingredients.some((ingreident) => ingreident === "");
  };

  /**
   * Adds a ingredient input field to the UI by updating the recipeIngredient's state.
   * This component maps over that recipeIngredient array to create a new field.
   * @returns Void. Updates the recipeIngredients state.
   */
  const handleAddIngredientField = () => {
    if (hasEmptyField(recipeIngredients)) {
      setLocalError(
        "Please fill in all previous fields before adding a new ingredient."
      );
      return;
    }
    setRecipeIngredients([...recipeIngredients, ""]);
  };

  const handleRemoveIngredientField = (index) => {
    // Remove the ingredient at the specified index
    const updatedIngredients = [...recipeIngredients];
    updatedIngredients.splice(index, 1);

    if (!hasEmptyField(updatedIngredients) || updatedIngredients.length === 0) {
      setLocalError("");
      updateErrors("ingredients", false);
    }

    setRecipeIngredients(updatedIngredients);
  };

  const handleInput = (e, index) => {
    const updatedIngredients = [...recipeIngredients];
    updatedIngredients[index] = e.target.value;
    setRecipeIngredients(updatedIngredients);

    if (!hasEmptyField(updatedIngredients)) {
      setLocalError("");
      updateErrors("ingredients", false);
    }
  };

  return (
    <section className="flex w-1/2 flex-col pt-16 p-20 gap-7 rounded-3xl bg-white shadow-md ml-5 mr-2.5 mb-20 h-fit">
      <h2
        id="ingredients-heading"
        className="font-kanit font-extrabold text-primary-500 text-6xl text-left"
      >
        Ingredients
      </h2>

      <fieldset aria-labelledby="error-heading" className="flex flex-col gap2">
        <legend id="error-heading" className="sr-only">
          Form Errors
        </legend>
        <ul>
          {localError && (
            <li id="local-error" role="alert" className="text-red-500">
              {localError}
            </li>
          )}
          {error && (
            <li id="global-error" role="alert" className="text-red-500">
              {"Please fill out the missing ingredients."}
            </li>
          )}
        </ul>
      </fieldset>

      <ul className="flex flex-col divide-y-2 divide-tertiary-500 font-poppins font-light text-gray-600">
        {recipeIngredients.map((ingredient, index) => (
          <li key={index} className="flex items-center py-4">
            {editMode ? (
              <input
                id={`ingredient-${index + 1}`}
                className={`w-full p-2.5 text-md placeholder:text-placeholder rounded-xl border ${(error || localError) && !ingredient ? "border-red-500" : "border-blue-200"} focus:outline-none`}
                value={ingredient}
                onChange={(e) => handleInput(e, index)}
                placeholder="Enter your ingredient..."
                aria-label={`ingredient-${index + 1}`}
              />
            ) : (
              <span
                id={`ingredient-${index + 1}`}
                className="text-left text-md py-2.5"
              >
                {ingredient}
              </span>
            )}
            {editMode && (
              <button
                className="px-2 py-1"
                onClick={() => handleRemoveIngredientField(index)}
                aria-label={`remove-ingredient-${index + 1}`}
              >
                <FaTimes className="text-secondary-500" aria-hidden="true" />
              </button>
            )}
          </li>
        ))}
      </ul>

      {/* Input for new ingredient */}
      {editMode && (
        <div className="flex justify-center items-center">
          <hr className="w-1/2 border border-tertiary-500" aria-hidden="true" />
          {/* Horizontal divider */}
          <button
            className="px-2 py-1"
            onClick={handleAddIngredientField}
            aria-label="Add-new-ingredient-field"
          >
            <FaPlus className="text-secondary-500" aria-hidden="true" />
            {/* Change color to gray */}
          </button>
          <hr className="w-1/2 border border-tertiary-500" aria-hidden="true" />
          {/* Horizontal divider */}
        </div>
      )}
    </section>
  );
};
