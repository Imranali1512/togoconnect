import { useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) navigate('/login');
  }, [user, navigate]);

  if (!user) return null;

  return (
    <div style={{ padding: '40px 0 60px', minHeight: 'calc(100vh - 62px)', background: '#f9fafb' }}>
      <div className="container">
        <div style={{ marginBottom: 32 }}>
          <h1 style={{ fontSize: 24, fontWeight: 700 }}>Welcome, {user.name}</h1>
          <p style={{ color: '#6b7280', marginTop: 4 }}>{user.email} · {user.city}</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16, marginBottom: 32 }}>
          {[
            { label: 'Account type', value: user.role === 'both' ? 'Buyer & Seller' : user.role === 'seller' ? 'Seller' : 'Buyer' },
            { label: 'City', value: user.city || '—' },
            { label: 'Member since', value: new Date().getFullYear() },
          ].map(s => (
            <div key={s.label} style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 10, padding: 20 }}>
              <div style={{ fontSize: 12, color: '#9ca3af', marginBottom: 6, fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{s.label}</div>
              <div style={{ fontSize: 20, fontWeight: 700 }}>{s.value}</div>
            </div>
          ))}
        </div>

        <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 12, padding: 28 }}>
          <h2 style={{ fontSize: 17, fontWeight: 600, marginBottom: 20 }}>Quick actions</h2>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            <Link to="/browse"><button className="btn-outline">Browse services</button></Link>
            {(user.role === 'seller' || user.role === 'both') && (
              <button className="btn-primary">Post a listing</button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
