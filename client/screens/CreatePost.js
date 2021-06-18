import React from 'react'
import { View, Alert, Text, Image, TextInput, StyleSheet, StatusBar, Dimensions, ScrollView, Pressable, TouchableOpacity } from 'react-native'
import CheckBox from '@react-native-community/checkbox'
import { useState, useEffect, useRef } from 'react'
import { Picker } from '@react-native-picker/picker'
import Fontisto from 'react-native-vector-icons/Fontisto'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import * as ImagePicker from 'expo-image-picker'
import { Overlay } from 'react-native-elements'
import { auth, db, storage } from '../utils/FirebaseConfig'
import { useNavigation } from '@react-navigation/native'

export default function CreatePost({ navigation }) {

    const navigationTo = useNavigation();    

    useEffect(() => {
        const unsubscribe = navigation.addListener("focus", () => {
            setTitle("");
            setPrice(null);
            setDescription("");
            setRoomType("Single Room");
            setSize(null);
            setArea("");
            setAddress("");
            setPreference("Male");
            setWifi(false);
            setAirCon(false);
            setGym(false);
            setBathroom(false);
            setPool(false);

            setShowImage1(false);
            setImage1(null);

            setUploading(false);
            setUrls([]);
            setNewId(null);
        });

        return unsubscribe;

    }, [navigation]);

    const [title, setTitle] = useState("");
    const [price, setPrice] = useState(null);
    const [description, setDescription] = useState("");
    const [roomType, setRoomType] = useState("Single Room");
    const [size, setSize] = useState(null);
    const [area, setArea] = useState("");
    const [address, setAddress] = useState("");
    const [preference, setPreference] = useState("Male");
    const [wifi, setWifi] = useState(false);
    const [aircon, setAirCon] = useState(false);
    const [gym, setGym] = useState(false);
    const [bathroom, setBathroom] = useState(false);
    const [pool, setPool] = useState(false);

    const [showImage1, setShowImage1] = useState(false);
    const [image1, setImage1] = useState(null);

    const [uploading, setUploading] = useState(false);
    const [urls, setUrls] = useState([]);
    const urlsRef = useRef();
    urlsRef.current = urls;

    var PUSH_CHARS = '-0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ_abcdefghijklmnopqrstuvwxyz';
    var lastPushTime = 0;
    var lastRandChars = [];
    const [newId, setNewId] = useState(null);
    const newIdRef = useRef();
    newIdRef.current = newId;

    const [wrongPrice, setWrongPrice] = useState(false);
    const [wrongSize, setWrongSize] = useState(false);

    const generateId = () => {       
        var now = new Date().getTime();
        var duplicateTime = (now === lastPushTime);
        lastPushTime = now;
    
        var timeStampChars = new Array(8);
        for (var i = 7; i >= 0; i--) {
            timeStampChars[i] = PUSH_CHARS.charAt(now % 64);
            now = Math.floor(now / 64);
        }
        if (now !== 0) throw new Error('We should have converted the entire timestamp.');

        let id = timeStampChars.join('');

        if (!duplicateTime) {
            for (i = 0; i < 12; i++) {
                lastRandChars[i] = Math.floor(Math.random() * 64);
            }
        }
        else {
            for (i = 11; i >= 0 && lastRandChars[i] === 63; i--) {
                lastRandChars[i] = 0;
            }
            lastRandChars[i]++;
        }
        for (i = 0; i < 12; i++) {
            id += PUSH_CHARS.charAt(lastRandChars[i]);
        }
        if(id.length != 20) throw new Error('Length should be 20.');

        setNewId(id);
    };

    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        if (!result.cancelled) {
            setImage1(result.uri);
            setShowImage1(true);
        }
    };

    const checkValidity = () => {
        if(isNaN(price)) {
            setWrongPrice(true);
        }
        else {
            setWrongPrice(false);
        }
        if(isNaN(size)) {
            setWrongSize(true);
        }
        else {
            setWrongSize(false);
        }
    }

    const savePost = async () => {
        if(wrongPrice == false && wrongSize == false) {

            setUploading(true);

            generateId();
            await uploadImageAsPromise(image1);

            db.collection('posts')
            .doc(auth.currentUser.uid)
            .collection('userPosts')
            .doc(newIdRef.current)
            .set({
                title: title,
                price: Number(price),
                type: roomType,
                size: Number(size),
                description: description,
                address: address,
                preference: preference,
                location: area,
                wifi: wifi,
                aircon: aircon,
                gym: gym,
                bathroom: bathroom,
                pool: pool,
                postUrl: urlsRef.current,
                userId: auth.currentUser.uid,
                postUid: newIdRef.current
            })
            .then(() => {
                setUploading(false);
                Alert.alert('Your Post has been created successfully!');
                navigationTo.navigate('Home');
            });
        }
        else {
            Alert.alert('Please fill in your information with correct format!');
        }
    };

    async function uploadImageAsPromise (imageFile) {
        return new Promise (async function (resolve, reject) {
            const response = await fetch(imageFile);
            const blob = await response.blob();
            const task = storage.ref().child(`post/${auth.currentUser.uid}/${Math.random().toString(20)}`).put(blob);

            task.on('state_changed',
                function progress(snapshot) {
                    var percentage = snapshot.bytesTransferred / snapshot.totalBytes * 100;
                },
                function error(err) {
                    console.log(err);
                },
                function complete() {
                    task.snapshot.ref.getDownloadURL().then((snapshot) => {
                        setUrls(prev => [...prev, snapshot]);
                        resolve(snapshot);
                    })
                }
            );
        });
    };

    return (
        <ScrollView contentContainerStyle={{paddingVertical: 50}} style={styles.container}>
            <StatusBar style="light" />
            <View style={styles.titleContainer}>
                <Text style={styles.header}>Create a New Post</Text>
            </View>
            <Text style={styles.title}>Title</Text>
            <TextInput
                style={styles.inputTitle}
                label="title"
                value={title}
                multiline={true}
                onChangeText={(text) => {
                    setTitle(text);
                }}
            />
            <Text style={styles.textPrice}>Price (RM)</Text>
            <TextInput
                style={styles.price}
                label="price"
                value={price}
                keyboardType="numeric"
                onChangeText={(inputPrice) => {
                    setPrice(inputPrice);
                }}
            />
            {wrongPrice ? (
                <Text style={{color: 'red', fontSize: 11, marginLeft: 50, marginTop: '0.5%'}}>* Format of price is incorrect</Text>
                ) : null}

            <Text style={styles.title}>Room Type</Text>
            <Picker
                style={styles.type}
                selectedValue={roomType}
                mode="dropdown"
                onValueChange={(itemValue, itemIndex) => {
                    setRoomType(itemValue);
                }}>
                <Picker.Item label="Single Room" value="Single Room" />
                <Picker.Item label="Middle Room" value="Middle Room" />
                <Picker.Item label="Master Room" value="Master Room" />
                <Picker.Item label="Studio" value="Studio" />
            </Picker>

            <Text style={styles.textPrice}>Room Size (sq.ft)</Text>
            <TextInput
                style={styles.price}
                label="size"
                value={size}
                keyboardType="numeric"
                onChangeText={(inputSize) => {
                    setSize(inputSize);
                }}
            />
            {wrongSize ? (
                <Text style={{color: 'red', fontSize: 11, marginLeft: 50, marginTop: '0.5%'}}>* Format of room size is incorrect</Text>
                ) : null}
            
            <Text style={styles.title}>Description</Text>
            <TextInput
                style={styles.inputTitle}
                label="description"
                multiline={true}
                value={description}
                onChangeText={(inputDescription) => {
                    setDescription(inputDescription);
                }}
            />
            <Text style={styles.title}>Address</Text>
            <TextInput
                style={styles.inputTitle}
                label="location"
                value={address}
                onChangeText={(inputAddress) => {
                    setAddress(inputAddress);
                }}
            />

            <Text style={styles.title}>Preference</Text>
            <Picker
                style={styles.preferenceSize}
                selectedValue={preference}
                mode="dropdown"
                onValueChange={(itemValue, itemIndex) => {
                    setPreference(itemValue);
                }}>
                <Picker.Item label="Male" value="Male" />
                <Picker.Item label="Female" value="Female" />
                <Picker.Item label="Male or Female" value="Male or Female" />
            </Picker>

            <Text style={styles.title}>Area/State</Text>
            <Picker
                style={styles.type}
                selectedValue={area}
                mode="dropdown"
                onValueChange={(itemValue, itemIndex) => {
                    setArea(itemValue);
                }}>
                <Picker.Item label="Johor" value="Johor" />
                <Picker.Item label="Kedah" value="Kedah" />
                <Picker.Item label="Kelantan" value="Kelantan" />
                <Picker.Item label="Malacca" value="Malacca" />
                <Picker.Item label="Negeri Sembilan" value="Negeri Sembilan" />
                <Picker.Item label="Pahang" value="Pahang" />
                <Picker.Item label="Penang" value="Penang" />
                <Picker.Item label="Perak" value="Perak" />
                <Picker.Item label="Perlis" value="Perlis" />
                <Picker.Item label="Sabah" value="Sabah" />
                <Picker.Item label="Sarawak" value="Sarawak" />
                <Picker.Item label="Selangor" value="Selangor" />
                <Picker.Item label="Terengganu" value="Terengganu" />
                <Picker.Item label="Kuala Lumpur" value="Kuala Lumpur" />
                <Picker.Item label="Labuan" value="Labuan" />
                <Picker.Item label="Putrajaya" value="Putrajaya" />
            </Picker>
            
            <Text style={styles.title}>Facilities</Text>
            <View>
                <View style={styles.checkboxContainer}>
                    <CheckBox
                        value={wifi}
                        onValueChange={(val) => setWifi(val)}
                        style={styles.checkbox}
                    />
                    <Fontisto style={styles.icons} name="wifi" size={13} />
                    <Text style={styles.label}>Wifi</Text>
                    <CheckBox
                        value={aircon}
                        onValueChange={(val) => setAirCon(val)}
                        style={{marginLeft: '14%', marginTop: 10}}
                    />
                    <MaterialCommunityIcons style={styles.icons} name="air-conditioner" size={16} />
                    <Text style={styles.label}>Air-Conditioning</Text>
                </View>

                <View style={styles.checkboxContainer}>
                    <CheckBox
                        value={gym}
                        onValueChange={(val) => setGym(val)}
                        style={styles.checkbox}
                    />
                    <MaterialIcons style={styles.icons} name="fitness-center" size={16} />
                    <Text style={styles.label}>Gymnasium</Text>
                    <CheckBox
                        value={bathroom}
                        onValueChange={(val) => setBathroom(val)}
                        style={{marginLeft: '2.3%', marginTop: 10}}
                    />
                    <FontAwesome style={styles.icons} name="bath" size={15} />
                    <Text style={styles.label}>Bathroom</Text>
                </View>

                <View style={styles.checkboxContainer}>
                    <CheckBox
                        value={pool}
                        onValueChange={(val) => setPool(val)}
                        style={styles.checkbox}
                    />
                    <MaterialIcons style={styles.icons} name="pool" size={16} />
                    <Text style={styles.label}>Swimming Pool</Text>
                </View>
            </View>

            <Pressable
                style={styles.button}
                onPress={pickImage}>
                <Text style={styles.image}>Uploads Image</Text>
                <View style={styles.pictureContainer}>
                    {showImage1 ? (<Image source={{uri: image1}} style={styles.picture} />) : null}
                </View>
            </Pressable>
    
            <View style={styles.buttonContainer}>
                {uploading ? (
                    <Overlay isVisible={true} overlayStyle={{width:150, alignItems: 'center'}}>
                        <Text>Saving...</Text>
                    </Overlay>
                    ) : null}
                
                <TouchableOpacity
                    style={styles.roundButton}
                    onPress={() => {
                        checkValidity();
                        savePost();
                    }}>
                    <Text style={{fontSize: 18, color: 'white'}}>Submit</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    )
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white'
    },

    titleContainer: {
        alignItems: 'center',
    },

    header: {
        fontWeight: 'bold',
        fontSize: 25,
        marginBottom: 20,
        color: '#E56717',
    },

    title: {
        marginTop: 30,
        marginLeft: 50,
        fontSize: 16,
        color: '#E56717',
    },

    textPrice: {
        marginTop: 30,
        marginLeft: 50,
        fontSize: 16,
        color: '#E56717',
    },

    inputTitle: {
        width: Dimensions.get('window').width - 100,
        marginLeft: 50,
        borderBottomWidth: 0.5,
        paddingRight: 10,
    },

    price: {
        marginLeft: 50,
        borderBottomWidth: 0.5,
        width: 80,
    },

    type: {
        width: 180,
        marginTop: '2%',
        height: 30,
        marginLeft: 43,
    },

    preferenceSize: {
        width: '45%',
        marginTop: '2%',
        height: 30,
        marginLeft: 43,
    },

    checkbox: {
        marginLeft: 43,
        marginTop: 10,
    },

    checkboxContainer: {
        flexDirection: 'row',
    },

    icons: {
        marginTop: 19,
        marginLeft: 5,
    },

    label: {
        marginTop: 15,
        marginLeft: 5,
        fontSize: 15,
    },

    button: {
        marginTop: 30,
        alignItems: 'center',
    },

    image: {
        fontSize: 18,
        color: '#306EFF',
    },

    buttonStyle: {
        backgroundColor: '#3BB9FF',
    },

    textStyle: {
        color: 'white',
    },

    pictureContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 30,
        marginBottom: 30,
    },

    picture: {
        width: 100,
        height: 100,
        marginLeft: 2,
        marginRight: 2,
    },

    buttonContainer: {
        alignItems: 'center',
        justifyContent: 'center',
    },

    roundButton: {
        width: 100,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 10,
        borderRadius: 18,
        backgroundColor: '#2196F3',
    },

});
