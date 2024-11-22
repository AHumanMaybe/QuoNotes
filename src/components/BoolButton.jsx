import React from "react"

function BoolButton({ isChecked, toggleChecked }) {
    // Button to toggle flashcard type
    return (
      <div className="px-8 sm:px-16 mt-[3vh]">
        <label className="relative inline-block w-16 h-8 sm:w-32 sm:h-16">
          <input
            className="sr-only peer"
            type="checkbox"
            checked={isChecked}
            onChange={toggleChecked}
          />
          <div className="absolute inset-0 bg-clg rounded-full cursor-pointer transition duration-400 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-textcl peer-checked:bg-textcl"/>
          <div className="absolute w-8 h-8 sm:w-16 sm:h-16 bg-white rounded-full left-1 bottom-1 transition-transform duration-400 peer-checked:transform peer-checked:translate-x-full"/>
        </label>
      </div>
    );
  }

export default BoolButton
