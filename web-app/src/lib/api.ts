import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// API functions that match your mobile app
export const userApi = {
  // User endpoints
  getProfile: () => api.get('/api/profile/'),
  login: (credentials: { email: string; password: string }) => 
    api.post('/api/login/', credentials),
  signup: (userData: any) => api.post('/api/signup/', userData),
  
  // Report endpoints
  getAllLostReports: () => api.get('/api/getAllLostReports/'),
  createLostReport: (reportData: any) => api.post('/api/createLostReport/', reportData),
  createFoundReport: (reportData: any) => api.post('/api/createFoundReport/', reportData),
  
  // Item endpoints
  getItemsByUser: (userId: number) => api.get(`/api/getItemsByUser/?user_id=${userId}`),
  addItemByUser: (itemData: any) => api.post('/api/addItemByUser/', itemData),
  
  // Payment endpoints
  createPaymentIntent: (paymentData: any) => api.post('/api/create-payment-intent', paymentData),
  createBountyClaim: (claimData: any) => api.post('/api/create-bounty-claim', claimData),
  approveClaim: (claimId: number, reviewerId: number) => 
    api.post(`/api/approve-claim/${claimId}`, { reviewer_id: reviewerId }),
  rejectClaim: (claimId: number, reviewerId: number) => 
    api.post(`/api/reject-claim/${claimId}`, { reviewer_id: reviewerId }),
  getUserClaims: (userId: number) => api.get(`/api/user-claims/${userId}`),
  getPendingClaims: (userId: number) => api.get(`/api/pending-claims/${userId}`),
};

export default api;
