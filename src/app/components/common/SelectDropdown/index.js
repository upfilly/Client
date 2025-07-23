import React from "react";
import Html from "./html";

const SelectDropdown = ({
  intialValue,
  options,
  result,
  displayValue = "name",
  id,
  placeholder = "Select Status",
  disabled,
  name,
  required = false,
  noDefault = false,
  className = "",
  theme = "normal",
}) => {
  const handleChange = (e) => {
    result({ event: "value", value: e });
  };

  return (
    <>
      <Html
        theme={theme}
        id={id}
        name={name}
        className={className}
        noDefault={noDefault}
        required={required}
        disabled={disabled}
        placeholder={placeholder}
        displayValue={displayValue}
        options={options} 
        selectedValues={intialValue}
        handleChange={handleChange}
      />
    </>
  );
};

export default SelectDropdown;
