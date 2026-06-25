'use client'

import React, { useState, useRef } from 'react';
import Layout from '../components/global/layout';
import credentialModel from '../../models/credential.model';

const CODE_STEP1 = (brandId) =>
  `<script\n  src="https://script.upfilly.com/${brandId}.js"\n  type="text/javascript"\n  defer="defer"\n></script>`;

const CODE_STEP2 = (brandId) =>
  `<script>
function getCookie(name) {
  const match = document.cookie.match(
    new RegExp('(^| )' + name + '=([^;]+)')
  );
  return match ? match[2] : null;
}

const saleData = {
  merchant:     ${brandId},
  affiliate_id: getCookie("affiliate_id") || "direct",
  amount:       parseFloat(getCookie("totalAmount") || 0).toFixed(2),
  channel:      getCookie("source")    || "direct",
  currency:     getCookie("currency")  || "USD",
  lead_id:      getCookie("lead_id")   || null,
  orderRef:     getCookie("order_id")  || null,
  voucher:      getCookie("voucher")   || null,
  couponId:     getCookie("couponId")  || null,
  subIds: {
    subId:  getCookie("subId")  || null,
    subId2: getCookie("subId2") || null,
  },
};

const xhr = new XMLHttpRequest();
xhr.open("POST", "https://api.upfilly.com/affiliatelink", true);
xhr.setRequestHeader("Content-Type", "application/json");
xhr.onload = () => {
  if (xhr.status >= 200 && xhr.status < 300) {
    console.log("Conversion tracked.");
  } else {
    console.error("Tracking error:", xhr.statusText);
  }
};
xhr.send(JSON.stringify(saleData));
</script>`;

function CopyButton({ targetId, code }) {
  const [copied, setCopied] = useState(false);
  const handle = () => {
    navigator.clipboard.writeText(code).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };
  return (
    <button onClick={handle} style={styles.copyBtn}>
      {copied ? '✓ Copied' : '⎘ Copy'}
    </button>
  );
}

function CodeBlock({ code }) {
  return (
    <div style={styles.codeBlock}>
      <CopyButton code={code} />
      <pre style={styles.pre}>{code}</pre>
    </div>
  );
}

function StepCard({ number, title, children }) {
  return (
    <div style={styles.stepCard}>
      <div style={styles.stepHeader}>
        <div style={styles.stepNum}>{number}</div>
        <span style={styles.stepTitle}>{title}</span>
      </div>
      <div style={styles.stepBody}>{children}</div>
    </div>
  );
}

