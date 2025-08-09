import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import Auth from './app/AuthView';
import Home from './app/Home';

const Stack = createNativeStackNavigator();

const [isLoggedin, setIsLoggedIn] = useState(false)

useEffect(() => {
  checkLogin(async () => {
    const token = await AsyncStorage.getItem('access_token')
    console.log("checkehckec")
    if (token) {
      setIsLoggedIn(true)
    } else {
      setIsLoggedIn(false)
    }
  }, []) //i used [] to ensure useeffect only works once not every render
})

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Dashboard">
        {isLoggedIn ? (
          <Stack.Screen 
          name="Login"
          component={Auth} 
          options={{ headerShown: false }} 
        />) : (
        <Stack.Screen 
          name="Dashboard" 
          component={Home} 
          options={{ headerShown: false }} 
        />)}
        

      </Stack.Navigator>
    </NavigationContainer>
  );
}
