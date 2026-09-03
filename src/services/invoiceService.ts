import { ExtractedInvoiceData, ScanInvoiceApiResponse } from '@/types/invoice';

const DEFAULT_API_BASE_URL = 'https://collectent-ai-backend.onrender.com/api';
const DEFAULT_AUTH_TOKEN =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjZhN2MyMjlmYjE2YWQxYjNjYjRjYzFiYyIsImlhdCI6MTc4ODM2NjMxOCwiZXhwIjoxODE5OTAyMzE4fQ.MakmuL1SGykRRfFH5VWVAsL2q8L-czRyByE_sxNKs4g';

export class InvoiceService {
  private getBaseUrl(): string {
    const envUrl = import.meta.env.VITE_API_BASE_URL;
    return envUrl && envUrl.trim() !== '' ? envUrl.replace(/\/+$/, '') : DEFAULT_API_BASE_URL;
  }

  private getAuthToken(): string {
    const userToken = localStorage.getItem('unpaid_auth_token');
    if (userToken && userToken.trim() !== '') return userToken.trim();
    const envToken = import.meta.env.VITE_API_AUTH_TOKEN;
    return envToken && envToken.trim() !== '' ? envToken.trim() : DEFAULT_AUTH_TOKEN;
  }

  /**
   * Sends a PDF or image invoice to Collectent AI for Gemini Multimodal OCR extraction.
   */
  async scanInvoice(file: File | Blob, fileName?: string, customToken?: string): Promise<ExtractedInvoiceData> {
    const baseUrl = this.getBaseUrl();
    const token = customToken || this.getAuthToken();
    const url = `${baseUrl}/invoices/scan`;

    const formData = new FormData();
    const resolvedName = fileName || (file instanceof File ? file.name : 'invoice.pdf');
    formData.append('file', file, resolvedName);

    const controller = new AbortController();
    const timeoutMs = 70000; // 70 seconds to allow for cloud OCR processing
    const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorBody = await response.json().catch(() => null);
        const message =
          errorBody?.message ||
          `Scan request failed with HTTP status ${response.status}: ${response.statusText}`;
        throw new Error(message);
      }

      const result: ScanInvoiceApiResponse = await response.json();
      if (!result.data) {
        throw new Error(result.message || 'No structured data returned from the scan.');
      }

      return result.data;
    } catch (err: unknown) {
      clearTimeout(timeoutId);
      if (err instanceof Error && err.name === 'AbortError') {
        throw new Error('Invoice scan timed out. The server took too long to process.');
      }
      throw err;
    }
  }
}

export const invoiceService = new InvoiceService();
