import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import LoginScreen from './src/components/LoginScreen';
import RegisterScreen from './src/components/RegisterScreen';
import ProductScreen from './src/components/ProductScreen';
import CartScreen from './src/components/CartScreen';
import {getApps, initializeApp} from 'firebase/app';
import firebaseConfig from './src/components/firebaseConfig';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {getAuth, getReactNativePersistence, initializeAuth} from 'firebase/auth';

if (!getApps().length) {
  initializeApp(firebaseConfig);
}

let auth;
if (!getAuth(getApps()[0])) {
  auth = initializeAuth(getApps()[0], {
    persistence: getReactNativePersistence(AsyncStorage),
  });
} else {
  auth = getAuth(getApps()[0]);
}

const Tab = createBottomTabNavigator();
const AuthStack = createStackNavigator();
const AppStack = createStackNavigator();

const AuthStackScreen = () => {
  return (
    <AuthStack.Navigator>
      <AuthStack.Screen name="Login" component={LoginScreen}/>
      <AuthStack.Screen name="Register" component={RegisterScreen}/>
    </AuthStack.Navigator>
  );
};

const AppStackScreen = () => {
  return (
    <AppStack.Navigator>
      <AppStack.Screen name="Home" component={ProductScreen}
                       options={{headerShown: false}}/>
      <AppStack.Screen name="CartScreen" component={CartScreen}/>
    </AppStack.Navigator>
  );
};

export default function App() {
  return (
    <NavigationContainer>
      <AppStack.Navigator>
        <AppStack.Screen name="Auth" component={AuthStackScreen}
                         options={{headerShown: false}}/>
        <AppStack.Screen name="App" component={AppStackScreen}
                         options={{headerShown: false}}/>
      </AppStack.Navigator>
    </NavigationContainer>
  );
}