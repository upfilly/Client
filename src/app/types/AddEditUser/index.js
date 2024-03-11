import React, { useState, useEffect } from "react";
import ApiClient from "../../../methods/api/apiClient";
import loader from "../../../methods/loader";
import methodModel from "../../../methods/methods";
import { typeType, userType } from "../../../models/type.model";
import Html from "./Html";
import { toast } from "react-toastify";
import { useRouter,useParams } from "next/navigation";

const AddEditUser = () => {
    const { role, id } = useParams()
    const [images, setImages] = useState({ image: ''});
    const defaultvalue = typeType
    const [form, setform] = useState({})
    const [eyes, setEyes] = useState({ password: false, confirmPassword: false });
    const [submitted, setSubmitted] = useState(false)
    const history = useRouter()
    const [detail, setDetail] = useState() 
    const formValidation = [
        { key: 'name', required:true },
    ]

    const getError = (key) => {
        return methodModel.getError(key, form, formValidation)
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        setSubmitted(true)
        let invalid = methodModel.getFormError(formValidation, form)
        if (invalid) return
        let method = 'post'
        let url = 'common-category'
        let value = {
            ...form,
            type:'niches'
            // ...images
        }
        if (value.id) {
            method = 'put'
            url = 'common-category'
        } else {
            delete value.id
        }

        loader(true)
        ApiClient.allApi(url, value, method).then(res => {
            if (res.success) {
                toast.success(res.message)
                let url='/types'
                history.push(url)
            }
            loader(false)
        })
    }

    const imageResult = (e, key) => {
        images[key] = e.value
        setImages(images)
    }

    const addressResult = (e) => {
        setform({ ...form, address: e.value })
    }

    const back=()=>{
        history.back()
    }


    useEffect(() => {
        setSubmitted(false)
       
        if (id) {
            loader(true)
            ApiClient.get("common-category", { id }).then(res => {
                if (res.success) {
                    let value=res.data
                    setDetail(value)
                    let payload = defaultvalue
                    let oarr = Object.keys(defaultvalue)
                    oarr.map(itm => {
                        payload[itm] = value[itm] || ''
                    })
                    setform({ ...payload })
                    images.image = payload?.image
                    setImages(images)
                }
                loader(false)
            })
        }
    }, [id])

    return <>
        <Html
            form={form}
            detail={detail}
            back={back}
            setEyes={setEyes}
            eyes={eyes}
            role={role}
            setform={setform}
            submitted={submitted}
            images={images}
            addressResult={addressResult}
            handleSubmit={handleSubmit}
            imageResult={imageResult}
            getError={getError}
        />
    </>
}

export default AddEditUser