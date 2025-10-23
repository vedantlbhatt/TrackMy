import axios from 'axios';
import { supabase } from './supabase';

// Use Railway backend URL for production, localhost for development
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 
  (process.env.NODE_ENV === 'production' 
    ? 'https://backend-production-df0a.up.railway.app' 
    : 'http://localhost:8000');

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 second timeout
});

// Debug logging for API configuration
console.log('🔧 API Configuration:', {
  baseURL: API_BASE_URL,
  nodeEnv: process.env.NODE_ENV,
  hasApiUrl: !!process.env.NEXT_PUBLIC_API_URL
});

// Add request interceptor to include Supabase auth token
api.interceptors.request.use(async (config) => {
  try {
    // Only run in browser environment and if supabase is available
    if (typeof window !== 'undefined' && supabase) {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.access_token) {
        config.headers.Authorization = `Bearer ${session.access_token}`;
      }
    }
  } catch (error) {
    console.warn('Failed to get session:', error);
  }
  return config;
});

// Add response interceptor to handle auth errors
api.interceptors.response.use(
  (response) => {
    console.log('API response received:', response.status, response.config.url);
    return response;
  },
  async (error) => {
    console.error('API request failed:', error.message, error.config?.url);
    if (error.response?.status === 401) {
      try {
        // Token expired or invalid, sign out user
        if (typeof window !== 'undefined' && supabase) {
          await supabase.auth.signOut();
        }
        // Redirect to login page
        if (typeof window !== 'undefined') {
          window.location.href = '/login';
        }
      } catch (signOutError) {
        console.warn('Failed to sign out:', signOutError);
      }
    }
    return Promise.reject(error);
  }
);

// Type definitions
export interface User {
  user_id: number
  user_name: string
  email?: string
  password?: string
}

export interface Item {
  item_id: number
  name: string
  description?: string
  user_id?: number
}

export interface LostReport {
  user_id: number
  item_id?: number
  title: string
  description: string
  longitude: number
  latitude: number
  radius: number
  bounty: number
}

export interface FoundReport {
  founder_id: number
  item_id?: number
  title: string
  description: string
  longitude: number
  latitude: number
  radius: number
}

export interface PaymentData {
  amount: number
  currency: string
  email: string
  report_id?: number
  user_id?: number
}

export interface BountyClaim {
  report_id: number
  finder_id: number
  claim_message: string
  contact_info: string
}

// Complete API integration with all backend endpoints
export const userApi = {
  // Authentication endpoints
  signup: (userData: { email: string; user_name: string; password: string }) => 
    api.post('/api/signup/', userData),
  login: (loginData: { email: string; password: string }) => 
    api.post('/api/login/', loginData),
  
  // User profile endpoints
  getProfile: () => api.get('/api/profile/'),
  getUserById: (userId: number) => api.get(`/api/getUser/?user_id=${userId}`),

  // Lost Report endpoints
  getAllLostReports: () => api.get('/api/getAllLostReports/'),
  getLostReportsByUser: (userId: number) => api.get(`/api/getLostReportByUser/${userId}`),
  createLostReport: (reportData: LostReport) => api.post('/api/createLostReport/', reportData),
  editLostReport: (reportId: number, reportData: LostReport) => 
    api.put(`/api/editLostReport/${reportId}`, reportData),
  deleteLostReport: (reportId: number) => api.delete(`/api/deleteLostReport/${reportId}`),

  // Found Report endpoints
  getFoundReportsByUser: (userId: number) => api.get(`/api/getFoundReportByUser/${userId}`),
  createFoundReport: (reportData: FoundReport) => api.post('/api/createFoundReport/', reportData),
  editFoundReport: (reportId: number, reportData: FoundReport) => 
    api.put(`/api/editFoundReport/${reportId}`, reportData),
  deleteFoundReport: (reportId: number) => api.delete(`/api/deleteFoundReport/${reportId}`),

  // Item endpoints
  getItemByUser: (userId: number, itemId: number) => 
    api.get(`/api/getItemByUser/?user_id=${userId}&item_id=${itemId}`),
  getItemsByUser: (userId: number) => api.get(`/api/getItemsByUser/?user_id=${userId}`),
  addItemByUser: (itemData: Omit<Item, 'item_id'>) => api.post('/api/addItemByUser/', itemData),
  deleteItemByUser: (itemId: number, userId: number) => 
    api.delete(`/api/deleteItemByUser/?item_id=${itemId}&user_id=${userId}`),

  // Image endpoints
  addImage: (imageData: { item_id: number; url: string; faiss_id?: string }) => 
    api.post('/api/addImage/', imageData),
  addImageToIndex: (itemId: number, imageUrl: string) => 
    api.post('/api/addImageToIndex/', { item_id: itemId, image_url: imageUrl }),
  getImageComparison: (itemId: number, userId: number, imageUrl: string) => 
    api.get(`/api/getImageComparison/?item_id=${itemId}&user_id=${userId}&image_url=${imageUrl}`),
  deleteImage: (imageId: number) => api.delete(`/api/deleteImage/?image_id=${imageId}`),
  clearFaissIndex: () => api.delete('/api/deleteFaissIndex/'),

  // Payment endpoints
  createPaymentIntent: (paymentData: PaymentData) => api.post('/api/create-payment-intent', paymentData),
  confirmPayment: (paymentIntentId: string) => api.post('/api/confirm-payment', { payment_intent_id: paymentIntentId }),
  createBountyClaim: (claimData: BountyClaim) => api.post('/api/create-bounty-claim', claimData),
  approveClaim: (claimId: number, reviewerId: number) =>
    api.post(`/api/approve-claim/${claimId}`, { reviewer_id: reviewerId }),
  rejectClaim: (claimId: number, reviewerId: number) =>
    api.post(`/api/reject-claim/${claimId}`, { reviewer_id: reviewerId }),
  getUserClaims: (userId: number) => api.get(`/api/user-claims/${userId}`),
  getPendingClaims: (userId: number) => api.get(`/api/pending-claims/${userId}`),
};

export default api;
