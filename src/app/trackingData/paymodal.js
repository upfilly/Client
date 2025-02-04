import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

const PaymentModal = ({showModal, setShowModal,calculatedAmount, setCalculatedAmount,handleShow,handleClose}) => {

  return (
    <div>
      {/* Pay Now Button */}
      <div 
        className="btn btn-primary mr-2" 
        onClick={handleShow}>
        Pay Now
      </div>

      {/* Modal */}
      <div 
        className={`modal fade ${showModal ? 'show' : ''}`} 
        tabIndex="-1" 
        aria-labelledby="paymentModal" 
        aria-hidden="true" 
        style={{ display: showModal ? 'block' : 'none' }}>
        
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="paymentModal">Payment Details</h5>
              <button type="button" className="btn-close" onClick={handleClose}></button>
            </div>
            <div className="modal-body">
              <p>Your calculated amount to pay is: <strong>${calculatedAmount}</strong></p>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" onClick={handleClose}>Close</button>
              <button type="button" className="btn btn-primary">Confirm Payment</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentModal;
