import { StyleSheet, Text, View, Dimensions, Button, TextInput, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import MapView, { Marker, Circle } from 'react-native-maps';
import Slider from '@react-native-community/slider';
import { handleUser } from '../api/user_api';

export default function Auth() {
    const [email, setEmail] = useState('');
    const [password, setUserPassword] = useState('');

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
             <TouchableOpacity style={styles.buttonContainer} onPress={() => {handleUser('/login/', {email: email, password: password}, 'POST')}}>
                <Text style={styles.buttonText}>Login???</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.buttonContainer} onPress={() => { /* signup action */ }}>
                <Text style={styles.buttonText}>Sign up!!!</Text>
            </TouchableOpacity>



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
