import React, { useEffect, useState } from "react";
// import methodModel from "../../../methods/methods";
import Html from "./html";
import methodModel from "@/methods/methods";

const MultiSelectDropdown = ({intialValue,options,isSingle=false,result,displayValue='name',id,placeholder}) => {

    const [selectedValues,setSelectedValues]=useState([])

    const handleChange=(e,type)=>{
        let value=[]
       
        if(isSingle){
            let length = e.length
            if(length){
                value=e[length-1].id
            }else{
                value=''
            }
        }else{
            value=e.map(itm=>{
                return itm.id
            })
        }
        result({event:"value",value:value})
    }

    useEffect(()=>{
        if(isSingle){
            if(intialValue?.length){
                let ext=methodModel.find(options,intialValue,'id')
                if(ext){
                    setSelectedValues([ext])
                }else{
                    setSelectedValues([{
                        id:intialValue,
                        [displayValue]:intialValue
                       }])
                }
            }else{
                setSelectedValues([])
            }
           
        }else{
            let value=[]
            if(intialValue?.length && options?.length){
                value=intialValue?.map(itm=>{
                    return {
                        ...methodModel.find(options,itm,'id'),
                        id:methodModel.find(options,itm,'id')?.id || '',
                        [displayValue]:methodModel.find(options,itm,'id')?.[displayValue] || 'Not Exist'
                    }
                })
            }
            setSelectedValues(value)
        }
    },[intialValue,options])

    return <>
        <Html
        id={id}
        displayValue={displayValue}
        options={options}
        selectedValues={selectedValues}
        handleChange={handleChange}
        placeholder={placeholder}
        />
    </>
}

export default MultiSelectDropdown