const API_URL = "http://127.0.0.1:8000/api";

export const handleUser = async (endpoint, userData, method) => {
    try {
      const response = await fetch(`${API_URL}${endpoint}`, {
        method: method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });
  
      if (response.ok) {
        const data = await response.json();
        Alert.alert('Success');
      } else {
        const errorData = await response.json();
        Alert.alert('Error'); 
      }
    } catch (error) {
      Alert.alert('Error', 'Network error or server not reachable');
    }
  };