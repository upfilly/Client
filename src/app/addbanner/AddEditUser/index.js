import React, { useState, useEffect } from "react";
import ApiClient from "../../../methods/api/apiClient";
import loader from "../../../methods/loader";
import methodModel from "../../../methods/methods";
import Html from "./Html";
import { toast } from "react-toastify";
import { useRouter,useParams } from "next/navigation";
import crendentialModel from "@/models/credential.model";

const AddEditUser = () => {
    const { role, id } = useParams()
    const user = crendentialModel.getUser()
    const [images, setImages] = useState('');
    const [form, setform] = useState({
        "title": "",
        "destination_url": "",
        "description": "",
        "seo_attributes": "",
        "activation_date": "",
        "availability_date": "",
        "expiration_date": "",
        "image":"",
        "is_animation": false,
        "is_deep_linking": false,
        "mobile_creative": false
    })
    const [affiliateData, setAffiliateData] = useState();
    const [eyes, setEyes] = useState({ password: false, confirmPassword: false });
    const [submitted, setSubmitted] = useState(false)
    const history = useRouter()
    const [emailLoader, setEmailLoader] = useState(false) 
    const [BrandData, setBrandData] = useState('') 
    const [detail, setDetail] = useState()
    const [category, setCategory] = useState([])

    const getCategory = (p = {}) => {
        let url = 'main-category/all'
        ApiClient.get(url).then(res => {
          if (res.success) {
            const data = res.data.data
            setCategory(data)
          }
        })
      }
    
    const getBrandData = (p = {}) => {
        let filter = { status: 'accepted' }
        let url = 'make-offers'
        ApiClient.get(url, filter).then(res => {
            if (res.success) {
                const uniqueBrands = new Set();
                const filteredData = res?.data?.data.reduce((acc, item) => {
                    if (!uniqueBrands.has(item.brand_id)) {
                        uniqueBrands.add(item.brand_id);
                        acc.push({
                            id: item.brand_id,
                            brand_name: item.brand_name
                        });
                    }
                    return acc;
                }, []);
                setBrandData(filteredData);
            }
        });
    }    

    const getError = (key) => {
        return methodModel.getError(key, form, formValidation)
    }

    const handleSubmit = (e) => {
        e.preventDefault()

        // if(!form?.title || !form?.brand_id || !form?.amount || !form?.commission || !form?.customer_reference
        //     || !form?.order_date || !form?.type || !form?.title){
        //        setSubmitted(true)
        //        return;
        //    }
       
        let method = 'post'
        let url = 'banner'
       
        let value = {
            ...form,
            image:images
        }

        if(!value?.image){
            delete value?.image
        }

        delete value.status
        if (value.id) {
            method = 'put'
            url = 'banner'
        } else {
            delete value.id
        }

        delete value.confirmPassword
        loader(true)
        ApiClient.allApi(url, value, method).then(res => {
            if (res.success) {
                toast.success(res.message)
                let url='/addbanner'
                if(role) url="/addbanner/"+role
                history.push(url)
            }
            loader(false)
        })
    }

    const imageResult = (e) => {
        setImages(e?.value)
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
            ApiClient.get("banner", { id }).then(res => {
                if (res.success) {
                    let value=res.data
                    setDetail(value)
                    console.log(value,"vvvvvvvvvqqqqq")
                    setform({
                        id:value?.id || value?._id,
                        "title": value?.title,
                        "destination_url": value?.destination_url,
                        "description": value?.description,
                        "seo_attributes": value?.seo_attributes,
                        "category_id": value?.category_id?.id,
                        "activation_date": value?.activation_date,
                        "availability_date": value?.availability_date,
                        "expiration_date": value?.expiration_date,
                        "image": value?.image,
                        "is_animation": value?.is_animation,
                        "is_deep_linking": value?.is_deep_linking,
                        "mobile_creative": value?.mobile_creative
                    })
                    setImages(value?.image)
                //     let payload = { ...defaultvalue };
                // let oarr = Object.keys(defaultvalue);

                // oarr.forEach((itm) => {
                //     if (itm === 'affiliate_id' && value[itm] && value[itm].id) {
                //         payload[itm] = value[itm].id.toString();
                //     } else {
                //         payload[itm] = value[itm] || "";
                //     }
                // });
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
        getCategory()
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
            category={category}
        />
    </>
}

export default AddEditUser