import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { useAuth } from '@/context/AuthContext';
import '@/styles/ClaimsPage.css';

export function AccountPage() {
  const { user } = useAuth();

  const [noMailUpdates, setNoMailUpdates] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [email, setEmail] = useState(user?.email || 'rmmishra@developerbazaar.com');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [clientContact, setClientContact] = useState(user?.fullName || 'DB Tech');
  const [clientPhone, setClientPhone] = useState('+91 7415887200');
  const [language, setLanguage] = useState('English');
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    if (user?.email) {
      setEmail(user.email);
    }
    if (user?.fullName) {
      setClientContact(user.fullName);
    }

    // Hide Calendly badge on account page
    const hideCalendly = () => {
      const badge = document.querySelector('.calendly-badge-widget') as HTMLElement;
      if (badge) {
        badge.style.display = 'none';
      }
    };
    hideCalendly();
    const timer = setInterval(hideCalendly, 250);

    return () => {
      clearInterval(timer);
      const badge = document.querySelector('.calendly-badge-widget') as HTMLElement;
      if (badge) {
        badge.style.display = '';
      }
    };
  }, [user]);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
    }, 4000);
  };

  const activeEmail = user?.email || 'rmmishra@developerbazaar.com';

  return (
    <div className="dialog-off-canvas-main-canvas" data-off-canvas-main-canvas>
      <div className="page-wrapper">
        <Header />

        <div className="main-wrapper">
          <main role="main" className="main">
            <div className="page-with-sidebar">
              {/* Left Column: Account Settings Form */}
              <div className="page__content">
                <h1 className="claims-page__title">{activeEmail}</h1>

                {savedSuccess && (
                  <div className="claims-success-banner">
                    <div className="claims-success-banner__content">
                      <span className="claims-success-banner__icon">✓</span>
                      <span>Your account preferences and profile details have been saved successfully.</span>
                    </div>
                    <button
                      type="button"
                      className="claims-success-banner__close"
                      onClick={() => setSavedSuccess(false)}
                    >
                      ✕
                    </button>
                  </div>
                )}

                <div
                  style={{
                    backgroundColor: '#e9f7fb',
                    borderRadius: '5px',
                    padding: '30px 35px 35px',
                    boxSizing: 'border-box',
                    marginBottom: '40px',
                  }}
                >
                  <form onSubmit={handleSave}>
                    {/* Checkbox: Do not receive mail updates */}
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                        marginBottom: '24px',
                      }}
                    >
                      <input
                        type="checkbox"
                        id="mail-updates"
                        checked={noMailUpdates}
                        onChange={(e) => setNoMailUpdates(e.target.checked)}
                        style={{
                          width: '16px',
                          height: '16px',
                          cursor: 'pointer',
                          accentColor: '#1cbc66',
                        }}
                      />
                      <label
                        htmlFor="mail-updates"
                        style={{
                          fontSize: '0.875rem',
                          color: '#003147',
                          cursor: 'pointer',
                          fontWeight: 400,
                        }}
                      >
                        Do not receive mail updates
                      </label>
                    </div>

                    {/* Current password */}
                    <div style={{ marginBottom: '22px' }}>
                      <label
                        style={{
                          display: 'block',
                          fontFamily: 'var(--font-family--headers, "SansaPro", sans-serif)',
                          fontWeight: 700,
                          fontSize: '0.9375rem',
                          color: '#003147',
                          marginBottom: '8px',
                        }}
                      >
                        Current password
                      </label>
                      <input
                        type="password"
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        style={{
                          width: '100%',
                          height: '42px',
                          padding: '10px 14px',
                          borderRadius: '5px',
                          border: '1px solid #c2dbe9',
                          backgroundColor: '#ffffff',
                          fontSize: '0.9375rem',
                          color: '#003147',
                          boxSizing: 'border-box',
                        }}
                      />
                      <div
                        style={{
                          fontSize: '0.78rem',
                          color: '#557788',
                          marginTop: '6px',
                          lineHeight: 1.4,
                        }}
                      >
                        Required if you want to change the <em>Email address</em> or the <em>Password</em> field below.{' '}
                        <a
                          href="/en/user/password"
                          style={{ color: '#257aa7', textDecoration: 'none' }}
                        >
                          Reset your password.
                        </a>
                      </div>
                    </div>

                    {/* Email address * */}
                    <div style={{ marginBottom: '22px' }}>
                      <label
                        style={{
                          display: 'block',
                          fontFamily: 'var(--font-family--headers, "SansaPro", sans-serif)',
                          fontWeight: 700,
                          fontSize: '0.9375rem',
                          color: '#003147',
                          marginBottom: '8px',
                        }}
                      >
                        Email address *
                      </label>
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        style={{
                          width: '100%',
                          height: '42px',
                          padding: '10px 14px',
                          borderRadius: '5px',
                          border: '1px solid #c2dbe9',
                          backgroundColor: '#ffffff',
                          fontSize: '0.9375rem',
                          color: '#003147',
                          boxSizing: 'border-box',
                        }}
                      />
                      <div
                        style={{
                          fontSize: '0.78rem',
                          color: '#557788',
                          marginTop: '6px',
                          lineHeight: 1.4,
                        }}
                      >
                        The email address is not made public. It will only be used if you need to be contacted about your account or for opted-in notifications.
                      </div>
                    </div>

                    {/* Password */}
                    <div style={{ marginBottom: '22px' }}>
                      <label
                        style={{
                          display: 'block',
                          fontFamily: 'var(--font-family--headers, "SansaPro", sans-serif)',
                          fontWeight: 700,
                          fontSize: '0.9375rem',
                          color: '#003147',
                          marginBottom: '8px',
                        }}
                      >
                        Password
                      </label>
                      <input
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        style={{
                          width: '100%',
                          maxWidth: '340px',
                          height: '42px',
                          padding: '10px 14px',
                          borderRadius: '5px',
                          border: '1px solid #c2dbe9',
                          backgroundColor: '#ffffff',
                          fontSize: '0.9375rem',
                          color: '#003147',
                          boxSizing: 'border-box',
                        }}
                      />
                    </div>

                    {/* Confirm password */}
                    <div style={{ marginBottom: '22px' }}>
                      <label
                        style={{
                          display: 'block',
                          fontFamily: 'var(--font-family--headers, "SansaPro", sans-serif)',
                          fontWeight: 700,
                          fontSize: '0.9375rem',
                          color: '#003147',
                          marginBottom: '8px',
                        }}
                      >
                        Confirm password
                      </label>
                      <input
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        style={{
                          width: '100%',
                          maxWidth: '340px',
                          height: '42px',
                          padding: '10px 14px',
                          borderRadius: '5px',
                          border: '1px solid #c2dbe9',
                          backgroundColor: '#ffffff',
                          fontSize: '0.9375rem',
                          color: '#003147',
                          boxSizing: 'border-box',
                        }}
                      />
                    </div>

                    {/* Client contact */}
                    <div style={{ marginBottom: '22px' }}>
                      <label
                        style={{
                          display: 'block',
                          fontFamily: 'var(--font-family--headers, "SansaPro", sans-serif)',
                          fontWeight: 700,
                          fontSize: '0.9375rem',
                          color: '#003147',
                          marginBottom: '8px',
                        }}
                      >
                        Client contact
                      </label>
                      <input
                        type="text"
                        value={clientContact}
                        onChange={(e) => setClientContact(e.target.value)}
                        style={{
                          width: '100%',
                          height: '42px',
                          padding: '10px 14px',
                          borderRadius: '5px',
                          border: '1px solid #c2dbe9',
                          backgroundColor: '#ffffff',
                          fontSize: '0.9375rem',
                          color: '#003147',
                          boxSizing: 'border-box',
                        }}
                      />
                    </div>

                    {/* Client telephone */}
                    <div style={{ marginBottom: '22px' }}>
                      <label
                        style={{
                          display: 'block',
                          fontFamily: 'var(--font-family--headers, "SansaPro", sans-serif)',
                          fontWeight: 700,
                          fontSize: '0.9375rem',
                          color: '#003147',
                          marginBottom: '8px',
                        }}
                      >
                        Client telephone
                      </label>
                      <input
                        type="tel"
                        value={clientPhone}
                        onChange={(e) => setClientPhone(e.target.value)}
                        style={{
                          width: '100%',
                          height: '42px',
                          padding: '10px 14px',
                          borderRadius: '5px',
                          border: '1px solid #c2dbe9',
                          backgroundColor: '#ffffff',
                          fontSize: '0.9375rem',
                          color: '#003147',
                          boxSizing: 'border-box',
                        }}
                      />
                    </div>

                    {/* Site language */}
                    <div style={{ marginBottom: '26px' }}>
                      <label
                        style={{
                          display: 'block',
                          fontFamily: 'var(--font-family--headers, "SansaPro", sans-serif)',
                          fontWeight: 700,
                          fontSize: '0.9375rem',
                          color: '#003147',
                          marginBottom: '8px',
                        }}
                      >
                        Site language
                      </label>
                      <select
                        value={language}
                        onChange={(e) => setLanguage(e.target.value)}
                        style={{
                          width: '100%',
                          height: '42px',
                          padding: '10px 14px',
                          borderRadius: '5px',
                          border: '1px solid #c2dbe9',
                          backgroundColor: '#ffffff',
                          fontSize: '0.9375rem',
                          color: '#003147',
                          boxSizing: 'border-box',
                          cursor: 'pointer',
                        }}
                      >
                        <option value="English">English</option>
                        <option value="Nederlands">Nederlands</option>
                        <option value="Français">Français</option>
                      </select>
                      <div
                        style={{
                          fontSize: '0.78rem',
                          color: '#557788',
                          marginTop: '6px',
                          lineHeight: 1.4,
                        }}
                      >
                        This account's preferred language for emails. This is also assumed to be the primary language of this account's profile information.
                      </div>
                    </div>

                    {/* Save Action Button */}
                    <div>
                      <button
                        type="submit"
                        className="claims-page__btn-start"
                        style={{
                          margin: 0,
                          padding: '10px 24px',
                          minHeight: '40px',
                        }}
                      >
                        Save
                      </button>
                    </div>
                  </form>
                </div>
              </div>

              {/* Right Column: User Sidebar (Without "Your users") */}
              <aside className="page__sidebar">
                <div className="claims-sidebar-card">
                  <div className="claims-sidebar__user-email">
                    {activeEmail}
                  </div>

                  <nav className="claims-sidebar__nav">
                    <Link to="/claims" className="claims-sidebar__link">
                      Your claims
                    </Link>
                    <Link to="/companies" className="claims-sidebar__link">
                      Your companies
                    </Link>
                    <Link
                      to="/account"
                      className="claims-sidebar__link claims-sidebar__link--active"
                    >
                      Your account
                    </Link>
                  </nav>

                  <h3 className="claims-sidebar__section-title">Invoices to collect</h3>

                  <div className="claims-sidebar__integrations">
                    <div className="claims-sidebar__integration-item">Teamleader</div>
                    <div className="claims-sidebar__integration-item">Exact</div>
                    <div className="claims-sidebar__integration-item">Yuki</div>
                    <div className="claims-sidebar__integration-item">Go Getter</div>
                    <div className="claims-sidebar__integration-item">Visma Bouwsoft</div>
                    <div className="claims-sidebar__integration-item">Billtrust</div>
                  </div>
                </div>
              </aside>
            </div>
          </main>
        </div>

        {/* Floating Green "U" Icon Badge */}
        <div
          className="floating-unpaid-badge"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          title="Scroll to top"
        >
          <span className="floating-unpaid-badge__letter">u</span>
        </div>

        <Footer />
      </div>
    </div>
  );
}
