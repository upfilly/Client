import React, { useState } from 'react';
import Cookies from 'js-cookie';

const CookiesPopup = () => {
    const [accepted, setAccepted] = useState(!Cookies.get('cookiesAccepted'));

    const handleAcceptCookies = () => {
        Cookies.set('cookiesAccepted', true, { expires: 365 });
        setAccepted(false);
    };

    if (!accepted) {
        return null; 
    }

    return (
        <div className="cookies-popup text-center">
            <img src='../assets/img/cookies.png' className='cokkeimg' />
            <p className='mt-3'>This website uses cookies to ensure you get the best experience on our website.</p>
            <button className='btn-sm' onClick={handleAcceptCookies}>Accept Cookies</button>
        </div>
    );
};

export default CookiesPopup;
