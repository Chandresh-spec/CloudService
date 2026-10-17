import type { RegisterPayload, RegisterResponse, VerifyOtpPayload, VerifyOtpResponse } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export class ApiError extends Error {
  status: number;
  data: unknown;

  constructor(message: string, status: number, data?: unknown) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.data = data;
  }
}

async function handleResponse<T>(response: Response): Promise<T> {
  const contentType = response.headers.get('content-type');
  const isJson = contentType && contentType.includes('application/json');
  const data = isJson ? await response.json() : await response.text();

  if (!response.ok) {
    let errorMessage = 'An unexpected error occurred';
    if (typeof data === 'object' && data !== null) {
      const anyData = data as { detail?: string | Array<{ msg?: string; loc?: string[] }> };
      if (typeof anyData.detail === 'string') {
        errorMessage = anyData.detail;
      } else if (Array.isArray(anyData.detail) && anyData.detail.length > 0) {
        // FastAPI validation error format
        const first = anyData.detail[0];
        const field = first.loc ? first.loc[first.loc.length - 1] : '';
        errorMessage = `${field ? field + ': ' : ''}${first.msg || 'Validation failed'}`;
      }
    } else if (typeof data === 'string' && data.length > 0) {
      errorMessage = data;
    }

    throw new ApiError(errorMessage, response.status, data);
  }

  return data as T;
}

export const authApi = {
  /**
   * Register a new user
   */
  async register(payload: RegisterPayload): Promise<RegisterResponse> {
    const res = await fetch(`${API_BASE_URL}/api/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: payload.name.trim(),
        email: payload.email.trim().toLowerCase(),
        password: payload.password.trim(),
      }),
    });

    return handleResponse<RegisterResponse>(res);
  },

  /**
   * Verify 6-digit OTP code
   */
  async verifyOtp(payload: VerifyOtpPayload): Promise<VerifyOtpResponse> {
    const res = await fetch(`${API_BASE_URL}/api/auth/verify_otp`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: payload.email.trim().toLowerCase(),
        otp: payload.otp.trim(),
      }),
    });

    return handleResponse<VerifyOtpResponse>(res);
  },

  /**
   * Check backend health / connection
   */
  async checkHealth(): Promise<boolean> {
    try {
      const res = await fetch(`${API_BASE_URL}/docs`, { method: 'HEAD' });
      return res.ok;
    } catch {
      return false;
    }
  },
};
