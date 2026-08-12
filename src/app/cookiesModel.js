import React, { useState, useEffect } from 'react';
import Cookies from 'js-cookie';

const CookiesPopup = () => {
    const [accepted, setAccepted] = useState(true); // Default true to avoid hydration mismatch, then check in useEffect
    const [show, setShow] = useState(false);

    useEffect(() => {
        if (!Cookies.get('cookiesAccepted')) {
            setAccepted(false);
            setTimeout(() => setShow(true), 500); // Small delay for smooth entrance
        }
    }, []);

    const handleAcceptCookies = () => {
        Cookies.set('cookiesAccepted', 'true', { expires: 365 });
        setShow(false);
        setTimeout(() => setAccepted(true), 400); // Wait for exit animation
    };

    const handleDeclineCookies = () => {
        Cookies.set('cookiesAccepted', 'false', { expires: 365 });
        setShow(false);
        setTimeout(() => setAccepted(true), 400); // Wait for exit animation
    };

    if (accepted) {
        return null; 
    }

    return (
        <div className={`modern-cookie-banner ${show ? 'show' : ''}`}>
            <div className="cookie-content">
                <div className="cookie-icon-wrapper">
                    <span className="cookie-icon">🍪</span>
                </div>
                <div className="cookie-text">
                    <h4>We value your privacy</h4>
                    <p>We use cookies to enhance your browsing experience, serve personalized ads or content, and analyze our traffic. By clicking "Accept All", you consent to our use of cookies.</p>
                </div>
            </div>
            <div className="cookie-actions">
                <button className="cookie-btn-decline" onClick={handleDeclineCookies}>Decline</button>
                <button className="cookie-btn-accept" onClick={handleAcceptCookies}>Accept All</button>
            </div>
        </div>
    );
};

export default CookiesPopup;
