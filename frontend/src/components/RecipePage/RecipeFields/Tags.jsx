import React, { useState } from "react";

export const Tags = ({ tags, setTags, editMode }) => {
  const [tagsInput, setTagsInput] = useState("");

  const handleTagsInput = (e) => {
    if (e.key === "Enter" && tagsInput.trim() !== "") {
      const newTag = tagsInput.trim().replace(/^#/, "");
      setTags([...tags, newTag]);
      setTagsInput("");
    }
  };

  const removeTag = (tagToRemove) => {
    const updatedTags = tags.filter((tag) => tag !== tagToRemove);
    setTags(updatedTags);
  };

  return (
    <div className="font-kanit font-bold">
      <label
        htmlFor="tags-input"
        className="block mb-2 text-md text-left text-secondary-500"
      >
        Tags:
      </label>
      {editMode ? (
        <div className="flex flex-wrap rounded-xl border border-blue-200 ">
          <div className="flex flex-wrap">
            {tags.map((tag, index) => (
              <span
                key={index}
                className="flex flex-wrap pl-4 pr-2 h-9 m-1 justify-between items-center text-lg rounded-xl cursor-pointer bg-secondary-500 text-white hover:bg-blue-800 hover:text-gray-100"
              >
                {tag}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 ml-2 hover:text-gray-300"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  onClick={() => removeTag(tag)}
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                  />
                </svg>
              </span>
            ))}
            <input
              id="tags-input"
              className="font-poppins font-light p-2.5 w-fill flex-auto bg-transparent text-md text-gray-600 placeholder:text-placeholder focus:outline-none "
              placeholder="Add tags here..."
              value={tagsInput}
              onChange={(e) => setTagsInput(e.target.value)}
              onKeyDown={handleTagsInput}
            />
          </div>
        </div>
      ) : (
        <div className="flex flex-wrap gap-2">
          {tags.map((tag, index) => (
            <span
              key={index}
              className="px-4 py-2 text-sm lg:text-lg rounded-xl bg-secondary-500 text-white"
            >
              {tag}
            </span>
          ))}
        </div>
      )}
    </div>
  );
};
