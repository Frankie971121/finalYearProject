import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import HomeNavigator from './navigation/HomeNavigator';
import RegisterScreen from './screens/Register';
import LoginScreen from './screens/Login';
import EditPostScreen from './screens/EditPost';
import SearchResultScreen from './screens/SearchResult';
import PostDetailScreen from './screens/PostDetail';
import ContractDetailScreen from './screens/ContractDetail';

const Stack = createStackNavigator();

const App = () => {

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen name="Login" component={LoginScreen} options={{headerShown: false}} />
        <Stack.Screen name="Register" component={RegisterScreen} options={{headerTitle: "Back to Login"}} />
        <Stack.Screen name="HomeNavigator" component={HomeNavigator} options={{headerShown: false}} />
        <Stack.Screen name="EditPost" component={EditPostScreen} options={{headerShown: false}} />
        <Stack.Screen name="SearchResult" component={SearchResultScreen} options={{headerShown: false}} />
        <Stack.Screen name="PostDetail" component={PostDetailScreen} options={{headerShown: false}} />
        <Stack.Screen name="ContractDetail" component={ContractDetailScreen} options={{headerShown: false}} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;