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
  LuPhone, LuShieldCheck, LuMapPin, LuInfo, LuCreditCard as LuStripe,
  LuEye, LuEyeOff
} from 'react-icons/lu';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
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
  const [showPassword, setShowPassword] = useState(false);
  const [showStripeKey, setShowStripeKey] = useState(false);
  const [phoneString, setPhoneString] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [whiteLabelProgress, setWhiteLabelProgress] = useState<any>({ a: false, b: false, c: false, d: false });

  const validateStep = (step: number) => {
    const newErrors: Record<string, string> = {};
    let isValid = true;

    const requireField = (key: string, value: any, message: string) => {
      if (!value || (typeof value === 'string' && value.trim() === '')) {
        newErrors[key] = message;
        isValid = false;
      }
    };

    const validateEmail = (email: string) => {
      return String(email)
        .toLowerCase()
        .match(
          /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        );
    };

    const validateURL = (url: string) => {
      try {
        new URL(url.startsWith('http') ? url : `https://${url}`);
        return true;
      } catch (e) {
        return false;
      }
    };

    if (step === 0) {
      requireField('firstName', formData.firstName, 'First Name is required');
      requireField('lastName', formData.lastName, 'Last Name is required');
      
      requireField('email', formData.email, 'Work Email is required');
      if (formData.email && !validateEmail(formData.email)) {
        newErrors.email = 'Please enter a valid email address';
        isValid = false;
      }

      requireField('password', formData.password, 'Password is required');
      if (formData.password && formData.password.length < 8) {
        newErrors.password = 'Password must be at least 8 characters';
        isValid = false;
      }

      if (planType === 'network') {
        requireField('phone', phoneString, 'Phone number is required');
        if (phoneString && phoneString.length < 5) {
          newErrors.phone = 'Please enter a valid phone number';
          isValid = false;
        }
      }

      if (!formData.tnc) {
        newErrors.tnc = 'You must agree to the Terms and Conditions and Privacy Policy';
        isValid = false;
      }
    } else if (step === 1) {
      requireField('company_name', formData.company_name, 'Legal Company Name is required');
      requireField('line1', formData.white_label_address.line1, 'Address Line 1 is required');
      requireField('city', formData.white_label_address.city, 'City is required');
      requireField('zip', formData.white_label_address.zip, 'Postal Code is required');
      requireField('country', formData.white_label_address.country, 'Country is required');
      
      requireField('billing_email', formData.billing_email, 'Billing Email is required');
      if (formData.billing_email && !validateEmail(formData.billing_email)) {
        newErrors.billing_email = 'Please enter a valid billing email address';
        isValid = false;
      }

      requireField('company_url', formData.company_url, 'Company Website is required');
      if (formData.company_url && !validateURL(formData.company_url)) {
        newErrors.company_url = 'Please enter a valid URL';
        isValid = false;
      }

      requireField('industry', formData.industry, 'Please select an industry');
    } else if (step === 2) {
      requireField('sub_domain', formData.sub_domain, 'Subdomain Slug is required');
      if (formData.sub_domain && !/^[a-z0-9-]+$/.test(formData.sub_domain)) {
        newErrors.sub_domain = 'Subdomain can only contain lowercase letters, numbers, and hyphens';
        isValid = false;
      } else if (formData.sub_domain && (formData.sub_domain.length < 3 || formData.sub_domain.length > 30)) {
        newErrors.sub_domain = 'Subdomain must be between 3 and 30 characters';
        isValid = false;
      }

      if (planType === 'network') {
        requireField('tracking_hostname', formData.tracking_hostname, 'Tracking Hostname is required');
        if (formData.tracking_hostname && !/^([a-z0-9]+(-[a-z0-9]+)*\.)+[a-z]{2,}$/i.test(formData.tracking_hostname)) {
          newErrors.tracking_hostname = 'Please enter a valid hostname (e.g. track.yourdomain.com)';
          isValid = false;
        }
      }
    } else if (step === 3) {
      requireField('stripe_key', formData.stripe_key, 'Stripe API Key is required');
      if (formData.stripe_key && !formData.stripe_key.startsWith('sk_')) {
        newErrors.stripe_key = 'Stripe Secret Key must start with "sk_"';
        isValid = false;
      }
    }

    setErrors(newErrors);
    return isValid;
  };

  const renderError = (field: string) => {
    return errors[field] ? <span style={{ color: '#ef4444', fontSize: '12px', marginTop: '4px', display: 'block' }}>{errors[field]}</span> : null;
  };

  // Form State
  const [formData, setFormData] = useState({
    // Step A
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    dialCode: '+1',
    mobileNo: '',
    role: 'white_lable',
    jobTitle: '',
    tnc: false,

    // Step B
    company_name: '',
    brand_name: '',
    company_registration_number: '',
    taxId: '',
    white_label_address: {
      line1: '',
      line2: '',
      city: '',
      state: '',
      zip: '',
      country: ''
    },
    billing_email: '',
    company_url: '',
    industry: '',

    // Step C
    sub_domain: '',
    tracking_hostname: '',

    // Step D
    stripe_key: '',
    stripe_environment: 'test',
    stripe_currency: 'USD',
    stripe_statement_descriptor: ''
  });

  // Fetch and auto-fill existing user & tenant information
  useEffect(() => {
    const user = crendentialModel.getUser();
    if (!user || (!user.id && !user._id)) {
      router.push('/login');
      return;
    }
    const savedTenantStr = typeof window !== 'undefined' ? localStorage.getItem('whiteLabelTenant') : null;
    let savedTenant: any = {};
    if (savedTenantStr) {
      try {
        savedTenant = JSON.parse(savedTenantStr);
      } catch (e) { }
    }

    const populateFromUser = (userData: any) => {
      if (!userData && !savedTenant) return;
      const u = userData?.activeUser || userData || {};
      const fullName = u?.fullName || u?.name || u?.userName || '';
      const nameParts = fullName.split(' ');
      const fName = u?.firstName || nameParts[0] || '';
      const lName = u?.lastName || (nameParts.length > 1 ? nameParts.slice(1).join(' ') : '') || '';

      const initialPhoneStr = u?.phone || u?.mobile || savedTenant.phoneString || '';
      setPhoneString(prev => prev || initialPhoneStr);

      setFormData(prev => ({
        ...prev,
        firstName: prev.firstName || fName || savedTenant.firstName || '',
        lastName: prev.lastName || lName || savedTenant.lastName || '',
        email: prev.email || u?.email || u?.workEmail || savedTenant.email || savedTenant.workEmail || '',
        dialCode: prev.dialCode || u?.dialCode || savedTenant.dialCode || '+1',
        mobileNo: prev.mobileNo || u?.mobileNo || savedTenant.mobileNo || '',
        role: prev.role || u?.role || savedTenant.role || 'white_lable',
        jobTitle: prev.jobTitle || u?.job_title || u?.jobTitle || savedTenant.jobTitle || '',
        company_name: prev.company_name || u?.company_name || u?.companyName || u?.legalCompanyName || u?.company || savedTenant.company_name || '',
        brand_name: prev.brand_name || u?.brand_name || u?.tradingName || u?.brandName || savedTenant.brand_name || '',
        company_registration_number: prev.company_registration_number || u?.company_registration_number || u?.companyRegNumber || savedTenant.company_registration_number || '',
        taxId: prev.taxId || u?.taxId || u?.vatId || savedTenant.taxId || '',
        white_label_address: {
          line1: prev.white_label_address?.line1 || u?.white_label_address?.line1 || u?.addressLine1 || u?.address || savedTenant.white_label_address?.line1 || '',
          line2: prev.white_label_address?.line2 || u?.white_label_address?.line2 || u?.addressLine2 || savedTenant.white_label_address?.line2 || '',
          city: prev.white_label_address?.city || u?.white_label_address?.city || u?.city || savedTenant.white_label_address?.city || '',
          state: prev.white_label_address?.state || u?.white_label_address?.state || u?.state || savedTenant.white_label_address?.state || '',
          zip: prev.white_label_address?.zip || u?.white_label_address?.zip || u?.postalCode || u?.zipCode || u?.zip || savedTenant.white_label_address?.zip || '',
          country: prev.white_label_address?.country || u?.white_label_address?.country || u?.country || savedTenant.white_label_address?.country || ''
        },
        billing_email: prev.billing_email || u?.billing_email || u?.billingEmail || u?.email || savedTenant.billing_email || '',
        company_url: prev.company_url || u?.company_url || u?.companyWebsite || u?.website || savedTenant.company_url || '',
        industry: prev.industry || u?.industry || savedTenant.industry || '',
        sub_domain: prev.sub_domain || u?.sub_domain || u?.subdomainSlug || u?.subdomain || savedTenant.sub_domain || '',
        tracking_hostname: prev.tracking_hostname || u?.tracking_hostname || u?.trackingHostname || savedTenant.tracking_hostname || '',
        stripe_key: prev.stripe_key || u?.stripe_key || u?.stripeKey || savedTenant.stripe_key || '',
        stripe_environment: prev.stripe_environment || u?.stripe_environment || u?.environment || savedTenant.stripe_environment || 'test',
        stripe_currency: prev.stripe_currency || u?.stripe_currency || u?.defaultCurrency || u?.currency || savedTenant.stripe_currency || 'USD',
        stripe_statement_descriptor: prev.stripe_statement_descriptor || u?.stripe_statement_descriptor || u?.statementDescriptor || savedTenant.stripe_statement_descriptor || ''
      }));
    };

    if (user) {
      populateFromUser(user);
      const uid = user?.id || user?._id;
      if (uid) {
        ApiClient.get('user/detail', { id: uid }).then((res: any) => {
          if (res?.success && res?.data) {
            populateFromUser(res.data);
            
            // --- NEW LOGIC: Resume progress ---
            const progress = res?.data?.white_label_progress;
            if (progress) {
              setWhiteLabelProgress(progress);
              if (progress.a && progress.b && progress.c && progress.d) {
                router.push('/white-label-dashboard');
              } else if (progress.c) {
                setCurrentStep(3);
              } else if (progress.b) {
                setCurrentStep(2);
              } else if (progress.a) {
                setCurrentStep(1);
              }
            }
            // ----------------------------------
            
            // --- OLD LOGIC ---
            // // Only populate form user, no routing logic
            // populateFromUser(res.data);
            // -----------------
          }
        }).catch(() => { });
      }
    } else if (savedTenantStr) {
      populateFromUser(savedTenant);
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const val = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value;
    setFormData(prev => ({ ...prev, [name]: val }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      white_label_address: {
        ...prev.white_label_address,
        [name]: value
      }
    }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const saveProgress = async (stepIndex: number) => {
    const user = crendentialModel.getUser();
    const uid = user?.id || user?._id;

    const newProgress = { ...whiteLabelProgress };
    if (stepIndex >= 0) newProgress.a = true;
    if (stepIndex >= 1) newProgress.b = true;
    if (stepIndex >= 2) newProgress.c = true;
    if (stepIndex >= 3) newProgress.d = true;
    setWhiteLabelProgress(newProgress);

    let payload: any = { white_label_progress: newProgress };
    if (uid) payload.id = uid;

    if (stepIndex === 0) {
      payload = {
        ...payload,
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        password: formData.password,
        dialCode: formData.dialCode,
        mobileNo: formData.mobileNo,
        role: formData.role,
        termandconditon: formData.tnc,
      };
    } else if (stepIndex === 1) {
      payload = {
        ...payload,
        company_name: formData.company_name,
        brand_name: formData.brand_name,
        company_registration_number: formData.company_registration_number,
        taxId: formData.taxId,
        white_label_address: formData.white_label_address,
        billing_email: formData.billing_email,
        company_url: formData.company_url,
        industry: formData.industry,
      };
    } else if (stepIndex === 2) {
      payload = {
        ...payload,
        sub_domain: formData.sub_domain || 'mybrand',
        tracking_hostname: formData.tracking_hostname,
      };
    } else if (stepIndex === 3) {
      payload = {
        ...payload,
        stripe_key: formData.stripe_key,
        stripe_environment: formData.stripe_environment,
        stripe_currency: formData.stripe_currency,
        stripe_statement_descriptor: formData.stripe_statement_descriptor,
      };
    }

    return await ApiClient.put('edit/profile', payload);

  };

  const nextStep = async () => {
    // --- OLD LOGIC ---
    // if (validateStep(currentStep)) {
    //   if (currentStep < STEPS.length - 1) {
    //     setCurrentStep(curr => curr + 1);
    //     window.scrollTo(0, 0);
    //   }
    // }
    // -----------------

    // --- NEW LOGIC: Call API on every step ---
    if (validateStep(currentStep)) {
      setIsSubmitting(true);
      try {
        const response: any = await saveProgress(currentStep);
        if (response?.success) {
          if (currentStep < STEPS.length - 1) {
            setCurrentStep(curr => curr + 1);
            window.scrollTo(0, 0);
          }
        } else {
          toast.error(response?.message || 'Error saving progress');
        }
      } catch (err) {
        toast.error('Failed to save progress');
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(curr => curr - 1);
      window.scrollTo(0, 0);
    }
  };

  const handleSubmit = async () => {
    if (!validateStep(3)) return;
    setIsSubmitting(true);
    
    // --- OLD LOGIC ---
    // // Save domain and setup configuration to local storage for white label dashboard
    // const tenantConfig = {
    //   ...formData,
    //   sub_domain: formData.sub_domain || 'mybrand',
    //   //         completedAt: new Date().toISOString()
    //   // localStorage.setItem('whiteLabelTenant', JSON.stringify(tenantConfig));
    //   completedAt: new Date().toISOString()
    // };
    // localStorage.setItem('whiteLabelTenant', JSON.stringify(tenantConfig));
    //
    // setTimeout(() => {
    //   setIsSubmitting(false);
    //   // toast.success('White Label Onboarding complete! Welcome to your dashboard.');
    //   // router.push('/white-label-dashboard');
    //   toast.success('White Label Onboarding complete! Welcome to your dashboard.');
    //   router.push('/white-label-dashboard');
    // }, 1500);
    // ----------------

    // --- OLD REGISTER API LOGIC ---
    // const { jobTitle, tnc, ...restFormData } = formData;
    // const payload = {
    //   ...restFormData,
    //   termandconditon: tnc,
    //   sub_domain: formData.sub_domain || 'mybrand',
    // };
    //
    // console.log("Data sending to backend:", payload);
    //
    // try {
    //   const response: any = await ApiClient.post('register', payload);
    //   if (response?.success) {
    //     toast.success(response?.message || 'Registration successful!');
    //     router.push('/white-label-dashboard');
    //   } else {
    //     toast.error(response?.message || 'Registration failed.');
    //   }
    // } catch (error) {
    //   console.error("Registration error:", error);
    //   toast.error('An error occurred during registration.');
    // } finally {
    //   setIsSubmitting(false);
    // }
    // ------------------------------

    // --- NEW LOGIC: Use saveProgress ---
    try {
      const response: any = await saveProgress(3);
      if (response?.success) {
        toast.success(response?.message || 'Registration successful!');
        router.push('/white-label-dashboard');
      } else {
        toast.error(response?.message || 'Error occurred');
      }
    } catch (error) {
      console.error("Onboarding submission error:", error);
      toast.error("An error occurred during onboarding.");
    } finally {
      setIsSubmitting(false);
    }
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
                <input type="text" name="firstName" value={formData.firstName} onChange={handleChange} required placeholder="John"  />
              </div>
              {renderError('firstName')}
            </div>
            <div className="form-group">
              <label>Last Name <span className="req">*</span></label>
              <div className="input-with-icon">
                <LuUser className="input-icon" />
                <input type="text" name="lastName" value={formData.lastName} onChange={handleChange} required placeholder="Doe"  />
              </div>
              {renderError('lastName')}
            </div>
            <div className="form-group full-width">
              <label>Work Email <span className="req">*</span></label>
              <div className="input-with-icon">
                <LuMail className="input-icon" />
                <input type="email" name="email" value={formData.email} onChange={handleChange} required placeholder="john@company.com"  />
              </div>
              {renderError('email')}
            </div>
            <div className="form-group full-width">
              <label>Password <span className="req">*</span></label>
              <div className="input-with-icon position-relative">
                <LuLock className="input-icon" />
                <input type={showPassword ? "text" : "password"} name="password" value={formData.password} onChange={handleChange} required placeholder="Min 10 characters" style={{  paddingRight: '40px' }} />
                <button type="button" onClick={() => setShowPassword(!showPassword)} style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'transparent', border: 'none', color: '#64748b', cursor: 'pointer', padding: 0 }}>
                  {showPassword ? <LuEyeOff size={18} /> : <LuEye size={18} />}
                </button>
              </div>
              {renderError('password')}
            </div>
            <div className="form-group">
              <label>Phone {planType === 'network' && <span className="req">*</span>}</label>
              <div className="custom-phone-input" style={{ width: '100%' }}>
                <PhoneInput
                  country={'us'}
                  value={phoneString}
                  onChange={(phone, data: any) => {
                    const dCode = data?.dialCode ? `+${data.dialCode}` : '+1';
                    const mNo = data?.dialCode && phone.startsWith(data.dialCode) ? phone.slice(data.dialCode.length) : phone;
                    setPhoneString(phone);
                    setFormData(prev => ({
                      ...prev,
                      dialCode: dCode,
                      mobileNo: mNo
                    }));
                    if (errors.phone) setErrors(prev => ({ ...prev, phone: '' }));
                  }}
                  inputProps={{
                    name: 'phone',
                    required: planType === 'network',
                  }}
                  placeholder="+1 234 567 8900"
                  containerStyle={{ width: '100%' }}
                  inputStyle={{ borderColor: errors.phone ? '#ef4444' : undefined, 
                    width: '100%',
                    paddingLeft: '48px',
                    height: '45px',
                    borderRadius: '8px',
                    border: '1px solid #cbd5e1',
                    fontSize: '14px',
                    color: '#0f172a'
                  }}
                  buttonStyle={{ borderColor: errors.phone ? '#ef4444' : undefined, 
                    background: 'transparent',
                    border: 'none',
                    borderRight: '1px solid #cbd5e1',
                    borderTopLeftRadius: '8px',
                    borderBottomLeftRadius: '8px'
                  }}
                />
              </div>
              {renderError('phone')}
            </div>
            <div className="form-group">
              <label>Job Title</label>
              <div className="input-with-icon">
                <LuBriefcase className="input-icon" />
                <input type="text" name="jobTitle" value={formData.jobTitle} onChange={handleChange} placeholder="e.g. CEO"  />
              </div>
            </div>
            <div className="form-group full-width checkbox-group">
              <label className="checkbox-label">
                <input type="checkbox" name="tnc" checked={formData.tnc} onChange={handleChange} required />
                <span className="checkbox-text">I agree to the Terms and Conditions and Privacy Policy <span className="req">*</span></span>
              </label>
              {renderError('tnc')}
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
                <input type="text" name="company_name" value={formData.company_name} onChange={handleChange} required placeholder="Company Inc."  />
              </div>
              {renderError('company_name')}
            </div>
            <div className="form-group">
              <label>Trading / Brand Name</label>
              <div className="input-with-icon">
                <LuShieldCheck className="input-icon" />
                <input type="text" name="brand_name" value={formData.brand_name} onChange={handleChange} placeholder="Defaults to Legal Name if empty"  />
              </div>
            </div>
            <div className="form-group">
              <label>Company Reg. Number</label>
              <input type="text" name="company_registration_number" value={formData.company_registration_number} onChange={handleChange} placeholder="e.g. 12345678"  />
            </div>
            <div className="form-group">
              <label>VAT / Tax ID</label>
              <input type="text" name="taxId" value={formData.taxId} onChange={handleChange} placeholder="Required for EU/UK/NO"  />
            </div>

            <h4 className="form-section-title full-width"><LuMapPin /> Registered Address</h4>
            <div className="form-group full-width">
              <label>Address Line 1 <span className="req">*</span></label>
              <input type="text" name="line1" value={formData.white_label_address.line1} onChange={handleAddressChange} required placeholder="Street address"  />
              {renderError('line1')}
            </div>
            <div className="form-group full-width">
              <label>Address Line 2</label>
              <input type="text" name="line2" value={formData.white_label_address.line2} onChange={handleAddressChange} placeholder="Apt, suite, etc."  />
            </div>
            <div className="form-group">
              <label>City <span className="req">*</span></label>
              <input type="text" name="city" value={formData.white_label_address.city} onChange={handleAddressChange} required placeholder="City"  />
              {renderError('city')}
            </div>
            <div className="form-group">
              <label>State / Province</label>
              <input type="text" name="state" value={formData.white_label_address.state} onChange={handleAddressChange} placeholder="State"  />
            </div>
            <div className="form-group">
              <label>Postal Code <span className="req">*</span></label>
              <input type="text" name="zip" value={formData.white_label_address.zip} onChange={handleAddressChange} required placeholder="Postal Code"  />
              {renderError('zip')}
            </div>
            <div className="form-group full-width">
              <label>Country <span className="req">*</span></label>
              <select name="country" value={formData.white_label_address.country} onChange={handleAddressChange} required>
                <option value="">Select Country</option>
                <option value="US">United States</option>
                <option value="UK">United Kingdom</option>
                <option value="CA">Canada</option>
                <option value="AU">Australia</option>
                <option value="EU">European Union</option>
              </select>
              {renderError('country')}
            </div>

            <h4 className="form-section-title full-width"><LuInfo /> Additional Details</h4>
            <div className="form-group">
              <label>Billing Email <span className="req">*</span></label>
              <div className="input-with-icon">
                <LuMail className="input-icon" />
                <input type="email" name="billing_email" value={formData.billing_email} onChange={handleChange} required placeholder="finance@company.com"  />
              </div>
              {renderError('billing_email')}
            </div>
            <div className="form-group">
              <label>Company Website <span className="req">*</span></label>
              <div className="input-with-icon">
                <LuGlobe className="input-icon" />
                <input type="url" name="company_url" value={formData.company_url} onChange={handleChange} required placeholder="https://company.com"  />
              </div>
              {renderError('company_url')}
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
              {renderError('industry')}
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
                  name="sub_domain"
                  value={formData.sub_domain}
                  onChange={handleChange}
                  required
                  placeholder="yourbrand"
                  pattern="[a-z0-9-]+"
                 />
                <span className="domain-suffix">.upfilly.io</span>
              </div>
              <small className="field-hint">Lowercase a-z, 0-9, hyphen. 3-30 chars.</small>
              {renderError('sub_domain')}
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
                      name="tracking_hostname"
                      value={formData.tracking_hostname}
                      onChange={handleChange}
                      required
                      placeholder="track.clientbrand.com"
                     />
                  </div>
                  {renderError('tracking_hostname')}
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
              <div className="input-with-icon position-relative">
                <LuLock className="input-icon" />
                <input type={showStripeKey ? "text" : "password"} name="stripe_key" value={formData.stripe_key} onChange={handleChange} required placeholder="sk_test_..." style={{  paddingRight: '40px' }} />
                <button type="button" onClick={() => setShowStripeKey(!showStripeKey)} style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'transparent', border: 'none', color: '#64748b', cursor: 'pointer', padding: 0 }}>
                  {showStripeKey ? <LuEyeOff size={18} /> : <LuEye size={18} />}
                </button>
              </div>
              {renderError('stripe_key')}
            </div>

            <div className="form-group full-width">
              <label>Environment <span className="req">*</span></label>
              <div className="wl-toggle-group">
                <label className={`wl-toggle-btn ${formData.stripe_environment === 'test' ? 'active' : ''}`}>
                  <input type="radio" name="stripe_environment" value="test" checked={formData.stripe_environment === 'test'} onChange={handleChange} />
                  Test Mode
                </label>
                <label className={`wl-toggle-btn ${formData.stripe_environment === 'live' ? 'active' : ''}`}>
                  <input type="radio" name="stripe_environment" value="live" checked={formData.stripe_environment === 'live'} onChange={handleChange} />
                  Live Mode
                </label>
              </div>
            </div>

            <div className="form-group">
              <label>Default Currency <span className="req">*</span></label>
              <select name="stripe_currency" value={formData.stripe_currency} onChange={handleChange} required>
                <option value="USD">USD ($)</option>
                <option value="EUR">EUR (€)</option>
                <option value="GBP">GBP (£)</option>
                <option value="AUD">AUD ($)</option>
                <option value="CAD">CAD ($)</option>
              </select>
            </div>

            <div className="form-group">
              <label>Statement Descriptor</label>
              <input type="text" name="stripe_statement_descriptor" value={formData.stripe_statement_descriptor} onChange={handleChange} placeholder="e.g. MY BRAND"  />
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
            <h3 className="content-title">{STEPS[currentStep]?.title}</h3>
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

