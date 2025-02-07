"use client";

import { useEffect, useState } from "react";
import Layout from "../../components/global/layout";
import "./style.scss";
import ApiClient from "@/methods/api/apiClient";
import loader from "@/methods/loader";
import { useRouter } from "next/navigation";
import Link from "next/link";
import methodModel from "@/methods/methods";
import crendentialModel from "@/models/credential.model";

export default function Addcomminson() {
  const router = useRouter()
  const user = crendentialModel.getUser()
  const [affiliateGroup, setAffiliategroup] = useState([])
  const [affiliate, setAffiliate] = useState([])
  const [CampaignData, setCampaignData] = useState()
  const [errors, setError] = useState(false)
  const [formData, setFormData] = useState({
    "event_type": "",
    "amount_type": "",
    "amount": '',
    // "time_frame_type": '',
    // "time_frame": '',
    "campaign": "",
    "date": ""
  });

  const handleAffiliateGroup = () => {
    ApiClient.get('affiliate-groups', { status: "active" }).then(res => {
      if (res.success == true) {
        setAffiliategroup(res?.data?.data)
      }
    })
  }

  function getCurrentDate() {
    const today = new Date();
    let month = String(today.getMonth() + 1);
    let day = String(today.getDate());
    const year = today.getFullYear();

    // Add leading zero if month or day is a single digit
    if (month.length < 2) {
      month = '0' + month;
    }
    if (day.length < 2) {
      day = '0' + day;
    }

    return `${year}-${month}-${day}`;
  }


  // const handleAffiliate = () => {
  //   ApiClient.get('users/list', { status: "active", role: "affiliate", createBybrand_id: user?.id, }).then(res => {
  //     if (res.success == true) {
  //       setAffiliate(res?.data?.data)
  //     }
  //   })
  // }

  const handleAffiliate = (p = {}) => {
    let url = 'getallaffiliatelisting'
    ApiClient.get(url).then(res => {
        if (res.success) {
            const data = res.data
            const filteredData = data.filter(item => item !== null);
            const manipulateData = filteredData.map((itm)=>{return{
                name:itm?.fullName || itm?.firstName , id : itm?.id || itm?._id
            }})
            setAffiliate(manipulateData)
        }
    })
}

  const handleSave = () => {

    if (!formData?.event_type || !formData?.date || !formData?.amount_type || !formData?.campaign) {
      setError(true)
      return;
    }
    loader(true)
    ApiClient.post('commission', formData).then(res => {
      if (res.success == true) {
        router.push(`/commission/commisionplan`)
      }
      loader(false)
    })
  }

  const getCampaignData = (p = {}) => {
    let filter = { search: '', isDeleted: false, status: '', brand_id: user?.id }
    let url = 'campaign/brand/all'
    ApiClient.get(url, filter).then(res => {
      if (res.success) {
        const data = res?.data?.data?.map((data) => {
          return ({
            id: data?.id || data?._id,
            name: data?.name
          })
        })
        setCampaignData(data)
      }
    })
  }

  useEffect(() => {
    handleAffiliateGroup()
    handleAffiliate()
    getCampaignData()
  }, [])

  const handleCheckboxChange = (type) => {
    setFormData({
      ...formData,
      event_type: type === formData.selectedType ? "" : type,
    });
  };

  const handleAmountTypeChange = (amount_type) => {
    setFormData({
      ...formData,
      amount_type,
    });
  };

  const handlePaymentTimeFrameChange = (e) => {
    setFormData({
      ...formData,
      date: e.target.value,
    });
  };

  // const handleAdditionalOptionChange = (option) => {
  //   setFormData({
  //     ...formData,
  //     time_frame_type: formData.selectedAdditionalOption === option ? "" : option,
  //   });
  // };

  return (
    <>
      <Layout handleKeyPress={undefined} setFilter={undefined} reset={undefined} filter={undefined} name="Commissions" filters={undefined}>
        <div className="">
          <div className="sidebar-left-content">
            <div className='top_bar_btns'>
              <div className=' row'>

                <div className='col-md-12'>
                  <div className='d-flex justify-content-end'>
                    <div className='btnbtn '>
                      <button className='btn btn-primary d-flex align-items-center' onClick={handleSave}> <i className="fa fa-check mr-2" aria-hidden="true"></i> Save Payment</button>
                    </div>
                  </div>
                </div>

              </div>

              <div className=' row mt-4'>
                <div className='col-12 col-sm-12 col-md-6 col-lg-3 col-xl-3 mb-3'>
                  <div className='fixi-ic'>
                    <div className='d-flex align-items-center'>
                      <img className='fixi-boxx-commsion' src='/assets/img/1.png' alt=''></img>
                      <div className='ml-2 addcomminson'>
                        <p className='revuh m-0'>Payment For</p>
                        <h3 className='dollars-t'>Select type of event</h3>
                      </div>
                    </div>

                  </div>

                  {["lead", "purchase"].map((type, index) => (
                    <div className="col-md-12" key={index}>
                      <div className='checkbox_ipt'>
                        <div className="checkboxes__row">
                          <div className="checkboxes__item">
                            <label className="checkbox style-h">
                              <input
                                type="checkbox"
                                onChange={() => handleCheckboxChange(type)}
                                checked={type === formData?.event_type}
                              />
                              <div className="checkbox__checkmark d-none"></div>
                              <div className="checkbox__body">{methodModel.capitalizeFirstLetter(type)}</div>
                            </label>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                  {errors && !formData?.event_type ? <div className="invalid-feedback d-block">Type is Required</div> : <></>}

                </div>

                <div className='col-12 col-sm-12 col-md-6 col-lg-3 col-xl-3 mb-3'>
                  <div className='fixi-ic '>
                    <div className='d-flex align-items-center'>
                      <img className='fixi-boxx-commsion' src='/assets/img/2.png' alt=''></img>
                      <div className='ml-2 addcomminson'>
                        <p className='revuh m-0'>How Much</p>
                        <h3 className='dollars-t'>Percentage or amount</h3>
                      </div>
                    </div>
                  </div>

                  <div className='row'>
                    <div className='col-md-12'>
                      <div className='checkbox_ipt mt-0'>
                        <div className="">
                          <div className="">
                            <label className="w-100">
                              <input
                                className="form-control"
                                type="text"
                                placeholder="0"
                                name="amount"
                                value={formData.amount}
                                onChange={(e) => {
                                  const enteredValue = e.target.value;
                                  const regex = /^[0-9]*$/;
                                  if (enteredValue === '' || regex.test(enteredValue)) {
                                    setFormData({ ...formData, amount: enteredValue });
                                  }
                                }}
                              />
                            </label>
                          </div>
                        </div>
                      </div>
                    </div>

                    {formData?.event_type != 'lead' && <div className='col-md-12'>
                      <div className='checkbox_ipt'>
                        <div className="checkboxes__row">
                          <div className="checkboxes__item">
                            <label className="checkbox style-h">
                              <input
                                type="radio"
                                name="amountType"
                                onChange={() => handleAmountTypeChange('percentage')}
                                checked={formData.amount_type === "percentage"}
                              />
                              <div className="checkbox__checkmark d-none"></div>
                              <div className="checkbox__body blue">Percentage</div>
                            </label>
                          </div>
                        </div>
                      </div>
                    </div>}

                    <div className='col-md-12'>
                      <div className='checkbox_ipt'>
                        <div className="checkboxes__row">
                          <div className="checkboxes__item">
                            <label className="checkbox style-h">
                              <input
                                type="radio"
                                name="amountType"
                                onChange={() => handleAmountTypeChange('amount')}
                                checked={formData.amount_type === "amount"}
                              />
                              <div className="checkbox__checkmark d-none"></div>
                              <div className="checkbox__body blue">Amount</div>
                            </label>
                            {errors && !formData?.amount_type ? <div className="invalid-feedback d-block">Amount Type is Required</div> : <></>}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className='col-12 col-sm-12 col-md-6 col-lg-3 col-xl-3 mb-3'>
                  <div className='fixi-ic'>
                    <div className='d-flex align-items-center'>
                      <img className='fixi-boxx-commsion' src='/assets/img/3.png' alt=''></img>
                      <div className='ml-2 addcomminson'>
                        <p className='revuh m-0'>When</p>
                        <h3 className='dollars-t'>Payment time-frame</h3>
                      </div>
                    </div>
                  </div>

                  <div className='row'>
                    <div className='col-md-12'>
                      <div className='checkbox_ipt position-relative'>
                        <div className='slect_drop'>

                          <input
                            type='date'
                            className='form-control'
                            onChange={handlePaymentTimeFrameChange}
                            value={formData.date || ""}
                            min={getCurrentDate()}
                          />

                          {/* <select
                            className='form-control'
                            onChange={handlePaymentTimeFrameChange}
                            value={formData.time_frame || ""}
                          >
                            <option value="">select</option>
                            <option value="0">Immediately, no delay</option>
                            <option value="1">1 day after purchase</option>
                            <option value="2">2 days after purchase</option>
                            <option value="2">3 days after purchase</option>
                            <option value="3">4 days after purchase</option>
                          </select> */}

                          {/* {formData.time_frame_type !== "day" ? <select
                            className='form-control'
                            onChange={handlePaymentTimeFrameChange}
                            value={formData.time_frame || ""}
                          >
                            <option value="">select</option>
                            <option value="0">Immediately, no delay</option>
                            <option value="1">1 month after purchase</option>
                            <option value="2">2 months after purchase</option>
                            <option value="3">3 months after purchase</option>
                          </select> :
                            <select
                              className='form-control'
                              onChange={handlePaymentTimeFrameChange}
                              value={formData.time_frame || ""}
                            >
                              <option value="">select</option>
                              <option value="0">Immediately, no delay</option>
                              <option value="1">1 day after purchase</option>
                              <option value="2">2 days after purchase</option>
                              <option value="2">3 days after purchase</option>
                              <option value="3">4 days after purchase</option>
                            </select>
                          } */}
                          {errors && !formData?.date ? <div className="invalid-feedback d-block">Date is Required</div> : <></>}
                        </div>
                      </div>
                    </div>

                    {/* <div className='col-md-12'>
                      <div className='checkbox_ipt'>
                        <div className="checkboxes__row">
                          <div className="checkboxes__item">
                            <label className="checkbox style-h">
                              <input
                                type="checkbox"
                                onChange={() => handleAdditionalOptionChange("day")}
                                checked={formData.time_frame_type === "day"}
                              />
                              <div className="checkbox__checkmark d-none"></div>
                              <div className="checkbox__body orange">Day</div>
                            </label>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className='col-md-12'>
                      <div className='checkbox_ipt'>
                        <div className="checkboxes__row">
                          <div className="checkboxes__item">
                            <label className="checkbox style-h">
                              <input
                                type="checkbox"
                                onChange={() => handleAdditionalOptionChange("month")}
                                checked={formData.time_frame_type === "month"}
                              />
                              <div className="checkbox__checkmark d-none"></div>
                              <div className="checkbox__body orange">Month</div>
                            </label>
                          </div>
                        </div>
                      </div>
                    </div> */}
                  </div>
                  {/* {errors && !formData?.time_frame_type ? <div className="invalid-feedback d-block">Time Frame Type is Required</div> : <></>} */}
                </div>


                <div className='col-12 col-sm-12 col-md-6 col-lg-3 col-xl-3 mb-3'>
                  <div className='fixi-ic'>
                    <div className='d-flex align-items-center'>
                      <img className='fixi-boxx-commsion' src='/assets/img/4.png' alt=''></img>
                      <div className='ml-2 addcomminson'>
                        <p className='revuh m-0'>Who</p>
                        <h3 className='dollars-t'>Choose Campaign</h3>
                      </div>
                    </div>
                  </div>

                  <div className='row'>
                    <div className='col-md-12'>
                      <div className='checkbox_ipt position-relative'>
                        <div className='slect_drop'>
                          <select
                            className='form-control'
                            onChange={(e) => {
                              const selectedValue = e.target.value;
                              // const selectedOption = e.target.options[e.target.selectedIndex];
                              setFormData({ ...formData, campaign: selectedValue });

                              // if (selectedOption.dataset.group == "true") {
                              //   setFormData({ ...formData, affiliate_group: selectedValue, affiliate_id: null });
                              // } else {
                              //   setFormData({ ...formData, affiliate_group: null, affiliate_id: selectedValue });
                              // }
                            }}
                            value={formData.campaign || formData.campaign || ""}
                          >
                            <option value=""  style={{ color: "black" }}>Select an Campaign</option>
                            {CampaignData?.map((itm, index) => (
                              <option key={`group_${index}`} value={itm?.id} data-group>
                                {itm?.name}
                              </option>
                            ))}
                            {/* <option value="" disabled style={{ color: "black" }}>Select affiliate</option>
                            {affiliate.map((itm, index) => (
                              <option key={`affiliate_${index}`} value={itm?.id}>
                                {itm?.fullName}
                              </option>
                            ))} */}
                          </select>
                          {(errors && !formData?.campaign) ? (
                            <div className="invalid-feedback d-block">Campaign is Required</div>
                          ) : (
                            <></>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className='col-md-12'>
                      <div className='checkbox_ipt position-relative'>
                        <div className='addfile_commison'>
                          <Link href="/campaign" className='m-0'
                          //  data-bs-toggle="modal" 
                          //  data-bs-target="#comminsion"
                          > <img className='w28' src='../assets/img/plus-p.png' /> Add New Campaign</Link>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>


        {/* modal commison add  */}
        {/* <div className="modal fade" id="comminsion" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="exampleModalLabel">Add Commisson</h5>
                <button type="button" className="close" data-bs-dismiss="modal" aria-label="Close">
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div className="modal-body">
                <div className='row'>
                  <div className='col-md-6'>
                    <div className='form-group'>
                      <label>Name</label>
                      <input type="text" className='form-control' />
                    </div>
                  </div>

                  <div className='col-md-6'>
                    <div className='form-group'>
                      <label>Name</label>
                      <input type="text" className='form-control' />
                    </div>
                  </div>


                  <div className='col-md-6'>
                    <div className='form-group'>
                      <label>Name</label>
                      <input type="text" className='form-control' />
                    </div>
                  </div>

                  <div className='col-md-6'>
                    <div className='form-group'>
                      <label>Name</label>
                      <input type="text" className='form-control' />
                    </div>
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-primary">Save </button>
              </div>
            </div>
          </div>
        </div> */}




      </Layout>
    </>
  );
}
