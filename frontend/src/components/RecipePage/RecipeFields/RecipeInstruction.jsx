import React, { useState } from "react";
import { FaTimes } from "react-icons/fa";
import { AutoHeightTextArea } from "../AutoHeightTextArea";

export const RecipeInstruction = ({
  index,
  instruction,
  setInstruction,
  removeInstruction,
  editMode,
  error,
}) => {
  const [height, setHeight] = useState("auto");

  return (
    <>
      <h3 className="font-kanit font-extrabold text-primary-500 text-2xl text-left pb-3">
        Step {index + 1}
      </h3>
      <div className="flex items-center py-4">
        {editMode ? (
          <div
            className={`w-full p-2.5 focus:outline-none text-md text-gray-600 rounded-xl border ${error && !instruction ? "border-red-500" : "border-blue-200"}`}
          >
            <AutoHeightTextArea
              text={instruction}
              setText={setInstruction}
              rows={1}
              placeholder="Enter your Instruction..."
              height={height}
              setHeight={setHeight}
              ariaLabel={`recipe-instruction-${index + 1}`}
            />
          </div>
        ) : (
          <span key={index} className="text-left text-md py-2.5 pb-5">
            {instruction}
          </span>
        )}

        {editMode && (
          <button
            className="transform px-2 py-1"
            onClick={() => removeInstruction(index)}
          >
            <FaTimes className="text-secondary-500" />
          </button>
        )}
      </div>
    </>
  );
};
