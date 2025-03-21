import React, { useState, useEffect } from "react";
import ApiClient from "../../../methods/api/apiClient";
import loader from "../../../methods/loader";
import methodModel from "../../../methods/methods";
import { addCampaignType } from "../../../models/type.model";
import Html from "./Html";
import { toast } from "react-toastify";
import { useRouter, useParams } from "next/navigation";
import crendentialModel from "@/models/credential.model";

const AddEditUser = () => {
    const { role, id } = useParams()
    const user = crendentialModel.getUser()
    const [images, setImages] = useState({ image: '' });
    const [selectedItems, setSelectedItems] = useState({
        categories: [],
        subCategories: [],
        subSubCategories: [],
    });
    const [selectedRegionItems, setSelectedRegionItems] = useState({
        regions: [], countries: []
    })
    const defaultvalue = addCampaignType
    const [form, setform] = useState({
        id: "",
        name: "",
        // amount: "",
        description: "",
        // images: [],
        documents: [],
        // videos: [],
        affiliate_id: null,
        status: "",
        access_type: "",
        event_type: [],
    })
    const [affiliateData, setAffiliateData] = useState();
    const [eyes, setEyes] = useState({ password: false, confirmPassword: false });
    const [submitted, setSubmitted] = useState(false)
    const history = useRouter()
    const [emailLoader, setEmailLoader] = useState(false)
    const [emailErr, setEmailErr] = useState('')
    const [errors, setErrors] = useState({});
    const [detail, setDetail] = useState()

    console.log(selectedRegionItems, "nmnmnmnmn")

    const getError = (key) => {
        return methodModel.getError(key, form, formValidation)
    }

    const validate = () => {
        let formErrors = {};
        if (!form.name) formErrors.name = 'Name is required';
        if (!form.access_type) formErrors.access_type = 'Access Type is required';
        if (!form.event_type || form.event_type.length === 0) formErrors.event_type = 'Event Type is required';
        if (form.event_type?.includes("lead") && !form.lead_amount) formErrors.lead_amount = 'Lead Amount is required';
        if (form.event_type?.includes("purchase") && !form.campaign_type) formErrors.campaign_type = 'Campaign Type is required';
        // if (form.commission_type === "percentage" && !form.commission) formErrors.commission = 'Percentage is required';
        // if (form.commission_type === "amount" && !form.commission) formErrors.commission = 'Amount is required';
        // if (!form.category_type) formErrors.category_type = 'Category Type is required';
        // if (!form.category) formErrors.category = 'Category is required';
        if (!form.description) formErrors.description = 'Description is required';
        if (selectedRegionItems?.regions.length == 0) formErrors.region = 'Country is required';
        if (selectedItems?.categories.length == 0) formErrors.categories = 'Categories is required';

        setErrors(formErrors);
        return Object.keys(formErrors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault()

        // if (!form?.description || !form?.name || !form?.event_type) {

        // }
        console.log(validate(), "opoppop")

        if (!validate()) {
            setSubmitted(true)
            return;
        }

        let method = 'post'
        let url = 'campaign'

        let value = {
            ...form,
            // commission_type: "percentage",
            // commission: "1",
            region: selectedRegionItems?.regions,
            region_continents: selectedRegionItems?.countries,
            campaign_type: form?.campaign_type?.[0],
            category: selectedItems?.categories,
            sub_category: selectedItems?.subCategories,
            sub_child_category: selectedItems?.subSubCategories,
            brand_id: user?.id || user?._id,
        }
        if (!form.event_type?.includes("purchase")) {
            value = {
                ...form,
                commission_type: "percentage",
                commission: "1",
                region: selectedRegionItems?.regions,
                region_continents: selectedRegionItems?.countries,
                campaign_type: form?.campaign_type?.[0],
                category: selectedItems?.categories,
                sub_category: selectedItems?.subCategories,
                sub_child_category: selectedItems?.subSubCategories,
                brand_id: user?.id || user?._id,
            }
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
            delete value.brand_id
            delete value.commission
            delete value.commission_type
            delete value.lead_amount
            delete value.region_continents
        } else {
            delete value.id
        }

        if (value?.access_type == "public") {
            delete value?.affiliate_id
        }

        delete value.confirmPassword
        loader(true)
        ApiClient.allApi(url, value, method).then(res => {
            if (res.success) {
                toast.success(res.message)
                let url = '/campaign'
                // if (role) url = "/campaign/" + role
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


    console.log(form, "klklklklklklkl")

    useEffect(() => {
        setSubmitted(false)
        if (id) {
            loader(true)
            ApiClient.get("campaign", { id }).then(res => {
                if (res.success) {
                    const value = res.data
                    console.log(value, "oopopopopop")
                    setDetail(value)
                    // let payload = { ...defaultvalue };
                    // let oarr = Object.keys(defaultvalue);

                    // oarr.forEach((itm) => {
                    //     if (itm === 'affiliate_id' && value[itm] && value[itm].id) {
                    //         payload[itm] = value[itm].id.toString();
                    //     } else {
                    //         payload[itm] = value[itm] || "";
                    //     }
                    // });
                    setform({
                        id: value?.id || value?._id,
                        name: value?.name,
                        isDefault: value?.isDefault,
                        commission: value?.commission,
                        commission_type: value?.commission_type,
                        lead_amount: value?.lead_amount,
                        access_type: value?.access_type,
                        description: value?.description,
                        documents: value?.documents,
                        affiliate_id: value?.affiliate_id,
                        status: value?.status,
                        access_type: value?.access_type,
                        event_type: value?.event_type,
                        region: value?.region,
                        region_continents: value?.region_continents

                    })
                    setSelectedItems({
                        categories: value?.category?.map((dat) => dat?.id),
                        subCategories: value?.sub_category?.map((dat) => dat?.id),
                        subSubCategories: value?.sub_child_category?.map((dat) => dat?.id),
                    })
                }
                loader(false)
            })
        }
    }, [id])

    const getData = (p = {}) => {
        let url = 'getallaffiliatelisting'
        ApiClient.get(url, { brand_id: user?.id || user?._id }).then(res => {
            if (res.success) {
                const data = res.data
                const filteredData = data.filter(item => item !== null);
                setAffiliateData(filteredData)
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
            images={images}
            addressResult={addressResult}
            handleSubmit={handleSubmit}
            imageResult={imageResult}
            getError={getError}
            affiliateData={affiliateData}
            errors={errors}
            setErrors={setErrors}
            validate={validate}
            selectedItems={selectedItems}
            setSelectedItems={setSelectedItems}
            selectedRegionItems={selectedRegionItems}
            setSelectedRegionItems={setSelectedRegionItems}
        />
    </>
}

export default AddEditUser