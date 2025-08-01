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

    const response = await axiosInstance.request(config);
    return response.data;
  } catch (error) {
    throw error.response?.data || { detail: 'Network error or server not reachable' };
  }
};

export const handleUser = (endpoint, userData, method) => {
  return apiRequest(endpoint, userData, method);
};