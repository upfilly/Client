import React, { useState } from 'react';
import "./style.scss";

const MultiSelectCheckboxes = ({ options, initialValue, onChange }) => {
  const [selectedOptions, setSelectedOptions] = useState(initialValue || []);
  const [showAll, setShowAll] = useState(false); // Track if all options are shown

  const handleCheckboxChange = (option) => {
    setSelectedOptions((prev) => {
      const updatedOptions = prev.includes(option)
        ? prev.filter((item) => item !== option)
        : [...prev, option];

      // Call onChange with updated options after state is set
      onChange(updatedOptions);

      return updatedOptions;
    });
  };

  const handleToggleShow = () => {
    setShowAll((prev) => !prev); // Toggle the visibility of more options
  };

  // Limit the number of options shown to 4 initially
  const optionsToShow = showAll ? options : options.slice(0, 4);

  return (
    <div>
      <div className="checkboxes">
        {optionsToShow.map((option) => (
          <div key={option.id} className="checkbox-item">
            <label>
              <input
                type="checkbox"
                checked={selectedOptions.includes(option.id)}
                onChange={() => handleCheckboxChange(option.id)}
              />
              {option.name}
            </label>
          </div>
        ))}
      </div>

      {/* Toggle button for showing more or less options */}
      <button onClick={handleToggleShow} className="toggle-button">
        {showAll ? 'Show Less' : 'Show More'}
      </button>
    </div>
  );
};

export default MultiSelectCheckboxes;
