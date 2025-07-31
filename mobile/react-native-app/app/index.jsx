import React, { useState } from 'react';
import { View, Text, Button, Modal, StyleSheet, TouchableOpacity, Dimensions, TextInput } from 'react-native';
import CreateReportView from './CreateReportView';



export default function SheetExample() {
  const [modalVisible, setModalVisible] = useState(false);
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [userPaymentSource, setUserPaymentSource] = useState('');
  //const API_URL = "http://192.168.1.86:8000/api";
  const API_URL = "http://127.0.0.1:8000/api";


  const handleUser = async (endpoint, userData, method) => {
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

  const handleAddUser = async () => {
    try {
      const response = await fetch(`${API_URL}/addUser/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_name: userName,
          email: userEmail,
          payment_source: userPaymentSource,
        }),
      });
  
      if (response.ok) {
        const data = await response.json();
        Alert.alert('Success', `User added with ID: ${data.user_id}`);
        setUserName('');
        setUserEmail('');
        setUserPaymentSource('');
      } else {
        const errorData = await response.json();
        Alert.alert('Error', errorData.detail || 'Failed to add user'); 
      }
    } catch (error) {
      Alert.alert('Error', 'Network error or server not reachable');
    }
  };
  

  return (
    <View style={styles.container}>
      <Text>${userName}</Text>
      <TextInput
            style={{ height: 40, borderColor: 'gray', borderWidth: 1 }} 
            onChangeText={newText => setUserName(newText)} 
            value={userName} 
            placeholder="username" 
            />
      <TextInput
            style={{ height: 40, borderColor: 'gray', borderWidth: 1 }} 
            onChangeText={newText => setUserEmail(newText)} 
            value={userEmail} 
            placeholder="email" 
            />
      <TextInput
            style={{ height: 40, borderColor: 'gray', borderWidth: 1 }} 
            onChangeText={newText => setUserPaymentSource(newText)} 
            value={userPaymentSource} 
            placeholder="payment source" 
            />

      <Button
        title="Add User" 
        onPress={() => handleUser('/addUser/', { user_name: userName, email: userEmail, payment_source: userPaymentSource }, 'POST')} // function that calls handleUser when pressed
      />


      <Button title="Open Sheet" onPress={() => setModalVisible(true)} />

      <Modal
        animationType="slide"
        ntransparent={true}
        visible={modalVisible}  
        onRequestClose={() => setModalVisible(false)}
      >
        <TouchableOpacity
          style={styles.overlay}
          activeOpacity={1}
        >
          <CreateReportView onClose={() => setModalVisible(false)} />
        </TouchableOpacity>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'flex-end',
  },
  sheetTitle: {
    fontSize: 18,
    marginBottom: 10,
  },
});
