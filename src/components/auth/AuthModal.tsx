import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import './AuthModal.css';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  invoiceInfo?: {
    number?: string;
    amount?: string | number;
    currency?: string;
  };
  initialTab?: 'login' | 'register';
}

export function AuthModal({
  isOpen,
  onClose,
  onSuccess,
  invoiceInfo,
}: AuthModalProps) {
  const { login, register } = useAuth();

  // Login form state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState<string | null>(null);
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // Registration form state
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [showRegPassword, setShowRegPassword] = useState(false);
  const [regError, setRegError] = useState<string | null>(null);
  const [isRegistering, setIsRegistering] = useState(false);

  if (!isOpen) return null;

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);
    setIsLoggingIn(true);

    try {
      await login({ email: loginEmail, password: loginPassword });
      onSuccess();
      onClose();
    } catch (err: unknown) {
      setLoginError(err instanceof Error ? err.message : 'Invalid username or password.');
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setRegError(null);

    if (!showRegPassword) {
      if (!regEmail || !regEmail.includes('@')) {
        setRegError('Please enter a valid email address.');
        return;
      }
      setShowRegPassword(true);
      return;
    }

    if (!regPassword || regPassword.length < 8) {
      setRegError('Password must be at least 8 characters long.');
      return;
    }

    setIsRegistering(true);

    try {
      const derivedName = regEmail.split('@')[0];
      await register({
        fullName: derivedName,
        companyName: derivedName + ' BV',
        email: regEmail,
        password: regPassword,
        confirmPassword: regPassword,
        country: 'Belgium',
        termsAndCondition: true,
      });
      onSuccess();
      onClose();
    } catch (err: unknown) {
      setRegError(err instanceof Error ? err.message : 'Registration failed.');
    } finally {
      setIsRegistering(false);
    }
  };

  return (
    <div className="auth-modal-overlay" onClick={onClose}>
      <div
        className="auth-modal-card auth-modal-card--exact-clone"
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: '960px', padding: '36px 36px 30px' }}
      >
        <button
          type="button"
          className="auth-modal-close"
          onClick={onClose}
          aria-label="Close modal"
        >
          ✕
        </button>

        {invoiceInfo?.number && (
          <div style={{ background: '#eaf8f0', border: '1px solid #bbf7d0', borderRadius: '5px', padding: '10px 16px', marginBottom: '20px', color: '#15803d', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span>✓</span>
            <span><strong>Claim ready for invoice #{invoiceInfo.number}</strong> ({invoiceInfo.currency || '€'}{invoiceInfo.amount}). Please log in or register below to initiate collection.</span>
          </div>
        )}

        <div className="extra-class login-register__wrapper" style={{ marginTop: 0, marginBottom: 0 }}>
          {/* Left Column: Authentic Unpaid User Login Form */}
          <div className="region region--left">
            <div className="block-region-left">
              <div className="block block-project block-ek-tfa-user-login">
                {loginError && (
                  <div style={{ background: '#fef2f2', border: '1px solid #fecaca', color: '#991b1b', padding: '8px 12px', borderRadius: '5px', marginBottom: '14px', fontSize: '0.88rem' }}>
                    ⚠️ {loginError}
                  </div>
                )}

                <form
                  className="user-login-form pwd-see"
                  style={{ padding: '15px 25px' }}
                  onSubmit={handleLoginSubmit}
                >
                  <div className="js-form-item form-item js-form-type-textfield form-type-textfield js-form-item-name form-item-name">
                    <label htmlFor="modal-edit-name" className="js-form-required form-required">
                      Username or e-mail address
                    </label>
                    <input
                      autoCorrect="none"
                      autoCapitalize="none"
                      spellCheck="false"
                      autoComplete="username"
                      placeholder="Username or e-mail address"
                      type="text"
                      id="modal-edit-name"
                      name="name"
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                      size={15}
                      maxLength={60}
                      className="form-text required"
                      required
                      aria-required="true"
                    />
                  </div>

                  <div className="js-form-item form-item js-form-type-password form-type-password js-form-item-pass form-item-pass">
                    <label htmlFor="modal-edit-pass" className="js-form-required form-required">
                      Password
                    </label>
                    <input
                      autoComplete="current-password"
                      placeholder="Password"
                      type="password"
                      id="modal-edit-pass"
                      name="pass"
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      size={15}
                      maxLength={128}
                      className="form-text required"
                      required
                      aria-required="true"
                    />
                  </div>

                  <div className="form-actions js-form-wrapper form-wrapper" id="modal-edit-actions">
                    <input
                      type="submit"
                      id="modal-edit-submit"
                      name="op"
                      value={isLoggingIn ? 'Logging in...' : 'Log in'}
                      disabled={isLoggingIn}
                      className="button js-form-submit form-submit"
                      style={{ cursor: isLoggingIn ? 'not-allowed' : 'pointer' }}
                    />
                  </div>

                  <p className="user-password-suffix">
                    <a href="#lost-password" onClick={(e) => { e.preventDefault(); alert('Please contact info@unpaid.be to recover your password.'); }}>
                      Lost password?
                    </a>
                  </p>
                </form>
              </div>
            </div>
          </div>

          {/* Right Column: Authentic Unpaid Registration Block */}
          <div className="region region--right">
            <div className="block-region-right">
              <div className="block block-project-base block-project-base-unpaid-user-registration">
                <div className="simple-user-registration-block">
                  <p>Don't have an account yet? Create one by entering your email address below.</p>

                  {regError && (
                    <div style={{ background: '#fef2f2', border: '1px solid #fecaca', color: '#991b1b', padding: '8px 12px', borderRadius: '5px', margin: '10px 0', fontSize: '0.88rem' }}>
                      ⚠️ {regError}
                    </div>
                  )}

                  <div className="simple-user-registration-form">
                    <form className="form-with-bg" onSubmit={handleRegisterSubmit}>
                      <div className="js-form-item form-item js-form-type-email form-type-email js-form-item-mail form-item-mail">
                        <label htmlFor="modal-edit-mail" className="js-form-required form-required">
                          E-mail
                        </label>
                        <input
                          type="email"
                          id="modal-edit-mail"
                          name="mail"
                          value={regEmail}
                          onChange={(e) => setRegEmail(e.target.value)}
                          placeholder="E-mail"
                          size={60}
                          maxLength={254}
                          className="form-email required"
                          required
                          aria-required="true"
                        />
                      </div>

                      {showRegPassword && (
                        <div className="js-form-item form-item form-type-password" style={{ marginTop: '12px' }}>
                          <label htmlFor="modal-reg-pass" className="js-form-required form-required">
                            Password (min. 8 characters)
                          </label>
                          <input
                            type="password"
                            id="modal-reg-pass"
                            value={regPassword}
                            onChange={(e) => setRegPassword(e.target.value)}
                            placeholder="••••••••"
                            minLength={8}
                            className="form-text required"
                            required
                          />
                        </div>
                      )}

                      <input
                        type="submit"
                        id="modal-edit-submit--2"
                        name="op"
                        value={isRegistering ? 'Registering...' : 'Register'}
                        disabled={isRegistering}
                        className="button js-form-submit form-submit"
                        style={{ marginTop: '16px', cursor: isRegistering ? 'not-allowed' : 'pointer' }}
                      />
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
