import React from "react";
import methodModel from "@/methods/methods";

const Html = ({ inputElement, uploadImage, img, remove, loader, model, multiple, required ,err}) => {
    return <>
        <label className={`btn btn-primary ${img && !multiple ? 'd-none' : ''}`}>
            <input type="file" className="d-none" ref={inputElement} accept="image/*" multiple={multiple ? true : false} disabled={loader} onChange={(e) => { uploadImage(e); }} />
            Upload Image
        </label>

        {loader ? <div className="text-success">Uploading... <i className="fa fa-spinner fa-spin"></i></div> : <></>}

        {multiple ? <>
            <div className="imagesRow">
                {img && img.map((itm, i) => {
                    return <div className="imagethumbWrapper" key={i}>
                        <img src={methodModel.noImg(itm, model)} className="thumbnail" />
                        <i className="fa fa-times" title="Remove" onClick={e => remove(i)}></i>
                    </div>
                })}
            </div>
        </> : <>
            {img ? <div className="imagethumbWrapper">
                <img src={methodModel.noImg(img, model)} className="thumbnail" />
                <i className="fa fa-times" title="Remove" onClick={e => remove()}></i>
            </div> : <></>}
        </>}

        {required && !img ? <div className="text-danger">{err ? err : 'Image is Required'}</div> : <></>}
    </>
}
export default Html