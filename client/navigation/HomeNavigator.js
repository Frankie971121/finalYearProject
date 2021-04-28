import React from 'react';
import { StyleSheet } from 'react-native';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import HomeScreen from '../screens/Home'
import MyAccountScreen from '../screens/Account'
import CreatePostScreen from '../screens/CreatePost'
import MyPostsScreen from '../screens/MyPosts'
import SmartContractScreen from '../screens/Contracts'
import Ionicons from 'react-native-vector-icons/Ionicons'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import AntDesign from 'react-native-vector-icons/AntDesign'
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5'

const Tab = createMaterialBottomTabNavigator();

const HomeNavigator = (props) => {
    return (
        <Tab.Navigator initialRouteName="Home"
            labeled={false}
            barStyle={{ backgroundColor: '#F68544' }} >
            <Tab.Screen name="Home" component={HomeScreen}
                options={{
                    tabBarIcon: ({color, size}) => (
                        <Ionicons name="home-outline" color="white" size={24} />
                    )
                }} />
            <Tab.Screen name="MyPosts" component={MyPostsScreen}
                options={{
                    tabBarIcon: ({color, size}) => (
                        <MaterialCommunityIcons name="post-outline" color="white" size={24} />
                    )
                }} />
            <Tab.Screen name="CreatePost" component={CreatePostScreen}
                options={{
                    tabBarIcon: ({color, size}) => (
                        <AntDesign name="addfile" color="white" size={22} />
                    )
                }} />
            <Tab.Screen name="SmartContract" component={SmartContractScreen}
            options={{
                tabBarIcon: ({color, size}) => (
                    <FontAwesome5 name="file-contract" color="white" size={22} />
                )
            }} />
            <Tab.Screen name="MyAccount" component={MyAccountScreen}
                options={{
                    tabBarIcon: ({color, size}) => (
                        <MaterialCommunityIcons name="account-circle-outline" color="white" size={26} />
                    )
                }} />
        </Tab.Navigator>
        
    )
};

export default HomeNavigator;

const styles = StyleSheet.create({
    screens: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});