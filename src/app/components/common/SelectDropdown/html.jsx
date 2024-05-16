import React, { useState, useEffect, useRef } from "react";
import methodModel from "@/methods/methods";
import './style.scss';

const Html = ({ setToggle, toggle, options, selectedValues, handleChange, displayValue, id, placeholder, required, disabled, name }) => {
    const dropdownRef = useRef(null);

    useEffect(() => {
        const handleOutsideClick = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setToggle(false);
            }
        };

        document.addEventListener("mousedown", handleOutsideClick);

        return () => {
            document.removeEventListener("mousedown", handleOutsideClick);
        };
    }, [setToggle]);

    return (
        <>
            <input type="hidden" name={name} required={required} value={selectedValues} />
            <div className="selectDropdown" ref={dropdownRef}>
                <div className="dropdown addDropdown">
                    <button
                        disabled={disabled}
                        onClick={() => setToggle(!toggle)}
                        className="btn btn-primary dropdown-toggle removeBg"
                        type="button"
                        id={"dropdownMenuButton" + id || _id}
                        data-toggle="dropdown"
                        aria-haspopup="true"
                        aria-expanded="false"
                    >
                        {selectedValues ? methodModel.find(options, selectedValues, 'id' || '_id')?.[displayValue] || placeholder : placeholder}
                    </button>
                    <div className={`dropdown-menu shadow bg_hover ${toggle ? 'show active' : ''}`} aria-labelledby={"dropdownMenuButton" + id || _id}>
                        <a className={selectedValues === '' ? 'dropdown-item active' : 'dropdown-item'} onClick={() => handleChange('')}>{placeholder}</a>
                        {options && options.map((itm) => (
                            <a
                                className={selectedValues === itm.id || itm._id? 'dropdown-item active' : 'dropdown-item'}
                                onClick={() => handleChange(itm.id || itm._id )}
                                key={itm.id || itm._id}
                            >
                                {itm[displayValue]}
                            </a>
                        ))}
                    </div>
                </div>
            </div>
        </>
    );
};

export default Html;