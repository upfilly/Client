'use client'

import React, { useState, useEffect } from 'react';
import Layout from '../components/global/layout/index';
import crendentialModel from '@/models/credential.model';
import ApiClient from '@/methods/api/apiClient';
import { toast } from 'react-toastify';
import {
  LuGlobe, LuMail, LuShieldCheck, LuSparkles, LuCircleCheck,
  LuRefreshCw, LuCopy, LuExternalLink, LuSearch, LuPlus,
  LuEye, LuMessageSquare, LuTrash2, LuSettings, LuLayers,
  LuCreditCard, LuUserCheck, LuArrowUpRight,
  LuActivity, LuChartColumn, LuInfo, LuEyeOff, LuLock, LuPencil
} from 'react-icons/lu';
import { useRouter } from 'next/navigation';
import './style.scss';
import AdminChatWidget from './AdminChatWidget';

export default function WhiteLabelDashboard() {
  const router = useRouter();
  const user = crendentialModel.getUser();
  const [activeTab, setActiveTab] = useState<'subdomain' | 'contact' | 'overview' | 'settings'>('subdomain');
  
  // Local tenant config state initialized from onboarding
  const [tenantConfig, setTenantConfig] = useState<any>({
    subdomainSlug: 'mybrand',
    trackingHostname: 'affiliates.mybrand.com',
    legalCompanyName: 'My Brand Enterprise',
    tradingName: 'MyBrand',
    billingEmail: 'admin@mybrand.com',
    cnameTarget: 'cname.upfilly.io',
    sslStatus: 'active',
    dnsStatus: 'verified',
    planName: 'White Label Growth Plan',
    stripeKey: 'sk_test_51Nx...789',
    environment: 'test',
    defaultCurrency: 'USD'
  });

  // Dashboard Protection Flow & Data Hydration
  useEffect(() => {
    const uid = user?.id || user?._id;
    if (!uid) {
      router.push('/login');
      return;
    }

    ApiClient.get('user/detail', { id: uid }).then((res: any) => {
      if (res?.success && res?.data) {
        const userData = res.data;
        
        if (userData?.plan_id?.plan_type !== "paid" && userData?.plan_id?.plan_type !== "free") {
          router.push('/white-label-pricing');
        } else if (!userData.white_label_progress.a && !userData.white_label_progress.b && !userData.white_label_progress.c && !userData.white_label_progress.d) {
          // Plan exists but no subdomain or stripe key, meaning onboarding is not filled
          router.push('/white-label-onboarding');
        } else {
          // Hydrate dashboard fields from API
          setTenantConfig((prev: any) => ({
            ...prev,
            subdomainSlug: userData.sub_domain || prev.subdomainSlug,
            trackingHostname: userData.tracking_hostname || prev.trackingHostname,
            legalCompanyName: userData.company_name || prev.legalCompanyName,
            tradingName: userData.brand_name || userData.company_name || prev.tradingName,
            billingEmail: userData.billing_email || userData.email || prev.billingEmail,
            stripeKey: userData.stripe_key || prev.stripeKey,
            environment: userData.stripe_environment || prev.environment,
            defaultCurrency: userData.stripe_currency || prev.defaultCurrency,
            planName: userData.plan_id?.name || prev.planName,
          }));
        }
      }
    }).catch(err => {
      console.error("Failed to fetch user details for protection", err);
    });
  }, [user?.id, user?._id, router]);

  // --- OLD LOGIC ---
  // // Load stored tenant config if available
  // useEffect(() => {
  //   const stored = localStorage.getItem('whiteLabelTenant');
  //   if (stored) {
  //     try {
  //       const parsed = JSON.parse(stored);
  //       setTenantConfig((prev: any) => ({
  //         ...prev,
  //         ...parsed,
  //         subdomainSlug: parsed.subdomainSlug || prev.subdomainSlug,
  //         tradingName: parsed.tradingName || parsed.legalCompanyName || prev.tradingName
  //       }));
  //     } catch (e) {
  //       console.error("Error reading stored white label config", e);
  //     }
  //   }
  // }, []);
  // -----------------

  // Sub-domain configuration state
  const [subdomainInput, setSubdomainInput] = useState(tenantConfig.subdomainSlug);
  const [customDomainInput, setCustomDomainInput] = useState(tenantConfig.trackingHostname);
  const [isVerifyingDNS, setIsVerifyingDNS] = useState(false);
  const [isSavingSubdomain, setIsSavingSubdomain] = useState(false);

  // Stripe configuration state
  const [stripeInput, setStripeInput] = useState(tenantConfig.stripeKey);
  const [stripeEnvInput, setStripeEnvInput] = useState(tenantConfig.environment);
  const [stripeCurrencyInput, setStripeCurrencyInput] = useState(tenantConfig.defaultCurrency);
  const [isSavingStripe, setIsSavingStripe] = useState(false);
  const [showStripeKey, setShowStripeKey] = useState(false);

  // Edit states
  const [isEditingSubdomain, setIsEditingSubdomain] = useState(false);
  const [isEditingStripe, setIsEditingStripe] = useState(false);

  useEffect(() => {
    setSubdomainInput(tenantConfig.subdomainSlug || 'mybrand');
    setCustomDomainInput(tenantConfig.trackingHostname || 'affiliates.mybrand.com');
    setStripeInput(tenantConfig.stripeKey || '');
    setStripeEnvInput(tenantConfig.environment || 'test');
    setStripeCurrencyInput(tenantConfig.defaultCurrency || 'USD');
  }, [tenantConfig]);

  // Contact Module State
  const [contacts, setContacts] = useState([
    {
      id: 'CNT-101',
      name: 'Sarah Connor',
      email: 'sarah@cyberdyne.io',
      phone: '+1 (555) 019-2834',
      company: 'Cyberdyne Systems',
      subject: 'White Label Enterprise Inquiry',
      message: 'We are interested in setting up 500+ affiliate accounts on our custom subdomain. Please provide API access details.',
      status: 'New',
      date: '2026-08-18 09:30'
    },
    {
      id: 'CNT-102',
      name: 'Michael Scott',
      email: 'mscott@dundermifflin.com',
      phone: '+1 (555) 014-9921',
      company: 'Dunder Mifflin',
      subject: 'Custom Domain SSL Verification',
      message: 'Our CNAME record track.dundermifflin.com has been configured. Kindly verify SSL status.',
      status: 'In Progress',
      date: '2026-08-17 14:15'
    },
    {
      id: 'CNT-103',
      name: 'Alex Mercer',
      email: 'alex@gentek.com',
      phone: '+1 (555) 018-3341',
      company: 'GenTek Mobility',
      subject: 'Stripe Payment Gateway Integration',
      message: 'Question regarding multi-currency support in the white label contact portal.',
      status: 'Resolved',
      date: '2026-08-15 11:05'
    }
  ]);

  const [contactSearch, setContactSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [selectedContact, setSelectedContact] = useState<any>(null);
  const [replyMessage, setReplyMessage] = useState('');
  const [showAddContactModal, setShowAddContactModal] = useState(false);
  const [newContact, setNewContact] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    subject: '',
    message: ''
  });

  // Copy helper
  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`${label} copied to clipboard!`);
  };

  // Verify DNS simulation
  const handleVerifyDNS = () => {
    setIsVerifyingDNS(true);
    setTimeout(() => {
      setIsVerifyingDNS(false);
      setTenantConfig((prev: any) => ({
        ...prev,
        dnsStatus: 'verified',
        sslStatus: 'active'
      }));
      toast.success(`DNS verification successful! CNAME for ${customDomainInput} is active & SSL provisioned.`);
    }, 1200);
  };

  // Save Subdomain update
  const handleSaveSubdomain = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingSubdomain(true);
    
    try {
      const uid = user?.id || user?._id;
      const cleanSubDomain = subdomainInput.toLowerCase().replace(/[^a-z0-9-]/g, '');
      const payload = {
        id: uid,
        sub_domain: cleanSubDomain,
        tracking_hostname: customDomainInput
      };
      
      const res: any = await ApiClient.put('edit/profile', payload);
      if (res?.success) {
         setTenantConfig((prev: any) => ({
           ...prev,
           subdomainSlug: cleanSubDomain,
           trackingHostname: customDomainInput
         }));
         const updated = {
           ...tenantConfig,
           subdomainSlug: cleanSubDomain,
           trackingHostname: customDomainInput
         };
         localStorage.setItem('whiteLabelTenant', JSON.stringify(updated));
         toast.success(res?.message || 'Sub-domain configuration updated successfully!');
         setIsEditingSubdomain(false);
      } else {
         toast.error(res?.message || 'Error saving configuration');
      }
    } catch (err) {
      toast.error('An error occurred');
    } finally {
      setIsSavingSubdomain(false);
    }
  };

  // Save Stripe update
  const handleSaveStripe = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingStripe(true);
    
    try {
      const uid = user?.id || user?._id;
      const payload = {
        id: uid,
        stripe_key: stripeInput,
        stripe_environment: stripeEnvInput,
        stripe_currency: stripeCurrencyInput
      };
      
      const res: any = await ApiClient.put('edit/profile', payload);
      if (res?.success) {
         setTenantConfig((prev: any) => ({
           ...prev,
           stripeKey: stripeInput,
           environment: stripeEnvInput,
           defaultCurrency: stripeCurrencyInput
         }));
         toast.success(res?.message || 'Stripe configuration updated successfully!');
         setIsEditingStripe(false);
      } else {
         toast.error(res?.message || 'Error saving Stripe configuration');
      }
    } catch (err) {
      toast.error('An error occurred while saving Stripe settings');
    } finally {
      setIsSavingStripe(false);
    }
  };

  // Contact Module Handlers
  const handleStatusChange = (id: string, newStatus: string) => {
    setContacts(contacts.map(c => c.id === id ? { ...c, status: newStatus } : c));
    if (selectedContact && selectedContact.id === id) {
      setSelectedContact({ ...selectedContact, status: newStatus });
    }
    toast.info(`Contact status changed to ${newStatus}`);
  };

  const handleSendReply = () => {
    if (!replyMessage.trim()) {
      toast.error('Please enter a response message');
      return;
    }
    toast.success(`Reply sent to ${selectedContact.email}`);
    handleStatusChange(selectedContact.id, 'Resolved');
    setReplyMessage('');
    setSelectedContact(null);
  };

  const handleAddContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const created = {
      id: `CNT-${Math.floor(100 + Math.random() * 900)}`,
      ...newContact,
      status: 'New',
      date: new Date().toISOString().replace('T', ' ').substring(0, 16)
    };
    setContacts([created, ...contacts]);
    setShowAddContactModal(false);
    setNewContact({ name: '', email: '', phone: '', company: '', subject: '', message: '' });
    toast.success('New contact inquiry added successfully!');
  };

  const filteredContacts = contacts.filter(c => {
    const matchesSearch = c.name.toLowerCase().includes(contactSearch.toLowerCase()) ||
                          c.email.toLowerCase().includes(contactSearch.toLowerCase()) ||
                          c.company.toLowerCase().includes(contactSearch.toLowerCase()) ||
                          c.subject.toLowerCase().includes(contactSearch.toLowerCase());
    const matchesStatus = statusFilter === 'All' || c.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <Layout handleKeyPress={undefined} setFilter={undefined} reset={undefined} filter={undefined} name="White Label Dashboard" filters={undefined}>
      <div className="wl-dashboard-page">
        <div className="wl-dashboard-container">

          {/* Header Banner */}
          <div className="wl-tenant-banner">
            <div className="banner-left">
              <div className="tenant-badge">
                <LuSparkles size={14} />
                <span>White Label Platform Active</span>
              </div>
              <h1>{tenantConfig.tradingName || 'My White Label Brand'}</h1>
              <div className="tenant-meta">
                <span className="domain-pill">
                  <LuGlobe size={14} />
                  https://{tenantConfig.subdomainSlug || 'mybrand'}.upfilly.io
                </span>
                <span className="status-pill active">
                  <LuShieldCheck size={14} />
                  SSL Secured
                </span>
                <span className="plan-pill">
                  <LuCreditCard size={14} />
                  {tenantConfig.planName || 'White Label Growth Plan'}
                </span>
              </div>
            </div>

            <div className="banner-actions">
              <a
                href={`https://${tenantConfig.subdomainSlug || 'mybrand'}.upfilly.io`}
                target="_blank"
                rel="noreferrer"
                className="btn-wl-primary"
              >
                <LuExternalLink /> Visit Live Portal
              </a>
              <button
                className="btn-wl-outline"
                onClick={() => copyToClipboard(`https://${tenantConfig.subdomainSlug || 'mybrand'}.upfilly.io`, 'Subdomain URL')}
              >
                <LuCopy /> Copy Link
              </button>
            </div>
          </div>

          {/* Module Navigation Tabs */}
          <div className="wl-module-tabs">
            <button
              className={`tab-btn ${activeTab === 'subdomain' ? 'active' : ''}`}
              onClick={() => setActiveTab('subdomain')}
            >
              <LuGlobe size={18} />
              <span>Sub-Domain Configuration</span>
            </button>
            <button
              className={`tab-btn ${activeTab === 'contact' ? 'active' : ''}`}
              onClick={() => setActiveTab('contact')}
            >
              <LuMail size={18} />
              <span>Contact Module</span>
              {/* {contacts.filter(c => c.status === 'New').length > 0 && (
                <span className="tab-badge">{contacts.filter(c => c.status === 'New').length}</span>
              )} */}
            </button>
            <button
              className={`tab-btn ${activeTab === 'overview' ? 'active' : ''}`}
              onClick={() => setActiveTab('overview')}
            >
              <LuChartColumn size={18} />
              <span>Performance Overview</span>
            </button>
            <button
              className={`tab-btn ${activeTab === 'settings' ? 'active' : ''}`}
              onClick={() => setActiveTab('settings')}
            >
              <LuSettings size={18} />
              <span>Stripe & Settings</span>
            </button>
          </div>

          {/* TAB 1: Sub-Domain Configuration Module */}
          {activeTab === 'subdomain' && (
            <div className="module-content-card">
              <div className="card-header-row">
                <div>
                  <h3><LuGlobe className="text-primary" /> Sub-Domain & Custom Domain Configuration</h3>
                  <p>Manage your white label platform's URL, DNS target records, and SSL security status.</p>
                </div>
                <button
                  type="button"
                  className="btn-wl-outline"
                  onClick={handleVerifyDNS}
                  disabled={isVerifyingDNS}
                >
                  <LuRefreshCw className={isVerifyingDNS ? 'spin' : ''} />
                  {isVerifyingDNS ? 'Verifying DNS...' : 'Verify DNS & SSL Status'}
                </button>
              </div>

              {/* Status Summary Banner / Static UI */}
              {!isEditingSubdomain ? (
                <>
                  <div className="dns-status-banner">
                    <div className="status-item">
                      <span className="lbl">Subdomain Slug:</span>
                      <span className="val font-mono">{tenantConfig.subdomainSlug}.upfilly.io</span>
                    </div>
                    <div className="status-item">
                      <span className="lbl">Custom Domain:</span>
                      <span className="val font-mono">{tenantConfig.trackingHostname || 'Not Configured'}</span>
                    </div>
                    <div className="status-item">
                      <span className="lbl">DNS Propagation:</span>
                      <span className="val status-green"><LuCircleCheck size={14} /> Verified</span>
                    </div>
                    <div className="status-item">
                      <span className="lbl">SSL Certificate:</span>
                      <span className="val status-green"><LuShieldCheck size={14} /> Active (Auto-renewed)</span>
                    </div>
                  </div>
                  <div className="mt-4">
                    <button className="btn-wl-primary" onClick={() => setIsEditingSubdomain(true)}>
                      <LuPencil /> Edit Sub-Domain Configuration
                    </button>
                  </div>
                </>
              ) : (
                <form onSubmit={handleSaveSubdomain} className="onboarding-form-grid" style={{ marginTop: '20px' }}>
                  <div className="form-group full-width info-banner">
                    <LuInfo className="banner-icon" />
                    <p>Configure the domain where your white-label platform will be hosted.</p>
                  </div>

                  <div className="form-group full-width">
                    <label>Subdomain Slug <span className="req">*</span></label>
                    <div className="domain-input-group">
                      <input
                        type="text"
                        name="subdomainInput"
                        value={subdomainInput}
                        onChange={(e) => setSubdomainInput(e.target.value)}
                        required
                        placeholder="yourbrand"
                        pattern="[a-z0-9-]+"
                      />
                      <span className="domain-suffix">.upfilly.io</span>
                    </div>
                    <small className="field-hint">Lowercase a-z, 0-9, hyphen. 3-30 chars.</small>
                  </div>

                  <div className="form-group full-width separator-line"></div>
                  
                  <div className="form-group full-width">
                    <label>Tracking Hostname</label>
                    <p className="field-desc">Parent domain must be customer-owned. We will generate a CNAME target for you.</p>
                    <div className="input-with-icon" style={{ position: 'relative', width: '100%', display: 'flex', alignItems: 'center' }}>
                      <LuGlobe className="input-icon" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#64748b', zIndex: 2, pointerEvents: 'none' }} />
                      <input
                        type="text"
                        name="customDomainInput"
                        value={customDomainInput}
                        onChange={(e) => setCustomDomainInput(e.target.value)}
                        placeholder="track.clientbrand.com"
                        style={{ paddingLeft: '40px', width: '100%', height: '42px', borderRadius: '8px', border: '1px solid #cbd5e1' }}
                      />
                    </div>
                  </div>

                  {/* CNAME Target Box */}
                  {customDomainInput && (
                    <div className="form-group full-width">
                      <div className="cname-instruction-box" style={{ background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: '10px', padding: '16px', marginTop: '16px' }}>
                        <div className="box-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px', fontSize: '13px', color: '#1e3a8a' }}>
                          <strong>DNS CNAME Target Record</strong>
                          <button
                            type="button"
                            className="btn-copy-sm"
                            onClick={() => copyToClipboard('cname.upfilly.io', 'CNAME Target')}
                            style={{ background: '#ffffff', border: '1px solid #93c5fd', color: '#1d4ed8', fontSize: '12px', padding: '4px 12px', borderRadius: '6px', cursor: 'pointer', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                          >
                            <LuCopy size={12} /> Copy Target
                          </button>
                        </div>
                        <div className="dns-record-table" style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '8px' }}>
                          <div className="dns-row" style={{ display: 'grid', gridTemplateColumns: '120px 1fr', alignItems: 'center', fontSize: '13px' }}>
                            <span className="col-lbl" style={{ color: '#64748b', fontWeight: 600 }}>Type</span>
                            <span className="col-val font-mono" style={{ fontFamily: 'monospace', color: '#0f172a' }}>CNAME</span>
                          </div>
                          <div className="dns-row" style={{ display: 'grid', gridTemplateColumns: '120px 1fr', alignItems: 'center', fontSize: '13px' }}>
                            <span className="col-lbl" style={{ color: '#64748b', fontWeight: 600 }}>Host / Name</span>
                            <span className="col-val font-mono" style={{ fontFamily: 'monospace', color: '#0f172a' }}>{customDomainInput ? customDomainInput.split('.')[0] : 'affiliates'}</span>
                          </div>
                          <div className="dns-row" style={{ display: 'grid', gridTemplateColumns: '120px 1fr', alignItems: 'center', fontSize: '13px' }}>
                            <span className="col-lbl" style={{ color: '#64748b', fontWeight: 600 }}>Points To / Value</span>
                            <span className="col-val font-mono" style={{ fontFamily: 'monospace', color: '#0f172a' }}>cname.upfilly.io</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="form-group full-width" style={{ flexDirection: 'row', gap: '12px' }}>
                    <button
                      type="submit"
                      className="btn-wl-primary"
                      disabled={isSavingSubdomain}
                    >
                      {isSavingSubdomain ? 'Saving Configuration...' : 'Confirm Edit'}
                    </button>
                    <button
                      type="button"
                      className="btn-wl-outline"
                      onClick={() => {
                        setIsEditingSubdomain(false);
                        setSubdomainInput(tenantConfig.subdomainSlug || '');
                        setCustomDomainInput(tenantConfig.trackingHostname || '');
                      }}
                      disabled={isSavingSubdomain}
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}

          {/* TAB 2: Contact Module */}
          {activeTab === 'contact' && (
            <div className="module-content-card" style={{ padding: 0, background: 'transparent', border: 'none', boxShadow: 'none' }}>
              <AdminChatWidget />
              
              {/* ORIGINAL CONTACT MODULE UI - COMMENTED OUT */}
              {/* 
                <>
                  <div className="card-header-row">
                    <div>
                      <h3><LuMail className="text-primary" /> White Label Contact Module</h3>
                      <p>View, manage, and respond to incoming lead and affiliate inquiries submitted through your tenant portal.</p>
                    </div>
                    <div style={{ display: 'flex', gap: '12px' }}>
                      <AdminChatWidget />
                      <button
                        type="button"
                        className="btn-wl-primary"
                        onClick={() => setShowAddContactModal(true)}
                      >
                        <LuPlus /> Add Contact Inquiry
                      </button>
                    </div>
                  </div>

                  <div className="contact-stats-grid">
                    <div className="contact-stat-card">
                      <span className="stat-num">{contacts.length}</span>
                      <span className="stat-lbl">Total Inquiries</span>
                    </div>
                    <div className="contact-stat-card unread">
                      <span className="stat-num">{contacts.filter(c => c.status === 'New').length}</span>
                      <span className="stat-lbl">New / Unread</span>
                    </div>
                    <div className="contact-stat-card pending">
                      <span className="stat-num">{contacts.filter(c => c.status === 'In Progress').length}</span>
                      <span className="stat-lbl">In Progress</span>
                    </div>
                    <div className="contact-stat-card resolved">
                      <span className="stat-num">{contacts.filter(c => c.status === 'Resolved').length}</span>
                      <span className="stat-lbl">Resolved</span>
                    </div>
                  </div>

                  <div className="filter-actions-bar">
                    <div className="search-input-box">
                      <LuSearch className="search-icon" />
                      <input
                        type="text"
                        placeholder="Search contacts by name, email, company, subject..."
                        value={contactSearch}
                        onChange={(e) => setContactSearch(e.target.value)}
                      />
                    </div>

                    <div className="status-filter-pills">
                      {['All', 'New', 'In Progress', 'Resolved'].map((st) => (
                        <button
                          key={st}
                          className={`filter-pill ${statusFilter === st ? 'active' : ''}`}
                          onClick={() => setStatusFilter(st)}
                        >
                          {st}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="table-responsive">
                    <table className="wl-table">
                      <thead>
                        <tr>
                          <th>Contact Details</th>
                          <th>Company</th>
                          <th>Subject / Topic</th>
                          <th>Date Received</th>
                          <th>Status</th>
                          <th>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredContacts.length === 0 ? (
                          <tr>
                            <td colSpan={6} className="text-center py-4 text-muted">
                              No contact inquiries found matching criteria.
                            </td>
                          </tr>
                        ) : (
                          filteredContacts.map((c) => (
                            <tr key={c.id}>
                              <td>
                                <div className="contact-name">{c.name}</div>
                                <div className="contact-email">{c.email}</div>
                              </td>
                              <td>{c.company || 'N/A'}</td>
                              <td className="subject-cell">{c.subject}</td>
                              <td>{c.date}</td>
                              <td>
                                <span className={`badge-status ${c.status.toLowerCase().replace(' ', '-')}`}>
                                  {c.status}
                                </span>
                              </td>
                              <td>
                                <button
                                  className="btn-action-view"
                                  onClick={() => setSelectedContact(c)}
                                  title="View and respond"
                                >
                                  <LuEye size={14} /> View Inquiry
                                </button>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </>
           */}
            </div>
          )}

          {/* TAB 3: Overview & Analytics */}
          {activeTab === 'overview' && (
            <div className="module-content-card">
              <div className="card-header-row">
                <div>
                  <h3><LuChartColumn className="text-primary" /> Tenant Performance Overview</h3>
                  <p>Metrics and active performance indicators for your White Label tenant ecosystem.</p>
                </div>
              </div>

              <div className="overview-grid">
                <div className="overview-card">
                  <div className="icon-wrapper blue">
                    <LuUserCheck size={24} />
                  </div>
                  <div className="info">
                    <h4>Active Affiliates</h4>
                    <span className="value">48</span>
                    <span className="trend positive">+12% this month</span>
                  </div>
                </div>

                <div className="overview-card">
                  <div className="icon-wrapper green">
                    <LuGlobe size={24} />
                  </div>
                  <div className="info">
                    <h4>Portal Visits</h4>
                    <span className="value">12,450</span>
                    <span className="trend positive">+24% traffic</span>
                  </div>
                </div>

                <div className="overview-card">
                  <div className="icon-wrapper purple">
                    <LuMail size={24} />
                  </div>
                  <div className="info">
                    <h4>Contact Submissions</h4>
                    <span className="value">{contacts.length}</span>
                    <span className="trend neutral">Active pipeline</span>
                  </div>
                </div>

                <div className="overview-card">
                  <div className="icon-wrapper orange">
                    <LuActivity size={24} />
                  </div>
                  <div className="info">
                    <h4>System Uptime</h4>
                    <span className="value">99.98%</span>
                    <span className="trend positive">All systems operational</span>
                  </div>
                </div>
              </div>

              <div className="activity-section mt-4">
                <h4>Recent Tenant Activity</h4>
                <ul className="activity-list">
                  <li>
                    <span className="dot green"></span>
                    <div className="activity-detail">
                      <strong>Custom Sub-domain Provisioned:</strong> https://{tenantConfig.subdomainSlug}.upfilly.io is live and active.
                      <small>2 hours ago</small>
                    </div>
                  </li>
                  <li>
                    <span className="dot blue"></span>
                    <div className="activity-detail">
                      <strong>New Contact Message Received:</strong> Sarah Connor submitted an inquiry for enterprise plan.
                      <small>Today, 09:30 AM</small>
                    </div>
                  </li>
                  <li>
                    <span className="dot purple"></span>
                    <div className="activity-detail">
                      <strong>Stripe Integration Mode:</strong> Connected in Test Environment ({tenantConfig.defaultCurrency}).
                      <small>Yesterday</small>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          )}

          {/* TAB 4: Stripe & Settings */}
          {activeTab === 'settings' && (
            <div className="module-content-card">
              <div className="card-header-row">
                <div>
                  <h3><LuSettings className="text-primary" /> Stripe & Account Configuration</h3>
                  <p>Manage white-label payment gateway API keys and tenant settings.</p>
                </div>
              </div>

              <div className="settings-grid" style={{ gridTemplateColumns: '1fr', gap: '30px' }}>
                {!isEditingStripe ? (
                  <div className="static-ui-container" style={{ padding: '24px', background: '#f8fafc', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                    <div style={{ marginBottom: '16px' }}>
                      <span style={{ fontSize: '12px', fontWeight: 600, color: '#64748b', textTransform: 'uppercase' }}>Stripe API Key</span>
                      <div style={{ fontSize: '14px', fontWeight: 600, color: '#0f172a', fontFamily: 'monospace' }}>
                        {tenantConfig.stripeKey ? `${tenantConfig.stripeKey.substring(0, 8)}...` : 'Not Configured'}
                      </div>
                    </div>
                    <div style={{ marginBottom: '16px' }}>
                      <span style={{ fontSize: '12px', fontWeight: 600, color: '#64748b', textTransform: 'uppercase' }}>Payment Environment</span>
                      <div>
                        <span className="badge badge-info">{tenantConfig.environment.toUpperCase()} MODE</span>
                      </div>
                    </div>
                    <div style={{ marginBottom: '24px' }}>
                      <span style={{ fontSize: '12px', fontWeight: 600, color: '#64748b', textTransform: 'uppercase' }}>Default Currency</span>
                      <div style={{ fontSize: '14px', fontWeight: 600, color: '#0f172a' }}>{tenantConfig.defaultCurrency}</div>
                    </div>
                    <button className="btn-wl-primary" onClick={() => setIsEditingStripe(true)}>
                      <LuPencil /> Edit Stripe Settings
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleSaveStripe} className="onboarding-form-grid" style={{ marginTop: '0' }}>
                    <div className="form-group full-width info-banner stripe-banner">
                      <LuCreditCard className="banner-icon" />
                      <p>Connect your own Stripe account. All payment activity in your tenant will run through your Stripe account.</p>
                    </div>

                    <div className="form-group full-width">
                      <label>Stripe API Key <span className="req">*</span></label>
                      <div className="input-with-icon position-relative" style={{ position: 'relative', width: '100%', display: 'flex', alignItems: 'center' }}>
                        <LuLock className="input-icon" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#64748b', zIndex: 2, pointerEvents: 'none' }} />
                        <input 
                          type={showStripeKey ? "text" : "password"} 
                          value={stripeInput} 
                          onChange={(e) => setStripeInput(e.target.value)} 
                          required 
                          placeholder="sk_test_..." 
                          style={{ paddingRight: '40px', paddingLeft: '40px', width: '100%', height: '42px', borderRadius: '8px', border: '1px solid #cbd5e1' }} 
                        />
                        <button type="button" onClick={() => setShowStripeKey(!showStripeKey)} style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'transparent', border: 'none', color: '#64748b', cursor: 'pointer', padding: 0, display: 'flex', alignItems: 'center' }}>
                          {showStripeKey ? <LuEyeOff size={18} /> : <LuEye size={18} />}
                        </button>
                      </div>
                    </div>

                    <div className="form-group full-width">
                      <label>Environment <span className="req">*</span></label>
                      <div className="wl-toggle-group" style={{ display: 'inline-flex', gap: '4px', background: '#f1f5f9', padding: '6px', borderRadius: '8px', width: 'max-content' }}>
                        <label className={`wl-toggle-btn ${stripeEnvInput === 'test' ? 'active' : ''}`} style={{ padding: '8px 20px', cursor: 'pointer', borderRadius: '6px', fontWeight: 600, fontSize: '13px', background: stripeEnvInput === 'test' ? '#ffffff' : 'transparent', color: stripeEnvInput === 'test' ? '#1c306d' : '#64748b', border: stripeEnvInput === 'test' ? '1px solid #cbd5e1' : '1px solid transparent', boxShadow: stripeEnvInput === 'test' ? '0 1px 3px rgba(0,0,0,0.05)' : 'none', transition: 'all 0.2s ease', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
                          <input type="radio" name="stripe_environment" value="test" checked={stripeEnvInput === 'test'} onChange={() => setStripeEnvInput('test')} style={{ display: 'none' }} />
                          Test Mode
                        </label>
                        <label className={`wl-toggle-btn ${stripeEnvInput === 'live' ? 'active' : ''}`} style={{ padding: '8px 20px', cursor: 'pointer', borderRadius: '6px', fontWeight: 600, fontSize: '13px', background: stripeEnvInput === 'live' ? '#ffffff' : 'transparent', color: stripeEnvInput === 'live' ? '#1c306d' : '#64748b', border: stripeEnvInput === 'live' ? '1px solid #cbd5e1' : '1px solid transparent', boxShadow: stripeEnvInput === 'live' ? '0 1px 3px rgba(0,0,0,0.05)' : 'none', transition: 'all 0.2s ease', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
                          <input type="radio" name="stripe_environment" value="live" checked={stripeEnvInput === 'live'} onChange={() => setStripeEnvInput('live')} style={{ display: 'none' }} />
                          Live Mode
                        </label>
                      </div>
                    </div>

                    <div className="form-group full-width">
                      <label>Default Currency <span className="req">*</span></label>
                      <select value={stripeCurrencyInput} onChange={(e) => setStripeCurrencyInput(e.target.value)} required>
                        <option value="USD">USD ($)</option>
                        <option value="EUR">EUR (€)</option>
                        <option value="GBP">GBP (£)</option>
                        <option value="AUD">AUD ($)</option>
                        <option value="CAD">CAD ($)</option>
                      </select>
                    </div>

                    <div className="form-group full-width" style={{ flexDirection: 'row', gap: '12px' }}>
                      <button
                        type="submit"
                        className="btn-wl-primary"
                        disabled={isSavingStripe}
                      >
                        {isSavingStripe ? 'Saving Configuration...' : 'Confirm Edit'}
                      </button>
                      <button
                        type="button"
                        className="btn-wl-outline"
                        onClick={() => {
                          setIsEditingStripe(false);
                          setStripeInput(tenantConfig.stripeKey || '');
                          setStripeEnvInput(tenantConfig.environment || 'test');
                          setStripeCurrencyInput(tenantConfig.defaultCurrency || 'USD');
                        }}
                        disabled={isSavingStripe}
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                )}

                <div className="settings-section" style={{ borderTop: '1px solid #e2e8f0', paddingTop: '20px' }}>
                  <h4>Subscription Plan Details</h4>
                  <div className="plan-summary-box">
                    <h5>{tenantConfig.planName}</h5>
                    <p className="text-muted">Unlimited subdomains, custom branding, contact module & SSL support included.</p>
                    <a href="/white-label-pricing" className="btn-wl-outline">
                      Manage / Upgrade Plan
                    </a>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Contact Inquiry Detail / Reply Modal */}
          {selectedContact && (
            <div className="wl-modal-overlay">
              <div className="wl-modal-box">
                <div className="modal-header">
                  <h4><LuMessageSquare /> Contact Inquiry Details</h4>
                  <button className="close-btn" onClick={() => setSelectedContact(null)}>×</button>
                </div>
                <div className="modal-body">
                  <div className="detail-meta-grid">
                    <div><strong>From:</strong> {selectedContact.name} ({selectedContact.email})</div>
                    <div><strong>Phone:</strong> {selectedContact.phone || 'N/A'}</div>
                    <div><strong>Company:</strong> {selectedContact.company || 'N/A'}</div>
                    <div><strong>Date:</strong> {selectedContact.date}</div>
                  </div>
                  <div className="detail-subject">
                    <strong>Subject:</strong> {selectedContact.subject}
                  </div>
                  <div className="detail-message-body">
                    <strong>Message:</strong>
                    <p>{selectedContact.message}</p>
                  </div>

                  <div className="status-update-row">
                    <span>Change Status:</span>
                    {['New', 'In Progress', 'Resolved'].map((st) => (
                      <button
                        key={st}
                        className={`btn-status-toggle ${selectedContact.status === st ? 'active' : ''}`}
                        onClick={() => handleStatusChange(selectedContact.id, st)}
                      >
                        {st}
                      </button>
                    ))}
                  </div>

                  <div className="reply-box mt-3">
                    <label>Send Direct Email Response</label>
                    <textarea
                      rows={3}
                      placeholder="Type your reply message to send to contact..."
                      value={replyMessage}
                      onChange={(e) => setReplyMessage(e.target.value)}
                    />
                  </div>
                </div>
                <div className="modal-footer">
                  <button className="btn-wl-outline" onClick={() => setSelectedContact(null)}>Cancel</button>
                  <button className="btn-wl-primary" onClick={handleSendReply}>
                    Send Reply & Resolve
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Add New Contact Inquiry Modal */}
          {showAddContactModal && (
            <div className="wl-modal-overlay">
              <div className="wl-modal-box">
                <div className="modal-header">
                  <h4><LuPlus /> Add Contact Inquiry</h4>
                  <button className="close-btn" onClick={() => setShowAddContactModal(false)}>×</button>
                </div>
                <form onSubmit={handleAddContactSubmit}>
                  <div className="modal-body">
                    <div className="form-group mb-2">
                      <label>Contact Name *</label>
                      <input
                        type="text"
                        required
                        value={newContact.name}
                        onChange={(e) => setNewContact({ ...newContact, name: e.target.value })}
                        placeholder="John Doe"
                      />
                    </div>
                    <div className="form-group mb-2">
                      <label>Email Address *</label>
                      <input
                        type="email"
                        required
                        value={newContact.email}
                        onChange={(e) => setNewContact({ ...newContact, email: e.target.value })}
                        placeholder="john@example.com"
                      />
                    </div>
                    <div className="form-group mb-2">
                      <label>Company Name</label>
                      <input
                        type="text"
                        value={newContact.company}
                        onChange={(e) => setNewContact({ ...newContact, company: e.target.value })}
                        placeholder="Acme Corp"
                      />
                    </div>
                    <div className="form-group mb-2">
                      <label>Subject *</label>
                      <input
                        type="text"
                        required
                        value={newContact.subject}
                        onChange={(e) => setNewContact({ ...newContact, subject: e.target.value })}
                        placeholder="Inquiry subject"
                      />
                    </div>
                    <div className="form-group mb-2">
                      <label>Message Content *</label>
                      <textarea
                        rows={3}
                        required
                        value={newContact.message}
                        onChange={(e) => setNewContact({ ...newContact, message: e.target.value })}
                        placeholder="Details of inquiry..."
                      />
                    </div>
                  </div>
                  <div className="modal-footer">
                    <button type="button" className="btn-wl-outline" onClick={() => setShowAddContactModal(false)}>Cancel</button>
                    <button type="submit" className="btn-wl-primary">Save Contact Inquiry</button>
                  </div>
                </form>
              </div>
            </div>
          )}

        </div>
      </div>
    </Layout>
  );
}
