import React, { useState } from 'react';
import "./style.scss";

const MultiSelectCheckboxes = ({ options, initialValue, onChange }) => {
  const [selectedOptions, setSelectedOptions] = useState(initialValue || []);

  const handleCheckboxChange = (option) => {
    setSelectedOptions((prev) => {
      if (prev.includes(option)) {
        return prev.filter((item) => item !== option);
      } else {
        return [...prev, option];
      }
    });
    onChange(selectedOptions);
  };

  return (
    <div>
      <div className="checkboxes">
        {options.map((option) => (
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
    </div>
  );
};

export default MultiSelectCheckboxes;
