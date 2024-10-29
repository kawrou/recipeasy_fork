import React, { useState, useEffect, useRef } from "react";

export const AutoHeightTextArea = ({
  text,
  setText,
  rows,
  placeholder,
  height,
  setHeight,
  error = null,
  setErrors = () => {},
  name,
  ariaLabel,
}) => {
  const textareaRef = useRef(null);

  useEffect(() => {
    const handleResize = () => {
      // Calculate and set the initial height after component mounts
      if (textareaRef.current) {
        const style = window.getComputedStyle(textareaRef.current);
        textareaRef.current.style.height = "auto";
        textareaRef.current.style.height = `${Math.max(
          parseFloat(style.fontSize),
          textareaRef.current.scrollHeight,
        )}px`;
        setHeight(textareaRef.current.style.height);
      }
    };

    // Add event listener for resize
    window.addEventListener("resize", handleResize);

    // Call handleResize initially to calculate height
    handleResize();

    // Cleanup the event listener
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [setHeight, text]); // Depend on text for changes in textarea content

  const handleTextAreaHeightChange = (event) => {
    if (error) setErrors((prevErrors) => ({ ...prevErrors, [name]: null }));
    const { value, style } = event.target;
    setText(value);
    style.height = "auto"; // Reset the height to auto to properly calculate the scrollHeight
    style.height = `${Math.max(
      parseFloat(window.getComputedStyle(event.target).fontSize),
      event.target.scrollHeight,
    )}px`;
    setHeight(style.height);
  };

  return (
    <textarea
      ref={textareaRef}
      className={`resize-none overflow-hidden placeholder:text-placeholder placeholder:text-wrap focus:outline-none bg-transparent w-full p-2 ${error ? "border rounded-md border-red-500" : ""}`}
      value={text}
      rows={rows}
      onChange={handleTextAreaHeightChange}
      style={{ height: height }}
      placeholder={placeholder}
      name={ariaLabel}
      aria-label={ariaLabel}
    />
  );
};
