import React, { useEffect, useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import SelectDropdown from '../components/common/SelectDropdown';
import ApiClient from '@/methods/api/apiClient';
import crendentialModel from '@/models/credential.model';
import { toast } from 'react-toastify';
import loader from '@/methods/loader';

const OfferFormModal = ({ getProductData, modalIsOpen, setModalIsOpen, id, affiliateName }) => {
  const user = crendentialModel.getUser()
  const [form, setform] = useState({
    "name": "",
    "comments": "",
  })
  const [affiliateData, setAffiliateData] = useState();
  const [campaignData, setCampaignData] = useState();
  const [submitted, setSubmitted] = useState(false)
  const [hasDefaultCampaign, setHasDefaultCampaign] = useState(false)

  useEffect(() => {
    if (user) {
      getCampaignData({ isArchive: false });
    }
  }, []);

  const getCampaignData = (p = {}) => {
    let filter = {
      isDeleted: false,
      status: "",
      brand_id: user?.id, ...p
    };
    let url = "campaign/brand/all";
    ApiClient.get(url, filter).then((res) => {
      if (res.success) {
        // Check if there's a default campaign
        const defaultCampaign = res.data.data.find(item => item.isDefault);

        if (defaultCampaign) {
          setHasDefaultCampaign(true);
          setCampaignData(defaultCampaign);
        } else {
          setHasDefaultCampaign(false);
          setCampaignData(null);
        }
      }
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check if default campaign exists
    if (!hasDefaultCampaign) {
      toast.error("You need to create a default campaign before making an offer");
      return;
    }

    if (!form?.comments) {
      setSubmitted(true)
      return;
    }

    loader(true)
    let method = 'post'
    let url = 'make-offer'

    let value = {
      ...form,
      name: user?.fullName,
      brand_id: user?.id || user?._id,
      product_id: id,
      campaign_id: campaignData?.id // Include campaign ID in the offer
    }

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

  const getData = (p = {}) => {
    let url = 'getallaffiliatelisting'
    ApiClient.get(url).then(res => {
      if (res.success) {
        const data = res.data
        const filteredData = data.filter(item => item !== null);
        const manipulateData = filteredData.map((itm) => {
          return {
            name: itm?.userName || itm?.firstName, id: itm?.id || itm?._id
          }
        })
        setAffiliateData(manipulateData)
      }
    })
  }

  useEffect(() => {
    getData()
  }, [])

  return (
    <div>
      <Modal show={modalIsOpen} onHide={() => setModalIsOpen(false)}>
        <Modal.Header closeButton className='align-items-center'>
          <Modal.Title>Send Offer</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {!hasDefaultCampaign && (
            <div className="alert alert-danger">
              You need to create a default campaign before you can make an offer.
            </div>
          )}

          <Form onSubmit={handleSubmit}>
            <Form.Group className='mb-3 d-flex justify-content-between width_label flex-wrap gap-2' controlId="formBasicEmail">
              <Form.Label className='mb-0'>Sender Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter name"
                value={form?.name || user?.fullName}
                onChange={(e) => setform({ ...form, name: e.target.value })}
                required
                disabled={!hasDefaultCampaign}
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

            <Form.Group className='mb-3 d-flex justify-content-between width_label flex-wrap gap-2 selectlabel' controlId="formBasicText">
              <Form.Label className='mb-0'>Comments</Form.Label>
              <Form.Control
                as="textarea"
                className='rounded-4'
                rows={3}
                cols={6}
                placeholder="Enter text"
                value={form?.comments}
                onChange={(e) => setform({ ...form, comments: e.target.value })}
                required
                disabled={!hasDefaultCampaign}
              />
              {submitted && !form?.comments ? <div className="invalid-feedback d-block">Comments is Required</div> : <></>}
            </Form.Group>

            <div className='d-flex align-items-center justify-content-end'>
              <Button
                variant="primary"
                type="submit"
                disabled={!hasDefaultCampaign}
              >
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