import React from 'react'
import { View, Alert, Modal, Text, Image, TextInput, StyleSheet, StatusBar, Dimensions, ScrollView, Pressable, TouchableOpacity } from 'react-native'
import CheckBox from '@react-native-community/checkbox'
import { useState, useEffect, useRef } from 'react'
import { Picker } from '@react-native-picker/picker'
import Fontisto from 'react-native-vector-icons/Fontisto'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import { AssetsSelector } from 'expo-images-picker'
import Ionicons from 'react-native-vector-icons/Ionicons'
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

            setModalVisible(false);
            setShowImage1(false);
            setShowImage2(false);
            setShowImage3(false);
            setImage1(null);
            setImage2(null);
            setImage3(null);
            setImages([]);
            setNum(0);

            setUploading(false);
            setUrls([]);
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

    const [modalVisible, setModalVisible] = useState(false);
    const [showImage1, setShowImage1] = useState(false);
    const [showImage2, setShowImage2] = useState(false);
    const [showImage3, setShowImage3] = useState(false);
    const [image1, setImage1] = useState(null);
    const [image2, setImage2] = useState(null);
    const [image3, setImage3] = useState(null);
    const [images, setImages] = useState([]);
    const [num, setNum] = useState(0);

    const onDone = (data:Asset[]) => {

        for(var i = 0; i < data.length; i++) {
            const value = data[i].uri;
            setImages(prev => [...prev, value]);
        };
        
        if(data.length == 3) {
            setShowImage1(true);
            setImage1(data[0].uri);
            setShowImage2(true);
            setImage2(data[1].uri);
            setShowImage3(true);
            setImage3(data[2].uri);
            setNum(3);
        }
        
        if(data.length == 2) {
            setShowImage1(true);
            setImage1(data[0].uri);
            setShowImage2(true);
            setImage2(data[1].uri);
            setNum(2);
        }

        if(data.length == 1) {
            setShowImage1(true);
            setImage1(data[0].uri);
            setNum(1);
        }
        
        setModalVisible(false);
    }

    const [uploading, setUploading] = useState(false);
    const [urls, setUrls] = useState([]);
    const urlsRef = useRef();
    urlsRef.current = urls;

    const savePost = async () => {

        setUploading(true);

        for (var i = 0; i < num; i++) {
            var imageFile = images[i];

            await uploadImageAsPromise(imageFile);
        }

        db.collection('posts')
        .doc(auth.currentUser.uid)
        .collection('userPosts')
        .add({
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
            userId: auth.currentUser.uid
        })
        .then(() => {
            setUploading(false);
            Alert.alert('Your Post has been created successfully!');
            navigationTo.navigate('Home');
        });
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

            <Modal
                animationType="fade"
                transparent={false}
                visible={modalVisible}
                onRequestClose={() => {setModalVisible(!modalVisible);}}>

                <AssetsSelector
                    options={{
                        assetsType: ['photo'],
                        noAssets: {
                            Component: () => <View></View>,
                        },
                        maxSelections: 5,
                        margin: 2,
                        portraitCols: 4,
                        landscapeCols: 5,
                        widgetWidth: 100,
                        widgetBgColor: 'black',
                        videoIcon: {
                            Component: Ionicons,
                            iconName: 'ios-videocam',
                            color: 'green',
                            size: 22,
                        },
                        selectedIcon: {
                            Component: Ionicons,
                            iconName: 'checkmark-outline',
                            color: 'white',
                            bg: '#4fffc880',
                            size: 26,
                        },
                        defaultTopNavigator: {
                            continueText: 'DONE ',
                            goBackText: 'BACK ',
                            textStyle: styles.textStyle,
                            buttonStyle: styles.buttonStyle,
                            backFunction: () => setModalVisible(!modalVisible),
                            doneFunction: (data) => onDone(data),
                        },                    
                    }}
                />
            </Modal>
            <Pressable
                style={styles.button}
                onPress={() => setModalVisible(true)}>
                <Text style={styles.image}>Uploads Images</Text>
                <View style={styles.pictureContainer}>
                    {showImage1 ? (<Image source={{uri: image1}} style={styles.picture} />) : null}
                    {showImage2 ? (<Image source={{uri: image2}} style={styles.picture} />) : null}
                    {showImage3 ? (<Image source={{uri: image3}} style={styles.picture} />) : null}
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
                    onPress={savePost}>
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
