import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const EMOJI = { Plumbing: '🔧', Tutoring: '📚', Photography: '📷', Cleaning: '🧹', 'Tech Repair': '💻', Barber: '✂️', Tailoring: '🧵', Design: '🎨', Other: '⭐' };

export default function ListingDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [sent, setSent] = useState(false);
  const [msgError, setMsgError] = useState('');

  useEffect(() => {
    axios.get(`/api/listings/${id}`)
      .then(r => setListing(r.data))
      .catch(() => setListing(null))
      .finally(() => setLoading(false));
  }, [id]);

  const handleMessage = async () => {
    if (!user) { navigate('/login'); return; }
    if (!message.trim()) return;
    try {
      await axios.post('/api/messages', { receiver_id: listing.seller_id, listing_id: listing.id, text: message });
      setSent(true); setMessage('');
    } catch { setMsgError('Could not send. Please try again.'); }
  };

  if (loading) return <div className="loader"><div className="spinner"></div></div>;
  if (!listing) return <div className="container" style={{ padding: '80px 24px', textAlign: 'center' }}><div style={{ fontSize: 48, marginBottom: 16 }}>😕</div><h2>Listing not found</h2><Link to="/services" className="btn-primary" style={{ display: 'inline-block', marginTop: 20, textDecoration: 'none' }}>Browse services</Link></div>;

  return (
    <div className="listing-detail">
      <div className="container">
        {/* Breadcrumb */}
        <div style={{ display: 'flex', gap: 8, alignItems: 'center', fontSize: 13, color: 'var(--text-muted)', marginBottom: 28 }}>
          <Link to="/" style={{ color: 'var(--text-muted)' }}>Home</Link>
          <span>›</span>
          <Link to="/services" style={{ color: 'var(--text-muted)' }}>Services</Link>
          <span>›</span>
          <span style={{ color: 'var(--green-dark)', fontWeight: 500 }}>{listing.category}</span>
        </div>

        <div className="listing-detail-grid">
          <div>
            <div className="listing-detail-img">
              {listing.image
                ? <img src={listing.image} alt={listing.title} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 18 }} />
                : <span>{EMOJI[listing.category] || '⭐'}</span>
              }
            </div>

            <div style={{ display: 'inline-block', background: 'var(--green-light)', color: 'var(--green-dark)', fontSize: 12, fontWeight: 700, padding: '4px 12px', borderRadius: 100, letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 12 }}>
              {listing.category}
            </div>
            <h1 style={{ fontFamily: "'Playfair Display', serif" }}>{listing.title}</h1>

            <div style={{ display: 'flex', alignItems: 'center', gap: 10, margin: '12px 0 20px', flexWrap: 'wrap' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <div style={{ width: 30, height: 30, borderRadius: '50%', background: 'linear-gradient(135deg,var(--green),var(--green-dark))', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 12, fontWeight: 800 }}>
                  {listing.seller_name?.charAt(0)}
                </div>
                <span style={{ fontSize: 14, color: 'var(--text-muted)' }}>by <strong style={{ color: 'var(--text)' }}>{listing.seller_name}</strong></span>
              </div>
            </div>

            <div className="listing-detail-meta">
              <span className="meta-pill">⭐ {Number(listing.rating || 0).toFixed(1)} ({listing.num_reviews} reviews)</span>
              <span className="meta-pill">📍 {listing.is_remote ? 'Remote / Online' : listing.city}</span>
            </div>

            <div style={{ marginTop: 28, paddingTop: 28, borderTop: '1px solid var(--border)' }}>
              <h3 style={{ fontSize: 17, fontWeight: 700, marginBottom: 14 }}>About this service</h3>
              <p className="listing-detail-desc">{listing.description || 'No description provided.'}</p>
            </div>

            {listing.reviews?.length > 0 && (
              <div style={{ marginTop: 36, paddingTop: 28, borderTop: '1px solid var(--border)' }}>
                <h3 style={{ fontSize: 17, fontWeight: 700, marginBottom: 20 }}>
                  Reviews <span style={{ color: 'var(--text-muted)', fontWeight: 400, fontSize: 14 }}>({listing.reviews.length})</span>
                </h3>
                {listing.reviews.map(r => (
                  <div key={r.id} style={{ background: 'var(--bg-gray)', borderRadius: 12, padding: '18px 20px', marginBottom: 12 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                      <span style={{ fontWeight: 700, fontSize: 14 }}>{r.user_name}</span>
                      <span style={{ color: '#f59e0b', fontSize: 13 }}>{'★'.repeat(r.rating)}{'☆'.repeat(5 - r.rating)}</span>
                    </div>
                    <p style={{ fontSize: 14, color: 'var(--text-muted)', lineHeight: 1.6 }}>{r.comment}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Contact card */}
          <div>
            <div className="contact-card">
              <div className="price">
                {listing.price_type === 'from' ? 'From ' : ''}{Number(listing.price).toLocaleString()} CFA
              </div>
              <div className="price-label">
                {listing.price_type === 'hourly' ? 'per hour' : listing.price_type === 'from' ? 'starting price' : 'fixed price'} · Free to contact
              </div>

              {sent ? (
                <div style={{ background: '#f0fdf4', border: '1.5px solid #86efac', borderRadius: 10, padding: '18px', color: '#15803d', textAlign: 'center' }}>
                  <div style={{ fontSize: 28, marginBottom: 8 }}>✅</div>
                  <strong>Message sent!</strong>
                  <p style={{ fontSize: 13, marginTop: 4, opacity: 0.85 }}>The seller will get back to you soon.</p>
                </div>
              ) : (
                <>
                  <textarea
                    placeholder={`Hi ${listing.seller_name?.split(' ')[0]}, I'm interested in your service and would like to know more...`}
                    value={message}
                    onChange={e => setMessage(e.target.value)}
                  />
                  {msgError && <div className="error-msg">{msgError}</div>}
                  <button className="btn-primary" style={{ width: '100%', padding: 13 }} onClick={handleMessage}>
                    {user ? '💬 Send message' : '🔐 Log in to message'}
                  </button>
                </>
              )}

              <div style={{ marginTop: 20, padding: '14px', background: 'var(--bg-gray)', borderRadius: 9, fontSize: 12, color: 'var(--text-muted)', lineHeight: 1.7 }}>
                ✅ No booking fees &nbsp;·&nbsp; ✅ Direct contact &nbsp;·&nbsp; ✅ 100% free
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
