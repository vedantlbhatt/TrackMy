import React, { useState } from 'react';
import { View, Text, Button, Modal, StyleSheet, TouchableOpacity, Dimensions, TextInput } from 'react-native';
import CreateReportView from './CreateReportView';
import { handleUser } from '../api/user_api';


export default function SheetExample() {
  const [modalVisible, setModalVisible] = useState(false);
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [userPaymentSource, setUserPaymentSource] = useState('');
  const [placeholderPassword, setPlaceholderPassword] = useState('');
  const [returned_user, setRRu] = useState();

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
      <TextInput
            style={{ height: 40, borderColor: 'gray', borderWidth: 1 }} 
            onChangeText={newText => setPlaceholderPassword(newText)} 
            value={placeholderPassword} 
            placeholder="placeholder password" 
            />

      <Button
        title = "Get User Information"
        onPress = {async () => // this is async because we use await in the next line
          {const returned_val = handleUser('/getUser/', {user_id: 2}, 'GET'); 
          /* const returned_val is the return value of the function handleUser
          // we use 'await' bc handleUser will return a Promise (case where async functions 
          // are still loading so a promise is like a "promise" to return something)
          // so await is used to WAIT for the promise to be resolved -> allowing us to get the value we want
          // note: currently we only fetch user_id: 2 or whatver we specify, will work properly after we 
          // implement login
          */ 
          setRRu(returned_val);
          console.log(returned_user.email)
        }}
      />

      { returned_user &&
      <Text>{returned_user.email}</Text>
      }
      

      <Button
        title="Add User" 
        onPress={() => handleUser('/addUser/', { user_name: userName, email: userEmail, payment_source: userPaymentSource, hashed_password: placeholderPassword }, 'POST')} // function that calls handleUser when pressed
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
