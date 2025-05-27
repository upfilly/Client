import React, { useMemo } from "react";
import './style.scss';
import Multiselect from 'multiselect-react-dropdown';

const Html = ({ 
    options, 
    selectedValues, 
    handleChange, 
    displayValue, 
    id, 
    name, 
    singleSelect, 
    placeholder,
    showSelectAll = true,
    showReset = true
}) => {
    
    // Create enhanced options with Select All and Reset
    const enhancedOptions = useMemo(() => {
        if (singleSelect) {
            return options; // No Select All/Reset for single select
        }
        
        const actionOptions = [];
        
        if (showSelectAll && selectedValues?.length < options?.length) {
            actionOptions.push({
                [displayValue]: "🔲 Select All",
                isSelectAll: true,
                isActionItem: true,
                id: 'select-all-action' // Unique identifier
            });
        }
        
        if (showReset && selectedValues?.length > 0) {
            actionOptions.push({
                [displayValue]: "❌ Reset",
                isReset: true,
                isActionItem: true,
                id: 'reset-action' // Unique identifier
            });
        }
        
        return [...actionOptions, ...options];
    }, [options, displayValue, singleSelect, showSelectAll, showReset, selectedValues]);
    
    const handleSelect = (selectedList, selectedItem) => {
        if (selectedItem.isSelectAll) {
            // Select all actual options (exclude action items)
            const allRealOptions = options.filter(option => !option.isActionItem);
            handleChange([...selectedValues, ...allRealOptions.filter(opt => 
                !selectedValues.some(selected => selected[displayValue] === opt[displayValue])
            )], 'selectAll');
            return;
        }
        
        if (selectedItem.isReset) {
            // Reset selection - clear everything
            handleChange([], 'reset');
            return;
        }
        
        // Normal selection - filter out action items and ensure we don't duplicate
        const filteredList = selectedList.filter(item => !item.isActionItem);
        handleChange(filteredList, 'select');
    };
    
    const handleRemove = (selectedList, removedItem) => {
        // Filter out action items from the list
        const filteredList = selectedList.filter(item => !item.isActionItem);
        handleChange(filteredList, 'remove');
    };
    
    // Filter selectedValues to exclude action items (they shouldn't stay selected)
    const filteredSelectedValues = selectedValues?.filter(item => !item.isActionItem) || [];
    
    return (
        <>
            <div className="selectDropdown">
                <Multiselect
                    options={enhancedOptions}
                    singleSelect={singleSelect || false}
                    placeholder={placeholder}
                    selectedValues={filteredSelectedValues}
                    onSelect={handleSelect}
                    onRemove={handleRemove}
                    displayValue={displayValue}
                    id={id}
                    showArrow
                    name={name}
                    optionObjectClassName={(option) => 
                        option.isActionItem ? 'action-option' : ''
                    }
                />
            </div>
        </>
    );
};

export default Html;