import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const [form, setForm] = useState({ email:'', password:'' });
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPw, setShowPw] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from || '/dashboard';

  const set = (k, v) => {
    setForm(f => ({ ...f, [k]: v }));
    if (errors[k]) setErrors(e => ({ ...e, [k]: '' }));
    setApiError('');
  };

  const validate = () => {
    const e = {
      email: !form.email ? 'Email is required' : !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email) ? 'Enter a valid email' : '',
      password: !form.password ? 'Password is required' : '',
    };
    setErrors(e);
    return !Object.values(e).some(Boolean);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    setApiError('');
    try {
      const { data } = await axios.post('/api/auth/login', {
        email: form.email.toLowerCase().trim(),
        password: form.password,
      });
      login(data);
      navigate(from, { replace: true });
    } catch (err) {
      const msg = err.response?.data?.message || 'Login failed. Please try again.';
      setApiError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        {/* Logo */}
        <Link to="/" style={{ display:'flex', alignItems:'center', gap:8, marginBottom:24, width:'fit-content' }}>
          <div className="logo-icon" style={{ width:32, height:32, borderRadius:9, fontSize:14 }}>T</div>
          <span style={{ fontWeight:800, fontSize:16, color:'#0f1923', letterSpacing:'-.01em' }}>TogoConnect</span>
        </Link>

        <h2>Welcome back</h2>
        <p className="subtitle">Log in to your TogoConnect account</p>

        {/* Redirect message */}
        {location.state?.from && (
          <div style={{ background:'#fefce8', border:'1px solid #fde047', borderRadius:8, padding:'10px 14px', fontSize:13, color:'#713f12', marginBottom:16 }}>
            🔐 Please log in to continue
          </div>
        )}

        {apiError && (
          <div className="error-msg">
            {apiError}
            {apiError.toLowerCase().includes('invalid') && (
              <div style={{ marginTop:4 }}>
                <Link to="/signup" style={{ color:'#dc2626', fontWeight:700 }}>Don't have an account? Sign up →</Link>
              </div>
            )}
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate>
          {/* Email */}
          <div className="form-group">
            <label>Email address</label>
            <input
              type="email"
              placeholder="you@example.com"
              value={form.email}
              onChange={e => set('email', e.target.value)}
              autoComplete="email"
              style={errors.email ? { borderColor:'#ef4444' } : {}}
            />
            {errors.email && <div className="field-error">{errors.email}</div>}
          </div>

          {/* Password */}
          <div className="form-group">
            <div style={{ display:'flex', justifyContent:'space-between', marginBottom:6 }}>
              <label style={{ margin:0 }}>Password</label>
              <a href="#" style={{ fontSize:12, color:'#1D9E75', fontWeight:600 }}>Forgot password?</a>
            </div>
            <div style={{ position:'relative' }}>
              <input
                type={showPw ? 'text' : 'password'}
                placeholder="Your password"
                value={form.password}
                onChange={e => set('password', e.target.value)}
                autoComplete="current-password"
                style={{ ...(errors.password ? { borderColor:'#ef4444' } : {}), paddingRight:44 }}
              />
              <button
                type="button"
                onClick={() => setShowPw(!showPw)}
                style={{ position:'absolute', right:12, top:'50%', transform:'translateY(-50%)', background:'none', border:'none', fontSize:16, cursor:'pointer', color:'#6b7280' }}>
                {showPw ? '🙈' : '👁️'}
              </button>
            </div>
            {errors.password && <div className="field-error">{errors.password}</div>}
          </div>

          <button type="submit" className="form-submit" disabled={loading}>
            {loading ? (
              <span style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:8 }}>
                <span style={{ width:16, height:16, border:'2px solid rgba(255,255,255,.4)', borderTopColor:'#fff', borderRadius:'50%', animation:'spin .7s linear infinite', display:'inline-block' }}></span>
                Logging in...
              </span>
            ) : 'Log in to my account'}
          </button>
        </form>

        <p className="auth-switch">Don't have an account? <Link to="/signup">Sign up free</Link></p>

        <div style={{ display:'flex', alignItems:'center', gap:12, margin:'18px 0 0' }}>
          <div style={{ flex:1, height:1, background:'#e2e8f0' }}></div>
          <span style={{ fontSize:12, color:'#9ca3af' }}>Secure login</span>
          <div style={{ flex:1, height:1, background:'#e2e8f0' }}></div>
        </div>
        <div style={{ display:'flex', justifyContent:'center', gap:16, marginTop:12 }}>
          {['🔒 SSL', '✅ Safe', '🔐 Private'].map(t => (
            <span key={t} style={{ fontSize:11, color:'#6b7280', fontWeight:500 }}>{t}</span>
          ))}
        </div>
      </div>
    </div>
  );
}
