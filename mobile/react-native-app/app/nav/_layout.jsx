import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function NavLayout() {
  return (
    <Tabs
      screenOptions={({ route }) => {
        let iconName = 'help-circle';
        if (route.name === 'Home') {
          iconName = 'home';
        } else if (route.name === 'MyItemsScreen') {
          iconName = 'alert-circle';
        } else if (route.name === 'MessagingScreen') {
          iconName = 'checkbox-outline';
        } else if (route.name === 'ProfileScreen') {
          iconName = 'person';
        }
        return {
          tabBarIcon: ({ color, size }) => <Ionicons name={iconName} size={size} color={color} />,
          tabBarActiveTintColor: 'tomato',
          tabBarInactiveTintColor: 'gray',
          tabBarLabel: (() => {
            switch (route.name) {
              case 'Home': return 'Home';
              case 'MyItemsScreen': return 'My Items';
              case 'MessagingScreen': return 'Messages';
              case 'ProfileScreen': return 'Profile';
              default: return route.name;
            }
          })(),
          headerShown: false,
          tabBarStyle: {
            height: 56,
            paddingBottom: 0,
            paddingTop: 0,
          }
        };
      }}
    />
  );
}
