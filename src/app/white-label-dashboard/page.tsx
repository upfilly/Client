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
  LuCreditCard, LuUserCheck, LuAlertTriangle, LuArrowUpRight,
  LuActivity, LuChartColumn
} from 'react-icons/lu';
import './style.scss';

export default function WhiteLabelDashboard() {
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

  // Load stored tenant config if available
  useEffect(() => {
    const stored = localStorage.getItem('whiteLabelTenant');
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setTenantConfig((prev: any) => ({
          ...prev,
          ...parsed,
          subdomainSlug: parsed.subdomainSlug || prev.subdomainSlug,
          tradingName: parsed.tradingName || parsed.legalCompanyName || prev.tradingName
        }));
      } catch (e) {
        console.error("Error reading stored white label config", e);
      }
    }
  }, []);

  // Sub-domain configuration state
  const [subdomainInput, setSubdomainInput] = useState(tenantConfig.subdomainSlug);
  const [customDomainInput, setCustomDomainInput] = useState(tenantConfig.trackingHostname);
  const [isVerifyingDNS, setIsVerifyingDNS] = useState(false);
  const [isSavingSubdomain, setIsSavingSubdomain] = useState(false);

  useEffect(() => {
    setSubdomainInput(tenantConfig.subdomainSlug || 'mybrand');
    setCustomDomainInput(tenantConfig.trackingHostname || 'affiliates.mybrand.com');
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
  const handleSaveSubdomain = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingSubdomain(true);
    setTimeout(() => {
      setIsSavingSubdomain(false);
      const updated = {
        ...tenantConfig,
        subdomainSlug: subdomainInput.toLowerCase().replace(/[^a-z0-9-]/g, ''),
        trackingHostname: customDomainInput
      };
      setTenantConfig(updated);
      localStorage.setItem('whiteLabelTenant', JSON.stringify(updated));
      toast.success('Sub-domain configuration updated successfully!');
    }, 1000);
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
              {contacts.filter(c => c.status === 'New').length > 0 && (
                <span className="tab-badge">{contacts.filter(c => c.status === 'New').length}</span>
              )}
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

              {/* Status Summary Banner */}
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

              {/* Configuration Form */}
              <form onSubmit={handleSaveSubdomain} className="subdomain-form-grid">
                <div className="form-section">
                  <h4>1. Tenant Sub-domain</h4>
                  <p className="section-desc">This is your primary platform address hosted on Upfilly infrastructure.</p>
                  
                  <div className="form-group">
                    <label>Subdomain Slug</label>
                    <div className="input-group-domain">
                      <input
                        type="text"
                        value={subdomainInput}
                        onChange={(e) => setSubdomainInput(e.target.value)}
                        placeholder="yourbrand"
                        required
                      />
                      <span className="domain-suffix">.upfilly.io</span>
                    </div>
                    <small className="form-text text-muted">Lowercase letters, numbers, and hyphens allowed.</small>
                  </div>
                </div>

                <div className="form-section">
                  <h4>2. Custom Branded Domain (CNAME Routing)</h4>
                  <p className="section-desc">Host your white label portal on your own company domain.</p>

                  <div className="form-group">
                    <label>Custom Hostname / Domain</label>
                    <div className="input-with-icon">
                      <LuGlobe className="icon" />
                      <input
                        type="text"
                        value={customDomainInput}
                        onChange={(e) => setCustomDomainInput(e.target.value)}
                        placeholder="affiliates.yourcompany.com"
                      />
                    </div>
                  </div>

                  {/* CNAME Target Box */}
                  <div className="cname-instruction-box">
                    <div className="box-header">
                      <strong>DNS CNAME Target Record</strong>
                      <button
                        type="button"
                        className="btn-copy-sm"
                        onClick={() => copyToClipboard('cname.upfilly.io', 'CNAME Target')}
                      >
                        <LuCopy size={12} /> Copy Target
                      </button>
                    </div>
                    <div className="dns-record-table">
                      <div className="dns-row">
                        <span className="col-lbl">Type</span>
                        <span className="col-val font-mono">CNAME</span>
                      </div>
                      <div className="dns-row">
                        <span className="col-lbl">Host / Name</span>
                        <span className="col-val font-mono">{customDomainInput ? customDomainInput.split('.')[0] : 'affiliates'}</span>
                      </div>
                      <div className="dns-row">
                        <span className="col-lbl">Points To / Value</span>
                        <span className="col-val font-mono">cname.upfilly.io</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="form-actions-full">
                  <button
                    type="submit"
                    className="btn-wl-primary"
                    disabled={isSavingSubdomain}
                  >
                    {isSavingSubdomain ? 'Saving Configuration...' : 'Save Sub-domain Configuration'}
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* TAB 2: Contact Module */}
          {activeTab === 'contact' && (
            <div className="module-content-card">
              <div className="card-header-row">
                <div>
                  <h3><LuMail className="text-primary" /> White Label Contact Module</h3>
                  <p>View, manage, and respond to incoming lead and affiliate inquiries submitted through your tenant portal.</p>
                </div>
                <button
                  type="button"
                  className="btn-wl-primary"
                  onClick={() => setShowAddContactModal(true)}
                >
                  <LuPlus /> Add Contact Inquiry
                </button>
              </div>

              {/* Contact Counter Cards */}
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

              {/* Search & Filter Bar */}
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

              {/* Contacts Table */}
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

              <div className="settings-grid">
                <div className="settings-section">
                  <h4>Stripe Integration</h4>
                  <div className="form-group">
                    <label>Stripe Publishable / API Key</label>
                    <input
                      type="password"
                      value={tenantConfig.stripeKey}
                      readOnly
                      className="font-mono"
                    />
                  </div>
                  <div className="form-group">
                    <label>Payment Environment</label>
                    <span className="badge badge-info">{tenantConfig.environment.toUpperCase()} MODE</span>
                  </div>
                  <div className="form-group">
                    <label>Default Currency</label>
                    <input type="text" value={tenantConfig.defaultCurrency} readOnly />
                  </div>
                </div>

                <div className="settings-section">
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
