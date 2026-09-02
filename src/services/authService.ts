import { LoginCredentials, RegisterCredentials, AuthApiResponse, User } from '@/types/auth';
import { ExtractedInvoiceData } from '@/types/invoice';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://collectent-ai-backend.onrender.com/api';
const TOKEN_KEY = 'unpaid_auth_token';
const USER_KEY = 'unpaid_user';

export const authService = {
  getStoredToken(): string | null {
    try {
      return localStorage.getItem(TOKEN_KEY);
    } catch {
      return null;
    }
  },

  getStoredUser(): User | null {
    try {
      const data = localStorage.getItem(USER_KEY);
      return data ? JSON.parse(data) : null;
    } catch {
      return null;
    }
  },

  setAuth(token: string, user: User): void {
    try {
      localStorage.setItem(TOKEN_KEY, token);
      localStorage.setItem(USER_KEY, JSON.stringify(user));
    } catch (e) {
      console.error('Failed to persist auth session:', e);
    }
  },

  clearAuth(): void {
    try {
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(USER_KEY);
    } catch (e) {
      console.error('Failed to clear auth session:', e);
    }
  },

  async login(credentials: LoginCredentials): Promise<{ user: User; token: string }> {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    });

    const data: AuthApiResponse = await response.json();

    if (!response.ok || data.status !== 'success' || !data.data) {
      throw new Error(data.message || 'Login failed. Please check your credentials.');
    }

    this.setAuth(data.data.token, data.data.user);
    return data.data;
  },

  async register(credentials: RegisterCredentials): Promise<{ user: User; token: string }> {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    });

    const data: AuthApiResponse = await response.json();

    if (!response.ok || data.status !== 'success' || !data.data) {
      throw new Error(data.message || 'Account registration failed. Please try again.');
    }

    this.setAuth(data.data.token, data.data.user);
    return data.data;
  },

  async confirmInvoice(invoiceData: ExtractedInvoiceData, token?: string): Promise<unknown> {
    const authToken = token || this.getStoredToken() || import.meta.env.VITE_API_AUTH_TOKEN;

    const response = await fetch(`${API_BASE_URL}/invoices/confirm`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}),
      },
      body: JSON.stringify({
        creditorDetails: invoiceData.creditorDetails || {},
        debtorDetails: invoiceData.debtorDetails,
        invoiceDetails: invoiceData.invoiceDetails,
        caseEmails: invoiceData.caseEmails || [],
        fileUrl: invoiceData.fileUrl || 'manual_entry',
      }),
    });

    const result = await response.json();
    if (!response.ok || result.status !== 'success') {
      throw new Error(result.message || 'Failed to confirm and create invoice claim.');
    }

    return result.data;
  },

  async forgotPassword(email: string): Promise<string> {
    const response = await fetch(`${API_BASE_URL}/auth/forgot-password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email }),
    });

    const result = await response.json();
    if (!response.ok || result.status !== 'success') {
      throw new Error(result.message || 'Failed to send password reset request.');
    }

    return result.message || 'Password reset instructions have been sent to your email address.';
  },
};

