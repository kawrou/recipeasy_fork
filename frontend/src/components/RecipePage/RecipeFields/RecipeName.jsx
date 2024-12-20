import React, { useState } from "react";
import { AutoHeightTextArea } from "../AutoHeightTextArea";

export const RecipeName = ({
  name,
  setName,
  editMode,
  error,
  updateErrors,
}) => {
  const [height, setHeight] = useState("auto");

  return (
    <div className="font-kanit text-4xl lg:text-8xl font-extrabold text-left text-primary-500 ">
      {editMode ? (
        <div>
          <AutoHeightTextArea
            text={name}
            setText={setName}
            rows={1}
            placeholder={"Enter your title..."}
            height={height}
            setHeight={setHeight}
            error={error}
            updateErrors={updateErrors}
            ariaLabel={"recipe-name"}
          />
          {error && (
            <p className="text-red-500 text-base font-normal mt-1">{error}</p>
          )}
        </div>
      ) : (
        <h1 className="text-4xl lg:text-8xl">{name}</h1>
      )}
    </div>
  );
};
