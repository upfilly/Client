"use client"

import React, { useState, useEffect } from "react";
import ApiClient from '@/methods/api/apiClient';
import methodModel from '@/methods/methods';
import Html from "./Html";
import { toast } from "react-toastify";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import loader from '@/methods/loader';
import { affilliateGrouptype, userType } from "@/models/type.model";
import { geocodeByAddress, getLatLng } from "react-places-autocomplete";
import crendentialModel from "@/models/credential.model";


const AddEditUser = () => {
  const {id} = useParams()
  const user = crendentialModel.getUser()
  const [image, setImages] = useState('');
  const defaultvalue = userType
  const [form, setform] = useState({email:'',role:''})
  const [permissions, setPermissions] = useState({})
  const [eyes, setEyes] = useState({ password: false, confirmPassword: false });
  const [submitted, setSubmitted] = useState(false)
  const history = useRouter()
  const [emailLoader, setEmailLoader] = useState(false)
  const [emailErr, setEmailErr] = useState('')
  const [detail, setDetail] = useState()
  const [changeSubCategory, setChangeSubCategory] = useState('')
  const [selectedItems, setSelectedItems] = useState(form?.social_media_platforms);
  const [affiliateGroup, setAffiliategroup] = useState([])
  const formValidation = [
    { key: 'firstName', required: true },
    { key: 'lastName', required: true },
    { key: 'email', required: true },
    { key: 'role', required: true },
  ]
  const [category, setCategory] = useState('')
  const [address, setAddress] = useState(form?.address);
  const [selectedLocation, setSelectedLocation] = useState(null);

  const handleChange = (newAddress) => {
    setAddress(newAddress);
  };

  const handleSelect = async (selectedAddress) => {
    try {
      const results = await geocodeByAddress(selectedAddress);
      const latLng = await getLatLng(results[0]);

      const addressComponents = results[0].address_components;
      const city = addressComponents.find((component) =>
        component.types.includes('locality')
      )?.long_name || '';
      const state = addressComponents.find((component) =>
        component.types.includes('administrative_area_level_1')
      )?.long_name || '';
      const country = addressComponents.find((component) =>
        component.types.includes('country')
      )?.long_name || '';
      const pincode = addressComponents.find((component) =>
        component.types.includes('postal_code')
      )?.long_name || '';

      const selectedLocation = {
        address: selectedAddress,
        city,
        state,
        country,
        pincode,
        ...latLng,
      };

      setSelectedLocation(selectedLocation);
      setform({...form,
        city: selectedLocation?.city,
        state: selectedLocation?.state,
        country: selectedLocation?.country,
        pincode: selectedLocation?.pincode
      })
      setAddress(selectedAddress);
      sendLocationToApi(selectedLocation);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  useEffect(() => {
    // setChangeSubCategory(form?.category_name)
    setAddress(form?.address)
  }, [form])

  const handleFeatureCheckbox = (item) => {
    if (selectedItems.includes(item)) {
      setSelectedItems(selectedItems.filter((selected) => selected !== item));
      // Clear the corresponding form fields when the checkbox is unchecked
      setform((prevForm) => ({
        ...prevForm,
        [`${item}_username`]: '',
        [`${item}_profile_link`]: '',
      }));
    } else {
      setSelectedItems([...selectedItems, item]);
    }
  };

  useEffect(() => {

    setSelectedItems(form?.social_media_platforms)

  }, [form?.social_media_platforms])

  const getError = (key) => {
    return methodModel?.getError(key, form, formValidation)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setSubmitted(true)
    let invalid = methodModel.getFormError(formValidation, form)
    // if (form?.dialCode == "") return
    if (invalid) return
    let method = 'post'
    let url = 'addinviteuser'
    let value = {
      ...form,
    }

    if (value.id || value.user_id) {
      method = 'put'
      url = 'updateInviteUser'
      delete value.permissions
      delete value.baseImg
      // delete value.role
      delete value.email
      delete value.category_name
      // delete value.category_id
    } else {
      delete value.id
    }

    delete value.confirmPassword
    loader(true)
    ApiClient.allApi(url, value, method).then(res => {
      if (res.success) {
        toast.success(res.message)
        let url = '/users'
        // if(role) url="/users/"+role
        history.push(url)
      }
      loader(false)
    })
  }

  const imageResult = (e, key) => {
    // images[key] = e.value
    setImages(e?.value)
    console.log("imageResult", e)
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
      ApiClient.get(`getinviteuser?user_id=${id}&brand_id=${user?.role == 'brand' ? user?.id : ''}`).then(res => {
        if (res.success) {
          let value = res.data
          setDetail(value)
          let payload = {
            "brand_id": value?.brand_id,
            "user_id": value?.id,
            "email": value?.email,
            "firstName": value?.firstName,
            "lastName": value?.lastName,
            "language": value?.language,
            "role": value?.role,
            "description": value?.description,
            // "brand_id": value?.brand_id
          }
          // let oarr = Object.keys(defaultvalue)
          // oarr.map(itm => {
          //   payload[itm] = value[itm] || ''
          // })
          setform(payload)
          setImages(payload?.image)
        }
        loader(false)
      })
    }
  }, [])


  const getCategory = (p = {}) => {
    // let filter = { ...filters, ...p }
    let url = 'main-category/all'
    ApiClient.get(url).then(res => {
      if (res.success) {
        const data = res.data.data.filter(item => item.status === "active");

        setCategory(data)
      }
    })
  }

  const handleAffiliateGroup=()=>{

    ApiClient.get('affiliate-groups', {status:"active"}).then(res => {

      if (res.success == true) {
        setAffiliategroup(res?.data?.data)
      }
    })
  }

  useEffect(() => {
    getCategory();
    handleAffiliateGroup()
  }, [])

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
      // role={role}
      setform={setform}
      submitted={submitted}
      images={image}
      addressResult={addressResult}
      handleSubmit={handleSubmit}
      imageResult={imageResult}
      getError={getError}
      setPermissions={setPermissions}
      permissions={permissions}
      setChangeSubCategory={setChangeSubCategory}
      changeSubCategory={changeSubCategory}
      handleFeatureCheckbox={handleFeatureCheckbox}
      selectedItems={selectedItems}
      setSelectedItems={setSelectedItems}
      setAddress={setAddress}
      category={category}
      affiliateGroup={affiliateGroup}
      id={id}
      handleChange={handleChange}
      handleSelect={handleSelect}
      address={address}
      setForm={setform}
    /></>
}

export default AddEditUser

