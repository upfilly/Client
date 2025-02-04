import ApiClient from '@/methods/api/apiClient';
import React from 'react';
import { Modal, Button } from 'react-bootstrap';
import { toast } from 'react-toastify';

const PaymentModal = ({ showModal, setShowModal, calculatedAmount, handleShow, handleClose ,associateId}) => {

    const payToAdmin = () => {
        ApiClient.post('pay/commission/to/admin', { commission:calculatedAmount , brandAssociateId:associateId}).then((res) => {
            if (res.success) {
                
            }
        });
    }

  return (
    <div>

      <Modal show={showModal} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>Payment Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Your calculated amount to pay is: <strong>${calculatedAmount?.toFixed(2)}</strong></p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>Close</Button>
          <Button variant="primary" onClick={()=>payToAdmin()}>Confirm Payment</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default PaymentModal;
