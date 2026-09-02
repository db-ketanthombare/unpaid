import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { useAuth } from '@/context/AuthContext';
import '@/styles/ClaimsPage.css';

export interface CompanyItem {
  id: string;
  name: string;
  vat: string;
  address: string;
}

export function CompaniesPage() {
  const { user } = useAuth();
  const [companies, setCompanies] = useState<CompanyItem[]>([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newCompanyName, setNewCompanyName] = useState('');
  const [newVat, setNewVat] = useState('');
  const [newAddress, setNewAddress] = useState('');

  useEffect(() => {
    try {
      const stored = localStorage.getItem('unpaid_user_companies');
      let cleaned: CompanyItem[] = stored ? JSON.parse(stored) : [];

      // Clean out any stale hardcoded placeholder values
      cleaned = cleaned.map((comp) => ({
        ...comp,
        vat: comp.vat === 'BE 0746.882.112' ? '—' : (comp.vat || '—'),
        address: comp.address === 'Havenlaan 86C, 1000 Brussels, Belgium' ? '—' : (comp.address || '—'),
      }));

      // Check claims to add or backfill real VAT and address
      const rawClaims = localStorage.getItem('unpaid_user_claims');
      if (rawClaims) {
        const claims = JSON.parse(rawClaims);
        if (Array.isArray(claims)) {
          claims.forEach((cl: { company?: string; debtorName?: string; vat?: string; address?: string }) => {
            if (cl.company) {
              const existingIndex = cleaned.findIndex(
                (c) => c.name.toLowerCase() === cl.company?.toLowerCase()
              );
              if (existingIndex >= 0) {
                if ((!cleaned[existingIndex].vat || cleaned[existingIndex].vat === '—') && cl.vat && cl.vat !== '—') {
                  cleaned[existingIndex].vat = cl.vat;
                }
                if ((!cleaned[existingIndex].address || cleaned[existingIndex].address === '—') && cl.address && cl.address !== '—') {
                  cleaned[existingIndex].address = cl.address;
                }
              } else {
                cleaned.push({
                  id: String(Date.now() + Math.random()),
                  name: cl.company,
                  vat: cl.vat || '—',
                  address: cl.address || '—',
                });
              }
            }
          });
        }
      }

      // Check pending claim if present
      const rawPending = sessionStorage.getItem('unpaid_pending_claim');
      if (rawPending) {
        try {
          const p = JSON.parse(rawPending);
          const compName = p.creditorDetails?.companyName;
          const compVat = p.creditorDetails?.vat || p.debtorDetails?.vat;
          const compAddr =
            [
              p.creditorDetails?.address,
              p.creditorDetails?.postalCode,
              p.creditorDetails?.city,
              p.creditorDetails?.country,
            ].filter(Boolean).join(', ') ||
            [
              p.debtorDetails?.address,
              p.debtorDetails?.postalCode,
              p.debtorDetails?.city,
              p.debtorDetails?.country,
            ].filter(Boolean).join(', ');

          if (compName) {
            const existingComp = cleaned.find(
              (c) => c.name.toLowerCase() === compName.toLowerCase()
            );
            if (existingComp) {
              if ((!existingComp.vat || existingComp.vat === '—') && compVat) {
                existingComp.vat = compVat;
              }
              if ((!existingComp.address || existingComp.address === '—') && compAddr) {
                existingComp.address = compAddr;
              }
            } else {
              cleaned.unshift({
                id: String(Date.now()),
                name: compName,
                vat: compVat || '—',
                address: compAddr || '—',
              });
            }
          }
        } catch (parseErr) {
          console.error(parseErr);
        }
      }

      setCompanies(cleaned);
      localStorage.setItem('unpaid_user_companies', JSON.stringify(cleaned));
    } catch (e) {
      console.error(e);
    }

    // Hide Calendly badge on companies page
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

  const handleAddCompany = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCompanyName.trim()) return;

    const company: CompanyItem = {
      id: String(Date.now()),
      name: newCompanyName.trim(),
      vat: newVat.trim() || '—',
      address: newAddress.trim() || '—',
    };

    const updated = [company, ...companies];
    setCompanies(updated);
    localStorage.setItem('unpaid_user_companies', JSON.stringify(updated));

    setNewCompanyName('');
    setNewVat('');
    setNewAddress('');
    setIsAddModalOpen(false);
  };

  return (
    <div className="dialog-off-canvas-main-canvas" data-off-canvas-main-canvas>
      <div className="page-wrapper">
        <Header />

        <div className="main-wrapper">
          <main role="main" className="main">
            <div className="page-with-sidebar">
              {/* Left Column: Companies Content */}
              <div className="page__content">
                <h1 className="claims-page__title">Your companies</h1>

                <div>
                  <button
                    type="button"
                    className="claims-page__btn-start"
                    onClick={() => setIsAddModalOpen(true)}
                  >
                    Add new company
                  </button>
                </div>

                <div className="claims-table-wrapper">
                  <table className="claims-table">
                    <thead>
                      <tr>
                        <th style={{ width: '30%' }}>Company name</th>
                        <th style={{ width: '25%' }}>VAT number</th>
                        <th style={{ width: '33%' }}>Address</th>
                        <th style={{ width: '12%' }}>Links</th>
                      </tr>
                    </thead>
                    <tbody>
                      {companies.length === 0 ? (
                        <tr>
                          <td colSpan={4} className="claims-table__empty">
                            No companies in your account
                          </td>
                        </tr>
                      ) : (
                        companies.map((comp) => (
                          <tr key={comp.id}>
                            <td>
                              <strong>{comp.name}</strong>
                            </td>
                            <td>{comp.vat}</td>
                            <td>{comp.address}</td>
                            <td>
                              <Link
                                to="/claims"
                                style={{
                                  color: '#257aa7',
                                  textDecoration: 'none',
                                  fontWeight: 600,
                                  fontSize: '0.875rem',
                                }}
                                title="View claims for this company"
                              >
                                Claims
                              </Link>
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
                    <Link to="/claims" className="claims-sidebar__link">
                      Your claims
                    </Link>
                    <Link
                      to="/companies"
                      className="claims-sidebar__link claims-sidebar__link--active"
                    >
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

        {/* Modal to Add New Company */}
        {isAddModalOpen && (
          <div
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(0, 49, 71, 0.65)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 2000,
              padding: '20px',
            }}
            onClick={() => setIsAddModalOpen(false)}
          >
            <div
              style={{
                backgroundColor: '#ffffff',
                borderRadius: '8px',
                padding: '30px',
                width: '100%',
                maxWidth: '480px',
                boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.2)',
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '20px',
                }}
              >
                <h3
                  style={{
                    margin: 0,
                    fontSize: '1.4rem',
                    color: '#003147',
                    fontWeight: 700,
                    fontFamily: 'var(--font-family--headers)',
                  }}
                >
                  Add new company
                </h3>
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  style={{
                    background: 'none',
                    border: 'none',
                    fontSize: '1.2rem',
                    cursor: 'pointer',
                    color: '#64748b',
                  }}
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleAddCompany}>
                <div style={{ marginBottom: '16px' }}>
                  <label
                    style={{
                      display: 'block',
                      fontSize: '0.875rem',
                      fontWeight: 600,
                      color: '#003147',
                      marginBottom: '6px',
                    }}
                  >
                    Company name *
                  </label>
                  <input
                    type="text"
                    required
                    value={newCompanyName}
                    onChange={(e) => setNewCompanyName(e.target.value)}
                    placeholder="e.g. Acme Corp BV"
                    style={{
                      width: '100%',
                      padding: '10px 14px',
                      borderRadius: '5px',
                      border: '1px solid #c2dbe9',
                      fontSize: '0.9375rem',
                      boxSizing: 'border-box',
                    }}
                  />
                </div>

                <div style={{ marginBottom: '16px' }}>
                  <label
                    style={{
                      display: 'block',
                      fontSize: '0.875rem',
                      fontWeight: 600,
                      color: '#003147',
                      marginBottom: '6px',
                    }}
                  >
                    VAT number
                  </label>
                  <input
                    type="text"
                    value={newVat}
                    onChange={(e) => setNewVat(e.target.value)}
                    placeholder="e.g. BE 0123.456.789"
                    style={{
                      width: '100%',
                      padding: '10px 14px',
                      borderRadius: '5px',
                      border: '1px solid #c2dbe9',
                      fontSize: '0.9375rem',
                      boxSizing: 'border-box',
                    }}
                  />
                </div>

                <div style={{ marginBottom: '24px' }}>
                  <label
                    style={{
                      display: 'block',
                      fontSize: '0.875rem',
                      fontWeight: 600,
                      color: '#003147',
                      marginBottom: '6px',
                    }}
                  >
                    Address
                  </label>
                  <input
                    type="text"
                    value={newAddress}
                    onChange={(e) => setNewAddress(e.target.value)}
                    placeholder="e.g. Havenlaan 86C, 1000 Brussels"
                    style={{
                      width: '100%',
                      padding: '10px 14px',
                      borderRadius: '5px',
                      border: '1px solid #c2dbe9',
                      fontSize: '0.9375rem',
                      boxSizing: 'border-box',
                    }}
                  />
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                  <button
                    type="button"
                    onClick={() => setIsAddModalOpen(false)}
                    style={{
                      padding: '10px 18px',
                      borderRadius: '5px',
                      border: '1px solid #c2dbe9',
                      background: '#ffffff',
                      color: '#003147',
                      cursor: 'pointer',
                      fontWeight: 600,
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    style={{
                      padding: '10px 20px',
                      borderRadius: '5px',
                      border: 'none',
                      background: 'var(--secondary-color, #1cbc66)',
                      color: '#003147',
                      cursor: 'pointer',
                      fontWeight: 700,
                    }}
                  >
                    Save company
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

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
