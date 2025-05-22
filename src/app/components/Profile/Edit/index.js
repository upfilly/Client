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
    id: '', 
    fullName: '', 
    firstName: '', 
    lastName: '', 
    gender: '', 
    email: '',
    mobileNo: '',
    address: '', 
    image: [],
    currencies:[],
    role: '',
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
    dialCode: '+1',
    pincode: "",
    social_media_platforms: [],
    category_name: "",
    category_id: "",
    country: "",
    city: "",
    pincode: "",
    accountholder_name: "",
    routing_number: "",
    account_number: "",
    ssn_number: '',
    company_name: "",
    affiliate_type: '',
    cat_type: ''
    // dob:''
  });
  const [picLoader, setPicLoader] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [category, setCategory] = useState([])
  const [changeSubCategory, setChangeSubCategory] = useState('')
  const [address, setAddress] = useState(form?.address);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [selectedItems1, setSelectedItems1] = useState(form?.social_media_platforms);
  const [websites, setWebsites] = useState(['']);
  const [selectedItems, setSelectedItems] = useState({
    categories: [],
    subCategories: [],
    subSubCategories: [],
  });
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
    { key: 'firstName', required: true },
    { key: 'mobileNo', minLength: 10 },
    { key: 'gender', required: true },
    { key: 'dialCode', minLength: 1 },
    // { key: 'affiliate_type', required:true },
    // { key: 'category_id', required:true },
    // { key: 'sub_category_id', required:true },
    // { key: 'sub_child_category_id', required:true },
  ]
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedSubcategory, setSelectedSubcategory] = useState('');
  const [selectedSubSubcategory, setSelectedSubSubcategory] = useState('');
  const [customItems, setCustomItems] = useState(data);

  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
    setSelectedSubcategory('');
    setSelectedSubSubcategory('');
  };

  const handleSubcategoryChange = (e) => {
    setSelectedSubcategory(e.target.value);
    setSelectedSubSubcategory('');
  };

  const handleSubsubcategoryChange = (e) => {
    setSelectedSubSubcategory(e.target.value);
  };

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
    loader(true);
    ApiClient.get(`user/detail`, { id: user?.activeUser?.id }).then(res => {
      if (res.success) {
        const userData = res.data;
        
        // Start with the base user type structure
        let payload = { ...userType };
        
        // Map all existing user data properties to the form
        Object.keys(userData).forEach(key => {
          payload[key] = userData[key] !== undefined ? userData[key] : payload[key];
        });
        
        // Handle special cases and nested properties
        
        // Social media platforms
        const socialMediaPlatforms = ['youtube', 'X(formerly Twitter)', 'instagram', 'linkedin'];
        const userSelectedPlatforms = [];
        
        socialMediaPlatforms.forEach(platform => {
          const usernameKey = `${platform}_username`;
          const linkKey = `${platform}_profile_link`;
          
          // If user has data for this platform, mark it as selected
          if (userData[usernameKey] || userData[linkKey]) {
            userSelectedPlatforms.push(platform);
          }
        });
        
        // Also check for custom platforms the user might have added
        Object.keys(userData).forEach(key => {
          if (key.endsWith('_username') || key.endsWith('_profile_link')) {
            const platform = key.split('_')[0];
            if (!socialMediaPlatforms.includes(platform) && !userSelectedPlatforms.includes(platform)) {
              userSelectedPlatforms.push(platform);
              // Add to custom items if it's not in the default list
              if (!customItems.includes(platform)) {
                setCustomItems(prev => [...prev, platform]);
              }
            }
          }
        });
        
        // Handle websites for affiliates
        const websites = userData.affiliate_website && userData.affiliate_website.length > 0 
          ? userData.affiliate_website 
          : [''];
        
        // Handle categories
        const selectedItems = {
          categories: userData.category_id || [],
          subCategories: userData.sub_category_id || [],
          subSubCategories: userData.sub_child_category_id || [],
        };
        
        // Set all the state
        setForm(payload);
        setFormData(payload);
        setWebsites(websites);
        setData(userData);
        setSelectedItems(selectedItems);
        setSelectedItems1(userSelectedPlatforms);
      }
      loader(false);
    });
  };

  const getError = (key) => {
    return formModel.getError('profileForm', key)
  }

  const handleSubmit = e => {
    e.preventDefault();
    setSubmitted(true)
    let invalid = methodModel.getFormError(formValidation, form)
    if (form?.dialCode == "") return
    if (form?.mobileNo == "") return
    if (invalid) return
    if (user?.role == 'affiliate' && !form?.affiliate_type) return

    let value = {
      ...form,
      social_media_platforms: selectedItems1 || [],
      affiliate_website: websites,
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
      ssn_number: formData?.ssn_number,
      company_name: formData?.company_name,
      // sub_category_id: selectedSubcategory,
      // sub_child_category_id: selectedSubSubcategory,
      // category_id: selectedCategory,
      category_id: selectedItems?.categories,
      sub_category_id: selectedItems?.subCategories,
      sub_child_category_id: selectedItems?.subSubCategories,
      // cat_type:form?.cat_type
      // dob: formatedDob,
    }
    delete value?.websites
    if (!value?.cat_type) {
      delete value?.cat_type
    }
    if (!value?.sub_category_id) {
      delete value?.sub_category_id
    }
    if (!value?.category_id) {
      delete value?.category_id
    }
    if (!value?.sub_child_category_id) {
      delete value?.sub_child_category_id
    }
    delete value.category_name
    // delete value.category_id
    delete value.role
    delete value.addedBy

    if (!form?.affiliate_group) {
      delete value.affiliate_group
    }

    if (user?.role != "affiliate") {
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
      setForm({
        ...form,
        city: selectedLocation?.city,
        state: selectedLocation?.state,
        country: selectedLocation?.country,
        pincode: selectedLocation?.pincode
      })
      setAddress(selectedAddress);
      sendLocationToApi(selectedLocation);
    } catch (error) {
      // console.error('Error:', error);
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
    let url = 'categoryWithSub'
    ApiClient.get(url).then(res => {
      if (res.success) {
        const data = res.data.data
        setCategory(data)
      }
    })
  }

  const handleChange = (newAddress) => {
    setAddress(newAddress);
  };

  const handleFeatureCheckbox = (item) => {
    if (selectedItems1.includes(item)) {
      setSelectedItems1(selectedItems1.filter((selected) => selected !== item));
      // Clear the corresponding form fields when the checkbox is unchecked
      setForm((prevForm) => ({
        ...prevForm,
        [`${item}_username`]: '',
        [`${item}_profile_link`]: '',
      }));
    } else {
      setSelectedItems1([...selectedItems1, item]);
    }
  };

  useEffect(() => {
    setSelectedItems1(form?.social_media_platforms)
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
        selectedItems1={selectedItems1}
        setSelectedItems1={setSelectedItems1}
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
        handleCategoryChange={handleCategoryChange}
        handleSubcategoryChange={handleSubcategoryChange}
        handleSubsubcategoryChange={handleSubsubcategoryChange}
        selectedCategory={selectedCategory}
        selectedSubcategory={selectedSubcategory}
        selectedSubSubcategory={selectedSubSubcategory}
        history={history}
        websites={websites}
        setWebsites={setWebsites}
        customItems={customItems} 
        setCustomItems={setCustomItems}
      />
    </>
  );
};

export default EditProfile;
