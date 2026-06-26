import { Link, useLocation } from 'react-router-dom';

export default function Footer() {
  const { pathname } = useLocation();
  const isActive = (path) => pathname === path;

  const fl = (to, label) => (
    <Link to={to} style={{
      display: 'block',
      fontSize: 13,
      marginBottom: 9,
      fontWeight: isActive(to) ? 700 : 400,
      color: isActive(to) ? '#5DCAA5' : '#475569',
      borderLeft: isActive(to) ? '2px solid #1D9E75' : '2px solid transparent',
      paddingLeft: isActive(to) ? 8 : 0,
      transition: 'all .15s',
    }}
    onMouseEnter={e => { if (!isActive(to)) e.currentTarget.style.color = '#fff'; }}
    onMouseLeave={e => { if (!isActive(to)) e.currentTarget.style.color = '#475569'; }}
    >{label}</Link>
  );

  return (
    <footer className="site-footer">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-brand">
            <div className="footer-logo">
              <div className="footer-logo-icon">T</div>
              <span className="footer-logo-text">Togo<span style={{color:"#15803d"}}>Connect</span></span>
            </div>
            <p>The simple, trusted way to find and offer local services across Togo and West Africa.</p>
            <div style={{ marginTop:16, fontSize:13, color:'#334155' }}>
              <div>📧 hello@Togo<span style={{color:"#15803d"}}>Connect</span>.com</div>
              <div style={{ marginTop:4 }}>📍 Lomé, Togo</div>
            </div>
            <div className="footer-social" style={{ marginTop:16 }}>
              <div className="social-btn">𝕏</div>
              <div className="social-btn">f</div>
              <div className="social-btn">in</div>
              <div className="social-btn">📷</div>
            </div>
          </div>

          <div className="footer-col">
            <h4>Platform</h4>
            {fl('/services','Browse Services')}
            {fl('/pricing','Pricing & Plans')}
            {fl('/signup','Become a Seller')}
            {fl('/login','Sign In')}
            {fl('/dashboard','Dashboard')}
          </div>

          <div className="footer-col">
            <h4>Company</h4>
            {fl('/about','About Us')}
            {fl('/blog','Blog')}
            {fl('/careers','Careers')}
            {fl('/contact','Contact Us')}
          </div>

          <div className="footer-col">
            <h4>Support</h4>
            {fl('/how-it-works','How It Works')}
            {fl('/safety-tips','Safety Tips')}
            {fl('/help','Help Center')}
            {fl('/privacy','Privacy Policy')}
            {fl('/terms','Terms & Conditions')}
          </div>
        </div>

        <div className="footer-bottom">
          <span>© 2026 Togo<span style={{color:"#15803d"}}>Connect</span>. All Rights Reserved. Built by <strong style={{ color:'#5DCAA5' }}>Qaim Systems</strong>.</span>
          <div className="footer-badge">
            <span className="footer-badge-dot"></span>
            All systems operational
          </div>
        </div>
      </div>
    </footer>
  );
}

