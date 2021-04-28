import React from 'react';
import { View, Text, StyleSheet, TextInput, Button, Dimensions, Image, StatusBar, KeyboardAvoidingView, TouchableOpacity } from 'react-native';
import { useState, useEffect } from 'react';
import Colors from '../utils/Colors';
import { auth } from '../utils/FirebaseConfig';

const {width, height} = Dimensions.get('window')

const Login = ({navigation}) => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const onSignIn = () => {
        auth.signInWithEmailAndPassword(email, password)
        .then(() => {navigation.replace('HomeNavigator');})
        .catch((error) => alert(error.message));
    };

    return (
        <KeyboardAvoidingView style={styles.container}>
            <StatusBar style="light" />
            <Image 
                source={{
                    uri: "https://rumahkurealestate.files.wordpress.com/2011/12/rental-property.jpg",
                }}
                style={styles.imageContainer}
                />
            <TextInput
                style={styles.inputContainer}
                label="Email address"
                placeholder="Enter email address"
                onChangeText={(inputEmail) => {
                    setEmail(inputEmail);
                }}
            />
            <TextInput
                style={styles.inputContainer}
                label="Password"
                placeholder="Enter password"
                onChangeText={(inputPassword) => {setPassword(inputPassword);}}
                secureTextEntry={true}
            />
            <View style={styles.buttonContainer}>
                <Button
                    type="outline"
                    title="Login"
                    onPress={onSignIn}
                />
            </View>
            <View style={{marginTop: 10, width: 120, alignItems:'center'}}>
                <TouchableOpacity
                    onPress={() => navigation.navigate('Register')}>
                        <Text style={{fontSize:17, color: Colors.blue}}>Register</Text>
                </TouchableOpacity>
            </View>
        </KeyboardAvoidingView>
    )
};

export default Login;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'white',
    },

    imageContainer: {
        width: 200,
        height: 200,
        borderRadius: 40,
        marginBottom: 20,
    },

    inputContainer: {
        width: width - 100,
        height: 40,
        borderWidth: 1,
        borderTopLeftRadius: 15,
        borderBottomRightRadius: 15,
        overflow: 'hidden',
        marginTop: 10,
        paddingLeft: 10,
    },

    buttonContainer: {
        marginTop: 20,
        width: 120,
    },

});