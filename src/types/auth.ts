export interface User {
  id?: string;
  _id?: string;
  fullName: string;
  companyName?: string;
  email: string;
  country?: string;
  isUnlimited?: boolean;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  fullName: string;
  companyName: string;
  email: string;
  password: string;
  confirmPassword: string;
  country: string;
  termsAndCondition: boolean;
}

export interface AuthApiResponse {
  status: 'success' | 'error';
  message?: string;
  data?: {
    user: User;
    token: string;
  };
}
