import React, { useState } from "react";

export const QuantitySelector = ({
  quantity,
  setQuantity,
  error,
  setErrors,
}) => {

  const handleIncrement = () => {
    setQuantity(parseInt(quantity) + 1);
  };

  const handleDecrement = () => {
    if (quantity > 0) {
      setQuantity(parseInt(quantity) - 1);
    }
  };
  // ${error && !quantity ? "border border-red-500 rounded-md" : ""}
  return (
    <>
      <form className="max-w-xs ">
        {/* <form
          className={`max-w-xs ${error && !quantity ? "border-2 rounded border-red-500" : ""}`}
        > */}
        <div className="relative flex items-center max-w-[8rem]">
          <button
            type="button"
            onClick={handleDecrement}
            // className="z-40 bg-blue-100 hover:bg-blue-200 border border-blue-300 rounded-s-lg p-3 h-11 focus:ring-blue-100 focus:ring-2 focus:outline-none"
            className={`z-40 hover:bg-blue-200 border rounded-s-lg p-3 h-11  ${error && !quantity ? "border-red-500 bg-red-100" : "border-blue-300  bg-blue-100"}`}
          >
            <svg
              className="w-3 h-3 text-gray-900"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 18 2"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M1 1h16"
              />
            </svg>
          </button>
          <input
            type="number"
            value={quantity}
            // className="z-0 font-kanit font-bold bg-blue-50 border border-x-0 border-blue-300 h-11 text-center text-secondary-500 text-md block w-full py-2.5 [-moz-appearance:_textfield] [&::-webkit-inner-spin-button]:m-0 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:m-0 [&::-webkit-outer-spin-button]:appearance-none"
            className={`z-0 font-kanit font-bold border border-x-0 ${error && !quantity ? "bg-red-50 border-red-500" : "bg-blue-50 border-blue-300"}  h-11 text-center text-secondary-500 text-md block w-full py-2.5 [-moz-appearance:_textfield] [&::-webkit-inner-spin-button]:m-0 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:m-0 [&::-webkit-outer-spin-button]:appearance-none`}
            placeholder="0"
            onChange={(e) => setQuantity(e.target.value)}
            required
          />
          <button
            type="button"
            onClick={handleIncrement}
            // className="z-40 bg-blue-100 hover:bg-blue-200 border border-blue-300 rounded-e-lg p-3 h-11 focus:ring-blue-100 focus:ring-2 focus:outline-none"
            className={`z-40 hover:bg-blue-200 border rounded-e-lg p-3 h-11  ${error && !quantity ? "border-red-500 bg-red-100" : "border-blue-300  bg-blue-100"}`}
          >
            <svg
              className="w-3 h-3 text-blue-900 "
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 18 18"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M9 1v16M1 9h16"
              />
            </svg>
          </button>
        </div>
      </form>
    </>
  );
};
