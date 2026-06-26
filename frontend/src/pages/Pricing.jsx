import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const PLANS = [
  {
    id: 'free',
    name: 'Free',
    monthly: 0,
    yearly: 0,
    features: [
      { text: 'Browse all services', ok: true },
      { text: 'Send 3 messages/month', ok: true },
      { text: 'Leave reviews', ok: true },
      { text: 'Post listings', ok: false },
      { text: 'Featured placement', ok: false },
      { text: 'Analytics dashboard', ok: false },
    ],
    btn: 'Get started free',
    style: 'outline',
    link: '/signup',
  },
  {
    id: 'seller',
    name: 'Seller Pro',
    monthly: 9900,
    yearly: 6900,
    popular: true,
    features: [
      { text: 'Everything in Free', ok: true },
      { text: 'Post up to 5 listings', ok: true },
      { text: 'Unlimited messages', ok: true },
      { text: 'Verified seller badge', ok: true },
      { text: 'Basic analytics', ok: true },
      { text: 'Featured placement', ok: false },
    ],
    btn: 'Get Seller Pro →',
    style: 'fill',
  },
  {
    id: 'business',
    name: 'Business',
    monthly: 24900,
    yearly: 17900,
    features: [
      { text: 'Everything in Seller Pro', ok: true },
      { text: 'Unlimited listings', ok: true },
      { text: 'Featured placement', ok: true },
      { text: 'Priority support', ok: true },
      { text: 'Full analytics dashboard', ok: true },
      { text: 'Custom profile banner', ok: true },
    ],
    btn: 'Get Business →',
    style: 'outline',
  },
];

const COMPARE = [
  { feat: 'Browse services', free: '✓', seller: '✓', business: '✓' },
  { feat: 'Send messages', free: '3/month', seller: 'Unlimited', business: 'Unlimited' },
  { feat: 'Post listings', free: '—', seller: 'Up to 5', business: 'Unlimited' },
  { feat: 'Featured placement', free: '—', seller: '—', business: '✓' },
  { feat: 'Verified badge', free: '—', seller: '✓', business: '✓' },
  { feat: 'Analytics', free: '—', seller: 'Basic', business: 'Full' },
  { feat: 'Priority support', free: '—', seller: '—', business: '✓' },
  { feat: 'Custom banner', free: '—', seller: '—', business: '✓' },
];

