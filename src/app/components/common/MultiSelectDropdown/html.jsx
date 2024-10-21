import React from "react";
import './style.scss';
import Multiselect from 'multiselect-react-dropdown';

const Html = ({ options,selectedValues,handleChange,displayValue,id,setSelectedValues}) => {

    // const handleRemove = (valueToRemove) => {
    //     const updatedValues = selectedValues.filter(value => value.id !== valueToRemove.id);
    //     setSelectedValues(updatedValues);
    // };

    return <>
        <div className="selectDropdown">
        <Multiselect
                options={options}
                singleSelect={false}
                selectedValues={selectedValues}
                onSelect={e => handleChange(e, 'select')}
                onRemove={e => handleChange(e, 'remove')}
                displayValue={displayValue}
                id={id}
                // hideSelectedList
                showArrow
            />
            {/* {selectedValues?.length > 0 && <div>
                Selected Values: {selectedValues.map(value => (
                    <span key={value.id}>
                        {value.name} <button onClick={() => handleRemove(value)}>X</button>
                    </span>
                ))}
            </div>} */}
        </div>
    </>
}

export default Html