function ScriptChecker() {
  const [url, setUrl] = useState('');
  const [status, setStatus] = useState('idle'); // idle | loading | success | error | warn
  const [result, setResult] = useState({ title: 'Ready to check', msg: 'Enter a URL above and click Check.' });

  const check = async () => {
    let target = url.trim();
    if (!target) {
      setStatus('warn');
      setResult({ title: 'URL required', msg: 'Please enter a website URL to check.' });
      return;
    }
    if (!/^https?:\/\//i.test(target)) target = 'https://' + target;

    setStatus('loading');
    setResult({ title: 'Checking...', msg: 'Fetching page HTML and scanning for the Upfilly script.' });

    try {
      const proxyUrl = 'https://api.allorigins.win/get?url=' + encodeURIComponent(target);
      const res = await fetch(proxyUrl);
      if (!res.ok) throw new Error('Fetch failed');
      const data = await res.json();
      const html = data.contents || '';

      const hasScript = /script\.upfilly\.com/i.test(html);
      const brandMatch = html.match(/script\.upfilly\.com\/([^"'\s>]+)\.js/i);
      const brandId = brandMatch ? brandMatch[1] : null;

      if (hasScript && brandId) {
        setStatus('success');
        setResult({ title: 'Script found', msg: `Upfilly script detected — brand ID: ${brandId}. Your implementation looks correct.` });
      } else if (hasScript) {
        setStatus('warn');
        setResult({ title: 'Script found, but brand ID unclear', msg: 'The Upfilly script tag was found, but the brand ID could not be parsed. Double-check the src URL format.' });
      } else {
        setStatus('error');
        setResult({ title: 'Script not found', msg: 'No Upfilly script tag was detected on this page. Make sure you added it to the <head> of the page.' });
      }
    } catch (e) {
      setStatus('warn');
      setResult({ title: 'Could not fetch page', msg: 'The page could not be fetched — it may block cross-origin requests. Try checking manually via DevTools → Sources.' });
    }
  };

  const statusColors = {
    idle: { bg: '#f5f5f5', border: '#e0e0e0', color: '#666' },
    loading: { bg: '#f5f5f5', border: '#e0e0e0', color: '#666' },
    success: { bg: '#eafaf1', border: '#a3d9b1', color: '#1a7a3f' },
    error: { bg: '#fdecea', border: '#f5a9a4', color: '#c0392b' },
    warn: { bg: '#fff8e1', border: '#ffe082', color: '#b07d00' },
  };

  const s = statusColors[status];

  return (
    <div style={styles.stepCard}>
      <div style={{ ...styles.stepHeader, background: '#fff8e1' }}>
        <div style={{ ...styles.stepNum, background: '#fff3cd', color: '#b07d00' }}>✦</div>
        <span style={styles.stepTitle}>Script checker</span>
      </div>
      <div style={styles.stepBody}>
        <p style={styles.para}>
          Enter your website URL to verify whether the Upfilly master script is present and correctly configured.
        </p>
        <div style={styles.inputRow}>
          <input
            type="url"
            value={url}
            onChange={e => setUrl(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && check()}
            placeholder="https://yoursite.com"
            style={styles.urlInput}
          />
          <button onClick={check} disabled={status === 'loading'} style={styles.checkBtn}>
            {status === 'loading' ? 'Checking…' : '▶ Check'}
          </button>
        </div>
        <div style={{ ...styles.resultBox, background: s.bg, border: `1px solid ${s.border}`, color: s.color }}>
          <strong style={{ display: 'block', marginBottom: 2 }}>{result.title}</strong>
          {result.msg}
        </div>
        <p style={styles.hint}>
          The check fetches your page HTML and scans for <code style={styles.code}>script.upfilly.com</code>.
          Some sites block cross-origin fetches — verify manually via DevTools in that case.
        </p>
      </div>
    </div>
  );
}

const TrackingGuide = () => {
  const user = credentialModel.getUser();
  const brandId = user?.id || user?._id || '{{BRAND_ID}}';

  return (
    <Layout
      handleKeyPress={undefined}
      setFilter={undefined}
      reset={undefined}
      filter={undefined}
      name="Script"
      filters={undefined}>
      {/* Hero */}
      <section style={styles.hero}>
        <div style={styles.container}>
          <span style={styles.badge}>Developer guide</span>
          <h1 style={styles.h1}>Tracking implementation guide</h1>
          <p style={styles.heroPara}>
            Set up affiliate and conversion tracking in your web app using cookies,
            URL parameters, and the Upfilly API.
          </p>
        </div>
      </section>

      <div style={styles.container}>
        <div style={styles.steps}>

          {/* Step 1 */}
          <StepCard number="1" title="Add the master script">
            <p style={styles.para}>
              Paste this script tag into the <code style={styles.code}>&lt;head&gt;</code> of every
              page you want to track. It captures URL parameters like{' '}
              <code style={styles.code}>?affiliate_id=1234</code> and stores them as cookies automatically.
            </p>
            <CodeBlock code={CODE_STEP1(brandId)} />
            <p style={styles.para}>
              Replace <code style={styles.code}>{'{{BRAND_ID}}'}</code> with your numeric brand ID from
              the Upfilly dashboard.
            </p>
          </StepCard>

          {/* Step 2 */}
          <StepCard number="2" title="Send conversion data">
            <p style={styles.para}>
              Fire this snippet on your order confirmation page. It reads the cookies set in step 1
              and posts the conversion payload to Upfilly.
            </p>
            <CodeBlock code={CODE_STEP2(brandId)} />
            <p style={styles.para}>
              Adjust the field names (e.g. <code style={styles.code}>totalAmount</code>,{' '}
              <code style={styles.code}>order_id</code>) to match the cookies your site sets.
            </p>
          </StepCard>

          {/* Step 3 */}
          <StepCard number="3" title="Verify implementation">
            <ul style={styles.checklist}>
              {[
                ['Check cookies', 'Open DevTools → Application → Cookies. After a visit with URL params you should see affiliate_id, source, and other values stored.'],
                ['Check network requests', 'DevTools → Network tab → filter by affiliatelink. Trigger a conversion and confirm the POST fires with the correct payload.'],
                ['Check server logs', 'Confirm the Upfilly dashboard shows the incoming conversion with the correct affiliate and order data.'],
              ].map(([title, desc]) => (
                <li key={title} style={styles.checkItem}>
                  <span style={styles.checkDot}>✓</span>
                  <span><strong style={styles.checkTitle}>{title}</strong> — {desc}</span>
                </li>
              ))}
            </ul>
          </StepCard>

          {/* Script Checker */}
          <ScriptChecker />

        </div>
      </div>
    </Layout>
  );
};

const styles = {
  hero: {
    background: '#f9f9f9',
    borderBottom: '1px solid #ebebeb',
    padding: '2rem 0 1.75rem',
  },
  container: {
    maxWidth: 780,
    margin: '0 auto',
    padding: '0 1.5rem',
  },
  badge: {
    display: 'inline-block',
    background: '#e8f0fe',
    color: '#1a56db',
    fontSize: 12,
    fontWeight: 500,
    padding: '4px 10px',
    borderRadius: 20,
    marginBottom: '0.75rem',
  },
  h1: {
    fontSize: 22,
    fontWeight: 600,
    color: '#111',
    marginBottom: '0.5rem',
  },
  heroPara: {
    fontSize: 14,
    color: '#555',
    lineHeight: 1.7,
    maxWidth: 560,
  },
  steps: {
    paddingTop: '2rem',
    paddingBottom: '2rem',
    display: 'flex',
    flexDirection: 'column',
    gap: '1.5rem',
  },
  stepCard: {
    border: '1px solid #e8e8e8',
    borderRadius: 12,
    overflow: 'hidden',
    background: '#fff',
  },
  stepHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    padding: '0.875rem 1.25rem',
    borderBottom: '1px solid #e8e8e8',
    background: '#fafafa',
  },
  stepNum: {
    width: 28,
    height: 28,
    borderRadius: '50%',
    background: '#e8f0fe',
    color: '#1a56db',
    fontSize: 12,
    fontWeight: 600,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  stepTitle: {
    fontSize: 15,
    fontWeight: 600,
    color: '#111',
  },
  stepBody: {
    padding: '1.25rem',
  },
  para: {
    fontSize: 14,
    color: '#555',
    lineHeight: 1.7,
    marginBottom: '1rem',
  },
  code: {
    fontFamily: 'monospace',
    fontSize: 12.5,
    background: '#f0f0f0',
    padding: '2px 6px',
    borderRadius: 4,
    color: '#333',
  },
  codeBlock: {
    background: '#1e1e2e',
    borderRadius: 8,
    padding: '1rem 1.25rem',
    margin: '1rem 0',
    position: 'relative',
    overflowX: 'auto',
  },
  pre: {
    fontFamily: 'monospace',
    fontSize: 12,
    lineHeight: 1.7,
    color: '#cdd6f4',
    whiteSpace: 'pre-wrap',
    wordBreak: 'break-word',
    margin: 0,
  },
  copyBtn: {
    position: 'absolute',
    top: 10,
    right: 10,
    background: 'rgba(255,255,255,0.08)',
    border: '1px solid rgba(255,255,255,0.15)',
    color: '#cdd6f4',
    fontSize: 11,
    padding: '4px 10px',
    borderRadius: 4,
    cursor: 'pointer',
  },
  checklist: {
    listStyle: 'none',
    display: 'flex',
    flexDirection: 'column',
    gap: 12,
    padding: 0,
  },
  checkItem: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: 10,
    fontSize: 14,
    color: '#555',
    lineHeight: 1.6,
  },
  checkDot: {
    color: '#1a7a3f',
    fontWeight: 700,
    flexShrink: 0,
    marginTop: 1,
  },
  checkTitle: {
    color: '#111',
    fontWeight: 600,
  },
  inputRow: {
    display: 'flex',
    gap: 10,
    marginBottom: '1rem',
  },
  urlInput: {
    flex: 1,
    padding: '9px 12px',
    fontSize: 13,
    border: '1px solid #d0d0d0',
    borderRadius: 8,
    outline: 'none',
    fontFamily: 'inherit',
  },
  checkBtn: {
    padding: '9px 16px',
    background: '#1a56db',
    color: '#fff',
    border: 'none',
    borderRadius: 8,
    fontSize: 13,
    fontWeight: 500,
    cursor: 'pointer',
    whiteSpace: 'nowrap',
  },
  resultBox: {
    borderRadius: 8,
    padding: '12px 14px',
    fontSize: 13,
    lineHeight: 1.6,
  },
  hint: {
    fontSize: 12,
    color: '#999',
    marginTop: '0.5rem',
  },
};

export default TrackingGuide;