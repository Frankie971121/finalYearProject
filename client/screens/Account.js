import React from 'react'
import { View, Text, ActivityIndicator, Image, StyleSheet, StatusBar, Pressable } from 'react-native'
import { db, auth } from '../utils/FirebaseConfig'
import { useState, useEffect } from 'react'
import { ImageBackground } from 'react-native';

export default function Account({ navigation }) {

    const [user, setUser] = useState();
    const [loading, setLoading] = useState(true);

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

    const onLogout = () => {

    };

    if(loading) {
        return <ActivityIndicator />;
    }

    const fullName = user.lastName + " " + user.firstName;
    const dob = user.day + "/" + user.month + "/" + user.year;

    return (
        <View style={styles.container}>
            <StatusBar style="light" />
            <View style={styles.topContainer}>
                <ImageBackground
                    style={styles.backgroundImage}
                    source={require("../assets/images/background-image1.jpg")} >
                    <Image
                        style={styles.image}
                        source={{
                        uri: user.photo,
                        }}
                    />
                    <Text style={styles.name}>{fullName}</Text>
                </ImageBackground>
            </View>
            <View style={styles.bottomContainer}>
                <View style={styles.infoContainer}>
                    <Text style={styles.info}>Email</Text>
                    <Text style={styles.detail}>{user.email}</Text>
                </View>
                <View style={styles.infoContainer}>
                    <Text style={styles.info}>Date of Birth</Text>
                    <Text style={styles.detail}>{dob}</Text>
                </View>
                <View style={styles.infoContainer}>
                    <Text style={styles.info}>Phone Number</Text>
                    <Text style={styles.detail}>{user.phoneNum}</Text>
                </View>
                <View style={styles.infoContainer}>
                    <Text style={styles.info}>Status</Text>
                    <Text style={styles.detail}>{user.role}</Text>
                </View>
            </View>
            <View style={{marginTop: 50, alignItems: 'center',}}>
                <View style={{
                    borderBottomColor: 'black',
                    borderBottomWidth: 1.5,
                    width: '40%',
                }} />
                <Pressable
                    style={styles.button}
                    onPress={onLogout} >
                    <Text style={{color: 'red', fontSize: 18, marginTop: 35,}}>Logout</Text>
                </Pressable>
            </View>
        </View>
    )
};

const styles = StyleSheet.create({  
    container: {
        flex: 1,
        backgroundColor: 'white',
    },

    topContainer: {
        height: '40%',
        backgroundColor: 'white',
    },

    backgroundImage: {
        width: '100%',
        height: '75%',
        alignItems: 'center',
    },

    image: {
        width: '26.5%',
        height: '52%',
        borderRadius: 110 / 2,
        marginTop: '25%',
    },

    name: {
        fontWeight: 'bold',
        fontSize: 20,
        marginTop: '5%',
    },

    bottomContainer: {
        marginLeft: '6%',
        marginRight: '6%',
    },

    infoContainer: {
        backgroundColor: 'white',
        flexDirection: 'row',
        elevation: 5,
        height: '12.7%',
        borderRadius: 10,
        alignItems: 'center',
        paddingLeft: '4.3%',
        paddingRight: '10.6%',
        marginTop: '1.3%',
    },

    info: {
        width: '53%',
        fontFamily: 'sans-serif-medium',
        fontSize: 15,
    },

    detail: {
        textAlign: 'right',
        color: 'grey',
        width: "54%",
        fontStyle: 'italic',
    },

  });
