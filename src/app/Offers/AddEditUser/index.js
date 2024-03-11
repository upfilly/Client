import React, { useState, useEffect } from "react";
import ApiClient from "../../../methods/api/apiClient";
import loader from "../../../methods/loader";
import methodModel from "../../../methods/methods";
import { campaignType } from "../../../models/type.model";
import Html from "./Html";
import { toast } from "react-toastify";
import { useRouter, useParams } from "next/navigation";
import crendentialModel from "@/models/credential.model";

const AddEditUser = () => {
    const { role, id } = useParams()
    const user = crendentialModel.getUser()
    const [image, setImages] = useState({ image: '' });
    const defaultvalue = campaignType
    const [form, setform] = useState({
        id: "",
        name: "",
        description: "",
        image: [],
        price: '',
        category_id: "",
        sub_category_id: "",
        opportunity_type: [],
        placement: [],
        start_date: "",
        end_date: ""
    })
    const [affiliateData, setAffiliateData] = useState();
    const [eyes, setEyes] = useState({ password: false, confirmPassword: false });
    const [submitted, setSubmitted] = useState(false)
    const history = useRouter()
    const [emailLoader, setEmailLoader] = useState(false)
    const [emailErr, setEmailErr] = useState('')
    const [detail, setDetail] = useState()
    const [category, setCategory] = useState([])
    const [subCategory, setSubCategory] = useState([])
    const [dateRange, setDateRange] = useState([null, null]);
    const [startDate, endDate] = dateRange;

    const getCategory = (p = {}) => {
        let url = "main-category/all";
        ApiClient.get(url).then((res) => {
            if (res.success) {
                const data = res.data.data.filter((item) => item.status === "active" && item.cat_type === "product");

                setCategory(data);
            }
        });
    };

    const getSubCategory = (p = {}) => {
        let url = `sub-category/all?parent_id=${form?.category_id}`;
        ApiClient.get(url).then((res) => {
            if (res.success) {
                const data = res.data.data.filter((item) => item.status === "active");

                setSubCategory(data);
            }
        });
    };

    useEffect(() => {
        getCategory()
    }, [])

    useEffect(() => {
        getSubCategory();
    }, [form?.category_id]);

    const getError = (key) => {
        return methodModel.getError(key, form, formValidation)
    }

    const handleSubmit = (e) => {
        e.preventDefault()

        if (!form?.description || !form?.name || !form?.price ) {
            setSubmitted(true)
            return;
        }

        let method = 'post'
        let url = 'product'

        let value = {
            ...form,
            start_date:startDate,
            end_date:endDate
        }
        delete value.status
        if (value.id) {
            method = 'put'
            url = 'product'
            delete value.role
            delete value.improvements
            delete value.status
            delete value.sub_category_id
            delete value.category_id
        } else {
            delete value.id
        }

        delete value.confirmPassword
        loader(true)
        ApiClient.allApi(url, value, method).then(res => {
            if (res.success) {
                toast.success(res.message)
                let url = '/Offers'
                // if(role) url="/campaign/"+role
                history.push(url)
            }
            loader(false)
        })
    }

    const imageResult = (e, key) => {
        image[key] = e.value
        setImages(image)
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
            ApiClient.get("product", { id }).then(res => {
                if (res.success) {
                    let value = res.data
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
                    setDateRange([new Date(payload?.start_date),
                        new Date(payload?.end_date)])
                    setform({ ...payload })
                }
                loader(false)
            })
        }
    }, [id])

    const getData = () => {
        let url = 'users/list'
        ApiClient.get(url, { role: "affiliate", createBybrand_id: user?.id, }).then(res => {
            if (res.success) {
                const data1 = res.data.data.filter(item => item.status === "active");
                setAffiliateData(data1)
            }
        })
    }

    useEffect(() => {
        getData()
    }, [])

    return <>
        <Html
            id={id}
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
            image={image}
            addressResult={addressResult}
            handleSubmit={handleSubmit}
            imageResult={imageResult}
            getError={getError}
            affiliateData={affiliateData}
            category={category}
            setCategory={setCategory}
            subCategory={subCategory}
            setSubCategory={setSubCategory}
            setDateRange={setDateRange}
            startDate={startDate}
            endDate={endDate}
        />
    </>
}

export default AddEditUser