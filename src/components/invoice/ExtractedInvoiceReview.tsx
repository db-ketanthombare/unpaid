import { useState } from 'react';
import { ExtractedInvoiceData, DebtorDetails, InvoiceDetails, CreditorDetails } from '@/types/invoice';
import './ExtractedInvoiceReview.css';

interface ExtractedInvoiceReviewProps {
  data: ExtractedInvoiceData;
  fileName?: string;
  onReset: () => void;
  onConfirm?: (updatedData: ExtractedInvoiceData) => void;
  isRedirecting?: boolean;
}

export function ExtractedInvoiceReview({
  data,
  fileName,
  onReset,
  onConfirm,
  isRedirecting = false,
}: ExtractedInvoiceReviewProps) {
  // Maintain local state so user can edit any extracted value
  const [debtor, setDebtor] = useState<DebtorDetails>({
    debtorName: data.debtorDetails?.debtorName || '',
    companyName: data.debtorDetails?.companyName || '',
    email: data.debtorDetails?.email || '',
    phone: data.debtorDetails?.phone || '',
    address: data.debtorDetails?.address || '',
    city: data.debtorDetails?.city || '',
    postalCode: data.debtorDetails?.postalCode || '',
    country: data.debtorDetails?.country || 'Belgium',
    vat: data.debtorDetails?.vat || '',
    type: data.debtorDetails?.type || 'B2B',
  });

  const [invoice, setInvoice] = useState<InvoiceDetails>({
    invoiceNumber: data.invoiceDetails?.invoiceNumber || '',
    invoiceDate: data.invoiceDetails?.invoiceDate || '',
    dueDate: data.invoiceDetails?.dueDate || '',
    amount: data.invoiceDetails?.amount !== undefined ? data.invoiceDetails?.amount : '',
    currency: data.invoiceDetails?.currency || '€',
    iban: data.invoiceDetails?.iban || '',
    paymentReference: data.invoiceDetails?.paymentReference || '',
    bic: data.invoiceDetails?.bic || '',
  });

  const [creditor, setCreditor] = useState<CreditorDetails>({
    companyName: data.creditorDetails?.companyName || '',
    vat: data.creditorDetails?.vat || data.debtorDetails?.vat || '',
    address: data.creditorDetails?.address || data.debtorDetails?.address || '',
    city: data.creditorDetails?.city || data.debtorDetails?.city || '',
    postalCode: data.creditorDetails?.postalCode || data.debtorDetails?.postalCode || '',
    country: data.creditorDetails?.country || data.debtorDetails?.country || 'Belgium',
  });

  const [isSaved, setIsSaved] = useState(false);

  const handleDebtorChange = (field: keyof DebtorDetails, val: string) => {
    setDebtor((prev) => ({ ...prev, [field]: val }));
  };

  const handleInvoiceChange = (field: keyof InvoiceDetails, val: string | number) => {
    setInvoice((prev) => ({ ...prev, [field]: val }));
  };

  const handleCreditorChange = (val: string) => {
    setCreditor((prev) => ({ ...prev, companyName: val }));
  };

  const handleConfirm = () => {
    setIsSaved(true);
    if (onConfirm) {
      onConfirm({
        ...data,
        creditorDetails: {
          ...creditor,
          vat: creditor.vat || debtor.vat || '',
          address: creditor.address || debtor.address || '',
          city: creditor.city || debtor.city || '',
          postalCode: creditor.postalCode || debtor.postalCode || '',
          country: creditor.country || debtor.country || '',
        },
        debtorDetails: debtor,
        invoiceDetails: invoice,
      });
    }
  };

  // Warning triangle SVG icon
  const WarningIcon = () => (
    <div className="invoice-review__warning-icon" title="AI suggests reviewing this field">
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="currentColor"
        stroke="none"
      >
        <path d="M12 2L1 21h22L12 2zm0 3.84L20.15 19H3.85L12 5.84zM11 10h2v5h-2v-5zm0 6h2v2h-2v-2z" />
      </svg>
    </div>
  );

  return (
    <div className="invoice-review">
      {/* Top Banner */}
      <div className="invoice-review__banner">
        <div className="invoice-review__banner-left">
          <span className="invoice-review__banner-title">
            Invoice details successfully recognized by Collectent OCR
          </span>
        </div>
        {fileName && (
          <div className="invoice-review__file-tag">
            📄 <strong>{fileName}</strong>
          </div>
        )}
      </div>

      {/* Main Two-Column Layout */}
      <div className="invoice-review__grid">
        {/* Left Column: Debtor Information */}
        <div className="invoice-review__card">
          <h2 className="invoice-review__card-title">Debtor Information</h2>

          <div className="invoice-review__fields">
            {/* Client Name */}
            <div className="invoice-review__field">
              <div className="invoice-review__field-header">
                <label className="invoice-review__label">
                  Client Name <span className="invoice-review__required">*</span>
                </label>
              </div>
              <div className="invoice-review__input-wrapper">
                <input
                  type="text"
                  className="invoice-review__input"
                  value={debtor.debtorName || ''}
                  onChange={(e) => handleDebtorChange('debtorName', e.target.value)}
                  placeholder="e.g. Emma Jacobs"
                />
              </div>
            </div>

            {/* Email */}
            <div className="invoice-review__field">
              <div className="invoice-review__field-header">
                <label className="invoice-review__label">
                  Email <span className="invoice-review__required">*</span>
                </label>
              </div>
              <div className="invoice-review__input-wrapper">
                <input
                  type="email"
                  className="invoice-review__input"
                  value={debtor.email || ''}
                  onChange={(e) => handleDebtorChange('email', e.target.value)}
                  placeholder="e.g. customer@example.com"
                />
              </div>
            </div>

            {/* Phone (Warning Highlight) */}
            <div className="invoice-review__field">
              <div className="invoice-review__field-header">
                <label className="invoice-review__label">Phone</label>
              </div>
              <div className="invoice-review__input-wrapper has-warning">
                <input
                  type="text"
                  className="invoice-review__input invoice-review__input--warning"
                  value={debtor.phone || ''}
                  onChange={(e) => handleDebtorChange('phone', e.target.value)}
                  placeholder="e.g. +32(0)123 172714"
                />
                <WarningIcon />
              </div>
            </div>

            {/* Address */}
            <div className="invoice-review__field">
              <div className="invoice-review__field-header">
                <label className="invoice-review__label">
                  Address <span className="invoice-review__required">*</span>
                </label>
              </div>
              <div className="invoice-review__input-wrapper">
                <input
                  type="text"
                  className="invoice-review__input"
                  value={debtor.address || ''}
                  onChange={(e) => handleDebtorChange('address', e.target.value)}
                  placeholder="Street and number"
                />
              </div>
            </div>

            {/* City */}
            <div className="invoice-review__field">
              <div className="invoice-review__field-header">
                <label className="invoice-review__label">
                  City <span className="invoice-review__required">*</span>
                </label>
              </div>
              <div className="invoice-review__input-wrapper">
                <input
                  type="text"
                  className="invoice-review__input"
                  value={debtor.city || ''}
                  onChange={(e) => handleDebtorChange('city', e.target.value)}
                  placeholder="City"
                />
              </div>
            </div>

            {/* Postal Code */}
            <div className="invoice-review__field">
              <div className="invoice-review__field-header">
                <label className="invoice-review__label">
                  Postal Code <span className="invoice-review__required">*</span>
                </label>
              </div>
              <div className="invoice-review__input-wrapper">
                <input
                  type="text"
                  className="invoice-review__input"
                  value={debtor.postalCode || ''}
                  onChange={(e) => handleDebtorChange('postalCode', e.target.value)}
                  placeholder="Zip / Postal Code"
                />
              </div>
            </div>

            {/* Country */}
            <div className="invoice-review__field">
              <div className="invoice-review__field-header">
                <label className="invoice-review__label">
                  Country <span className="invoice-review__required">*</span>
                </label>
              </div>
              <div className="invoice-review__input-wrapper">
                <select
                  className="invoice-review__select"
                  value={debtor.country || 'Belgium'}
                  onChange={(e) => handleDebtorChange('country', e.target.value)}
                >
                  <option value="Belgium">Belgium</option>
                  <option value="Netherlands">Netherlands</option>
                  <option value="France">France</option>
                  <option value="Germany">Germany</option>
                  <option value="Spain">Spain</option>
                  <option value="España">España</option>
                  <option value="Luxembourg">Luxembourg</option>
                  <option value="United Kingdom">United Kingdom</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>

            {/* VAT */}
            <div className="invoice-review__field">
              <div className="invoice-review__field-header">
                <label className="invoice-review__label">VAT</label>
              </div>
              <div className="invoice-review__input-wrapper has-warning">
                <input
                  type="text"
                  className="invoice-review__input invoice-review__input--warning"
                  value={debtor.vat || ''}
                  onChange={(e) => handleDebtorChange('vat', e.target.value)}
                  placeholder="e.g. BE0751304363"
                />
                <WarningIcon />
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Invoice Details */}
        <div className="invoice-review__card">
          <h2 className="invoice-review__card-title">Invoice Details</h2>

          <div className="invoice-review__fields">
            {/* Creditor / Issuing Company */}
            <div className="invoice-review__field">
              <div className="invoice-review__field-header">
                <label className="invoice-review__label">Creditor / Issuing Company</label>
              </div>
              <div className="invoice-review__input-wrapper">
                <input
                  type="text"
                  className="invoice-review__input"
                  value={creditor.companyName || ''}
                  onChange={(e) => handleCreditorChange(e.target.value)}
                  placeholder="Creditor business name"
                />
              </div>
            </div>

            {/* Invoice Number */}
            <div className="invoice-review__field">
              <div className="invoice-review__field-header">
                <label className="invoice-review__label">
                  Invoice Number <span className="invoice-review__required">*</span>
                </label>
              </div>
              <div className="invoice-review__input-wrapper">
                <input
                  type="text"
                  className="invoice-review__input"
                  value={invoice.invoiceNumber || ''}
                  onChange={(e) => handleInvoiceChange('invoiceNumber', e.target.value)}
                  placeholder="e.g. INV-2024-0097"
                />
              </div>
            </div>

            {/* Invoice Date */}
            <div className="invoice-review__field">
              <div className="invoice-review__field-header">
                <label className="invoice-review__label">
                  Invoice Date <span className="invoice-review__required">*</span>
                </label>
              </div>
              <div className="invoice-review__input-wrapper">
                <input
                  type="text"
                  className="invoice-review__input"
                  value={invoice.invoiceDate || ''}
                  onChange={(e) => handleInvoiceChange('invoiceDate', e.target.value)}
                  placeholder="YYYY-MM-DD"
                />
              </div>
            </div>

            {/* Due Date */}
            <div className="invoice-review__field">
              <div className="invoice-review__field-header">
                <label className="invoice-review__label">
                  Due Date <span className="invoice-review__required">*</span>
                </label>
              </div>
              <div className="invoice-review__input-wrapper">
                <input
                  type="text"
                  className="invoice-review__input"
                  value={invoice.dueDate || ''}
                  onChange={(e) => handleInvoiceChange('dueDate', e.target.value)}
                  placeholder="YYYY-MM-DD"
                />
              </div>
            </div>

            {/* Amount */}
            <div className="invoice-review__field">
              <div className="invoice-review__field-header">
                <label className="invoice-review__label">
                  Amount <span className="invoice-review__required">*</span>
                </label>
              </div>
              <div className="invoice-review__input-wrapper">
                <input
                  type="text"
                  className="invoice-review__input"
                  value={invoice.amount ?? ''}
                  onChange={(e) => handleInvoiceChange('amount', e.target.value)}
                  placeholder="0.00"
                />
              </div>
            </div>

            {/* Currency */}
            <div className="invoice-review__field">
              <div className="invoice-review__field-header">
                <label className="invoice-review__label">
                  Currency <span className="invoice-review__required">*</span>
                </label>
              </div>
              <div className="invoice-review__input-wrapper">
                <input
                  type="text"
                  className="invoice-review__input"
                  value={invoice.currency || '€'}
                  onChange={(e) => handleInvoiceChange('currency', e.target.value)}
                  placeholder="€ or EUR"
                />
              </div>
            </div>

            {/* IBAN */}
            <div className="invoice-review__field">
              <div className="invoice-review__field-header">
                <label className="invoice-review__label">IBAN</label>
              </div>
              <div className="invoice-review__input-wrapper">
                <input
                  type="text"
                  className="invoice-review__input"
                  value={invoice.iban || ''}
                  onChange={(e) => handleInvoiceChange('iban', e.target.value)}
                  placeholder="e.g. BE71096123456769"
                />
              </div>
            </div>

            {/* Payment Reference */}
            <div className="invoice-review__field">
              <div className="invoice-review__field-header">
                <label className="invoice-review__label">Payment Reference</label>
              </div>
              <div className="invoice-review__input-wrapper">
                <input
                  type="text"
                  className="invoice-review__input"
                  value={invoice.paymentReference || ''}
                  onChange={(e) => handleInvoiceChange('paymentReference', e.target.value)}
                  placeholder="e.g. BE0567162819"
                />
              </div>
            </div>

            {/* BIC */}
            <div className="invoice-review__field">
              <div className="invoice-review__field-header">
                <label className="invoice-review__label">BIC</label>
              </div>
              <div className="invoice-review__input-wrapper has-warning">
                <input
                  type="text"
                  className="invoice-review__input invoice-review__input--warning"
                  value={invoice.bic || ''}
                  onChange={(e) => handleInvoiceChange('bic', e.target.value)}
                  placeholder="e.g. GKCCEBEB"
                />
                <WarningIcon />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="invoice-review__actions">
        <button
          type="button"
          className="invoice-review__btn invoice-review__btn--secondary"
          onClick={onReset}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="17 8 12 3 7 8" />
            <line x1="12" y1="3" x2="12" y2="15" />
          </svg>
          Upload Different Invoice
        </button>

        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
          {isSaved && !isRedirecting && (
            <span style={{ color: '#16a34a', fontWeight: 600, fontSize: '0.9rem' }}>
              ✓ Details confirmed
            </span>
          )}
          <button
            type="button"
            className="invoice-review__btn invoice-review__btn--primary"
            onClick={handleConfirm}
            disabled={isRedirecting}
            style={isRedirecting ? { opacity: 0.85, cursor: 'wait' } : undefined}
          >
            {isRedirecting ? (
              <>
                <svg
                  className="invoice-review__spinner"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  style={{ animation: 'spin 1s linear infinite' }}
                >
                  <circle cx="12" cy="12" r="10" strokeOpacity="0.25" />
                  <path d="M12 2a10 10 0 0 1 10 10" />
                </svg>
                <span>Redirecting you, please wait...</span>
              </>
            ) : (
              <>
                Confirm & Proceed to Claim
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="9 18 15 12 9 6" />
                </svg>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
