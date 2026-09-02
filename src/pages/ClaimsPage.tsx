import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { useAuth } from '@/context/AuthContext';
import '@/styles/ClaimsPage.css';

interface ClaimItem {
  id: string;
  claimNumber: string;
  company: string;
  debtorName: string;
  total: string | number;
  reference: string;
  date: string;
  status: string;
}

const SortIcon = () => (
  <svg
    width="8"
    height="12"
    viewBox="0 0 8 12"
    fill="none"
    style={{ display: 'inline-block', verticalAlign: 'middle', marginLeft: '6px' }}
  >
    <path d="M4 1L1 4.5H7L4 1Z" fill="#589cb9" />
    <path d="M4 11L7 7.5H1L4 11Z" fill="#589cb9" />
  </svg>
);

export function ClaimsPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [claims, setClaims] = useState<ClaimItem[]>([]);
  const [newClaimBanner, setNewClaimBanner] = useState<{
    invoiceNumber: string;
    amount: string | number;
    currency: string;
    debtorName: string;
  } | null>(null);

  useEffect(() => {
    // Retrieve any claims from session / localStorage
    try {
      const stored = localStorage.getItem('unpaid_user_claims');
      if (stored) {
        setClaims(JSON.parse(stored));
      }
    } catch (e) {
      console.error(e);
    }

    // Check if an invoice was newly confirmed and submitted
    try {
      const rawSuccess = sessionStorage.getItem('unpaid_claim_success');
      if (rawSuccess) {
        setNewClaimBanner(JSON.parse(rawSuccess));
        sessionStorage.removeItem('unpaid_claim_success');
      }
    } catch (e) {
      console.error(e);
    }

    // Hide Calendly badge on claims page
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
  }, []);

  return (
    <div className="dialog-off-canvas-main-canvas" data-off-canvas-main-canvas>
      <div className="page-wrapper">
        <Header />

        <div className="main-wrapper">
          <main role="main" className="main">
            <div className="page-with-sidebar">
              {/* Left Column: Claims Content */}
              <div className="page__content">
                <h1 className="claims-page__title">Your claims</h1>

                {newClaimBanner && (
                  <div className="claims-success-banner">
                    <div className="claims-success-banner__content">
                      <span className="claims-success-banner__icon">✓</span>
                      <span>
                        <strong>Claim #{newClaimBanner.invoiceNumber} registered!</strong> Successfully initiated for {newClaimBanner.currency || '€'} {newClaimBanner.amount} against <strong>{newClaimBanner.debtorName}</strong>.
                      </span>
                    </div>
                    <button
                      type="button"
                      className="claims-success-banner__close"
                      onClick={() => setNewClaimBanner(null)}
                      title="Dismiss"
                    >
                      ✕
                    </button>
                  </div>
                )}

                <div>
                  <button
                    type="button"
                    className="claims-page__btn-start"
                    onClick={() => navigate('/')}
                  >
                    Start new claim
                  </button>
                </div>

                <div className="claims-table-wrapper">
                  <table className="claims-table">
                    <thead>
                      <tr>
                        <th>
                          Claim <SortIcon />
                        </th>
                        <th>
                          Company <SortIcon />
                        </th>
                        <th>
                          Debtor name <SortIcon />
                        </th>
                        <th>
                          Total <SortIcon />
                        </th>
                        <th>
                          Reference <SortIcon />
                        </th>
                        <th>
                          Date <SortIcon />
                        </th>
                        <th>
                          Status <SortIcon />
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {claims.length === 0 ? (
                        <tr>
                          <td colSpan={7} className="claims-table__empty">
                            No claims in your account
                          </td>
                        </tr>
                      ) : (
                        claims.map((claim) => (
                          <tr key={claim.id}>
                            <td>
                              <strong>#{claim.claimNumber}</strong>
                            </td>
                            <td>{claim.company}</td>
                            <td>{claim.debtorName}</td>
                            <td>
                              <strong>€ {claim.total}</strong>
                            </td>
                            <td>{claim.reference}</td>
                            <td>{claim.date}</td>
                            <td>
                              <span
                                className={`claim-status-badge ${
                                  claim.status === 'Registered'
                                    ? 'claim-status--registered'
                                    : 'claim-status--pending'
                                }`}
                              >
                                {claim.status || 'Registered'}
                              </span>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Right Column: User Sidebar */}
              <aside className="page__sidebar">
                <div className="claims-sidebar-card">
                  <div className="claims-sidebar__user-email">
                    {user?.email || 'rmmishra@developerbazaar.com'}
                  </div>

                  <nav className="claims-sidebar__nav">
                    <Link
                      to="/claims"
                      className="claims-sidebar__link claims-sidebar__link--active"
                    >
                      Your claims
                    </Link>
                    <Link to="/companies" className="claims-sidebar__link">
                      Your companies
                    </Link>
                    <Link to="/account" className="claims-sidebar__link">
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
