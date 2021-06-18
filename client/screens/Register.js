import React from 'react';
import { View, Text, StyleSheet, TextInput, Button, Dimensions, Alert } from 'react-native';
import { useState } from 'react';
import Colors from '../utils/Colors';
import DropDownPicker from 'react-native-dropdown-picker';
import { auth, db, storage } from '../utils/FirebaseConfig';
import EStyleSheet from 'react-native-extended-stylesheet';

const {width} = Dimensions.get('window').width;
EStyleSheet.build({$rem: width > 340 ? 18 : 17});

const Register = ({navigation}) => {
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [number, setNumber] = useState("");
    const [role, setRole] = useState("Landlord");
    const [day, setDay] = useState(null);
    const [month, setMonth] = useState(null);
    const [year, setYear] = useState(null);

    const onSignUp = async () => {
        const uri = "https://cdn.business2community.com/wp-content/uploads/2017/08/blank-profile-picture-973460_640.png";

        const response = await fetch(uri);
        const blob = await response.blob();

        const task = storage.ref().child(`profile/${auth.currentUser.uid}/${Math.random().toString(20)}`).put(blob);

        const taskProgress = snapshot => {
            var percentage = snapshot.bytesTransferred / snapshot.totalBytes * 100;
        }

        const taskError = err => {
            console.log(err);
        }

        const taskCompleted = snapshot => {
            task.snapshot.ref.getDownloadURL().then((snapshot) => {
                registerUser(snapshot);
            });
        }

        task.on("state_changed", taskProgress, taskError, taskCompleted);

    };

    const registerUser = (downloadURL) => {
            auth.createUserWithEmailAndPassword(email, password)
            .then(() => {
                db.collection("users").doc(auth.currentUser.uid)
                .set({
                    email: email,
                    firstName: firstName,
                    lastName: lastName,
                    password: password,
                    phoneNum: number,
                    role: role,
                    day: day,
                    month: month,
                    year: year,
                    photo: downloadURL,
                    savedList: [],
                }).then(() => {
                    Alert.alert("Registered Successfully.")
                    navigation.navigate('Login');
                });
            })
            .catch((error) => alert(error.message));
    };

    return (
        <View style={styles.container}>
            <Text style={styles.titleText}>Create New Account</Text>
            <TextInput
                style={styles.inputContainer}
                label="First name"
                placeholder="First Name"
                onChangeText={(inputFirstName) => {
                    setFirstName(inputFirstName);
                }}
            />
            <TextInput
                style={styles.inputContainer}
                label="Last name"
                placeholder="Last Name"
                onChangeText={(inputLastName) => {
                    setLastName(inputLastName);
                }}
            />
            <TextInput
                style={styles.inputContainer}
                label="Email address"
                placeholder="Email Address"
                onChangeText={(inputEmail) => {
                    setEmail(inputEmail);
                }}
            />
            <TextInput
                style={styles.inputContainer}
                label="Phone number"
                keyboardType = 'numeric'
                placeholder="Phone Number (+60)"
                onChangeText={(inputNumber) => {
                    setNumber(inputNumber);
                }}
            />
            <TextInput
                style={styles.inputContainer}
                label="Password"
                placeholder="Password"
                onChangeText={(inputPassword) => {setPassword(inputPassword);}}
                secureTextEntry={true}
            />
            <View style={styles.dobContainer}>
                <TextInput
                    style={styles.birthday}
                    label="day"
                    keyboardType = 'numeric'
                    placeholder="DD"
                    onChangeText={(input) => {
                        setDay(input);
                    }}
                />
                <Text style={{marginLeft: 5, marginRight: 5}}>/</Text>
                <TextInput
                    style={styles.birthday}
                    label="month"
                    keyboardType = 'numeric'
                    placeholder="MM"
                    onChangeText={(input) => {
                        setMonth(input);
                    }}
                />
                <Text style={{marginLeft: 5, marginRight: 5}}>/</Text>
                <TextInput
                    style={styles.birthday}
                    label="year"
                    keyboardType = 'numeric'
                    placeholder="YY"
                    onChangeText={(input) => {
                        setYear(input);
                    }}
                />
            </View>
            <DropDownPicker
                items={[
                    {label: 'Landlord', value: 'Landlord'},
                    {label: 'Tenant', value: 'Tenant'},
                ]}
                containerStyle={styles.dropdownContainer}
                style={styles.dropdownRadius}
                dropDownStyle={{
                    borderBottomLeftRadius: 10, borderBottomRightRadius: 10
                }}
                defaultValue={role}
                onChangeItem={(item) => {setRole(item.value)}}
            />
            <View style={styles.buttonContainer}>
                <Button
                    title="Sign Up"
                    type="outline"
                    onPress={onSignUp}
                />
            </View>
        </View>
    )
};

export default Register;

const styles = EStyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
    },

    titleText: {
        fontSize:25,
        marginTop:'2.2rem',
        marginBottom:30,
        color:Colors.blue
    },

    inputContainer: {
        width: '60%',
        height: '6%',
        backgroundColor: 'white',
        borderRadius: 10,
        marginTop: '0.5rem',
        paddingLeft: '0.7rem',
    },

    buttonContainer: {
        marginTop: '4rem',
        width: '30%',
    },

    dropdownContainer: {
        height: '6%',
        width: '27%',
        marginTop: '0.5rem',
        marginLeft: '-8.5rem',
    },

    dropdownRadius: {
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
        borderBottomLeftRadius: 10,
        borderBottomRightRadius: 10,
        backgroundColor: 'white',
    },

    dobContainer: {
        flexDirection: 'row',
        marginTop: '0.5rem',
        alignItems: 'center',
        height: '6%',
        width: '60%',
    },

    birthday: {
        backgroundColor: 'white',
        borderRadius: 10,
        width: '25%',
        justifyContent: 'center',
        paddingLeft: '0.7rem',
        borderRadius: 10,
    }
});