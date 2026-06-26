import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useEffect, useState } from 'react';

const NAV_LINKS = [
  { to: '/', label: 'Home' },
  { to: '/services', label: 'Services' },
  { to: '/pricing', label: 'Pricing' },
  { to: '/about', label: 'About' },
  { to: '/contact', label: 'Contact' },
];

const Logo = () => (
  <>
    <div className="logo-icon">T</div>
    <span style={{fontWeight:800,fontSize:17,letterSpacing:'-.02em',color:'#0f1923'}}>Togo<span style={{color:'#15803d'}}>Connect</span></span>
  </>
);

export default function Navbar() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', fn);
    return () => window.removeEventListener('scroll', fn);
  }, []);

  useEffect(() => setMenuOpen(false), [location]);

  const isActive = (to) =>
    to === '/' ? location.pathname === '/' : location.pathname.startsWith(to);

  return (
    <>
      <nav className={`navbar${scrolled ? ' scrolled' : ''}`}>
        <div className="container navbar-inner">
          <Link to="/" className="navbar-logo">
            <Logo />
          </Link>

          <div className="navbar-links">
            {NAV_LINKS.map(l => (
              <Link key={l.to} to={l.to} className={`nav-link${isActive(l.to) ? ' active' : ''}`}>
                {l.label}
              </Link>
            ))}
          </div>

          <div className="navbar-actions">
            {user ? (
              <>
                <Link to="/dashboard">
                  <button className="btn-ghost" style={{ display:'flex', alignItems:'center', gap:7 }}>
                    <div style={{ width:24, height:24, borderRadius:'50%', background:'linear-gradient(135deg,#15803d,#14532d)', display:'flex', alignItems:'center', justifyContent:'center', color:'#fff', fontSize:10, fontWeight:800 }}>
                      {user.name?.charAt(0).toUpperCase()}
                    </div>
                    <span className="nav-user-name">{user.name?.split(' ')[0]}</span>
                  </button>
                </Link>
                <button className="btn-ghost nav-desktop-only" onClick={() => { logout(); navigate('/'); }}>Log out</button>
              </>
            ) : (
              <>
                <Link to="/login"><button className="btn-ghost nav-desktop-only">Log in</button></Link>
                <Link to="/pricing"><button className="btn-primary">View plans</button></Link>
              </>
            )}
            <button className="nav-hamburger" onClick={() => setMenuOpen(!menuOpen)} aria-label="Menu">
              <span className={`ham-line${menuOpen ? ' open' : ''}`}></span>
              <span className={`ham-line${menuOpen ? ' open' : ''}`}></span>
              <span className={`ham-line${menuOpen ? ' open' : ''}`}></span>
            </button>
          </div>
        </div>
      </nav>

      {menuOpen && (
        <div className="mobile-menu" onClick={() => setMenuOpen(false)}>
          <div className="mobile-menu-inner" onClick={e => e.stopPropagation()}>
            <div className="mobile-menu-header">
              <div className="navbar-logo">
                <Logo />
              </div>
              <button className="mobile-menu-close" onClick={() => setMenuOpen(false)}>✕</button>
            </div>
            <div className="mobile-menu-links">
              {NAV_LINKS.map(l => (
                <Link key={l.to} to={l.to} className={`mobile-nav-link${isActive(l.to) ? ' active' : ''}`}>
                  {l.label}
                </Link>
              ))}
            </div>
            <div className="mobile-menu-actions">
              {user ? (
                <>
                  <Link to="/dashboard" className="mobile-btn-primary">My Dashboard</Link>
                  <button className="mobile-btn-outline" onClick={() => { logout(); navigate('/'); setMenuOpen(false); }}>Log out</button>
                </>
              ) : (
                <>
                  <Link to="/signup" className="mobile-btn-primary">Sign up free</Link>
                  <Link to="/login" className="mobile-btn-outline">Log in</Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}