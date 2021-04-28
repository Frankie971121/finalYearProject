import React from 'react'
import { View, Modal, Alert, Text, Image, TextInput, StyleSheet, StatusBar, Dimensions, ScrollView, Pressable, Platform, TouchableOpacity } from 'react-native'
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
import * as ImagePicker from 'expo-image-picker'
import { auth, db, storage } from '../utils/FirebaseConfig'
import { useNavigation } from '@react-navigation/native'

export default function EditPost(props) {
    
    const navigation = useNavigation();

    useEffect(() => {
        (async () => {
            if(Platform.OS !== 'web') {
                const {status} = await ImagePicker.requestMediaLibraryPermissionsAsync();
                if(status !== 'granted') {
                    alert('Sorry, we need camera roll permissions to make this work!');
                }
            }
        })();
    }, []);

    const [title, setTitle] = useState(props.route.params.post.title);
    const [price, setPrice] = useState(props.route.params.post.price);
    const [description, setDescription] = useState(props.route.params.post.description);
    const [roomType, setRoomType] = useState(props.route.params.post.type);
    const [area, setArea] = useState(props.route.params.post.location);
    const [address, setAddress] = useState(props.route.params.post.address);
    const [wifi, setWifi] = useState(props.route.params.post.wifi);
    const [aircon, setAirCon] = useState(props.route.params.post.aircon);
    const [gym, setGym] = useState(props.route.params.post.gym);
    const [bathroom, setBathroom] = useState(props.route.params.post.bathroom);
    const [pool, setPool] = useState(props.route.params.post.pool);

    const [modalVisible, setModalVisible] = useState(false);
    const [showImage1, setShowImage1] = useState(false);
    const [showImage2, setShowImage2] = useState(false);
    const [showImage3, setShowImage3] = useState(false);
    const [image1, setImage1] = useState(null);
    const [image2, setImage2] = useState(null);
    const [image3, setImage3] = useState(null);
    const [images, setImages] = useState(props.route.params.post.postUrl);
    const [images1, setImages1] = useState([]);
    const [num, setNum] = useState(0);

    const [uploading, setUploading] = useState(false);
    const [urls, setUrls] = useState(props.route.params.post.postUrl);
    const urlsRef = useRef();
    urlsRef.current = urls;

    const [urls1, setUrls1] = useState([]);
    const urlsRef1 = useRef();
    urlsRef1.current = urls1;
    

    const onDone = (data:Asset[]) => {

        for(var i = 0; i < data.length; i++) {
            const value = data[i].uri;
            setImages1(prev => [...prev, value]);
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

    const savePost = async () => {

        setUploading(true);

        if(images1.length != 0) {
            for (var i = 0; i < num; i++) {
                var imageFile = images1[i];
    
                await uploadImageAsPromise(imageFile);
            }

            db.collection('posts')
                .doc(auth.currentUser.uid)
                .collection('userPosts')
                .doc(props.route.params.post.key)
                .update({
                    title: title,
                    price: price,
                    type: roomType,
                    description: description,
                    address: address,
                    location: area,
                    wifi: wifi,
                    aircon: aircon,
                    gym: gym,
                    bathroom: bathroom,
                    pool: pool,
                    postUrl: urlsRef1.current
                })
                .then(() => {
                    setUploading(false);
                    Alert.alert('Your Post has been updated successfully!');
                    navigation.replace('HomeNavigator');
                });
        }
        else {
            db.collection('posts')
                .doc(auth.currentUser.uid)
                .collection('userPosts')
                .doc(props.route.params.post.key)
                .update({
                    title: title,
                    price: price,
                    type: roomType,
                    description: description,
                    address: address,
                    location: area,
                    wifi: wifi,
                    aircon: aircon,
                    gym: gym,
                    bathroom: bathroom,
                    pool: pool,
                    postUrl: urlsRef.current
                })
                .then(() => {
                    setUploading(false);
                    Alert.alert('Your Post has been updated successfully!');
                    navigation.replace('HomeNavigator');
                });
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
                        setUrls1(prev => [...prev, snapshot]);
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
                <Text style={styles.header}>Edit Post Information</Text>
            </View>
            <Text style={styles.title}>Title</Text>
            <TextInput
                style={styles.inputTitle}
                label="title"
                multiline={true}
                value={title}
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
            
            <Text style={styles.title}>Description</Text>
            <TextInput
                style={styles.inputTitle}
                label="description"
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
                        style={{marginLeft: 50, marginTop: 10}}
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
                        style={{marginLeft: 8, marginTop: 10}}
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
                        <Text>Updating...</Text>
                    </Overlay>
                    ) : null}
                
                <TouchableOpacity
                    style={styles.roundButton}
                    onPress={savePost}>
                    <Text style={{fontSize: 18, color: 'white'}}>Save Update</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    )
};


const styles = StyleSheet.create({
    container: {
        flex: 1,
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
        width: 140,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 10,
        borderRadius: 18,
        backgroundColor: '#2196F3',
    },

});
