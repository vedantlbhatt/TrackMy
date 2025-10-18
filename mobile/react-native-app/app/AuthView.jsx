import { StyleSheet, Text, View, Dimensions, Button, TextInput, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import MapView, { Marker, Circle } from 'react-native-maps';
import Slider from '@react-native-community/slider';
import { handleUser, handleLogin } from '../api/user_api';
import { useRouter } from 'expo-router';
import { useNavigation } from '@react-navigation/native';


export default function Auth() {
    const [email, setEmail] = useState('');
    const [password, setUserPassword] = useState('');
    const [userData, setUserData] = useState('')
    const navigation = useNavigation();
    const [showSignUpInputs, setShowInputs] = useState(false);
    const router = useRouter();

    const handlepoops = async () => {
        const request = await handleLogin({ email, password });
        console.log('handleLogin returned:', request);

        console.debug(request)
        if (request) {
          router.replace('/nav/Home'); // Navigate on success
        } else {
          alert('Please enter email and password');
        }
      };

    return (
        <View style={styles.container}>
            <TextInput
                style={styles.input}
                onChangeText={newText => setEmail(newText)}
                value={email}
                placeholder="Email"
            />
            <TextInput
                style={styles.input}
                onChangeText={newText => setUserPassword(newText)}
                value={password}
                placeholder="Password"
                secureTextEntry={true}
            />
            
            {
                showSignUpInputs && (
                    <View>
                        <TextInput
                            style={styles.input}
                            onChangeText={newText => setEmail(newText)}
                            value={email}
                            placeholder="Username"
                        />

                        {/* add future text inputs to account for other attributes of users*/}
                        
                    </View>
                )
            }
             <TouchableOpacity style={styles.buttonContainer} onPress={() => {
                handlepoops()}}>

                <Text style={styles.buttonText}>Login???</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.buttonContainer} onPress={() => {navigation.navigate('SignUp')}}>
                <Text style={styles.buttonText}>Sign up!!!</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.buttonContainer} onPress={async () => {const userData = await handleUser('/profile/', {}, 'GET'); setUserData(userData)
                console.log(userData.user_id);}}>
                <Text style={styles.buttonText}>Test Login!</Text>
            </TouchableOpacity>

            { userData &&
            <Text>{"user_id:" + userData.user_id}</Text>
            }
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,                
        justifyContent: 'center',  
        alignItems: 'center',         
        backgroundColor: 'white'      
    },
    input: {
        height: 40,
        width: '80%',
        borderColor: 'gray',
        borderWidth: 1,
        borderRadius: 5,
        paddingHorizontal: 10,
        marginVertical: 8,
        textAlign: 'center'
    },
    buttonContainer: {
        backgroundColor: '#007BFF', // bright blue
        paddingVertical: 12,
        paddingHorizontal: 24,
        borderRadius: 6,
        marginVertical: 8,
        width: '60%',
        alignItems: 'center'
    },
    buttonText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 16
    }
});
