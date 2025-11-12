import React, { useMemo } from "react";
import Select from "react-select";
import "./style.scss";

const Html = ({
  options = [],
  selectedValues = [],
  handleChange,
  displayValue,
  id,
  isClearable,
  name,
  singleSelect,
  placeholder,
  showSelectAll = true,
  showReset = true,
  disabled,
}) => {

  const enhancedOptions = useMemo(() => {
    if (!singleSelect) {
      return options.map((o) => ({ ...o, label: o[displayValue], value: o }));
    }

    const actionOptions = [];

    if (showSelectAll && selectedValues.length < options.length) {
      actionOptions.push({
        label: "🔲 Select All",
        value: "__select_all__",
        isSelectAll: true,
        isActionItem: true,
      });
    }

    if (showReset && selectedValues.length > 0) {
      actionOptions.push({
        label: "❌ Reset",
        value: "__reset__",
        isReset: true,
        isActionItem: true,
      });
    }

    const regularOptions = options.map((option) => ({
      ...option,
      label: option[displayValue],
      value: option,
    }));

    return [...actionOptions, ...regularOptions];
  }, [
    options,
    displayValue,
    singleSelect,
    showSelectAll,
    showReset,
    selectedValues,
  ]);

  const onChange = (selected, actionMeta) => {
    if (!handleChange) return;

    if (singleSelect) {
      handleChange(selected ? [selected.value] : [], actionMeta.action);
      return;
    }

    // Handle action items first
    if (actionMeta.option?.isSelectAll) {
      handleChange([...options], "select-all");
      return;
    }

    if (actionMeta.option?.isReset) {
      handleChange([], "reset");
      return;
    }

    // For regular multi-select changes
    if (Array.isArray(selected)) {
      // Filter out action items and get only the actual option values
      const filteredSelected = selected
        .filter(item => !item?.isActionItem)
        .map(item => item.value);

      handleChange(filteredSelected, actionMeta.action);
    } else {
      handleChange([], actionMeta.action);
    }
  };

  const customStyles = {
    control: (base, state) => ({
      ...base,
      minHeight: "40px",
      borderColor: state.isFocused ? "#2684FF" : "#ccc",
      boxShadow: state.isFocused ? "0 0 0 1px #2684FF" : "none",
      "&:hover": {
        borderColor: state.isFocused ? "#2684FF" : "#999",
      },
    }),
    option: (base, { isFocused, isSelected, data }) => ({
      ...base,
      backgroundColor: data?.isActionItem
        ? "#f8f8f8"
        : isSelected
          ? "#0066cc"
          : isFocused
            ? "#f0f7ff"
            : "white",
      color: data?.isActionItem ? "#333" : isSelected ? "white" : "#333",
      fontWeight: data?.isActionItem ? "bold" : "normal",
      cursor: isSelected ? "not-allowed" : "pointer",
      opacity: isSelected ? 0.6 : 1,
    }),
    multiValue: (base) => ({
      ...base,
      backgroundColor: "#e6f3ff",
    }),
    multiValueLabel: (base) => ({
      ...base,
      color: "#0066cc",
    }),
    multiValueRemove: (base) => ({
      ...base,
      ":hover": {
        backgroundColor: "transparent",
        color: "#003366",
      },
    }),
  };

  return (
    <div className="select-container">
      <Select
        options={enhancedOptions}
        isMulti={!singleSelect}
        value={
          singleSelect
            ? selectedValues[0]
              ? {
                label: selectedValues[0][displayValue],
                value: selectedValues[0],
              }
              : null
            : selectedValues.map((item) => ({
              label: item[displayValue],
              value: item,
            }))
        }
        onChange={onChange}
        styles={customStyles}
        instanceId={id}
        name={name}
        isDisabled={disabled}
        placeholder={placeholder}
        closeMenuOnSelect={singleSelect}
        hideSelectedOptions={false}
        classNamePrefix="react-select"
        isClearable={isClearable}
        filterOption={(option, searchText) => {
          if (option.data.isActionItem) return true;
          return option?.label?.toLowerCase()?.includes(searchText.toLowerCase());
        }}
      />
    </div>
  );
};

export default Html;