import ApiClient from '@/methods/api/apiClient';
import React from 'react';
import { Modal, Button } from 'react-bootstrap';
import { toast } from 'react-toastify';

const PaymentModal = ({ showModal, setShowModal, calculatedAmount, handleShow, handleClose, associateId ,user ,upfillyAmount}) => {

    const payToAdmin = () => {
        ApiClient.post('pay/commission/to/admin', { commission: calculatedAmount?.toFixed(2), brandAssociateId: associateId }).then((res) => {
            if (res.success) {
                window.open(res.data.url, "_self")
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
          {/* Display the calculated amount */}
          <p>Your calculated amount to pay is: <strong>${calculatedAmount?.toFixed(2)}</strong></p>
          
          {/* Show additional commission details if they exist */}
            <div>
              <h5>Other Commission Values:</h5>
              <ul>
                  <li>
                    Upfilly Commission: <strong>{user?.plan_id?.commission_override}% = {upfillyAmount?.toFixed(2)}$</strong>
                  </li>
              </ul>
            </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>Close</Button>
          <Button variant="primary" onClick={payToAdmin}>Confirm Payment</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default PaymentModal;
