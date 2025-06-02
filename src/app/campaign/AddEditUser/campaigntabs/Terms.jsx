import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';

const LegalTerms = ({ onAcceptTerms,
  isAgreed,
  setIsAgreed,
  legalTerm,
  setlegalTerm
}) => {
  const legalText = `
   AFFILIATE PROGRAM AGREEMENT
PLEASE READ THE ENTIRE AGREEMENT.
YOU MAY PRINT THIS PAGE FOR YOUR RECORDS.
THIS IS A LEGAL AGREEMENT BETWEEN YOU AND MERCHANT.COM).
Please read the terms and conditions of this affiliate program agreement carefully before you join our program or begin marketing our program. These terms and conditions are written in plain language intentionally avoiding legalese to ensure that they may be clearly understood and followed by affiliates. Each Affiliate is responsible for assuring that its employees, agents and contractors comply with this agreement. 
BY SUBMITTING THE ONLINE APPLICATION TO JOIN OUR AFFILIATE PROGRAM, YOU ARE AGREEING THAT YOU HAVE READ AND UNDERSTAND THE TERMS AND CONDITIONS OF THIS AGREEMENT AND THAT YOU AGREE TO BE LEGALLY RESPONSIBLE FOR EACH AND EVERY TERM AND CONDITION.
DEFINITIONS
As used in these terms and conditions: (i) “We”, “us”, or “our” refers to MERCHANT and our website; (ii) “you” or “your” refers to the Affiliate; (iii) “our website” refers to the MERCHANT.COM website located at www.merchant.com; (iv) “your website” refers to any websites that you will link to our website; (v) “Program” refers to the MERCHNAT Affiliate Program.
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
LINKING TO OUR WEBSITE
Upon acceptance into the Program, links will be made available to you through the interface.  You will be able to review the Program's details and previously-published affiliate newsletters, download HTML code that provides for links to web pages within the our website and banner creatives, browse and get tracking codes for our coupons and deals. 
Your acceptance in our program means you agree to and abide by the following.
1. You will only use linking code we provide you for each banner, text link, or other affiliate link obtained from the affiliate interface without manipulation.
2. We reserve the right, at any time, to review your placement and approve the use of Your Links and require that you change the placement or use to comply with the guidelines provided to you.
3. All domains that use your affiliate link must be listed in your affiliate profile.
4. Your Website will not in any way copy, resemble, or mirror the look and feel of our Website. You will also not use any means to create the impression that your Website is our Website or any part of our Website including, without limitation, framing of our Website in any manner.
5. You may not engage in cookie stuffing or include pop-ups, false or misleading links on your website. In addition, wherever possible, you will not attempt to mask the referring url information (i.e. the page from where the click is originating).
6. Using redirects to bounce a click off of a domain from which the click did not originate in order to give the appearance that it came from that domain (also known as cloaking) is prohibited.
If you are found redirecting links to hide or manipulate their original source, your current and past commissions will be voided or your commission level will be set to 0%. This does not include using "out" redirects from the same domain where the affiliate link is placed.
7. The maintenance and the updating of your site will be your responsibility. We may monitor your site as we feel necessary to make sure that it is up-to-date and to notify you of any changes that we feel should enhance your performance.
8. It is entirely your responsibility to follow all applicable intellectual property and other laws that pertain to your site. You must have express permission to use any person's copyrighted material, whether it be a writing, an image, or any other copyrightable work. We will not be responsible (and you will be solely responsible) if you use another person's copyrighted material or other intellectual property in violation of the law or any third-party rights.
9. You will not, in connection with this Agreement, display or reference on your site, any trademark or logo of any third party seller appearing on our website unless you have an independent license for the display of such trademark or logo; use any data, images, text, or other information obtained by you from us or our website in connection with this Agreement only in a lawful manner and only in accordance with the terms of this Agreement.
10. We grant you a limited, nonexclusive, non-transferable, revocable right to use the graphic image and text solely for the purpose of you participating in the Program. You may not modify the graphic image or text in any way. All of our rights in the graphic image and text, any other images, our trade names and trademarks, and all other intellectual property rights are reserved. Should we decide to revoke your license, we will give you notice.
11. You acknowledge our ownership of our licensed materials, agree that you will not do anything inconsistent with our ownership and that all of your use of the licensed materials will inure to the benefit of, and on behalf of, the Program and, if requested, agree to assist us in recording this Agreement with appropriate government authorities. You agree that nothing is this Agreement gives you any right, title or interest in the licensed materials other than the right to use the licensed materials in accordance with this Agreement. You also agree that you will not attack the our title to the licensed materials or the validity of the Licensed Materials or this Agreement.
PPC GUIDELINES
PPC direct to site and use of brand terms on display URL and / or as search keywords, is strictly prohibited, unless given written permission by the merchant or it’s legal representatives. 
TRADEMARKED TERMS
The following list of trademarked terms should not be treated as an exhaustive list (but as a list of some of the prohibited terms):
Merchant, Merchant.com, www.merchant.com, merchant coupon, merchant  coupon code, merchant discount, merchant discount code, merchant promo, ,merchant promo code, Merchant sale, Merchant sales, Mechant deal, Merchant deals
COUPON GUIDELINES
If you are enrolled in our Program and your Website promotes coupon codes, you must adhere to our Coupon Guidelines as follows:
1. You may ONLY advertise coupon codes that are provided to you through the affiliate program.
2. Posting any information about how to work around the requirements of a coupon/promotion (i.e. first-time customers only) will result in removal from the program.
3. Coupons must be displayed in their entirety with the full offer, valid expiration date and code.
4. You may NOT advertise coupon codes obtained from our non-affiliate advertising, customer e-mails, paid search, or any other campaign.
5. You may NOT give the appearance that any ongoing offer requires clicking from your website in order to redeem. For example, if all items on the site have free shipping over $100, you may not turn this into an offer that infers that the customer must click from your site to get this deal.
SUB-AFFILIATE NETWORKS
Promoting us through a sub-affiliate network is permitted, however you must be completely transparent with regards to where traffic from your sub-affiliates originated. Sub-affiliate networks must ensure that all sub-affiliates promoting the Program adhere to our terms and conditions. This includes restrictions on advertising through toolbars, browser extensions, and through any paid placements such as a pay-per-click campaigns. Sub-affiliate networks must also receive approval prior to allowing any type of coupon sub-affiliate to promote the Program.
Failure to comply with our sub-affiliate network terms may result in a loss and/or reduction of commission from sales made through any sub-affiliate that does not comply with our terms.
DOMAIN NAMES
Use of any of our trademarked terms as part of the domain or sub-domain for your website is strictly prohibited.
OK - www.website.com/merhcnat
Not OK - merchant.website.com / www.merchant-coupons.com
ADVERTISING & PUBLICITY
You shall not create, publish, distribute, or print any written material that makes reference to our Program without first submitting that material to us and receiving our prior written consent. If you intend to promote our Program via e-mail campaigns, you must adhere to the following:
1. Abide by the CAN-SPAM Act of 2003 (Public Law No. 108-187) with respect to our Program.
2. E-mail must be sent on your behalf and must not imply that the e-mail is being sent on behalf of us.
3. E-mails must first be submitted to us for approval prior to being sent or we must be sent a copy of the e-mail.
SOCIAL MEDIA
Promotion on Facebook, Twitter, Instagram, YouTube and other social media platforms is permitted following these general guidelines:
1. You ARE allowed to promote offers to your own lists; more specifically, you're welcome to use your affiliate links on your own Facebook, Twitter, etc. pages. For example, You may post, '25% off sale at Merchant through Wednesday with code GET25'.
2. You ARE PROHIBITED from posting your affiliate links on our Facebook, Twitter, Pinterest, etc. accounts or company pages in an attempt to turn those links into affiliate sales.
3. You ARE PROHIBITED from running Facebook ads with our trademarked company name.
4. You ARE PROHIBITED from creating a social media account that includes our trademark/s in the page name and/or username.
OPERATIONS OUTSIDE THE UNITED STATES
If you are conducting business in or taking orders from persons in other countries, you will follow the laws of those countries. For example, you will comply with the European Union's Privacy and Electronic Communications Directive, as well as the General Data Protection Regulation (GDPR), if you are conducting business in or taking orders from persons in one or more of the European Union countries.
FTC DISCLOSURE REQUIREMENTS
You shall include a disclosure statement within any and all pages, blog/posts, or social media posts where affiliate links for our affiliate program are posted as an endorsement or review, and where it is not clear that the link is a paid advertisement. This disclosure statement should be clear and concise, stating that we are compensating you for your review or endorsement. If you received the product for free from us or from the affiliate management team for review, this also must be clearly stated in your disclosure.
* Disclosures must be made as close as possible to the claims.
* Disclosures should be placed above the fold; scrolling should not be necessary to find the disclosure. (e.g. Disclosure should be visible before the jump).
* Pop-up disclosures are prohibited.
For more information about FTC disclosure requirements, please review the FTC's "Dot Com Disclosures" Guidelines at http://www.ftc.gov/os/2013/03/130312dotcomdisclosures.pdf ; and the FTC's Endorsement Guidelines at http://business.ftc.gov/advertising-and-marketing/endorsements
MErchant RIGHTS AND OBLIGATIONS
We have the right to monitor your site at any time to determine if you are following the terms and conditions of this Agreement. We may notify you of any changes to your site that we feel should be made, or to make sure that your links to our web site are appropriate and to notify further you of any changes that we feel should be made. If you do not make the changes to your site that we feel are necessary, we reserve the right to terminate your participation in the Program.
We reserve the right to terminate this Agreement and your participation in the Program immediately and without notice to you should you commit fraud in your use of the Program or should you abuse this program in any way. If such fraud or abuse is detected, we shall not be liable to you for any commissions for such fraudulent sales.
This Agreement will begin upon our acceptance of your Affiliate application, and will continue unless terminated hereunder.
TERMINATION
1. Either you or we may end this Agreement AT ANY TIME, with or without cause, by utilizing the respective functionality of the affiliate platform. In addition, this Agreement will terminate immediately upon any breach of this Agreement by you.
2. Upon the termination of this Agreement for any reason, you will immediately cease use of, and remove from your site, all links to our website, and all of our trademarks, trade dress, and logos, and all other materials provided by or on behalf of us to you pursuant hereto or in connection with the Program.
3. You are eligible to earn commissions only on sales of qualifying products that occur during the term, and commissions earned through the date of termination will remain payable only if the related orders are not canceled or returned. We may withhold your final payment for a reasonable time to ensure that the correct amount is paid.
MODIFICATION
We may modify any of the terms and conditions in this Agreement at any time at our sole discretion. In such event, you will be notified by email. Modifications may include, but are not limited to, changes in the payment procedures and the Program rules. If any modification is unacceptable to you, your only option is to end this Agreement. Your continued participation in the Program following the posting of the change notice or new Agreement on our site will indicate your agreement to the changes.
PAYMENT
We use a third party to handle all of the tracking and payment. The third party is the Awin.com affiliate network. Kindly review the network's payment terms and conditions.
TRANSACTION LOCK DATES
All sales will remain in a 'sales pending period' and will not lock until the terms set forth within the locking period parameters of our Program. All locked payments will be processed by Awin after the(ir) lock date.
REVERSAL & COMMUNICATION POLICY
We take pride in our low reversal rate, which we attribute to open communication with our affiliates. However, we reserve the right to reverse orders due to order cancellations, duplicate tracking, returns, disputed charges, and program violations as outlined in these terms and conditions.
Additionally, if we ask you for clarification or more information on any orders or clicks that we suspect may be in violation of our terms and conditions, we expect that you will respond in a timely and honest manner. Below are violations of our communications policy.
1. You are not forthcoming, intentionally vague or are found to be lying.
2. You are not responsive within a reasonable time period and after multiple attempts to contact with information listed in your network profile.
3. You cannot substantiate or validate the source of your traffic to our program with clear and demonstrable proof.
4. If any of the above apply, then we reserve the absolute right to reverse orders, set your commission to 0% or suspend you from the program for the period or orders in question or terminate you from the program altogether. We know that many violations are a result of automated processes; however, it is incumbent upon each affiliate to ensure that it has the appropriate checks and balances in place to pro-actively address these issues and adhere to our program rules.
GRANT OF LICENSES
1. We grant to you a non-exclusive, non-transferable, revocable right to (i) access our site through HTML links solely in accordance with the terms of this Agreement and (ii) solely in connection with such links, to use our logos, trade names, trademarks, and similar identifying material (collectively, the "Licensed Materials") that we provide to you or authorize for such purpose.
2. You are only entitled to use the Licensed Materials to the extent that you are a member in good standing of the Program. You agree that all uses of the Licensed Materials will be on behalf of the Program and the good will associated therewith will inure to the sole benefit of us.
3. Except for the limited license granted under this section, you do not obtain any rights under this Agreement in any intellectual property, including, without limitation, any intellectual property with respect to our Affiliate Link, link formats, technical specifications, guidelines or graphical artwork referenced above, or with respect to our domain name.
REPRESENTATIONS AND WARRANTIES
You represent and warrant that:
1. This Agreement has been duly and validly executed and delivered by you and constitutes your legal, valid, and binding obligation, enforceable against you in accordance with its terms;
2. You have the full right, power, and authority to enter into and be bound by the terms and conditions of this Agreement and to perform your obligations under this Agreement, without the approval or consent of any other party;
3. You have sufficient right, title, and interest in and to the rights granted to us in this Agreement.
DISCLAIMER
THE MERCHANT  MAKES NO EXPRESS OR IMPLIED REPRESENTATIONS OR WARRANTIES REGARDING OUR PROGRAM, SERVICE AND WEB SITE OR THE PRODUCTS OR SERVICES PROVIDED THEREIN, ANY IMPLIED WARRANTIES OF OUR ABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND NON-INFRINGEMENT ARE EXPRESSLY DISCLAIMED AND EXCLUDED. IN ADDITION, WE MAKE NO REPRESENTATION THAT THE OPERATION OF OUR SITE WILL BE UNINTERRUPTED OR ERROR FREE, AND WE WILL NOT BE LIABLE FOR THE CONSEQUENCES OF ANY INTERRUPTIONS OR ERRORS.
LIMITATIONS OF LIABILITY
WE WILL NOT BE LIABLE TO YOU WITH RESPECT TO ANY SUBJECT MATTER OF THIS AGREEMENT UNDER ANY CONTRACT, NEGLIGENCE, TORT, STRICT LIABILITY OR OTHER LEGAL OR EQUITABLE THEORY FOR ANY INDIRECT, INCIDENTAL, CONSEQUENTIAL, SPECIAL OR EXEMPLARY DAMAGES (INCLUDING, WITHOUT LIMITATION, LOSS OF REVENUE OR GOODWILL OR ANTICIPATED PROFITS OR LOST BUSINESS), EVEN IF WE HAVE BEEN ADVISED OF THE POSSIBILITY OF SUCH DAMAGES. FURTHER, NOTWITHSTANDING ANYTHING TO THE CONTRARY CONTAINED IN THIS AGREEMENT, IN NO EVENT SHALL MERCHANTS CUMULATIVE LIABILITY TO YOU ARISING OUT OF OR RELATED TO THIS AGREEMENT, WHETHER BASED IN CONTRACT, NEGLIGENCE, STRICT LIABILITY, TORT OR OTHER LEGAL OR EQUITABLE THEORY, EXCEED THE TOTAL COMMISSION FEES PAID TO YOU UNDER THIS AGREEMENT.
INDEMNIFICATION
You hereby agree to indemnify and hold harmless MERCHNAT, and its subsidiaries and affiliates, and their directors, officers, employees, agents, shareholders, partners, members, and other owners, against any and all claims, actions, demands, liabilities, losses, damages, judgments, settlements, costs, and expenses (including reasonable attorneys' fees) (any or all of the foregoing hereinafter referred to as "Losses") insofar as such Losses (or actions in respect thereof) arise out of or are based on (i) any claim that our use of the affiliate trademarks infringes on any trademark, trade name, service mark, copyright, license, intellectual property, or other proprietary right of any third party, (ii) any misrepresentation of a representation or warranty or breach of a covenant and agreement made by you herein, or (iii) any claim related to your site, including, without limitation, content therein not attributable to us.
INDEPENDENT INVESTIGATION
YOU ACKNOWLEDGE THAT YOU HAVE READ THIS AGREEMENT AND AGREE TO ALL ITS TERMS AND CONDITIONS. YOU UNDERSTAND THAT WE MAY AT ANY TIME ADMIT OTHERS INTO THE PROGRAM ON TERMS THAT MAY DIFFER FROM THOSE CONTAINED IN THIS AGREEMENT. YOU HAVE INDEPENDENTLY EVALUATED THE DESIRABILITY OF PARTICIPATING IN THE PROGRAM AND ARE NOT RELYING ON ANY REPRESENTATION, GUARANTEE, OR STATEMENT OTHER THAN AS SET FORTH IN THIS AGREEMENT.  
  `;

  useEffect(() => {
    setlegalTerm(legalText)
  }, [])

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
            value={legalTerm}
            onChange={(e) => setlegalTerm(e.target.value)}
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