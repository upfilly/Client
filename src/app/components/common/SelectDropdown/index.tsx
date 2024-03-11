import React, { useState } from "react";
import Html from "./html";

const SelectDropdown = ({intialValue,options,isSingle,result,displayValue='name',id,placeholder="Select Status",disabled=false,name,required=false}:any) => {
    const [toggle,setToggle]=useState(false)

   
    const handleChange=(e:any)=>{
        result({event:"value",value:e})
        setToggle(false)
    }

    return <>
        <Html
        toggle={toggle}
        setToggle={setToggle}
        id={id}
        name={name}
        required={required}
        disabled={disabled}
        placeholder={placeholder}
        displayValue={displayValue}
        options={options}
        selectedValues={intialValue}
        handleChange={handleChange}
        />
    </>
}

export default SelectDropdown