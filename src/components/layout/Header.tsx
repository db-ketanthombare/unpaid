import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';

export function Header() {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const { isAuthenticated, logout } = useAuth();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const isLoginPage = location.pathname.includes('/login');

  return (
    <header className="main-header header--auth" role="banner">
      <div className="container">
        <div id="block-epsenkaas-theme-branding" className="block block-system block-system-branding-block">
          <div className="logo-wrapper">
            <Link className="site-logo" to="/en" title="Home" rel="home">
              <img src="/assets/logo.svg" alt="Home" />
            </Link>
          </div>
        </div>

        <div id="block-headermenu" className="block block-project block-ek-menu-block">
          <div
            className={`nav-toggle--menu ${menuOpen ? 'open' : ''}`}
            onClick={() => setMenuOpen(!menuOpen)}
          >
            Menu
          </div>
          <button
            aria-label="Menu"
            className={`nav-toggle ${menuOpen ? 'open' : ''}`}
            onClick={() => setMenuOpen(!menuOpen)}
          >
            Menu
            <span></span>
            <span></span>
            <span></span>
            <span></span>
          </button>

          <div className={`menu-wrapper ${menuOpen ? 'open' : ''}`}>
            <nav className="main-menu">
              <ul className="menu">
                <li className="menu-item">
                  <a href="/en/whom">For whom?</a>
                </li>
                <li className="menu-item">
                  <a href="/en/faq">FAQ</a>
                </li>
                <li className="menu-item">
                  <a href="/en/discover">Knowledge center</a>
                </li>
                <li className="menu-item">
                  <a href="/en/contact">Contact</a>
                </li>
              </ul>
            </nav>

            <nav className="account-menu">
              <ul className="menu">
                <li className="menu-item">
                  {isAuthenticated ? (
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                      <Link
                        to="/claims"
                        className="account-menu__claims-btn"
                        style={{
                          backgroundColor: '#ffffff',
                          color: '#003147',
                          fontWeight: 600,
                          padding: '8px 16px',
                          borderRadius: '6px',
                          display: 'inline-block',
                          textDecoration: 'none',
                          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.08)',
                          fontSize: '0.92rem',
                        }}
                      >
                        Your claims
                      </Link>
                      <button
                        type="button"
                        onClick={handleLogout}
                        className="account-menu__logout-btn"
                        style={{
                          backgroundColor: '#ffffff',
                          color: '#003147',
                          fontWeight: 600,
                          padding: '8px 16px',
                          borderRadius: '6px',
                          border: 'none',
                          cursor: 'pointer',
                          display: 'inline-block',
                          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.08)',
                          fontSize: '0.92rem',
                        }}
                      >
                        Log out
                      </button>
                    </div>
                  ) : (
                    <Link
                      to="/en/user/login"
                      className={isLoginPage ? 'is-active' : ''}
                      aria-current={isLoginPage ? 'page' : undefined}
                    >
                      Log in
                    </Link>
                  )}
                </li>
              </ul>
            </nav>

            <ul className="language-switcher">
              <li>
                <a href="/nl/startpagina" hrefLang="nl">
                  NL
                </a>
              </li>
              <li className="active">EN</li>
              <li>
                <a href="/fr/page-daccueil" hrefLang="fr">
                  FR
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </header>
  );
}
