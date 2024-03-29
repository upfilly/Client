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

  const [errors, setError] = useState(false)
  const [formData, setFormData] = useState({
    "event_type": "",
    "amount_type": "",
    "amount": '',
    "affiliate_group": "",
    "time_frame_type": '',
    "time_frame": '',
    "affiliate_id": "",
  });

  const handleAffiliateGroup = () => {

    ApiClient.get('affiliate-groups', { status: "active" }).then(res => {

      if (res.success == true) {
        setAffiliategroup(res?.data?.data)
      }
    })
  }

  const handleAffiliate = () => {

    ApiClient.get('users/list', { status: "active" ,role: "affiliate",createBybrand_id: user?.id, }).then(res => {

      if (res.success == true) {
        setAffiliate(res?.data?.data)
      }
    })
  }

  const handleSave = () => {

    if (!formData?.event_type || !formData?.time_frame_type || !formData?.time_frame || !formData?.amount_type) {
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

  useEffect(() => {
    handleAffiliateGroup()
    handleAffiliate()
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
      time_frame: e.target.value,
    });
  };

  const handleAdditionalOptionChange = (option) => {
    setFormData({
      ...formData,
      time_frame_type: formData.selectedAdditionalOption === option ? "" : option,
    });
  };



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
                <div className='col-md-3 mb-3'>
                  <div className='fixi-ic'>
                    <div className='d-flex align-items-center'>
                      <img className='fixi-boxx-commsion' src='/assets/img/1.png' alt=''></img>
                      <div className='ml-2 addcomminson'>
                        <p className='revuh m-0'>Payment For</p>
                        <h3 className='dollars-t'>Select type of event</h3>
                      </div>
                    </div>

                  </div>

                  {["lead", "visitor" , "purchase" ,"line-item"].map((type, index) => (
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

                <div className='col-md-3 mb-3'>
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
                      <div className='checkbox_ipt'>
                        <div className="">
                          <div className="">
                            <label className="">
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

                    <div className='col-md-12'>
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
                    </div>

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

                <div className='col-md-3 mb-3'>
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
                          {formData.time_frame_type !== "day" ? <select
                            className='form-control'
                            onChange={handlePaymentTimeFrameChange}
                            value={formData.time_frame || ""}
                          >
                            <option value="">select</option>
                            <option value="0">Immediately, no delay</option>
                            <option value="1">1 month after purchase</option>
                            <option value="2">2 month after purchase</option>
                            <option value="3">3 month after purchase</option>
                          </select>:
                          <select
                          className='form-control'
                          onChange={handlePaymentTimeFrameChange}
                          value={formData.time_frame || ""}
                        >
                          <option value="">select</option>
                          <option value="0">Immediately, no delay</option>
                          <option value="1">1 day after purchase</option>
                          <option value="2">2 day after purchase</option>
                          <option value="2">3 day after purchase</option>
                          <option value="3">4 day after purchase</option>
                        </select>
                          }
                          {errors && !formData?.time_frame ? <div className="invalid-feedback d-block">Time Frame is Required</div> : <></>}
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
                    </div>
                  </div>
                  {errors && !formData?.time_frame_type ? <div className="invalid-feedback d-block">Time Frame Type is Required</div> : <></>}
                </div>


                <div className='col-md-3 mb-3'>
                  <div className='fixi-ic'>
                    <div className='d-flex align-items-center'>
                      <img className='fixi-boxx-commsion' src='/assets/img/4.png' alt=''></img>
                      <div className='ml-2 addcomminson'>
                        <p className='revuh m-0'>Who</p>
                        <h3 className='dollars-t'>Choose affilate group</h3>
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
                              const selectedOption = e.target.options[e.target.selectedIndex];
                              console.log(selectedOption.dataset,"jbdchdbchj")

                              if (selectedOption.dataset.group == "true") {
                                setFormData({ ...formData, affiliate_group: selectedValue, affiliate_id: null });
                              } else {
                                setFormData({ ...formData, affiliate_group: null, affiliate_id: selectedValue });
                              }
                            }}
                            value={formData.affiliate_group || formData.affiliate_id || ""}
                          >
                            <option value="" disabled style={{ color: "black" }}>Select an affiliate group</option>
                            {affiliateGroup.map((itm, index) => (
                              <option key={`group_${index}`} value={itm?.id} data-group>
                                {itm?.group_name}
                              </option>
                            ))}
                            <option value="" disabled style={{ color: "black" }}>Select affiliate</option>
                            {affiliate.map((itm, index) => (
                              <option key={`affiliate_${index}`} value={itm?.id}>
                                {itm?.fullName}
                              </option>
                            ))}
                          </select>
                          {(errors && !formData?.affiliate_group && !formData?.affiliate_id) ? (
                            <div className="invalid-feedback d-block">Affiliate or Affiliate group is Required</div>
                          ) : (
                            <></>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className='col-md-12'>
                      <div className='checkbox_ipt position-relative'>
                        <div className='addfile_commison'>
                          <Link href="/group/add" className='m-0'
                          //  data-bs-toggle="modal" 
                          //  data-bs-target="#comminsion"
                          > <img className='w28' src='../assets/img/plus-p.png' /> Add new Affiliate Group</Link>
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
