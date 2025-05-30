import React, { useState } from 'react';
import PropTypes from 'prop-types';

const LegalTerms = ({ onAcceptTerms }) => {
  const [isAgreed, setIsAgreed] = useState(false);
  const legalText = `
    AFFILIATE PROGRAM AGREEMENT
    PLEASE READ THE ENTIRE AGREEMENT.
    YOU MAY PRINT THIS PAGE FOR YOUR RECORDS.
    THIS IS A LEGAL AGREEMENT BETWEEN YOU AND MERCHANT.COM).
    Please read the terms and conditions of this affiliate program agreement carefully before you join our program or begin marketing our program. These terms and conditions are written in plain language intentionally avoiding legalese to ensure that they may be clearly understood and followed by affiliates. Each Affiliate is responsible for assuring that its employees, agents and contractors comply with this agreement. 
    BY SUBMITTING THE ONLINE APPLICATION TO JOIN OUR AFFILIATE PROGRAM, YOU ARE AGREEING THAT YOU HAVE READ AND UNDERSTAND THE TERMS AND CONDITIONS OF THIS AGREEMENT AND THAT YOU AGREE TO BE LEGALLY RESPONSIBLE FOR EACH AND EVERY TERM AND CONDITION.
    DEFINITIONS
    As used in these terms and conditions: (i) "We", "us", or "our" refers to MERCHANT and our website; (ii) "you" or "your" refers to the Affiliate; (iii) "our website" refers to the MERCHANT.COM website located at www.merchant.com; (iv) "your website" refers to any websites that you will link to our website; (v) "Program" refers to the MERCHNAT Affiliate Program.
    AFFILIATE OBLIGATIONS
    ENROLLMENT
    To begin the enrollment process, you will complete and submit the online application at the Awin.com server. After receiving your application, we will review your website and notify you of your acceptance or rejection into our Program. Please allow up 48 hours for your application to be reviewed. 
    We reserve the right to reject any application for any reason, however we encourage you to contact us if you feel we have made an incorrect decision. Including all of the websites that you use in your profile will help us make a better decision.
    WEBSITE RESTRICTIONS
    Your participating website(s) may not:
    1. Infringe on our or any anyone else's intellectual property, publicity, privacy or other rights.
    2. Violate any law, rule or regulation.
    3. Contain any content that is threatening, harassing, defamatory, obscene, harmful to minors, or contains nudity, pornography or sexually explicit materials.
    4. Contain any viruses, Trojan horses, worms, time bombs, cancelbots, or other computer programming routines that are intended to damage, interfere with, surreptitiously intercept or expropriate any system, data, or personal information.
    5. Contain software or use technology that attempts to intercept, divert or redirect Internet traffic to or from any other website, or that potentially enables the diversion of affiliate commissions from another website. This includes toolbars, browser plug-ins, extensions and add-ons.
    [Content continues...]
  `;

  return (
   //  <div className="container-fluid h-100">
      <div className="row h-100 terms-textarea">
        <div className="col-12 d-flex flex-column">
          <div className="alert alert-warning mb-3">
            <strong>PLEASE NOTE:</strong> The following legal terms are only meant to be used as a guide. Should you wish to use part or any of the below terms, Upfilly.com cannot be held legally responsible for any potential revenue loss, legal disputes, or other liabilities that may arise. For any legal usage or implementation, we strongly recommend consulting with a qualified legal professional to ensure compliance with applicable laws and regulations.
            <br /><br />
            Should you wish to use any part or the whole of the following agreement, replace MERCHANT and MERCHANT.COM with your information.
          </div>
          
          <div className="flex-grow-1 mb-3">
            <textarea 
              className="form-control" 
              defaultValue={legalText}
              rows="25"
              style={{ 
                fontFamily: 'Arial, sans-serif',
                fontSize: '14px',
                lineHeight: '1.6'
              }}
            />
          </div>
          
          <div className="form-check">
            <input
              className="form-check-input"
              type="checkbox"
              id="agreeTerms"
              onChange={(e) => {
                setIsAgreed(!isAgreed);
                onAcceptTerms(e.target.checked);
              }}
            />
            <label className="form-check-label" htmlFor="agreeTerms">
              I agree to the terms and conditions
            </label>
          </div>
        </div>
      </div>
   //  </div>
  );
};

LegalTerms.propTypes = {
  onAcceptTerms: PropTypes.func.isRequired,
};

export default LegalTerms;