import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';



const API_URL = 'http://127.0.0.1:8000/api';

const axiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const handleLogin = async(data = {}) => {
  try {
        const config = {
          url: API_URL + '/login/',
          method: 'POST',
        };

        config.data = data;


        await AsyncStorage.removeItem('access_token');
        const response = await axiosInstance.request(config);
        if (!(response)) {
          return None
        }
        if (response.data.access_token) {
          await AsyncStorage.setItem('access_token', response.data.access_token);
        } else {
          return None
        }
        
        
        return response.data;

  } catch (error) {
    throw error.response?.data || { detail: 'Network error or server not reachable' };
  }
}

export const apiRequest = async (endpoint, data = {}, method) => {
  try {
    const config = {
      url: API_URL + endpoint,
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

    //console.log("Request config:", config); 


    const response = await axiosInstance.request(config);

    //if (endpoint === '/login/' && response.data.access_token) {
    //  await AsyncStorage.setItem('access_token', response.data.access_token);
    //}

    //console.log("response:", response.data)
    return response.data;

  } catch (error) {
    throw error.response?.data || { detail: 'Network error or server not reachable' };
  }
};

export const handleUser = (endpoint, userData, method) => {
  return apiRequest(endpoint, userData, method);
};