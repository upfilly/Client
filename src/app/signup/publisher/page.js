'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import PageContainer from '../../components/main/PageContainer'
import "./style.scss";
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import ApiClient from "../../../methods/api/apiClient";
import loader from '@/methods/loader';
import crendentialModel from "../../../models/credential.model";
import FacebookLogin from '@greatsumini/react-facebook-login';
import axios from 'axios';
import useReferralTracking from "../../firstPromoter"
import { toast } from 'react-toastify';
import methodModel from '@/methods/methods';
import Layout from '@/app/components/global/layout2';

export default function SignupBrand() {
  const role = "affiliate"
  const [form, setForm] = useState({});
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false)
  const [showPopup, setShowPopup] = useState(false);
  const [ip, setIP] = useState("");
  const [settingData, setSettingData] = useState([])
  const [detailData, setDetailData] = useState(null)
  const [eyes, setEyes] = useState({ password: false, confirmPassword: false, currentPassword: false });
  const [showForm, setShowForm] = useState(false);
  const [usernameAvailable, setUsernameAvailable] = useState(null);
  const [checkingUsername, setCheckingUsername] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const param = useSearchParams()
  const code = param.get("campaign_code") || ''
  const eventType = param.get("event_type")
  const referralCode = param.get("referral_code") || ''
  const BrandId = param.get("brandId") || null
  const invite_email = param.get("invite_email") || null
  const history = useRouter()
  const user = crendentialModel.getUser()

  // if (user) {
  //   history.push('/')
  // }

  const getData = async () => {
    const res = await axios.get("https://api.ipify.org?format=json");
    setIP(res.data.ip);
  };

  useEffect(() => {
    getData();
    if (invite_email) {
      setForm(prev => ({ ...prev, email: invite_email }))
    }
  }, []);

  useEffect(() => {
    ApiClient.get(`user/detail`, { id: BrandId }).then(res => {
      if (res.success) {
        setDetailData(res?.data)
      }
    })
  }, [])

  useEffect(() => {
    ApiClient.get('settings').then(res => {
      if (res.success) {
        setSettingData(res?.data)
      }
    })
  }, [])

  const checkUsernameExists = async (username) => {
    try {
      const response = await ApiClient.post('userName/check', { userName: username });
      return response.success;
    } catch (error) {
      console.error('Error checking username:', error);
      return true;
    }
  };

  useEffect(() => {
    const timer = setTimeout(async () => {
      if (form.userName && form.userName.length >= 3 && /^[a-zA-Z0-9_]+$/.test(form.userName)) {
        setCheckingUsername(true);
        const exists = await checkUsernameExists(form.userName);
        setUsernameAvailable(exists);
        setCheckingUsername(false);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [form.userName]);

  const validateForm = () => {
    let isValid = true;
    const newErrors = {};

    // Validate first name
    if (!form.firstName?.trim()) {
      newErrors.firstName = "First name is required";
      isValid = false;
    } else if (form.firstName.trim().length < 3) {
      newErrors.firstName = "First name must be at least 3 characters";
      isValid = false;
    }

    // Validate last name for affiliate
    if (role !== 'brand') {
      if (!form.lastName?.trim()) {
        newErrors.lastName = "Last name is required";
        isValid = false;
      } else if (form.lastName.trim().length < 2) {
        newErrors.lastName = "Last name must be at least 2 characters";
        isValid = false;
      }
    }

    // Validate username
    if (!form.userName) {
      newErrors.userName = "Username is required";
      isValid = false;
    } else if (form.userName.length < 3) {
      newErrors.userName = "Username must be at least 3 characters";
      isValid = false;
    } else if (!/^[a-zA-Z0-9_]+$/.test(form.userName)) {
      newErrors.userName = "Username can only contain letters, numbers and underscores";
      isValid = false;
    }

    // Validate email
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!form.email) {
      newErrors.email = "Email is required";
      isValid = false;
    } else if (!emailRegex.test(form.email)) {
      newErrors.email = "Please enter a valid email address";
      isValid = false;
    }

    // Validate password
    if (!form.password) {
      newErrors.password = "Password is required";
      isValid = false;
    } else if (form.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const googleLogin = () => {
    ApiClient.get('google/login/authentication').then((res) => {
      localStorage.setItem('campaign_unique_id', code)
      window?.open(res?.data)
    })
  }

  const FaceBookLoginHandler = (e) => {
    loader(true)
    const FullName = e?.name || ""
    const data = {
      "role": "affiliate",
      campaign_unique_id: code,
      device_token: localStorage.getItem("device_token") || '',
      "email": e?.email || "",
      "facebook_auth_id": e?.id || "",
      "firstName": FullName?.split(" ")[0] || "",
      "lastName": FullName?.split(" ")[1] || "",
      "fullName": FullName,
    }
    if (data?.email) {
      ApiClient.post('user/social-lggin', data).then((res) => {
        if (res.success == true) {
          localStorage?.removeItem('campaign_unique_id')
          localStorage.setItem('token', res.data.access_token)
          crendentialModel.setUser(res.data)
          let url = '/dashboard'
          history.push(url);
        }
      })
      loader(false)
    } else {
      loader(false)
      return
    }
  }

  const hendleSubmit = async (e) => {
    e.preventDefault()
    setSubmitted(true)
    setIsSubmitting(true)

    if (!validateForm()) {
      setIsSubmitting(false)
      return;
    }

    if (usernameAvailable === false) {
      toast.error("Please choose a different username");
      setIsSubmitting(false)
      return;
    }

    if (usernameAvailable === null && form.userName) {
      setCheckingUsername(true);
      const exists = await checkUsernameExists(form.userName);
      setCheckingUsername(false);

      if (exists) {
        setUsernameAvailable(false);
        toast.error("Username is already taken");
        setIsSubmitting(false)
        return;
      }
      setUsernameAvailable(true);
    }

    let data;
    if (localStorage.getItem("device_token")) {
      data = {
        ...form,
        role: role,
        device_token: localStorage.getItem("device_token"),
        "request_status": "accepted",
        brand_id: BrandId
      };
    } else {
      data = {
        ...form,
        role: role,
        device_token: '',
        "request_status": "accepted",
        "brand_id": BrandId
      };
    }

    loader(true)
    ApiClient.post('userRegisterByBrandId', data).then(res => {
      setIsSubmitting(false)
      if (res.success == true) {
        const data1 = {
          campaign_unique_id: code,
          event_type: eventType,
          ip_address: ip
        }

        if (!data1?.campaign_unique_id) {
          loader(false)
          setShowPopup(true)
        }
      } else {
        loader(false);

        // Handle the specific error format
        if (res.error && res.error.message) {
          if (res.error.message.includes("Email-Id already exists")) {
            setErrors({
              ...errors,
              email: "Email address already exists. Please use a different email."
            });
          } else {
            toast.error(res.error.message);
          }
        } else if (res.errors) {
          const apiErrors = {};
          if (res.errors.email) apiErrors.email = res.errors.email;
          if (res.errors.password) apiErrors.password = res.errors.password;
          if (res.errors.firstName) apiErrors.firstName = res.errors.firstName;
          if (res.errors.lastName) apiErrors.lastName = res.errors.lastName;
          if (res.errors.userName) apiErrors.userName = res.errors.userName;

          setErrors({ ...errors, ...apiErrors });
        } else if (res.message) {
          toast.error(res.message);
        }
      }
    }).catch(err => {
      loader(false);
      setIsSubmitting(false)
      toast.error("An error occurred. Please try again.");
    });
  };

  const handlePasswordChange = (e) => {
    const newPassword = e.target.value.replace(/\s/g, "");
    setForm({ ...form, password: newPassword });
  };

  const handleClick = () => {
    setShowPopup(false)
    let url = '/login'
    history.push(url);
  }

  const handleApplyNow = () => {
    setShowForm(true);
  }

  const handleBack = () => {
    setShowForm(false);
  }

  return (
     <Layout
      handleKeyPress={undefined}
      setFilter={undefined}
      reset={undefined}
      filter={undefined}
      name={undefined}
      filters={undefined}
    >
      <div className='signup-brand-page'>
        <div className="container h-100 d-flex align-items-center">
          <div className="row justify-content-center w-100">
            <div className="col-12 col-lg-8 col-xl-6">
              <div className='right_side'>
                {/* Brand Header */}
                <div className="brand-header">
                  {detailData && detailData.logo1 && (
                    <img
                      src={methodModel.nologoImg(detailData.logo1)}
                      className="brand-logo"
                      alt={detailData.name || "Brand Logo"}
                    />
                  )}
                  <h1>Join {detailData?.name || "Our Brand"} Program</h1>
                  <p>Start earning commissions by promoting amazing products</p>
                </div>

                <div className="content-wrapper">
                  {!showForm ? (
                    <div className="welcome-content">
                      <div className="apply-section mb-4">
                        <button
                          className="btn btn-primary btn-lg mb-4 apply-btn"
                          onClick={handleApplyNow}
                        >
                          APPLY NOW
                        </button>

                        <div className="login-prompt mb-4">
                          <p className="mb-2">
                            To join this brand program, you must have an active Upfilly account.
                          </p>
                          <p>
                            Already an Upfilly affiliate? <Link href="/login" className="login-link">Log in and join the program.</Link>
                          </p>
                        </div>
                      </div>

                      {/* Benefits Section */}
                      <div className="benefits-section">
                        <h3 className="h4 mb-3">Start Earning with Upfilly Today:</h3>
                        {detailData?.affiliateSignupText ? (
                          <div dangerouslySetInnerHTML={{ __html: detailData.affiliateSignupText }} />
                        ) : (
                          <p>Join our affiliate program and start earning competitive commissions by promoting our products. Get access to marketing materials, track your performance in real-time, and receive timely payments.</p>
                        )}
                      </div>

                      {/* Footer */}
                      <div className="mt-4 pt-3 border-top">
                        <small className="text-muted">
                          © 2025 Upfilly LLC
                        </small>
                      </div>
                    </div>
                  ) : (
                    <div className="signup-form">
                      {showForm && (
                        <button
                          className="btn btn-link back-button mb-3 p-0"
                          onClick={handleBack}
                        >
                          ← Back
                        </button>
                      )}

                      <div className="form-header">
                        <h2>Create Your Account</h2>
                        <p>Join {detailData?.name || "the brand"} program in minutes</p>
                      </div>

                      <form onSubmit={hendleSubmit}>
                        <div className="row">
                          <div className="col-md-6 mb-3">
                            <div className="form-group">
                              <input
                                type="text"
                                className={`form-control ${submitted && errors.firstName ? 'is-invalid' : ''}`}
                                placeholder="First Name *"
                                value={form.firstName || ''}
                                onChange={(e) => {
                                  setForm({ ...form, firstName: e.target.value })
                                  if (submitted) validateForm();
                                }}
                              />
                              {submitted && errors.firstName && (
                                <div className="invalid-feedback d-block">{errors.firstName}</div>
                              )}
                            </div>
                          </div>

                          <div className="col-md-6 mb-3">
                            <div className="form-group">
                              <input
                                type="text"
                                className={`form-control ${submitted && errors.lastName ? 'is-invalid' : ''}`}
                                placeholder="Last Name *"
                                value={form.lastName || ''}
                                onChange={(e) => {
                                  setForm({ ...form, lastName: e.target.value })
                                  if (submitted) validateForm();
                                }}
                              />
                              {submitted && errors.lastName && (
                                <div className="invalid-feedback d-block">{errors.lastName}</div>
                              )}
                            </div>
                          </div>
                        </div>

                        <div className="mb-3">
                          <div className="form-group">
                            <input
                              type="email"
                              className={`form-control ${submitted && errors.email ? 'is-invalid' : ''}`}
                              placeholder='Email Address *'
                              value={form.email || ''}
                              onChange={(e) => {
                                setForm({ ...form, email: e.target.value })
                                if (submitted) validateForm();
                              }}
                            />
                            {submitted && errors.email && (
                              <div className="invalid-feedback d-block">{errors.email}</div>
                            )}
                          </div>
                        </div>

                        <div className="mb-3">
                          <div className="form-group">
                            <input
                              type="text"
                              className={`form-control ${submitted && errors.userName ? 'is-invalid' : ''}`}
                              placeholder='Username *'
                              value={form.userName || ''}
                              onChange={(e) => {
                                const value = e.target.value.replace(/\s/g, "");
                                setForm({ ...form, userName: value });
                                setUsernameAvailable(null);
                                if (submitted) validateForm();
                              }}
                            />
                            {submitted && errors.userName && (
                              <div className="invalid-feedback d-block">{errors.userName}</div>
                            )}
                            {!errors.userName && form.userName && (
                              <div className="username-status">
                                {checkingUsername ? (
                                  <span className="checking">Checking username...</span>
                                ) : usernameAvailable === true ? (
                                  <span className="available">✓ Username is available</span>
                                ) : usernameAvailable === false ? (
                                  <span className="taken">✗ Username is already taken</span>
                                ) : null}
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="mb-4">
                          <div className="form-group password-input">
                            <input
                              type={eyes.password ? 'text' : 'password'}
                              className={`form-control ${submitted && errors.password ? 'is-invalid' : ''}`}
                              value={form.password || ''}
                              onChange={handlePasswordChange}
                              placeholder="Password *"
                            />
                            <button
                              type="button"
                              className="toggle-password"
                              onClick={() => setEyes({ ...eyes, password: !eyes.password })}
                            >
                              {eyes.password ? '👁️' : '👁️‍🗨️'}
                            </button>
                            {submitted && errors.password && (
                              <div className="invalid-feedback d-block">{errors.password}</div>
                            )}
                            <small className="form-text text-muted">
                              Password must be at least 8 characters long
                            </small>
                          </div>
                        </div>

                        <button
                          type="submit"
                          className="btn btn-primary submit-btn"
                          disabled={isSubmitting}
                        >
                          {isSubmitting ? 'Creating Account...' : 'Create Account'}
                        </button>

                        <div className="terms-text mt-3">
                          By signing up, you agree to our{' '}
                          <Link href="/terms">Terms of Service</Link> and{' '}
                          <Link href="/privacy">Privacy Policy</Link>
                        </div>

                        <div className="divider">
                          <span>Or continue with</span>
                        </div>

                        <div className="social-buttons">
                          <button
                            type="button"
                            className="social-btn google-btn"
                            onClick={googleLogin}
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                              <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                              <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                              <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                              <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                            </svg>
                            Sign up with Google
                          </button>

                          <FacebookLogin
                            appId="425676736552748"
                            fields="name,email,picture"
                            render={(renderProps) => (
                              <button
                                type="button"
                                className="social-btn facebook-btn"
                                onClick={renderProps.onClick}
                              >
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                                  <path fill="currentColor" d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                                </svg>
                                Sign up with Facebook
                              </button>
                            )}
                            callback={FaceBookLoginHandler}
                          />
                        </div>

                        <div className="login-link">
                          Already have an account? <Link href="/login">Login here</Link>
                        </div>
                      </form>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Success Modal */}
        {showPopup && (
          <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content success-modal">
                <div className="modal-body">
                  <div className="success-icon">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                      <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                    </svg>
                  </div>
                  <h4 className="success-title">Successfully Registered!</h4>
                  <p className="success-message">
                    We have sent a verification link to your email address.
                    Please check your inbox and click the verification link to activate your account.
                  </p>
                  <button
                    className="btn ok-btn"
                    onClick={handleClick}
                  >
                    OK
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  )
}