'use client'

import React, { useState, useEffect, useRef, Suspense } from 'react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import Layout from '../components/global/layout/index';
import ApiClient from '@/methods/api/apiClient';
import crendentialModel from '@/models/credential.model';
import { buildTenantSubdomainUrl } from '@/methods/auth';
import { toast } from 'react-toastify';
import {
  LuCheck, LuChevronRight, LuChevronLeft, LuUser, LuBriefcase,
  LuGlobe, LuBuilding2, LuMail, LuLock,
  LuPhone, LuShieldCheck, LuMapPin, LuInfo, LuCreditCard as LuStripe,
  LuEye, LuEyeOff, LuSparkles, LuCircleCheck, LuCircleAlert
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

export interface WhiteLabelOnboardingProps {
  initialStep?: number;
}

function OnboardingContent({ initialStep }: WhiteLabelOnboardingProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  // Query Parameters
  const paramPlanId = searchParams.get('planId') || '';
  const paramPlanType = searchParams.get('planType') || '';
  const paramAmount = searchParams.get('amount');
  const paramPlanName = searchParams.get('planName') || '';
  const paramSessionToken = searchParams.get('session_token') || '';
  const paramTenantId = searchParams.get('tenant_id') || '';
  const paramPayment = searchParams.get('payment') || '';
  const paramStep = searchParams.get('step') || '';

  // Determine starting step:
  // Step 1 (Step B) if payment=success, or path is /onboarding/step-b, or step=1, or initialStep=1
  const isStepBUrl = pathname?.includes('step-b') || paramStep === '1' || initialStep === 1 || paramPayment === 'success';
  const defaultStep = isStepBUrl ? 1 : 0;

  const [currentStep, setCurrentStep] = useState<number>(defaultStep);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showStripeKey, setShowStripeKey] = useState(false);
  const [phoneString, setPhoneString] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [paymentSuccessBanner, setPaymentSuccessBanner] = useState<boolean>(paramPayment === 'success');

  // Identifiers for session and tenant
  const [sessionToken, setSessionToken] = useState<string>('');
  const [tenantId, setTenantId] = useState<string>('');
  const [selectedPlanId, setSelectedPlanId] = useState<string>(paramPlanId);
  const [selectedPlanInfo, setSelectedPlanInfo] = useState<{
    name: string;
    amount: number | null;
    whitelabelType: string;
  }>({
    name: paramPlanName,
    amount: paramAmount !== null && paramAmount !== '' ? Number(paramAmount) : null,
    whitelabelType: paramPlanType || 'merchant'
  });

  // Subdomain live debounce check state
  const [subdomainCheck, setSubdomainCheck] = useState<{
    status: 'idle' | 'checking' | 'available' | 'taken';
    message: string;
    fqdn: string;
  }>({
    status: 'idle',
    message: '',
    fqdn: ''
  });
  const debounceTimerRef = useRef<any>(null);

  // Form State
  const [formData, setFormData] = useState({
    // Step A
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    phone: '',
    dialCode: '+1',
    mobileNo: '',
    job_title: '',
    role: 'white_lable',
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
      country: 'US'
    },
    billing_email: '',
    company_url: '',
    industry: 'saas',

    // Step C
    sub_domain: '',
    tracking_hostname: '',

    // Step D
    stripe_publishable_key: '',
    stripe_key: '',
    stripe_environment: 'test',
    stripe_currency: 'USD',
    stripe_statement_descriptor: ''
  });

  // Effective plan type: merchant or network
  const planType = selectedPlanInfo.whitelabelType || paramPlanType || 'merchant';

  // 1. Initial State Hydration & Session Resumption
  useEffect(() => {
    // Sync tokens from search params or localStorage
    const savedToken = paramSessionToken || (typeof window !== 'undefined' ? localStorage.getItem('onboarding_session_token') : '') || '';
    const savedTenantId = paramTenantId || (typeof window !== 'undefined' ? localStorage.getItem('tenant_id') : '') || '';
    const savedPlanId = paramPlanId || (typeof window !== 'undefined' ? localStorage.getItem('onboarding_plan_id') : '') || '';

    if (savedToken) {
      setSessionToken(savedToken);
      if (typeof window !== 'undefined') localStorage.setItem('onboarding_session_token', savedToken);
    }
    if (savedTenantId) {
      setTenantId(savedTenantId);
      if (typeof window !== 'undefined') localStorage.setItem('tenant_id', savedTenantId);
    }
    if (savedPlanId) {
      setSelectedPlanId(savedPlanId);
      if (typeof window !== 'undefined') localStorage.setItem('onboarding_plan_id', savedPlanId);
    }

    // If session token exists, resume progress from backend
    if (savedToken) {
      ApiClient.get('platform/onboarding/resume', { session_token: savedToken })
        .then((res: any) => {
          if (res?.success && res?.data) {
            const data = res.data;
            if (data.tenant_id) {
              setTenantId(data.tenant_id);
              if (typeof window !== 'undefined') localStorage.setItem('tenant_id', data.tenant_id);
            }
            if (data.whitelabel_type) {
              setSelectedPlanInfo(prev => ({ ...prev, whitelabelType: data.whitelabel_type }));
            }
            if (data.saved_data) {
              populateFromSavedData(data.saved_data);
            }

            // Route to saved step unless explicitly arriving at step-b
            if (isStepBUrl) {
              setCurrentStep(1);
            } else if (data.current_step === 'step_d') {
              setCurrentStep(3);
            } else if (data.current_step === 'step_c') {
              setCurrentStep(2);
            } else if (data.current_step === 'step_b') {
              setCurrentStep(1);
            }
          }
        })
        .catch(() => {});
    }

    // Prefill user details if already logged into an account
    const loggedUser = crendentialModel.getUser();
    if (loggedUser) {
      const u = loggedUser?.activeUser || loggedUser;
      const fullName = u?.fullName || u?.name || u?.userName || '';
      const nameParts = fullName.split(' ');
      const fName = u?.firstName || nameParts[0] || '';
      const lName = u?.lastName || (nameParts.length > 1 ? nameParts.slice(1).join(' ') : '') || '';

      setFormData(prev => ({
        ...prev,
        firstName: prev.firstName || fName,
        lastName: prev.lastName || lName,
        email: prev.email || u?.email || u?.workEmail || '',
        dialCode: prev.dialCode || u?.dialCode || '+1',
        mobileNo: prev.mobileNo || u?.mobileNo || ''
      }));
      if (u?.phone || u?.mobile) {
        setPhoneString(prev => prev || u.phone || u.mobile);
      }
    }
  }, []);

  // Fetch plan details if only planId is provided without name/amount
  useEffect(() => {
    if (selectedPlanId && (!selectedPlanInfo.name || selectedPlanInfo.amount === null)) {
      ApiClient.get('subscription-plan/all', { category: 'white_label', status: 'active' }).then((res: any) => {
        const plans = res?.data?.data || res?.data || [];
        const matched = plans.find((p: any) => (p._id === selectedPlanId || p.id === selectedPlanId));
        if (matched) {
          setSelectedPlanInfo({
            name: matched.name,
            amount: matched.amount,
            whitelabelType: matched.whitelabelType || matched.type || 'merchant'
          });
        }
      }).catch(() => {});
    }
  }, [selectedPlanId]);

  // Populate form fields from backend saved_data
  const populateFromSavedData = (saved: any) => {
    if (!saved) return;
    const phoneVal = saved.phone || '';
    if (phoneVal) setPhoneString(phoneVal);

    setFormData(prev => ({
      ...prev,
      firstName: saved.first_name || prev.firstName,
      lastName: saved.last_name || prev.lastName,
      email: saved.admin_email || saved.work_email || prev.email,
      phone: phoneVal || prev.phone,
      job_title: saved.job_title || prev.job_title,
      company_name: saved.legal_company_name || prev.company_name,
      brand_name: saved.trading_name || prev.brand_name,
      company_registration_number: saved.company_registration_number || prev.company_registration_number,
      taxId: saved.vat_tax_id || prev.taxId,
      white_label_address: {
        line1: saved.registered_address?.line1 || prev.white_label_address.line1,
        line2: saved.registered_address?.line2 || prev.white_label_address.line2,
        city: saved.registered_address?.city || prev.white_label_address.city,
        state: saved.registered_address?.state || prev.white_label_address.state,
        zip: saved.registered_address?.postal_code || prev.white_label_address.zip,
        country: saved.registered_address?.country_code || prev.white_label_address.country || 'US'
      },
      billing_email: saved.billing_email || prev.billing_email,
      company_url: saved.company_website || prev.company_url,
      industry: saved.industry || prev.industry || 'saas',
      sub_domain: saved.subdomain || prev.sub_domain
    }));

    if (saved.subdomain) {
      setSubdomainCheck({
        status: 'available',
        message: `Domain configured: ${saved.subdomain}.upfilly.com`,
        fqdn: `${saved.subdomain}.upfilly.com`
      });
    }
  };

  // Validation functions
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

  const validateStep = (step: number) => {
    const newErrors: Record<string, string> = {};
    let isValid = true;

    const requireField = (key: string, value: any, message: string) => {
      if (!value || (typeof value === 'string' && value.trim() === '')) {
        newErrors[key] = message;
        isValid = false;
      }
    };

    if (step === 0) {
      // Step A
      requireField('firstName', formData.firstName, 'First Name is required');
      if (formData.firstName && formData.firstName.trim().length < 2) {
        newErrors.firstName = 'First Name must be at least 2 characters';
        isValid = false;
      }

      requireField('lastName', formData.lastName, 'Last Name is required');
      if (formData.lastName && formData.lastName.trim().length < 2) {
        newErrors.lastName = 'Last Name must be at least 2 characters';
        isValid = false;
      }

      requireField('email', formData.email, 'Work Email is required');
      if (formData.email && !validateEmail(formData.email)) {
        newErrors.email = 'Please enter a valid work email address';
        isValid = false;
      }

      requireField('password', formData.password, 'Password is required');
      if (formData.password && formData.password.length < 10) {
        newErrors.password = 'Password must be at least 10 characters long';
        isValid = false;
      }

      if (planType === 'network') {
        const phone = phoneString || formData.mobileNo;
        if (!phone || phone.length < 6) {
          newErrors.phone = 'Phone number is required for Network plans';
          isValid = false;
        }
      }

      if (!formData.tnc) {
        newErrors.tnc = 'You must agree to the Terms and Conditions and Privacy Policy';
        isValid = false;
      }
    } else if (step === 1) {
      // Step B
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
      // Step C
      requireField('sub_domain', formData.sub_domain, 'Subdomain Slug is required');
      if (formData.sub_domain && !/^[a-z0-9-]+$/.test(formData.sub_domain)) {
        newErrors.sub_domain = 'Subdomain can only contain lowercase letters, numbers, and hyphens';
        isValid = false;
      } else if (formData.sub_domain && (formData.sub_domain.length < 3 || formData.sub_domain.length > 30)) {
        newErrors.sub_domain = 'Subdomain must be between 3 and 30 characters';
        isValid = false;
      } else if (subdomainCheck.status === 'taken') {
        newErrors.sub_domain = subdomainCheck.message || 'Subdomain is not available';
        isValid = false;
      }

      if (planType === 'network') {
        requireField('tracking_hostname', formData.tracking_hostname, 'Tracking Hostname is required for Network plans');
        if (formData.tracking_hostname && !/^([a-z0-9]+(-[a-z0-9]+)*\.)+[a-z]{2,}$/i.test(formData.tracking_hostname)) {
          newErrors.tracking_hostname = 'Please enter a valid hostname (e.g. track.yourdomain.com)';
          isValid = false;
        }
      }
    } else if (step === 3) {
      // Step D
      requireField('stripe_key', formData.stripe_key, 'Stripe Secret Key is required');
      if (formData.stripe_key && !formData.stripe_key.startsWith('sk_')) {
        newErrors.stripe_key = 'Stripe Secret Key must start with "sk_" (e.g. sk_test_... or sk_live_...)';
        isValid = false;
      }
      if (formData.stripe_publishable_key && !formData.stripe_publishable_key.startsWith('pk_')) {
        newErrors.stripe_publishable_key = 'Stripe Publishable Key must start with "pk_" (e.g. pk_test_... or pk_live_...)';
        isValid = false;
      }
    }

    setErrors(newErrors);
    return isValid;
  };

  const renderError = (field: string) => {
    return errors[field] ? <span className="error-msg">{errors[field]}</span> : null;
  };

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

  // Subdomain live debounce checking
  const handleSubdomainChange = (val: string) => {
    const cleanVal = val.toLowerCase().replace(/[^a-z0-9-]/g, '');
    setFormData(prev => ({ ...prev, sub_domain: cleanVal }));
    if (errors.sub_domain) setErrors(prev => ({ ...prev, sub_domain: '' }));

    if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
    if (!cleanVal || cleanVal.length < 3) {
      setSubdomainCheck({ status: 'idle', message: '', fqdn: '' });
      return;
    }

    setSubdomainCheck({ status: 'checking', message: 'Checking availability...', fqdn: '' });
    debounceTimerRef.current = setTimeout(async () => {
      try {
        const res: any = await ApiClient.get('platform/subdomain/check', { slug: cleanVal });
        if (res?.success && res?.data?.available) {
          setSubdomainCheck({
            status: 'available',
            message: `Domain available: ${res.data.fqdn || `${cleanVal}.upfilly.com`}`,
            fqdn: res.data.fqdn || `${cleanVal}.upfilly.com`
          });
        } else {
          setSubdomainCheck({
            status: 'taken',
            message: res?.data?.reason || res?.message || 'This subdomain is already taken or reserved',
            fqdn: ''
          });
        }
      } catch (e) {
        setSubdomainCheck({ status: 'idle', message: '', fqdn: '' });
      }
    }, 450);
  };

  // STEP A SUBMISSION -> CHECKOUT-SESSION (Step 2 & Step 3)
  const handleStepASubmit = async () => {
    if (!validateStep(0)) return;
    setIsSubmitting(true);

    try {
      // Step A: Minimum Viable Identity & Account Creation
      const stepAPayload = {
        first_name: formData.firstName.trim(),
        last_name: formData.lastName.trim(),
        work_email: formData.email.trim().toLowerCase(),
        password: formData.password,
        phone: phoneString || (formData.dialCode + formData.mobileNo) || '+14155552671',
        job_title: formData.job_title || 'Owner',
        terms_and_conditions: formData.tnc,
        whitelabel_type: planType || 'merchant',
        plan_id: selectedPlanId || undefined
      };

      const stepARes: any = await ApiClient.post('platform/onboarding/step-a', stepAPayload);

      if (!stepARes?.success) {
        toast.error(stepARes?.message || 'Account creation failed. Please check your details.');
        setIsSubmitting(false);
        return;
      }

      const newTenantId = stepARes.data?.tenant_id || tenantId;
      const newSessionToken = stepARes.data?.session_token || sessionToken;

      setTenantId(newTenantId);
      setSessionToken(newSessionToken);
      if (typeof window !== 'undefined') {
        localStorage.setItem('tenant_id', newTenantId);
        localStorage.setItem('onboarding_session_token', newSessionToken);
        if (selectedPlanId) localStorage.setItem('onboarding_plan_id', selectedPlanId);
      }

      // Step 3 — Plan Payment: Call POST /platform/checkout-session
      const origin = typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000';
      const checkoutPayload = {
        tenant_id: newTenantId,
        session_token: newSessionToken,
        plan_id: selectedPlanId,
        success_url: `${origin}/onboarding/step-b?payment=success&session_token=${newSessionToken}&tenant_id=${newTenantId}`,
        cancel_url: `${origin}/white-label-pricing?payment=canceled`
      };

      const checkoutRes: any = await ApiClient.post('platform/checkout-session', checkoutPayload);

      // NOTE: $0 Free Trial plan automatically activates without credit card
      if (checkoutRes?.data?.free_plan || selectedPlanInfo.amount === 0 || checkoutRes?.data?.plan_name?.toLowerCase().includes('starter')) {
        toast.success(checkoutRes?.message || 'Free trial plan activated successfully!');
        setPaymentSuccessBanner(true);
        setCurrentStep(1);
        if (typeof window !== 'undefined') {
          window.history.pushState(
            {},
            '',
            `/onboarding/step-b?payment=success&session_token=${newSessionToken}&tenant_id=${newTenantId}`
          );
        }
        window.scrollTo(0, 0);
        return;
      }

      // Paid Plan: Redirect to Stripe Checkout URL
      const stripeUrl = checkoutRes?.data?.url || checkoutRes?.data?.checkout_url || checkoutRes?.url;
      if (stripeUrl) {
        toast.info('Redirecting to secure Stripe checkout...');
        window.location.href = stripeUrl;
      } else if (checkoutRes?.success) {
        // Fallback if backend marks plan active directly without Stripe URL
        toast.success(checkoutRes?.message || 'Plan activated! Proceeding to business details.');
        setPaymentSuccessBanner(true);
        setCurrentStep(1);
        if (typeof window !== 'undefined') {
          window.history.pushState(
            {},
            '',
            `/onboarding/step-b?payment=success&session_token=${newSessionToken}&tenant_id=${newTenantId}`
          );
        }
        window.scrollTo(0, 0);
      } else {
        toast.error(checkoutRes?.message || 'Payment initiation failed. Please try again.');
      }
    } catch (err: any) {
      console.error('Step A error:', err);
      toast.error('An error occurred during account creation. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // STEP B SUBMISSION
  const handleStepBSubmit = async () => {
    if (!validateStep(1)) return;
    setIsSubmitting(true);

    try {
      const activeSessionToken = sessionToken || (typeof window !== 'undefined' ? localStorage.getItem('onboarding_session_token') : '');
      const stepBPayload = {
        session_token: activeSessionToken,
        legal_company_name: formData.company_name,
        trading_name: formData.brand_name || formData.company_name,
        company_registration_number: formData.company_registration_number || undefined,
        vat_tax_id: formData.taxId || undefined,
        registered_address: {
          line1: formData.white_label_address.line1,
          line2: formData.white_label_address.line2 || '',
          city: formData.white_label_address.city,
          postal_code: formData.white_label_address.zip,
          country_code: formData.white_label_address.country || 'US'
        },
        billing_email: formData.billing_email,
        company_website: formData.company_url,
        industry: formData.industry || 'saas'
      };

      const stepBRes: any = await ApiClient.post('platform/onboarding/step-b', stepBPayload);
      if (stepBRes?.success) {
        toast.success(stepBRes.message || 'Business details saved successfully!');
        setCurrentStep(2);
        window.scrollTo(0, 0);
      } else {
        toast.error(stepBRes?.message || 'Failed to save business details.');
      }
    } catch (err) {
      console.error('Step B error:', err);
      toast.error('An error occurred while saving business details.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // STEP C SUBMISSION
  const handleStepCSubmit = async () => {
    if (!validateStep(2)) return;
    setIsSubmitting(true);

    try {
      const activeSessionToken = sessionToken || (typeof window !== 'undefined' ? localStorage.getItem('onboarding_session_token') : '');
      const cleanSubdomain = formData.sub_domain.trim().toLowerCase();
      const stepCPayload = {
        session_token: activeSessionToken,
        subdomain: cleanSubdomain,
        tracking_domain: formData.tracking_hostname ? formData.tracking_hostname.trim() : undefined
      };

      const stepCRes: any = await ApiClient.post('platform/onboarding/step-c', stepCPayload);
      if (stepCRes?.success) {
        toast.success(stepCRes.message || 'Domain configuration saved!');
        setCurrentStep(3);
        window.scrollTo(0, 0);
      } else {
        toast.error(stepCRes?.message || 'Failed to save domain configuration.');
      }
    } catch (err) {
      console.error('Step C error:', err);
      toast.error('An error occurred while saving domain configuration.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // STEP D SUBMISSION
  const handleStepDSubmit = async () => {
    if (!validateStep(3)) return;
    setIsSubmitting(true);

    try {
      const activeSessionToken = sessionToken || (typeof window !== 'undefined' ? localStorage.getItem('onboarding_session_token') : '');
      const stepDPayload = {
        session_token: activeSessionToken,
        stripe_publishable_key: formData.stripe_publishable_key || undefined,
        stripe_secret_key: formData.stripe_key,
        environment: formData.stripe_environment || 'test',
        statement_descriptor: formData.stripe_statement_descriptor || formData.brand_name || formData.company_name
      };

      const stepDRes: any = await ApiClient.post('platform/onboarding/step-d', stepDPayload);
      if (stepDRes?.success) {
        toast.success(stepDRes.message || 'White-label platform setup complete! Provisioning your dedicated portal...');
        const cleanSubdomain = formData.sub_domain.trim().toLowerCase();
        const user = crendentialModel.getUser();
        const token = typeof window !== 'undefined' ? localStorage.getItem('token') || '' : '';
        const targetUrl = buildTenantSubdomainUrl(cleanSubdomain, '/white-label-dashboard', { token, user });

        setTimeout(() => {
          if (typeof window !== 'undefined') {
            window.location.href = targetUrl;
          } else {
            router.push('/white-label-dashboard');
          }
        }, 1500);
      } else {
        toast.error(stepDRes?.message || 'Stripe key validation or provisioning failed. Please verify your keys.');
      }
    } catch (err) {
      console.error('Step D error:', err);
      toast.error('An error occurred during platform provisioning.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Stepper Navigation
  const nextStep = () => {
    if (currentStep === 0) {
      handleStepASubmit();
    } else if (currentStep === 1) {
      handleStepBSubmit();
    } else if (currentStep === 2) {
      handleStepCSubmit();
    } else if (currentStep === 3) {
      handleStepDSubmit();
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(curr => curr - 1);
      window.scrollTo(0, 0);
    }
  };

  // Form Step Views
  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <div className="onboarding-form-grid">
            <div className="form-group">
              <label>First Name <span className="req">*</span></label>
              <div className="input-with-icon">
                <LuUser className="input-icon" />
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  required
                  placeholder="John"
                />
              </div>
              {renderError('firstName')}
            </div>

            <div className="form-group">
              <label>Last Name <span className="req">*</span></label>
              <div className="input-with-icon">
                <LuUser className="input-icon" />
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  required
                  placeholder="Doe"
                />
              </div>
              {renderError('lastName')}
            </div>

            <div className="form-group">
              <label>Work Email <span className="req">*</span></label>
              <div className="input-with-icon">
                <LuMail className="input-icon" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  placeholder="john@company.com"
                />
              </div>
              {renderError('email')}
            </div>

            <div className="form-group">
              <label>Password <span className="req">*</span></label>
              <div className="password-input-wrapper">
                <LuLock className="input-icon" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  placeholder="Min. 10 characters"
                />
                <button
                  type="button"
                  className="toggle-pwd-btn"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label="Toggle password visibility"
                >
                  {showPassword ? <LuEyeOff size={18} /> : <LuEye size={18} />}
                </button>
              </div>
              <small className="field-hint">Must be at least 10 characters</small>
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
                  inputStyle={{
                    borderColor: errors.phone ? '#ef4444' : undefined,
                    width: '100%',
                    paddingLeft: '48px',
                    height: '45px',
                    borderRadius: '8px',
                    border: '1px solid #cbd5e1',
                    fontSize: '14px',
                    color: '#0f172a'
                  }}
                  buttonStyle={{
                    borderColor: errors.phone ? '#ef4444' : undefined,
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
                <input
                  type="text"
                  name="job_title"
                  value={formData.job_title}
                  onChange={handleChange}
                  placeholder="e.g. Founder, Head of Partnerships"
                />
              </div>
            </div>

            <div className="form-group full-width checkbox-group">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  name="tnc"
                  checked={formData.tnc}
                  onChange={handleChange}
                  required
                />
                <span className="checkbox-text">
                  I agree to the Terms and Conditions and Privacy Policy <span className="req">*</span>
                </span>
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
                <input
                  type="text"
                  name="company_name"
                  value={formData.company_name}
                  onChange={handleChange}
                  required
                  placeholder="Acme Digital Ltd"
                />
              </div>
              {renderError('company_name')}
            </div>

            <div className="form-group">
              <label>Trading / Brand Name</label>
              <div className="input-with-icon">
                <LuShieldCheck className="input-icon" />
                <input
                  type="text"
                  name="brand_name"
                  value={formData.brand_name}
                  onChange={handleChange}
                  placeholder="Defaults to Legal Name if empty"
                />
              </div>
            </div>

            <div className="form-group">
              <label>Company Reg. Number</label>
              <input
                type="text"
                name="company_registration_number"
                value={formData.company_registration_number}
                onChange={handleChange}
                placeholder="e.g. 12345678"
              />
            </div>

            <div className="form-group">
              <label>VAT / Tax ID</label>
              <input
                type="text"
                name="taxId"
                value={formData.taxId}
                onChange={handleChange}
                placeholder="Required for EU / UK reverse charge"
              />
            </div>

            <h4 className="form-section-title full-width"><LuMapPin /> Registered Address</h4>

            <div className="form-group full-width">
              <label>Address Line 1 <span className="req">*</span></label>
              <input
                type="text"
                name="line1"
                value={formData.white_label_address.line1}
                onChange={handleAddressChange}
                required
                placeholder="100 Bishopsgate"
              />
              {renderError('line1')}
            </div>

            <div className="form-group full-width">
              <label>Address Line 2</label>
              <input
                type="text"
                name="line2"
                value={formData.white_label_address.line2}
                onChange={handleAddressChange}
                placeholder="Suite / Floor 18"
              />
            </div>

            <div className="form-group">
              <label>City <span className="req">*</span></label>
              <input
                type="text"
                name="city"
                value={formData.white_label_address.city}
                onChange={handleAddressChange}
                required
                placeholder="London"
              />
              {renderError('city')}
            </div>

            <div className="form-group">
              <label>State / Province</label>
              <input
                type="text"
                name="state"
                value={formData.white_label_address.state}
                onChange={handleAddressChange}
                placeholder="State or Region"
              />
            </div>

            <div className="form-group">
              <label>Postal Code <span className="req">*</span></label>
              <input
                type="text"
                name="zip"
                value={formData.white_label_address.zip}
                onChange={handleAddressChange}
                required
                placeholder="EC2N 4AG"
              />
              {renderError('zip')}
            </div>

            <div className="form-group">
              <label>Country <span className="req">*</span></label>
              <select
                name="country"
                value={formData.white_label_address.country}
                onChange={handleAddressChange}
                required
              >
                <option value="US">United States (US)</option>
                <option value="GB">United Kingdom (GB)</option>
                <option value="CA">Canada (CA)</option>
                <option value="AU">Australia (AU)</option>
                <option value="DE">Germany (DE)</option>
                <option value="FR">France (FR)</option>
                <option value="IE">Ireland (IE)</option>
                <option value="NL">Netherlands (NL)</option>
                <option value="ES">Spain (ES)</option>
                <option value="IT">Italy (IT)</option>
                <option value="SE">Sweden (SE)</option>
                <option value="CH">Switzerland (CH)</option>
                <option value="SG">Singapore (SG)</option>
                <option value="IN">India (IN)</option>
                <option value="AE">United Arab Emirates (AE)</option>
              </select>
              {renderError('country')}
            </div>

            <h4 className="form-section-title full-width"><LuInfo /> Invoicing & Web Details</h4>

            <div className="form-group">
              <label>Billing Email <span className="req">*</span></label>
              <div className="input-with-icon">
                <LuMail className="input-icon" />
                <input
                  type="email"
                  name="billing_email"
                  value={formData.billing_email}
                  onChange={handleChange}
                  required
                  placeholder="finance@company.com"
                />
              </div>
              {renderError('billing_email')}
            </div>

            <div className="form-group">
              <label>Company Website <span className="req">*</span></label>
              <div className="input-with-icon">
                <LuGlobe className="input-icon" />
                <input
                  type="url"
                  name="company_url"
                  value={formData.company_url}
                  onChange={handleChange}
                  required
                  placeholder="https://company.com"
                />
              </div>
              {renderError('company_url')}
            </div>

            <div className="form-group full-width">
              <label>Industry / Vertical <span className="req">*</span></label>
              <select
                name="industry"
                value={formData.industry}
                onChange={handleChange}
                required
              >
                <option value="saas">SaaS & Technology</option>
                <option value="ecommerce">E-Commerce & Retail</option>
                <option value="finance">Finance & FinTech</option>
                <option value="agency">Agency & Marketing Network</option>
                <option value="media">Publishing & Media</option>
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
                  onChange={(e) => handleSubdomainChange(e.target.value)}
                  required
                  placeholder="yourbrand"
                  pattern="[a-z0-9-]+"
                />
                <span className="domain-suffix">.upfilly.com</span>
              </div>
              <small className="field-hint">Lowercase letters (a-z), numbers (0-9), and hyphens. 3-30 characters.</small>

              {subdomainCheck.status === 'checking' && (
                <div className="subdomain-status-wrapper checking">
                  <span>Checking availability...</span>
                </div>
              )}
              {subdomainCheck.status === 'available' && (
                <div className="subdomain-status-wrapper available">
                  <LuCircleCheck size={15} />
                  <span>{subdomainCheck.message}</span>
                </div>
              )}
              {subdomainCheck.status === 'taken' && (
                <div className="subdomain-status-wrapper taken">
                  <LuCircleAlert size={15} />
                  <span>{subdomainCheck.message}</span>
                </div>
              )}
              {renderError('sub_domain')}
            </div>

            {planType === 'network' && (
              <>
                <div className="form-group full-width separator-line"></div>
                <div className="form-group full-width">
                  <label>Network Tracking Hostname <span className="req">*</span></label>
                  <p className="field-desc">
                    Parent domain must be customer-owned. We will configure a CNAME routing target (cname.upfilly.com) for you.
                  </p>
                  <div className="input-with-icon">
                    <LuGlobe className="input-icon" />
                    <input
                      type="text"
                      name="tracking_hostname"
                      value={formData.tracking_hostname}
                      onChange={handleChange}
                      required
                      placeholder="track.yournetwork.com"
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
              <p>
                Bring-Your-Own-Key (BYOK) Stripe connection. All affiliate tracking and payouts in your tenant will run directly through your Stripe account.
              </p>
            </div>

            <div className="form-group full-width">
              <label>Stripe Publishable Key</label>
              <div className="input-with-icon">
                <LuLock className="input-icon" />
                <input
                  type="text"
                  name="stripe_publishable_key"
                  value={formData.stripe_publishable_key}
                  onChange={handleChange}
                  placeholder="pk_test_... or pk_live_..."
                />
              </div>
              {renderError('stripe_publishable_key')}
            </div>

            <div className="form-group full-width">
              <label>Stripe Secret Key <span className="req">*</span></label>
              <div className="password-input-wrapper">
                <LuLock className="input-icon" />
                <input
                  type={showStripeKey ? 'text' : 'password'}
                  name="stripe_key"
                  value={formData.stripe_key}
                  onChange={handleChange}
                  required
                  placeholder="sk_test_... or sk_live_..."
                />
                <button
                  type="button"
                  className="toggle-pwd-btn"
                  onClick={() => setShowStripeKey(!showStripeKey)}
                  aria-label="Toggle stripe key visibility"
                >
                  {showStripeKey ? <LuEyeOff size={18} /> : <LuEye size={18} />}
                </button>
              </div>
              <small className="field-hint">Validated live with Stripe. AES-256 encrypted at rest.</small>
              {renderError('stripe_key')}
            </div>

            <div className="form-group full-width">
              <label>Environment <span className="req">*</span></label>
              <div className="wl-toggle-group">
                <label className={`wl-toggle-btn ${formData.stripe_environment === 'test' ? 'active' : ''}`}>
                  <input
                    type="radio"
                    name="stripe_environment"
                    value="test"
                    checked={formData.stripe_environment === 'test'}
                    onChange={handleChange}
                  />
                  Test Mode
                </label>
                <label className={`wl-toggle-btn ${formData.stripe_environment === 'live' ? 'active' : ''}`}>
                  <input
                    type="radio"
                    name="stripe_environment"
                    value="live"
                    checked={formData.stripe_environment === 'live'}
                    onChange={handleChange}
                  />
                  Live Mode
                </label>
              </div>
            </div>

            <div className="form-group">
              <label>Default Currency <span className="req">*</span></label>
              <select
                name="stripe_currency"
                value={formData.stripe_currency}
                onChange={handleChange}
                required
              >
                <option value="USD">USD ($)</option>
                <option value="EUR">EUR (€)</option>
                <option value="GBP">GBP (£)</option>
                <option value="AUD">AUD ($)</option>
                <option value="CAD">CAD ($)</option>
              </select>
            </div>

            <div className="form-group">
              <label>Statement Descriptor</label>
              <input
                type="text"
                name="stripe_statement_descriptor"
                value={formData.stripe_statement_descriptor}
                onChange={handleChange}
                placeholder="e.g. APEX NETWORK"
              />
              <small className="field-hint">Defaults to brand trading name</small>
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
            <h2>White Label Onboarding</h2>
            <p>Complete the setup to provision your dedicated branded platform.</p>
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

            {/* Selected Plan Summary Banner */}
            {selectedPlanInfo.name && (
              <div className="selected-plan-banner">
                <div className="plan-info-left">
                  <div className="plan-icon-badge">
                    <LuSparkles size={18} />
                  </div>
                  <div className="plan-title-area">
                    <div className="plan-label">Selected Plan</div>
                    <div className="plan-name-price">
                      {selectedPlanInfo.name}
                      <span className="plan-price-tag">
                        {selectedPlanInfo.amount === 0 ? '— Free Plan ($0)' : selectedPlanInfo.amount !== null ? `— $${selectedPlanInfo.amount}/month` : ''}
                      </span>
                    </div>
                  </div>
                </div>
                <span className="change-plan-link" onClick={() => router.push('/white-label-pricing')}>
                  Change Plan
                </span>
              </div>
            )}

            {/* Payment Success Notification Banner */}
            {paymentSuccessBanner && currentStep >= 1 && (
              <div className="payment-success-banner">
                <div className="success-banner-icon">
                  <LuCheck size={20} />
                </div>
                <div className="success-banner-content">
                  <h4>Plan Active &amp; Payment Confirmed</h4>
                  <p>
                    Your white-label subscription plan is now active! Please complete your business details and domain configuration to provision your portal.
                  </p>
                </div>
              </div>
            )}

            <h3 className="content-title">{STEPS[currentStep]?.title}</h3>
            {renderStepContent()}
          </div>

          {/* Footer Actions */}
          <div className="onboarding-footer">
            <button
              type="button"
              className={`btn-primary ${currentStep === 0 ? 'hidden' : ''}`}
              onClick={prevStep}
              disabled={isSubmitting}
            >
              <LuChevronLeft /> Back
            </button>

            {currentStep === 0 && (
              <button
                type="button"
                className="btn-primary"
                onClick={handleStepASubmit}
                disabled={isSubmitting}
              >
                {isSubmitting
                  ? 'Processing...'
                  : selectedPlanInfo.amount === 0
                  ? 'Activate Free Plan & Continue'
                  : 'Continue to Payment'}{' '}
                <LuChevronRight />
              </button>
            )}

            {currentStep === 1 && (
              <button
                type="button"
                className="btn-primary"
                onClick={handleStepBSubmit}
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Saving Business Details...' : 'Continue to Domains'} <LuChevronRight />
              </button>
            )}

            {currentStep === 2 && (
              <button
                type="button"
                className="btn-primary"
                onClick={handleStepCSubmit}
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Configuring Domain...' : 'Continue to Stripe Setup'} <LuChevronRight />
              </button>
            )}

            {currentStep === 3 && (
              <button
                type="button"
                className="btn-primary"
                onClick={handleStepDSubmit}
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Provisioning Dedicated Database...' : 'Complete Setup & Launch Dashboard'} <LuCheck />
              </button>
            )}
          </div>

        </div>
      </div>
    </Layout>
  );
}

export default function WhiteLabelOnboarding(props: WhiteLabelOnboardingProps) {
  return (
    <Suspense fallback={
      <div className="wl-onboarding-wrapper" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
        <img src="/assets/img/loader.gif" alt="Loading..." style={{ width: '60px', height: '60px' }} />
      </div>
    }>
      <OnboardingContent {...props} />
    </Suspense>
  );
}
