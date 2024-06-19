"use client"

import React, { useState, useEffect } from "react";
import ApiClient from '@/methods/api/apiClient';
import methodModel from '@/methods/methods';
import Html from "./Html";
import { toast } from "react-toastify";
import { useParams, useRouter } from "next/navigation";
import loader from '@/methods/loader';
import { affilliateGrouptype } from "@/models/type.model";

const AddEditUser = () => {
    const {id} = useParams();
    const [images, setImages] = useState({ image: '' });
    const defaultvalue = affilliateGrouptype
    const [form, setform] = useState({group_name: "",
    // commision:"",
    // isDefaultAffiliateGroup:false,
    isArchive:false,isPreRegisterLeads:false})
    const [eyes, setEyes] = useState({ password: false, confirmPassword: false });
    const [submitted, setSubmitted] = useState(false)
    const history = useRouter()
    const [detail, setDetail] = useState()
    const formValidation = [
        { key: 'group_name', required: true },
        // { key: 'commision', required: true },
    ]

    const handleSubmit = (e) => {
        e.preventDefault()
        setSubmitted(true)
        // let invalid = methodModel.getFormError(formValidation, form)
        // if (form?.group_name) return
        let method = 'post'
        let url = 'affiliate-group'
        let value = {
            ...form,
        }
        if (value.id) {
            method = 'put'
            url = 'affiliate-group'
            // delete value?.cat_type
        } else {
            delete value.id
        }

        loader(true)
        ApiClient.allApi(url, value, method).then(res => {
            if (res.success) {
                toast.success(res.message)
                let url = '/group'
                history.push(url)
            }
            loader(false)
        })
    }

    const imageResult = (e, key) => {
        images[key] = e.value
        setImages(images)
        // console.log("imageResult", e)
    }

    const addressResult = (e) => {
        setform({ ...form, address: e.value })
    }

    const back = () => {
        history.back()
    }


    useEffect(() => {
        setSubmitted(false)

        if (id) {
            loader(true)
            ApiClient.get("affiliate-group", { id }).then(res => {
                if (res.success) {
                    let value = res.data
                    setDetail(value)
                    let payload = defaultvalue
                    let oarr = Object.keys(defaultvalue)
                    oarr.map(itm => {
                        payload[itm] = value[itm]
                    })
                    setform({ ...payload })
                    // images.image = payload?.image
                    // setImages(images)
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
             setform={setform}
             submitted={submitted}
             images={images}
             addressResult={addressResult}
             handleSubmit={handleSubmit}
             imageResult={imageResult}
        />
    </>
}

export default AddEditUser

