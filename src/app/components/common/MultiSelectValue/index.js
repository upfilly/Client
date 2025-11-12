import React, { useEffect, useState, useCallback, useMemo } from "react";
import Html from "./html";
import methodModel from "@/methods/methods";

const MultiSelectValue = ({
  intialValue,
  options,
  isSingle = false,
  result,
  displayValue = "name",
  id,
  name,
  singleSelect,
  placeholder,
  disabled,
}) => {
  const [selectedValues, setSelectedValues] = useState([]);

  // Filter out selected values from available options
  const filteredOptions = useMemo(() => {
    if (isSingle) {
      return options || [];
    }
    
    // For multi-select, remove already selected values from options
    const selectedIds = selectedValues.map(item => item.id);
    return (options || []).filter(option => !selectedIds.includes(option.id));
  }, [options, selectedValues, isSingle]);

  const handleChange = useCallback((selectedOptions, actionType) => {
    setSelectedValues(selectedOptions || []);
    
    if (isSingle) {
      // For single select
      const value = selectedOptions.length > 0 ? selectedOptions[0].id : "";
      result({ event: "value", value: value });
    } else {
      // For multi-select
      const value = selectedOptions.map((item) => item.id);
      result({ event: "value", value: value });
    }
  }, [isSingle, result]);

  useEffect(() => {
    if (isSingle) {
      // Handle single select initialization
      if (intialValue && options?.length) {
        const existingOption = methodModel.find(options, intialValue, "id");
        if (existingOption) {
          setSelectedValues([existingOption]);
        } else {
          // Create a fallback option if value doesn't exist in options
          setSelectedValues([{
            id: intialValue,
            [displayValue]: intialValue,
          }]);
        }
      } else {
        setSelectedValues([]);
      }
    } else {
      // Handle multi-select initialization
      let value = [];
      if (intialValue?.length && options?.length) {
        value = intialValue.map((item) => {
          const existingOption = methodModel.find(options, item, "id");
          if (existingOption) {
            return existingOption;
          } else {
            // Create fallback options for values that don't exist
            return {
              id: item,
              [displayValue]: "Not Exist",
            };
          }
        });
      }
      setSelectedValues(value);
    }
  }, [intialValue, options, isSingle, displayValue]);

  return (
    <Html
      id={id}
      displayValue={displayValue}
      placeholder={placeholder}
      options={filteredOptions}
      selectedValues={selectedValues}
      handleChange={handleChange}
      name={name}
      singleSelect={singleSelect || isSingle}
      disabled={disabled}
    />
  );
};

export default MultiSelectValue;