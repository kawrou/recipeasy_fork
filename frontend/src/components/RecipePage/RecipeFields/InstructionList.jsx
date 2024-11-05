import { useState } from "react";
import { FaPlus } from "react-icons/fa";
import { RecipeInstruction } from "./RecipeInstruction";

export const InstructionList = ({
  recipeInstructions,
  setRecipeInstructions,
  editMode,
  error,
  updateErrors,
}) => {
  const [localError, setLocalError] = useState("");

  const hasEmptyField = (instructions) => {
    return instructions.some((instruction) => instruction === "");
  };

  /**
   * Adds a text area to the UI by adding an empty string element to the recipeInstructions array state
   * which triggers a re-render of the component.
   * @returns Void. Only updates recipeInstructions state.
   */
  const handleAddInstructionField = () => {
    if (hasEmptyField(recipeInstructions)) {
      setLocalError(
        "Please fill in all previous fields before adding a new instruction.",
      );
      return;
    }
    setRecipeInstructions([...recipeInstructions, ""]);
  };

  /**
   * Handles removing a text area field from the UI by removing the element in the recipeInstructions array based on its index.
   * This triggers a re-render of the component.
   * @param {number} index - Index of the RecipeInstruction component that was created by mapping over the recipeInstructions array.
   * @returns Void. Only updates recipeInstructions state.
   */
  const handleRemoveInstructionField = (index) => {
    const updatedInstructions = [...recipeInstructions];
    updatedInstructions.splice(index, 1);
    setRecipeInstructions(updatedInstructions);

    if (
      !hasEmptyField(updatedInstructions) ||
      updatedInstructions.length === 0
    ) {
      setLocalError("");
      updateErrors(false);
    }
  };

  /**
   *
   * @param {number} index - Index of the RecipeInstruction component that was created by mapping over the recipeInstructions array.
   * @param {string} value - The string value from a user's textarea input of the RecipeInstruction component.
   */
  const setInstruction = (index, value) => {
    const updatedInstructions = [...recipeInstructions];
    updatedInstructions[index] = value;
    setRecipeInstructions(updatedInstructions);

    if (!hasEmptyField(updatedInstructions)) {
      setLocalError("");
      updateErrors(false);
    }
  };

  return (
    <section
      aria-labelledby="instructions-heading"
      className="flex flex-col text-left px-4 py-6 lg:p-20 lg:gap-7 rounded-3xl bg-white"
    >
      <h2
        id="instructions-heading"
        className="font-kanit font-extrabold text-primary-500 text-4xl lg:text-6xl text-left mb-4 lg:mb-0"
      >
        Instructions
      </h2>

      <fieldset aria-labelledby="error-heading" className="">
        <legend id="error-heading" className="sr-only">
          Form Errors
        </legend>
        <ul>
          {localError && (
            <li id="local-error" role="alert" className="text-red-500 mb-4">
              {localError}
            </li>
          )}
          {error && (
            <li id="global-error" role="alert" className="text-red-500">
              {error}
            </li>
          )}
        </ul>
      </fieldset>

      <ol className="font-poppins font-light text-gray-800">
        {recipeInstructions.map((instruction, index) => (
          <li className="mb-4 lg:mb-16 divide-y-2 last:mb-0" key={index}>
            <RecipeInstruction
              key={index}
              index={index}
              instruction={instruction}
              setInstruction={(value) => setInstruction(index, value)}
              removeInstruction={handleRemoveInstructionField}
              editMode={editMode}
              error={error || localError}
            />
          </li>
        ))}
      </ol>

      {editMode && (
        <div className="flex justify-center items-center">
          <hr className="w-1/2 border border-blue-200" aria-hidden="true" />
          <button
            className="px-2 py-1 rounded text-white"
            onClick={handleAddInstructionField}
            aria-label="add-new-instruction-field"
          >
            <FaPlus className="text-secondary-500" aria-hidden="true" />
          </button>
          <hr className="w-1/2 border border-blue-200" aria-hidden="true" />
        </div>
      )}
    </section>
  );
};