export default function Pricing() {
  const [yearly, setYearly] = useState(false);
  const navigate = useNavigate();

  const fmt = (n) => n.toLocaleString();

  const handlePlan = (plan) => {
    if (plan.id === 'free') { navigate('/signup'); return; }
    navigate('/checkout', { state: { plan: plan.name, price: yearly ? plan.yearly : plan.monthly, period: yearly ? 'yearly' : 'monthly' } });
  };

  return (
    <>
      {/* HERO */}
      <div className="pricing-hero">
        <div className="container">
          <div className="section-label">Simple pricing</div>
          <h1>Choose your plan</h1>
          <p>Start free as a buyer. Upgrade when you're ready to grow as a seller. No hidden fees, ever.</p>

          <div className="billing-toggle">
            <span className={`tog-label${!yearly ? ' active' : ''}`}>Monthly</span>
            <div className={`toggle-track${yearly ? ' yearly' : ''}`} onClick={() => setYearly(!yearly)}>
              <div className="toggle-thumb"></div>
            </div>
            <span className={`tog-label${yearly ? ' active' : ''}`}>
              Yearly <span className="save-pill">Save 30%</span>
            </span>
          </div>
        </div>
      </div>

      {/* PLANS */}
      <div className="plans-section">
        <div className="plans-grid" style={{ marginTop: -20 }}>
          {PLANS.map(plan => (
            <div key={plan.id} className={`plan-card${plan.popular ? ' popular' : ''}`}>
              {plan.popular && <div className="popular-badge">⭐ Most Popular</div>}
              <div className="plan-name">{plan.name}</div>
              <div className="plan-price">
                <span className="plan-price-cur">CFA</span>
                <span className="plan-price-amt">{fmt(yearly ? plan.yearly : plan.monthly)}</span>
              </div>
              <div className="plan-per">
                {plan.monthly === 0 ? 'forever free' : yearly ? 'per month, billed yearly' : 'per month'}
              </div>
              <div className="plan-orig" style={{ visibility: yearly && plan.monthly > 0 ? 'visible' : 'hidden' }}>
                was {fmt(plan.monthly)} CFA
              </div>
              <div className="plan-divider"></div>
              <div className="plan-features">
                {plan.features.map((f, i) => (
                  <div key={i} className={`plan-feat${!f.ok ? ' dim' : ''}`}>
                    <span className={f.ok ? 'feat-check' : 'feat-check feat-x'}>{f.ok ? '✓' : '✗'}</span>
                    {f.text}
                  </div>
                ))}
              </div>
              <button
                className={`btn-plan ${plan.style === 'fill' ? 'btn-plan-fill' : 'btn-plan-outline'}`}
                onClick={() => handlePlan(plan)}
              >
                {plan.btn}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* COMPARE TABLE */}
      <div style={{ background: '#fff', padding: '0 0 60px' }}>
        <div className="compare-wrap">
          <div className="section-label">Compare plans</div>
          <div className="section-title">Everything included</div>
          <table className="comp-table">
            <thead>
              <tr>
                <th style={{ width: '40%' }}>Feature</th>
                <th>Free</th>
                <th className="comp-hl" style={{ color: 'var(--gd)' }}>Seller Pro</th>
                <th>Business</th>
              </tr>
            </thead>
            <tbody>
              {COMPARE.map((row, i) => (
                <tr key={i}>
                  <td style={{ color: '#0f1923', fontWeight: 500 }}>{row.feat}</td>
                  <td>
                    <span className={row.free === '✓' ? 'check-icon' : row.free === '—' ? 'cross-icon' : ''}>
                      {row.free}
                    </span>
                  </td>
                  <td className="comp-hl">
                    <span className={row.seller === '✓' || row.seller === 'Unlimited' || row.seller === 'Basic' ? 'check-icon' : row.seller === '—' ? 'cross-icon' : ''}>
                      {row.seller}
                    </span>
                  </td>
                  <td>
                    <span className={row.business === '✓' || row.business === 'Unlimited' || row.business === 'Full' ? 'check-icon' : row.business === '—' ? 'cross-icon' : ''}>
                      {row.business}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* FAQ strip */}
      <div style={{ background: 'var(--bg)', padding: '48px 0' }}>
        <div className="container" style={{ maxWidth: 720 }}>
          <div style={{ textAlign: 'center', marginBottom: 32 }}>
            <div className="section-label">Questions</div>
            <div className="section-title" style={{ fontSize: 26 }}>Pricing FAQs</div>
          </div>
          {[
            { q: 'Can I cancel anytime?', a: 'Yes. Cancel at any time from your dashboard. You keep access until the end of your billing period.' },
            { q: 'Is there a free trial?', a: 'The Free plan is available forever. Paid plans include a 7-day money-back guarantee.' },
            { q: 'What payment methods do you accept?', a: 'We accept all major credit/debit cards and mobile money (MTN, Moov) for local payments.' },
            { q: 'Can I switch plans later?', a: 'Yes, upgrade or downgrade anytime. Upgrades are instant; downgrades apply at next billing cycle.' },
          ].map((item, i) => (
            <div key={i} className="faq-item">
              <div className="faq-q">Q: {item.q}</div>
              <div className="faq-a">{item.a}</div>
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <section className="cta-banner">
        <div className="container">
          <h2>Still not sure?</h2>
          <p>Start with the free plan — no credit card required. Upgrade when you need more.</p>
          <div className="cta-buttons">
            <Link to="/signup"><button className="btn-white">Get started free</button></Link>
            <Link to="/contact"><button className="btn-outline-white">Talk to us →</button></Link>
          </div>
        </div>
      </section>
    </>
  );
}
