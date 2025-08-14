import React, { useState, useEffect } from 'react';
import { View, Text, Button, Modal, StyleSheet, TouchableOpacity, Dimensions, TextInput } from 'react-native';
import CreateReportView from './CreateReportView';
import { handleUser } from '../api/user_api';
import { useNavigation } from '@react-navigation/native';


export default function Home() {
    const [modalVisible, setModalVisible] = useState(false);
    const [returned_user, setRRu] = useState();
    const [user, setUser] = useState();
    const navigation = useNavigation();

    useEffect(() => {
      const fetchUser = async () => {
      const user = await handleUser('/profile/', {}, 'GET');
      setUser(user)

      }
      fetchUser()
    }, []);
  

    return (
      <View style={styles.container}>

        <Text>{"Welcome, " + user?.user_name}</Text>
        
  
        <Button
          title = "Get User Information"
          onPress = {async () => // this is async because we use await in the next line
            {const returned_val = await handleUser('/getUser/', {user_id: 2}, 'GET'); //check if we need await here 12:12am  aug 4
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

        <Button
          title = "Sign out"
          onPress = {() => {navigation.replace('AuthView')}}
        />
  
        { returned_user &&
        <Text>{returned_user.email}</Text>
        }
      
        <Button
          title="Sign up User" 
          onPress={() => handleUser('/signup/', { user_name: userName, email: userEmail, password: placeholderPassword }, 'POST')} // function that calls handleUser when pressed
        />
  
  
        <Button title="Open Sheet" onPress={() => setModalVisible(true)} />
  
        <Modal
          animationType="slide"
          transparent={true}
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
  