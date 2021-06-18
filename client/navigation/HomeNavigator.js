import React from 'react';
import { StyleSheet, ActivityIndicator } from 'react-native';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import HomeScreen from '../screens/Home'
import MyAccountScreen from '../screens/Account'
import CreatePostScreen from '../screens/CreatePost'
import MyPostsScreen from '../screens/MyPosts'
import SavedPostScreen from '../screens/SavedList'
import CreateContractScreen from '../screens/CreateContracts'
import TenantReadContractScreen from '../screens/TenantGetContract'
import LandlordReadContractScreen from '../screens/LandlordGetContract'
import Ionicons from 'react-native-vector-icons/Ionicons'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import AntDesign from 'react-native-vector-icons/AntDesign'
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5'
import { db, auth } from '../utils/FirebaseConfig'
import { useState, useEffect } from 'react'

const Tab = createMaterialBottomTabNavigator();

const HomeNavigator = (props) => {

    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState();

    const getUser = async () => {
        const documentSnapshot = await db.collection('users')
            .doc(auth.currentUser.uid)
            .get();
    
        const userData = documentSnapshot.data();
        setUser(userData);
        setLoading(false);
    };
    
    useEffect(() => {
        getUser();
    }, []);

    if(loading) {
        return <ActivityIndicator />;
    }

    return (
        <Tab.Navigator initialRouteName="Home"
            labeled={false}
            barStyle={{ backgroundColor: '#E67451'}} >
            <Tab.Screen name="Home" component={HomeScreen}
                options={{
                    tabBarIcon: ({color, size}) => (
                        <Ionicons name="home-outline" color="white" size={24} />
                    )
                }} />

            {user.role == 'Landlord' ? 
            <Tab.Screen name="MyPosts" component={MyPostsScreen}
                options={{
                    tabBarIcon: ({color, size}) => (
                        <MaterialCommunityIcons name="post-outline" color="white" size={24} />
                    )
                }} /> : null}

            {user.role == 'Landlord' ? 
            <Tab.Screen name="CreatePost" component={CreatePostScreen}
                options={{
                    tabBarIcon: ({color, size}) => (
                        <AntDesign name="plussquareo" color="white" size={23} />
                    )
                }} /> : null}

            {user.role == 'Tenant' ? 
            <Tab.Screen name="SavedPost" component={SavedPostScreen}
            options={{
                tabBarIcon: ({color, size}) => (
                    <AntDesign name="hearto" color="white" size={22} />
                )
            }} /> : null}

            {user.role == 'Landlord' ? 
                <Tab.Screen name="CreateSmartContract" component={CreateContractScreen}
                options={{
                    tabBarIcon: ({color, size}) => (
                        <AntDesign name="addfile" color="white" size={22} />
                    )
                }} /> : null}

            {user.role == 'Landlord' ?
                <Tab.Screen name="LandlordReadContract" component={LandlordReadContractScreen}
                options={{
                    tabBarIcon: ({color, size}) => (
                        <FontAwesome5 name="file-contract" color="white" size={22} />
                    )
                }} /> : null}

            {user.role == 'Tenant' ?
            <Tab.Screen name="TenantReadContract" component={TenantReadContractScreen}
            options={{
                tabBarIcon: ({color, size}) => (
                    <FontAwesome5 name="file-contract" color="white" size={22} />
                )
            }} /> : null}

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