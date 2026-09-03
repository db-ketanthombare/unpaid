import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { useAuth } from '@/context/AuthContext';
import { authService } from '@/services/authService';
import { ExtractedInvoiceData } from '@/types/invoice';

export function LoginPage() {
  const { login, register, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  React.useEffect(() => {
    window.scrollTo(0, 0);

    if (isAuthenticated) {
      const redirectUrl = searchParams.get('destination') || '/claims';
      navigate(redirectUrl);
      return;
    }

    // If there is a pending claim, auto-fill registration fields with creditor info
    const rawPending = sessionStorage.getItem('unpaid_pending_claim');
    if (rawPending) {
      try {
        const pendingData: ExtractedInvoiceData = JSON.parse(rawPending);
        if (pendingData.creditorDetails?.companyName) {
          setRegCompany(pendingData.creditorDetails.companyName);
        }
        if (pendingData.creditorDetails?.email) {
          setRegEmail(pendingData.creditorDetails.email);
        }
      } catch (e) {
        console.error(e);
      }
    }
  }, [isAuthenticated, navigate, searchParams]);

  // Login form state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState<string | null>(null);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [forgotStatus, setForgotStatus] = useState<string | null>(null);
  const [isSendingForgot, setIsSendingForgot] = useState(false);

  // Registration form state
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirmPassword, setRegConfirmPassword] = useState('');
  const [regName, setRegName] = useState('');
  const [regCompany, setRegCompany] = useState('');
  const [showRegPassword, setShowRegPassword] = useState(false);
  const [regError, setRegError] = useState<string | null>(null);
  const [isRegistering, setIsRegistering] = useState(false);

  const checkPendingClaimAndProceed = async (token?: string) => {
    const rawPending = sessionStorage.getItem('unpaid_pending_claim');
    if (rawPending) {
      try {
        const pendingData: ExtractedInvoiceData = JSON.parse(rawPending);

        const invNum =
          pendingData.invoiceDetails?.invoiceNumber ||
          `INV-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`;
        const amtVal = pendingData.invoiceDetails?.amount
          ? Number(pendingData.invoiceDetails.amount).toFixed(2)
          : '0.00';
        const currVal = pendingData.invoiceDetails?.currency || 'EUR';
        const debtorVal =
          pendingData.debtorDetails?.debtorName ||
          pendingData.debtorDetails?.companyName ||
          'Debtor BV';
        const companyVal = pendingData.creditorDetails?.companyName || 'My Company BV';
        const refVal = pendingData.invoiceDetails?.paymentReference || invNum;
        const dateVal =
          pendingData.invoiceDetails?.invoiceDate || new Date().toISOString().slice(0, 10);

        // Always construct and save the claim record immediately!
        // Also save extracted company to unpaid_user_companies
        const companyVat =
          pendingData.creditorDetails?.vat ||
          pendingData.debtorDetails?.vat ||
          (pendingData.creditorDetails as { taxNumber?: string })?.taxNumber ||
          (pendingData.debtorDetails as { taxNumber?: string })?.taxNumber ||
          '—';

        const creditorAddr = [
          pendingData.creditorDetails?.address,
          pendingData.creditorDetails?.postalCode,
          pendingData.creditorDetails?.city,
          pendingData.creditorDetails?.country,
        ]
          .filter(Boolean)
          .join(', ');

        const debtorAddr = [
          pendingData.debtorDetails?.address,
          pendingData.debtorDetails?.postalCode,
          pendingData.debtorDetails?.city,
          pendingData.debtorDetails?.country,
        ]
          .filter(Boolean)
          .join(', ');

        const companyAddr = creditorAddr || debtorAddr || pendingData.debtorDetails?.address || '—';

        const newClaim = {
          id: String(Date.now()),
          claimNumber: invNum,
          company: companyVal,
          debtorName: debtorVal,
          total: amtVal,
          currency: currVal,
          reference: refVal,
          date: dateVal,
          status: 'Registered',
          vat: companyVat,
          address: companyAddr,
        };

        const existing = JSON.parse(localStorage.getItem('unpaid_user_claims') || '[]');
        localStorage.setItem('unpaid_user_claims', JSON.stringify([newClaim, ...existing]));

        const existingCompanies = JSON.parse(localStorage.getItem('unpaid_user_companies') || '[]');
        const compIdx = existingCompanies.findIndex((c: { name: string }) => c.name.toLowerCase() === companyVal.toLowerCase());
        if (compIdx >= 0) {
          if ((!existingCompanies[compIdx].vat || existingCompanies[compIdx].vat === '—') && companyVat && companyVat !== '—') {
            existingCompanies[compIdx].vat = companyVat;
          }
          if ((!existingCompanies[compIdx].address || existingCompanies[compIdx].address === '—') && companyAddr && companyAddr !== '—') {
            existingCompanies[compIdx].address = companyAddr;
          }
        } else {
          existingCompanies.unshift({
            id: String(Date.now()),
            name: companyVal,
            vat: companyVat,
            address: companyAddr,
          });
        }
        localStorage.setItem('unpaid_user_companies', JSON.stringify(existingCompanies));

        sessionStorage.setItem(
          'unpaid_claim_success',
          JSON.stringify({
            invoiceNumber: invNum,
            amount: amtVal,
            currency: currVal,
            debtorName: debtorVal,
          })
        );
        sessionStorage.removeItem('unpaid_pending_claim');

        // Resiliently sync with Collectent backend
        try {
          const sanitizedPayload: ExtractedInvoiceData = {
            ...pendingData,
            creditorDetails: {
              ...pendingData.creditorDetails,
              companyName: companyVal,
            },
            debtorDetails: {
              ...pendingData.debtorDetails,
              debtorName: debtorVal,
              companyName: debtorVal,
              email:
                pendingData.debtorDetails?.email ||
                `billing@${debtorVal.toLowerCase().replace(/[^a-z0-9]/g, '') || 'company'}.com`,
            },
            invoiceDetails: {
              ...pendingData.invoiceDetails,
              invoiceNumber: invNum,
              amount: pendingData.invoiceDetails?.amount || amtVal,
              currency: currVal,
              invoiceDate: dateVal,
              dueDate:
                pendingData.invoiceDetails?.dueDate ||
                new Date(Date.now() + 30 * 86400000).toISOString().slice(0, 10),
            },
          };
          await authService.confirmInvoice(sanitizedPayload, token);
        } catch (syncErr) {
          console.warn('Backend sync warning (claim saved locally):', syncErr);
        }

        navigate('/claims');
        return;
      } catch (e) {
        console.error('Failed to process pending claim:', e);
      }
    }
    const redirectUrl = searchParams.get('destination') || '/claims';
    navigate(redirectUrl);
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);
    setForgotStatus(null);
    setIsLoggingIn(true);

    try {
      await login({ email: loginEmail, password: loginPassword });
      const currentToken = authService.getStoredToken() || undefined;
      await checkPendingClaimAndProceed(currentToken);
    } catch (err: unknown) {
      setLoginError(err instanceof Error ? err.message : 'Invalid email or password.');
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleForgotPassword = async (e: React.MouseEvent) => {
    e.preventDefault();
    setLoginError(null);
    setForgotStatus(null);

    let targetEmail = loginEmail.trim();
    if (!targetEmail || !targetEmail.includes('@')) {
      const entered = window.prompt(
        'Please enter your email address to receive password reset instructions:',
        targetEmail
      );
      if (!entered) return;
      targetEmail = entered.trim();
    }

    setIsSendingForgot(true);
    try {
      const msg = await authService.forgotPassword(targetEmail);
      setForgotStatus(msg);
    } catch (err: unknown) {
      setLoginError(err instanceof Error ? err.message : 'Failed to request password reset.');
    } finally {
      setIsSendingForgot(false);
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setRegError(null);

    // If password field is not shown yet, reveal details
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

    if (regConfirmPassword && regPassword !== regConfirmPassword) {
      setRegError('Passwords do not match.');
      return;
    }

    setIsRegistering(true);

    try {
      const derivedName = regName.trim() || regEmail.split('@')[0];
      const derivedCompany = regCompany.trim() || derivedName + ' BV';
      await register({
        fullName: derivedName,
        companyName: derivedCompany,
        email: regEmail,
        password: regPassword,
        confirmPassword: regConfirmPassword || regPassword,
        country: 'Belgium',
        termsAndCondition: true,
      });
      const currentToken = authService.getStoredToken() || undefined;
      await checkPendingClaimAndProceed(currentToken);
    } catch (err: unknown) {
      setRegError(err instanceof Error ? err.message : 'Registration failed. Please try again.');
    } finally {
      setIsRegistering(false);
    }
  };

  return (
    <div className="dialog-off-canvas-main-canvas" data-off-canvas-main-canvas>
      <div className="page-wrapper">
        <Header />

        <div className="main-wrapper">
          <main role="main" className="main">
            <div data-drupal-messages-fallback className="hidden"></div>
            <a id="main-content" tabIndex={-1}></a>

            <div id="block-epsenkaas-theme-pagetitle" className="block block-project block-ek-page-title-block"></div>

            <div id="block-epsenkaas-theme-content" className="block block-system block-system-main-block">
              {sessionStorage.getItem('unpaid_pending_claim') && (
                <div
                  style={{
                    background: '#f0fdf4',
                    border: '1.5px solid #86efac',
                    borderRadius: '8px',
                    padding: '16px 20px',
                    marginBottom: '28px',
                    boxShadow: '0 2px 10px rgba(0, 0, 0, 0.04)',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                    <div
                      style={{
                        background: '#1cbc66',
                        color: '#ffffff',
                        width: '28px',
                        height: '28px',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: 'bold',
                        fontSize: '15px',
                        flexShrink: 0,
                        marginTop: '2px',
                      }}
                    >
                      ✓
                    </div>
                    <div>
                      <h3 style={{ margin: '0 0 4px 0', fontSize: '1.05rem', fontWeight: 700, color: '#166534' }}>
                        Your Invoice Details Are Saved!
                      </h3>
                      <p style={{ margin: 0, fontSize: '0.92rem', color: '#15803d', lineHeight: '1.45' }}>
                        To officially submit this claim to the legal bailiff network and track its recovery in your dashboard, please <strong>log in</strong> with your existing account or <strong>create a free account</strong> below. Your invoice will automatically link to your new account.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              <div className="extra-class login-register__wrapper">
                {/* Left Column: Authentic User Login Form */}
                <div className="region region--left">
                  <div className="block-region-left">
                    <div className="block block-project block-ek-tfa-user-login">
                      {loginError && (
                        <div
                          style={{
                            background: '#fef2f2',
                            border: '1px solid #fecaca',
                            color: '#991b1b',
                            padding: '10px 14px',
                            borderRadius: '5px',
                            marginBottom: '16px',
                            fontSize: '0.9rem',
                          }}
                        >
                          ⚠️ {loginError}
                        </div>
                      )}

                      {forgotStatus && (
                        <div
                          style={{
                            background: '#eaf8f0',
                            border: '1px solid #bbf7d0',
                            color: '#15803d',
                            padding: '10px 14px',
                            borderRadius: '5px',
                            marginBottom: '16px',
                            fontSize: '0.9rem',
                          }}
                        >
                          ✓ {forgotStatus}
                        </div>
                      )}

                      <form
                        className="user-login-form pwd-see"
                        style={{ padding: '15px 25px' }}
                        onSubmit={handleLoginSubmit}
                      >
                        <div className="js-form-item form-item js-form-type-textfield form-type-textfield js-form-item-name form-item-name">
                          <label htmlFor="edit-name" className="js-form-required form-required">
                            Username or e-mail address
                          </label>
                          <input
                            autoCorrect="none"
                            autoCapitalize="none"
                            spellCheck="false"
                            autoComplete="username"
                            placeholder="Username or e-mail address"
                            type="text"
                            id="edit-name"
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
                          <label htmlFor="edit-pass" className="js-form-required form-required">
                            Password
                          </label>
                          <input
                            autoComplete="current-password"
                            placeholder="Password"
                            type="password"
                            id="edit-pass"
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

                        <div className="form-actions js-form-wrapper form-wrapper" id="edit-actions">
                          <input
                            type="submit"
                            id="edit-submit"
                            name="op"
                            value={isLoggingIn ? 'Logging in...' : 'Log in'}
                            disabled={isLoggingIn}
                            className="button js-form-submit form-submit"
                            style={{ cursor: isLoggingIn ? 'not-allowed' : 'pointer' }}
                          />
                        </div>

                        <p className="user-password-suffix">
                          <a
                            href="#lost-password"
                            onClick={handleForgotPassword}
                          >
                            {isSendingForgot ? 'Sending reset link...' : 'Lost password?'}
                          </a>
                        </p>
                      </form>
                    </div>
                  </div>
                </div>

                {/* Right Column: Authentic Simple User Registration Form */}
                <div className="region region--right">
                  <div className="block-region-right">
                    <div className="block block-project-base block-project-base-unpaid-user-registration">
                      <div className="simple-user-registration-block">
                        <p>Don't have an account yet? Create one by entering your email address below.</p>

                        {regError && (
                          <div
                            style={{
                              background: '#fef2f2',
                              border: '1px solid #fecaca',
                              color: '#991b1b',
                              padding: '10px 14px',
                              borderRadius: '5px',
                              margin: '14px 0',
                              fontSize: '0.9rem',
                            }}
                          >
                            ⚠️ {regError}
                          </div>
                        )}

                        <div className="simple-user-registration-form">
                          <form
                            className="form-with-bg"
                            onSubmit={handleRegisterSubmit}
                          >
                            <div className="js-form-item form-item js-form-type-email form-type-email js-form-item-mail form-item-mail">
                              <label htmlFor="edit-mail" className="js-form-required form-required">
                                E-mail
                              </label>
                              <input
                                type="email"
                                id="edit-mail"
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
                              <>
                                <div className="js-form-item form-item form-type-textfield" style={{ marginTop: '14px' }}>
                                  <label htmlFor="edit-reg-name" className="js-form-required form-required">
                                    Full Name
                                  </label>
                                  <input
                                    type="text"
                                    id="edit-reg-name"
                                    value={regName}
                                    onChange={(e) => setRegName(e.target.value)}
                                    placeholder="e.g. John Doe"
                                    className="form-text required"
                                    required
                                  />
                                </div>

                                <div className="js-form-item form-item form-type-textfield" style={{ marginTop: '14px' }}>
                                  <label htmlFor="edit-reg-company" className="js-form-required form-required">
                                    Company Name
                                  </label>
                                  <input
                                    type="text"
                                    id="edit-reg-company"
                                    value={regCompany}
                                    onChange={(e) => setRegCompany(e.target.value)}
                                    placeholder="e.g. Acme BV"
                                    className="form-text required"
                                    required
                                  />
                                </div>

                                <div className="js-form-item form-item form-type-password" style={{ marginTop: '14px' }}>
                                  <label htmlFor="edit-reg-pass" className="js-form-required form-required">
                                    Password (min. 8 characters)
                                  </label>
                                  <input
                                    type="password"
                                    id="edit-reg-pass"
                                    value={regPassword}
                                    onChange={(e) => setRegPassword(e.target.value)}
                                    placeholder="••••••••"
                                    minLength={8}
                                    className="form-text required"
                                    required
                                  />
                                </div>

                                <div className="js-form-item form-item form-type-password" style={{ marginTop: '14px' }}>
                                  <label htmlFor="edit-reg-confirm" className="js-form-required form-required">
                                    Confirm Password
                                  </label>
                                  <input
                                    type="password"
                                    id="edit-reg-confirm"
                                    value={regConfirmPassword}
                                    onChange={(e) => setRegConfirmPassword(e.target.value)}
                                    placeholder="••••••••"
                                    minLength={8}
                                    className="form-text required"
                                    required
                                  />
                                </div>
                              </>
                            )}

                            <input
                              type="submit"
                              id="edit-submit--2"
                              name="op"
                              value={isRegistering ? 'Registering...' : 'Register'}
                              disabled={isRegistering}
                              className="button js-form-submit form-submit"
                              style={{ marginTop: '20px', cursor: isRegistering ? 'not-allowed' : 'pointer' }}
                            />
                          </form>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </main>
        </div>

        <Footer />
      </div>
    </div>
  );
}
