import { useEffect, useState } from "react";
import Html from "./html";

const MultiSelectValue = ({
  initialValue,
  options,
  result,
  displayValue = "name",
  id,
  name,
  isClearable,
  placeholder,
  disabled,
}) => {
  const [selectedValue, setSelectedValue] = useState(null);

  const handleChange = (selectedOption) => {
    const selected =
      selectedOption.length > 0
        ? selectedOption[selectedOption.length - 1]
        : null;

    setSelectedValue(selected);
    result(selected);
  };

  return (
    <Html
      id={id}
      displayValue={displayValue}
      placeholder={placeholder}
      options={options}
      selectedValues={selectedValue ? [selectedValue] : []}
      handleChange={handleChange}
      name={name}
      singleSelect={true}
      isClearable={isClearable}
      disabled={disabled}
      hideSelectAll={true}
    />
  );
};

export default MultiSelectValue;
