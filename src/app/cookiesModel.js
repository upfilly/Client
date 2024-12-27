import React, { useState } from 'react';
import Cookies from 'js-cookie';
import Modal from 'react-bootstrap/Modal';

const CookiesPopup = () => {
    const [accepted, setAccepted] = useState(!Cookies.get('cookiesAccepted'));
    const [show, setShow] = useState(true);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const handleAcceptCookies = () => {
        Cookies.set('cookiesAccepted', true, { expires: 365 });
        setAccepted(false);
        handleClose()
    };

    if (!accepted) {
        return null; 
    }



    return (
        <>
        <Modal className='cokkiesmodal' show={show} onHide={handleClose}>
        <Modal.Body>
        <div className=" text-center d-flex align-items-center justify-content-between px-5">
            <div className='text-left gap-4 d-flex align-items-center'>
            <img src='../assets/img/cookies.png' className='cokkeimg' />
            <p className='mt-3 bolding'>This website uses cookies to ensure you get the best experience on our website.</p>
            </div>
           <div className='d-flex justify-content-between align-items-center flex-column gap-2'>
           <button className='cokkiebtns mr-10' onClick={handleAcceptCookies}>Accept Cookies</button>
            <button className='cokkiebtnsdeny ' onClick={handleClose}>Deny </button>
           </div>
        </div>

        </Modal.Body>
       
      </Modal>
      </>


        
    );
};

export default CookiesPopup;
