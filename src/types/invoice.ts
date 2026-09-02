export interface CreditorDetails {
  companyName?: string | null;
  vat?: string | null;
  address?: string | null;
  city?: string | null;
  postalCode?: string | null;
  country?: string | null;
  phone?: string | null;
  email?: string | null;
}

export interface DebtorDetails {
  debtorName?: string | null;
  companyName?: string | null;
  email?: string | null;
  phone?: string | null;
  address?: string | null;
  city?: string | null;
  postalCode?: string | null;
  country?: string | null;
  vat?: string | null;
  type?: 'B2B' | 'B2C' | string | null;
}

export interface InvoiceDetails {
  invoiceNumber?: string | null;
  invoiceDate?: string | null;
  dueDate?: string | null;
  amount?: number | string | null;
  currency?: string | null;
  iban?: string | null;
  paymentReference?: string | null;
  bic?: string | null;
}

export interface CaseEmail {
  caseEmailTemplateId?: string;
  templateKey?: string;
  name?: string;
  subject?: string;
  scheduledAt?: string;
  htmlTemplate?: string;
  textTemplate?: string;
  order?: number;
  sendAfterDays?: number;
  emailToSend?: string;
}

export interface ExtractedInvoiceData {
  creditorDetails?: CreditorDetails;
  debtorDetails?: DebtorDetails;
  invoiceDetails?: InvoiceDetails;
  fileUrl?: string;
  caseEmails?: CaseEmail[];
  isDuplicate?: boolean;
  existingInvoice?: unknown;
}

export interface ScanInvoiceApiResponse {
  status: 'success' | 'fail' | 'error';
  message?: string;
  data?: ExtractedInvoiceData;
}
