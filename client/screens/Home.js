import React from 'react';
import { View, StyleSheet, TextInput, Text, ImageBackground, Pressable, Alert, StatusBar } from 'react-native';
import Fontisto from 'react-native-vector-icons/Fontisto';
import { useState, useEffect } from 'react';
import { auth } from '../utils/FirebaseConfig';
import { Overlay } from 'react-native-elements'
import Ionicons from 'react-native-vector-icons/Ionicons'
import { useNavigation } from '@react-navigation/native'

export default function Home() {

    const [initialize, setInitialize] = useState(true);
    const [user, setUser] = useState();
    const [visible, setVisible] = useState(false);
    const [area, setArea] = useState("");

    const navigation = useNavigation();

    function handleUserState(user) {
        setUser(user);
        if (initialize)
            setInitialize(false);
    };

    useEffect(() => {
        const subscriber = auth.onAuthStateChanged(handleUserState);
        return () => subscriber();
    }, []);

    const toggleOverlay = () => {
        setVisible(!visible);
    };

    const searchResult = () => {
        setVisible(!visible);
        navigation.navigate('SearchResult', {
            input: area,
        });
    };

    if(!user) {
        return (
            <View>
                <Text>Back to Login</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <StatusBar style="light" />
            <View style={styles.topContainer}>
                <ImageBackground 
                    source={require('../assets/images/two.jpg')}
                    style={styles.image}>
                        <Text style={styles.title} adjustsFontSizeToFit={true}>SMART RENT</Text>
                        <Text style={styles.title1} adjustsFontSizeToFit={true}>Property Rental DApp</Text>
                        <Pressable
                            style={styles.searchButton}
                            onPress={toggleOverlay}>
                                <Fontisto name="search" size={18} color={"#f15454"} />
                                <Text style={styles.buttonText}>Search by area...</Text>
                        </Pressable>
                </ImageBackground>
                <Overlay
                    isVisible={visible}
                    onBackdropPress={toggleOverlay}
                    overlayStyle={styles.overlay}>
                        <View style={styles.overlayView}>
                            <TextInput
                                style={styles.searchBar}
                                label="area"
                                placeholder="Kuala Lumpur, Johor, etc..."
                                onChangeText={(inputArea) => {
                                    setArea(inputArea);
                                }}
                            />
                            <Pressable style={styles.arrow} onPress={searchResult}>
                                <Ionicons name="arrow-forward" size={20} />
                            </Pressable>
                        </View>
                </Overlay>
            </View>
        </View>
    )
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },

    topContainer: {
        height: '100%',
    },

    image: {
        width: '100%',
        height: '100%',
        opacity: 1,
        alignItems: 'center'
    },

    title: {
        color: 'white',
        fontSize: 24,
        fontWeight: 'bold',
        marginTop: '50%',
        opacity: 1,
    },

    title1: {
        color: 'white',
        fontSize: 24,
        fontWeight: 'bold',
    },

    searchButton: {
        backgroundColor: 'white',
        borderRadius: 15,
        paddingLeft: '4.8%',
        width: '81.5%',
        marginTop: "15%",
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        height: 45,
        elevation: 5,
    },

    buttonText: {
        fontSize: 15,
        color: 'silver',
        fontStyle: 'italic',
        marginLeft: 10,
    },

    modalView: {
        height: '70%',
        width: '70%',
        borderWidth: 1,
        borderRadius: 20,
        backgroundColor: 'white',
    },

    searchBar: {
        fontStyle: 'italic',
        fontSize: 16,
        height: 50,
        marginLeft: 5,
        width: '80%',
        marginRight: 20,
    },

    overlay: {
        height: '80%',
        width: '80%',
        borderRadius: 20,
        alignItems: 'center',
    },

    overlayView: {
        width: '90%',
        flexDirection: 'row',
        borderBottomWidth: 1,
    },

    arrow: {
        marginTop: 15,
    },  
});
