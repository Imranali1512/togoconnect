import { useState } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';

export default function Checkout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { plan = 'Seller Pro', price = 9900, period = 'monthly' } = location.state || {};

  const [form, setForm] = useState({ email: '', name: '', card: '', expiry: '', cvv: '', zip: '' });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const fmt = (n) => n.toLocaleString();

  const validate = () => {
    const e = {};
    if (!form.email) e.email = 'Email required';
    if (!form.name) e.name = 'Name required';
    if (!form.card || form.card.length < 16) e.card = 'Valid card number required';
    if (!form.expiry) e.expiry = 'Required';
    if (!form.cvv) e.cvv = 'Required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handlePay = async () => {
    if (!validate()) return;
    setLoading(true);
    await new Promise(r => setTimeout(r, 1800));
    navigate('/order-success', { state: { plan, price, period } });
  };

  const fmtCard = (val) => val.replace(/\D/g, '').slice(0, 16).replace(/(.{4})/g, '$1 ').trim();
  const fmtExpiry = (val) => { const v = val.replace(/\D/g, '').slice(0, 4); return v.length > 2 ? v.slice(0,2) + '/' + v.slice(2) : v; };

  return (
    <div className="checkout-page">
      <div className="checkout-wrap">
        {/* LEFT — FORM */}
        <div className="checkout-form-card">
          <div className="checkout-form-header">
            <h2>Complete your purchase</h2>
            <p>Secure checkout · Cancel anytime · 7-day money-back</p>
          </div>
          <div className="checkout-form-body">

            {/* Step 1 — Account */}
            <div className="checkout-step-block">
              <div className="step-circle">1</div>
              <div style={{ flex: 1 }}>
                <div className="step-title">Account details</div>
                <div className="step-sub">Where we'll send your receipt and account info</div>
                <input
                  className="checkout-inp"
                  type="email"
                  placeholder="Email address"
                  value={form.email}
                  onChange={e => setForm({ ...form, email: e.target.value })}
                />
                {errors.email && <div style={{ color: '#dc2626', fontSize: 12, marginTop: -6, marginBottom: 8 }}>{errors.email}</div>}
                <input
                  className="checkout-inp"
                  type="text"
                  placeholder="Full name"
                  value={form.name}
                  onChange={e => setForm({ ...form, name: e.target.value })}
                />
                {errors.name && <div style={{ color: '#dc2626', fontSize: 12, marginTop: -6, marginBottom: 8 }}>{errors.name}</div>}
              </div>
            </div>

            {/* Step 2 — Payment */}
            <div className="checkout-step-block">
              <div className="step-circle">2</div>
              <div style={{ flex: 1 }}>
                <div className="step-title">Payment details</div>
                <div className="step-sub">All major cards · MTN Mobile Money · Moov</div>

                {/* Card type badges */}
                <div style={{ display: 'flex', gap: 8, margin: '10px 0', flexWrap: 'wrap' }}>
                  {['💳 Visa', '💳 Mastercard', '📱 MTN MoMo', '📱 Moov'].map(t => (
                    <span key={t} style={{ fontSize: 11, padding: '3px 9px', background: 'var(--bg)', border: '1px solid var(--b)', borderRadius: 6, color: '#374151', fontWeight: 600 }}>{t}</span>
                  ))}
                </div>

                <input
                  className="checkout-inp"
                  type="text"
                  placeholder="Card number"
                  value={form.card}
                  onChange={e => setForm({ ...form, card: fmtCard(e.target.value) })}
                  maxLength={19}
                />
                {errors.card && <div style={{ color: '#dc2626', fontSize: 12, marginTop: -6, marginBottom: 8 }}>{errors.card}</div>}
                <div className="card-inputs">
                  <input className="checkout-inp" type="text" placeholder="MM / YY" value={form.expiry} onChange={e => setForm({ ...form, expiry: fmtExpiry(e.target.value) })} maxLength={5} />
                  <input className="checkout-inp" type="text" placeholder="CVV" value={form.cvv} onChange={e => setForm({ ...form, cvv: e.target.value.slice(0,4) })} maxLength={4} />
                  <input className="checkout-inp" type="text" placeholder="ZIP" value={form.zip} onChange={e => setForm({ ...form, zip: e.target.value })} />
                </div>
                {(errors.expiry || errors.cvv) && <div style={{ color: '#dc2626', fontSize: 12 }}>Please fill all card fields</div>}
              </div>
            </div>

          </div>
        </div>

        {/* RIGHT — ORDER SUMMARY */}
        <div>
          <div className="order-summary-card">
            <h3>Order summary</h3>

            <div className="order-plan-box">
              <div className="order-plan-name">TogoConnect {plan}</div>
              <div className="order-plan-period">Billed {period === 'yearly' ? 'annually' : 'monthly'}</div>
            </div>

            <div className="order-row">
              <span>Subtotal</span>
              <span>{fmt(price)} CFA</span>
            </div>
            <div className="order-row">
              <span>Tax (0%)</span>
              <span>0 CFA</span>
            </div>
            {period === 'yearly' && (
              <div className="order-row" style={{ color: 'var(--g)', fontWeight: 700 }}>
                <span>🎉 Yearly discount</span>
                <span>-30%</span>
              </div>
            )}
            <div className="order-total">
              <span>Total today</span>
              <span>{fmt(price)} CFA</span>
            </div>

            <button className="btn-pay" onClick={handlePay} disabled={loading}>
              {loading ? '⏳ Processing...' : `🔒 Pay ${fmt(price)} CFA`}
            </button>

            <div className="security-badges">
              <span className="sec-badge">🔐 SSL Encrypted</span>
              <span className="sec-badge">✅ PCI Compliant</span>
              <span className="sec-badge">🔄 Cancel anytime</span>
            </div>

            <div className="guarantee-box">
              <strong>7-day money-back guarantee</strong><br />
              Not happy? Full refund within 7 days, no questions asked.
            </div>
          </div>

          <div style={{ marginTop: 14, textAlign: 'center' }}>
            <Link to="/pricing" style={{ fontSize: 13, color: 'var(--g)', fontWeight: 600 }}>← Back to pricing</Link>
          </div>
        </div>

      </div>
    </div>
  );
}
