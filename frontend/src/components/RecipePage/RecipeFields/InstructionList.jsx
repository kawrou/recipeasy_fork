import React from "react";
import { FaPlus } from "react-icons/fa";
import { RecipeInstruction } from "./RecipeInstruction";

export const InstructionList = ({
  recipeInstructions,
  setRecipeInstructions,
  editMode,
  error,
  setErrors,
}) => {
  /**
   * Adds a text area to the UI by adding an empty string element to the recipeInstructions array state
   * which triggers a re-render of the component.
   * @returns Void. Only updates recipeInstructions state.
   */
  const handleAddInstruction = () => {
    if (recipeInstructions.some((instruction) => instruction === "")) {
      // alert(
      //   "Please fill in all previous fields before adding a new Instruction."
      // );
      setErrors((prevErrors) => ({
        ...prevErrors,
        ["recipeInstructions"]:
          "Please fill in all previous fields before adding a new instruction.",
      }));
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
  const handleRemoveInstruction = (index) => {
    const updatedInstructions = [...recipeInstructions];
    updatedInstructions.splice(index, 1);
    setRecipeInstructions(updatedInstructions);
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
    setErrors((prevErrors) => ({
      ...prevErrors,
      ["recipeInstructions"]: "",
    }));
  };

  return (
    <div className="flex w-1/2 flex-col pt-16 p-20 gap-7 rounded-3xl shadow-md bg-white mr-5 ml-2.5 mb-20 h-fit">
      <div className="font-kanit font-extrabold text-primary-500 text-6xl text-left">
        Method
      </div>
      <div className="flex flex-col">
        <div className="flex flex-col font-poppins font-extralight text-gray-600">
          {error && (
            <p className="text-red-500 text-base font-normal mt-1">{error}</p>
          )}
          {recipeInstructions.map((instruction, index) => (
            <RecipeInstruction
              key={index}
              index={index}
              instruction={instruction}
              setInstruction={(value) => setInstruction(index, value)}
              removeInstruction={handleRemoveInstruction}
              editMode={editMode}
              error={error}
            />
          ))}
        </div>

        {editMode && (
          <div className="flex justify-center items-center">
            <div className="w-1/2 border border-tertiary-500" />{" "}
            <button
              className="px-2 py-1 rounded text-white"
              onClick={handleAddInstruction}
            >
              <FaPlus className="text-secondary-500" />
            </button>
            <div className="w-1/2 border border-tertiary-500" />{" "}
          </div>
        )}
      </div>
    </div>
  );
};
