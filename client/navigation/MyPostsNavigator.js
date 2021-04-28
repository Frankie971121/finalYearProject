import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import MyPostsScreen from '../screens/MyPosts';
import EditPostScreen from '../screens/EditPost';

const Stack = createStackNavigator();

const MyPostsNavigator = ({navigation}) => {

  return (
      <Stack.Navigator initialRouteName="MyPosts">
        <Stack.Screen name="MyPosts" component={MyPostsScreen} options={{headerShown: false}} />
        <Stack.Screen name="EditPost" component={EditPostScreen} navigation={this.props.navigation} options={{headerShown: false}} />
      </Stack.Navigator>
  );
};

export default MyPostsNavigator;