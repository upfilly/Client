import React, { useState, useEffect } from "react";
import ApiClient from "../../../methods/api/apiClient";
import loader from "../../../methods/loader";
import methodModel from "../../../methods/methods";
import Html from "./Html";
import { toast } from "react-toastify";
import { useRouter, useParams } from "next/navigation";
import crendentialModel from "@/models/credential.model";

const AddEditUser = () => {
    const { role, id } = useParams()
    const history = useRouter()
    const user = crendentialModel.getUser()
    const [images, setImages] = useState('');
    const [form, setform] = useState({
        "id":"",
        "media": "",
        "couponCode": "",
        "couponType": "",
        "startDate": "",
        "expirationDate": "",
        "commissionType": "",
        "applicable": [],
        "visibility": "",
        "url": "",
        "couponCommission": "",
        "status":"Enabled"
    })
    const [affiliateData, setAffiliateData] = useState();
    const [eyes, setEyes] = useState({ password: false, confirmPassword: false });
    const [submitted, setSubmitted] = useState(false)
    const [emailLoader, setEmailLoader] = useState(false)
    const [BrandData, setBrandData] = useState('')
    const [detail, setDetail] = useState()
    const [category, setCategory] = useState([])
    const [relatedAffiliate,setAllAffiliate] = useState([])

    const getCategory = (p = {}) => {
        let url = 'main-category/all'
        ApiClient.get(url).then(res => {
            if (res.success) {
                const data = res.data.data
                setCategory(data)
            }
        })
    }

    const allGetAffiliate = (p = {}) => {
        let url = 'getallaffiliatelisting'
        ApiClient.get(url).then(res => {
            if (res.success) {
                const data = res.data
                const filteredData = data.filter(item => item !== null);
                const manipulateData = filteredData.map((itm)=>{return{
                    name:itm?.fullName || itm?.firstName , id : itm?.id || itm?._id
                }})
                setAllAffiliate(manipulateData)
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
        e.preventDefault();
        setSubmitted(true);
    
        let method = 'post';
        let url = 'coupon/add';
    
        let value = {
            ...form,
        };
    
        // Convert media to string if it exists
        if (value?.media) {
            value = { ...value, media: value?.media?.value.toString() };
        }
    
        // If visibility is Public, remove media
        if (form?.visibility === 'Public') {
            delete value.media;
        }

        if (form?.couponType === 'Campaign') {
            delete value.commissionType;
        }
    
        // Set status to 'Pending' if startDate is in the future
        const now = new Date();
        const startDate = new Date(form?.startDate);
        if (startDate > now) {
            value.status = 'Pending';
        }
    
        if (value.id) {
            method = 'put';
            url = 'coupon/edit';
        } else {
            delete value.id;
        }
    delete value?.couponCommissionValue;
    delete value?.couponCommissionType;
        loader(true);
        ApiClient.allApi(url, value, method).then(res => {
            if (res.success) {
                toast.success("Coupon Added Successfully.");
                let redirectUrl = '/coupons';
                if (role) redirectUrl = "/coupons/" + role;
                history.push(redirectUrl);
            }
            loader(false);
            setSubmitted(true);
        });
    };

    const imageResult = (e) => {
        setImages(e?.value)
    }

    const addressResult = (e) => {
        setform({ ...form, address: e.value })
    }

    const back = () => {
        history.back()
    }


    const emailCheck = (email) => {
        let isValid = methodModel.emailvalidation(email)
        if (isValid) {
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
            ApiClient.get("coupon/get", { id }).then(res => {
                if (res.success) {
                    let value = res.data
                    setDetail(value)
                        setform({
                        "id":value?.id,
                        "media":value?.media,
                        "couponCode":value?.couponCode,
                        "couponType":value?.couponType,
                        "startDate": value?.startDate,
                        "expirationDate": value?.expirationDate,
                        "commissionType":value?.commissionType,
                        "couponAmount":value?.couponAmount,
                        "applicable":value?.applicable,
                        "visibility": value?.visibility,
                        "url":value?.url,
                        "couponCommission":value?.couponCommission,
                        // "status": "Enabled"
                    })
                    setImages(value?.image)
                    // let payload = { ...defaultvalue };
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

    // const getData = () => {
    //     let url = 'users/list'
    //     ApiClient.get(url, { role: "affiliate", createBybrand_id: user?.id, }).then(res => {
    //         if (res.success) {
    //             const data1 = res.data.data.filter(item => item.status === "active");
    //             setAffiliateData(data1)
    //         }
    //     })
    // }

    const getData = (p = {}) => {
        let url = 'getallaffiliatelisting'
        ApiClient.get(url).then(res => {
            if (res.success) {
                const data = res.data
                const filteredData = data.filter(item => item !== null);
                const manipulateData = filteredData.map((itm)=>{return{
                    name:itm?.fullName || itm?.firstName , id : itm?.id || itm?._id
                }})
                setAffiliateData(manipulateData)
            }
        })
    }

    useEffect(() => {
        getData()
        getBrandData()
        getCategory()
        allGetAffiliate()
    }, [])

    return <>
        <Html
            id={id}
            form={form}
            detail={detail}
            emailCheck={emailCheck}
            emailLoader={emailLoader}
            category={category}
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
            relatedAffiliate={relatedAffiliate}
        />
    </>
}

export default AddEditUser