import React from "react";
import './style.scss';
import Multiselect from 'multiselect-react-dropdown';

const Html = ({ options,selectedValues,handleChange,displayValue,id,name}) => {
    return <>
        <div className="selectDropdown">
            <Multiselect
                options={options}
                singleSelect={false}
                selectedValues={selectedValues}
                onSelect={e => handleChange(e,'select')}
                onRemove={e => handleChange(e,'remove')}
                displayValue={displayValue}
                id={id}
                showArrow
                name={name}
            />
        </div>
    </>
}

export default Html