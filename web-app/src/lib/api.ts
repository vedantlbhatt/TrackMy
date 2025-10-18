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
  getProfile: () => api.get('/profile/'),
  login: (credentials: { email: string; password: string }) => 
    api.post('/login/', credentials),
  signup: (userData: any) => api.post('/signup/', userData),
  
  // Report endpoints
  getAllLostReports: () => api.get('/getAllLostReports/'),
  createLostReport: (reportData: any) => api.post('/createLostReport/', reportData),
  createFoundReport: (reportData: any) => api.post('/createFoundReport/', reportData),
  
  // Item endpoints
  getItemsByUser: (userId: number) => api.get(`/getItemsByUser/?user_id=${userId}`),
  addItemByUser: (itemData: any) => api.post('/addItemByUser/', itemData),
  
  // Payment endpoints
  createPaymentIntent: (paymentData: any) => api.post('/create-payment-intent', paymentData),
  createBountyClaim: (claimData: any) => api.post('/create-bounty-claim', claimData),
  approveClaim: (claimId: number, reviewerId: number) => 
    api.post(`/approve-claim/${claimId}`, { reviewer_id: reviewerId }),
  rejectClaim: (claimId: number, reviewerId: number) => 
    api.post(`/reject-claim/${claimId}`, { reviewer_id: reviewerId }),
  getUserClaims: (userId: number) => api.get(`/user-claims/${userId}`),
  getPendingClaims: (userId: number) => api.get(`/pending-claims/${userId}`),
};

export default api;
