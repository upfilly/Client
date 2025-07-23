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

  useEffect(() => {
    if (initialValue) {
      if (typeof initialValue === "object" && initialValue.id) {
        const found = options.find((opt) => opt.id === initialValue.id);
        setSelectedValue(found || null);
      } else if (initialValue) {
        const found = options.find((opt) => opt.id === initialValue);
        setSelectedValue(found || null);
      }
    } else {
      setSelectedValue(null);
    }
  }, [initialValue, options]);

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
