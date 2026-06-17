import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const api = axios.create({
  baseURL: API_URL,
  timeout: 10000, // 10-second timeout
  headers: {
    'Content-Type': 'application/json',
  },
});

// Response interceptor for general error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle custom API error formats or generic connection errors
    if (error.code === 'ECONNABORTED') {
      return Promise.reject(new Error('Connection timed out. Please try again.'));
    }
    return Promise.reject(error);
  }
);

export interface EnquiryData {
  name: string;
  email: string;
  phone: string;
}

export interface EnquiryResponse {
  success: boolean;
  message?: string;
  errors?: Array<{ field: string; message: string }>;
}

export const submitEnquiry = async (data: EnquiryData): Promise<EnquiryResponse> => {
  try {
    const response = await api.post<EnquiryResponse>('/enquiry', data);
    return response.data;
  } catch (error: any) {
    if (error.response && error.response.data) {
      return error.response.data;
    }
    return {
      success: false,
      errors: [
        {
          field: 'server',
          message: error.message || 'A network error occurred. Please check your connection.',
        },
      ],
    };
  }
};
