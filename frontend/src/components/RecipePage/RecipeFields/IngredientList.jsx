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
        "Please fill in all previous fields before adding a new ingredient.",
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
    <div className="flex w-1/2 flex-col pt-16 p-20 gap-7 rounded-3xl bg-white shadow-md ml-5 mr-2.5 mb-20 h-fit">
      <div className="font-kanit font-extrabold text-primary-500 text-6xl text-left">
        Ingredients
      </div>
      <div className="flex flex-col">
        {localError && (
          <p className="text-red-500 text-base font-normal mt-1">
            {localError}
          </p>
        )}
        {error && (
          <p className="text-red-500 text-base font-normal mt-1">
            {"Please fill out missing fields."}
          </p>
        )}
        <div className="flex flex-col divide-y-2 divide-tertiary-500 font-poppins font-extralight text-gray-600">
          {recipeIngredients.map((ingredient, index) =>
            editMode ? (
              <div key={index} className="flex items-center py-4">
                <input
                  className={`w-full p-2.5 text-md rounded-xl border ${(error || localError) && !ingredient ? "border-red-500" : "border-blue-200"} focus:outline-none`}
                  value={ingredient}
                  onChange={(e) => handleInput(e, index)}
                  placeholder="Enter your ingredient..."
                />
                <button
                  className="px-2 py-1 rounded text-white"
                  onClick={() => handleRemoveIngredientField(index)}
                  aria-label="Remove-ingredient-field"
                >
                  <FaTimes className="text-secondary-500" />{" "}
                  {/* Change color to gray */}
                </button>
              </div>
            ) : (
              <div key={index} className="text-left text-md py-2.5">
                {ingredient}
              </div>
            ),
          )}
        </div>

        {/* Input for new ingredient */}
        {editMode && (
          <div className="flex justify-center items-center">
            <hr
              className="w-1/2 border border-tertiary-500"
              aria-hidden="true"
            />{" "}
            {/* Horizontal divider */}
            <button
              className="px-2 py-1"
              onClick={handleAddIngredientField}
              aria-label="Add-new-ingredient-field"
            >
              <FaPlus className="text-secondary-500" aria-hidden="true" />{" "}
              {/* Change color to gray */}
            </button>
            <hr
              className="w-1/2 border border-tertiary-500"
              aria-hidden="true"
            />{" "}
            {/* Horizontal divider */}
          </div>
        )}
      </div>
    </div>
  );
};
