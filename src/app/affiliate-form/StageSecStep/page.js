"use client"

import react, { useEffect, useState } from 'react';
import "./style.scss";
import Layout from '../../components/global/layout';
import { useParams, useRouter } from 'next/navigation';
import PlacesAutocomplete, { geocodeByAddress, getLatLng } from "react-places-autocomplete";
import ApiClient from '@/methods/api/apiClient';
import loader from '@/methods/loader';

export default function StageSecStep() {
  const { id } = useParams()
  const router = useRouter()
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [address, setAddress] = useState("");
  const [address2, setAddress2] = useState("")
  const [inputFocused, setInputFocused] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [enableAddress, setEnableAddress] = useState(true)
  const [stateAutocomplete, setStateAutocomplete] = useState(true)

  const handleEnableData = () => {
    router.push(`/affiliate-form/StageThirdStep`)
  }

  const handleSave = () => {


    if (!address || !selectedLocation?.pincode || !selectedLocation?.city || !selectedLocation?.state) {
      setSubmitted(true)
      return;
    }

    const data = {
      address: selectedLocation?.address,
      address2: address2,
      country: selectedLocation?.country,
      state: selectedLocation?.state,
      city: selectedLocation?.city,
      pincode: selectedLocation?.pincode,
      lat: selectedLocation?.lat?.toString(),
      lng: selectedLocation?.lng?.toString(),
    }
    if (enableAddress) {
      // ApiClient.put('edit/profile', data).then(res => {

      //   if (res.success == true) {
      localStorage.setItem("step2", JSON.stringify(data))
      router.push(`/affiliate-form/taxSection`)
      // }
      //    loader(false)
      // })
    }
  }

  const handleGoBack = () => {
    router.push(`/affiliate-form/StageFirstStep`)
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

      setAddress(selectedAddress);
      sendLocationToApi(selectedLocation);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  useEffect(() => {
    setTimeout(() => {
      setStateAutocomplete(false)
    }, 100);
  }, [])

  const getDetail = () => {
    // loader(true)
    ApiClient.get(`user/detail?id=${id}`).then(res => {
      if (res.success) {
        setSelectedLocation(res?.data)
        setAddress(res?.data?.address)
        setAddress2(res?.data?.address2)
      }
      // loader(false)
    })
  };

  useEffect(() => {
    const storedData = localStorage.getItem("step2");
    const parsedData = storedData ? JSON.parse(storedData) : null;
    setSelectedLocation(parsedData)
    setAddress(parsedData?.address)
    setAddress2(parsedData?.address2)
  }, [])

  const handleChange = (newAddress) => {
    setAddress(newAddress);
  };

  return (
    <>
      <Layout handleKeyPress={undefined} setFilter={undefined} reset={undefined} filter={undefined} name={"Affiliate"} filters={undefined}>
        <div className='main-affiliate mt-3 mb-5'>
          <div className='container-fluid'>
            <div className='row mx-0'>
              <div className='col-md-12'>
                <div className='d-flex align-items-center'>
                  <button className='genral-buttons'><span className="rank mr-2">01</span>General</button>
                  <button className='genral-buttons ml-3'><span className="rank mr-2">02</span>Address</button>
                  <button className='genral-button ml-3' ><span className="ranks mr-2">03</span> Tax Detail</button>
                  <button className='genral-button ml-3'><span className="ranks mr-2">03</span>User</button>
                </div>
              </div>
            </div>


            <div className='row'>
              <div className='col-lg-12'>
                <div className=' '>
                  <div className='row mt-3  mx-0'>
                    <div className='col-md-12'>

                      {/* <div className='form-group'>
                <p className='mb-0'><label className='label-set'>Enable Address </label></p>
                <input type="checkbox" className='checkbox-custom d-block'
                checked={enableAddress}
                onChange={()=>setEnableAddress(!enableAddress)}></input>
                </div> */}

                    </div>
                  </div>
                  <div className='row mx-0 '>
                    {/* { enableAddress &&    */}
                    <><div className='col-md-6'>
                      <label className='label-set'>Address1<span className="star">*</span></label>

                      {!stateAutocomplete && <PlacesAutocomplete
                        value={address}
                        onChange={handleChange}
                        onSelect={handleSelect}
                      >
                        {({ getInputProps, suggestions, getSuggestionItemProps, loading }) => (
                          <div>
                            <input className="form-control "

                              {...getInputProps({
                                placeholder: 'Enter an address...',
                                onFocus: () => setInputFocused(true),
                                onBlur: () => setInputFocused(false),
                                // value:addressData
                              })} />
                            {/* {(inputFocused && address?.length > 0) && <div className='shadow p-3'> */}
                            {loading && <div>Loading...</div>}
                            {suggestions?.map((suggestion) => {
                              const style = {
                                backgroundColor: suggestion.active ? '#41b6e6' : '#fff',

                              };
                              return (
                                <div className='location_address'
                                  {...getSuggestionItemProps(suggestion, {
                                    style,
                                  })}
                                >
                                  <i class="fa-solid fa-location-dot mr-1"></i>{suggestion.description}
                                </div>
                              );
                            })}
                            {/* </div>} */}
                          </div>
                        )}
                      </PlacesAutocomplete>}
                      {submitted && !address ? <div className="invalid-feedback d-block">Address is Required</div> : <></>}

                    </div><div className='col-md-6'>
                        <div class="form-group">
                          <label className='label-set'>Address2  </label>
                          <input type="text" placeholder='Address' className="form-control " value={address2} onChange={(e) => setAddress2(e.target.value)} lassName="form-control " id="exampleFormControlInput1" />
                        </div>
                      </div><div className='col-md-6'>
                        <div class="form-group">
                          <label className='label-set'>Country  </label>
                          <input type="text" placeholder='Your Country' value={selectedLocation?.country} className="form-control " id="exampleFormControlInput1" disabled />
                        </div>
                      </div>
                      <div className='col-md-3'>
                        <div class="form-group">
                          <label className='label-set'>State <span className="star">*</span> </label>
                          <input type="text" placeholder='Your State' value={selectedLocation?.state} onChange={(e) => setSelectedLocation({ ...selectedLocation, state: e.target.value })} className="form-control " id="exampleFormControlInput1" />
                          {submitted && !selectedLocation?.state ? <div className="invalid-feedback d-block">State is Required</div> : <></>}
                        </div>
                      </div><div className='col-md-3'>
                        <div class="form-group">
                          <label className='label-set'>City <span className="star">*</span> </label>
                          <input type="text" placeholder='Your City' value={selectedLocation?.city} onChange={(e) => setSelectedLocation({ ...selectedLocation, city: e.target.value })} className="form-control " id="exampleFormControlInput1" />
                          {submitted && !selectedLocation?.city ? <div className="invalid-feedback d-block">City is Required</div> : <></>}
                        </div>
                      </div><div className='col-md-3'>
                        <div class="form-group">
                          <label className='label-set'>Postal Code<span className="star">*</span>  </label>
                          <input type="text" value={selectedLocation?.pincode} onChange={(e) => setSelectedLocation({ ...selectedLocation, pincode: e.target.value })} className="form-control " id="exampleFormControlInput1" />
                    {submitted && !selectedLocation?.pincode ? <div className="invalid-feedback d-block">Pincode is Required</div> : <></>}
                        </div>
                      </div></>
                    {/* } */}

                    <div className='col-md-12 mt-4 mb-2'>
                      <button className='back-btns' onClick={handleGoBack}>Back</button>
                      {enableAddress ? <button className='btn btn-primary login ml-3' onClick={handleSave}>Save & Continue</button> :
                        <button className='btn btn-primary login ml-3' onClick={handleEnableData}>Save & Continue</button>}
                    </div>

                  </div>
                </div>

              </div>
            </div>
          </div>
        </div>
      </Layout>
    </>
  );
}
