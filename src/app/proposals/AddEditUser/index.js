import React, { useState, useEffect } from "react";
import ApiClient from "../../../methods/api/apiClient";
import loader from "../../../methods/loader";
import methodModel from "../../../methods/methods";
import { campaignType } from "../../../models/type.model";
import Html from "./Html";
import { toast } from "react-toastify";
import { useRouter,useParams } from "next/navigation";

const AddEditUser = () => {
    const { role, id } = useParams()
    const [images, setImages] = useState({ image: ''});
    const defaultvalue = campaignType
    const [form, setform] = useState({
        id:"",
        name: "",
        description: "",
        images: [],
        documents: [],
        videos: [],
        improvements: []
    })
    const [eyes, setEyes] = useState({ password: false, confirmPassword: false });
    const [submitted, setSubmitted] = useState(false)
    const history = useRouter()
    const [emailLoader, setEmailLoader] = useState(false) 
    const [emailErr, setEmailErr] = useState('') 
    const [detail, setDetail] = useState() 

    const getError = (key) => {
        return methodModel.getError(key, form, formValidation)
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        setSubmitted(true)
        // let invalid = methodModel.getFormError(formValidation, form)
        // if (invalid || emailErr) return
        let method = 'post'
        let url = 'campaign'
        let value = {
            ...form,
        }
        if (value.id) {
            method = 'put'
            url = 'campaign'
            delete value.role
        } else {
            delete value.id
        }

        delete value.confirmPassword
        loader(true)
        ApiClient.allApi(url, value, method).then(res => {
            if (res.success) {
                toast.success(res.message)
                let url='/campaign'
                if(role) url="/campaign/"+role
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


    const emailCheck=(email)=>{
        let isValid=methodModel.emailvalidation(email)
        if(isValid){
            // setEmailLoader(true)
            // ApiClient.get('api/check/email',{email:email}).then(res=>{
            //     if(!res.success){
            //         if(detail?.email!=email){
            //             setEmailErr(res.error.message)
            //         }
            //     }else{
            //         setEmailErr('')
            //     }
            //     setEmailLoader(false)
            // })
        }
    }

    useEffect(() => {
        setSubmitted(false)
       
        if (id) {
            loader(true)
            ApiClient.get("campaign", { id }).then(res => {
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
                    images.logo = payload?.logo
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
            emailCheck={emailCheck}
            emailLoader={emailLoader}
            emailErr={emailErr}
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