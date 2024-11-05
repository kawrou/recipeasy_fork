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
      <h3 className="font-kanit font-extrabold text-primary-500 text-2xl text-left mb-4">
        Step {index + 1}
      </h3>
      <div className="flex flex-col lg:flex-row items-center py-4 gap-4">
        {editMode ? (
          <div
            className={`flex-grow w-full text-gray-600 rounded-xl border ${error && !instruction ? "border-red-500" : "border-blue-200"} focus:outline-none focus:ring-2 focus:ring-blue-500`}
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
          <p key={index} className="pt-3">
            {instruction}
          </p>
        )}

        {editMode && (
          <button className="" onClick={() => removeInstruction(index)}>
            <FaTimes className="text-secondary-500" />
          </button>
        )}
      </div>
    </>
  );
};
