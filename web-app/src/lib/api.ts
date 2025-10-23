import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

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
  user_id: number
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

// API functions that match your mobile app
export const userApi = {
  // User endpoints
  getProfile: () => api.get('/api/profile/'),
  login: (credentials: { email: string; password: string }) =>
    api.post('/api/login/', credentials),
  signup: (userData: Omit<User, 'user_id'>) => api.post('/api/signup/', userData),
  updateProfile: (userId: number, userData: Partial<User>) => 
    api.put(`/api/users/${userId}`, userData),
  deleteUser: (userId: number) => api.delete(`/api/users/${userId}`),

  // Report endpoints
  getAllLostReports: () => api.get('/api/getAllLostReports/'),
  getLostReportById: (reportId: number) => api.get(`/api/getLostReport/${reportId}`),
  getLostReportsByUser: (userId: number) => api.get(`/api/getLostReportByUser/${userId}`),
  createLostReport: (reportData: LostReport) => api.post('/api/createLostReport/', reportData),
  updateLostReport: (reportId: number, reportData: Partial<LostReport>) => 
    api.put(`/api/editLostReport/${reportId}`, reportData),
  deleteLostReport: (reportId: number) => api.delete(`/api/deleteLostReport/${reportId}`),

  // Found Report endpoints
  getAllFoundReports: () => api.get('/api/getAllFoundReports/'),
  getFoundReportById: (reportId: number) => api.get(`/api/getFoundReport/${reportId}`),
  getFoundReportsByUser: (userId: number) => api.get(`/api/getFoundReportByUser/${userId}`),
  createFoundReport: (reportData: FoundReport) => api.post('/api/createFoundReport/', reportData),
  updateFoundReport: (reportId: number, reportData: Partial<FoundReport>) => 
    api.put(`/api/editFoundReport/${reportId}`, reportData),
  deleteFoundReport: (reportId: number) => api.delete(`/api/deleteFoundReport/${reportId}`),

  // Item endpoints
  getItemsByUser: (userId: number) => api.get(`/api/getItemsByUser/?user_id=${userId}`),
  getItemById: (itemId: number) => api.get(`/api/getItem/${itemId}`),
  addItemByUser: (itemData: Omit<Item, 'item_id'>) => api.post('/api/addItemByUser/', itemData),
  updateItem: (itemId: number, itemData: Partial<Item>) => 
    api.put(`/api/updateItem/${itemId}`, itemData),
  deleteItem: (itemId: number) => api.delete(`/api/deleteItem/${itemId}`),

  // Search endpoints
  searchReports: (query: string, filters?: {
    category?: string;
    status?: string;
    bounty?: string;
    dateRange?: string;
  }) => api.get('/api/search', { params: { q: query, ...filters } }),

  // Payment endpoints
  createPaymentIntent: (paymentData: PaymentData) => api.post('/api/create-payment-intent', paymentData),
  createBountyClaim: (claimData: BountyClaim) => api.post('/api/create-bounty-claim', claimData),
  approveClaim: (claimId: number, reviewerId: number) =>
    api.post(`/api/approve-claim/${claimId}`, { reviewer_id: reviewerId }),
  rejectClaim: (claimId: number, reviewerId: number) =>
    api.post(`/api/reject-claim/${claimId}`, { reviewer_id: reviewerId }),
  getUserClaims: (userId: number) => api.get(`/api/user-claims/${userId}`),
  getPendingClaims: (userId: number) => api.get(`/api/pending-claims/${userId}`),

  // Image endpoints
  uploadImage: (file: File, reportId?: number) => {
    const formData = new FormData();
    formData.append('file', file);
    if (reportId) formData.append('report_id', reportId.toString());
    return api.post('/api/upload-image', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
  },
  deleteImage: (imageId: number) => api.delete(`/api/delete-image/${imageId}`),

  // Analytics endpoints
  getUserStats: (userId: number) => api.get(`/api/user-stats/${userId}`),
  getReportStats: (reportId: number) => api.get(`/api/report-stats/${reportId}`),
  getGlobalStats: () => api.get('/api/global-stats'),
};

export default api;
