import React, { useState } from 'react';

function ManualCards({ input, onChange, index }) {

    return (
        <div className="flex items-center w-1/2 h-full p-2">
          <textarea
            className="bg-bgd p-2.5 w-full h-full text-bgl border-b-2 border-bgl resize-none max-h-64 overflow-y-scroll"
            value={input}
            onChange={(e) => onChange(e.target.value, index)}
            placeholder="Type here"
            style={{
              maxHeight: '160px',    // Maximum height for the textarea
              width: '100%',         // Fixed width
              whiteSpace: 'pre-wrap', // Ensures that text wraps when it reaches the end of the line
              wordWrap: 'break-word', // Breaks words if they are too long to fit on one line
            }}
          />
        </div>
      );
}

export default ManualCards;