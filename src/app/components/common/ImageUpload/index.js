import React, { useEffect, useRef, useState } from "react";
import Html from "./html";
import ApiClient from "@/methods/api/apiClient";
// import './style.scss';

const ImageUpload = ({ model, result, value, multiple ,required,err}) => {
    const inputElement = useRef();
    const [img, setImg] = useState('')
    const [loader, setLoader] = useState(false)
    const uploadImage = async (e) => {
        let files = e.target.files
        let i = 0
        let imgfile = []
        for (let item of files) {
            imgfile.push(item)
        }

        let images = []
        if (img) images = img
        setLoader(true)
        for await (let item of imgfile) {
            let file = files.item(i)
            // console.log("i", i)
            // console.log("file", file)
            const res = await ApiClient.postFormData('upload/image?modelName=' + model, { file: file })
            if (res.success) {
                let image = res.data.fullpath
                if (!multiple) {
                    setImg(image)
                    result({ event: 'value', value: `images/${model}/${image}` })
                } else {
                    images.push(`images/${model}/${image}`)
                }
            }
            i++
        }
        setLoader(false)
        if(multiple){
            setImg(images) 
            result({ event: 'value', value: images })
        }
    }

    const remove = (index) => {
        setImg('')
        inputElement.current.value = ''
        result({ event: 'remove', value: '' })
    }

    useEffect(() => {
        setImg(value)
    }, [value])

    return <><Html
        multiple={multiple}
        inputElement={inputElement}
        uploadImage={uploadImage}
        img={img}
        model={model}
        required={required}
        loader={loader}
        err={err}
        remove={remove}
    /></>
}
export default ImageUpload