import React from "react";
import './style.scss';
import Select from "react-select";
import methodModel from "@/methods/methods";

const Html = ({ options, selectedValues, handleChange, displayValue, id, placeholder, required, disabled, name, noDefault, className, theme = 'normal' }) => {

    const categoryVal = () => {
        let ext = options && options.find(item => item.id == selectedValues)
        return ext ? { value: ext.id, label: ext[displayValue] } : ''
    }

    return <>
        {theme == 'search' ? <>

            <Select
                options={options?.map(itm => { return { value: itm.id, label: itm[displayValue] } }) || []}
                placeholder={placeholder}
                value={categoryVal()}
                isClearable={true}
                name={name}
                onChange={e => handleChange(e?.value || '')}
            />
        </> : <>
            <div className="selectDropdown">
                <input type="hidden" name={name} required={required} value={selectedValues} />
                <div className="dropdown addDropdown">
                    <button disabled={disabled} className={`btn btn-primary dropdown-toggle removeBg ${className}`} type="button" id={"dropdownMenuButton" + id} data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                        {selectedValues ? methodModel.find(options, selectedValues, 'id')?.[displayValue] || placeholder : placeholder}
                    </button>
                    <div className="dropdown-menu shadow bg_hover" aria-labelledby={"dropdownMenuButton" + id}>
                        {noDefault ? <a className={selectedValues == '' ? 'dropdown-item active disabled' : 'dropdown-item disabled'} disabled>{placeholder}</a> : <a className={selectedValues == '' ? 'dropdown-item active' : 'dropdown-item'} onClick={() => handleChange('')}>{placeholder}</a>}
                        {options && options.map(itm => {
                            return <a className={selectedValues == itm.id ? 'dropdown-item active' : 'dropdown-item'} onClick={() => handleChange(itm.id)} key={itm.id}>{itm[displayValue]}</a>
                        })}
                    </div>
                </div>
            </div>
        </>}

    </>
}

export default Html