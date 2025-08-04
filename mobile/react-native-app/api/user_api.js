import axios from 'axios';

const API_URL = 'http://127.0.0.1:8000/api';

const axiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const apiRequest = async (endpoint, data = {}, method) => {
  try {
    const config = {
      url: endpoint,
      method,
    };

    if (method.toUpperCase() === 'GET') {
      config.params = data;
    } else {
      config.data = data; 
    }

    const token = await AsyncStorage.getItem('access_token');
    if (token) {
      config.headers = {
        Authorization: `Bearer ${token}`
      };
    }

    const response = await axiosInstance.request(config);

    if (endpoint === '/login' && response.data.access_token) {
      await AsyncStorage.setItem('access_token', response.data.access_token);
    }
    
    return response.data;
  } catch (error) {
    throw error.response?.data || { detail: 'Network error or server not reachable' };
  }
};

export const handleUser = (endpoint, userData, method) => {
  console.log("handle")
  return apiRequest(endpoint, userData, method);
};