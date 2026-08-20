'use client'

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Layout from '../components/global/layout/index';
import ApiClient from '@/methods/api/apiClient';
import crendentialModel from '@/models/credential.model';
import { toast } from 'react-toastify';
import {
  LuCheck, LuChevronRight, LuChevronLeft, LuUser, LuBriefcase,
  LuGlobe, LuBuilding2, LuMail, LuLock,
  LuPhone, LuShieldCheck, LuMapPin, LuInfo, LuCreditCard as LuStripe
} from 'react-icons/lu';
import './style.scss';

const STEPS = [
  { id: 'account', title: 'Account Creation', icon: LuUser },
  { id: 'business', title: 'Business Details', icon: LuBriefcase },
  { id: 'domain', title: 'Domain Configuration', icon: LuGlobe },
  { id: 'stripe', title: 'Stripe Connection', icon: LuStripe }
];

export default function WhiteLabelOnboarding() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const planType = searchParams.get('planType') || 'merchant'; // 'merchant' or 'network'

  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    // Step A
    firstName: '',
    lastName: '',
    workEmail: '',
    password: '',
    phone: '',
    jobTitle: '',
    tnc: false,

    // Step B
    legalCompanyName: '',
    tradingName: '',
    companyRegNumber: '',
    vatId: '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    postalCode: '',
    country: '',
    billingEmail: '',
    companyWebsite: '',
    industry: '',

    // Step C
    subdomainSlug: '',
    trackingHostname: '',

    // Step D
    stripeKey: '',
    environment: 'test',
    defaultCurrency: 'USD',
    statementDescriptor: ''
  });

  // Fetch and auto-fill existing user & tenant information
  useEffect(() => {
    const user = crendentialModel.getUser();
    const savedTenantStr = typeof window !== 'undefined' ? localStorage.getItem('whiteLabelTenant') : null;
    let savedTenant: any = {};
    if (savedTenantStr) {
      try {
        savedTenant = JSON.parse(savedTenantStr);
      } catch (e) {}
    }

    const populateFromUser = (userData: any) => {
      if (!userData && !savedTenant) return;
      const u = userData?.activeUser || userData || {};
      const fullName = u?.fullName || u?.name || u?.userName || '';
      const nameParts = fullName.split(' ');
      const fName = u?.firstName || nameParts[0] || '';
      const lName = u?.lastName || (nameParts.length > 1 ? nameParts.slice(1).join(' ') : '') || '';

      setFormData(prev => ({
        ...prev,
        firstName: prev.firstName || fName || savedTenant.firstName || '',
        lastName: prev.lastName || lName || savedTenant.lastName || '',
        workEmail: prev.workEmail || u?.email || u?.workEmail || savedTenant.workEmail || '',
        phone: prev.phone || u?.phone || u?.mobile || savedTenant.phone || '',
        jobTitle: prev.jobTitle || u?.jobTitle || savedTenant.jobTitle || '',
        legalCompanyName: prev.legalCompanyName || u?.companyName || u?.legalCompanyName || u?.company || savedTenant.legalCompanyName || '',
        tradingName: prev.tradingName || u?.tradingName || u?.brandName || savedTenant.tradingName || '',
        companyRegNumber: prev.companyRegNumber || u?.companyRegNumber || savedTenant.companyRegNumber || '',
        vatId: prev.vatId || u?.vatId || u?.taxId || savedTenant.vatId || '',
        addressLine1: prev.addressLine1 || u?.addressLine1 || u?.address || savedTenant.addressLine1 || '',
        addressLine2: prev.addressLine2 || u?.addressLine2 || savedTenant.addressLine2 || '',
        city: prev.city || u?.city || savedTenant.city || '',
        postalCode: prev.postalCode || u?.postalCode || u?.zipCode || u?.zip || savedTenant.postalCode || '',
        country: prev.country || u?.country || savedTenant.country || '',
        billingEmail: prev.billingEmail || u?.billingEmail || u?.email || savedTenant.billingEmail || '',
        companyWebsite: prev.companyWebsite || u?.companyWebsite || u?.website || savedTenant.companyWebsite || '',
        industry: prev.industry || u?.industry || savedTenant.industry || '',
        subdomainSlug: prev.subdomainSlug || u?.subdomainSlug || u?.subdomain || savedTenant.subdomainSlug || '',
        trackingHostname: prev.trackingHostname || u?.trackingHostname || savedTenant.trackingHostname || '',
        stripeKey: prev.stripeKey || u?.stripeKey || savedTenant.stripeKey || '',
        environment: prev.environment || u?.environment || savedTenant.environment || 'test',
        defaultCurrency: prev.defaultCurrency || u?.defaultCurrency || u?.currency || savedTenant.defaultCurrency || 'USD',
        statementDescriptor: prev.statementDescriptor || u?.statementDescriptor || savedTenant.statementDescriptor || ''
      }));
    };

    if (user) {
      populateFromUser(user);
      const uid = user?.id || user?._id;
      if (uid) {
        ApiClient.get('user/detail', { id: uid }).then((res: any) => {
          if (res?.success && res?.data) {
            populateFromUser(res.data);
          }
        }).catch(() => {});
      }
    } else if (savedTenantStr) {
      populateFromUser(savedTenant);
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const val = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value;
    setFormData(prev => ({ ...prev, [name]: val }));
  };

  const nextStep = () => {
    if (currentStep < STEPS.length - 1) {
      setCurrentStep(curr => curr + 1);
      window.scrollTo(0, 0);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(curr => curr - 1);
      window.scrollTo(0, 0);
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    // Save domain and setup configuration to local storage for white label dashboard
    const tenantConfig = {
      ...formData,
      subdomainSlug: formData.subdomainSlug || 'mybrand',
      completedAt: new Date().toISOString()
    };
    localStorage.setItem('whiteLabelTenant', JSON.stringify(tenantConfig));

    setTimeout(() => {
      setIsSubmitting(false);
      toast.success('White Label Onboarding complete! Welcome to your dashboard.');
      router.push('/white-label-dashboard');
    }, 1500);
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <div className="onboarding-form-grid">
            <div className="form-group">
              <label>First Name <span className="req">*</span></label>
              <div className="input-with-icon">
                <LuUser className="input-icon" />
                <input type="text" name="firstName" value={formData.firstName} onChange={handleChange} required placeholder="John" />
              </div>
            </div>
            <div className="form-group">
              <label>Last Name <span className="req">*</span></label>
              <div className="input-with-icon">
                <LuUser className="input-icon" />
                <input type="text" name="lastName" value={formData.lastName} onChange={handleChange} required placeholder="Doe" />
              </div>
            </div>
            <div className="form-group full-width">
              <label>Work Email <span className="req">*</span></label>
              <div className="input-with-icon">
                <LuMail className="input-icon" />
                <input type="email" name="workEmail" value={formData.workEmail} onChange={handleChange} required placeholder="john@company.com" />
              </div>
            </div>
            <div className="form-group full-width">
              <label>Password <span className="req">*</span></label>
              <div className="input-with-icon">
                <LuLock className="input-icon" />
                <input type="password" name="password" value={formData.password} onChange={handleChange} required placeholder="Min 10 characters" />
              </div>
            </div>
            <div className="form-group">
              <label>Phone {planType === 'network' && <span className="req">*</span>}</label>
              <div className="input-with-icon">
                <LuPhone className="input-icon" />
                <input type="tel" name="phone" value={formData.phone} onChange={handleChange} required={planType === 'network'} placeholder="+1 234 567 8900" />
              </div>
            </div>
            <div className="form-group">
              <label>Job Title</label>
              <div className="input-with-icon">
                <LuBriefcase className="input-icon" />
                <input type="text" name="jobTitle" value={formData.jobTitle} onChange={handleChange} placeholder="e.g. CEO" />
              </div>
            </div>
            <div className="form-group full-width checkbox-group">
              <label className="checkbox-label">
                <input type="checkbox" name="tnc" checked={formData.tnc} onChange={handleChange} required />
                <span className="checkbox-text">I agree to the Terms and Conditions and Privacy Policy <span className="req">*</span></span>
              </label>
            </div>
          </div>
        );
      case 1:
        return (
          <div className="onboarding-form-grid">
            <div className="form-group">
              <label>Legal Company Name <span className="req">*</span></label>
              <div className="input-with-icon">
                <LuBuilding2 className="input-icon" />
                <input type="text" name="legalCompanyName" value={formData.legalCompanyName} onChange={handleChange} required placeholder="Company Inc." />
              </div>
            </div>
            <div className="form-group">
              <label>Trading / Brand Name</label>
              <div className="input-with-icon">
                <LuShieldCheck className="input-icon" />
                <input type="text" name="tradingName" value={formData.tradingName} onChange={handleChange} placeholder="Defaults to Legal Name if empty" />
              </div>
            </div>
            <div className="form-group">
              <label>Company Reg. Number</label>
              <input type="text" name="companyRegNumber" value={formData.companyRegNumber} onChange={handleChange} placeholder="e.g. 12345678" />
            </div>
            <div className="form-group">
              <label>VAT / Tax ID</label>
              <input type="text" name="vatId" value={formData.vatId} onChange={handleChange} placeholder="Required for EU/UK/NO" />
            </div>

            <h4 className="form-section-title full-width"><LuMapPin /> Registered Address</h4>
            <div className="form-group full-width">
              <label>Address Line 1 <span className="req">*</span></label>
              <input type="text" name="addressLine1" value={formData.addressLine1} onChange={handleChange} required placeholder="Street address" />
            </div>
            <div className="form-group full-width">
              <label>Address Line 2</label>
              <input type="text" name="addressLine2" value={formData.addressLine2} onChange={handleChange} placeholder="Apt, suite, etc." />
            </div>
            <div className="form-group">
              <label>City <span className="req">*</span></label>
              <input type="text" name="city" value={formData.city} onChange={handleChange} required placeholder="City" />
            </div>
            <div className="form-group">
              <label>Postal Code <span className="req">*</span></label>
              <input type="text" name="postalCode" value={formData.postalCode} onChange={handleChange} required placeholder="Postal Code" />
            </div>
            <div className="form-group full-width">
              <label>Country <span className="req">*</span></label>
              <select name="country" value={formData.country} onChange={handleChange} required>
                <option value="">Select Country</option>
                <option value="US">United States</option>
                <option value="UK">United Kingdom</option>
                <option value="CA">Canada</option>
                <option value="AU">Australia</option>
                <option value="EU">European Union</option>
              </select>
            </div>

            <h4 className="form-section-title full-width"><LuInfo /> Additional Details</h4>
            <div className="form-group">
              <label>Billing Email <span className="req">*</span></label>
              <div className="input-with-icon">
                <LuMail className="input-icon" />
                <input type="email" name="billingEmail" value={formData.billingEmail} onChange={handleChange} required placeholder="finance@company.com" />
              </div>
            </div>
            <div className="form-group">
              <label>Company Website <span className="req">*</span></label>
              <div className="input-with-icon">
                <LuGlobe className="input-icon" />
                <input type="url" name="companyWebsite" value={formData.companyWebsite} onChange={handleChange} required placeholder="https://company.com" />
              </div>
            </div>
            <div className="form-group full-width">
              <label>Industry / Vertical <span className="req">*</span></label>
              <select name="industry" value={formData.industry} onChange={handleChange} required>
                <option value="">Select Industry</option>
                <option value="ecommerce">E-Commerce</option>
                <option value="saas">SaaS</option>
                <option value="finance">Finance</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>
        );
      case 2:
        return (
          <div className="onboarding-form-grid">
            <div className="form-group full-width info-banner">
              <LuInfo className="banner-icon" />
              <p>Configure the domain where your white-label platform will be hosted. <strong>Subdomains are immutable after provisioning.</strong></p>
            </div>

            <div className="form-group full-width">
              <label>Subdomain Slug <span className="req">*</span></label>
              <div className="domain-input-group">
                <input
                  type="text"
                  name="subdomainSlug"
                  value={formData.subdomainSlug}
                  onChange={handleChange}
                  required
                  placeholder="yourbrand"
                  pattern="[a-z0-9-]+"
                />
                <span className="domain-suffix">.upfilly.io</span>
              </div>
              <small className="field-hint">Lowercase a-z, 0-9, hyphen. 3-30 chars.</small>
            </div>

            {planType === 'network' && (
              <>
                <div className="form-group full-width separator-line"></div>
                <div className="form-group full-width">
                  <label>Tracking Hostname <span className="req">*</span></label>
                  <p className="field-desc">Parent domain must be customer-owned. We will generate a CNAME target for you.</p>
                  <div className="input-with-icon">
                    <LuGlobe className="input-icon" />
                    <input
                      type="text"
                      name="trackingHostname"
                      value={formData.trackingHostname}
                      onChange={handleChange}
                      required
                      placeholder="track.clientbrand.com"
                    />
                  </div>
                </div>
              </>
            )}
          </div>
        );
      case 3:
        return (
          <div className="onboarding-form-grid">
            <div className="form-group full-width info-banner stripe-banner">
              <LuStripe className="banner-icon" />
              <p>Connect your own Stripe account. All payment activity in your tenant will run through your Stripe account.</p>
            </div>

            <div className="form-group full-width">
              <label>Stripe API Key <span className="req">*</span></label>
              <div className="input-with-icon">
                <LuLock className="input-icon" />
                <input type="password" name="stripeKey" value={formData.stripeKey} onChange={handleChange} required placeholder="sk_test_..." />
              </div>
            </div>

            <div className="form-group full-width">
              <label>Environment <span className="req">*</span></label>
              <div className="wl-toggle-group">
                <label className={`wl-toggle-btn ${formData.environment === 'test' ? 'active' : ''}`}>
                  <input type="radio" name="environment" value="test" checked={formData.environment === 'test'} onChange={handleChange} />
                  Test Mode
                </label>
                <label className={`wl-toggle-btn ${formData.environment === 'live' ? 'active' : ''}`}>
                  <input type="radio" name="environment" value="live" checked={formData.environment === 'live'} onChange={handleChange} />
                  Live Mode
                </label>
              </div>
            </div>

            <div className="form-group">
              <label>Default Currency <span className="req">*</span></label>
              <select name="defaultCurrency" value={formData.defaultCurrency} onChange={handleChange} required>
                <option value="USD">USD ($)</option>
                <option value="EUR">EUR (€)</option>
                <option value="GBP">GBP (£)</option>
                <option value="AUD">AUD ($)</option>
                <option value="CAD">CAD ($)</option>
              </select>
            </div>

            <div className="form-group">
              <label>Statement Descriptor</label>
              <input type="text" name="statementDescriptor" value={formData.statementDescriptor} onChange={handleChange} placeholder="e.g. MY BRAND" />
              <small className="field-hint">Defaults to trading name</small>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <Layout handleKeyPress={undefined} setFilter={undefined} reset={undefined} filter={undefined} name={undefined} filters={undefined}>
      <div className="wl-onboarding-wrapper">

        <div className="onboarding-container">
          <div className="onboarding-header">
            <h2>White Label Setup</h2>
            <p>Complete setup to provision your platform dashboard.</p>
          </div>

          {/* Stepper */}
          <div className="stepper">
            {STEPS.map((step, index) => {
              const StepIcon = step.icon;
              const isActive = index === currentStep;
              const isCompleted = index < currentStep;

              return (
                <div key={step.id} className={`wl-step-item ${isActive ? 'active' : ''} ${isCompleted ? 'completed' : ''}`}>
                  <div className="wl-step-circle">
                    {isCompleted ? <LuCheck size={18} /> : <StepIcon size={18} />}
                  </div>
                  <div className="wl-step-label">
                    <span className="wl-step-number">Step {index + 1}</span>
                    <span className="wl-step-title">{step.title}</span>
                  </div>
                  {index < STEPS.length - 1 && <div className="wl-step-connector" />}
                </div>
              );
            })}
          </div>

          {/* Form Content */}
          <div className="onboarding-content">
            <h3 className="content-title">{STEPS[currentStep].title}</h3>
            {renderStepContent()}
          </div>

          {/* Footer Actions */}
          <div className="onboarding-footer">
            <button
              type="button"
              className={`btn-primary ${currentStep === 0 ? 'hidden' : ''}`}
              onClick={prevStep}
            >
              <LuChevronLeft /> Back
            </button>

            {currentStep < STEPS.length - 1 ? (
              <button type="button" className="btn-primary" onClick={nextStep}>
                Continue <LuChevronRight />
              </button>
            ) : (
              <button type="button" className="btn-primary" onClick={handleSubmit} disabled={isSubmitting}>
                {isSubmitting ? 'Provisioning Dashboard...' : 'Complete Setup & Launch Dashboard'} <LuCheck />
              </button>
            )}
          </div>

        </div>
      </div>
    </Layout>
  );
}

