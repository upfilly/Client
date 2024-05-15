import React, { useState, useEffect } from 'react';
import ApiClient from '@/methods/api/apiClient';
import loader from '@/methods/loader';
import './style.scss';
import { userType } from '@/models/type.model';
import Html from './Html';
import formModel from '@/models/form.model';
import crendentialModel from '@/models/credential.model';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import { geocodeByAddress, getLatLng } from "react-google-places-autocomplete";
import methodModel from '@/methods/methods';


const EditProfile = () => {
  const history = useRouter()
  const user = crendentialModel.getUser()
  const [data, setData] = useState('');
  const [form, setForm] = useState({
    id: '', fullName: '', firstName: '', lastName: '', gender: '', email: '', mobileNo: '', address: '', image: [], role: '',
    instagram_username: "",
    instagram_profile_link: "",
    youtube_username: "",
    youtube_profile_link: "",
    twitter_username: "",
    twitter_profile_link: "",
    linkedin_username: "",
    linkedin_profile_link: "",
    website: "",
    description: "",
    tags: [],
    dialCode:'+1',
    pincode: "",
    social_media_platforms: [],
    category_name: "",
    category_id: "",
    country:"",
    city:"",
    pincode:"",
    accountholder_name: "",
    routing_number: "",
    account_number: "",
    ssn_number: '',
    company_name: "",
    affiliate_type:'',
    // dob:''
  });
  const [picLoader,setPicLoader]=useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [category, setCategory] = useState('')
  const [changeSubCategory, setChangeSubCategory] = useState('')
  const [address, setAddress] = useState(form?.address);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [selectedItems, setSelectedItems] = useState(form?.social_media_platforms);
  const [dob, setDOB] = useState(null);
  const [formData, setFormData] = useState({
    // auto_invoice: false,
    // is_hide_invoice: false,
    // billing_frequency: '',
    // payment_method: '',
    // tax_detail: '',
    accountholder_name: "",
    routing_number: "",
    account_number: "",
    ssn_number: '',
    company_name: "",
    // front_image:"",
    // back_image:""
    // default_invoice_setting: '',
  });
  const [formatedDob, setFormatedDob] = useState()
  const formValidation = [
    { key: 'firstName', required:true },
    { key: 'mobileNo', minLength: 10 },
    { key: 'gender', required:true },
    { key: 'dialCode', minLength:1 },
    { key: 'category_id', required:true },
  ]

  console.log(form,"ffffffoooooo")
  
  useEffect(() => {
    if (!form?.dialCode) {
      setForm((prevForm) => ({ ...prevForm, dialCode: '+1' }));
    }
  }, [form?.dialCode]);

  useEffect(() => {
    setAddress(form?.address)
  }, [form?.address])

  const handleDateChange = (date) => {
    if (date instanceof Date && !isNaN(date)) {
      const day = date.getDate();
      const month = date.getMonth() + 1;
      const year = date.getFullYear();
      const formattedDOB = { day, month, year };

      setDOB(date);
      setFormatedDob(formattedDOB);
    }
  };
  

  const gallaryData = () => {
    loader(true)
    ApiClient.get(`user/detail`, { id: user.id }).then(res => {
      if (res.success) {
        // setForm(res.data)
        let value = res.data
        let payload = userType
        let oarr = Object.keys(userType)
        oarr.map(itm => {
          payload[itm] = value[itm] || ''
        })
        setForm(payload)
        setFormData(payload)
        setData(res.data)
      }
      loader(false)
    })
  };

  const getError = (key) => {
    return formModel.getError('profileForm', key)
  }

  const handleSubmit = e => {
    e.preventDefault();
    setSubmitted(true)
    let invalid = methodModel.getFormError(formValidation, form)
    if(form?.dialCode == "") return
    if(form?.mobileNo == "") return
    if (invalid) return

    let value = {
      ...form,
      social_media_platforms: selectedItems || [],
      lat: selectedLocation?.lat?.toString(),
      lng: selectedLocation?.lng?.toString(),
      address: selectedLocation?.address,
      country: selectedLocation?.country,
      state: selectedLocation?.state,
      city: selectedLocation?.city,
      pincode: selectedLocation?.pincode,
      // payment_method:formData?.payment_method,
      accountholder_name: formData?.accountholder_name,
      routing_number: formData?.routing_number,
      account_number: formData?.account_number,
      ssn_number:formData?.ssn_number,
      company_name: formData?.company_name,
      // dob: formatedDob,
    }
    delete value.category_name
    // delete value.category_id
    delete value.role

    if (!form?.affiliate_group) {
      delete value.affiliate_group
    }

    if (user?.role != "affiliate"){
      delete value.affiliate_type
    }

    loader(true)
    ApiClient.put('edit/profile', value).then(res => {
      if (res.success) {
        let uUser = { ...user, ...value }
        crendentialModel.setUser(uUser)
        history.push("/profile")
        toast.success(res.message)
      }
      loader(false)
    })
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
      setForm({...form,
        city: selectedLocation?.city,
        state: selectedLocation?.state,
        country: selectedLocation?.country,
        pincode:selectedLocation?.pincode
      })
      setAddress(selectedAddress);
      sendLocationToApi(selectedLocation);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const uploadImage = (e) => {
    setForm({ ...form, baseImg: e.target.value })
    let files = e.target.files
    let file = files.item(0)
    // loader(true)
    setPicLoader(true)
    ApiClient.postFormData('upload/image?modelName=users', { file: file, modelName: 'users' }).then(res => {
      if (res.data) {
        let image = res?.data?.fullpath
        setForm({ ...form, image: `images/users/${image}` })
      }
      setPicLoader(false)
    })
  }

  useEffect(
    () => {
      if (user) {
        gallaryData();
      }
    }, []);

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

  const handleChange = (newAddress) => {
    setAddress(newAddress);
  };

  const handleFeatureCheckbox = (item) => {
    if (selectedItems.includes(item)) {
      setSelectedItems(selectedItems.filter((selected) => selected !== item));
      // Clear the corresponding form fields when the checkbox is unchecked
      setForm((prevForm) => ({
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

  useEffect(() => {
    getCategory();
  }, [])

  return (
    <>
      <Html
        handleSubmit={handleSubmit}
        setForm={setForm}
        form={form}
        uploadImage={uploadImage}
        getError={getError}
        submitted={submitted}
        category={category}
        changeSubCategory={changeSubCategory}
        address={address}
        handleSelect={handleSelect}
        handleChange={handleChange}
        setChangeSubCategory={setChangeSubCategory}
        selectedItems={selectedItems}
        setSelectedItems={setSelectedItems}
        handleFeatureCheckbox={handleFeatureCheckbox}
        picLoader={picLoader}
        selectedLocation={selectedLocation}
        setSelectedLocation={setSelectedLocation}
        formData={formData}
        setFormData={setFormData}
        dob={dob}
        setDOB={setDOB}
        handleDateChange={handleDateChange}
        user={user}
      />
    </>
  );
};

export default EditProfile;
