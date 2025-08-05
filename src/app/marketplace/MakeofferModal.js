import React, { useEffect, useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import SelectDropdown from '../components/common/SelectDropdown';
import ApiClient from '@/methods/api/apiClient';
import crendentialModel from '@/models/credential.model';
import { toast } from 'react-toastify';
import loader from '@/methods/loader';

const OfferFormModal = ({getProductData, modalIsOpen, setModalIsOpen, id, affiliateName }) => {
  const user = crendentialModel.getUser()
  const [form, setform] = useState({
    "name": "",
    // "sent_to": "",
    // "sent_from": "",
    // "description": "",
    "comments": "",
    // "product_id": id,
    // "affiliate_id": ""
  })
  const [affiliateData, setAffiliateData] = useState();
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if ( !form?.comments) {
      setSubmitted(true)
      return;
    }
    loader(true)
    let method = 'post'
    let url = 'make-offer'

    let value = {
      ...form,
      name:user?.fullName,
      brand_id:user?.id || user?._id,
      product_id: id
    }

    // loader(true)
    ApiClient.allApi(url, value, method).then(res => {
      if (res.success) {
        toast.success(res.message)
        setModalIsOpen(false)
        setform({
          "name": "",
          "comments": "",
        })
      }
      getProductData(id)
      loader(false)
    })
  };

  // const getData = () => {
  //   let url = 'users/list'
  //   ApiClient.get(url, { role: "affiliate", createBybrand_id: user?.id, }).then(res => {
  //     if (res.success) {
  //       const data1 = res.data.data.filter(item => item.status === "active");
  //       setAffiliateData(data1)
  //     }
  //   })
  // }

  const getData = (p = {}) => {
    let url = 'getallaffiliatelisting'
    ApiClient.get(url).then(res => {
        if (res.success) {
            const data = res.data
            const filteredData = data.filter(item => item !== null);
            const manipulateData = filteredData.map((itm)=>{return{
                name:itm?.userName || itm?.firstName , id : itm?.id || itm?._id
            }})
            setAffiliateData(manipulateData)
        }
    })
}

  useEffect(() => {
    getData()
  }, [])

  return (
    <div>
      {/* <Button variant="primary" onClick={() => setModalIsOpen(true)}>
       Make Offer
      </Button> */}
      <Modal show={modalIsOpen} onHide={() => setModalIsOpen(false)}>
        <Modal.Header closeButton className='align-items-center'>
          <Modal.Title>Send Offer</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group className='mb-3 d-flex justify-content-between width_label flex-wrap gap-2' controlId="formBasicEmail">
              <Form.Label className='mb-0'>Sender Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter name"
                value={form?.name || user?.fullName}
                onChange={(e) => setform({ ...form, name: e.target.value })}
                required
              />
              {submitted && !form?.name ? <div className="invalid-feedback d-block">Name is Required</div> : <></>}
            </Form.Group>

            <Form.Group className='mb-3 d-flex justify-content-between width_label flex-wrap gap-2' controlId="formBasicEmail">
              <Form.Label className='mb-0'>Reciever Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter name"
                value={affiliateName || user?.fullName}
                onChange={(e) => setform({ ...form, name: e.target.value })}
                disabled
              />
            </Form.Group>

            {/* <Form.Group className='mb-3 d-flex justify-content-between width_label flex-wrap gap-2' controlId="formBasicName">
              <Form.Label>Send To</Form.Label>
              <Form.Control
                type="email"
                placeholder="Enter email"
                value={form?.sent_to}
                onChange={(e) => setform({...form,sent_to:e.target.value})}
                required
              />
            </Form.Group> */}

            {/* <Form.Group className='mb-3 d-flex justify-content-between width_label flex-wrap gap-2' controlId="formBasicName">
              <Form.Label>Send From</Form.Label>
              <Form.Control
                type="email"
                placeholder="Enter email"
                value={form?.sent_from}
                onChange={(e) => setform({...form,sent_from:e.target.value})}
                required
              />
            </Form.Group> */}

            {/* <Form.Group className='mb-3 d-flex justify-content-between width_label flex-wrap gap-2 selectlabel'  controlId="formBasicText">
              <Form.Label>Select affiliate</Form.Label>
            <SelectDropdown                                                     theme='search'
              id="statusDropdown"
              className="w-100"
              displayValue="fullName"
              placeholder="Select Affiliate"
              intialValue={form?.affiliate_id}
              result={e => {
                setform({ ...form, affiliate_id: e.value })
              }}
              options={affiliateData}
            /></Form.Group> */}

            <Form.Group className='mb-3 d-flex justify-content-between width_label flex-wrap gap-2 selectlabel' controlId="formBasicText">
              <Form.Label className='mb-0'>comments</Form.Label>
              <Form.Control
                as="textarea"
                className='rounded-4'
                rows={3}
                cols={6}
                placeholder="Enter text"
                value={form?.comments}
                onChange={(e) => setform({ ...form, comments: e.target.value })}
                required
              />
              {submitted && !form?.comments ? <div className="invalid-feedback d-block">Comments is Required</div> : <></>}
            </Form.Group>

            <div className='d-flex align-items-center justify-content-end'>
              <Button variant="primary" type="submit">
                Submit
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default OfferFormModal;
