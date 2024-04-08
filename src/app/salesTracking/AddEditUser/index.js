import React, { useState, useEffect } from "react";
import ApiClient from "../../../methods/api/apiClient";
import loader from "../../../methods/loader";
import methodModel from "../../../methods/methods";
import { campaignType } from "../../../models/type.model";
import Html from "./Html";
import { toast } from "react-toastify";
import { useRouter,useParams } from "next/navigation";
import crendentialModel from "@/models/credential.model";

const AddEditUser = () => {
    const { role, id } = useParams()
    const user = crendentialModel.getUser()
    const [images, setImages] = useState({ image: ''});
    const defaultvalue = campaignType
    const [form, setform] = useState({
        id:"",
        title:"",
        description:"",
        image:""
    })
    const [affiliateData, setAffiliateData] = useState();
    const [eyes, setEyes] = useState({ password: false, confirmPassword: false });
    const [submitted, setSubmitted] = useState(false)
    const history = useRouter()
    const [emailLoader, setEmailLoader] = useState(false) 
    const [BrandData, setBrandData] = useState('') 
    const [detail, setDetail] = useState()
    
    
    const getBrandData = (p = {}) => {

        let filter = { status: 'accepted' }
        let url = 'make-offers'
        ApiClient.get(url, filter).then(res => {
            if (res.success) {
                console.log(res?.data?.data, "dgfygduyfg")
                setBrandData(res?.data?.data)
            }
        })
    }

    const getError = (key) => {
        return methodModel.getError(key, form, formValidation)
    }

    const handleSubmit = (e) => {
        e.preventDefault()
       
        if(!form?.affiliate_id || !form?.description || !form?.name || !form?.amount || !form?.event_type){
            setSubmitted(true)
            return;
        }

        let method = 'post'
        let url = 'campaign'
       
        let value = {
            ...form,
        }
        delete value.status
        if (value.id) {
            method = 'put'
            url = 'campaign'
            delete value.role
            delete value.improvements
            delete value.status
            delete value.amount
            delete value.event_type
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
                    let payload = { ...defaultvalue };
                let oarr = Object.keys(defaultvalue);

                oarr.forEach((itm) => {
                    if (itm === 'affiliate_id' && value[itm] && value[itm].id) {
                        payload[itm] = value[itm].id.toString();
                    } else {
                        payload[itm] = value[itm] || "";
                    }
                });
                    setform({ ...payload })
                }
                loader(false)
            })
        }
    }, [id])

    const getData = () => {
        let url = 'users/list'
        ApiClient.get(url, {role:"affiliate", createBybrand_id: user?.id,}).then(res => {
            if (res.success) {
                const data1 = res.data.data.filter(item => item.status === "active");
                setAffiliateData(data1)
            }
        })
    }

    useEffect(()=>{
        getData()
        getBrandData()
    },[])

    return <>
        <Html
            id={id}
            form={form}
            detail={detail}
            emailCheck={emailCheck}
            emailLoader={emailLoader}
            // emailErr={emailErr}
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
            affiliateData={affiliateData}
            BrandData={BrandData}
        />
    </>
}

export default AddEditUser